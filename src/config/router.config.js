// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'
import { APP_NAME, CUR_APP } from '@/store/mutation-types'
import { USER_TYPE } from '@/store/mutation-types-link-dev'
import storage from 'store'

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
      component: () => import('@/layouts/link/BasicLayout'),
      meta: { title: 'menu.home' },
      // redirect: '/task-square',
      children: [
        {
          path: '/task-square',
          name: 'TaskSquare',
          component: () => import('@/views/link/TaskSquare'),
          meta: { title: '任务广场', icon: 'appstore', permission: [1] }
        },
        {
          path: '/personal-center',
          name: 'PersonalCenter',
          component: () => import('@/views/link/PersonalCenter'),
          meta: { title: '个人中心', icon: 'user', permission: [1] }
        },
        {
          path: '/my-orders',
          name: 'MyOrders',
          component: () => import('@/views/link/MyOrders'),
          meta: { title: '我的订单', icon: 'database', permission: [1] }
        },
        {
          path: '/t-account-setting',
          name: 'TAccountSetting',
          component: () => import('@/views/link/TAccountSetting'),
          meta: { title: '账号设置', icon: 'container', permission: [1] }
        },
        {
          path: '/o-home',
          name: 'OHome',
          component: () => import('@/views/link/OHome'),
          meta: { title: '首页', icon: 'database', permission: [2] }
        },
        {
          path: '/o-orders',
          name: 'OOrders',
          component: () => import('@/views/link/OOrders'),
          meta: { title: '我的委托', icon: 'database', permission: [2] }
        },
        {
          path: '/o-personal-center',
          name: 'OPersonalCenter',
          component: () => import('@/views/link/OPersonalCenter'),
          meta: { title: '个人中心', icon: 'user', permission: [2] }
        },
        {
          path: '/organization-manage',
          name: 'OrganizationManage',
          component: () => import('@/views/link/OrganizationManage'),
          meta: { title: '机构管理', icon: 'appstore', permission: [3] }
        },
        {
          path: '/teacher-manage',
          name: 'TeacherManage',
          component: () => import('@/views/link/TeacherManage'),
          meta: { title: '老师管理', icon: 'database', permission: [3] }
        },
        {
          path: '/order-manage',
          name: 'OrderManage',
          component: () => import('@/views/link/OrderManage'),
          meta: { title: '订单管理', icon: 'container', permission: [3] }
        },
        {
          path: '/withdrawal-manage',
          name: 'WithdrawalManage',
          component: () => import('@/views/link/WithdrawalManage'),
          meta: { title: '提现管理', icon: 'table', permission: [3] }
        },
        {
          path: '/t-login',
          name: 'tLogin',
          publiclyAccessible: true,
          component: () => import('@/views/link/LinkLogin'),
          defaultLoginRoute: true,
          meta: {
            title: '教师登录',
            userType: USER_TYPE.TEACHER,
            routerBeforeEachFun: () => {
              storage.set('defaultLoginRoute', 'tLogin')
            }
          },
          hidden: true
        },
        {
          path: '/o-login',
          name: 'oLogin',
          publiclyAccessible: true,
          component: () => import('@/views/link/LinkLogin'),
          meta: {
            title: '机构登录',
            userType: USER_TYPE.ORGANIZATION,
            routerBeforeEachFun: () => {
              storage.set('defaultLoginRoute', 'oLogin')
            }
          },
          hidden: true
        },
        {
          path: '/t-register',
          name: 'tRegister',
          publiclyAccessible: true,
          component: () => import('@/views/link/LinkRegister'),
          meta: {
            title: '教师注册',
            userType: USER_TYPE.TEACHER,
            routerBeforeEachFun: () => {
              storage.set('defaultLoginRoute', 'tLogin')
            }
          },
          hidden: true
        },
        {
          path: '/o-register',
          name: 'oRegister',
          publiclyAccessible: true,
          component: () => import('@/views/link/LinkRegister'),
          meta: {
            title: '机构注册',
            userType: USER_TYPE.ORGANIZATION,
            routerBeforeEachFun: () => {
              storage.set('defaultLoginRoute', 'oLogin')
            }
          },
          hidden: true
        }
      ]
    },
    {
      path: '/register-pre-teacher',
      name: 'registerPreTeacher',
      publiclyAccessible: true,
      component: () => import('@/views/link/RegisterPre'),
      meta: { title: '教师介绍', userType: USER_TYPE.TEACHER },
      hidden: true
    },
    {
      path: '/register-pre-organization',
      name: 'registerPreOrganization',
      publiclyAccessible: true,
      component: () => import('@/views/link/RegisterPre'),
      meta: { title: '机构介绍', userType: USER_TYPE.ORGANIZATION },
      hidden: true
    },
    {
      path: '/admin-login',
      name: 'adminLogin',
      publiclyAccessible: true,
      component: () => import('@/views/link/TLogin'),
      meta: {
        title: '管理员登录',
        routerBeforeEachFun: () => {
          storage.set('defaultLoginRoute', 'adminLogin')
        }
      },
      hidden: true
    },
    {
      path: '/wx-login-handle',
      name: 'WxLoginHandle',
      publiclyAccessible: true,
      component: () => import('@/views/link/WxLoginHandle'),
      meta: {
        title: '微信登录'
      },
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
