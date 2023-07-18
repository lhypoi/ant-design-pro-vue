import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const publicEmailDomains = [
  'gmail.com',
  'yahoo.com',
  'yahoo.com.cn',
  'msn.com',
  'hotmail.com',
  'aol.com',
  'ask.com',
  'live.com',
  // 'qq.com', TODO: 临时注释，用于测试
  'vip.qq.com',
  'foxmail.com',
  'sina.com',
  'vip.sina.com',
  'sina.com.cn',
  'vip.sina.com.cn',
  'sohu.com',
  'outlook.com',
  'icloud.com',
  'korea.com',
  'opera.com',
  'zoho.com',
  'tom.com',
  '0355.net',
  '163.com',
  'vip.163.com',
  '163.net',
  'netease.com',
  '126.com',
  '126.net',
  '128.com',
  '189.com',
  '263.net',
  '3721.net',
  '56.com',
  'eyou.com',
  '21cn.com',
  'chinaren.com',
  'googlemail.com',
  'yeah.net',
  'aliyun.com',
  'in.com',
  'gmx.com',
  'ymail.com',
  'inbox.com',
  'naver.com',
  'chacuo.net',
  '027168.com',
  'yuoia.com',
  'tempmail.cn',
  'bareed.ws',
  'uuf.me',
  'tdtda.com',
  'getover.de',
  'guerrillamail.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'pyrelle.com',
  'moakt.co',
  'tempinbox.com',
  'mt2015.com',
  'acrossgracealley.com',
  'logdots.com',
  'iceflys.com',
  'alilot.com',
  'yevme.com',
  'mailpoof.com',
  'iubridge.com',
  'zwoho.com',
  'linshiyouxiang.net',
  'chapedia.net',
  'meantinc.com',
  'bccto.me',
  'mailtemp.top',
  'hide.biz.st',
  'yopmail.fr',
  'yopmail.net',
  'mymail.infos.st',
  '9em.org',
  'tdtd.me',
  '1655mail.com',
  'snapmail.cc',
  'xxxhai.cc',
  'lista.cc',
  'linshiyouxiang.cn',
  'linshiyouxiang.org',
  'bccto.cc',
  'taptap.icu',
  'nc0817.net',
  'deomail.top',
  'hw01.win',
  'mail.tt99.xyz',
  'tt.tt2022.xyz',
  'haolange.com',
  'tmpmail.org',
  'tmpmail.net',
  'disbox.net',
  'tmpbox.net',
  'tmails.net',
  'tmails.org',
  'tmails.ws',
  'moakt.ws',
  '139.com',
  'wo.com.cn',
  'wo.cn',
  'sina.cn',
  'nqmo.com',
  'mfk.app'
]

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    publicEmailDomains
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
        login(userInfo).then(response => {
          const result = response.result
          storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        getInfo().then(response => {
          const { result } = response
          if (result.role && result.role.permissions.length > 0) {
            const role = { ...result.role }
            role.permissions = result.role.permissions.map(permission => {
              const per = {
                ...permission,
                actionList: (permission.actionEntitySet || {}).map(item => item.action)
               }
              return per
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            // 覆盖响应体的 role, 供下游使用
            result.role = role

            commit('SET_ROLES', role)
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            // 下游
            resolve(result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          // resolve()
        }).finally(() => {
        })
      })
    }

  },

  getters: {
    hasLogin: state => !!(state.roles && state.roles.length)
  }
}

export default user
