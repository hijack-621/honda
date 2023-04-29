<script setup lang="ts">
// import dayjs from "dayjs";
// import option from '~/assets/utils/xbar'
import { overall_option } from '~/assets/utils/overallData';
import { single_option } from '~/assets/utils/singleData';
import { error_option } from '~/assets/utils/errorData';


// import { xpie } from '~/assets/utils/xpie'

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
const list = ref([
  {
    no: "1",
    date: "2022-10-26 00:00",
    x: 4.45,
    y: 4.45,
    z: 4.45,
  },
  {
    no: "2",
    x: 4.45,
    y: 4.45,
    z: 4.45,
    date: "2022-10-26 00:00",
  },
  {
    no: "13",
    date: "2022-10-26 00:00",
    x: 4.45,
    y: 4.45,
    z: 4.45,

  },
  {
    no: "4",
    date: "2022-10-26 00:00",
    x: 4.45,
    y: 4.45,
    z: 4.45,
  },
  {
    no: "5",
    date: "2022-10-26 00:00",
    x: 4.45,
    y: 4.45,
    z: 4.45,

  }])

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
    ['<span style="color:#37a2da;">5301FL_1</span>'],
    ['5301FL_1'],
    ['5301FL_1',],
    ['5301FL_1',],
    ['<span style="color:#ffdb5c;">5301FL_1</span>'],
    ['5301FL_1',],
    ['5301FL_1'],
    ['5301FL_1'],
    ['<span style="color:#e690d1;">5301FL_1</span>'],
    ['5301FL_1'],
  ],
  index: false,
  columnWidth: [50],
  align: ['center'],
  headerBGC: '#172030',
  oddRowBGC: '#172030',
  evenRowBGC: '#172030',
  waitTime: 2000000
});


const mouseoverHandler = (e: any) => {
  console.log(e)
}

const clickHandler = (e: any) => {
  console.log(e)
}
const render = () => {
  const o_dom = proxy.$echart.init(lineOverall.value);
  const s_dom = proxy.$echart.init(lineSingle.value);
  const b_dom = proxy.$echart.init(bar.value);
  o_dom.setOption(overall_option)
  s_dom.setOption(single_option)
  b_dom.setOption(error_option)
}



const getClickedModel = async (e) => {
  if (e) {
    const { data } = await proxy.$http.get('/getMeasurePointsByModel', { params: {} });
    // console.log(data)
    dataFromChild.value = data;
  }
}

// const list = ref([
//   {
//     no: "1",
//     date: "2022-10-26 00:00",
//     x: 4.45,
//     y: 4.45,
//     z: 4.45,
//   },
//   {
//     no: "2",
//     x: 4.45,
//     y: 4.45,
//     z: 4.45,
//     date: "2022-10-26 00:00",
//   },
//   {
//     no: "13",
//     date: "2022-10-26 00:00",
//     x: 4.45,
//     y: 4.45,
//     z: 4.45,

//   },
//   {
//     no: "4",
//     date: "2022-10-26 00:00",
//     x: 4.45,
//     y: 4.45,
//     z: 4.45,
//   },
//   {
//     no: "5",
//     date: "2022-10-26 00:00",
//     x: 4.45,
//     y: 4.45,
//     z: 4.45,
//   },
//   {
//     no: "6",
//     date: "2022-10-26 00:00",
//     x: 4.45,
//     y: 4.45,
//     z: 4.45,
//   },
//   {
//     no: "7",
//     date: "2022-10-26 00:00",
//     x: 4.45,
//     y: 4.45,
//     z: 4.45,
//   },
// ])


const initData = async () => {
  const res0 = await proxy.$http.get(mesPointServer, {
    params: {
      subModel: '555A', //  530B?
    },
  });
  if (res0.status == 200) { //  所有测点数据
    res0.data.forEach((e) => {
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
  res1.data.forEach((e, i) => {
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
  temp = temp.sort((a, b) => {
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

// const sart = ref()
// const pieData = ref()
// const options = ref(option)
// const currentYear = new Date().getFullYear()
// const emit = defineEmits(["xbarShow"]);

// const startTime = ref(dayjs(`${currentYear}-01-01`).format("YYYY-MM-DD HH:mm:ss"))
// const endTime = ref(dayjs().format("YYYY-MM-DD HH:mm:ss"))
// const xAxisData = [] as any

// async function getXbar(xbarserver: string, f: number, endTime?: string) {
//   const rdata = await proxy.$http.post(xbarserver, {
//     endTime: endTime!,
//     productPrototypeFeature: f.toString(), // 初始读取2点位  后面读取6 点位
//     stationName: "2", // 1==13工位 2==2 工位
//     subNumber: 30,
//     subgroup: 30,
//   });
//   const { data } = rdata
//   // console.log(data)
//   // if(data.status === 200) {
//   //   emit('xbarShow', )
//   // }
//   const { x } = data;
//   const mean_cls = [x.avgUCL.toFixed(3), x.avg.toFixed(3), x.avgLCL.toFixed(3)];
//   x.avgs.forEach((v: any, i: any) => {
//     xAxisData.push(i + 1);
//   });
//   options.value.xAxis[0].data = xAxisData;
//   options.value.series[0].data = x.avgs;
//   options.value.series[0].markLine.data.forEach((v, i) => {
//     v.yAxis = mean_cls[i];
//   });
//   options.value.series[0].markPoint.data[0].yAxis = mean_cls[0];
//   options.value.series[0].markPoint.data[1].yAxis = mean_cls[0];
//   options.value.series[0].markPoint.data[2].yAxis = mean_cls[1];
//   options.value.series[0].markPoint.data[3].yAxis = mean_cls[1];
//   options.value.series[0].markPoint.data[4].yAxis = mean_cls[2];
//   options.value.series[0].markPoint.data[5].yAxis = mean_cls[2];
//   options.value.graphic.style.text = `PointId:${f} GroupNum:30 Center = ${x.avg.toFixed(
//     3
//   )} StdDev = ${x.variance.toFixed(3)} `;
// }
// getXbar(xbarserver, 16, endTime.value)
// const { data: rdata } = await proxy.$http.post(
//   "api/display/generatorReport",
//   {
//     productPrototypeModel: '555A', //
//     startTime: startTime.value,
//     endTime: endTime.value,
//     stationName: 2,
//   }
// );
// pieData.value = rdata.dataList

// const { data: data } = await proxy.$http.post("api/display/searchByParams", {
//   asc: false,
//   productPrototypeFeature: 16, // 默认展示 530B的16点位
//   stationName: 2,
// });
// sart.value = data


onMounted(async () => {
  initData()
  render()
})


</script>

<template>
  <div class="flex w-full h-full justify-center items-center flex-col">
    <Header :title="title" @getClickedModel="getClickedModel"></Header>
    <div class="content flex flex-col flex-1 w-full min-h-0 bg-[#001637]">
      <div class="top flex flex-row w-full h-[70%]">
        <div class="main flex-1 h-full   ">
          <div class="three3d w-full h-full relative">
            <Model3d class="h-full w-full" :dataFromChild="dataFromChild"></Model3d>
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
            <div ref="points" class="points h-full overflow-y-scroll">
              <vue3-seamless-scroll :list="list" class="scroll">
                <div class="item text-white" v-for="(item, index) in list" :key="index">
                  <span> <span class="text-yellow-400 font-semibold">{{ item.no }}</span> 号测点</span>
                  <span>ΔX:{{ item.x }}</span>
                  <span>ΔY:{{ item.y }}</span>
                  <span>ΔZ:{{ item.z }}</span>
                  <span>{{ item.date }}</span>
                </div>
              </vue3-seamless-scroll>
              <!-- <MyTable :headers="" :data=""></MyTable> -->
              <!-- <el-table height="350" :data="pointsData" 
                class="cursor-pointer h-full" @row-click="" border stripe>
                    <el-table-column v-for="col in columns"
                        :prop="col.prop"
                        :key="col.prop"
                        :label="col.label"
                        :width="col.width"
                    >
                    </el-table-column>
                </el-table> -->

            </div>
            <!-- <SingleChart :options="sart">

          </SingleChart> -->
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
              <dv-scroll-board :config="config" class=" w-full h-full text-center" @mouseover="mouseoverHandler"
                @click="clickHandler" />
            </div>s
            <div ref="lineSingle" class=" tend flex-1 h-full"></div>
          </div>
        </div>
      </div>



    </div>
    <!-- <Footer></Footer> -->
  </div>
</template>

<style lang="less">
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
  background-image: url(/image/light.png);
  background-position: right center;
  background-repeat: no-repeat;
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
}
</style>
