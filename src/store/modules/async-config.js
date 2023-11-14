import { CUR_APP } from '@/store/mutation-types'

const asyncConfig = {
  namespaced: true,
  state: {
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
