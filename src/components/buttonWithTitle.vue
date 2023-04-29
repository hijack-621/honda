<template>
  <div class="myContainer buttonWithTitle">
    <div class="buttonWithTitle_title text-white text-left text-base  p-3">{{ title }}</div>
    <el-button @click="exportReport" class=" bg-[#00a5ff] w-[65%] h-10 mt-3" type="primary"> <img class="p-1 m-1" src="/public/image/download.png" alt="download"> 导出报告</el-button>
  </div>
</template>

<script setup lang="ts">

let title = ref('导出报告')
let emit = defineEmits(['export'])
const exportReport = () => {
  emit('export', () => {
    console.log(111)
  })
}
</script>

<style lang="less" scoped>
 .myContainer {
 }
 .buttonWithTitle{
    background: rgba(12, 21, 29, 0.95);
    border: 1px solid #172d3e;
    border-top: none;
    border-top-right-radius: 1px;
    border-top-left-radius: 1px;
 }
</style>
