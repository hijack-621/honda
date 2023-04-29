<script setup lang="ts">
import {
  ref,
  getCurrentInstance,
  nextTick,
} from "vue";
// import { useStore } from "vuex";
// const store = useStore();
const q_pie = ref();
const Qpie_Dom = ref();
const { proxy } = getCurrentInstance();
const { option, pdata } = defineProps({
  option: {
    type: Object,
  },
  pdata: {
    type: Array,
  },
});
const refOption: Record<string, any> = ref(option);
const t = [[]] as any;
const oo = {} as any
function handledata(data: any[] | undefined, pid = 16) {
  const temp = data!.filter((v: { pointId: number; }) => {
    return v.pointId * 1 === pid * 1;
  });

  // const t = [[]] as any;
  const keys = ["perfectRate", "wellRate", "warnRate", "errorRate"];
  Object.keys(temp[0]).forEach((v) => {
    if (keys.includes(v)) {
      temp[0][v] = (temp[0][v] * 100).toFixed(2);
      t[0].push({ name: v, value: temp[0][v] });
      oo[`${v}`] = { value: temp[0][v] }
    }
  });
  refOption.value.series.forEach((s: { data: { value: number; name: string; }[]; }, i: string | number) => {
    if (t[i].length == 0) {
      s.data = [
        { value: 0, name: "perfectRate", },
        { value: 0, name: "wellRate" },
        { value: 0, name: "warnRate" },
        { value: 0, name: "errorRate" },
      ];
    } else {
      s.data = t[i];
    }
  });

}
handledata(pdata);

const reRender = (data: any, e: number | undefined, r?: any) => {
  handledata(data, e);
  refOption.value.title.forEach((e: { text: string; }) => {
    e.text = e.text.replace(/[0-9]+[a-z]+/gi, store.state.currentModel);
  });
  const Dom = Qpie_Dom.value;
  const myChart = proxy.$echarts.init(Dom);
  data && myChart.setOption(refOption.value);
};
defineExpose({ reRender });
onMounted(async () => {
  const Dom = Qpie_Dom.value;
  const myChart = proxy.$echart.init(Dom);
  refOption.value.legend.formatter = (name: string) => {
    return name + ' ' + oo[`${name}`].value + '%'
  }
  pdata && myChart.setOption(refOption.value);
  myChart.dispatchAction(
    {
    type: "select",
    seriesIndex: 0,
    dataIndex: [0,1,3,4]
    },
  ); //设置默认选中高亮部分

});
</script>
<template>
  <div class="Qpie_container">
    <div ref="Qpie_Dom" class="Qpie_Dom"></div>
    <!-- <div class="left">321</div>
  <div class="right">123</div> -->
    <div class="Qpie_desc"></div>
  </div>
</template>
<style scoped lang="less">
.Qpie_container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: space-between;

  .Qpie_Dom {
    width: 100%;
    margin: 0 auto;
  }

  .left {
    width: 48%;
  }

  .right {
    width: 48%;
  }

  .Qpie_desc {
    position: absolute;
    left: 50%;
    bottom: 0;
  }
}
</style>
