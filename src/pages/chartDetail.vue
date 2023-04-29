<template>
  <div class="myContainer">
    <div id="index" ref="appRef">
      <div class="bg">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <div class="flex w-full h-full justify-center items-center flex-col">
            <Header class="resetBG" ref="headerRef" :show="shows" :title="title" @getClickedModel="getClickedModel">
            </Header>
            <div ref="testDiv"
              class=" flex relative gap-10 pt-24 pl-72 flex-row flex-1 w-full h-full lineGeadient  setBGImg">
              <div class="sideSection w-[20%] h-78 ">
                <FilterPanel :title="title1" class="w-full h-full"></FilterPanel>
                <ButtonWithTitle @export="exportPic" class=" h-[60%] w-full"></ButtonWithTitle>
              </div>
              <div class="main flex-1 h-full w-full pr-50">
                <div class="mainUp w-full h-[40%]">
                  <ReportTable :cols="divTableColsUp" :mainTitle="title2" :option="pieOption" :title="titleUp"
                    :data="divTableDataUp"></ReportTable>
                </div>
                <div class="mainDown w-full ">
                  <ReportTable :flag="true" :option="barOption" :cols="divTableColsDown" :title="titleDown"
                    :data="divTableDataDown">
                  </ReportTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import  dayjs from 'dayjs'
import { ElMessage } from 'element-plus';
import html2canvas from 'html2canvas'
import * as Rasterizehtml from "rasterizehtml";
import { pieOption, barOption } from '~/assets/utils/chartDetailOptions'
import useDraw from "~/assets/utils/useDraw";

const { appRef, calcRate, windowDraw } = useDraw();
let testDiv = ref()
let loading = ref(true)
let title = ref('测量报告')
let title1 = ref('过滤条件')
let title2 = ref('报告详情')
let titleUp = ref('白车身精度合格率')
let titleDown = ref('前围/后尾精度合格率')
let divTableColsUp = ref([
  {
    prop: '目标',
    val: '92%',
    id: 'Up01'
  },
  {
    prop: '不达标情况说明',
    val: '计划有变，导致不达标',
    id: 'Up02'
  },
  {
    prop: '测量日期',
    val: '2023-3-12',
    id: 'Up03'
  }
])
let divTableDataUp = ['', '', '2023-3-12']
let divTableColsDown = ref([
  {
    prop: '目标',
    val: '',
    id: 'Down01'
  },
  {
    prop: '不达标情况说明',
    val: '',
    id: 'Down02'
  },
  {
    prop: '测量日期',
    val: '',
    id: 'Down03'
  }
])
let divTableDataDown = ['', '', '2023-3-12']
let shows = ref({ logoShow: true, searchShow: false })
const getClickedModel = () => { }
const cancelLoading = () => {
  setTimeout(() => {
    loading.value = false;
    // chartRender()
  }, 500);
};
screen
const exportPic = () => {
  let capture = document.querySelector('#index') as HTMLElement;
  html2canvas(capture, {
    logging: false, //日志开关，便于查看html2canvas的内部执行流程
    width: capture.clientWidth, //dom 原始宽度
    height: capture.clientHeight,
    scale: 1,
    scrollY: 0,
    scrollX: 0,
    useCORS: true // 【重要】开启跨域配置
  }).then(canvas => {
    let a = document.createElement('a')
    let event = new MouseEvent('click');
    a.href = canvas.toDataURL()
    a.setAttribute('download', `测量报告-${dayjs().format('YYYYMMDDhhmmhh')}.png`)
    if (a.dispatchEvent(event)) {
      ElMessage('视图自动保存中，请注意查收！')
    }
  })
}

onMounted(() => {
  cancelLoading()
  calcRate()
  windowDraw()
})
</script>

<style lang="less" scoped>
@import "~/assets/scss/index.scss";

.mainDown {
  height: calc(100% - 40% - 4.25rem);
}

.resetBG {
  background: radial-gradient(#000915, #545a62);
}

.lineGeadient {
  // background: linear-gradient(to bottom, #0c151d, #e0e0e0);
}

.myContainer {}

.setBGImg {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    filter: drop-shadow(12px 13px 13px #1d5656) invert(10%);
    background-image: url('public/image/blurCar.png'), linear-gradient(to bottom, #0c151d, #e0e0e0);
    background-size: cover;

  }
}
</style>
