<template>
  <div class="LinkRegister z-0 bg-white flex-auto px-3 py-6 flex flex-col justify-center relative">
    <div
      class="absolute -z-10 left-0 top-2 sm:top-0 bottom-0 flex sm:items-center items-start sm:mb-[10vh] overflow-hidden"
    >
      <img src="@/assets/link//t1.png" alt="" srcset="" class="w-[60vw] h-auto" />
    </div>
    <div class="sm:mb-[10vh]">
      <div
        class="mx-auto max-w-[1200px] rounded-2xl shadow-[0px_3px_10px_0px_rgba(0,0,0,0.102)] bg-white px-4 pt-5 pb-16"
      >
        <div class="m-auto max-w-[960px]">
          <div class="text-[30px] text-center text-gray-950 tracking-widest">{{ formTitle }}</div>
          <div v-if="registerFormTabList.length > 1" class="flex pt-8 gap-x-6">
            <div
              v-for="item in registerFormTabList"
              :key="item.key"
              class="cursor-pointer text-2xl text-gray-400 hover:text-gray-800"
              :class="{
                'text-gray-950': item.key === curRegisterType,
              }"
              @click="curRegisterType = item.key"
            >
              {{ item.value }}
            </div>
          </div>
          <div class="pt-8">
            <a-tabs :active-key="curRegisterType" :tabBarStyle="{ display: 'none' }">
              <a-tab-pane v-for="item in registerFormTabList" :key="item.key" :tab="item.key">
                <div class="link-style-form">
                  <a-form-model :ref="'form_' + item.key" :model="formData[item.key]" :rules="formRules[item.key]">
                    <a-form-model-item v-if="formData[item.key].hasOwnProperty('email')" prop="email">
                      <a-input v-model="formData[item.key].email" placeholder="请输入邮箱" size="large" />
                    </a-form-model-item>
                    <a-form-model-item v-if="formData[item.key].hasOwnProperty('phone')" prop="phone">
                      <a-input v-model="formData[item.key].phone" placeholder="请输入手机号码" size="large" />
                    </a-form-model-item>
                    <a-form-model-item v-if="formData[item.key].hasOwnProperty('emailOrPhone')" prop="emailOrPhone">
                      <a-input
                        v-model="formData[item.key].emailOrPhone"
                        placeholder="请输入邮箱或手机号码"
                        size="large"
                      />
                    </a-form-model-item>
                    <a-form-model-item v-if="formData[item.key].hasOwnProperty('smsCode')" prop="smsCode" ref="smsCode">
                      <div class="flex flex-row gap-3">
                        <a-input
                          v-model="formData[item.key].smsCode"
                          placeholder="请输入验证码"
                          size="large"
                          @blur="
                            () => {
                              $refs.smsCode[0].onFieldChange()
                            }
                          "
                          @change="
                            () => {
                              $refs.smsCode[0].onFieldChange()
                            }
                          "
                        />
                        <a-button
                          class="send-code-btn"
                          type="primary"
                          :disabled="sendBtnData.disabled"
                          :loading="sendBtnData.loading"
                          @click="handleSendSmsCode(item.key)"
                        >{{ sendBtnData.loading ? '发送中' : sendBtnData.disabled ? `${sendBtnData.countdown}s 后重新发送` : '发送验证码' }}</a-button
                        >
                      </div>
                    </a-form-model-item>
                    <a-form-model-item v-if="formData[item.key].hasOwnProperty('passWord')" prop="passWord">
                      <a-input-password autocomplete="new-passWord" v-model="formData[item.key].passWord" placeholder="请输入密码" size="large" />
                    </a-form-model-item>
                    <a-form-model-item v-if="formData[item.key].hasOwnProperty('rePassWord')" prop="rePassWord">
                      <a-input-password v-model="formData[item.key].rePassWord" placeholder="请再次输入密码" size="large" />
                    </a-form-model-item>
                  </a-form-model>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div class="link-style-form pt-6 text-center">
            <a-button type="primary" block class="step-btn max-w-[500px]" :loading="submitting" @click="onSubmit">
              注册
            </a-button>
          </div>
          <div class="flex justify-center text-sm pt-7">
            <div class="text-gray-400">已有账号？</div>
            <div class="text-blue-400 cursor-pointer" @click="handleToLogin">前往登录</div>
          </div>
          <div class="flex justify-center items-center flex-wrap gap-y-1 whitespace-nowrap text-sm leading-none pt-8">
            <a-icon
              type="check-circle"
              theme="filled"
              class="cursor-pointer text-lg"
              :class="isAgree ? 'text-blue-600' : 'text-gray-400'"
              @click="isAgree = !isAgree"
            />
            <div class="text-gray-400 ml-2">已阅读并同意</div>
            <div class="text-blue-400 cursor-pointer">《服务协议》</div>
            <div class="text-blue-400 cursor-pointer">《隐私协议》</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { USER_TYPE } from '@/store/mutation-types-link-dev'
import lingkeApi from '@/api/lingke'

const FORM_RULES = {
  email: [
    { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入有效的邮箱地址', required: true }
  ],
  phone: [{ pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码', required: true }],
  passWord: [
    {
      required: true,
      message: '请输入密码'
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
      message: '请确保您的密码长度为6-20位，且包含字母和数字'
    }
  ],
  smsCode: [
    {
      required: true,
      message: '请输入验证码'
    }
  ],
  rePassWord: [
    {
      validator(rule, value, callback) {
        try {
          if (!value.trim()) {
            throw new Error('请再次输入密码')
          } else if (value !== this.formData[this.curRegisterType].passWord) {
            throw new Error('两次输入的密码不一致')
          }
          callback()
        } catch (error) {
          callback(error)
        }
      }
    }
  ]
}

const REGISTER_FORM_TYPE = {
  email: {
    key: 'email',
    value: '邮箱注册',
    smsCodeType: '2',
    loginFormAccountKey: 'email',
    data: {
      email: '',
      smsCode: '',
      passWord: '',
      rePassWord: ''
    },
    rules: {
      email: FORM_RULES.email,
      smsCode: FORM_RULES.smsCode,
      passWord: FORM_RULES.passWord,
      rePassWord: FORM_RULES.rePassWord
    }
  },
  phone: {
    key: 'phone',
    value: '手机注册',
    smsCodeType: '1',
    loginFormAccountKey: 'phone',
    data: {
      phone: '',
      smsCode: '',
      passWord: '',
      rePassWord: ''
    },
    rules: {
      phone: FORM_RULES.phone,
      smsCode: FORM_RULES.smsCode,
      passWord: FORM_RULES.passWord,
      rePassWord: FORM_RULES.rePassWord
    }
  }
}

export default {
  name: 'LinkRegister',
  components: {
  },
  data() {
    return {
      USER_TYPE,
      registerFormTabList: [],
      curRegisterType: '',
      formData: {},
      formRules: {},
      submitting: false,
      isAgree: false,
      sendBtnData: {
        disabled: false,
        loading: false,
        countdown: 60,
        timer: null
      }
    }
  },
  computed: {
    userType() {
      return this.$route.meta.userType
    },
    formTitle() {
      return {
        [USER_TYPE.TEACHER]: '注册领克数云教师账户',
        [USER_TYPE.ORGANIZATION]: '注册领克数云企业账户'
      }[this.userType]
    }
  },
  created() {
    this.initTabList()
  },
  mounted() {
  },
  methods: {
    initTabList() {
      this.registerFormTabList = {
        [USER_TYPE.TEACHER]: [REGISTER_FORM_TYPE.email],
        [USER_TYPE.ORGANIZATION]: [REGISTER_FORM_TYPE.phone, REGISTER_FORM_TYPE.email]
      }[this.userType]
      this.curRegisterType = this.registerFormTabList[0].key
      const [formData, formRules] = this.registerFormTabList.reduce(
        (acc, item) => {
          acc[0][item.key] = item.data
          acc[1][item.key] = Object.keys(item.rules).reduce((acc, key) => {
            acc[key] = item.rules[key].map((rule) => {
              if (rule.validator) {
                rule.validator = rule.validator.bind(this)
              }
              return rule
            })
            return acc
          }, {})
          return acc
        },
        [{}, {}]
      )
      this.formData = formData
      this.formRules = formRules
    },
    async handleSendSmsCode(formKey) {
      const targetFormItemKey = Object.keys(this.formData[formKey])[0]
      const isFormValid = await new Promise((resolve) => {
        this.$refs['form_' + formKey][0].validateField(targetFormItemKey, (err) => {
          resolve(!err)
        })
      })
      if (!isFormValid) return
      this.sendBtnData.disabled = true
      this.sendBtnData.loading = true
      try {
        const res = await lingkeApi.sendSmsCode({
          account: this.formData[formKey][targetFormItemKey],
          type: REGISTER_FORM_TYPE[formKey].smsCodeType
        })
        if (res && res.code === 200) {
          this.$message.success('发送成功')
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
    async onSubmit() {
      const isFormValid = await new Promise((resolve) => {
        this.$refs['form_' + this.curRegisterType][0].validate(async valid => {
          resolve(valid)
        })
      })
      if (!isFormValid) return
      if (this.checkIsAgree() === false) return
      this.submitting = true
      try {
        const formData = this.formData[this.curRegisterType]
        let res = null
        if (this.userType === USER_TYPE.TEACHER && this.curRegisterType === 'email') {
          res = await lingkeApi.teacherSignup({
            email: formData.email,
            smsCode: formData.smsCode,
            passWord: formData.passWord,
            rePassWord: formData.rePassWord
          })
        } else if (this.userType === USER_TYPE.ORGANIZATION) {
          res = await lingkeApi.organizationSignup({
            account: formData[REGISTER_FORM_TYPE[this.curRegisterType].loginFormAccountKey],
            type: REGISTER_FORM_TYPE[this.curRegisterType].smsCodeType,
            smsCode: formData.smsCode,
            passWord: formData.passWord,
            rePassWord: formData.rePassWord
          })
        }
        if (res && res.data === 1) {
          this.showSuccessModal()
        } else {
          throw new Error(res.message || '注册失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.submitting = false
    },
    checkIsAgree() {
      if (!this.isAgree) {
        this.$message.error('请先阅读并同意《服务协议》和《隐私协议》')
        return false
      }
    },
    handleToLogin() {
      this.$router.push({
        name: this.userType === USER_TYPE.TEACHER ? 'tLogin' : 'oLogin'
      })
    },
    showSuccessModal() {
      const modal = this.$info({
        icon: () => null,
        class: 'hidden-confirm-btns',
        centered: true,
        width: 680,
        content: () => {
          return (
            <div class="flex flex-col items-center pb-2">
              <div class="w-[100px]">
                <img src={ require('@/assets/link/r1.webp') } alt="" class="w-full" />
              </div>
              <div class="text-[32px] text-gray-800 pt-5">注册成功</div>
              <div class="text-[24px] text-gray-800 pt-2">
                —— 即将前往登陆 ——
              </div>
            </div>
          )
        }
      })
      setTimeout(async () => {
        const formData = this.formData[this.curRegisterType]
        const account = formData[REGISTER_FORM_TYPE[this.curRegisterType].loginFormAccountKey]
        await this.$store.dispatch('Login', {
          loginType: '1',
          account: account,
          passWord: formData.passWord
        })
        modal.destroy()
        this.$nextTick(() => {
          this.handleToLogin()
        })
      }, 1000)
    }
  }
}
</script>
