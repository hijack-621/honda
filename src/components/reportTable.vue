<template>
    <div class="myContainer reportTable w-full h-full relative">
        <div class="reportTableTitle text-white text-left text-base  py-3 px-6">{{ ref_mainTitle }}</div>
        <div class="reportTable w-full flex  flex-row ">
            <div class="elTable  h-[95%] w-[55%]">
                <div class="elTableTitle px-6">{{ ref_Title }}</div>
                <div class="elTable_tbody mx-6  my-6 flex flex-col  w-full h-full">
                    <div v-for="(d, di) in ref_cols" :key="di" class="tableItem w-full h-full flex flex-row">
                        <div class="tbody_prop rbBorder w-[40%] flex justify-center items-center text-base text-[#c1c1c1]">
                            {{ d.prop }}</div>
                        <div @dblclick="editVal" :id="d.id"
                            class="tbody_val rbBorder cursor-pointer flex-1 flex justify-center items-center text-base text-[#ffffff]">
                            <span :class="di == 2 ? ' text-sm' : ''" v-if="ref_data![di] !== ''" class="hasVal text">{{
                                ref_data![di] }}</span>
                            <span v-else class="noVal text-[#666666]">{{ d.prop == '目标' ? '双击输入纯数值,如92%...' :
                                '双击输入内容' }}</span>
                            <el-input @blur="completeEdit" @input="getTextAreaVal" v-if="vModel_textArea[d.id].show"
                                v-model="vModel_textArea[d.id].val" :rows="2" type="textarea" placeholder="请输入" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="someChart  mx-6 flex-1 " ref="someChart">

            </div>
        </div>
        <el-button @click="mySubmit" class="absolute left-6 -bottom-10 bg-[#199DE5]" v-if="submitShow"
            type="primary">提交修改</el-button>
    </div>
</template>

<script setup lang="ts">
import emitter from '~/assets/utils/eventBus'
import { ElMessage } from 'element-plus';
import { getCurrentInstance } from 'vue'

let { proxy } = getCurrentInstance()! as any
const { title, cols, data, mainTitle, option, flag } = defineProps(
    {
        mainTitle: String,
        title: String,
        cols: Array,
        data: Array,
        option: Object,
        flag: {
            type: Boolean,
            default: false
        }
    }
)
let ref_Option = ref(option)
let vModel_textArea = ref({
    Up01: {
        val: '',
        show: false,
    },
    Up02: {
        val: '',
        show: false,
    },
    Up03: {
        val: '',
        show: false,
    },
    Down01: {
        val: '',
        show: false,
    },
    Down02: {
        val: '',
        show: false,
    },
    Down03: {
        val: '',
        show: false,
    },
})
let someChart = ref()
let ref_Title = ref(title)
let ref_cols = ref(cols)
let ref_data = ref(data)
let ref_mainTitle = ref(mainTitle)
let ref_flag = ref(flag)
let tempVal = ref('')
let submitShow = ref(false)

function editVal(e: MouseEvent) {
    let targetDom = e.target as HTMLDivElement;
    let span = targetDom.children[0] as HTMLSpanElement
    if ([...span.classList].includes('hasVal') && ![...span.classList].includes('notFirst')) { // 如果有值
        vModel_textArea.value[targetDom.id].val = span.innerHTML
        vModel_textArea.value[targetDom.id].show = true
        span.style.display = 'none'
        span.classList.add('notFirst')
    } else if ([...span.classList].includes('hasVal') && [...span.classList].includes('notFirst')) {
        vModel_textArea.value[targetDom.id].val = ''
        vModel_textArea.value[targetDom.id].show = true
        span.style.display = 'none'
    } else if ([...span.classList].includes('noVal')) {
        vModel_textArea.value[targetDom.id].val = ''
        vModel_textArea.value[targetDom.id].show = true
        span.style.display = 'none'
    }
    setTimeout(() => {
        let textarea = targetDom.querySelector('.el-textarea>textarea')! as HTMLTextAreaElement
        textarea.focus()
    }, 10);
}

function getTextAreaVal(e) {
    tempVal.value = e
}

function completeEdit(e) {
    let targetDom = e.target as HTMLTextAreaElement;
    let parentDiv = targetDom.parentNode!.parentNode! as HTMLDivElement
    vModel_textArea.value[parentDiv.id].val = targetDom.innerHTML
    vModel_textArea.value[parentDiv.id].show = false
    setTimeout(() => {
        let span = parentDiv.children[0] as HTMLSpanElement
        span.innerHTML = tempVal.value == '' ? '双击输入内容' : tempVal.value
        span.style.display = 'inline'
        if (span.innerHTML == '双击输入内容') {
            span.style.color = '#666666'
        } else {
            span.style.color = '#ffffff'
        }
        tempVal.value = ''
    }, 10);
    // submitShow.value = true
}

function mySubmit() {
    submitShow.value = false
    ElMessage('保存修改成功')
}

function renderCharts() {
    if (someChart.value) {
        let Instance = proxy.$echart.init(someChart.value)
        Instance.setOption(ref_Option.value)
        Instance.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 0,
        })
        proxy.InstanceDom = Instance
    }
}

onMounted(() => {
    renderCharts()
    emitter.on('response', (d: any) => {
        if (d) {
            if (ref_flag.value) {
                if (d.data.stationVos.GW && d.data.stationVos.SR) {
                    let GW_pass = parseFloat(((d.data.stationVos.GW.passRate) * 100).toFixed(2));
                    let SR_pass = parseFloat(((d.data.stationVos.SR.passRate) * 100).toFixed(2));
                    let s1 = [(100 - GW_pass).toFixed(2), (100 - SR_pass).toFixed(2)]
                    let s2 = [GW_pass, SR_pass]
                    let ss = [s1, s2]
                    ss.forEach((s, si) => {
                        ref_Option.value!.series[si].data = s
                    })
                }else {
                    ElMessage('查无数据或者GW&SR数据不全')
                }


            } else {
                if (d.data.stationVos.GW && d.data.stationVos.SR) {
                    let et = d.data.stationVos.GW.errorList.length + d.data.stationVos.SR.errorList.length
                    let tt = d.data.stationVos.GW.totalCount + d.data.stationVos.SR.totalCount
                    let noPassRate = parseFloat(et) / parseFloat(tt);
                    let passRate = 1 - noPassRate;
                    [noPassRate, passRate].forEach((r, ri) => {
                        ref_Option.value!.series[0].data[ri].value = r
                    })
                }else {
                    ElMessage('查无数据或者GW&SR数据不全')
                }

            }
            ref_data.value![2] = `${d.data.startTime}~${d.data.endTime}`
            proxy.InstanceDom.setOption(ref_Option.value!)
        }
    })
})
</script>

<style lang="less" scoped>
.someChart {
    height: calc(95% - 60px);
    margin-top: calc(1.5rem + 30px);
    background: #232c34;
    border: 1px solid #37444e;
    border-left: none;
    border-radius: 5px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
}

.elTable_tbody {
    background: #232c34;
    border: 1px solid #37444e;
    border-radius: 5px;
    border-right: none;
    border-bottom: none;
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;

    .rbBorder {
        border-right: 1px solid #37444e;
        border-bottom: 1px solid #37444e;
    }
}

.reportTable {
    width: 100%;
    height: calc(100% - 1.75rem);
    background: rgba(12, 21, 29, 0.95);
    border-radius: 5px;
    box-sizing: content-box;
}

.elTableTitle {
    height: 30px;
    font-size: 28px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    text-align: left;
    color: #ffffff;
}

.elTable_tbody {
    height: calc(100% - 60px);
}

.myContainer {}
</style>
