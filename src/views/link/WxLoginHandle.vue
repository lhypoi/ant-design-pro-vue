<template>
  <div
    class="h-screen"
    v-loading="true"
    element-loading-text="微信登录中"
  >
  </div>
</template>

<script>
import lingkeApi from '@/api/lingke'
import { baseMixin } from '@/store/app-mixin'
import { WX_LOGIN_STATE } from '@/store/mutation-types-link-dev'

export default {
  name: 'WxLoginHandle',
  mixins: [baseMixin],
  data() {
    return {
      lingkeApi
    }
  },
  async mounted() {
    this.handleWxCode()
  },
  methods: {
    async handleWxCode() {
      const code = this.$route.query.code
      if (!code) return
      const state = this.$route.query.state
      let openId = null
      let isTeacherRegistered = false
      try {
        const res = await new Promise(resolve => {
          console.log(code)
          setTimeout(() => {
            resolve({
              code: 1000,
              data: {
                openId: 1111,
                isTeacherRegistered: false
              }
            })
          }, 1000)
        })
        if (res && res.code === 1000) {
          openId = res.data.openId
          // isTeacherRegistered = res.data.isTeacherRegistered
          isTeacherRegistered = true
        } else {
          throw new Error(res.msg || '微信登录失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
        if (state) {
          setTimeout(async () => {
            await this.$store.dispatch('Logout')
            this.$router.replace({
              name: state
            })
          }, 1000)
        }
      }
      if (openId) {
        switch (state) {
          case WX_LOGIN_STATE.T_REGISTER:
            // http://localhost:8000/link-dev/wx-login-handle?code=11111&state=tRegister
            this.$router.replace({
              name: WX_LOGIN_STATE.T_REGISTER,
              params: {
                openId,
                isTeacherRegistered
              }
            })
            break
          case WX_LOGIN_STATE.T_LOGIN:
            // http://localhost:8000/link-dev/wx-login-handle?code=11111&state=tLogin
            if (isTeacherRegistered) {
              await this.$store.dispatch('Login', {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjowLCJ1c2VySWQiOjUsInJvbGUiOiIxIiwicGhvbmVOdW1iZXIiOiIxODgyNjEwMjMyMSIsIm5hbWUiOiJsaHkiLCJleHAiOjE3MDUzOTY5NjcsImlzcyI6ImxpbmdrZSJ9.Cobt2BKYElB4wOWBFuAewjfvhS4dh3uiaiBatHIcm00'
              })
              this.$router.replace({ path: '/' })
            } else {
              this.$router.replace({
                name: WX_LOGIN_STATE.T_REGISTER,
                params: {
                  openId,
                  isTeacherRegistered
                }
              })
              this.$message.error('请完善信息')
            }
            break
          default:
            break
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
