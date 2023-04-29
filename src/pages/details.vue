

<script setup lang="ts">
import domtoimage from 'dom-to-image'
// import html2canvas from 'html2canvas'
import { vOnClickOutside } from '@vueuse/components'
import { CustomMouseMenu } from '~/components/RightClickMenu.ts/index'
import { MPSet } from '~/types/interface';
import { mcOption } from '~/assets/utils/mesureCurve'
import { useMainStore } from '~/store/index';
import { storeToRefs } from 'pinia'
import { debounce, isUndefined } from 'lodash'
import dayjs from 'dayjs';
import { ElMessage, MessageParams } from 'element-plus';
import useDraw from "~/assets/utils/useDraw";
import { apiGet } from '~/assets/utils/apiSet'
enum Station {
  'SR' = 'SR',
  'GW' = 'GW'
}
enum colors {
  perfect = 'well',
  well = 'good',
  warn = 'bad',
  error = 'danger',
}
const menuList = [ // right click menu
  {
    label: '关闭所有面板',
    tips: 'Close',
    fn: () => closeAllMytooltip()
  },
  {
    label: '刷新页面',
    tips: 'Refresh',
    fn: () => window.location.reload()
  },
  // {
  //   label: '删除',
  //   tips: 'Delete',
  //   fn: (...args) => console.log('delete', args)
  // }
]
let descOfMP = ref('')
let isAdmin = ref(false)
let MouseMenuCtx = ref<any>();
let ps = ref<any>([])
let route = useRoute()
const loading = ref<boolean>(true);
const { appRef, calcRate, windowDraw } = useDraw();
let pointName = ref(`BRE_FL_1`)
const src = ref(``)
const clicked2 = ref(0)
const clicked13 = ref(0)
const carousels_2: Carousel[] = [];
const carousels_13: Carousel[] = [];
const tabsVM = ref('GW');
const drawer2 = ref(false);
const checkMean = ref(true)
const ref_mcOption = ref(mcOption)
const http1 = 'api/display/searchByParams'
const server = 'api/display/getPointDetails';
const stn = 200;
let query = route.query;
let defaultStationName = ref('')
let defaultName = ref('')
let upperLimit = ref(1.5)
let lowerLimit = ref(-1.5)
let defaultVal = ref(stn)
const router = useRouter()
const pinia = useMainStore()
const { proxy } = getCurrentInstance() as any;
const timeStart = ref<String>()
const showSymmetry = ref(false)
const timeEnd = ref<String>()
const checkSD = ref(false)
const customNum = ref<number>()
const nums = ref([10, 20, 50, 100, 200])
const measureCurve = ref();
let symmetry = ref()
const tableInfoData = ref()
const tableInfoDataSymmetry = ref()
const shows = ref<show>({ logoShow: false, searchShow: false })
const title = ref('测点详情分析')
const { zoneInfo } = storeToRefs(useMainStore());
const pics_2 = import.meta.glob('/public/images/BRE/SR/*');
const pics_13 = import.meta.glob("/public/images/BRE/GW/*");
Object.values(pics_2).forEach((v) => {
  carousels_2.push({ name: v.name });
});
Object.values(pics_13).forEach((v) => {
  carousels_13.push({ name: v.name });
});
const mesZoneInfo = ref(
  {
    elTabName: 'GW',
    curZone: 'GW'
  }
)
interface show {
  logoShow?: boolean,
  searchShow?: boolean
}
interface Carousel {
  name: string;
}
// 判断是否是admin
proxy.$http
  .post(
    '/api/auth/isAdmin',
    {},
    {
      headers: {
        token: localStorage.getItem('token'),
      },
    }
  )
  .then((res: any) => {
    if (res.data.data == true) {
      isAdmin.value = true;
    }
  });
const gotoExport = () => {
  let query = route.query;
  router.push({
    name: 'export', query: {
      id: query.id,
      pointName: query.pointName,
      stationName: query.stationName,
    }
  })
}
const customStartPrefix = shallowRef({
  render() {
    return h('p', '从')
  },
})
const customEndPrefix = shallowRef({
  render() {
    return h('p', '到')
  },
})
const isStr = (v: unknown) => {
  if (!isNaN(v * 1)) {
    return false;
  } else {
    return true
  }
}
function closeMytooltip(e: Event) {
  let target = e.target! as HTMLElement;
  if (target.classList.contains('icon')) {
    measureCurve.value.removeChild(target.parentNode);
  }
}
function saveView() {
  let capture = document.querySelector('#index') as HTMLElement;
  if (capture) {
    domtoimage.toPng(capture, {}).then(function (dataUrl) {
      let a = document.createElement('a')
      let event = new MouseEvent('click');
      a.href = dataUrl
      a.setAttribute('download', `测点详情分析-${dayjs().format('YYYYMMDDhhmmhh')}.png`)
      if (a.dispatchEvent(event)) {
        ElMessage('视图自动保存中，请注意查收！')
      }
    })
    // html2canvas(capture, {
    //   logging: false, //日志开关，便于查看html2canvas的内部执行流程
    //   width: capture.clientWidth, //dom 原始宽度
    //   height: capture.clientHeight,
    //   scale:1.2,
    //   scrollY: 0,
    //   scrollX: 0,
    //   useCORS: true // 【重要】开启跨域配置
    // }).then(canvas => {
    //   let a = document.createElement('a')
    //   let event = new MouseEvent('click');
    //   a.href = canvas.toDataURL()
    //   a.setAttribute('download', `测点详情分析-${dayjs().format('YYYYMMDDhhmmhh')}.png`)
    //   if(a.dispatchEvent(event)) {
    //     ElMessage('视图自动保存中，请注意查收！')
    //   }
    // })
  }
}
function closeAllMytooltip() {
  if (measureCurve.value) {
    let aps = measureCurve.value.querySelectorAll('.myTooltip0');
    [...aps].forEach(ap => {
      measureCurve.value.removeChild(ap);
    })
  }
}
function bindDragEvent(div, start: { x: number, y: number }) {
  let l = 0
  let r = 0
  div.onmousedown = function (e) {
    //做到浏览器兼容 // div 拖拽
    e = e || window.event
    let diffX = e.clientX - div.offsetLeft
    let diffY = e.clientY - div.offsetTop
    //当拉着box移动时
    document.onmousemove = function (e) {
      // 浏览器兼容
      e = e || window.event
      let left = e.clientX - diffX
      let top = e.clientY - diffY
      if (left < 0) {
        left = 0
      } else if (left > window.innerWidth - div.offsetWidth) {
        left = window.innerWidth - div.offsetWidth
      }
      if (top < 0) {
        top = 0
      } else if (top > window.innerHeight - div.offsetHeight) {
        top = window.innerHeight - div.offsetHeight
      }
      div.style.left = left + 'px'
      div.style.top = top + 'px'
      l = left
      r = top
    }
    // 当鼠标抬起时
    document.onmouseup = function (e) {
      let __;
      this.onmousemove = null
      this.onmouseup = null
      const canvas = measureCurve.value.querySelectorAll('canvas');
      drawstroke(canvas[canvas.length - 1], start, { x: l, y: r })
    }
  }
}
function drawstroke(canvas: HTMLCanvasElement, start: { x: number, y: number }, end: { x: number, y: number }, theta = 30, headlen = 10, width = 1, color = "#ffff00") {
  var ctx = canvas.getContext("2d")!;
  // 计算各角度和对应坐标
  var angle = Math.atan2(start.y - end.y, start.x - end.x) * 180 / Math.PI,
    angle1 = (angle + theta) * Math.PI / 180,
    angle2 = (angle - theta) * Math.PI / 180,
    topX = headlen * Math.cos(angle1),
    topY = headlen * Math.sin(angle1),
    botX = headlen * Math.cos(angle2),
    botY = headlen * Math.sin(angle2);
  ctx.save();
  var arrowX, arrowY;
  //绘制箭头
  ctx.beginPath();
  arrowX = end.x + topX;
  arrowY = end.y + topY;
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(end.x, end.y);
  arrowX = end.x + botX;
  arrowY = end.y + botY;
  ctx.lineTo(arrowX, arrowY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.closePath();
  arrowX = start.x - topX;
  arrowY = start.y - topY;
  //绘制虚线
  ctx.beginPath();
  ctx.setLineDash([28, 8]);//实线 去掉此句
  ctx.moveTo(arrowX, arrowY);
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();
}
function bindEventOn(mcDom, mcDomData) {
  mcDom.off('click') // 点击事件触发前，先解绑事件，避免重复触发
  /* 通过得到当前折线图拐点 x y 轴的值，然后通过convertToPixel，转成并得到画布上的对应位置的坐标 */
  mcDom.on('click', function (param: { seriesName: any; dataIndex: any; data: any; name: any; seriesIndex: any; }) {
    let index = param.dataIndex
    let y = param.data
    let x = param.name
    let seriesIndex = param.seriesIndex
    const pointInPixel = [x, y]
    let [chartX, chartY] = mcDom.convertToPixel({ seriesIndex }, pointInPixel);
    let div = document.createElement("div");
    let { ox, oy, oz, pointName, stationName, model, bodyNumber, statusX,statusY, statusZ } = mcDomData.series[seriesIndex].customInfo;
    let Dx = mcDomData.series[0].data[index]
    let Dy = mcDomData.series[1].data[index]
    let Dz = mcDomData.series[2].data[index]
    let xo = ox[index]
    let yo = oy[index]
    let zo = oz[index]
    let xs = statusX[index]
    let ys = statusY[index]
    let zs = statusZ[index]
    let bn = bodyNumber[index]
    bindDragEvent(div, { x: chartX, y: chartY })
    div.classList.add('myTooltip0')
    div.innerHTML = `
          <div class="icon text-xs cursor-pointer" >X</div>
          <div class="content">
           
            <div class="time text-sm">
              Time:${x}
            </div>
            <div class="time text-sm mt-1">
              车身号:${bn}
            </div>
            <table class="xyz mt-2">
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
        `;
    div.addEventListener('click', closeMytooltip)
    div.style.left = chartX + 'px'
    div.style.top = chartY + 'px'
    measureCurve.value.insertAdjacentElement('afterbegin', div)
    if (MouseMenuCtx.value == null) {
      MouseMenuCtx.value = CustomMouseMenu({
        el: div,
        menuList,
      })
    }
    div.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const { x, y } = e;
      MouseMenuCtx.value.show(x, y)
    })
  })
}

async function callData(time: { begin?: string, end?: string } = {}, ST?: string, DPM?: string) { // DPM pointName 是否动态
  let params: any;
  let params2: any;
  if (Object.keys(time).length == 0) {
    params = {
      asc: false,
      stationName: isUndefined(ST) ? defaultStationName.value : ST,
      pointName: isUndefined(DPM) ? defaultName.value : DPM,
      count: defaultVal.value
    }
  } else {
    params = {
      startTime: time.begin,
      endTime: time.end,
      asc: false,
      stationName: defaultStationName.value,
      pointName: defaultName.value,
    }
  }
  params2 = { ...params };
  // 执行深拷贝
  let r = getSymmetryPointName(defaultName.value)!;
  params2.pointName = r;
  let f1 = () => {
    return proxy.$http.post(http1, params, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
  }
  let f2 = () => {
    return proxy.$http.post(http1, params2, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
  }
  Promise.all([f1(), f2()]).then(resArr => {
    resArr.forEach((res, resIndex) => {
      const { status, data } = res
      if (resIndex == 0) {
        descOfMP.value = data[0].pointMeasureName
        if (status == 200) {
          if (data.length > 0) {
            const axisX: string[] = [];
            const yx: any[] = [];
            const yy: any[] = [];
            const yz: any[] = [];
            data.forEach((d: {
              txObserValue: number;
              tyObserValue: number;
              tzObserValue: number;
              pointName: string;
              stationName: string;
              productPrototypeFeature: number;
              productPrototypeSubModel: string; eventTime: string; txObserDevia: any; tyObserDevia: any; tzObserDevia: any;
            }, index: any) => {
              axisX.push(d.eventTime as string);
              yx.push(d.txObserDevia)
              yy.push(d.tyObserDevia)
              yz.push(d.tzObserDevia)
            });
            if (axisX.length < 10) {
              ref_mcOption.value.dataZoom[0].start = 0;
              ref_mcOption.value.dataZoom[0].end = 100;
            }
            if (axisX.length < 100 && axisX.length > 10) {
              ref_mcOption.value.dataZoom[0].start = 50;
              ref_mcOption.value.dataZoom[0].end = 100;
            }
            ref_mcOption.value.graphic.style.fontSize = '0'; //查出数据，移除无数据提示。
            ref_mcOption.value.xAxis[0].data = axisX;
            ref_mcOption.value.series[0].name = `${defaultName.value}-X轴`
            ref_mcOption.value.series[1].name = `${defaultName.value}-Y轴`
            ref_mcOption.value.series[2].name = `${defaultName.value}-Z轴`;
            // 图例和series 不对应会报错
            ref_mcOption.value.legend.data[0].name = ref_mcOption.value.series[0].name
            ref_mcOption.value.legend.data[1].name = ref_mcOption.value.series[1].name
            ref_mcOption.value.legend.data[2].name = ref_mcOption.value.series[2].name;
            [yx, yy, yz].forEach((v, i) => {
              ref_mcOption.value.series[i].data = v;
              ref_mcOption.value.series[i].customInfo!.ox = []
              ref_mcOption.value.series[i].customInfo!.oy = []
              ref_mcOption.value.series[i].customInfo!.oz = []
              ref_mcOption.value.series[i].customInfo!.statusX = []
              ref_mcOption.value.series[i].customInfo!.statusY = []
              ref_mcOption.value.series[i].customInfo!.statusZ = []
              ref_mcOption.value.series[i].customInfo!.bodyNumber = [];
              data.forEach((dd) => {
                if (ref_mcOption.value.series[i].customInfo) {

                  ref_mcOption.value.series[i].customInfo!.statusX.push(dd.txStatus)
                  ref_mcOption.value.series[i].customInfo!.statusY.push(dd.tyStatus)
                  ref_mcOption.value.series[i].customInfo!.statusZ.push(dd.tzStatus)
                  ref_mcOption.value.series[i].customInfo!.ox.push(dd.txObserValue)
                  ref_mcOption.value.series[i].customInfo!.oy.push(dd.tyObserValue)
                  ref_mcOption.value.series[i].customInfo!.oz.push(dd.tzObserValue)
                  ref_mcOption.value.series[i].customInfo!.bodyNumber.push(dd.bodyNumber)
                }
              })

            })

          } else { // 如果查无数据， echarts 提示 无数据
            ref_mcOption.value.xAxis[0].data = [];
            ref_mcOption.value.series.forEach((v, i) => {
              ref_mcOption.value.series[i].data = [];
            })
            ref_mcOption.value.graphic.style.fontSize = '21';
            if (proxy.mcDom) {
              proxy.mcDom.setOption(ref_mcOption.value)
            }
          }
        }
      } else {
        symmetry.value = res
        if (status == 200) {
          if (data.length > 0) {
            const axisX: string[] = [];
            const yx: any[] = [];
            const yy: any[] = [];
            const yz: any[] = [];
            data.forEach((d: {
              txObserValue: number;
              tyObserValue: number;
              tzObserValue: number;
              pointName: string;
              stationName: string;
              productPrototypeFeature: number;
              productPrototypeSubModel: string; eventTime: string; txObserDevia: any; tyObserDevia: any; tzObserDevia: any;
            }, index: any) => {
              axisX.push(d.eventTime as string);
              yx.push(d.txObserDevia)
              yy.push(d.tyObserDevia)
              yz.push(d.tzObserDevia)
            });
            ref_mcOption.value.graphic.style.fontSize = '0'; //查出数据，移除无数据提示。
            [yx, yy, yz].forEach((v, i) => {
              ref_mcOption.value.series[i + 3].customInfo!.statusX = []
              ref_mcOption.value.series[i + 3].customInfo!.statusY = []
              ref_mcOption.value.series[i + 3].customInfo!.statusZ = []
              ref_mcOption.value.series[i + 3].customInfo!.ox = []
              ref_mcOption.value.series[i + 3].customInfo!.oy = []
              ref_mcOption.value.series[i + 3].customInfo!.oz = []
              ref_mcOption.value.series[i + 3].customInfo!.bodyNumber = [];
              ref_mcOption.value.series[i + 3].data = v;
              data.forEach((dd) => {
                ref_mcOption.value.series[i + 3].lineStyle!.width! = 0;
                ref_mcOption.value.series[i + 3].showSymbol = false;
                ref_mcOption.value.series[i + 3].symbolSize! = 0;
                ref_mcOption.value.series[i + 3].markLine!.data[0].lineStyle.color = '#ffffff';
                ref_mcOption.value.series[i + 3].markLine!.data[0].lineStyle.opacity = 0;
                ref_mcOption.value.series[i + 3].markLine!.data[0].label.show = false;
                if (ref_mcOption.value.series[i + 3].customInfo) {
                  ref_mcOption.value.series[i + 3].customInfo!.statusX.push(dd.txStatus)
                  ref_mcOption.value.series[i + 3].customInfo!.statusY.push(dd.tyStatus)
                  ref_mcOption.value.series[i + 3].customInfo!.statusZ.push(dd.tzStatus)
                  ref_mcOption.value.series[i + 3].customInfo!.ox.push(dd.txObserValue)
                  ref_mcOption.value.series[i + 3].customInfo!.oy.push(dd.tyObserValue)
                  ref_mcOption.value.series[i + 3].customInfo!.oz.push(dd.tzObserValue)
                  ref_mcOption.value.series[i + 3].customInfo!.bodyNumber.push(dd.bodyNumber)
                }
              })

            })
          } else { // 如果查无数据， echarts 提示 无数据
            ref_mcOption.value.xAxis[0].data = [];
            ref_mcOption.value.series.forEach((v, i) => {
              ref_mcOption.value.series[i].data = [];
            })
            ref_mcOption.value.graphic.style.fontSize = '21';
            if (proxy.mcDom) {
              proxy.mcDom.setOption(ref_mcOption.value)
            }
          }
        }
      }
    })
    if (proxy.mcDom) {
      proxy.mcDom.clear()
      proxy.mcDom.setOption(ref_mcOption.value)
      bindEventOn(proxy.mcDom, ref_mcOption.value)
    }
  })
}
//pid == point name  in honda
async function recallTable(c?: number, pid?: string, ST?: string, ET?: string) {
  const params1: { count: number, pointName: string, ti: number, tu: number, startTime?: string, endTime?: string } = {
    count: isUndefined(c) ? defaultVal.value : c,
    pointName: isUndefined(pid) ? defaultName.value : pid,
    ti: lowerLimit.value,
    tu: upperLimit.value
  };
  const params2: { count: number, pointName: string, ti: number, tu: number, startTime?: string, endTime?: string } = {
    count: isUndefined(c) ? defaultVal.value : c,
    pointName: isUndefined(pid) ? defaultName.value : pid,
    ti: lowerLimit.value,
    tu: upperLimit.value
  };
  tpn.value = getSymmetryPointName(isUndefined(pid) ? defaultName.value : pid)
  params2.pointName = tpn.value
  if (!isUndefined(ST) && isUndefined(ET)) {
    params1.startTime = ST
    params1.endTime = ET
    params2.startTime = ST
    params2.endTime = ET
  }

  function fetch1() {
    return proxy.$http.post(server, params1, {
      headers: {
        token: localStorage.getItem('token')
      },// post   body 和query 参数一起传递
      params: { stationName: defaultStationName.value }
    })
  }
  function fetch2() {
    return proxy.$http.post(server, params2, {
      headers: {
        token: localStorage.getItem('token')
      },// post   body 和query 参数一起传递
      params: { stationName: defaultStationName.value }
    })
  }
  let fetchs = [fetch1(), fetch2()]

  Promise.all(fetchs).then(resArr => {
    resArr.forEach((res, i) => {
      const { status, data } = res;
      if (status == 200) {
        const ax = Object.entries(data.x)
        const ay = Object.entries(data.y)
        const az = Object.entries(data.z)
        let o: { category?: string, x?: number, y?: number, z?: number }[] = [];
        ax.forEach((v, i) => {
          let oo: { category?: string, x?: number, y?: number, z?: number } = {}
          oo.category = v[0];
          oo.x = ((v[1] as any).toFixed(3)) as number;
          oo.y = ((ay[i][1] as any).toFixed(3)) as number;
          oo.z = ((az[i][1] as any).toFixed(3)) as number;
          o.push(oo)
        })
        if (i == 0) {
          tableInfoData.value = o;
          callData()
        } else if (i == 1) {
          tableInfoDataSymmetry.value = o;
        }
      }
    })
  })
}

function pullSymmetry() {
  let r = getSymmetryPointName(defaultName.value)!;
  ['Z', 'Y', 'X'].forEach((m, mIndex) => {
    ref_mcOption.value.series[mIndex + 3].lineStyle!.width! = 2;
    ref_mcOption.value.series[mIndex + 3].showSymbol = true;
    ref_mcOption.value.series[mIndex + 3].symbolSize! = 8;
    ref_mcOption.value.series[mIndex + 3].markLine!.data[0].lineStyle.color = '#2ecc71';
    ref_mcOption.value.series[mIndex + 3].markLine!.data[0].lineStyle.opacity = 1;
    ref_mcOption.value.series[mIndex + 3].markLine!.data[0].label.show = true;
    ref_mcOption.value.series[mIndex + 3].name = `${r}-${m}轴`
    // 图例和series 不对应会报错
    if (mIndex == 0) {
      ref_mcOption.value.legend.data.unshift({ name: ref_mcOption.value.series[mIndex + 3].name }, { name: '' })
    }
    ref_mcOption.value.legend.data.unshift({ name: ref_mcOption.value.series[mIndex + 3].name })
  })

}
function pushSymmetry() {
  [1, 2, 3].forEach((n, nIndex) => {
    ref_mcOption.value.series[nIndex + 3].lineStyle!.width! = 0;
    ref_mcOption.value.series[nIndex + 3].showSymbol = false;
    ref_mcOption.value.series[nIndex + 3].symbolSize! = 0;
    ref_mcOption.value.series[nIndex + 3].markLine!.data[0].lineStyle.color = '#ffffff';
    ref_mcOption.value.series[nIndex + 3].markLine!.data[0].lineStyle.opacity = 0;
    ref_mcOption.value.series[nIndex + 3].markLine!.data[0].label.show = false;
    ref_mcOption.value.legend.data.shift()
    if (n == 2) {
      ref_mcOption.value.legend.data.shift()
      ref_mcOption.value.legend.data.shift()
    }

  })
}
async function changeMP(num: any) {
  defaultVal.value = parseInt(num);
  ref_mcOption.value.dataZoom[0].start = 0;
  ref_mcOption.value.dataZoom[0].end = 100;
  callData()
  recallTable()
}

//自定义数量
async function changeMP_deb() {
  if (customNum.value == undefined) {
    defaultVal.value = 200;
  }
  async function wrap() {
    defaultVal.value = customNum.value!;
    const params = {
      asc: false,
      stationName: defaultStationName.value,
      pointName: defaultName.value,
      count: defaultVal.value
    }
    const { status, data } = await proxy.$http.post(http1, params, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    if (status == 200) {
      const axisX: string[] = [];
      const yx: any[] = [];
      const yy: any[] = [];
      const yz: any[] = [];
      data.forEach((d: { eventTime: string; txObserDevia: any; tyObserDevia: any; tzObserDevia: any; }, index: any) => {
        axisX.push(d.eventTime as string);
        yx.push(d.txObserDevia);
        yy.push(d.tyObserDevia);
        yz.push(d.tzObserDevia);
      });
      ref_mcOption.value.xAxis[0].data = axisX;
      [yx, yy, yz].forEach((v, i) => {
        ref_mcOption.value.series[i].data = v;
      })
      ref_mcOption.value.dataZoom[0].start = 0;
      ref_mcOption.value.dataZoom[0].end = 100;
      if (proxy.mcDom) {
        proxy.mcDom.clear();
        proxy.mcDom.setOption(ref_mcOption.value);
      }
      recallTable()
    }
  }
  debounce(wrap, 1600)(); //  这里还必须要调用！！！而且尽量不用箭头函数！！！
}
function beginFilter() {
  if ((timeStart.value == undefined) || (timeEnd.value == undefined) || (dayjs(timeStart.value as any).valueOf() > dayjs(timeEnd.value as any).valueOf())) {
    ElMessage('日期为空或格式错误')
    return;
  }
  let time = {
    begin: dayjs(timeStart.value as string).format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(timeEnd.value as string).format('YYYY-MM-DD HH:mm:ss')
  }
  callData(time)
}
const setTabsVM = (v: string) => {
  tabsVM.value = v
  defaultStationName.value = v
}
async function changeViewByPM(PM: string) {
  const url = '/api/measurePoint/getPointByName'
  let params = {
    params: {
      name: PM
    },
    headers: {
      token: localStorage.getItem('token')
    }
  }
  let r = getSymmetryPointName(PM)!
  LR.value.left = PM;
  LR.value.right = r
  const { data } = await apiGet(proxy, url, 'get', params);
  callData({}, Station[`${tabsVM.value}`], data.name)
  let __;
  recallTable(__, data.name)
  defaultName.value = data.name
}
function handleEvent(i: number) {
  if (tabsVM.value == 'SR') {
    clicked2.value = i
    mesZoneInfo.value.curZone = carousels_2[i].name;
    pointName.value = handleZoneName(carousels_2[i].name)
  } else {
    clicked13.value = i
    mesZoneInfo.value.curZone = carousels_13[i].name
    pointName.value = handleZoneName(carousels_13[i].name)
  }
  zoneInfo.value[5].val = pointName.value;
  defaultName.value = pointName.value
  changeViewByPM(pointName.value);
  mesZoneInfo.value.elTabName = tabsVM.value
  zoneInfo.value[3].val = tabsVM.value
  drawer2.value = false
}

async function getName2() {
  // 目前就一个BRE车型
  const { data } = await apiGet(proxy, 'api/measurePoint/getBySubModel', 'get', {
    params: {
      subModel: 'BRE'
    },
    headers: {
      token: localStorage.getItem('token'),
    }
  })
  ps.value = data
}
const handleZoneName = (name: string) => {
  let name2 = '';
  switch (name.includes('SR')) {
    case true:
      const m1 = name.match(/(?<=SR\_)\w*/) || ''
      return m1[0]
      break;
    case false:
      const m2 = name.match(/(?<=GW\_)\w*/) || '';
      let t = ps.value.filter((v: MPSet) => {
        return v.name == m2[0]
      })
      if (t.length > 0) {
        name2 = m2[0]
      } else {
        name2 = m2[0]
      }
      return name2
      break;
  }
}
const cancelLoading = () => {
  setTimeout(() => {
    loading.value = false;
    // chartRender()
  }, 500);
};
function clickOutside() {
  closeAllMytooltip()
}
function getSymmetryPointName(pointName: string) {
  let r;
  if (pointName.includes('FR')) {
    r = pointName.replace('FR', 'FL')
  } else if (pointName.includes('FL')) {
    r = pointName.replace('FL', 'FR')
  }
  else if (pointName.includes('BR') && !pointName.includes('BRE') ) {
    r = pointName.replace('BR', 'BL')
  }
  else if (pointName.includes('BR') && pointName.includes('BRE') ) {
    r = pointName.replace('_BR_', '_BL_')
  }
  else if (pointName.includes('BL')) {
    r = pointName.replace('BL', 'BR')
  }
  if (r) {
    return r
  }
}
function reset() {
  zoneInfo.value[3].val = query.stationName! as string
  defaultVal.value = stn
  init()
}
function init() {
  let query = route.query;
  let params1 = {
    count: defaultVal.value,
    pointName: defaultName.value,
    ti: lowerLimit.value,
    tu: upperLimit.value
  }
  let params2 = {
    count: defaultVal.value,
    pointName: defaultName.value,
    ti: lowerLimit.value,
    tu: upperLimit.value
  }
  if (Object.keys(query).length > 0) {
    let zoItem = { key: '当前测点', val: query!.pointName! as string, color: '#ffc000' }
    defaultStationName.value = query!.stationName! as string
    tabsVM.value = defaultStationName.value
    defaultName.value = query!.pointName! as string
    params1.pointName = query!.pointName! as string
    pointName.value = query!.pointName! as string
    tpn.value = getSymmetryPointName(pointName.value)
    LR.value.left = pointName.value
    LR.value.right = tpn.value
    params2.pointName = tpn.value
    src.value = `/public/images/BRE/${defaultStationName.value}/${defaultStationName.value}_${pointName.value}.png`
    zoneInfo.value[3].val = query.stationName! as string
    if (zoneInfo.value.length == 5) {
      zoneInfo.value.push(zoItem)
    } else {
      zoneInfo.value[5].val = pointName.value
      zoneInfo.value[5].key = "点位名"
    }
  }
  setTimeout(() => {
    if (measureCurve.value) {
      const mcDom = proxy.$echart.init(measureCurve.value);
      proxy.mcDom = mcDom;
      mcDom.on('legendselectchanged', function (param: { name: string, selected: { Avg: boolean, Data: boolean } }) {
        switch (param.name) {
          case 'Avg':
            checkMean.value = param.selected.Avg
            break;
          case 'Data':
            checkSD.value = param.selected.Data
            break;
          case '对比':
            showSymmetry.value = param.selected['对比']
            break;
          default:
            break;
        }
      })
    }
    function fetch1() {
      return proxy.$http.post(server, params1, {
        headers: {
          token: localStorage.getItem('token')
        },// post   body 和query 参数一起传递
        params: { stationName: defaultStationName.value }
      })
    }
    function fetch2() {
      return proxy.$http.post(server, params2, {
        headers: {
          token: localStorage.getItem('token')
        },// post   body 和query 参数一起传递
        params: { stationName: defaultStationName.value }
      })
    }
    let fetchs = [fetch1(), fetch2()]
    Promise.all(fetchs).then(resArr => {
      resArr.forEach((res, i) => {
        const { status, data } = res;
        if (status == 200) {
          const ax = Object.entries(data.x)
          const ay = Object.entries(data.y)
          const az = Object.entries(data.z)
          let o: { category?: string, x?: number, y?: number, z?: number }[] = [];
          ax.forEach((v, i) => {
            let oo: { category?: string, x?: number, y?: number, z?: number } = {}
            oo.category = v[0];
            oo.x = ((v[1] as any).toFixed(3)) as number;
            oo.y = ((ay[i][1] as any).toFixed(3)) as number;
            oo.z = ((az[i][1] as any).toFixed(3)) as number;
            o.push(oo)
          })
          if (i == 0) {
            tableInfoData.value = o;
            callData()
          } else if (i == 1) {
            tableInfoDataSymmetry.value = o;
          }
        }
      })
    }).catch((error: { response: { data: { msg: MessageParams; status: any }; }, message: string }) => {
      if (error.response.data.status == 401) {
        ElMessage('用户凭证失效，请登录后在操作！');
        setTimeout(() => {
          router.push('/login')
        }, 600);
      } else {
        ElMessage(`网路请求错误，请检查-${error.message}`)
      }
    })
  }, 850);
  // 如果使用 await 的话， 请求失败会一直阻塞后续的代码！！！
}

let LR = ref({
  left: '',
  right: ''
})
let tpn = ref();
onMounted(async () => {
  getName2()
  cancelLoading()
  calcRate()
  windowDraw()
  init()
})
watch(showSymmetry, (cur, pre) => {
  ref_mcOption.value.legend.selected['对比'] = cur;
  if (cur) {
    pullSymmetry()
  } else {
    pushSymmetry()
  }
  if (proxy.mcDom) {
    proxy.mcDom.setOption(ref_mcOption.value)
  }
})
watch(checkSD, (cur, pre) => {
  ref_mcOption.value.legend.selected.Data = cur;
  ref_mcOption.value.series.forEach((v, i) => {
    i < 6 ? ref_mcOption.value.series[i].label!.show = cur : '';
  })
  proxy.mcDom.setOption(ref_mcOption.value)
})
watch(defaultVal, (cur, pre) => {
  closeAllMytooltip()
  // if (cur >= 100) { // 如果测点数目少于50个， 优化x轴滑块
  //   ref_mcOption.value.dataZoom[0].start = 50;
  //   proxy.mcDom.setOption(ref_mcOption.value)
  // } else {
  //   ref_mcOption.value.dataZoom[0].start = 85;
  //   ref_mcOption.value.dataZoom[0].end = 100;
  //   proxy.mcDom.setOption(ref_mcOption.value)
  // }
})
watch(checkMean, (cur, pre) => {
  if (cur) { // 如果checked, opacity = 1
    ref_mcOption.value.series.forEach((v, i) => {
      i < 6 ? ref_mcOption.value.series[i].markLine!.data[0].lineStyle.opacity = 1 : '';
    })
  } else {
    ref_mcOption.value.series.forEach((v, i) => {
      i < 6 ? ref_mcOption.value.series[i].markLine!.data[0].lineStyle.opacity = 0 : '';
    })
  }
  proxy.mcDom.setOption(ref_mcOption.value)
})
watch(mesZoneInfo, (cur, pre) => {
  let imgSrc = [];
  if (cur.elTabName == 'SR') {
    imgSrc = carousels_2.filter(c => {
      return c.name == cur.curZone;
    })
  } else {
    imgSrc = carousels_13.filter(c => {
      return c.name == cur.curZone;
    })
  }
  if (imgSrc.length > 0) {
    const zotmp = pinia.zoneInfo
    zotmp.forEach((v: { key: string, val: string }) => {
      if (v.key == '检测组') {
        v.val = cur.elTabName
      }
    });
    pinia.zoneInfo = zotmp
    src.value = imgSrc[0].name
  }
}, { immediate: true, deep: true })
let showDescOfMP = ref(false)
function editText(e) {
  let f = e.target as HTMLSpanElement;
  f.style.display = 'none'
  showDescOfMP.value = true
  if(showDescOfMP.value) {
    descOfMP.value = f.innerHTML;
  }
}
function completeEdit(e) {
  let targetDom = e.target as HTMLTextAreaElement;
  let spanTarget = targetDom.parentNode!.parentNode!.querySelector('span') as HTMLSpanElement
  spanTarget.innerHTML = descOfMP.value
  spanTarget.style.display = 'flex'
  showDescOfMP.value = false
  if (!showDescOfMP.value) {
    let params = {
      name: pointName.value
    }
    let headers = {
      token: localStorage.getItem('token')
    }
    if (isAdmin.value) {
      proxy.$http.get('/api/measurePoint/getPointByName', { params, headers }).then(
        (v: any) => {
          if (v.status == 200) {
            const id = v.data.id
            proxy.$http.post(
              '/api/measurePoint/editPoint',
              {
                id,
                name:pointName.value,
                measureName: descOfMP.value
              },
              { headers }
            ).then(v => {
              if(v.status == 200) {
                ElMessage('修改点位描述成功！')
              }
            }).catch(e => {
              ElMessage(`${e.response.data.message}`)
            })
          }
        }
      ).catch(() => { ElMessage('网络请求错误，请检查!') })
    }
  }
}
function getTextAreaVal(e) {
  if (e !== '') {
    descOfMP.value = e
  }
}
// 如果是监听对象属性改变，需要设置 deep深度监听
</script>

<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="myContainer w-full h-full">
          <Header :title="title" :show="shows"></Header>
          <el-drawer size="40%" v-model="drawer2" direction="ttb">
            <template #header>
              <h1 class=" text-2xl! font-black  ">选择测点区域</h1>
            </template>
            <template #default>
              <div class="h-full">
                <el-tabs v-model="tabsVM" class="demo-tabs h-full" @tab-change="setTabsVM">
                  <el-tab-pane label="GW" name="GW" class="h-full">
                    <n-carousel draggable :space-between="20" :show-dots="false" show-arrow :loop="false"
                      slides-per-view="auto">
                      <n-carousel-item :class="{ cur: i == clicked13 }" class="nci relative  cursor-pointer rounded-md"
                        v-for="(c, i) in carousels_13" style="width: 20%" @click="handleEvent(i)">
                        <span class="absolute top-3 left-3 text-white z-[9999]">
                          {{ handleZoneName(c.name) }} </span>
                        <n-image class=" w-full h-full carousel-img rounded-md opacity-80 scale-110" :src="c.name"
                          :previewed-img-props="{ style: { borderRadius: '8px' } }" preview-disabled />
                        <!-- <img class="carousel-img rounded-md opacity-80 scale-80" :src="c.name" /> -->
                      </n-carousel-item>
                    </n-carousel>
                  </el-tab-pane>
                  <el-tab-pane label="SR" name="SR" class="h-full">
                    <n-carousel draggable :space-between="10" :show-dots="false" :loop="false" slides-per-view="auto"
                      show-arrow>
                      <n-carousel-item :class="{ cur: i == clicked2 }" class="nci cursor-pointer  rounded-md relative"
                        v-for="(c, i) in carousels_2" style="width: 20%" @click="handleEvent(i)">
                        <span class="absolute top-3 left-3 text-white z-[9999]">
                          {{ handleZoneName(c.name) }} </span>
                        <n-image class=" w-full h-full carousel-img rounded-md opacity-80 scale-110" :src="c.name"
                          :previewed-img-props="{ style: { borderRadius: '8px' } }" preview-disabled />
                      </n-carousel-item>
                    </n-carousel>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </template>
          </el-drawer>
          <div
            class="detailsWrap w-full relative  flex flex-row bg-gradient-to-r from-[#001638] via-[#006395]  to-[#002144] ">
            <div class="left w-[15%]   bg-[#00101D] mx-5  mt-3">
              <div class="zone w-full h-full flex flex-col">
                <div class="ltitle w-full p-1.5 flex flex-row justify-center items-center">
                  <div class="titleWrap w-3/4 mr-auto  flex flex-row justify-start items-center">
                    <div class="icon bg-[#00A5FF] h-2.1 w-1.2 -skew-x-12 m-4"></div>
                    <span class="text-white text-base font-extrabold -skew-x-12">{{ defaultStationName }}信息 </span>
                  </div>
                  <el-button @click="drawer2 = true"
                    class="toggleZone  border-none !px-2.5 !h-6 !py-0 text-xs bg-[#00A5FF] text-white">切换点位</el-button>
                    <el-button @click=""
                    class="hidden toggleZone  border-none !px-2.5 !h-6 !py-0 text-xs bg-[#00A5FF] text-white">切换车型</el-button>
                </div>
                <div class="zonePic px-2 py-20 w-full h-[40%] border-[#fff] overflow-hidden">
                  <!-- web3d 相机移动 -->
                  <img :src="src" class="w-full h-auto scale-180 overflow-hidden" alt="p1">
                </div>
                <div class="zoneDesc px-2 pt-0 pb-10 -mt-21 mx-3 w-full flex-1 flex flex-col ">
                  <div class="descItem w-full py-6  flex flex-row justify-start items-center "
                    v-for="(zo, index) in zoneInfo" :key="index" v-show="index !== 4">
                    <div class="label w-[40%] text-start  text-slate-400">{{ zo.key }}</div>
                    <div class="labelValue flex-1 text-start text-white" :style="{ color: zo.color }">{{ zo.val }}</div>
                  </div>
                  <div
                    class="descInfo  text-[#999999] flex justify-center items-center text-center align-middle text-base  my-9 -ml-1 h-32 w-[96%]">
                    <span @dblclick="editText"
                      class="descInfo_span w-full h-full flex justify-center items-center"> {{ descOfMP ?? '双击输入你的内容'  }} </span>
                    <el-input class="w-full h-full " @blur="completeEdit" @input="getTextAreaVal" v-if="showDescOfMP"
                      v-model="descOfMP" input :rows="2" type="textarea" placeholder="请输入" />
                  </div>
                </div>
              </div>
            </div>
            <div class="right  flex-1 mt-3 mb-5 mr-5 flex flex-col">
              <div class="pointLine h-[75%] v-on  pb-3 bg-[#00101D] relative" v-if="!loading" ref="measureCurve"></div>
              <div class="control flex-1 flex pt-2 flex-row justify-center items-center gap-2">
                <div class="info h-full w-2/3 bg-[#00101D] flex flex-col">
                  <div class="infoTitle flex flex-row justify-start items-center">
                    <div class="icon bg-[#00A5FF] h-2.1 w-1.2 -skew-x-12 m-4"></div>
                    <span class="text-white text-base font-extrabold -skew-x-12">测点详情列表</span>
                    <div class=" ml-auto m-2">
                      <el-button @click="saveView()"
                        class="toggleZone border-none !px-2.5 !h-6 !py-0 text-xs bg-[#304457] text-white">保存视图</el-button>
                      <el-button v-if="isAdmin" @click="router.push('set')"
                        class="toggleZone border-none !px-2.5 !h-6 !py-0 text-xs bg-[#304457] text-white ">测点管理</el-button>
                      <el-button @click="gotoExport"
                        class="toggleZone border-none !px-2.5 !h-6 !py-0 text-xs bg-[#304457] text-white">导出报表</el-button>
                    </div>
                  </div>
                  <div class="infoTable flex-1 flex flex-row">
                    <table class="w-full h-full text-center">
                      <thead class="h-1/9">
                        <tr class="flex h-full flex-row justify-evenly items-center  ">
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center text-[#00A4FF]">
                            {{ LR.left }} :
                            {{ defaultVal }}
                            <span class="by w-full h-full absolute top-0 left-0"></span>
                          </td>
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center text-slate-400">X
                            <span class="by w-full h-full absolute top-0 left-0"></span>
                          </td>
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center text-slate-400">Y
                            <span class="by w-full h-full absolute top-0 left-0"></span>
                          </td>
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center text-slate-400">Z
                            <span class="by w-full h-full absolute top-0 left-0"></span>
                          </td>
                        </tr>
                      </thead>
                      <tbody class="h-8/9">
                        <tr class="flex h-1/8 flex-row justify-evenly items-center" v-for="(tid, indx) in tableInfoData"
                          :key="indx">
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center font-sans"
                            :class="isStr((arr[1])) ? 'text-slate-400' : 'text-white'"
                            v-for="(arr, index) in (Object.entries(tid))" :key="index">{{ arr[1] }} <span
                              class="by w-full h-full absolute top-0 left-0"></span></td>
                        </tr>

                      </tbody>
                    </table>
                    <table class="symmetry  w-full h-full text-center">
                      <thead class="h-1/9">
                        <tr class="flex h-full flex-row justify-evenly items-center  ">
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center text-[#00A4FF]">
                            {{ LR.right }} :
                            {{ defaultVal }}
                            <span class="by w-full h-full absolute top-0 left-0"></span>
                          </td>
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center text-slate-400">X
                            <span class="by w-full h-full absolute top-0 left-0"></span>
                          </td>
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center text-slate-400">Y
                            <span class="by w-full h-full absolute top-0 left-0"></span>
                          </td>
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center text-slate-400">Z
                            <span class="by w-full h-full absolute top-0 left-0"></span>
                          </td>
                        </tr>
                      </thead>
                      <tbody class="h-8/9">
                        <tr class="flex h-1/8 flex-row justify-evenly items-center"
                          v-for="(tid, indx) in tableInfoDataSymmetry" :key="indx">
                          <td class="flex-1 w-full h-full relative bx flex justify-center items-center font-sans"
                            :class="isStr((arr[1])) ? 'text-slate-400' : 'text-white'"
                            v-for="(arr, index) in (Object.entries(tid))" :key="index">{{ arr[1] }} <span
                              class="by w-full h-full absolute top-0 left-0"></span></td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="panle w-1/3 h-full bg-[#00101D] flex flex-col">
                  <div class="panelHead p-1.5 flex flex-row justify-center items-center">
                    <div class="titleWrap w-3/4 mr-auto  flex flex-row justify-start items-center">
                      <div class="icon bg-[#00A5FF] h-2.1 w-1.2 -skew-x-12 m-4"></div>
                      <span class="text-white text-base font-extrabold -skew-x-12">测点统计设置</span>
                    </div>

                  </div>
                  <div class="panelMiddle bg-[#00060a] flex justify-start items-center ml-5.5 h-9 rounded-sm ">
                    <span class=" ml-4.5 text-white">测点数量：</span>
                    <el-button @click="changeMP(num)"
                      class=" setHoverActive bg-[#00060a] w-[40px]  border-slate-400 text-slate-400 font-sans text-xs !h-[24px] active:!border-[#00A5FF] !bg-transparen"
                      v-for="(num, index) in nums" :key="index">{{ num }}</el-button>
                    <el-input-number @blur="changeMP_deb" @change="" class=" ml-1 !bg-[#090B12] font-sans "
                      placeholder="自定义数量" :step="10" v-model="customNum" :min="10" :max="1000" size="small"
                      controls-position="right" />
                  </div>
                  <div class="panelEnd flex-1 flex flex-row gap-2 ml-5.5 py-2 pr-2">
                    <div class="panelEndLeft w-full bg-[#00060a] flex flex-col justify-around items-start">
                      <div class="panelEndLeft-title text-white ml-4.5">时间过滤</div>
                      <div class="timeStart w-full">
                        <el-date-picker class="w-full" v-model="timeStart" type="datetime" placeholder="开始时间"
                          :prefix-icon="customStartPrefix" />
                      </div>
                      <div class="timeEnd w-full">
                        <el-date-picker class="w-full" v-model="timeEnd" type="datetime" placeholder="结束时间"
                          :prefix-icon="customEndPrefix" />
                      </div>
                      <div class="buttonGroup w-full flex flex-row justify-center items-center">
                        <el-button @click="reset"
                          class=" px-15 text-xs h-6.5 text-white border-none bg-[#232734]">视图重置</el-button>
                        <el-button @click="beginFilter"
                          class=" px-15 text-xs h-6.5 text-white border-none bg-[#232734]">视图过滤</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.descInfo {
  border: 1px solid #37444e;
  border-radius: 5px;

  .descInfo_span {
    word-break: break-all;
    white-space: normal;
    overflow-y: auto;
  }
}

:deep(.el-textarea>textarea) {
  @apply h-full w-full;
}

.n-carousel {
  :deep(.n-carousel__slides) {
    height: 88%;
  }
}

:deep(.n-carousel.n-carousel--bottom .n-carousel__arrow-group) {
  bottom: 0px;
  right: 50%;
  transform: translateX(-50%);
}

.nci {
  border: 1px solid #555 !important;
  background-color: rgba(4, 6, 12, 0.6) !important;

  &:hover {
    background-color: rgba(41, 14, 14, 1) !important;
  }

  &.cur {
    border: 1px solid #409eff !important;
  }
}

.el-tabs ::v-deep .el-tabs__nav-wrap::after {
  bottom: -2px;
}

:deep(.el-tabs__content) {
  height: 80%;
}

:deep(.el-tabs__active-bar) {
  display: none;
}

:deep(.el-drawer) {

  @apply bg-gradient-to-r from-[#252525] via-[#01324c] to-[#00070e];
}

:deep(.el-drawer__footer) {
  .el-button:hover {
    background-color: #00A5FF;
  }

  span {
    color: #DCDCDC;
  }
}

:deep(.el-tabs__item) {
  padding: 0 20px !important;
  color: #DCDCDC;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
  border-bottom: 5px #409eff solid;
}

:deep(.el-tabs__active-bar) {
  background-color: #e5e7eb !important;
}

:deep(.el-drawer__body) {
  padding: 8px;
  overflow-y: hidden;
}

:deep(.el-tabs__nav-scroll) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-drawer__header) {
  padding: 8px;
  margin-bottom: -12px !important;
}

:deep(.el-input-number.is-controls-right .el-input-number__decrease) {
  border-left: rgb(140, 139, 139) !important;
}

:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  border-left: rgb(140, 139, 139) !important;
}

:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  border-bottom: rgb(140, 139, 139);
}

:deep(.el-input) {
  background-color: #090B12 !important;
  --el-input-border-color: #181E32;

  & .el-input__wrapper {
    background-color: transparent !important;

    & .el-input__inner::-webkit-input-placeholder {
      text-align: center;
    }

  }
}

:deep(.el-input-number span) {
  background-color: #090B12 !important;
}

:deep(.el-checkbox__inner) {
  background-color: #090B12 !important;
  border-color: rgb(148 163 184) !important;
}

.myContainer {
  .detailsWrap {
    height: calc(100% - 75px);

    .left {
      height: calc(100% - 32px);

      .zoneDesc {
        .descItem {
          position: relative;

          &::before {
            content: '';
            position: absolute;
            height: 1px;
            width: (100% - 6rem);
            bottom: 0;
            /**使用渐变来自定义虚线 */
            background: linear-gradient(to right,
                transparent 0%,
                transparent 50%,
                rgb(140, 139, 139) 50%,
                rgb(140, 139, 139) 100%);
            background-size: 4px 1px;
            background-repeat: repeat-x;
          }
        }
      }
    }

    .right {
      .control {
        .infoTable {
          table {
            border-collapse: collapse;
            border: none;

            .by::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              background-color: #DCDCDC;
              width: 100%;
              height: 1px;
              transform: scaleY(0.3);
              transform-origin: 0 0;
            }

            .by::after {
              content: '';
              position: absolute;
              left: 0;
              bottom: 0;
              background-color: #DCDCDC;
              width: 100%;
              height: 1px;
              transform: scaleY(0.3);
              transform-origin: 0 0;
            }

            .bx {
              &::before {
                position: absolute;
                content: "";
                left: 0;
                top: 0;
                background-color: #DCDCDC;
                width: 1px;
                height: 100%;
                transform: scaleX(0.3);
                transform-origin: 0 0;

              }

              &::after {
                position: absolute;
                content: "";
                left: 100%;
                top: 0;
                background-color: #DCDCDC;
                width: 1px;
                height: 100%;
                transform: scaleX(0.3);
                transform-origin: 0 0;

              }
            }
          }
        }
      }
    }
  }
}

.el-button+.el-button {
  margin-left: 8px;
}

.setHoverActive {

  &:hover,
  &:active,
  &:focus {
    color: #00A5FF !important;
    border-color: #00A5FF !important;
    background-color: transparent;
  }
}
</style>
