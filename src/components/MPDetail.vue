<template>
    <div id="index" ref="appRef">
        <div class="bg">
            <dv-loading v-if="loading">Loading...</dv-loading>
            <div v-else class="host-body">
                <div class="myContainer flex w-full h-full justify-center items-center flex-col">
                    <Header :show="shows" :title="title"></Header>
                    <div class="content relative flex  flex-1 w-full min-h-0 bg-[#001637]">
                        <div
                            class="content-info z-[19990] relative bg-[url('~/assets/images/u809.png')] flex flex-col justify-around mt-3  top-73 left-36  w-[240px] h-[423px] ">
                            <div class="topSection flex flex-row  items-center">
                                <div class="topSection-titleWrap w-3/4 mr-auto  flex flex-row justify-start items-center">
                                    <div class="icon bg-[#00A5FF] h-2.1 w-1.2 -skew-x-12 m-4"></div>
                                    <span class="text-white text-base font-extrabold -skew-x-12">点位信息
                                    </span>
                                </div>
                                <CircleCloseFilled @click="windowClose" type=""
                                    class=" text-slate-300 w-5 h-5 mr-3 cursor-pointer" />
                            </div>
                            <div class="content-infoItem  relative flex flex-row justify-around  items-center w-full pt-3"
                                v-for="(v, i) in infos" :class="v.valD?'pt-5':''" :key="i">
                                <div class="pKey w-1/3 text-slate-400 text-sm ">{{ v.key }}</div>
                                <div class="pValue mr-auto flex-1 text-sm  ">{{ v.val }}</div>
                                <div v-if="v.valD" class="pKey   w-1/3 text-slate-400 text-sm mr-3">{{ v.keyD }}</div>
                                <div v-if="v.valD" class="pValue   mr-auto flex-1 text-sm mr-3">{{ v.valD }}</div>
                            </div>
                            <el-button class=" w-38 border-none bg-[#00A4FF] mx-auto" type="primary" size="default"
                                @click="gotoDetails">查看详情</el-button>

                        </div>
                        <div class="web3dWrap w-full h-full">
                            <Model3d class="h-full w-full" ref="web3dWrap_Model3d" :showInfo="false"></Model3d>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import useDraw from "~/assets/utils/useDraw";
let web3dWrap_Model3d = ref()
const loading = ref<boolean>(true);
const { appRef, calcRate, windowDraw } = useDraw();
const route = useRoute()
enum MPPosition {
    'BRE_FR_1' = `{ "x": -8.789941918653373, "y": 7.175763121888816, "z": 11.799836638074305 }`,
    'BRE_FL_1' = `{
    "x": -8.81683206279168,
    "y": 9.616576247730135,
    "z": -7.401684514225243
}`,
    'BRE_FL_2' = `{
    "x": -13.569474544716504,
    "y": 4.301919078434398,
    "z": -4.728937811273589
}`,
    'BRE_FR_2' = `{ "x": -10.991668522936605, "y": 5.651300461347553, "z": 11.522977091301591 }`,
    'BRE_FL_3' = `{
    "x": -10.069730123134866,
    "y": 1.9447160912716446,
    "z": -12.71963122117193
}`,
    'BRE_FR_3' = `{"x": -8.44297495694951,"y": 1.0625316702069174,"z": 15.534521826149005}`,
    'BRE_FL_4' = `{
    "x": -17.831531050239768,
    "y": 5.488664736232618,
    "z": -5.263282064783129
}`,
    'BRE_FR_4' = `{
    "x": -18.273553363192896,
    "y": 7.794754229328904,
    "z": -1.7095650505706972
}`,
    'BRE_FL_5' = `{
    "x": -20.178491962072176,
    "y": 5.147263372852876,
    "z": -3.918143875526729
}`,
    'BRE_FR_5' = `{
    "x": -22.360754752969765,
    "y": 5.427239276810445,
    "z": -0.5758854247884869
}`,

    'BRE_FL_6' = `{
    "x": -18.609724043835676,
    "y": 3.5167642571040214,
    "z": -4.135410311944964
}`,
    'BRE_FR_6' = `{
    "x": -17.942472039270193,
    "y": 4.4082807701372655,
    "z": 2.8208345407530895
}`,
    'BRE_FL_7' = `{
    "x": -21.00900046605783,
    "y": 2.7962121784251877,
    "z": -2.27917629187433
}`,
    'BRE_FR_7' = `{
    "x": -22.36288317451111,
    "y": 2.864679016803617,
    "z": 2.9279831236745922
}`,
    'BRE_FL_8' = `{
    "x": -22.8068480155911,
    "y": 1.4266769396906296,
    "z": -2.675361973773006
}`,
    'BRE_FR_8' = `{
    "x": -23.83214166345502,
    "y": 2.306985784804543,
    "z": 0.926475583173392
}`,
    'BRE_BL_8' = `{ "x": 3.140033493650975, "y": 2.7050325967679694, "z": -6.864928776954851 }`,
    'BRE_BR_8' = `{ "x": 0.6373243024087105, "y": 3.1448271564686916, "z": 14.977925106129153 }`,
    'BRE_BR_7' = `{ "x": 3.9786119289864956, "y": 6.060633912516765, "z": 11.869305549321412 }`,
    'BRE_BL_7' = `{
    "x": 4.8113472303097655,
    "y": 9.410268883146715,
    "z": -10.644142867148641
    }`,
    'BRE_BL_6' = `{ "x": 4.380977847964381, "y": 8.681973827665947, "z": -8.60607829266661 }`,
    'BRE_BR_6' = `{ "x": 8.083508395716324, "y": 5.69095067454782, "z": 14.54013721453291 }`,
    'BRE_BL_5' = `{
    "x": 13.843719549822836,
    "y": 7.523683271995223,
    "z": -2.8328521556129034
}`,
    'BRE_BR_5' = `{
    "x": 14.454530040784375,
    "y": 6.990127010094366,
    "z": 3.9429829620341708
}`,
    'BRE_BR_4' = `{
    "x": 15.145980906724711,
    "y": 4.094719469711086,
    "z": 5.858773050146681
}`,
    'BRE_BL_4' = `{
    "x": 11.750658650390026,
    "y": 5.379186725799128,
    "z": -7.614878295219203
}`,
    'BRE_BR_3' = `{
    "x": 18.231631532355966,
    "y": 0.5470030420593552,
    "z": 1.8759048463590915
}`,
    'BRE_BL_3' = `{
    "x": 18.35524767324203,
    "y": 0.7864758561654291,
    "z": -1.2719224526707784
}`,
    'BRE_BR_2' = `{
    "x": 18.187028721775143,
    "y": 2.7393844378594774,
    "z": 4.144128809831427
}`,
    'BRE_BL_2' = `{
    "x": 17.02565844764774,
    "y": 2.8273297274667466,
    "z": -2.866590829919837
}`,
    'BRE_BR_1' = `{
    "x": 18.30113124444182,
    "y": 1.3876053349709643,
    "z": 4.283635656650392
}`,
    'BRE_BL_1' = `{
    "x": 15.051621653174251,
    "y": 2.8650757957629533,
    "z": -8.099226126064114
}`,
}
interface show {
    logoShow?: boolean,
    searchShow?: boolean
}
const router = useRouter()
let infos = ref([
    { key: '时间', val: '2023年4月11日16:16:36' },
    { key: '点位号', val: '825B_FL_1' },
    { key: 'X', val: '0.14', keyD: 'DX', valD: '0.14' },
    { key: 'Y', val: '0.33', keyD: 'DY', valD: '0.33' },
    { key: 'Z', val: '0.22', keyD: 'DZ', valD: '0.22' },

]);
const title = ref('智能生态工厂数字化中心')
const shows = ref<show>({ logoShow: true, searchShow: true })
const o = JSON.parse(route.query.XYZ as string);
if (route.query) {
    Object.entries(o).forEach((v, i) => {
        switch (v[0]) {
            case 'x':
                infos.value[2].val = o.x
                infos.value[2].valD = o.dx
                break;
                break;
            case 'y':
                infos.value[3].val = o.y
                infos.value[3].valD = o.dy
                break;
            case 'z':
                infos.value[4].val = o.z
                infos.value[4].valD = o.dz
                break;
            case 'partName':
                infos.value[0].val = o.eventTime!
                break;
            default:
                infos.value[1].val = o.partName
                break;
        }

    })
}
const cancelLoading = () => {
    setTimeout(() => {
        loading.value = false;
        // chartRender()
    }, 500);
};
function windowClose() {
    window.close()
    // 只有 window.open()  方式为_blank可以关闭 
}
function gotoDetails() {
    router.push({ path: '/details', query: { id: o.id, pointName: o.partName,stationName:o.stationName } })
}
onMounted(() => {
    cancelLoading()
    calcRate()
    windowDraw();
})
onUpdated(async () => {
    let querys: { x: string, y: string, z: string, id: number, curModel: string, partName: string, position: Array<number> } = JSON.parse(route.query.XYZ as string);
    setTimeout(async () => {
        web3dWrap_Model3d.value.addLabelByRouteQuery(querys.position)
        let { camera, control } = web3dWrap_Model3d.value.getCameraAndControl()
        let xyz = JSON.parse(MPPosition[querys.partName])
        const position = [xyz.x, xyz.y, xyz.z];
        const moveTo = new THREE.Vector3(...position);
        // await web3dWrap_Model3d.value.animateCamera(camera.position, moveTo, control.target, control.target)
    }, 3200);
})
</script>
<style lang="less" scoped>
@import "~/assets/scss/index.scss";

.myContainer {}

.content-infoItem {
    border-bottom: none !important;
    line-height: 32px;
    .pKey {}

    .pValue {
        font-family: "Arial Normal", Arial, sans-serif;
    }

    // :not(&:last-of-type) 
    &:not(&:last-of-type)::before {
        content: '';
        position: absolute;
        left: 18px;
        top: auto;
        bottom: -24px;
        right: 18px;
        height: 1px;
        width: calc(100%- 36px);
        background-color: #052E61;
    }

    &::after {
        content: '';
        position: absolute;

    }
}
</style>
