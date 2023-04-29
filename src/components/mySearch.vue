<template>
    <div class="myContainer  text-white">
        <el-select clearable class="setBg" @change="SearchSome" v-model="vm" placeholder="搜索车型...">
            <template #prefix>
                <span style="padding-left: 5px;">
                    <Search style="width: 1em; height: 1em; margin-right: 8px" />
                </span>
            </template>
            <el-option v-for="(option, key) in ops" :key="key" :label="baseStr + option.label + '  ' + option.time"
                :value="option.value">
            </el-option>
            <el-button @click="customSearch()" class=" w-full bg-blue-400 text-white" type="primary">自定义搜索</el-button>
        </el-select>
        <s3-layer :shadeClose="true" v-model="visible" :title="title" :area="['75vw', '550px']" :shade="[.8, '#c2c2c2']">
            <el-row class="index ">
                <el-col class="Model flex flex-col justify-start items-center" :span="3">
                    <p>选择车型</p>
                    <el-select v-model="carModel" value-key="" placeholder="请选择" clearable filterable @change="">
                        <el-option v-for="item in carData" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col class="Model flex flex-col justify-start items-center mx-5" :span="3">
                    <p>选择工位</p>
                    <el-select v-model="MBselect" value-key="" placeholder="请选择" clearable filterable @change="">
                        <el-option v-for="item in MBData" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                </el-col>
                <el-col class="timeArea flex flex-col justify-center items-center" :span="9">
                    <p style="break-before: always;">选择时间段</p>
                    <el-date-picker class=" !w-[70%] -ml-8" style="z-index: 19999999;" v-model="timeRange" @change=""
                        type="datetimerange" range-separator="到" start-placeholder="" end-placeholder="" />
                </el-col>
                <el-col class="timeArea flex flex-col justify-center items-center" :span="3">
                    <p style="break-before: always;">输入车身号</p>
                    <el-input v-model="inputCarBody" placeholder="输入车身号" clearable />
                </el-col>
                <el-col class="flex flex-col justify-center items-center ml-3 mt-3" :span="3">
                    <el-button type="primary" class="bg-blue-400 text-white h-1/2 w-full mt-3" size="default"
                        @click="startSearch()">搜索</el-button>
                </el-col>
            </el-row>
            <div class="result mt-5">
                <el-table :data="tabData" class="cursor-pointer" height="410" @row-click="SearchSome" border>
                    <el-table-column v-for="col in columns" :prop="col.prop" :key="col.prop" :label="col.label">
                    </el-table-column>
                </el-table>
                <el-pagination class="absolute right-3 top-25 z-[889999]" layout="total" :total="tabData.length" />
            </div>
        </s3-layer>
        <s3-layer :shadeClose="true" :move="false" v-model="visible2" title="车身号信息" :area="['85vw', '85vh']"
            :shade="[.8, '#c2c2c2']">
            <div class="wrap w-full h-full flex flex-col gap-5">
                <div class="sectionUp w-full h-1/2 gap-5 flex flex-row">
                    <div class="left w-1/2 flex justify-center items-center p-5 bg-[#37444E] ">
                        <el-descriptions class="w-full !h-full flex flex-col justify-around !border-none !bg-[#37444E]"
                            :title="titleS1" :column="2" size="large" border>
                            <el-descriptions-item :key="index" v-for="(item, index) in descData" :label="item.label">{{
                                item.value }}</el-descriptions-item>
                        </el-descriptions>
                    </div>
                    <div class="right flex-1 flex flex-col p-5 bg-[#37444E]">
                        <div class="errorBarChart_title text-base font-bold pt-4.5 text-gray-300">整体测点合格情况</div>
                        <div ref="errorBarChart" class="errorBarChart w-full h-full">

                        </div>
                    </div>
                </div>
                <div class="sectionDown flex-1 w-full gap-5  flex flex-row">
                    <div class="left w-1/2 relative p-5 bg-[#37444E]">
                        <div class="title text-base font-bold pb-3 text-gray-300">点位一览列表</div>
                        <el-table :data="list" class="cursor-pointer" height="300" @row-click="" border>
                            <el-table-column v-for="col in MPColumns" :width="col.width" :prop="col.prop" :key="col.prop"
                                :label="col.label">
                            </el-table-column>
                        </el-table>
                        <el-pagination v-if="list.length > 0" class="absolute right-3 top-14.5 z-[889999]" layout="total"
                            :total="list.length" />
                    </div>
                    <div class="right p-5 bg-[#37444E] flex-1 w-full h-full flex flex-col">
                        <div class="MPSel flex flex-row h-9">
                            <label class=" leading-9 text-base font-bold mr-3 text-gray-300">选择点位</label>
                            <el-select class="mt-1.5" v-model="MPSelled" value-key="" placeholder="请选择" clearable filterable
                                @change="PMChange">
                                <el-option v-for="item in MPSel" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div ref="lineSingle" class="lineSingle  w-full flex-1">

                        </div>
                    </div>
                </div>
            </div>
        </s3-layer>
    </div>
</template>

<script setup lang="ts">
let router = useRouter()
import { ElMessage } from 'element-plus';
import { isUndefined } from 'loadsh'
import { single_option } from '~/assets/utils/singleData';
import { error_option } from '~/assets/utils/errorData';
import { getCurrentInstance } from 'vue'
import dayjs from 'dayjs';
let errorBarChart = ref()
let lineSingle = ref()
let inputCarBody = ref('')
const ref_error_option = ref(error_option)
const ref_single_option = ref(single_option)
const emit = defineEmits(['recData']);
let getCarTime = 'api/display/getCarTime'
let year = dayjs(new Date()).get('year')
let month = dayjs(new Date()).get('month') + 1
let startTime = `${year + '-' + month + '-' + '01' + ' 00:00:00'}`
let endTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
let defaultST = ref('')
let defaultModel = ref('')
let MPSelled = ref('')
let list = ref<any[]>([])
let { proxy } = getCurrentInstance()! as any
const tabData = ref<any[]>([]);
const carModel = ref()
const MBselect = ref()
const vm = ref([]);
const ops = ref<{ value: string, label: string, time: string, model?: string }[]>();
const baseStr = '车号:   '
const visible = ref(false)
const visible2 = ref(false)
const title = '车身号搜索'
const titleS1 = ref(title)
const rankClass = ref<number[]>([])
const descData = ref([
    {
        label: '时间:',
        key: 'eventTime',
        value: ''
    },
    {
        label: '车身号:',
        key: 'bodyNumber',
        value: ''
    },
    {
        label: '车型:',
        key: 'productPrototypeSubModel',
        value: ''
    },
    {
        label: '工位:',
        key: 'stationName',
        value: ''
    },
    {
        label: '合格率:',
        key: 'passRate',
        value: ''
    },
    {
        label: '托盘号:',
        key: 'TPno',
        value: '1号'
    },
]);
const columns = [
    {
        prop: 'bodyNumber',
        label: '车身号',
    },
    {
        prop: 'eventTime',
        label: '时间',
    },
    {
        prop: 'productPrototypeSubModel',
        label: '车型',
    }
];
const MPColumns = [
    {
        prop: 'pointName',
        label: '点位名',
        width: 110
    },

    {
        prop: 'txObserValue',
        label: 'X',

    },
    {
        prop: 'tyObserValue',
        label: 'Y',

    },
    {
        prop: 'tzObserValue',
        label: 'Z',

    },
    {
        prop: 'txObserDevia',
        label: 'DX',

    },
    {
        prop: 'tyObserDevia',
        label: 'DY',

    },
    {
        prop: 'tzObserDevia',
        label: 'DZ',
        width: 83
    },
    {
        prop: 'eventTime',
        label: '时间',
        width: 163
    }
];
const timeRange = ref([
    dayjs(new Date()).format('YYYY-MM-DD 00:00:00'),
    dayjs(new Date()).format('YYYY-MM-DD 23:59:59'),
])
const MBData = ref([
    {
        name: 'GW',
        value: 'GW',
        label: 'GW'
    },
    {
        name: 'SR',
        value: 'SR',
        label: 'SR'
    }
])
const carData = ref([
    {
        name: 'BRE',
        value: 'BRE',
        label: 'BRE'
    },
    { label: 'CRD', value: 'CRD', name: 'CRD', },
    { label: 'Z-RV', value: 'Z-RV', name: 'Z-RV' },
    { label: 'INT4D', value: 'INT4D', name: 'INT4D' },
    { label: 'INT5D', value: 'INT5D', name: 'INT5D' },
]);
ops.value = [
    {
        value: 'BRE',
        label: 'BRE',
        time: ''
    }
]
const MPSel = ref([
    {
        name: '',
        value: '',
        label: ''
    }
])

//注入先人节点数据
// const stationName = ref(inject('stationName'))

const SearchSome = (row, column, event) => {
    const layer = (window as any).layer;
    switch (typeof row) {
        case 'object':
            let { bodyNumber, eventTime, productPrototypeSubModel } = row
            setTimeout(() => {
                new Promise((resolve, reject) => {
                    resolve(layer.closeAll())
                }).then(v => {
                    visible2.value = true;
                    let url = 'api/display/getCarDetails';
                    proxy.$http.get(url, {
                        params: {
                            bodyNumber,
                            startTime: eventTime,
                            endTime: eventTime
                        },
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    }).then(v => {
                        const { data, status } = v
                        if (status == 200) {
                            initChart()
                            titleS1.value = `${data.bodyNumber}-信息`
                            descData.value[0].value = eventTime
                            descData.value[1].value = bodyNumber
                            descData.value[2].value = productPrototypeSubModel
                            descData.value[3].value = 'GW&SR'
                            descData.value[4].value = (data.passRate * 100).toFixed(1) + '%'
                            let t = data.dataList.sort((a, b) => {
                                return a.productPrototypeFeature - b.productPrototypeFeature
                            })
                            MPSel.value = [];
                            data.dataList.forEach((v) => {
                                MPSel.value.push(
                                    {
                                        name: v.pointName,
                                        value: v.pointName,
                                        label: v.pointName
                                    }
                                )
                            })
                            MPSelled.value = MPSel.value[0].value
                            list.value = t
                            rankClass.value = [];
                            rankClass.value.push(data.perfectCount, data.wellCount, data.warnCount, data.errorCount);
                            renderChart()
                            renderLine(MPSelled.value, productPrototypeSubModel, data.stationName)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                })
                layer.msg('查询  ok', { icon: 1, time: 1300 });
            }, 550);
            break;
        case 'string':
            {
                let t = row.split(' ');
                let bodyNumber = t[0];
                let eventTime = [t[1], t[2]].join(' ')
                setTimeout(() => {
                    new Promise((resolve, reject) => {
                        resolve(layer.closeAll())
                    }).then(v => {
                        visible2.value = true;
                        let url = 'api/display/getCarDetails';
                        proxy.$http.get(url, {
                            params: {
                                bodyNumber,
                                startTime: eventTime,
                                endTime: eventTime
                            },
                            headers: {
                                token: localStorage.getItem('token')
                            }
                        }).then(v => {
                            const { data, status } = v
                            if (status == 200) {
                                initChart()
                                titleS1.value = `${data.bodyNumber}-信息`
                                descData.value[0].value = eventTime
                                descData.value[1].value = bodyNumber
                                descData.value[2].value = data.productPrototypeSubModel
                                descData.value[3].value = 'GW&SR'
                                // descData.value[3].value = data.stationName
                                descData.value[4].value = (data.passRate * 100).toFixed(1) + '%'
                                let t = data.dataList.sort((a, b) => {
                                    return a.productPrototypeFeature - b.productPrototypeFeature
                                })
                                MPSel.value = [];
                                data.dataList.forEach((v) => {
                                    MPSel.value.push(
                                        {
                                            name: v.pointName,
                                            value: v.pointName,
                                            label: v.pointName
                                        }
                                    )
                                })
                                MPSelled.value = MPSel.value[0].value
                                list.value = t
                                rankClass.value = [];
                                rankClass.value.push(data.perfectCount, data.wellCount, data.warnCount, data.errorCount);
                                renderChart()
                                renderLine(MPSelled.value, data.productPrototypeSubModel, data.stationName)
                            }
                        }).catch(e => {
                            console.log(e)
                        })
                    })
                    layer.msg('查询  ok', { icon: 1, time: 1300 });
                }, 550);
            }
            break;
    }

}

function PMChange(pointName: string) {
    if (pointName.includes('BR') || pointName.includes('BL')) {
        defaultST.value = 'SR'
    } else {
        defaultST.value = 'GW'
    }
    renderLine(pointName, defaultModel.value, defaultST.value)
}
defineExpose({ askGetCarTime })

const customSearch = function () {
    visible.value = true;
    // console.log(document.querySelector('div[id|="el-popper-container"]'))
}
const startSearch = () => {
    let url = "api/display/getCarTime"
    let params;
    params = {
        bodyNumber: inputCarBody.value ?? '',
        productPrototypeSubModel: carModel.value,
        stationName: MBselect.value,
        startTime: toRaw(dayjs(timeRange.value[0]).format('YYYY-MM-DD HH:mm:ss')),
        endTime: toRaw(dayjs(timeRange.value[1]).format('YYYY-MM-DD 23:59:59'))
    }
    proxy.$http.get(url, {
        params,
        headers: {
            token: localStorage.getItem('token')
        }
    }).then(v => {
        console.log(v)
        tabData.value = v.data;
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
function initChart() {
    let errorBarChart_ins = proxy.$echart.init(errorBarChart.value)
    const lineSingle_ins = proxy.$echart.init(lineSingle.value);
    proxy.errorBarChart_ins = errorBarChart_ins
    proxy.lineSingle_ins = lineSingle_ins
}
function renderChart() {
    const t = ref_error_option.value.series[0].data.map((v, i) => {
        if (typeof v == 'object') {
            v.value = rankClass.value[i];
            return v
        } else {
            v = rankClass.value[i];
            return v
        }
    })
    ref_error_option.value.series[0].data = t;
    if (proxy.errorBarChart_ins) {
        proxy.errorBarChart_ins.setOption(ref_error_option.value)
    }
}
const judgeMPColor = (MP: number) => {
    if (Math.abs(MP) <= 0.3) {
        return 'well'
    } else if (0.3 < Math.abs(MP) && Math.abs(MP) <= 1) {
        return 'good'
    }
    else if (1 < Math.abs(MP) && Math.abs(MP) <= 1.5) {
        return 'bad'
    } else {
        return 'danger'
    }
}

async function renderLine(pointName: string, model: string, stationName: string, count = 200) {
    defaultModel.value = model
    defaultST.value = stationName
    const xz: any[] = [];
    const x: any[] = [], y: any[] = [], z: any[] = [];
    let ox: any[] = [], oy: any[] = [], oz: any[] = [];
    let bodyNumber = [] as any[];
    let params = {
        asc: false,
        stationName: stationName,
        pointName: pointName,
        productPrototypeSubModel: model,
        count
    }
    const url = 'api/display/searchByParams';
    const { data: data } = await proxy.$http.post(
        url,
        params,
        {
            headers: {
                token: localStorage.getItem('token')
            }
        })
    if (data.length > 0) {
        data.forEach((v: { eventTime: any; txObserDevia: any; tyObserDevia: any; tzObserDevia: any, txObserValue: string | number, tyObserValue: string | number, tzObserValue: string | number, bodyNumber: string }) => {
            xz.push(v.eventTime);
            x.push(v.txObserDevia)
            y.push(v.tyObserDevia)
            z.push(v.tzObserDevia)
            ox.push(v.txObserValue)
            oy.push(v.tyObserValue)
            oz.push(v.tzObserValue)
            bodyNumber.push(v.bodyNumber)
        })
        let xyz = [x, y, z]
        let oxyz = [ox, oy, oz]
        ref_single_option.value.xAxis.data = xz;
        ref_single_option.value.yAxis.axisLabel.color = '#0284c7'
        ref_single_option.value.xAxis.axisLabel.color = '#0284c7';
        ref_single_option.value.series.forEach((v, i) => {
            ref_single_option.value.series[i].customInfo.bodyNumber = []
            ref_single_option.value.graphic.style.fontSize = '0';
            ref_single_option.value.series[i].data = xyz[i]
            ref_single_option.value.series[i].customInfo.obV = oxyz[i]
            ref_single_option.value.series[i].customInfo.bodyNumber = bodyNumber
        })
    } else {
        ref_single_option.value.graphic.style.fontSize = '21';
    }
    if (proxy.lineSingle_ins) {
        ref_single_option.value.tooltip.formatter = function (param) {
            let index = param[0].dataIndex
            let x = param[0].name
            let Dx = param[0].data
            let Dy = param[1].data
            let Dz = param[2].data
            let xo = ref_single_option.value.series[0].customInfo.obV[index]
            let yo = ref_single_option.value.series[1].customInfo.obV[index]
            let zo = ref_single_option.value.series[2].customInfo.obV[index]
            let bodyNumber = ref_single_option.value.series[0].customInfo.bodyNumber[index]
            return `
        <div class="myTooltip">
            <div class="icon text-xs cursor-pointer" >
            </div>
          <div class="content">
            <div class="time text-sm">
              Time:${x}
            </div>
            <div class="time text-sm">
                车身号:${bodyNumber}
            </div>
            <table class="xyz mt-1">
                <tr>
                  <td>X</td>
                  <td>${xo}</td>
                  <td class=${judgeMPColor(Dx)}>Dx</td>
                  <td class=${judgeMPColor(Dx)}>${Dx}</td>
                </tr>
                <tr>
                  <td>Y</td>
                  <td>${yo}</td>
                  <td class=${judgeMPColor(Dy)}>Dy</td>
                  <td class=${judgeMPColor(Dy)}>${Dy}</td>
                </tr>
                <tr>
                  <td>Z</td>
                  <td>${zo}</td>
                  <td class=${judgeMPColor(Dz)}>Dz</td>
                  <td class=${judgeMPColor(Dz)}>${Dz}</td>
                </tr>
              </table>
            </div>  
          </div>
        `;
        }
        proxy.lineSingle_ins.setOption(ref_single_option.value)
    }
}

function askGetCarTime(ST?: string, model?: string) {

    let url = '/api/cache/getCurCarAndStation'
    let params0 = {}
    let headers = {
        token: localStorage.getItem('token')
    }
    proxy.$http.get(url, { params0, headers }).then(v => {
        let { status, data } = v
        if (status == 200) {
            let { productPrototypeSubModel, stationName } = data
            let params = {
                stationName: !isUndefined(ST) ? ST : stationName,
                productPrototypeSubModel: !isUndefined(model) ? model : productPrototypeSubModel,
                startTime,
                endTime,
            }
            proxy.$http.get(getCarTime, { params, headers: { token: localStorage.getItem('token') } }).then(v => {
                let data: Array<{ bodyNumber: string, eventTime: string, productPrototypeSubModel: string }> = v.data;
                let len = data.length
                ops.value = [];
                data.forEach((v, i) => {
                    if (i > len - 6) {
                        ops.value?.push(
                            {
                                value: v.bodyNumber + ' ' + v.eventTime,
                                label: v.bodyNumber,
                                time: v.eventTime,
                                model: v.productPrototypeSubModel
                            }
                        )
                    }
                })
            }).catch(e => {

            })
        }
    })


}
onMounted(() => {
    askGetCarTime()
})

watch(visible2, (cur) => {
    if (cur) {
        setTimeout(() => {
            let dom = document.querySelector('.layui-layer-title')!;
            let button = document.createElement('button');
            button.style.zIndex = '9999999'
            button.style.cursor = 'pointer'
            button.innerHTML = '返回 >'
            button.className = 'myButton ml-5 pt-1 pb-2 px-2'
            button.addEventListener('click', function (e) {
                e.stopPropagation()
                visible.value = true
                visible2.value = false
            })
            dom.append(button)
        }, 600);
    }
})
</script>

<style lang="less" >
.myButton {
    background-color: #1e9fff;
    /* Green */
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    height: 30px;
    line-height: 14px;
    -webkit-transition-duration: 0.4s;
    /* Safari */
    transition-duration: 0.4s;
}

.myButton:hover {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
}


.el-table {
    --el-table-row-hover-bg-color: #F5F7FA !important;
    --el-table-border-color: rgb(41, 46, 52) !important;
    --el-table-border: 1px solid var(--el-table-border-color) !important;
    --el-table-text-color: #fff !important;
    --el-table-header-text-color: #fff !important;
    --el-table-header-bg-color: #090B12 !important;
    --el-table-tr-bg-color: #090B12 !important;
    height: 95% !important;
    background-color: #090B12 !important;
}

.el-table .el-table__row:hover {
    color: #090b12 !important;
}

.el-table .el-table__row .el-table__cell:hover {
    background-color: var(--el-table-row-hover-bg-color) !important;
}

.el-table--border .el-table__cell {
    border-right: var(--el-table-border) !important;
}

.el-table__header-wrapper {
    table thead tr {
        color: rgba(209, 213, 219, .502) !important;
        font-size: small !important;
        font-family: 'Arial Normal', Arial, sans-serif !important;
    }
}

.el-input__wrapper {
    height: 26px !important;
    background-color: #090b12 !important;
    border: none !important;
    box-shadow: none !important;
}

.el-descriptions__title {
    color: rgba(209, 213, 219, 1) !important;
}

.el-descriptions__cell {
    background-color: #37444E !important;
    color: #ffffff !important;
    border: none !important;
}

.el-descriptions__body {
    background-color: transparent !important;
}

.el-descriptions__table>tbody>tr {
    td:nth-of-type(odd) {
        width: 20% !important;
    }

    td:nth-of-type(even) {
        width: 30% !important;
        background-clip: content-box;
        background-color: #000203 !important;
    }
}

.layui-layer {
    background-color: #0C151D !important;
    color: #eeeeee;

    .layui-layer-title {
        color: #eeeeee !important;
        border: none;
    }
}

.layui-layer-content {
    &>div:first-of-type {
        height: 100% !important;
        width: 100% !important;
    }
}

.myContainer {
    :deep(.el-input>.el-input__wrapper) {
        background-color: #030406 !important;
    }

    :deep(.el-date-range-picker, .el-select-dropdown) {
        z-index: 29999999 !important;
    }

}

div[id|="el-popper-container"] {
    .el-popper {
        z-index: 21111111 !important;
    }
}

.layui-layer-shade {
    z-index: 1999 !important;
}
</style>
