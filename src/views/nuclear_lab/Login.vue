<template>
  <div class="Login">
    <div class="relative">
      <div class="relative mx-auto p-5 xl:max-w-[1200px]">
        <div class="pt-14 flex flex-row sm:pt-32">
          <div class="flex-1 flex flex-row justify-center px-5">
            <div class="w-full sm:w-[450px]">
              <a-form-model
                ref="loginForm"
                class="link-style-form"
                :model="formData"
                :rules="formRules"
              >
                <a-form-model-item>
                  <div class="text-2xl sm:text-3xl pb-5 text-center font-bold text-black">核与辐射工作场所管理系统</div>
                </a-form-model-item>
                <a-form-model-item ref="phoneNumber" prop="phoneNumber">
                  <a-input
                    v-model="formData.phoneNumber"
                    placeholder="手机号"
                    size="large"
                  />
                </a-form-model-item>
                <a-form-model-item v-if="formData.loginType === '1'" key="passWord" prop="passWord" ref="passWord">
                  <a-input-password
                    v-model="formData.passWord"
                    placeholder="密码"
                    size="large"
                  />
                </a-form-model-item>
                <a-form-model-item v-if="formData.loginType === '2'" key="smsCode" prop="smsCode" ref="smsCode">
                  <div class="flex flex-row gap-3">
                    <a-input
                      v-model="formData.smsCode"
                      placeholder="验证码"
                      @blur="() => { $refs.smsCode.onFieldChange() }"
                      @change="() => { $refs.smsCode.onFieldChange() }"
                    />
                    <a-button
                      class="send-code-btn"
                      type="primary"
                      :disabled="sendBtnData.disabled"
                      :loading="sendBtnData.loading"
                      @click="handleSendSmsCode"
                    >发送验证码</a-button>
                  </div>
                </a-form-model-item>
                <a-form-model-item>
                  <div class="pt-8 -mb-4 flex flex-row justify-between text-base">
                    <!-- <div class="cursor-pointer text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-4">注册账号</div> -->
                    <!-- <div class="cursor-pointer text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-4">修改密码</div> -->
                  </div>
                </a-form-model-item>
                <a-form-model-item>
                  <a-button
                    type="primary"
                    block
                    class="step-btn"
                    :loading="submitting"
                    @click="onSubmit"
                  >
                    登录
                  </a-button>
                </a-form-model-item>
                <a-form-model-item>
                  <div class="-mt-3 pb-4 flex flex-row justify-between text-base">
                    <div class="flex flex-row gap-1 items-center">
                      <!-- <div>
                        其他登录：
                      </div>
                      <a-tooltip>
                        <template slot="title">
                          微信扫码登录
                        </template>
                        <div class="group w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer">
                          <a-icon type="wechat" class="text-lg text-green-400 group-hover:text-green-500" />
                        </div>
                      </a-tooltip> -->
                    </div>
                    <div class="flex flex-row gap-1 items-center">
                      <div
                        v-for="alternativeLoginType in alternativeLoginTypes"
                        :key="alternativeLoginType.key"
                        class="cursor-pointer text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-4"
                        @click="formData.loginType = alternativeLoginType.key"
                      >
                        {{ alternativeLoginType.value }}
                      </div>
                    </div>
                  </div>
                </a-form-model-item>
                <!-- <a-form-model-item>
                  <div class="flex flex-row justify-center gap-1">
                    <div>注册和登录即表示已阅读和同意</div>
                    <div class="cursor-pointer text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-4">服务条款</div>
                  </div>
                </a-form-model-item> -->
              </a-form-model>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import { sendSmsCode } from '@/api/lingke'
import { resetRouter } from '@/router/index'

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        loginType: '',
        phoneNumber: '',
        passWord: '',
        smsCode: ''
      },
      formRules: {
        phoneNumber: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('请输入手机号'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        passWord: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('请输入密码'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        smsCode: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('请输入验证码'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ]
      },
      sendBtnData: {
        disabled: false,
        loading: false,
        countdown: 60,
        timer: null
      },
      submitting: false
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'loginTypeEnum'
    ]),
    alternativeLoginTypes() {
      return Object.entries(this.loginTypeEnum)
        .filter(([key]) => key !== this.formData.loginType)
        .map(([key, value]) => ({
          key,
          value
        }))
    }
  },
  created() {
    this.formData.loginType = Object.keys(this.loginTypeEnum)[0]
  },
  mounted() {
  },
  methods: {
    async handleSendSmsCode() {
      const isFormValid = await new Promise((resolve) => {
        this.$refs.loginForm.validateField('phoneNumber', (err) => {
          resolve(!err)
        })
      })
      if (!isFormValid) return
      this.sendBtnData.disabled = true
      this.sendBtnData.loading = true
      try {
        const res = await sendSmsCode({
          phoneNumber: this.formData.phoneNumber
        })
        if (res && res.code === 200) {
          this.sendBtnData.timer = setInterval(() => {
            this.sendBtnData.countdown--
            if (this.sendBtnData.countdown <= 0) {
              clearInterval(this.sendBtnData.timer)
              this.sendBtnData.timer = null
              this.sendBtnData.countdown = 60
              this.sendBtnData.disabled = false
            }
          }, 1000)
        } else {
          throw new Error(res.message || '发送失败')
        }
      } catch (error) {
        this.sendBtnData.disabled = false
        this.$message.error(error.message)
        console.log(error)
      }
      this.sendBtnData.loading = false
    },
    onSubmit() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.submitting = true
          try {
            const params = {
              loginType: this.formData.loginType,
              phoneNumber: this.formData.phoneNumber
            }
            if (this.formData.loginType === '1') params.password = this.formData.passWord
            if (this.formData.loginType === '2') params.smsCode = this.formData.smsCode
            await this.$store.dispatch('Login', params)
            this.$message.success('登录成功')
            resetRouter()
            this.$router.push({ path: '/' })
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
          this.submitting = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
