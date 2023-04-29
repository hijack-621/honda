<template>
    <div class="myContainer filterPanel w-full h-full">
        <div class="filterPanelTitle text-white text-base text-left p-3">{{ title }}</div>
        <!-- <div class="shortFilter  flex flex-row justify-center gap-5 items-center">
            <div class="label text-[#999999] text-base">{{ label1 }}</div>
            <div class="content">
                <el-select clearable class="setBg" @change="changeShortFilter" v-model="shortFilter" placeholder="请选择搜索单位">
                    <el-option v-for="(option, key) in shortFilterOptions" :key="key" :label="option.label"
                        :value="option.value">
                    </el-option>
                </el-select>
            </div>
        </div> -->
        <div class="dateFilter py-5 flex gap-5 flex-row justify-center items-center">
            <div class="label text-[#999999] text-base">开始日期</div>
            <div class="content w-[61%] overflow-hidden">
                <el-date-picker @calendar-change="" @visible-change="" v-model="beginTime" type="date" placeholder="开始日期">
                </el-date-picker>
            </div>
        </div>
        <div class="dateFilter py-5 flex gap-5 flex-row justify-center items-center">
            <div class="label text-[#999999] text-base">结束日期</div>
            <div class="content w-[61%] overflow-hidden">
                <el-date-picker @calendar-change="" @visible-change="" v-model="endTime" type="date" placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <div class="modelFilter  flex flex-row justify-center gap-5 items-center">
            <div class="label text-[#999999] text-base mr-8">{{ label3 }}</div>
            <div class="content">
                <el-select clearable class="setBg" @change="" v-model="model" placeholder="请选择车型">
                    <el-option v-for="(option, key) in modelFilterOptions" :key="key" :label="option.label"
                        :value="option.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="buttons mt-3 flex  flex-row items-center gap-2 justify-center">
            <button @click="reset" class="filterPanel_btn  cursor-pointer hover:bg-[#54697b]">重置</button>
            <button @click="beginFilter" class="filterPanel_btn  cursor-pointer hover:bg-[#54697b]">查询</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isNull, isUndefined } from 'lodash';
import emitter from '~/assets/utils/eventBus'
import { getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus';
let { proxy } = getCurrentInstance() as any
let beginTime = ref()
let endTime = ref()
let shortFilterOptions = ref([
    {
        label: '按天',
        value: '1'
    },
    {
        label: '按周',
        value: '7'
    },
    {
        label: '按月',
        value: '30'
    },
    {
        label: '三个月',
        value: '120'
    },
    {
        label: '半年',
        value: '180'
    },
    {
        label: '近一年',
        value: '365'
    },
])
let modelFilterOptions = ref([
    {
        label: 'BRE',
        value: 'BRE'
    },
    {
        label: 'CRD',
        value: 'CRD'
    },
    {
        label: 'INT4D',
        value: 'INT4D'
    },
    {
        label: 'INT5D',
        value: 'INT5D'
    },
    {
        label: 'Z-RV',
        value: 'Z-RV'
    },

])
let dateTime = ref()
let shortFilter = ref<any>('')
let model = ref('BRE')
let title = ref('过滤条件')
let label1 = ref('单位:')
let label2 = ref('时间:')
let label3 = ref('车型:')
let router = useRouter()

function askWE(e) {
    let flag = e.every(v => {
        return !isNull(v)
    })
    if (flag) {
        beginTime.value = dayjs(e[0]).format('YYYY-MM-DD 00:00:00')
        endTime.value = dayjs(e[1]).format('YYYY-MM-DD 23:59:59')
    }
}

const checkShortFilter = (d) => {
    if (!d) {
        if (shortFilter.value * 1 > 0) {
            ElMessage('单位过滤条件和自选时间过滤条都已选择，请选择一种！')
            dateTime.value = ''
            shortFilter.value = ''
            return
        } else {
            console.log(d)
        }
    }

}
const changeShortFilter = (f) => {
    if (dateTime.value == '' || dateTime.value == undefined) {
        beginTime.value = dayjs(getPastDate(f)).format('YYYY-MM-DD 00:00:00')
        endTime.value = dayjs(new Date()).format('YYYY-MM-DD 23:59:59')

    } else {
        ElMessage('单位过滤条件和自选时间过滤条都已选择，请选择一种！')
        dateTime.value = ''
        shortFilter.value = ''
        return
    }
    // console.log(shortFilter.value, dateTime.value)

    // if (model.value && beginTime.value && endTime.value) {
    //     beginFilter(model.value, beginTime.value, endTime.value)
    // }
}
const getPastDate = (days) => {
    const today = new Date();
    const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    const year = pastDate.getFullYear();
    const month = String(pastDate.getMonth() + 1).padStart(2, '0');
    const date = String(pastDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
}

function reset() {
    dateTime.value = ''
    beginTime.value = ''
    endTime.value = ''
    shortFilter.value = ''
    model.value = ''
}

function beginFilter() {
    let url = '/api/display/getReport'
    let params = {
        productPrototypeSubModel: model.value,
        startTime: dayjs(beginTime.value).format('YYYY-MM-DD 00:00:00'),
        endTime: dayjs(endTime.value).format('YYYY-MM-DD 23:59:59')
    }
    let headers = {
        token: localStorage.getItem('token')
    }
    proxy.$http.get(url, {
        params,
        headers
    }).then(v => {

        if (v.status == 200) {
            if (v.data.code) {
                ElMessage('暂查无数据！')
            } else {
                emitter.emit('response', v.data)
            }
        } else {
            ElMessage('网络错误，请检查！')
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
</script>

<style lang="less" scoped>
.myContainer {}

.filterPanel {
    background: rgba(12, 21, 29, 0.95);
    border: 1px solid #172d3e;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
}

.filterPanel_btn {
    color: #ffffff;
    width: 138px;
    height: 32px;
    margin-top: 12px;
    background: #232c34;
    border: 1px solid #37444e;
    border-radius: 5px;
}
</style>
