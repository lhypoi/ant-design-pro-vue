import storage from 'store'
import expirePlugin from 'store/plugins/expire'
// import { logout } from '@/api/login'
import { ACCESS_TOKEN, CUR_APP } from '@/store/mutation-types'
// import { welcome } from '@/utils/util'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        switch (CUR_APP) {
          default:
            break
        }
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        switch (CUR_APP) {
          default:
            break
        }
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
        resolve()
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   storage.remove(ACCESS_TOKEN)
        //   resolve()
        // }).catch((err) => {
        //   console.log('logout fail:', err)
        //   // resolve()
        // }).finally(() => {
        // })
      })
    }

  },

  getters: {
    hasLogin: state => !!(state.roles && state.roles.length !== 0)
  }
}

export default user
