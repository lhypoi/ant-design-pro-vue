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
          component: () => import('@/views/znd/Info'),
          meta: { title: 'INFO', icon: 'bulb' }
        },
        // znd/license
        {
          path: '/license',
          name: 'License',
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
          component: () => import('@/views/znd/Register'),
          meta: { title: 'Register' },
          hidden: true
        },
        // znd/register
        {
          path: '/public-email-domains',
          name: 'PublicEmailDomains',
          component: () => import('@/views/znd/PublicEmailDomains'),
          meta: { title: 'Public Email Domains' },
          hidden: true
        },
         // znd/login
        {
          path: '/login',
          name: 'Login',
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
      redirect: '/task/TaskSquare',
      children: [
        // task
        {
          path: '/task/TaskSquare',
          name: 'TaskSquare',
          component: () => import('@/views/task/TaskSquare'),
          meta: { title: '任务广场', icon: 'appstore' }
        }
      ]
    }
  ]
}

export const asyncRouterMap = [
  ...asyncRouterMapAll[CUR_APP],
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/user/register-pre',
    name: 'registerPre',
    component: () => import('@/views/user/link/RegisterPre'),
    hidden: true
  },
  {
    path: '/user/t-register',
    name: 'tRegister',
    component: () => import('@/views/user/link/TRegister'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
