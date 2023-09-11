
const module = {
  namespaced: true,
  state: {
    logoImg: require('@/assets/link/logo.webp'),
    loginTypeEnum: {
      '1': '密码登录',
      '2': '验证码登录'
    },
    localDict: {
      toolsList: [
        'Java',
        'C',
        'C++',
        'Python',
        'SPSS',
        'R',
        'STATA',
        'Eview',
        'Power BI',
        'Tableau',
        'Excel',
        'SAS',
        'Matlab',
        'Latex',
        'go',
        'JS',
        'HTML',
        'VUE'
      ]
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
