// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'
import { APP_NAME, CUR_APP } from '@/store/mutation-types'

// const RouteView = {
//   name: 'RouteView',
//   render: h => h('router-view')
// }

const asyncRouterMapAll = {
  [APP_NAME.NUCLEAR_LAB]: [
    {
      path: '/',
      name: 'index',
      component: BasicLayout,
      // redirect: '/home',
      children: [
        // AdminOrderHandle
        {
          path: '/admin-order-handle',
          name: 'AdminOrderHandle',
          component: () => import('@/views/nuclear_lab/WorkOrder'),
          meta: { title: '管理员任务管理', icon: 'table', permission: ['adminOrderHandle'] }
        },
        // CheckOrderHandle
        {
          path: '/check-order-handle',
          name: 'CheckOrderHandle',
          component: () => import('@/views/nuclear_lab/WorkOrder'),
          meta: { title: '核查员任务管理', icon: 'table', permission: ['checkOrderHandle'] }
        },
        // AuditOrderHandle
        {
          path: '/audit-order-handle',
          name: 'AuditOrderHandle',
          component: () => import('@/views/nuclear_lab/WorkOrder'),
          meta: { title: '审核员任务管理', icon: 'table', permission: ['auditOrderHandle'] }
        },
        // ReAuditOrderHandle
        {
          path: '/re-audit-order-handle',
          name: 'ReAuditOrderHandle',
          component: () => import('@/views/nuclear_lab/WorkOrder'),
          meta: { title: '复核员任务管理', icon: 'table', permission: ['reAuditOrderHandle'] }
        },
        // Home
        {
          path: '/home',
          name: 'Home',
          component: () => import('@/views/nuclear_lab/Home'),
          meta: { title: '模型展示', icon: 'appstore', permission: ['modelShow'] }
        },
        // RoomCheckShow
        {
          path: '/room-checkShow',
          name: 'RoomCheckShow',
          component: () => import('@/views/nuclear_lab/WorkOrder'),
          meta: { title: '机房核查展示', icon: 'table', permission: ['roomCheckShow'] }
        },
        // RoomSetting
        {
          path: '/room-setting',
          name: 'RoomSetting',
          component: () => import('@/views/nuclear_lab/RoomSetting'),
          meta: { title: '机房设置', icon: 'solution', permission: ['roomSetting'] }
        },
        // OrderSearch
        {
          path: '/order-search',
          name: 'OrderSearch',
          component: () => import('@/views/nuclear_lab/WorkOrder'),
          meta: { title: '工单查询', icon: 'table', permission: ['orderSearch'] }
        },
        // Permission
        {
          path: '/permission',
          name: 'Permission',
          component: () => import('@/views/nuclear_lab/Permission'),
          meta: { title: '权限管理', icon: 'database', permission: ['permission'] }
        },
        // LoginLog
        {
          path: '/login-log',
          name: 'LoginLog',
          component: () => import('@/views/nuclear_lab/LoginLog'),
          meta: { title: '登录日志', icon: 'solution', permission: ['loginLog'] }
        },
        // AccessLog
        {
          path: '/access-log',
          name: 'AccessLog',
          component: () => import('@/views/nuclear_lab/AccessLog'),
          meta: { title: '访问日志', icon: 'solution', permission: ['accessLog'] }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      publiclyAccessible: true,
      defaultLoginRoute: true,
      component: () => import('@/views/nuclear_lab/Login'),
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
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
