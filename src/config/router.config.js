// eslint-disable-next-line
// import { bxAnaalyse } from '@/core/icons'
import { APP_NAME, CUR_APP } from '@/store/mutation-types'

// const RouteView = {
//   name: 'RouteView',
//   render: h => h('router-view')
// }

const asyncRouterMapAll = {
  [APP_NAME.IMG_RGB]: [
    {
      path: '/',
      name: 'Index',
      publiclyAccessible: true,
      defaultLoginRoute: true,
      component: () => import('@/views/img_rgb/Index'),
      meta: { title: '首页' },
      hidden: true
    }
  ]
}

export const asyncRouterMap = [
  ...asyncRouterMapAll[CUR_APP]
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/404')
  }
]
