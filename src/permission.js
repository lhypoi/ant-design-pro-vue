import router, { resetRouter } from './router'
// import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import { asyncRouterMap } from '@/config/router.config'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 递归提取 可公开访问的路由names 和 登录names
const [publicRouteNames, loginRouteNames] = ((target) => {
  const getNames = (target, res) => {
    return target.reduce((res, routeItem) => {
      const [publicRouteNames, loginRouteNames] = res
      if (routeItem.publiclyAccessible) {
        publicRouteNames.push(routeItem.name)
      }
      if (routeItem.defaultLoginRoute) {
        loginRouteNames.push(routeItem.name)
      }
      if (routeItem.children && routeItem.children.length) {
        const [childPublicRouteNames, childLoginRouteNames] = getNames(routeItem.children, res)
        publicRouteNames.concat(childPublicRouteNames)
        loginRouteNames.concat(childLoginRouteNames)
      }
      return [publicRouteNames, loginRouteNames]
    }, res)
  }
  return getNames(target, [[], []])
})(asyncRouterMap)

const allowList = [
  ...publicRouteNames,
  '404'
]
const loginRouteName = loginRouteNames[0] || '404'
const defaultRoutePath = '/'

router.beforeEach(async (to, from, next) => {
  console.log(to)
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  try {
    await store.dispatch('asyncConfig/getAsyncConfig')
  } catch (error) {
    console.log(error)
  }
  /* has token */
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    if (to.name === loginRouteName) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then(res => {
            console.log('res', res)
            // 根据用户权限信息生成可访问的路由表
            store.dispatch('GenerateRoutes', { token, ...res }).then(() => {
              // 动态添加可访问路由表
              // VueRouter@3.5.0+ New API
              resetRouter() // 重置路由 防止退出重新登录或者 token 过期后页面未刷新，导致的路由重复添加
              store.getters.addRouters.forEach(r => {
                router.addRoute(r)
              })
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch((e) => {
            notification.error({
              message: e.message
              // description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ name: storage.get('defaultLoginRoute') || loginRouteName, query: { redirect: to.fullPath } })
            })
          })
      } else {
        // TODO: 登录后意外访问到的页面，暂时都去 404，后续扩展权限提示
        if (!to.matched.length) {
          next({ name: '404' })
          return
        }
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ name: loginRouteName, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
