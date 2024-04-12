import Vue from 'vue'
import store from '@/store'
import { CUR_APP } from '@/store/mutation-types'
import { Modal } from 'ant-design-vue'
import router from '@/router/index'

const permissionObj = {
  teacher1: () => {
    const teacherInfo = store.state[CUR_APP].userInfo.teacherInfo
    if (teacherInfo && teacherInfo.major && teacherInfo.college) {
      return true
    } else {
      Modal.confirm({
        title: '完善信息',
        icon: () => null,
        content: '请先完善个人信息',
        okText: '去完善',
        onOk() {
          router.push({ name: 'PersonalCenter' })
        },
        onCancel() {
        }
      })
    }
  }
}

const linkClick = Vue.directive('linkClick', {
  bind: function (el, binding, vnode) {
    const originalHandler = binding.value
    const interceptedHandler = function (event) {
      const hasPermission = permissionObj[binding.arg]()
      if (hasPermission) {
        originalHandler(event)
      }
    }
    el.addEventListener('click', interceptedHandler)
  }
})

export default linkClick
