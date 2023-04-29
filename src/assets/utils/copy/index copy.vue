<script setup lang="ts">
import Mock from "mockjs";
// import dayjs from "dayjs";
// import option from '~/assets/utils/xbar'
import { overall_option } from '~/assets/utils/overallData';
import { single_option } from '~/assets/utils/singleData';
import { error_option } from '~/assets/utils/errorData';
// import { xpie } from '~/assets/utils/xpie'
import { useMainStore } from '~/store/index'


interface show {
  logoShow?: boolean,
  searchShow?: boolean
}
const model_3d = ref()
const mpScrollBoard = ref()
const pinia = useMainStore()
const router = useRouter();
const title = ref('智能生态工厂数字化中心')
const { proxy } = getCurrentInstance() as any;
// const xbarserver = "/api/display/generatorXbar";
const scrollTabServer = 'api/display/getRecently'
const mesPointServer = '/api/measurePoint/getBySubModel'
const mesurePoints = ref([]) as any
const dataFromChild = ref()
const lineOverall = ref();
const lineSingle = ref()
const bar = ref();
const pointsData = ref()
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
const shows = ref<show>({ logoShow: true, searchShow: true })
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
const columns = [
  {
    prop: 'pointNo',
    label: '点位',
    width: 50
  },
  {
    prop: 'z',
    label: 'x',
    width: 50
  },
  {
    prop: 'y',
    label: 'y',
    width: 50
  },
  {
    prop: 'z',
    label: 'z',
    width: 50
  }, {
    prop: 'time',
    label: '时间',
    width: ''
  }
];
const config = reactive({
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
const list = reactive([
  {
    no: "530B_FL_1",
    date: "2022/10/26 00:00",
    x: 4.45,
    y: 1.45,
    z: 2.45,
  },
  {
    no: "530B_FL_2",
    x: 1.45,
    y: 2.45,
    z: 3.45,
    date: "2022/10/26 00:00",
  },
  {
    no: "530B_FL_3",
    date: "2022/10/26 00:00",
    x: 1.45,
    y: 2.45,
    z: 4.45,

  },
  {
    no: "530B_FL_4",
    date: "2022/10/26 00:00",
    x: 2.45,
    y: 3.45,
    z: 1.45,
  },
  {
    no: "530B_FL_5",
    date: "2022/10/26 00:00",
    x: 0.45,
    y: 1.45,
    z: 3.45,
  },
  {
    no: "530B_FL_15",
    date: "2022/10/26 00:00",
    x: 1.45,
    y: 4.45,
    z: 4.45,
  },
  {
    no: "530B_FL_7",
    date: "2022/10/26 00:00",
    x: 4.45,
    y: 2.45,
    z: 3.45,
  },
])

const gotoDetail = (item: any) => {
  router.push({ name: 'details' })
  pinia.clickedPoint = item
}

const mouseoverHandler = (e: any) => {
  console.log(e)
}

const clickHandler = (e: any) => {
  console.log(e)
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
  return [s1,s2,s3];
}

const render = () => {
  const o_dom = proxy.$echart.init(lineOverall.value);
  const s_dom = proxy.$echart.init(lineSingle.value);
  const b_dom = proxy.$echart.init(bar.value);
  proxy.s_dom = s_dom //将echarts 实例 存到全局

  o_dom.setOption(overall_option)
  s_dom.setOption(single_option)
  b_dom.setOption(error_option)
  b_dom.getZr().on('click', (params: any) => {
    model_3d.value.barClicked(params)
  })
}

const getClickedModel = async (e: any) => {
  if (e) {
    const { data } = await proxy.$http.get('/getMeasurePointsByModel', { params: {} });
    // console.log(data)
    dataFromChild.value = data;
  }
}

const initData = async () => {
  const res0 = await proxy.$http.get(mesPointServer, {
    params: {
      subModel: '555A', //  530B?
    },
  });
  if (res0.status == 200) { //  所有测点数据
    res0.data.forEach((e: { pointId: any; }) => {
      mesurePoints.value.push(e.pointId);
    });
  }
  const res1 = await proxy.$http.get(scrollTabServer, {
    params: {
      productPrototypeFeature: encodeURI(mesurePoints.value),
      stationName: 2,
    }
  })
  let temp = [] as any
  res1.data.forEach((e: { productPrototypeFeature: any; txObserDevia: null; tyObserDevia: null; tzObserDevia: null; eventTime: any; }, i: any) => {
    temp.push([
      e.productPrototypeFeature,
      e.txObserDevia === null ? "-" : e.txObserDevia,
      e.tyObserDevia === null ? "-" : e.tyObserDevia,
      e.tzObserDevia === null ? "-" : e.tzObserDevia,
      // e.txObserValue === null ? "-" : e.txObserValue,
      // e.tyObserValue === null ? "-" : e.tyObserValue,
      // e.tzObserValue === null ? "-" : e.tzObserValue,
      e.eventTime,
    ]);
  });
  temp = temp.sort((a: number[], b: number[]) => {
    return a[0] - b[0];
  });
  // config.value = {
  //   header: [
  //     "<span style='font-size:12px'>点位</span>",
  //     "X",
  //     "Y",
  //     "Z",
  //     "时间",
  //   ],
  //   data: temp,
  //   rowNum: 4, //表格行数
  //   waitTime: 3400,
  //   columnWidth: [45, 65, 65, 65],
  //   carousel: "page",
  //   // carousel:'page|single' // 设置一条一条[single]轮播还是一页[page]
  // };
  // return ready.value = true
}

const replaceDom = (str: string) => {
  let domReg = /(?<=(<span[^>]*?>)).*?(?=(<\/span>))/g;
  return str.match(domReg)
}

function addCurrentClass(arr, index, value) {
  const ret = arr.slice(0);
  const first = replaceDom(ret[0][0])
  ret[index] = value;
  return { ret, first };
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
  let tt = config.data.slice(0);
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
  const options = proxy.s_dom.getOption();
  const arr123 = randomSingleData()
  arr123.forEach((s,i) => {
    options.series[i].data = s;
  });
  proxy.s_dom.setOption(options);
}
onMounted(async () => {
  // initData()
  render()  
})


</script>

<template>
  <div class="flex w-full h-full justify-center items-center flex-col">
    <Header :show="shows" :title="title" @getClickedModel="getClickedModel"></Header>
    <div class="content flex flex-col flex-1 w-full min-h-0 bg-[#001637]">
      <div class="top flex flex-row w-full h-[70%]">
        <div class="main flex-1 h-full   ">
          <div class="three3ds w-full h-full relative">
            <Model3d ref="model_3d" class="h-full w-full" @changeMP=""  :dataFromChild="dataFromChild"></Model3d>
          </div>

        </div>
        <div class="right w-1/5 order-1  flex flex-col gap-3 h-full relative">
          <div class="pie h-[35%] w-full flex flex-col relative ">
            <div class="barTitle w-[45%] p-3 font-black italic  text-white text-sm">测点误差统计图</div>
            <div ref="bar" class="bar h-full">

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
                        class=" font-semibold setTextColor">{{ item.no }}</span></span>
                    <span class="h-full w-full flex justify-center items-center text-center text-blue-500">{{
                      item.x
                    }}</span>
                    <span class="h-full w-full flex justify-center items-center text-center text-yellow-500">{{
                      item.y
                    }}</span>
                    <span class="h-full w-full flex justify-center items-center text-center text-red-500">{{
                      item.z
                    }}</span>
                    <span
                      class="h-full pr-1.5 w-full flex justify-center items-center text-center text-sm setTextColor">{{
                        item.date
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
          <div ref='lineOverall' class="lineOverall-cont  flex-1 mt-2">

          </div>
        </div>
        <div class="lineSingle relative flex-1 h-full flex flex-col">
          <div class="lineSingle-title w-[15%] font-black italic text-white text-sm ">单点趋势曲线图</div>
          <div class="lineSingle-cont flex-1 mt-2 flex flex-row">
            <div class="lists h-full w-[10%]">
              <dv-scroll-board ref="mpScrollBoard" :config="config" class=" w-full h-full text-center cursor-pointer"
                @mouseover="mouseoverHandler" @click="clickHandler" @getFirstRow="getFirst" />
            </div>
            <div ref="lineSingle" class=" tend flex-1 h-full"></div>
          </div>
        </div>
      </div>



    </div>
    <!-- <Footer></Footer> -->
  </div>
</template>

<style lang="less">
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
