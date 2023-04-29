<template>
  <div class="w-full headers relative h-[55px] flex flex-row items-center justify-center ">
    <ArrowLeftBold @click="backIndex()" class=" cursor-pointer text-white h-5 w-5 ml-5
    
    
    " v-if="!show.logoShow" />
    <div v-if="show.logoShow" class="flex items-center h-full w-[28%]  justify-between pl-6">
      <img src="../assets/images/logo.png" class="w-[46%] h-auto mb-2">
      <span class="text-[#5d8290]">|</span>
      <span text-white class="text-lg pr-[0.2rem]">3D可视化在线测量质量追溯系统</span>
    </div>
    <div :class="{'flex-1':!show.logoShow}" class="flex  items-center justify-center w-1/2 h-full text-3xl text-white mb-1 font-semibold">{{ title }}</div>
    <UserMenu :class="show.searchShow?'':''" class="" />
    <MySearch v-if="show.searchShow" ref="mysearch" class="h1/2 flex-1" @recData=""></MySearch>
    <div  class="flex  items-center right ml-[auto] mr-5 justify-end h-full w-[175px]  text-white">{{ date }}</div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import MySearch from './mySearch.vue';
import UserMenu from './UserMenu.vue';

const router = useRouter()
let mysearch = ref()

function callSon(stationName,model) {
  if(mysearch.value) {
    mysearch.value.askGetCarTime(stationName,model)
  }
}
defineExpose({callSon})


const { title, show } = defineProps({
  title: String,
  show:{
    type:Object,
    default:{
      logoShow:true,
      searchShow:true
    }
  }
})


const backIndex = () => {
  router.back()
}
const date = ref()
let t: any;
const getTime = () => {
  let dt = new Date();
  var y = dt.getFullYear();
  var mt = dt.getMonth() + 1;
  var day = dt.getDate();
  var h = dt.getHours(); //获取时
  var m = dt.getMinutes(); //获取分
  var s = dt.getSeconds(); //获取秒
  date.value = dayjs(`${y + "-" + mt + "-" + day + "" + " " + h + ":" + m + ":" + s}`).format('YYYY-MM-DD HH:mm:ss');
};
getTime()
const cancleLoading = () => {
  setTimeout(() => {
    t = setTimeout(Time, 1000); //開始运行
  }, 1500);
};

const Time = () => {
  // 实时时间
  clearTimeout(t); //清除定时器
  getTime();
  t = setTimeout(Time, 1000); //设定定时器，循环运行!!!
};

onMounted(() => {
  cancleLoading()
})

</script>
<style lang="less" scoped>
.headers {
  background-image: url(~/assets/images/head.png);
  background-size: contain;
}
</style>
