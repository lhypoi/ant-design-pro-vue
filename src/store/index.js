import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
// 默认路由模式为静态路由 (router.config.js)
import permission from './modules/static-router'

// dynamic router permission control (Experimental)
// 动态路由模式（api请求后端生成）
// import permission from './modules/async-router'

import asyncConfig from './modules/async-config'

import getters from './getters'

import { CUR_APP } from '@/store/mutation-types'

Vue.use(Vuex)

let curAppModule = {}
try {
  curAppModule = require(`@/store/modules/cur_app/${CUR_APP}`).default
} catch {}

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    asyncConfig,
    [CUR_APP]: curAppModule
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
