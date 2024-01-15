// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style

import wxlogin from 'vue-wxlogin'

import InfiniteLoading from 'vue-infinite-loading'

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

Vue.component('wxlogin', wxlogin)

Vue.use(InfiniteLoading, {
  slots: {
    noResults: {
      render() {
        return (
          <a-empty description="空空如也" />
        )
      }
    },
    noMore: {
      render() {
        return (
          <div class="text-gray-400 flex flex-row justify-center items-center h-[63px]">
            --- 已到达世界尽头 ---
          </div>
        )
      }
    },
    error: {
      render() {
        const trigger = this.$attrs.trigger
        return (
          <div class="text-gray-400 flex flex-row justify-center items-center h-[63px]">
            --- 网络似乎开小差了，请稍后<span class="text-blue-400 cursor-pointer"onClick={ trigger }>重试</span> ---
          </div>
        )
      }
    }
  }
})

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
