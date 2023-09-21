import { APP_NAME, CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import nuclearLabApi from '@/api/nuclearLab'

const asyncConfig = {
  namespaced: true,
  state: {
    [APP_NAME.LINK_DEV]: null,
    [APP_NAME.NUCLEAR_LAB]: null
  },

  mutations: {
    ['SET_' + CUR_APP]: (state, data) => {
      state[CUR_APP] = data
    }
  },

  actions: {
    getAsyncConfig ({ state, commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          if (state.hasOwnProperty(CUR_APP) && !state[CUR_APP]) {
            switch (CUR_APP) {
              case APP_NAME.LINK_DEV:
                const res = await lingkeApi.getCodeDict()
                if (res && res.code === 1000) {
                  commit('SET_' + CUR_APP, {
                    codeDict: res.data
                  })
                } else {
                  reject(new Error(res.msg || 'getCodeDict fail'))
                }
                break
              case APP_NAME.NUCLEAR_LAB:
                const nuclearLabRes = await nuclearLabApi.dictInfo()
                if (nuclearLabRes && nuclearLabRes.code === 200) {
                  commit('SET_' + CUR_APP, {
                    codeDict: nuclearLabRes.data
                  })
                } else {
                  reject(new Error(nuclearLabRes.msg || 'getCodeDict fail'))
                }
                break
              default:
                break
            }
          }
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }
  },

  getters: {
    codeDict: state => state[CUR_APP] ? state[CUR_APP].codeDict : {}
  }
}

export default asyncConfig
