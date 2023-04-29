// store/index.ts
import { defineStore } from 'pinia'
// 1. 定义容器、导出容器
// 参数1：容器的ID，必须是唯一的，后面Pinia会把所有的容器挂载到根容器
// 参数2：一些选项对象，也就是state、getter和action
// 返回值：一个函数，调用即可得到容器实例

export const useMainStore = defineStore('main', {
    // 类似于Vue2组件中的data，用于存储全局状态数据，但有两个要求
    // 1. 必须是函数，目的是为了在服务端渲染的时候避免交叉请求导致的数据状态污染
    // 2. 必须是箭头函数，这样是为了更好的 TS 类型推导
    state: () => {
        return {
            clickedPoint: {},
            zoneInfo:[] as {key:string,val:string}[],
            User:useLocalStorage('user','')
        }
    },
    getters: {},
    actions: {},
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
            },
        ]
    }
})

// 2. 使用容器中的 state
// 3. 通过 getter 修改 state
// 4. 使用容器中的 action 同步和异步请求
