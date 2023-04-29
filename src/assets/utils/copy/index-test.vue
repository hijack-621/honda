<script setup lang="ts">
import { indexDataSource } from '~/types/interface'
import useDraw from "~/assets/utils/useDraw";
import Mock from "mockjs";
import dayjs from "dayjs";
import { overall_option } from '~/assets/utils/overallData';
import { single_option } from '~/assets/utils/singleData';
import { error_option } from '~/assets/utils/errorData';
import { useMainStore } from '~/store/index'
import { isUndefined } from 'lodash';

interface show {
  logoShow?: boolean,
  searchShow?: boolean
}

const defaultNum = ref(25)
const preStation = ref('MB02')
const preModel = ref('555A')
const ws = ref<WebSocket>()
const ref_overall_option = ref(overall_option)
const ref_single_option = ref(single_option)
const ref_error_option = ref(error_option)
const model3dPropInfoData = ref<{ key: string, val: string }[]>([]);
const loading = ref<boolean>(true);
const { appRef, calcRate, windowDraw } = useDraw();
const model_3d = ref()
const mpScrollBoard = ref()
const pinia = useMainStore()
const router = useRouter();
const title = ref('智能生态工厂数字化中心')
const { proxy } = getCurrentInstance() as any;
const dataFromChild = ref()
const lineOverall = ref();
const lineSingle = ref()
const bar = ref();
const pointsData = ref()
const shows = ref<show>({ logoShow: true, searchShow: true })

model3dPropInfoData.value = [
  { key: "时间", val: "" },
  { key: "工件号(VIN)", val: " " },
  { key: "型号", val: "" },
  { key: "检测组", val: "" },
  { key: "合格率", val: "" }
];
const headers = ['点位', 'X', 'Y', 'Z', '时间'];
const dta = [
  {
    point: '5301FL_1',
    x: '',
    y: '',
    z: '',
    time: ''
  }
]
pointsData.value = [
  {
    pointNo: '5301FL_1',
    time: '2022/12/11 15:10',
    x: 0.24,
    y: 0.15,
    z: 0.88,
  },
  {
    pointNo: '5301FL_1',
    time: '2022/12/12 15:10',
    x: 0.24,
    y: 0.15,
    z: 0.88,
  },
  {
    pointNo: '5301FL_2',
    time: '2022/12/13 15:10',
    x: 0.24,
    y: 0.15,
    z: 0.88,
  },
  {
    pointNo: '5301FL_3',
    time: '2022/12/11 15:10',
    x: 0.24,
    y: 0.15,
    z: 0.88,
  },
  {
    pointNo: '5301FL_5',
    time: '2022/12/12 15:10',
    x: 0.24,
    y: 0.15,
    z: 0.88,
  },
  {
    pointNo: '5301FL_6',
    time: '2022/12/13 15:10',
    x: 0.24,
    y: 0.15,
    z: 0.88,
  },

]
const config = ref({
  header: ['测点'],
  data: [
    ['<span class="dvCurrent">5301FL_1</span>'],
    ['5301FL_2'],
    ['5301FL_3',],
    ['5301FL_4',],
    ['5301FL_5'],
    ['5301FL_6',],
    ['5301FL_7'],
    ['5301FL_8'],
    ['5301FL_9'],
    ['5301FL_10'],
  ],
  index: false,
  columnWidth: [50],
  align: ['center'],
  carousel: 'single',
  headerBGC: '#172030',
  oddRowBGC: '#172030',
  evenRowBGC: '#172030',

  waitTime: 5000
});
let list = ref<any[]>([])
const gotoDetail = (item: any) => {
  router.push({ name: 'details' })
  pinia.clickedPoint = item,
    pinia.zoneInfo = model3dPropInfoData.value
}
const mouseoverHandler = (e: any) => {
  // console.log(e)
}

const clickHandler = (e: any) => {
  // console.log(e)
  //@mouseover="mouseoverHandler" @click="clickHandler"
}

function randomSingleData() {
  let s1 = [];
  let s2 = [];
  let s3 = [];
  for (let i = 0; i < 15; i++) {
    s1.push(Mock.Random.float(-0.3, 0.2, 1, 2));
    s2.push(Mock.Random.float(-0.5, 0.5, 1, 2));
    s3.push(Mock.Random.float(-0.8, 0.3, 1, 2));
  }
  return [s1, s2, s3];
}

const chartRender = () => {
  // console.log(lineOverall.value);
  const o_dom = proxy.$echart.init(lineOverall.value);
  const s_dom = proxy.$echart.init(lineSingle.value);
  const b_dom = proxy.$echart.init(bar.value);

  proxy.o_dom = o_dom //将echarts 实例 存到全局
  proxy.s_dom = s_dom //将echarts 实例 存到全局
  proxy.b_dom = b_dom //将echarts 实例 存到全局

  o_dom.setOption(overall_option)
  s_dom.setOption(single_option)
  b_dom.setOption(error_option)
  b_dom.getZr().on('click', (param: any) => {
    const pointInPixel = [param.offsetX, param.offsetY]
    // console.log('pointInPixel', pointInPixel)
    // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引         值，借助于索引值的获取到其它的信息

    // 转换X轴坐标
    let pointInGrid = b_dom.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
    // seriesIndex 这里是option中的 series:[{},{}]中的 索引！！！

    // 所点击点的X轴坐标点所在X轴data的下标
    let xIndex = pointInGrid[0];
    // 所点击点的Y轴坐标点数值

    // 使用getOption() 获取图表的option
    let op = b_dom.getOption();
    //获取到x轴的索引值和option之后，我们就可以获取我们需要的任意数据。
    // 点击点的X轴对应坐标的名称
    var xVal = op.xAxis[0].data[xIndex];
    //  获取到的 x轴的data
    var temp = {
      value: 0,
      itemStyle: {
        color: new proxy.$echart.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00a5fe' },
          { offset: 0.5, color: '#0191D1' },
          { offset: 1, color: '#043857' }
        ])
      },
    };
    const initColor = new proxy.$echart.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#416c25' },
      { offset: 0.5, color: '#416c25' },
      { offset: 1, color: '#416c25' }
    ])
    // 首先格式化bar 颜色
    op.series[0].data = op.series[0].data.map((v, i) => {
      if (i < op.series[0].data.length - 1) {
        if (typeof v == 'object') {
          return v = v.value;
        } else {
          return v
        }
      } else {
        // 最后一项颜色初始initcolor
        v.itemStyle.color = initColor;
        return v
      }
    })
    // 点击点的series -- data对应的值
    // console.log(op.series[0].data);

    var yData = op.series[0].data[xIndex];

    temp.value = typeof yData == 'object' ? yData.value : yData
    op.series[0].data[xIndex] = temp;
    b_dom.setOption(op)
    // console.log('val', xVal, yData)
    model_3d.value.barClicked(param, xVal, yData)
  })
}

const getClickedModel = async (e: any) => {
  if (e) {
    const { data } = await proxy.$http.get('/getMeasurePointsByModel', { params: {} });
    // console.log(data)
    dataFromChild.value = data;
  }
}

async function single_res(pointName = 12) {
  const server = 'api/display/searchByParams';
  const xz = [];
  const x = [], y = [], z = [];
  let params = {
    asc: false,
    stationName: preStation.value,
    productPrototypeFeature: pointName,
    productPrototypeSubModel: preModel.value,
    count: 200
  }
  const { data: data } = await proxy.$http.post(
    server,
    params,
    {
      headers: {
        token: localStorage.getItem('token')
      }
    })
  if (data) {
    data.forEach((v) => {
      xz.push(v.eventTime);
      x.push(v.txObserDevia)
      y.push(v.tyObserDevia)
      z.push(v.tzObserDevia)
    })
  }
  return {
    axisX: xz,
    xyz: [x, y, z]
  }
}
async function overall_res(pointName = 12) {
  const server = "api/display/getPassRate";
  const { status, data } = await proxy.$http.get(server, {
    params: {
      productPrototypeSubModel: preModel.value,
      stationName: preStation.value,
      count: defaultNum.value
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
  if (status == 200) {
    return data
  }
}

async function setSingle(p = 12) {
  const sd = await single_res(p)
  ref_single_option.value.xAxis.data = sd.axisX
  ref_single_option.value.series.forEach((v, i) => {
    ref_single_option.value.series[i].data = sd.xyz[i]
  })
  if (proxy.s_dom) {
    proxy.s_dom.setOption(ref_single_option.value)
  }
}
async function setOverall(p = 12) {
  const bo = await overall_res();
  let x_models: string[] = [];
  let y_passRates: number[] = [];
  bo.forEach(b => {
    const kv = Object.entries(b)
    x_models.push(kv[0][0]);
    y_passRates.push(kv[0][1] as number);
  })
  ref_overall_option.value.xAxis.data = x_models;
  ref_overall_option.value.series[0].data = y_passRates
  if (proxy.o_dom) {
    proxy.o_dom.setOption(ref_overall_option.value)
  }

}


const initData = async (rec?) => {
  if (isUndefined(rec)) {
    const indexDataApi = '/api/display/getStationDetails' // 首页
    const stationName = preStation.value
    const modelName = preModel.value
    model3dPropInfoData.value[2].val = modelName
    model3dPropInfoData.value[3].val = stationName
    const res0: indexDataSource = await proxy.$http.get(indexDataApi, {
      params: {
        productPrototypeSubModel: modelName,
        stationName: stationName,
      },
      headers: {
        token: localStorage.getItem('token')
      }
    });
    if (res0.status == 200) {
      setSingle()
      setOverall()
      list.value = res0.data.dataList;
      const tmp2: string[][] = [];
      list.value.forEach((v, i) => {
        if (i == 0) {
          tmp2.push([`<span class="dvCurrent">${v.productPrototypeFeature}</span>`])
        }
        else {
          tmp2.push([`${v.productPrototypeFeature}`])
        }
        v.eventTime = dayjs(v.eventTime).format('YYYY/MM/DD HH:mm:s')
      })
      config.value.data = tmp2;
      res0.data.time = '2022/12/13 18:30:00'
      const errData: number[] = [];
      errData.push(res0.data.perfectCount, res0.data.wellCount,
        res0.data.warnCount, res0.data.errorCount)
      model3dPropInfoData.value[0].val = res0.data.time;
      model3dPropInfoData.value[4].val = res0.data.passRate.toString();
      const t = ref_error_option.value.series[0].data.map((v, i) => {
        if (typeof v == 'object') {
          v.value = errData[i];
          return v
        } else {
          v = errData[i];
          return v
        }
      })
      ref_error_option.value.series[0].data = t;
    }
  } else {

  }

}

const replaceDom = (str: string) => {
  let domReg = /(?<=(<span[^>]*?>)).*?(?=(<\/span>))/g;
  if (str.match(domReg)) {
    return str.match(domReg)
  } else {
    return str
  }

}

function initClass(tt) {
  tt.forEach((v, i) => { // 全部清空class
    if (toRaw(v)[0].includes('span')) {
      const t = replaceDom(tt[i][0])
      tt[i] = toReactive([`${t}`])
    }
  })
}

function getFirst(row: any) {
  // console.log(row);
  // currentIndex.value ++;
  // console.log(row);// 从 1  开始
  const r = toRaw(row)
  const { ceils, rowIndex } = r;

  let tt = config.value.data.slice(0);
  initClass(tt)
  if (rowIndex == 1) {
    tt[rowIndex] = toReactive([`<span class="dvCurrent">${ceils[0]}</span>`]);
  }
  if (rowIndex + 1 == tt.length) {
    tt[0] = toReactive([`<span class="dvCurrent">${tt[0][0]}</span>`])
  }

  else {
    initClass(tt)
    tt[rowIndex + 1] = toReactive([`<span class="dvCurrent">${tt[rowIndex + 1][0]}</span>`]);
  }
  mpScrollBoard.value.updateRows(tt);
  let p = replaceDom(toRaw(ceils[0]))!;
  typeof p == 'object' ? setSingle(parseInt(p[0])) : setSingle(parseInt(p))

  // 重新请求，传入pointName

}
const cancelLoading = () => {
  setTimeout(() => {
    loading.value = false;
    // chartRender()
  }, 500);
};
function wsReconnect() {

}

function reRenderCharts(rec: { stationName: string, productPrototypeSubModel: string }) {
  preModel.value = rec.productPrototypeSubModel
  preStation.value = rec.stationName
  initData()
}

function sendWs() {
  const wsUrl = `ws://175.30.32.3:7100/api/carChanged/1`;
  ws.value = new WebSocket(wsUrl);
  ws.value.onopen = function () {
    console.log('ws is openning');
  }
  ws.value.onerror = function () {
    console.log('ws link error');
  }
  ws.value.onclose = function () {
    console.log('ws is closed');

  }
  ws.value.onmessage = function (event) {
    const rec: { stationName: string, productPrototypeSubModel: string } = JSON.parse(event.data);
    if (rec) { // 表示 前后车型一样，web3d不变，只改变主页数据
      if (rec.productPrototypeSubModel == preModel.value) {
        reRenderCharts(rec)
      } else {
        model_3d.value.changeModelByWs(rec.productPrototypeSubModel, rec.stationName)
        reRenderCharts(rec)
      }

    }
  }
}
function test10086() {
  setTimeout(() => {
    model_3d.value.changeModelByWs('888B', 'MB02')
    reRenderCharts({ productPrototypeSubModel: '888B', stationName: 'MB02' })
  }, 8500);
}

onMounted(async () => {
  initData()
  cancelLoading()
  calcRate()
  windowDraw()
  setTimeout(() => {
    chartRender();
  }, 1000);
})
nextTick(() => {
  test10086()
  // sendWs()
})

watch(preModel, (cur, pre) => {
  if (model_3d.value) {
    console.log(cur)
    model_3d.value.getCurModel(cur)
  }
})


</script>

<template>
  <div class="flex w-full h-full justify-center items-center flex-col">
    <Header :show="shows" :title="title" @getClickedModel="getClickedModel"></Header>
    <div class="content flex flex-col flex-1 w-full min-h-0 bg-[#001637]">
      <div class="top flex flex-row w-full h-[70%]">
        <div class="main flex-1 h-full   ">
          <div class="three3ds w-full h-full relative">
            <Model3d ref="model_3d" class="h-full w-full" @changeMP="" :model3dPropInfoData="model3dPropInfoData">
            </Model3d>
          </div>

        </div>
        <div class="right w-1/5 order-1  flex flex-col gap-3 h-full relative">
          <div class="pie h-[35%] w-full flex flex-col relative ">
            <div class="barTitle w-[45%] p-3 font-black italic  text-white text-sm">测点误差统计图</div>
            <div v-if="!loading" ref="bar" class="bar h-full">

            </div>
            <!-- <Qpie ref="q_pie" v-if="pieData.length > 0" :option="xpie" :pdata="pieData"></Qpie> -->
          </div>
          <div class="line pr-4 w-full relative flex-1 flex flex-col">
            <div class="pointsTitle w-[55%] p-3 font-black italic  text-white text-sm">白车身3D测量点位一览</div>
            <div ref="points" class="points h-full ">
              <div class="points-headers w-full h-5 flex flex-row justify-evenly items-center">
                <span v-for="(h, i) in headers" :key="i"
                  class=" setTextColor h-full w-full  flex justify-center items-center pr-2.5">{{ h }}</span>
              </div>
              <vue3-seamless-scroll :singleHeight="40" :step="1" :list="list"
                class="scroll p-1.5 w-full h-[95%] max-h-[355px]">
                <ul>
                  <li @click="gotoDetail(item)"
                    class="item relative text-white h-full flex flex-row justify-evenly items-center cursor-pointer"
                    v-for="(item, index)  in list" :key="index">
                    <span class=" text-center h-full w-full flex justify-center items-center"> <span
                        class=" font-semibold setTextColor">{{ item.productPrototypeFeature }}</span></span>
                    <span class="h-full w-full flex justify-center items-center text-center text-blue-500">{{
                      item.txObserDevia
                    }}</span>
                    <span class="h-full w-full flex justify-center items-center text-center text-yellow-500">{{
                      item.tyObserDevia
                    }}</span>
                    <span class="h-full w-full flex justify-center items-center text-center text-red-500">{{
                      item.tzObserDevia
                    }}</span>
                    <span
                      class="h-full pr-1.5 w-full flex justify-center items-center text-center text-sm setTextColor">{{
                        item.eventTime
                      }}</span>
                  </li>
                </ul>
              </vue3-seamless-scroll>


            </div>

          </div>
        </div>
      </div>
      <div class="bottom flex-1 px-5    flex flex-row justify-end items-center gap-6">
        <div class="lineOverall relative w-1/2 h-full flex flex-col">
          <div class="lineOverall-title w-[20%] font-black italic  text-white text-sm">车身尺寸整体合格率曲线</div>
          <div v-if="!loading" ref="lineOverall" class="lineOverall-cont  flex-1 mt-2">

          </div>
        </div>
        <div class="lineSingle relative flex-1 h-full flex flex-col">
          <div class="lineSingle-title w-[15%] font-black italic text-white text-sm ">单点趋势曲线图</div>
          <div class="lineSingle-cont flex-1 mt-2 flex flex-row">
            <div class="lists h-full w-[10%] overflow-hidden">
              <dv-scroll-board ref="mpScrollBoard" :config="config"
                class="overflow-hidden w-full h-full text-center cursor-pointer" @getFirstRow="getFirst" />
            </div>
            <div v-if="!loading" ref="lineSingle" class=" tend flex-1 h-full"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- <Footer></Footer> -->
  </div>

</template>

<style lang="scss" >
@import "~/assets/scss/index.scss";

.dvCurrent {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 0%;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: radial-gradient(#0275b8, #0385d1, #172030) border-box !important;
}

.el-message-box {
  .el-message-box__btns {
    .el-button span {
      color: #000000 !important;
    }

  }
}

.tag {
  background: rgba(38, 20, 16, .99);
  border: 1px solid #f72307;
  color: #ffffff;
  width: 25px;
  height: 25px;
  font-size: 14px;
  line-height: 25px;
  text-align: center;
  border-radius: 3px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.myDiv {
  display: flex !important;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    &>.tag {
      height: 100% !important;
    }

    height: 50px !important;

    &>.tag>span {
      display: inline-block !important;
    }
  }
}


.item:hover {
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /* 背景渐变(高光效果) */
    background: linear-gradient(226deg,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 60%);
    /* 默认上移出可视范围 */
    transform: translateX(-100%);
    /* 设置过渡 */
    transition: transform 0.85s cubic-bezier(0.165, 0.84, 0.44, 1);
    animation: Hlight 4s cubic-bezier(0.165, 0.84, 0.44, 1) infinite backwards;
  }
}

@keyframes Hlight {
  50% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.setTextColor {
  color: rgba(255, 255, 255, 0.5)
}

.bar {
  background-image: url(../assets/images/u843.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.points {
  background-image: url(../assets/images/u809.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;

}

.barTitle,
.pointsTitle {
  &::before {
    content: '';
    position: absolute;
    top: 21px;
    left: 0px;
    width: 8px;
    height: 8px;
    background: rgba(242, 242, 242, 1);
    // border: 1px solid #52c8f6;
    // transform: skew(-45deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 18px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: rgba(242, 242, 242, .6);
  }
}

.dv-scroll-board {
  .header {
    justify-content: center;
    border-bottom: 1px solid #475165;
  }

  .rows {
    width: 100% !important;

    .row-item {
      width: 100% !important;
      justify-content: center;
      border-bottom: 1px solid #475165;

      .ceil {
        width: 100% !important;
        height: 100% !important;
        color: #858890 !important;
      }
    }
  }
}

.lineOverall-cont,
.lineSingle-cont {
  background-image: url(../assets/images/u843.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.lineOverall-title,
.lineSingle-title {
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0px;
    width: 8px;
    height: 8px;
    background: rgba(242, 242, 242, 1);
    // border: 1px solid #52c8f6;
    // transform: skew(-45deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: rgba(242, 242, 242, .6);
  }
}

.three3d {
  // background-image: url(/image/light.png);
  // background-position: right center;
  // background-repeat: no-repeat;
}

.three3ds {
  background: radial-gradient(closest-side, #064981, #001637);
}

.scroll {
  height: 270px;
  width: 450px;
  overflow: hidden;
}

.scroll .item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 0;

  &:nth-child(even) {
    background: linear-gradient(to right,
        rgba(27, 53, 102, .9), rgba(7, 13, 21, .0));
  }

  span {
    min-width: 16%;
  }

  &>span:last-of-type {
    span {
      width: 22%;
    }
  }
}
</style>
