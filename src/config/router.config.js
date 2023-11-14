// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'
import { APP_NAME, CUR_APP } from '@/store/mutation-types'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

const asyncRouterMapAll = {
  [APP_NAME.ZND]: [
    {
      path: '/',
      name: 'index',
      component: BasicLayout,
      meta: { title: 'menu.home' },
      redirect: '/home',
      children: [
        // znd/home
        {
          path: '/home',
          name: 'Home',
          publiclyAccessible: true,
          component: () => import('@/views/znd/Home'),
          hidden: true
        },
        // znd/home-search
        {
          path: '/home-search',
          name: 'HomeSearch',
          component: () => import('@/views/znd/HomeSearch'),
          hidden: true
        },
        // znd/info
        {
          path: '/info',
          name: 'Info',
          publiclyAccessible: true,
          component: () => import('@/views/znd/Info'),
          meta: { title: 'INFO', icon: 'bulb' }
        },
        // znd/license
        {
          path: '/license',
          name: 'License',
          publiclyAccessible: true,
          component: () => import('@/views/znd/License'),
          meta: { title: 'LICENSE', icon: 'database' }
        },
        // znd/help
        {
          path: '/help',
          name: 'Help',
          redirect: '/help/imputation',
          component: RouteView,
          meta: { title: 'HELP', icon: 'file-markdown' },
          children: [
            // znd/help/imputation
            {
              path: '/help/imputation',
              name: 'HelpImputation',
              component: () => import('@/views/znd/HelpImputation'),
              meta: { title: 'IMPUTATION', icon: 'credit-card' }
            },
            // znd/help/imputation
            {
              path: '/help/bsp',
              name: 'HelpBSP',
              component: () => import('@/views/znd/HelpBSP'),
              meta: { title: 'BSP', icon: 'container' }
            }
          ]
        },
        // znd/download
        {
          path: '/download',
          name: 'Download',
          component: () => import('@/views/znd/Download'),
          meta: { title: 'DOWNLOAD', icon: 'cloud-download' }
        },
        // znd/imputation
        {
          path: '/imputation',
          name: 'Imputation',
          component: () => import('@/views/znd/Imputation'),
          meta: { title: 'IMPUTATION', icon: 'cloud-upload' }
        },
         // znd/BSP
        {
          path: '/BSP',
          name: 'BSP',
          component: () => import('@/views/znd/BSP'),
          meta: { title: 'BSP', icon: 'cloud-sync' }
        },
         // znd/register
        {
          path: '/register',
          name: 'Register',
          publiclyAccessible: true,
          component: () => import('@/views/znd/Register'),
          meta: { title: 'Register' },
          hidden: true
        },
        // znd/register
        {
          path: '/public-email-domains',
          name: 'PublicEmailDomains',
          publiclyAccessible: true,
          component: () => import('@/views/znd/PublicEmailDomains'),
          meta: { title: 'Public Email Domains' },
          hidden: true
        },
         // znd/login
        {
          path: '/login',
          name: 'Login',
          publiclyAccessible: true,
          defaultLoginRoute: true,
          component: () => import('@/views/znd/Login'),
          meta: { title: 'Login' },
          hidden: true
        },
        // znd/profile
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('@/views/znd/Profile'),
          meta: { title: 'Profile' },
          hidden: true
        }
      ]
    }
  ],
  [APP_NAME.LINK_DEV]: [
    {
      path: '/',
      name: 'index',
      component: BasicLayout,
      meta: { title: 'menu.home' },
      redirect: '/task-square',
      children: [
        // task-square
        {
          path: '/task-square',
          name: 'TaskSquare',
          component: () => import('@/views/link/TaskSquare'),
          meta: { title: '任务广场', icon: 'appstore' }
        },
        // personal-center
        {
          path: '/personal-center',
          name: 'PersonalCenter',
          component: () => import('@/views/link/PersonalCenter'),
          meta: { title: '个人中心', icon: 'user' }
        },
        // My Orders
        {
          path: '/my-orders',
          name: 'MyOrders',
          component: () => import('@/views/link/MyOrders'),
          meta: { title: '我的订单', icon: 'database' }
        }
      ]
    },
    {
      path: '/register-pre',
      name: 'registerPre',
      publiclyAccessible: true,
      component: () => import('@/views/link/RegisterPre'),
      hidden: true
    },
    {
      path: '/t-register',
      name: 'tRegister',
      publiclyAccessible: true,
      component: () => import('@/views/link/TRegister'),
      hidden: true
    },
    {
      path: '/t-login',
      name: 'tLogin',
      publiclyAccessible: true,
      defaultLoginRoute: true,
      component: () => import('@/views/link/TLogin'),
      hidden: true
    }
  ],
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
  ],
  [APP_NAME.REPAYMENT_PLAN]: [
    {
      path: '/list',
      name: 'List',
      publiclyAccessible: true,
      defaultLoginRoute: true,
      component: () => import('@/views/repayment_plan/List'),
      hidden: true
    }
  ],
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
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
