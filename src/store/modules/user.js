import storage from 'store'
import expirePlugin from 'store/plugins/expire'
// import { logout } from '@/api/login'
import { ACCESS_TOKEN, APP_NAME, CUR_APP } from '@/store/mutation-types'
// import { welcome } from '@/utils/util'
import { signin } from '@/api/cau'
import { getUserInfo } from '@/api/cauAuth'
import lingkeApi from '@/api/lingke'
import nuclearLabApi from '@/api/nuclearLab'

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
      return new Promise(async (resolve, reject) => {
        switch (CUR_APP) {
          case APP_NAME.ZND:
            signin(userInfo).then(res => {
              if (res && res.header && res.header.resCode === '0000') {
                const token = res.body
                storage.set(ACCESS_TOKEN, token, new Date().getTime() + 10 * 60 * 60 * 1000)
                commit('SET_TOKEN', token)
                resolve()
              } else {
                reject(new Error(res.header.resMessage || 'login fail'))
              }
            }).catch(error => {
              reject(error)
            })
            break
          case APP_NAME.LINK_DEV:
            try {
              let token = userInfo.token || ''
              let resMsg = ''
              if (!token) {
                const loginApi = storage.get('defaultLoginRoute') === 'adminLogin' ? lingkeApi.adminLogin : lingkeApi.login
                const res = await loginApi({
                  loginType: userInfo.loginType,
                  account: userInfo.account,
                  passWord: userInfo.passWord,
                  smsCode: userInfo.smsCode
                })
                if (res && res.code === 200) {
                  token = res.data.token
                } else {
                  resMsg = res.message || '登录失败'
                }
              }
              if (token) {
                storage.set(ACCESS_TOKEN, token, new Date().getTime() + 10 * 60 * 60 * 1000)
                commit('SET_TOKEN', token)
                resolve()
              } else {
                reject(new Error(resMsg))
              }
            } catch (error) {
              reject(error)
            }
            break
          case APP_NAME.NUCLEAR_LAB:
            nuclearLabApi.login(userInfo).then(res => {
              if (res && res.code === 200) {
                const token = res.data.token
                storage.set(ACCESS_TOKEN, token, new Date().getTime() + 10 * 60 * 60 * 1000)
                commit('SET_TOKEN', token)
                resolve()
              } else {
                reject(new Error(res.message || '登录失败'))
              }
            }).catch(error => {
              reject(error)
            })
            break
          default:
            break
        }
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        switch (CUR_APP) {
          case APP_NAME.ZND:
            getUserInfo({}).then(res => {
              if (res && res.header && res.header.resCode === '0000') {
                const resData = res.body
                const role = {
                  id: 'standard',
                  permissions: []
                }
                const result = {
                  ...resData,
                  role: role
                }
                commit('SET_ROLES', role)
                commit('SET_INFO', result)
                resolve(result)
              } else {
                reject(new Error(res.header.resMessage || 'get userinfo fail'))
              }
            }).catch(error => {
              reject(error)
            })
            break
          case APP_NAME.LINK_DEV:
            try {
              const result = {}
              const userInfoRes = await lingkeApi.getUserInfo()
              if (userInfoRes && userInfoRes.code === 200) {
                const userInfoData = userInfoRes.data
                const role = {
                  id: userInfoData.roleId,
                  permissionList: [userInfoData.roleId]
                }
                result.role = role
                commit('SET_ROLES', role)
                const avatarName = userInfoData.nickName || userInfoData.email || userInfoData.phoneNumber || ''
                const avatarFirstLetter = avatarName?.charAt(0).toUpperCase()
                const userInfo = {
                  ...userInfoData,
                  avatarName,
                  avatarFirstLetter
                }
                commit('SET_INFO', userInfo)
                if (userInfo.roleId === 1) {
                  const teacherInfoRes = await lingkeApi.teacherGetOne({
                    userId: userInfo.userId
                  })
                  userInfo.teacherInfo = teacherInfoRes.data
                }
                commit(CUR_APP + '/SET_USER_INFO', userInfo)
              } else {
                throw new Error(userInfoRes.message || '获取用户信息失败')
              }
              resolve(result)
            } catch (error) {
              reject(error)
            }
            break
          case APP_NAME.NUCLEAR_LAB:
            try {
              const result = {}
              const userInfoRes = await nuclearLabApi.userInfo()
              if (userInfoRes && userInfoRes.code === 200) {
                const role = {
                  id: userInfoRes.data.role,
                  permissionList: userInfoRes.data.menus.map(menu => menu.name)
                }
                result.role = role
                commit('SET_ROLES', role)
                commit('SET_INFO', userInfoRes.data)
              } else {
                throw new Error(userInfoRes.message || '获取用户信息失败')
              }
              resolve(result)
            } catch (error) {
              reject(error)
            }
            break
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
