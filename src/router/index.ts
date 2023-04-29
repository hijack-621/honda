import { RouteRecordRaw } from 'vue-router'
import loginRegister from '~/pages/LR.vue'
// import AuthLayout from '../layouts/AuthLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/foot',
    name: 'foot',
    component: () => import('~/components/Footer.vue')
  },
  {
    path: '/chartDetail',
    name: 'chartDetail',
    component: () => import('~/pages/chartDetail.vue')
  },
  {
    path: '/',
    name: '/',
    redirect: 'index',
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('~/pages/index.vue'),
  },
  {
    path: '/index-test',
    name: 'index-test',
    component: () => import('~/assets/utils/copy/index-test.vue'),
  },
  {
    path: '/set',
    name: 'set',
    component: () => import('~/components/setMesPoints.vue')
  },
  {
    path: '/set2',
    name: 'set2',
    component: () => import('~/components/setMesPoints2.vue')
  },
  {
    path: '/details',
    name: 'details',
    component: () => import('~/pages/details.vue')
  },
  {
    path: '/MPDetail',
    name: 'MPDetail',
    component: () => import('~/components/MPDetail.vue')
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('~/pages/exportReport.vue')
  },
  // {
  //   path: '/auth',
  //   component: AuthLayout,
  //   children: [
  //     {
  //       name: 'login',
  //       path: 'login',
  //       component: () => import('../pages/auth/login/Login.vue'),
  //     },
  //     {
  //       name: 'signup',
  //       path: 'signup',
  //       component: () => import('../pages/auth/signup/Signup.vue'),
  //     },
  //     {
  //       name: 'recover-password',
  //       path: 'recover-password',
  //       component: () => import('../pages/auth/recover-password/RecoverPassword.vue'),
  //     },
  //     {
  //       path: '',
  //       redirect: { name: 'login' },
  //     },
  //   ],
  // },
  {
    path: '/login',
    name: 'login',
    component: loginRegister
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('~/pages/UserManagement.vue'),
  },
  {
    path: '/mpSet',
    name: 'mpSet',
    component: () => import('~/pages/mpSet.vue'),
  }

]

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes
// })

export default routes
