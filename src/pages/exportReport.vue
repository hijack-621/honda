<script setup lang="ts">
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { isUndefined, debounce } from 'lodash';
import FileSaver from "file-saver";
import XLSX from "xlsx";
import useDraw from "~/assets/utils/useDraw";
import { searchByParams } from '~/types/interface'
const { proxy } = getCurrentInstance() as any;
let router = useRouter()
let id = useRoute().query.id
let model = (useRoute().query.pointName! as unknown as string).split('_')[0]
let pointName = useRoute().query.pointName
let stationName = useRoute().query.stationName!
interface show {
    logoShow?: boolean,
    searchShow?: boolean
}
interface tableHeader {
    DD: string,
    GW: string,
    type?: string,
    cType?: string,
    date?: string,
    VIN?: string,
    mpName?: string | number,
    X?: string | number,
    Z?: string | number,
    Y?: string | number,
    DX?: string | number,
    DY?: string | number,
    DZ?: string | number,
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
let exportSymmetry = ref(false)
const { appRef, calcRate, windowDraw } = useDraw();
const initOptions = ref([20, 50, 100, 200, 500, 1000])
const customTimes = ref<number>()
const loading = ref<boolean>(true);
const startPicker = ref<string>()
const endPicker = ref<string>()
//按开始日期导出，截止到今天。
endPicker.value = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
const modelSelected = ref<string>(model);
const SNSelected = ref<any>(stationName);
const MPSelected = ref<string>('');// elselect  多选开启，这里就是数组！！！
const modelSelect = ref([
    { label: 'BRE', value: 'BRE', selected: true, },
    { label: 'CRD', value: 'CRD' },
    { label: 'Z-RV', value: 'Z-RV' },
    { label: 'INT4D', value: 'INT4D' },
    { label: 'INT5D', value: 'INT5D' },
])
const SNSelect = ref([{ label: 'GW', value: 'GW', selected: true, }, { label: 'SR', value: 'SR', selected: false, }])
const MPSelect = ref<Array<{ label: string, options: Array<{ label: string, value: string }> }>>([])
const columns = ref([
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
const MesTabData = ref<tableHeader[]>([])
const shows = ref<show>({ logoShow: false, searchShow: false })
const title = ref('导出报表')
let defaultStationName = ref(stationName)
let defaultFeature = ref(`${pointName}`)
MPSelected.value = defaultFeature.value
const stn = 200;
let defaultNum = ref(stn)
const startTime = ref()
const endTime = ref()
const radio = ref('')// radio  label 就是值
const options = [
    {
        label: 'Left',
        options: [] as Array<{ value: string, label: string }>,
    },
    {
        label: 'Right',
        options: [],
    },
]
const getMPs = async () => {
    const server = '/api/display/getStationDetails'
    const { data } = await proxy.$http.get(server, {
        params: {
            productPrototypeSubModel: modelSelected.value,
            stationName: SNSelected.value
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
    let MPs = data.dataList as Array<searchByParams>
    options[0].options = []
    options[1].options = []
    MPs.forEach(v => {
        let o = {
            value: v.pointName,
            label: v.pointName
        }

        if (v.pointName.slice(3).includes('L')) { // 左测点
            options[0].options.push(o)
        } else if (v.pointName) {
            options[1].options.push(o)
        }
    })

    MPSelect.value = options
}
const reRenderTableByMP = (MP: string) => {
    initData(false, SNSelected.value, MPSelected.value, defaultNum.value, modelSelected.value)
}
const cancelLoading = () => {
    setTimeout(() => {
        loading.value = false;
        // chartRender()
    }, 500);
};
function initData(asc: boolean, stationName: string, pointName: string | number, count: number | undefined, productPrototypeSubModel: string, startTime?: string, endTime?: string) {
    const server = "api/display/searchByParams";
    let params: {
        startTime?: string,
        endTime?: string | undefined,
        asc?: boolean,
        stationName?: string,
        pointName?: string | number,
        productPrototypeSubModel?: string,
        count?: number
    };
    if (startTime !== undefined) {
        params = {
            startTime,
            endTime,
            asc,
            stationName,
            pointName,
            productPrototypeSubModel,
        }
    }
    else {
        params = {
            asc,
            stationName,
            pointName,
            productPrototypeSubModel,
        }
    }
    if (!isUndefined(count)) {
        params.count = count
    }
    proxy.$http.post(server, params, {
        headers: {
            token: localStorage.getItem('token')
        }
    }).then((v: any) => {
        const { status, data } = v;
        let tmp: tableHeader[] = [];
        if (status == 200) {
            data.forEach((d: searchByParams, i: number) => {
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
                tmp.push(o)
            })
            MesTabData.value = tmp
        }
        else if (v.status == 401) {
            ElMessage('请登录后在操作！');
            router.push('/login')
            return;
        }
    }).catch((e: any) => {
        if (e.response.data.status == 401) {
            ElMessage('登录凭证失效,请登录后在操作！');
            setTimeout(() => {
                router.push('/login')
            }, 500);
            return;
        } else {
            ElMessage(`${e.response.data.status + '-' + e.response.data.error}`);
            return;
        }

    })
}
function formatTime(pre) {
    if (!isUndefined(pre)) {
        const cur = dayjs(pre).format('YYYY-MM-DD HH:mm:ss')
        return cur
    }
}
function setCustomTimes(v: number) {
    defaultNum.value = v * 1
}
function query() {
    let __;
    if (radio.value == '') {
        ElMessage('请选择查询条件后在查询！')
        return
    }
    switch (radio.value) {
        case '按时间段导出':
            if ((!isUndefined(startTime.value))
                && (!isUndefined(endTime.value))
                && (dayjs(startTime.value).valueOf() < dayjs(endTime.value).valueOf())) {
                if (typeof MPSelected.value !== 'number') {
                    initData(false, SNSelected.value, MPSelected.value.split('=')[0].trim(), __, modelSelected.value, formatTime(startTime.value), formatTime(endTime.value))
                } else {
                    initData(false, SNSelected.value, MPSelected.value, __, modelSelected.value, formatTime(startTime.value), formatTime(endTime.value))
                }
            } else {
                ElMessage('时间段选择有误，请重新选择！');
                return
            }
            break;
        case '按起始日期导出':
            if (!isUndefined(startPicker.value)) {
                // console.log(endTime.value)
                if (typeof MPSelected.value !== 'number') {
                    initData(false, SNSelected.value, MPSelected.value.split('=')[0].trim(), __, modelSelected.value, formatTime(startPicker.value))
                } else {
                    initData(false, SNSelected.value, MPSelected.value, __, modelSelected.value, formatTime(startPicker.value))
                }
            }
            break;
        case '按次数导出':
            if (!isUndefined(customTimes.value)) {
                if (typeof MPSelected.value !== 'number') {
                    initData(false, SNSelected.value, MPSelected.value.split('=')[0].trim(), defaultNum.value, modelSelected.value)
                } else {
                    initData(false, SNSelected.value, MPSelected.value, defaultNum.value, modelSelected.value)
                }
            }
            break;
        case '':
            if (typeof MPSelected.value !== 'number') {
                initData(false, SNSelected.value, MPSelected.value.split('=')[0].trim(), defaultNum.value, modelSelected.value, formatTime(startTime.value), formatTime(endTime.value))
            } else {
                initData(false, SNSelected.value, MPSelected.value, defaultNum.value, modelSelected.value, formatTime(startTime.value), formatTime(endTime.value))
            } break;
    }
}
function beginExport() {
    if (exportSymmetry.value) {
        let url = 'api/excel/getExcelByPointName';
        let params = {
            asc: false,
            count: defaultNum.value,
            startTime: !isUndefined(startTime.value) ? formatTime(startTime.value) : '',
            endTime: !isUndefined(endTime.value) ? formatTime(endTime.value) : '',
            pointName: MPSelected.value,
            stationName: SNSelected.value
        }
        proxy.$http.post(url, params, {
            responseType: 'blob',
            headers: {
                token: localStorage.getItem('token')
            }
        }).then(v => {
            console.log(v)
            let { data, status } = v;
            if (status == 200) {
                let blob = new Blob([data], { type: "application/vnd.ms-excel" });
                let fileUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.setAttribute("href", fileUrl);
                a.setAttribute("download", `${modelSelected.value}-${dayjs(new Date()).format('YYYYMMDD HH:mm:ss')}.xlsx`);
                ElMessage('正在自动下载中，请注意查收!!!')
                a.click();
            }
        }).catch(e => {
            console.log(e)
        })
    } else {
        var xlsxParam = { raw: true };
        /* 从表生成工作簿对象 */
        var wb = XLSX.utils.table_to_book(
            document.querySelector("#exportTID"),
            xlsxParam
        );
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array",
        });
        try {
            ElMessage('正在自动下载中，请注意查收！')
            FileSaver.saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                `${modelSelected.value}-${dayjs(new Date()).format('YYYYMMDD HH:mm:ss')}.xlsx`,////设置导出文件名称
            );
        } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
    }

}
onMounted(() => {
    calcRate()
    windowDraw()
    cancelLoading()
    getMPs()
    initData(false, defaultStationName.value as any, defaultFeature.value.split('=')[0].trim(), defaultNum.value, modelSelected.value)
})
watch(radio, (cur, pre) => {
    debounce(() => ElMessage(`修改查询模式为:${cur}!`), 650)()
})
watch(exportSymmetry, (cur) => {

})
</script>

<template>
    <div id="index" ref="appRef">
        <div class="bg">
            <dv-loading v-if="loading">Loading...</dv-loading>
            <div v-else class="host-body">
                <div class="myContainer w-full h-full ">
                    <Header :title="title" :show="shows"></Header>
                    <div
                        class="detailsWrap w-full relative   flex flex-row bg-gradient-to-r from-[#001638] via-[#006395]  to-[#002144] ">

                        <div class="contentWrap w-full  m-6 bg-[#03334A] flex flex-col justify-center items-center">
                            <div class="measureTable relative flex-1 w-full h-full flex justify-center items-center">
                                <el-table id="exportTID" height="550" class=" w-[98%]   " :data="MesTabData" border>
                                    <el-table-column align="center" :width="col.width" v-for="(col, index) in columns"
                                        :prop="col.prop" :key="index" :label="col.label">
                                    </el-table-column>
                                </el-table>
                                <el-pagination class="absolute right-8 bottom-8 " layout="total"
                                    :total="MesTabData.length" />
                            </div>

                            <div class="selectModel h-[15%] w-full flex flex-row gap-1 justify-startkan1 items-start pl-6">
                                <div class="selectModelWrap">
                                    <div class="sMtitle text-white pb-2 font-black text-[15px] text-left">选择车型</div>
                                    <el-select class=" h-6 ml-6 w-54" v-model="modelSelected" value-key="" placeholder=""
                                        clearable filterable @change="">
                                        <el-option v-for="option in modelSelect" selected :key="option.label"
                                            :label="option.label" :value="option.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="selectModelWrap">
                                    <div class="sMtitle text-white pb-2 font-black text-[15px] text-left">选择工位</div>
                                    <el-select class=" h-6 ml-6 w-54" v-model="SNSelected" value-key="" placeholder=""
                                        clearable filterable @change="getMPs">
                                        <el-option v-for="item in SNSelect" selected :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="selectModelWrap">
                                    <div class="sMtitle text-white pb-2 font-black text-[15px] text-left">选择点位</div>
                                    <el-select class=" h-6 ml-6 w-54" v-model="MPSelected" value-key="" placeholder=""
                                        clearable filterable @change="reRenderTableByMP">
                                        <el-option-group v-for="item in MPSelect" :key="item.label" :label="item.label">
                                            <el-option v-for="option in item.options" selected :key="option.label"
                                                :label="option.label" :value="option.value">
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </div>
                            </div>
                            <div class="exportMode w-full  h-[15%] flex flex-row pl-6">
                                <div class="exportByTimeInterval w-2/6 flex flex-col items-start">
                                    <div class="EBTI-title flex w-full justify-start items-center">
                                        <!-- <div class="icon w-3 h-3 relative mr-3"></div> -->
                                        <el-radio v-model="radio" class="text-slate-500 text-[15px] font-extrabold"
                                            label="按时间段导出" @change=""></el-radio>
                                    </div>
                                    <div class="datePicker w-[66%] flex  justify-start items-center mt-3 ml-5 ">
                                        <div class="timeStart w-full flex justify-start">
                                            <el-date-picker class="w-full mr-3" v-model="startTime" type="datetime"
                                                placeholder="开始时间" :prefix-icon="customStartPrefix" />
                                        </div>
                                        <div class="timeEnd w-full flex justify-start">
                                            <el-date-picker class="w-full" v-model="endTime" type="datetime"
                                                placeholder="结束时间" :prefix-icon="customEndPrefix" />
                                        </div>
                                    </div>
                                </div>
                                <div class="exportByStart w-1/6 flex flex-col">
                                    <el-radio class="text-slate-500 text-[15px] font-extrabold" v-model="radio"
                                        label="按起始日期导出" @change=""></el-radio>
                                    <div class="StartPicker flex flex-start items-center mt-1">
                                        <el-date-picker class="w-full" v-model="startPicker" type="datetime"
                                            placeholder="开始时间" :prefix-icon="customStartPrefix" />
                                    </div>
                                </div>
                                <div class="exportByTimes w-1/6 flex flex-col">
                                    <el-radio class="text-slate-500 font-extrabold" v-model="radio" label="按次数导出"
                                        @change=""></el-radio>
                                    <div class="exportByTimes-wrap flex flex-start items-center mt-1">
                                        <span class=" text-slate-400 mr-3">最近:</span>
                                        <el-select @change="setCustomTimes" title="自定义数量请输入后按下回车键" v-model="customTimes"
                                            filterable allow-create default-first-option :reserve-keyword="false"
                                            placeholder="n次测量">
                                            <el-option v-for="item in initOptions" :key="item" :label="item"
                                                :value="item" />
                                        </el-select>
                                    </div>
                                </div>
                                <div class="exportBySymmetry w-1/6 flex flex-col pt-2 ">
                                    <div class="sMtitle text-slate-500 font-extrabold pb-2 text-[15px] text-left">导出对称点数据
                                    </div>
                                    <el-switch v-model="exportSymmetry" active-text="Yes" inactive-text="No" />
                                </div>
                                <div class="opButtons w-1/6 flex justify-center items-center">
                                    <div class="flex flex-col w-1/3 gap-2">
                                        <el-button class=" border-[#ffffff40]  bg-[#232835]" type="primary" size="default"
                                            @click="query">查询</el-button>
                                        <el-button class=" bg-[#00A5FF] !m-0" type="primary" size="default"
                                            @click="beginExport">导出</el-button>
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
.el-time-panel {
    z-index: inherit !important;
}

.exportMode {
    .exportByTimeInterval {
        .EBTI-title {
            .icon {
                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 120%;
                    height: 120%;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                }

                &::after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-30%, -30%);
                    width: 50%;
                    height: 50%;
                    background-color: #00Afff;
                    border-radius: 50%;
                }
            }
        }

        :deep(.el-radio__input .el-radio__inner) {
            background-color: #090B12 !important;
            border: 1px solid rgba(255, 255, 255, .25);
        }
    }

    .exportByStart,
    .exportByTimes {
        :deep(.el-radio .el-radio__inner) {
            background-color: #090B12;
            border: 1px solid #ffffff40;
        }
    }
}

.exportByTimes-wrap {
    :deep(.el-select .el-input__wrapper .el-input__inner) {
        &::placeholder {
            color: rgba(255, 255, 255, .5) !important;
        }
    }
}


:deep(.el-input__wrapper) {
    height: 26px !important;
    background-color: #090B12 !important;
    border: none !important;
    box-shadow: none !important;

    .el-input__inner::placeholder {
        color: #fff !important;
        border: none !important;
    }

}

:deep(.el-select .el-input .el-select__caret) {
    color: #fff !important;
}

:deep(.el-table) {
    --el-table-border-color: rgb(41, 46, 52);
    --el-table-border: 1px solid var(--el-table-border-color);
    --el-table-text-color: #fff;
    --el-table-header-text-color: #fff;
    --el-table-header-bg-color: #090B12;
    --el-table-tr-bg-color: #090B12;
    height: 95% !important;
    background-color: #090B12 !important;

    .el-table__row:hover {
        color: #090B12 !important;
    }
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
    background-color: #090B12 !important;
}

:deep(.el-table__header-wrapper) {
    table thead tr {
        color: rgba(255, 255, 255, .5);
        font-size: small;
        font-family: 'Arial Normal', Arial, sans-serif;
    }
}

.myContainer {
    .detailsWrap {
        height: calc(100% - 75px);
    }
}

.el-button+.el-button {
    margin-left: 8px;
}
</style>
