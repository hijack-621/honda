<template>
    <div class="mpSet">
        <div id="index" ref="appRef">
            <div class="bg">
                <dv-loading v-if="loading">Loading...</dv-loading>
                <div v-else class="host-body">
                    <div class="flex w-full h-full justify-center items-center flex-col">
                        <Header class="resetBG" ref="headerRef" :show="shows" :title="title" @getClickedModel="">
                        </Header>
                        <div class="mpSetTable relative w-full h-full flex flex-col items-start">
                            <div class="mpSelect h-[20%] w-full flex flex-col items-start">
                                <div class="title text-xl !text-left px-5 py-10">选择测点</div>
                                <div class="sel px-5 h-10">
                                    <el-select style="height:100%" class="" v-model="modelSelected" value-key=""
                                        placeholder="请选择车型" clearable filterable @change="modelChange">
                                        <el-option v-for="option in modelSelect" selected :key="option.label"
                                            :label="option.label" :value="option.value">
                                        </el-option>
                                    </el-select>
                                    <el-select style="height:100%" class="  ml-6" v-model="MPSelected" value-key=""
                                        placeholder="请选择测点" clearable filterable @change="PMChange">
                                        <el-option v-for="option in MPSelect" selected :key="option.label"
                                            :label="option.label" :value="option.value">
                                        </el-option>
                                    </el-select>
                                    <el-button-group class=" ml-6">
                                        <el-button @click="pre" class="border-none bg-[#232C34] border-[##37444E]"
                                            type="primary" :icon="ArrowLeft"></el-button>
                                        <el-button @click="next" class="border-none bg-[#232C34] border-[##37444E] !ml-2"
                                            type="primary">
                                            <el-icon class="el-icon--right">
                                                <ArrowRight />
                                            </el-icon>
                                        </el-button>
                                    </el-button-group>
                                </div>
                            </div>
                            <div class="mpTable   bg-[#090E17] w-full h-[60%] mt-10">
                                <div class="mpTable_xyz flex flex-row h-full w-full">
                                    <div class=" relative w-1/3 rounded-sm bg-[#232C34] border-[#37444E] h-full flex flex-col"
                                        v-for="(c, ci) in xyz" :key="ci">
                                        <div class="title absolute -top-10 left-6  !w-full text-xl !text-left leading-[2]">
                                            {{ prefix }} {{ MPSelected }} {{ c.prop }}</div>
                                        <div class="content flex-1 w-full flex flex-col justify-evenly items-center">
                                            <div class="contentItem w-full h-full flex flex-row justify-center items-center"
                                                v-for="(i, ii) in c.items" :key="ii">
                                                <div class="label text-xl">{{ c.prop }}{{ i.label }}</div>
                                                <div
                                                    class="input w-[70%] ml-5  gap-2 flex flex-row justify-center items-center">
                                                    <div @dblclick="editVal($event, v.id)"
                                                        class="val relative flex justify-center items-center cursor-pointer flex-1 h-10 bg-[#000203]"
                                                        v-for="(v, vi) in i.val" :key="vi">
                                                        <span class="text-base" v-if="!v.show">{{ v.val }}</span>
                                                        <el-input :id="v.id" @blur="doneEdit($event, v.id)"
                                                            class="absolute left-0 top-0 !w-full !h-full " v-if="v.show"
                                                            v-model="inputVal" placeholder="请输入..." />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="buttons absolute bottom-15 right-0">
                                <button @click="applyChange"
                                    class="apply_btn  cursor-pointer hover:!bg-[#54697b]">应用</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import useDraw from "~/assets/utils/useDraw";
import {
    ArrowLeft,
    ArrowRight,
} from '@element-plus/icons-vue'
import { pointWithXYZ } from "~/types/interface";
import { getCurrentInstance } from 'vue'

const { appRef, calcRate, windowDraw } = useDraw();
/* MP == MeasurePoint */
let router = useRouter()
let MPid = ref()
let { proxy } = getCurrentInstance() as any
let inputVal = ref('')
let prefix = ref('点位')
let MPSelected = ref()
let modelSelected = ref('BRE')
let title = ref('点位管理-公差设置')
let loading = ref(true)
let shows = ref({ logoShow: true, searchShow: false })
const MPSelect = ref<any[]>([])
const options = ref<any[]>([])
let xyz = ref([
    {
        prop: 'x',
        items: [
            { label: '公差1', val: [{ id: 'tox1', val: 0, show: false }, { id: 'tox11', val: 0, show: false }] },
            { label: '公差2', val: [{ id: 'tox2', val: 0, show: false }, { id: 'tox22', val: 0, show: false }] },
            { label: '公差3', val: [{ id: 'tox3', val: 0, show: false }, { id: 'tox33', val: 0, show: false }] }
        ]
    },
    {
        prop: 'y',
        items: [
            { label: '公差1', val: [{ id: 'toy1', val: 0, show: false }, { id: 'toy11', val: 0, show: false }] },
            { label: '公差2', val: [{ id: 'toy2', val: 0, show: false }, { id: 'toy22', val: 0, show: false }] },
            { label: '公差3', val: [{ id: 'toy3', val: 0, show: false }, { id: 'toy33', val: 0, show: false }] }
        ]
    },
    {
        prop: 'z',
        items: [
            { label: '公差1', val: [{ id: 'toz1', val: 0, show: false }, { id: 'toz11', val: 0, show: false }] },
            { label: '公差2', val: [{ id: 'toz2', val: 0, show: false }, { id: 'toz22', val: 0, show: false }] },
            { label: '公差3', val: [{ id: 'toz3', val: 0, show: false }, { id: 'toz33', val: 0, show: false }] }
        ]
    },
])
const modelSelect = ref([
    { label: 'BRE', value: 'BRE', selected: true, },
    { label: 'CRD', value: 'CRD' },
    { label: 'Z-RV', value: 'Z-RV' },
    { label: 'INT4D', value: 'INT4D' },
    { label: 'INT5D', value: 'INT5D' },
])
const cancelLoading = () => {
    setTimeout(() => {
        loading.value = false;
        // chartRender()
    }, 500);
};

// 判断数组是否升序排列
function isAscending(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if ((arr[i]) > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

//保存修改
const applyChange = () => {
    let url = '/api/measurePoint/editPoint';
    // ts 用于存入 xyz 三 公差的上限和下限。 判断是三级公差包含二级，二级包含以一级。
    let ts = [
        [
            xyz.value[0].items[2].val[0].val,
            xyz.value[0].items[1].val[0].val,
            xyz.value[0].items[0].val[0].val,
            xyz.value[0].items[0].val[1].val,
            xyz.value[0].items[1].val[1].val,
            xyz.value[0].items[2].val[1].val
        ],
        [
            xyz.value[1].items[2].val[0].val,
            xyz.value[1].items[1].val[0].val,
            xyz.value[1].items[0].val[0].val,
            xyz.value[1].items[0].val[1].val,
            xyz.value[1].items[1].val[1].val,
            xyz.value[1].items[2].val[1].val,
        ],
        [
            xyz.value[2].items[2].val[0].val,
            xyz.value[2].items[1].val[0].val,
            xyz.value[2].items[0].val[0].val,
            xyz.value[2].items[0].val[1].val,
            xyz.value[2].items[1].val[1].val,
            xyz.value[2].items[2].val[1].val
        ]
    ]
    let fs = []
    ts.forEach(t => {
        fs.push(isAscending(t))
    })
    let flag = fs.every((f, fi) => {
        if (f == false) {
            ElMessage(`${xyz.value[fi].prop}方向上公差配置存在非包含关系，请检查！`)
            return false;
        } else {
            return true
        }
    })
    if (flag) {
        let params = {
            "xperDown": xyz.value[0].items[0].val[0].val,
            "xperUp": xyz.value[0].items[0].val[1].val,
            "xwellDown": xyz.value[0].items[1].val[0].val,
            "xwellUp": xyz.value[0].items[1].val[1].val,
            "xwarnDown": xyz.value[0].items[2].val[0].val,
            "xwarnUp": xyz.value[0].items[2].val[1].val,

            "yperDown": xyz.value[1].items[0].val[0].val,
            "yperUp": xyz.value[1].items[0].val[1].val,
            "ywellDown": xyz.value[1].items[1].val[0].val,
            "ywellUp": xyz.value[1].items[1].val[1].val,
            "ywarnDown": xyz.value[1].items[2].val[0].val,
            "ywarnUp": xyz.value[1].items[2].val[1].val,

            "zperDown": xyz.value[2].items[0].val[0].val,
            "zperUp": xyz.value[2].items[0].val[1].val,
            "zwellDown": xyz.value[2].items[1].val[0].val,
            "zwellUp": xyz.value[2].items[1].val[1].val,
            "zwarnDown": xyz.value[2].items[2].val[0].val,
            "zwarnUp": xyz.value[2].items[2].val[1].val,

            name: MPSelected.value,
            id: MPid.value
        }
        let headers = {
            token: localStorage.getItem('token')
        }
        proxy.$http.post(url, params, { headers }).then(v => {
            if (v.status == 200) {
                ElMessage('修改成功！')
                // initXYZ(MPSelected.value)
                // window.location.reload()
            }
        })
    }

}
//修改
const editVal = (e: MouseEvent, id) => {
    let target = e.target! as HTMLDivElement
    xyz.value.forEach(v => {
        v.items.forEach(vv => {
            vv.val.forEach(vvv => {
                if (vvv.id == id) {
                    vvv.show = true
                    setTimeout(() => {
                        let input = target.querySelector('.el-input__wrapper>.el-input__inner')! as HTMLTextAreaElement
                        input.focus()
                    }, 10);
                }
            })
        })
    })
}
const doneEdit = (e: MouseEvent, id) => {
    let target = e.target as HTMLInputElement
    xyz.value.forEach(v => {
        v.items.forEach(vv => {
            vv.val.forEach(vvv => {
                if (vvv.id == id) {
                    vvv.val = target.value as unknown as number * 1;
                    vvv.show = false
                }
            })
        })
    })
}
const modelChange = (model: string) => {
    modelSelected.value = model
    initData(modelSelected.value)
}

const PMChange = (name: string) => {
    initXYZ(name)
}

const isFirst = (arr: any, element: string) => {
    if (arr.length === 0) return false;
    return element === arr[0].value
}
const isLast = (arr: any, element: string) => {
    if (arr.length === 0) return false;
    return element === arr[arr.length - 1].value;
}

const pre = () => {
    if (isFirst(MPSelect.value, MPSelected.value)) {
        MPSelected.value = MPSelect.value[MPSelect.value.length - 1].value;
    } else {
        MPSelect.value.forEach((m, mi) => {
            if (m.value == MPSelected.value) {
                MPSelected.value = MPSelect.value[mi - 1].value
                initXYZ(MPSelected.value)
            }
        })

    }
}

const next = () => {
    if (isLast(MPSelect.value, MPSelected.value)) {
        MPSelected.value = MPSelect.value[0].value;
    } else {
        MPSelect.value.some((m, mi) => {
            if (m.value == MPSelected.value) {
                MPSelected.value = MPSelect.value[mi + 1].value
                initXYZ(MPSelected.value)
                return true
            }
        })

    }
}

// 初始化测点select
const initName = async (model: string) => {
    const server = '/api/measurePoint/getBySubModel'
    const { data } = await proxy.$http.get(server, {
        params: {
            subModel: model ?? modelSelected.value,
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
    let MPs = data as Array<pointWithXYZ>
    options.value = []
    MPs.forEach(v => {
        let o = {
            value: v.name,
            label: v.name
        }
        options.value.push(o)
    })
    options.value = options.value.sort((a, b) => {
        return matchNum(a.label) - matchNum(b.label)
    })
    MPSelect.value = options.value
    return new Promise(resolve => {
        MPSelect.value.length > 0 && resolve(MPSelect.value[0].value)
    })
}

// 匹配出点位名中数组
const matchNum = (str: string) => {
    return parseInt(str.replace(/[^\d]/g, ""))
}

//初始化xyz方向上公差list
const initXYZ = (name: string) => {
    MPSelected.value = name
    let url = '/api/measurePoint/getPointByName';
    let params = {
        name: MPSelected.value
    }
    let headers = {
        token: localStorage.getItem('token')
    }
    proxy.$http.get(url, {
        params,
        headers
    }).then(v => {
        if (v.status == 200) {
            let data = v.data as pointWithXYZ;
            MPid.value = data.id
            let x_tmp1 = [[data.xperDown, data.xperUp], [data.xwellDown, data.xwellUp], [data.xwarnDown, data.xwarnUp]]
            let y_tmp2 = [[data.yperDown, data.yperUp], [data.ywellDown, data.ywellUp], [data.ywarnDown, data.ywarnUp]]
            let z_tmp3 = [[data.zperDown, data.zperUp], [data.zwellDown, data.zwellUp], [data.zwarnDown, data.zwarnUp]];
            [x_tmp1, y_tmp2, z_tmp3].forEach((v, vi) => {
                xyz.value[vi].items[0].val[0].val = v[0][0]
                xyz.value[vi].items[0].val[1].val = v[0][1]

                xyz.value[vi].items[1].val[0].val = v[1][0]
                xyz.value[vi].items[1].val[1].val = v[1][1]

                xyz.value[vi].items[2].val[0].val = v[2][0]
                xyz.value[vi].items[2].val[1].val = v[2][1]
            })
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


const initData = async (model?: string) => {
    let name = await initName(model) as string
    initXYZ(name)
}


onMounted(() => {
    cancelLoading()
    calcRate()
    windowDraw()
    initData()
})
</script>

<style lang="less" scoped>
@import "~/assets/scss/index.scss";

.mpSet {}

.apply_btn {
    background: #00a5ff;
    border-radius: 2px;
    width: 75px;
    margin-left: 15px;
    padding: 10px;
}

.sel .el-select>.el-input {
    height: 100% !important;
}

.sel .el-select {
    :deep(.select-trigger) {
        height: 100% !important;

        .el-input {
            height: 100% !important;

            .el-input__wrapper {
                height: 100% !important;

                .el-input__inner {
                    height: 100% !important;
                }
            }
        }
    }
}

:deep(.val .el-input__wrapper) {

    height: 100% !important;
    padding: 0;
    margin: 0;

    .el-input__inner {
        height: 100% !important;
        background-color: #fff !important;
    }
}
</style>
