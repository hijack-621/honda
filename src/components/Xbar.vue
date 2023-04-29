<template>
  <div class="xbarBox text-white" ref="xbar">123</div>
</template>

<script lang="ts" setup>
const xbar = ref()
const { proxy } = getCurrentInstance() as any
const {data}  = defineProps({
  data:Object
})

const refOption = ref(data);

nextTick(() => {
  const dom = xbar.value
  if (dom) {
    const myChart = proxy.$echart.init(dom);
    myChart.resize({ height: 'auto' })
    myChart.setOption(refOption.value);
  }
})

</script>

<style lang='less'>
.xbarBox {
  width: 100%;
  height: 100%;
}
</style>