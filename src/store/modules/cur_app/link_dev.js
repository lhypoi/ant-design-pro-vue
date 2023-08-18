
const module = {
  namespaced: true,
  state: {
    logoImg: require('@/assets/link/logo.webp'),
    loginTypeEnum: {
      '1': '密码登录',
      '2': '验证码登录'
    },
    teacherInfo: {}
  },
  mutations: {
    SET_TEACHER_INFO: (state, teacherInfo) => {
      state.teacherInfo = teacherInfo
    }
  },
  actions: {

  }
}

export default module
