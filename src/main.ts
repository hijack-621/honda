import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import routesBymanual from '~/router/index'
import App from './App.vue'
import datav from '@kjgl77/datav-vue3'
import vue3SeamlessScroll from "vue3-seamless-scroll";
import * as echarts from 'echarts'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { s3Layer } from 'vue3-layer';
import 'vue3-layer/dist/s3Layer.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import '../index.css'
import instance from '~/assets/utils/instance'
import {createPinia} from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import i18n from './i18n'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import { createVuestic } from 'vuestic-ui'
// import 'default-passive-events'

routesBymanual.forEach((route => {
  routes.push(route)
}))
const pinia = createPinia()
pinia.use(piniaPluginPersist)// 数据持久化插件

const app = createApp(App)
app.component('s3-layer', s3Layer);
app.config.globalProperties.$http = instance
app.config.globalProperties.$echart = echarts
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(router)
app.use(datav)
app.use(vue3SeamlessScroll);
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))
app.mount('#app')
