<script setup lang="ts">
import { init } from "echarts";
import xyz from '~/assets/utils/sart'

interface Lists {
  productPrototypeFeature: number,
  stationName: string,
  eventTime: string,
  factoryName: number,
  dataType: string,
  shift: string,
  txObserDevia: number,
  tyObserDevia: number,
  tzObserDevia: number,
  txObserValue: number,
  tyObserValue: number,
  tzObserValue: number,
}



const xyzRef = ref(xyz)

const singleChart = ref();
const { proxy } = getCurrentInstance() as any;
const { options } = defineProps({
  options: {
    type: Object,
  },
});

const xlist = <number[]>[]
const ylist = <number[]>[]
const zlist = <number[]>[]
const times = <string[]>[]

const inits = [] as any

function hlists(options: Array<Lists>) {
  options.forEach(v => {
    xlist.push(v.txObserDevia)
    ylist.push(v.tyObserDevia)
    zlist.push(v.tyObserDevia)
    times.push(v.eventTime)
  })
}

const reRender = (data, e?, r?) => {
  const xAxis = [];
  const datas = {
    xdata: [],
    ydata: [],
    zdata: [],
  };
  if (r === undefined) {
    data
      .reduce((pre, cur) => {
        xAxis.push(cur.eventTime);
        datas.xdata.push(cur.txObserDevia);
        datas.ydata.push(cur.tyObserDevia);
        datas.zdata.push(cur.tzObserDevia);
        return pre.includes(cur.productPrototypeFeature)
          ? pre
          : pre.concat(cur.productPrototypeFeature);
      }, [])
      .sort((a, b) => {
        return a - b;
      });
    options.xAxis.data = xAxis.map(function (str) {
      return str.replace(" ", "\n");
    }).reverse();
    options.series[0].data = datas.xdata.reverse();
    options.series[1].data = datas.ydata.reverse();
    options.series[2].data = datas.zdata.reverse();
    options.title.text =
      `${store.state.currentModel}-` + (e ?? 6) + options.title.text.slice(-6);
    const initDom = proxy.$echarts.init(singleChart.value);
    option.value = options;
    initDom.setOption(options);
  } else {
    const initDom = proxy.$echarts.init(singleChart.value);
    initDom.setOption(data);
  }
};
defineExpose({ reRender });

nextTick(() => {
  hlists(options as Array<Lists>)
  const target: NodeList = document.querySelectorAll(".tendencyLine");
  if (target) {
    const enum0 = {
      0: xlist,
      1: ylist,
      2: zlist
    }
    target.forEach((t, index) => {
      const InitDom = init(t as HTMLElement);
      inits.push(InitDom)
      xyzRef.value[index].xAxis.data = times;
      if (index == 1) {
        xyzRef.value[index].title = {
          text: "y向",
          textStyle: {
            color: "#eeff66",
            fontSize: "14px",
          }
        }
      }
      else if (index == 2) {
        xyzRef.value[index].title = {
          text: "z向",
          textStyle: {
            color: "#eeff66",
            fontSize: "14px",
          }
        }
      }
      xyzRef.value[index].series[0].data = enum0[index];
      // console.log(enum0[index]);
      InitDom.setOption(xyzRef.value[index])
    })
  }
});
</script>
<template>
  <div class="wrap w-full h-full flex flex-col justify-center items-center">
    <div class="w-full flex-1" v-for="(v, i) in ['x', 'y', 'z']" :key="i">
      <div class="tendencyLine w-full h-full">

      </div>
    </div>
  </div>

</template>
<style scoped lang="less">

</style>
