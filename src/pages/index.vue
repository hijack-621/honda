<script setup lang="ts">
import { indexDataSource, searchByParams, tableHeader } from '~/types/interface'
import useDraw from "~/assets/utils/useDraw";
import dayjs from "dayjs";
import { overall_option } from '~/assets/utils/overallData';
import { single_option } from '~/assets/utils/singleData';
import { useMainStore } from '~/store/index'
import { isNull, isUndefined } from 'lodash';
import { apiGet } from '~/assets/utils/apiSet';
import { ElMessage } from 'element-plus'
import week from '/public/image/week.svg'
import month from '/public/image/month.svg'
import day from '/public/image/day.svg'

enum colors {
  perfect = 'well',
  well = 'good',
  warn = 'bad',
  error = 'danger',
}

interface show {
  logoShow?: boolean,
  searchShow?: boolean
}
let curBodyNumber = ref()
let currentPage = ref(1)
let pageSize = ref(50)
let gridData = ref<any>([])
let dialogTableVisible = ref(false)
let dialogTitle = ref()
let dialogTableColumns = ref([
  { prop: 'type', label: '型号' },
  { prop: 'cType', label: '子类型' },
  { prop: 'date', label: '时间', width: 210 },
  { prop: 'GW', label: '工位', },
  { prop: 'DD', label: 'DD', },
  { prop: 'VIN', label: '车身号' },
  { prop: 'mpName', label: '点位名', width: 210 },
  { prop: 'X', label: 'X' },
  { prop: 'Y', label: 'Y' },
  { prop: 'Z', label: 'Z' },
  { prop: 'DX', label: 'DX' },
  { prop: 'DY', label: 'DY' },
  { prop: 'DZ', label: 'DZ' },
])
let warnList = ref<tableHeader[]>([])
let errorList = ref<tableHeader[]>([])
let dateTime = ref()
let headerRef = ref()
let popSelected = ref<string[] | null>(null)
let popOptions = ref<Array<{ value: string | number, label: string }>>([])
const defaultNum = ref(20) // passrate 默认 20个点
const preStation = ref('GW')
const preModel = ref('BRE')
const ws = ref<WebSocket>()
const ref_overall_option = ref(overall_option)
const ref_single_option = ref(single_option)
const model3dPropInfoData = ref<{ key: string, val: string, color?: string }[]>([]);
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
let warnCount = ref()
let errorCount = ref()
const descArr = ref([
  {
    label: '警戒',
    labelAlign: 'center',
    align: 'center',
    labelClassName: 'descLabel',
    className: 'descContentWarn',
    val: warnCount.value,


  },
  {
    label: '超差',
    labelAlign: 'center',
    align: 'center',
    labelClassName: 'descLabel',
    className: 'descContentError',
    val: errorCount.value,

  }
]);

const shows = ref<show>({ logoShow: true, searchShow: true })
model3dPropInfoData.value = [
  { key: "时间", val: "" },
  { key: "车身号", val: " " },
  { key: "车型", val: "" },
  { key: "工位", val: "" },
  { key: "合格率", val: "" },
  { key: "托盘号", val: "1号" }
];
let list = ref<any[]>([])
const headers = ['点位名', 'X', 'Y', 'Z', '时间'];
const config = ref({
  data: [
    ['<span class="dvCurrent">BRE_FL_1</span>'],
  ],
  index: false,
  columnWidth: [50],
  align: ['center'],
  carousel: 'single',
  headerBGC: '#172030',
  oddRowBGC: '#172030',
  evenRowBGC: '#172030',
  waitTime: 6000
});
const gotoDetail = (item: any) => {
  router.push({ name: 'details', query: { id: item.productPrototypeFeature, pointName: item.pointName, stationName: preStation.value } })
  pinia.clickedPoint = item,
    pinia.zoneInfo = model3dPropInfoData.value
}
const chartRender = () => {
  const o_dom = proxy.$echart.init(lineOverall.value);
  const s_dom = proxy.$echart.init(lineSingle.value);
  proxy.o_dom = o_dom //将echarts 实例 存到全局
  proxy.s_dom = s_dom //将echarts 实例 存到全局
  o_dom.setOption(overall_option)
  s_dom.setOption(single_option)
  o_dom.getZr().on('click', () => {
    let r2 = router.resolve({
      path: '/chartDetail',
      query: {}
    })
    window.open(r2.href, "_blank")
  })
}
const getClickedModel = async (e: any) => {
  if (e) {
    const { data } = await proxy.$http.get('/getMeasurePointsByModel', { params: {} });
    // console.log(data)
    dataFromChild.value = data;
  }
}
function initPopOptions(data: any) {
  popOptions.value = [];
  let MPs = data.dataList as Array<searchByParams>
  if (MPs) {
    MPs.forEach(v => {
      let o = {
        value: v.pointName,
        label: v.pointName
      }
      popOptions.value.push(o)
    })
  }

}
async function single_res(pointName = 'BRE_FL_1') { // BRE 默认20号点位
  const server = 'api/display/searchByParams';
  const xz: any[] = [];
  const x: any[] = [], y: any[] = [], z: any[] = [];
  let ox: any[] = [], oy: any[] = [], oz: any[] = [];
  let sx: any[] = [], sy: any[] = [], sz: any[] = [];
  let params = {
    asc: false,
    stationName: preStation.value,
    pointName: pointName,
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
  if (data.length > 0) {
    data.forEach((v: { txStatus: string, tyStatus: string, tzStatus: string, eventTime: any; txObserDevia: any; tyObserDevia: any; tzObserDevia: any, txObserValue: string | number, tyObserValue: string | number, tzObserValue: string | number }) => {
      xz.push(v.eventTime);
      x.push(v.txObserDevia)
      y.push(v.tyObserDevia)
      z.push(v.tzObserDevia)
      ox.push(v.txObserValue)
      oy.push(v.tyObserValue)
      oz.push(v.tzObserValue)
      sx.push(v.txStatus)
      sy.push(v.tyStatus)
      sz.push(v.tzStatus)
    })
    return {
      axisX: xz,
      xyz: [x, y, z],
      oxyz: [ox, oy, oz],
      sxyz: [sx, sy, sz]
    }
  } else {
    return {
      axisX: [],
      xyz: [],
      oxyz: [],
      sxyz: []
    }
  }

}
async function overall_res(pointName = 19) {
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
async function setSingle(p: any,) {
  if (isUndefined(p)) {
    let cd = config.value.data.filter(v => {
      return v[0].includes('dvCurrent')
    })[0]
    let pointName = replaceDom(cd[0])!
    if (pointName.includes(`${preModel.value}_`)) {
      p = replaceDom(config.value.data[0][0])![0]!
    } else {
      p = `${preModel.value}_${pointName}`
    }
  }
  const sd = await single_res(p)
  ref_single_option.value.xAxis.data = sd.axisX
  if (sd.axisX.length < 10) {
    ref_single_option.value.dataZoom[0].start = 0;
    ref_single_option.value.dataZoom[0].end = 100;
  }
  else if (sd.axisX.length < 20 && sd.axisX.length > 10) {
    ref_single_option.value.dataZoom[0].start = 20;
    ref_single_option.value.dataZoom[0].end = 100;
  }

  else if (sd.axisX.length < 50 && sd.axisX.length > 20) {
    ref_single_option.value.dataZoom[0].start = 60;
    ref_single_option.value.dataZoom[0].end = 100;
  }
  else if (sd.axisX.length < 100 && sd.axisX.length > 50) {
    ref_single_option.value.dataZoom[0].start = 90;
    ref_single_option.value.dataZoom[0].end = 100;
  }
  else if (sd.axisX.length > 100) {
    ref_single_option.value.dataZoom[0].start = 95;
    ref_single_option.value.dataZoom[0].end = 100;
  }
  if (sd.xyz.length > 0) {
    config.value.waitTime = 6000
    ref_single_option.value.series.forEach((v, i) => {
      ref_single_option.value.graphic.style.fontSize = '0';
      ref_single_option.value.series[i].data = sd.xyz[i]
      ref_single_option.value.series[i].customInfo.obV = sd.oxyz[i]
      ref_single_option.value.series[i].customInfo.statusX = []
      ref_single_option.value.series[i].customInfo.statusY = []
      ref_single_option.value.series[i].customInfo.statusZ = []
      ref_single_option.value.series[i].customInfo.statusX = sd.sxyz[i]
      ref_single_option.value.series[i].customInfo.statusY = sd.sxyz[i]
      ref_single_option.value.series[i].customInfo.statusZ = sd.sxyz[i]
    })
  } else {
    // 没有数据，不滚动
    config.value.waitTime = 999999999
    ref_single_option.value.graphic.style.fontSize = '21';
  }

  ref_single_option.value.tooltip.formatter = function (param) {
    let index = param[0].dataIndex
    let x = param[0].name
    let Dx = param[0].data
    let Dy = param[1].data
    let Dz = param[2].data
    let xo = ref_single_option.value.series[0].customInfo.obV[index]
    let yo = ref_single_option.value.series[1].customInfo.obV[index]
    let zo = ref_single_option.value.series[2].customInfo.obV[index]
    let xs = ref_single_option.value.series[0].customInfo.statusX[index]
    let ys = ref_single_option.value.series[0].customInfo.statusY[index]
    let zs = ref_single_option.value.series[0].customInfo.statusZ[index]
    return `
        <div class="myTooltip">
            <div class="icon text-xs cursor-pointer" >
            </div>
          <div class="content">
            <div class="time text-sm">
              Time:${x}
            </div>
            <table class="xyz mt-1">
                <tr>
                  <td>X</td>
                  <td>${xo}</td>
                  <td class=${colors[xs]}>Dx</td>
                  <td class=${colors[xs]}>${Dx}</td>
                </tr>
                <tr>
                  <td>Y</td>
                  <td>${yo}</td>
                  <td class=${colors[ys]}>Dy</td>
                  <td class=${colors[ys]}>${Dy}</td>
                </tr>
                <tr>
                  <td>Z</td>
                  <td>${zo}</td>
                  <td class=${colors[zs]}>Dz</td>
                  <td class=${colors[zs]}>${Dz}</td>
                </tr>
              </table>
            </div>  
          </div>
        `;
  }
  if (proxy.s_dom) {
    proxy.s_dom.setOption(ref_single_option.value)
  }
}
async function setOverall(p = 'BRE_FL_1') {
  const bo = await overall_res();
  let x_models: string[] = [];
  let y_passRates: number[] = [];
  if (bo && bo.length > 0) {
    ref_overall_option.value.graphic.style.fontSize = '0';
    bo.forEach((b: any) => {
      console.log(b.bodyNumber)
      x_models.push(b.bodyNumber);
      y_passRates.push(b.passRate.toFixed(3));
    })
    ref_overall_option.value.xAxis.data = x_models;
    ref_overall_option.value.series[0].data = y_passRates
  } else {
    ref_overall_option.value.xAxis.data = [];
    ref_overall_option.value.series.forEach((v, i) => {
      ref_overall_option.value.series[i].data = [];
    })
    ref_overall_option.value.graphic.style.fontSize = '21';
  }

  if (proxy.o_dom) {
    proxy.o_dom.setOption(ref_overall_option.value)
  }

}
async function changeListBySN(sm: { stationName: string, modelName: string }) {
  const url = '/api/display/getStationDetails';
  const getBySubModel = "/api/measurePoint/getBySubModel"
  preModel.value = sm.modelName
  preStation.value = sm.stationName
  const params = {
    params: {
      productPrototypeSubModel: sm.modelName,
      stationName: sm.stationName,
    },
    headers: {
      token: localStorage.getItem('token')
    }
  }
  const rec: indexDataSource = await proxy.$http.get(url, params);
  initPopOptions(rec.data)
  rec.data.dataList.forEach((v, i) => {
    rec.data.dataList[i].eventTime = dayjs(v.eventTime).format('YYYY/MM/DD HH:mm:s')
  })
  list.value = rec.data.dataList;
  pinia.zoneInfo = model3dPropInfoData.value
  const rec_getBySubModel = await apiGet(proxy, getBySubModel, 'get', {
    params: {
      subModel: preModel.value
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
  resetConfigData(list, rec_getBySubModel)
  setOverall()
}
function resetConfigDataByPopSelect(list, mpids: Array<number | string>) {
  const tmp2: string[][] = [];
  list.value.filter((v, i) => {
    mpids.forEach((mpid: any, ii) => {
      if (mpid == v.pointName && ii == 0) {
        tmp2.push([`<span class="dvCurrent" id=${v.pointName}>${v.pointName.replace(`${preModel.value}_`, '')}</span>`])
      } else if (mpid == v.pointName && ii > 0) {
        tmp2.push([`<span class="" id=${v.pointName}>${v.pointName.replace(`${preModel.value}_`, '')}</span>`])
      }
    })
  })
  config.value.data = tmp2;
}
function resetConfigData(list: any, rec_getBySubModel: any) {
  const tmp2: string[][] = [];
  if (list.value) {
    list.value.forEach((v: { pointName: string, productPrototypeFeature: any; eventTime: string | number | Date | dayjs.Dayjs | null | undefined; }, i: number) => {
      if (i == 0) {
        let temp = rec_getBySubModel.data.filter((item: any) => {
          return item.name == v.pointName
        })
        if (temp.length > 0) {
          tmp2.push([`<span class="dvCurrent" id=${temp[0].name ?? v.pointName}>${(temp[0].name ?? v.pointName).replace(`${preModel.value}_`, '')}</span>`])
          list.value[i].pointName = temp[0].name
        }
      }
      else {
        let temp = rec_getBySubModel.data.filter((item: any) => {
          return item.name == v.pointName
        })
        if (temp.length > 0) {
          tmp2.push([`<span id=${temp[0].name}>${(temp[0].name).replace(`${preModel.value}_`, '')}</span>`])
          list.value[i].pointName = temp[0].name
        }
      }
      v.eventTime = dayjs(v.eventTime).format('YYYY/MM/DD HH:mm:s')
    })
  }
  config.value.data = tmp2;
}
const replaceDom = (str: string) => {
  let domReg = /(?<=(<span[^>]*?>)).*?(?=(<\/span>))/g;
  if (str.match(domReg)) {
    return str.match(domReg)
  } else {
    return str
  }
}
function initClass(tt: any[]) {
  tt.forEach((v: any, i: string | number) => { // 全部清空class
    if (toRaw(v)[0].includes('span')) {
      const t = replaceDom(tt[i][0])
      tt[i] = toReactive([`${t}`])
    }
  })
}
function getFirst(row: any) {
  if (list.value) {
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
    const pp = list.value.filter(v => {
      if (typeof p == 'object') {
        return v.pointName.includes(p[0])
      } else {
        return v.pointName.includes(p)
      } // 通过点位名称得到点位id
    })
    setSingle(toRaw(pp)[0].pointName)
  }

}
function changeScrollBoardView(srow: any) {
  const r = toRaw(srow)
  const { rowIndex } = r;
  let tt = toRaw(config.value.data.slice(0));
  initClass(tt)
  let ceilValue = tt[rowIndex][0]
  tt.some((v, i) => {
    if (i == rowIndex) {
      tt[i] = [`<span class="dvCurrent">${ceilValue}</span>`]
    }
  })
  mpScrollBoard.value.updateRows(tt);
  const pp = list.value.filter(v => {
    return v.pointName.includes(ceilValue)
  })
  setSingle(toRaw(pp)[0].pointName)
}
const cancelLoading = () => {
  setTimeout(() => {
    loading.value = false;
    // chartRender()
  }, 500);
};

async function getCurCar(rec, SN?, changeViewBySN) {
  let __;
  let url = '/api/cache/getCurCarAndStation'
  let params = {}
  let headers = {
    token: localStorage.getItem('token')
  }
  proxy.$http.get(url, { params, headers }).then(async v => {
    if (v.status == 200) {
      let { bodyNumber, productPrototypeSubModel, stationName } = v.data
      if (!changeViewBySN) {
        preModel.value = productPrototypeSubModel
        preStation.value = stationName
        curBodyNumber.value = bodyNumber
      }
      if (isUndefined(rec)) {
        const indexDataApi = '/api/display/getStationDetails' // 首页
        const indexWarnError = '/api/display/getWarnList'
        const getBySubModel = "/api/measurePoint/getBySubModel"
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
          proxy.$http.get(indexWarnError, {
            params: {
              productPrototypeSubModel: modelName,
              stationName: stationName,
              startTime: dayjs(new Date()).format('YYYY-MM-DD 00:00:00'),
              endTime: dayjs(new Date()).format('YYYY-MM-DD 23:59:59')
            },
            headers: {
              token: localStorage.getItem('token')
            }
          }).then(v => {
            if (v.status == 200) {
              warnCount.value = v.data.data.warnCount
              errorCount.value = v.data.data.errorCount
              warnList.value = v.data.data.warnList
              errorList.value = v.data.data.errorList
            } else {
              warnCount.value = 0
              errorCount.value = 0
              warnList.value = []
              errorList.value = []
            }
          }).catch(e => {
            warnCount.value = 0
            errorCount.value = 0
            warnList.value = []
            errorList.value = []
          })
          model3dPropInfoData.value[0].val = res0.data.time! ?? res0.data.dataList[0].eventTime;
          model3dPropInfoData.value[1].val = curBodyNumber.value ?? res0.data.bodyNumber!;
          model3dPropInfoData.value[4].val = ((res0.data.passRate as unknown as number) * 100).toFixed(1) + '%';
          // rec_getBySubModel =》模型上点位列表
          const rec_getBySubModel = await apiGet(proxy, getBySubModel, 'get', {
            params: {
              subModel: preModel.value
            },
            headers: {
              token: localStorage.getItem('token')
            }
          })
          list.value = res0.data.dataList;
          nextTick(() => {
            list.value = res0.data.dataList;
          })
          res0.data.bodyNumber = res0.data.bodyNumber
          if (res0.data.dataList) {
            res0.data.time = res0.data.dataList[0].eventTime
          }
          resetConfigData(list, rec_getBySubModel)
          initPopOptions(res0.data)
          setSingle(__)
          setOverall()
        }
      } else {

      }

    } else {

    }
  }).catch(e => console.log(e))
}

const initData = async (rec?: undefined, SN?: string, changeViewBySN?: boolean) => {
  let __;
  await getCurCar(rec, __, changeViewBySN)

}
function reRenderCharts(rec: { stationName: string, productPrototypeSubModel: string }) {
  preModel.value = rec.productPrototypeSubModel
  preStation.value = rec.stationName
  initData()
}
function sendWs() {
  const wsUrl = `ws://192.168.3.114:7200/api/carChanged?token=${localStorage.getItem('token')}`;
  ws.value = new WebSocket(wsUrl);
  ws.value.onopen = function () {
    console.log('ws is openning');
  }
  ws.value.onerror = function (e) {
    console.log(e)
    console.log('ws link error');
  }
  ws.value.onclose = function () {
    console.log('ws is closed');

  }
  ws.value.onmessage = function (event) {
    let mesaage = JSON.parse(JSON.parse(event.data).body.content)
    const rec: { bodyNumber: string, productPrototypeSubModel: string, stationName: string } = mesaage;
    if (rec) { // 表示 前后车型一样，web3d不变，只改变主页数据
      headerRef.value.callSon(rec.stationName, rec.productPrototypeSubModel)
      if (rec.productPrototypeSubModel == preModel.value) {
        model_3d.value.changeModelByWs(undefined, rec.stationName)
        reRenderCharts(rec)
      } else {
        model_3d.value.changeModelByWs(rec.productPrototypeSubModel, rec.stationName)
        reRenderCharts(rec)
      }

    }
  }
}
// function test10086() {
//   setTimeout(() => {
//     model_3d.value.changeModelByWs('INT4D', 'GW')
//     reRenderCharts({ productPrototypeSubModel: 'INT4D', stationName: 'GW' })
//   }, 11500);
// }

function dwm(startTime: string, endTime: string) {
  let model = preModel.value
  let stationName = preStation.value
  let params = {
    productPrototypeSubModel: model,
    stationName,
    startTime,
    endTime
  }
  let api = '/api/display/getWarnList'
  proxy.$http.get(api, {
    params,
    headers: {
      token: localStorage.getItem('token')
    }
  }).then(v => {
    let { status, data } = v
    if (status == 200) {
      if (data.status == 200) {

        warnCount.value = data.data.warnCount
        errorCount.value = data.data.errorCount
        warnList.value = v.data.data.warnList
        errorList.value = v.data.data.errorList

      } else {
        warnCount.value = 0
        errorCount.value = 0
        warnList.value = []
        errorList.value = []
      }

    }
  }).catch(e => console.log(e))
}

const getPastDate = (days) => {
  const today = new Date();
  const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  const year = pastDate.getFullYear();
  const month = String(pastDate.getMonth() + 1).padStart(2, '0');
  const date = String(pastDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

function clickDay(f = 1) {
  let startTime = dayjs(getPastDate(1)).format('YYYY-MM-DD 00:00:00')
  let endTime = dayjs(new Date()).format('YYYY-MM-DD 00:00:00')
  dwm(startTime, endTime)
}

function clickWeek(f = 7) {
  //本周
  let startTime = dayjs(getPastDate(7)).format('YYYY-MM-DD 00:00:00')
  let endTime = dayjs(new Date()).format('YYYY-MM-DD 23:59:59')
  dwm(startTime, endTime)
}
function clickMonth(f = 30) {
  //本月
  let startTime = dayjs(getPastDate(30)).format('YYYY-MM-DD 00:00:00')
  let endTime = dayjs(new Date()).format('YYYY-MM-DD 23:59:59')
  dwm(startTime, endTime)
}
function askWE(e) {
  let flag = e.every(v => {
    return !isNull(v)
  })
  if (flag) {
    let startTime = dayjs(e[0]).format('YYYY-MM-DD 00:00:00')
    let endTime = dayjs(e[1]).format('YYYY-MM-DD 23:59:59')
    dwm(startTime, endTime)
  }
}

async function getListInToggleStation(stationName: string, model = 'BRE') {
  const url = '/api/display/getStationDetails';
  const rec: indexDataSource = await proxy.$http.get(url, {
    params: {
      productPrototypeSubModel: model,
      stationName: stationName,
    },
    headers: {
      token: localStorage.getItem('token')
    }
  });
  if (rec.status == 200) {
    return rec.data.dataList
  } else {
    ElMessage(`网络请求错误，请检查`);
  }
}

/* web3d.vue 切换工位stationName后试图也切换 */
function changeViewBySN(stationName: string, changeViewBySN?: boolean) {
  preStation.value = stationName
  headerRef.value.callSon(stationName)
  let __;
  initData(__, __, true)
  // 表示是切换工位
}
function handleShowDescArrList(arr) {
  let t: tableHeader[] = []
  if (arr.length > 0) {
    arr.forEach((d: any) => {
      let o: tableHeader = {}
      o.type = d.productPrototypeModel
      o.cType = d.productPrototypeSubModel
      o.GW = d.stationName
      o.DD = d.ddistance
      o.VIN = d.bodyNumber
      o.date = d.eventTime
      o.mpName = `${d.pointName}`
      o.X = d.txObserValue
      o.Y = d.txObserValue
      o.Z = d.tzObserValue
      o.DX = d.txObserDevia
      o.DY = d.tyObserDevia
      o.DZ = d.tzObserDevia
      t.push(o)
    })
    return t
  }
}
function handleCurrentChange(cp: number) {
  currentPage.value = cp
}

function bindDialogEvent() {
  let descContentDoms = document.querySelectorAll('.el-descriptions__content');
  [...descContentDoms].forEach(dd => {
    dd.addEventListener('click', (e: any) => {
      let d = e.target.parentNode.children[0]
      if (d.innerHTML == '警戒') {
        dialogTitle.value = '警戒数据详情'
        gridData.value = handleShowDescArrList(warnList.value)
      } else {
        gridData.value = handleShowDescArrList(errorList.value)
        dialogTitle.value = '超差数据详情'
      }
      dialogTableVisible.value = true
    })
  })
}

onMounted(async () => {
  initData()
  cancelLoading()
  calcRate()
  windowDraw()
  setTimeout(() => {
    chartRender();
    bindDialogEvent()
  }, 800);
  setTimeout(() => {
    sendWs()
  }, 4600);
})
nextTick(() => {
  // test10086()
  // sendWs()
})

watch(popSelected, (cur, pre) => {
  resetConfigDataByPopSelect(list, cur!)
})

// 监听 warnCount 和 errorCount 变化，更新 descArr 中的 val 属性
watch(warnCount, (value) => {
  descArr.value[0].val = value
})

watch(errorCount, (value) => {
  descArr.value[1].val = value
})

// 穿透给后代节点使用
provide('stationName', preStation.value)

// 网页离开
onUnmounted(() => { })
</script>
<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="flex w-full h-full justify-center items-center flex-col">
          <Header ref="headerRef" :show="shows" :title="title" @getClickedModel="getClickedModel"></Header>
          <div class="flex flex-col flex-1 w-full min-h-0 radialGeadient bg-[#001637]">
            <div class="top flex flex-row w-full h-[65%]">
              <div v-show="true" class="model3d-title z-[9]  top-3 left-3">
                <span class="ml-4 font-black italic  text-white text-sm">白车身3D测量点位一览</span>
                <div class="productInfo  flex flex-col justify-around  mt-3">
                  <div class="productInfoItem relative flex flex-row justify-around  items-center w-full"
                    v-for="(v, i) in model3dPropInfoData" :key="i">
                    <div class="pKey w-1/3 text-slate-400 text-xs">{{ v.key }}</div>
                    <div class="pValue mr-auto flex-1 text-sm">
                      <span>{{ v.val }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="main flex-1 h-full pr-2">
                <div class="three3ds w-full h-full relative">
                  <Model3d :ST="preStation" @changeListBySN="changeListBySN" :showInfo="true" ref="model_3d"
                    class="h-full w-full" @changeViewBySN="changeViewBySN" :renderList="getListInToggleStation"
                    :dataOnModel="list" :model3dPropInfoData="model3dPropInfoData">
                  </Model3d>
                </div>
              </div>
              <div class="right w-1/5 order-1  flex flex-col gap-3 h-full relative">
                <div class="pie h-[25%] w-full flex flex-col relative ">
                  <!-- <div class="barTitle w-[45%] p-3 font-black italic  text-white text-sm">点位误差统计图</div> -->
                  <div class="WarnRrrTable">
                    <div class="filterHeader">
                      <div class="filterGroup w-full flex flex-col">
                        <el-button-group class=" mt-2  ml-auto mr-auto flex flex-row">
                          <el-button class=" !h-6 " type="primary" @click="clickDay"> <img class="!w-full !h-full"
                              :src="day" alt="day"> </el-button>
                          <el-button class=" !h-6 " type="primary" @click="clickWeek"> <img class="!w-full !h-full"
                              :src="week" alt="week"> </el-button>
                          <el-button class=" !h-6 " type="primary" @click="clickMonth"> <img class="!w-full !h-full"
                              :src="month" alt="month"> </el-button>
                        </el-button-group>
                        <div class="content  overflow-hidden mt-3 ml-2">
                          <el-date-picker @calendar-change="askWE" v-model="dateTime" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                          </el-date-picker>
                        </div>
                      </div>
                      <el-descriptions class="mt-4" title="" :column="1" border>
                        <el-descriptions-item class=" cursor-pointer" v-for="(da, dai) in descArr" :key="dai"
                          :label="da.label" :label-align="da.labelAlign" :align="da.align"
                          :label-class-name="da.labelClassName" :class-name="da.className">{{ da.val }}
                        </el-descriptions-item>
                      </el-descriptions>
                    </div>
                    <div class="content"></div>
                  </div>
                </div>
                <div class="line pr-4 w-full relative flex-1 flex flex-col">
                  <div class="pointsTitle w-[55%] p-3 font-black italic  text-white text-sm">白车身3D测量点位一览</div>
                  <div ref="points" class="points h-full flex flex-col">
                    <div class="points-headers w-full h-5 mt-1 flex flex-row justify-evenly items-center">
                      <span v-for="(h, i) in headers" :key="i"
                        class=" setTextColor h-full w-full  flex justify-center items-center pr-2.5">{{ h }}</span>
                    </div>
                    <vue3-seamless-scroll hover :singleHeight="40" :step="1" :list="list"
                      class="scroll px-1.5 pt-2.5 w-full h-full flex-1 max-h-[375px]">
                      <ul v-if="list">
                        <li @click="gotoDetail(item)"
                          class="item relative text-white h-full flex flex-row justify-between items-center cursor-pointer"
                          v-for="(item, index)  in list" :key="index">
                          <span
                            class=" text-center text-[13px] text-ellipsis break-words h-full !w-[121%] flex justify-center items-center">
                            <span class=" font-semibold setTextColor">{{ item.pointName || item.productPrototypeFeature
                            }}</span>
                          </span>
                          <span class="h-full w-[98%] flex justify-center items-center text-right text-blue-500">{{
                            item.txObserDevia
                          }}</span>
                          <span class="h-full w-[98%] flex justify-center items-center text-center text-green-500">{{
                            item.tyObserDevia
                          }}</span>
                          <span class="h-full w-[98%] flex justify-center items-center text-center text-[#82ccdd]">{{
                            item.tzObserDevia
                          }}</span>
                          <span
                            class="h-full pr-1.5 w-full flex justify-center items-center text-center !text-[13px] setTextColor">{{
                              item.eventTime
                            }}</span>
                        </li>
                      </ul>
                      <div v-else class="noData">暂查无点位数据</div>
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

                <div class="lineSingle-title w-[15%] font-black italic text-white text-sm mt-1">单点趋势曲线图</div>
                <div class="lineSingle-cont flex-1 mt-2 flex flex-row">
                  <div class="lists h-full w-[10%] overflow-hidden">
                    <div class="lineSingle-set">
                      <div class="dvScrollBoardtitle mt-5">点位名:{{ preModel }}</div>
                      <div class="popSelect absolute !border-none top-11 left-21 z-[898989]">
                        <n-popselect v-model:value="popSelected" multiple scrollable :options="popOptions">
                          <n-button class="bg-[#041226] text-[#ffc000] !border-none font-normal">
                            点位设置 <span class="text-xl font-semibold ml-1.5">></span>
                          </n-button>
                        </n-popselect>
                      </div>
                    </div>
                    <dv-scroll-board ref="mpScrollBoard" @getFirstRow="getFirst" @click="changeScrollBoardView"
                      :config="config" class="overflow-hidden w-full  text-center cursor-pointer h-[285px] mt-3" />
                  </div>
                  <div v-if="!loading" ref="lineSingle" class="lineSingleClass  relative tend flex-1 mt-[35px]">

                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-dialog class=" !z-[999]" width="85%" v-model="dialogTableVisible" :title="dialogTitle">
            <el-table :data="gridData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" height="410" class="">
              <el-table-column align="center" v-for="(d, di) in dialogTableColumns" :prop="d.prop" :label="d.label"
                :width="d.width" :key="di" />
            </el-table>
            <el-pagination background layout="prev, pager, next,jumper, ->, total" :total="gridData.length"
              @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
              style="text-align: center">
            </el-pagination>

          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" >
@import "~/assets/scss/index.scss";

.el-dialog {
  background-color: #37444E !important;

  .el-dialog__header {
    .el-dialog__title {
      color: #eeeeee !important;
    }
  }
}

.el-pagination {
  button {
    background-color: #090B12 !important;
    color: #eeeeee !important;
  }

  .el-pager {
    li {
      background-color: #090B12 !important;
      color: #eeeeee !important;
    }
  }
}

.descLabel {
  cursor: pointer;
  background: linear-gradient(to right, #041733, #09306a) !important;
}

.descContentWarn {
  background: linear-gradient(to right, #041733, #09306a) !important;
  color: #ffc000 !important;
  cursor: pointer;
}

.descContentError {
  background: linear-gradient(to right, #041733, #09306a) !important;
  color: #f60905 !important;
  cursor: pointer;
}

.myDivForHover {
  @apply w-48 bg-[#5B9BD5] z-[99999999] hidden relative;

  .MPWrap {
    @apply w-full flex flex-col text-white justify-center items-center;

    .MPWrap_title {
      @apply w-[55%] text-lg text-center text-red-600;
    }

    .MPWrap_item {
      @apply w-full p-2 text-base flex flex-row justify-center gap-2 text-white;
    }

    .MPWrap_DD {
      @apply w-[55%] text-lg text-center text-white;
    }
  }

  &:hover {
    @apply block
  }
}

.radialGeadient {
  background: radial-gradient(circle at center, #0249b4, #001637);
}

.n-button .n-button__state-border {
  border: none !important;
}

.n-button {
  background-color: transparent !important;
  border: none !important;
}

.n-button .n-button__border {
  border: none !important;
}

.dv-scroll-board .rows .ceil {
  padding: 0 !important;
}

.model3d-title {
  .productInfo {
    width: 240px;
    height: 423px;
    background-image: url(../assets/images/u809.png);

    .productInfoItem {
      border-bottom: none !important;

      .pValue {
        font-family: "Arial Normal", Arial, sans-serif;
      }

      &:not(&:last-of-type)::before {
        content: '';
        position: absolute;
        left: 18px;
        top: auto;
        bottom: -24px;
        right: 18px;
        height: 1px;
        width: calc(100% - 36px);
        background-color: #052E61;
      }

      &::after {
        content: '';
        position: absolute;
      }
    }
  }

  text-align: center;
  padding: 13px 23px;
  color: white;
  perspective: 800px;

  &::before {
    content: '';
    position: absolute;
    top: 21px;
    left: 15px;
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
    left: 18px;
    width: 8px;
    height: 8px;
    background: rgba(242, 242, 242, .6);
  }

  .decoration {
    content: '';
    width: 16px;
    height: 13px;
    position: absolute;
    top: 50%;
    background: rgba(103, 133, 143, 1);
    transform: translateY(-50%) skew(-45deg);
    right: -16%;
  }
}

.setSingleDataBg {
  background-color: rgba(4, 9, 17, .65) !important;
  padding: 0 !important;
  border: none !important;
}

.myTooltip {
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(4, 9, 17, .65);
  color: #ffffff;
  display: flex;
  flex-direction: row;
  opacity: 1;
  cursor: cur;

  .icon {
    width: 15px;
    height: px;
    background-color: #e5e5e7;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    position: absolute;
    right: 0;
    top: 0;
  }

  .content {
    flex: 1;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .xyz {
      width: 80%;
      color: #cfcccc;
      border: 1px solid #575656;

      & tr,
      td {
        border: 1px solid #575656;
      }
    }

    .time {}
  }
}

.myTooltip0 {
  position: absolute;
  z-index: 9999;
  width: 15%;
  height: 25%;
  background-color: rgba(4, 9, 17, .65);
  color: #ffffff;
  display: flex;
  flex-direction: row;
  opacity: 1;
  cursor: move;

  .icon {
    width: 15px;
    height: px;
    background-color: #e5e5e7;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    position: absolute;
    right: 0;
    top: 0;
  }

  .content {
    flex: 1;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .xyz {
      width: 80%;
      color: #cfcccc;
      border: 1px solid #575656;

      & tr,
      td {
        border: 1px solid #575656;
      }
    }

    .time {}
  }
}

.well {
  color: #2ecc71 !important;
  font-weight: bolder !important;
}

.good {}

.bad {
  color: #ffff00 !important;
  font-weight: bolder !important;
}

.danger {
  color: #f90905 !important;
  font-weight: bolder !important;
}

.point {
  height: 10px;
  width: 10px;
  z-index: 100;
  position: absolute;
  background: rgb(253, 249, 2);
  padding: 0;
  margin: 0;
}

.header-item {
  width: fit-content !important;
  font-size: 14px !important;
}

.dvCurrent {
  padding: 0 !important;
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

.tag.well {
  color: #2ecc71 !important;
  font-weight: bolder !important;
}

.tag.good {}

.tag.bad {
  color: #ffff00 !important;
  font-weight: bolder !important;
}



.tag.danger {
  color: #f90905 !important;
  font-weight: bolder !important;
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

.lineSingleClass {
  height: calc(100% - 35px);
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
  justify-content: space-between;
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
