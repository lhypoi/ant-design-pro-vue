<template>
  <div class="LinkLogin z-0 bg-white flex-auto px-3 py-6 flex flex-col justify-center relative">
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
          <div class="flex py-8 gap-x-6">
            <div
              v-for="item in loginFormTabList"
              :key="item.key"
              class="cursor-pointer text-2xl text-gray-400 hover:text-gray-800"
              :class="{
                'text-gray-950': item.key === curLoginType,
              }"
              @click="curLoginType = item.key"
            >
              {{ item.value }}
            </div>
          </div>
          <div>
            <a-tabs :active-key="curLoginType" :tabBarStyle="{ display: 'none' }">
              <a-tab-pane v-for="item in loginFormTabList" :key="item.key" :tab="item.key">
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
                    <a-form-model-item v-if="formData[item.key].hasOwnProperty('passWord')" prop="passWord">
                      <a-input-password autocomplete="new-passWord" v-model="formData[item.key].passWord" placeholder="请输入密码" size="large" />
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
                        >
                          {{ sendBtnData.loading ? '发送中' : sendBtnData.disabled ? `${sendBtnData.countdown}s 后重新发送` : '发送验证码' }}
                        </a-button>
                      </div>
                    </a-form-model-item>
                  </a-form-model>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div class="link-style-form pt-6 text-center">
            <a-button type="primary" block class="step-btn max-w-[500px]" :loading="submitting" @click="onSubmit">
              登录
            </a-button>
          </div>
          <div class="flex justify-center text-sm pt-7">
            <div class="text-gray-400">没有账号？</div>
            <div class="text-blue-400 cursor-pointer" @click="handleToRegister">前往注册</div>
          </div>
          <div class="pt-6 flex flex-col items-center">
            <div class="text-sm text-gray-500 pb-4">—————— 其他登录方式 ——————</div>
            <a-icon type="wechat" class="text-2xl text-green-400 bg-gray-200 rounded-full cursor-pointer p-2" @click="handleWxLogin" />
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
    <WxLoginModal ref="WxLoginModal" />
  </div>
</template>

<script>
import { USER_TYPE, WX_LOGIN_STATE } from '@/store/mutation-types-link-dev'
import { resetRouter } from '@/router/index'
import WxLoginModal from '@/components/Kira/WxLoginModal'
import lingkeApi from '@/api/lingke'

const FORM_RULES = {
  email: [
    { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入有效的邮箱地址', required: true }
  ],
  phone: [{ pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码', required: true }],
  emailOrPhone: [
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$|^1[3456789]\d{9}$/,
      message: '请输入有效的邮箱地址或手机号码',
      required: true
    }
  ],
  passWord: [
    {
      required: true,
      message: '请输入密码'
    }
  ],
  smsCode: [
    {
      required: true,
      message: '请输入验证码'
    }
  ]
}

const LOGIN_FORM_TYPE = {
  emailPwd: {
    key: 'emailPwd',
    value: '账号登录',
    loginFormAccountKey: 'email',
    data: {
      email: '',
      passWord: ''
    },
    rules: {
      email: FORM_RULES.email,
      passWord: FORM_RULES.passWord
    }
  },
  emailSms: {
    key: 'emailSms',
    value: '验证码登录',
    smsCodeType: '2',
    loginFormAccountKey: 'email',
    data: {
      email: '',
      smsCode: ''
    },
    rules: {
      email: FORM_RULES.email,
      smsCode: FORM_RULES.smsCode
    }
  },
  emailOrPhonePwd: {
    key: 'emailOrPhonePwd',
    value: '账号登录',
    loginFormAccountKey: 'emailOrPhone',
    data: {
      emailOrPhone: '',
      passWord: ''
    },
    rules: {
      emailOrPhone: FORM_RULES.emailOrPhone,
      passWord: FORM_RULES.passWord
    }
  },
  phoneSms: {
    key: 'phoneSms',
    value: '验证码登录',
    smsCodeType: '1',
    loginFormAccountKey: 'phone',
    data: {
      phone: '',
      smsCode: ''
    },
    rules: {
      phone: FORM_RULES.phone,
      smsCode: FORM_RULES.smsCode
    }
  }
}

export default {
  name: 'LinkLogin',
  components: {
    WxLoginModal
  },
  data() {
    return {
      USER_TYPE,
      loginFormTabList: [],
      curLoginType: '',
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
        [USER_TYPE.TEACHER]: '登录领克数云教师账户',
        [USER_TYPE.ORGANIZATION]: '登录领克数云机构账户'
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
      this.loginFormTabList = {
        [USER_TYPE.TEACHER]: [LOGIN_FORM_TYPE.emailPwd, LOGIN_FORM_TYPE.emailSms],
        [USER_TYPE.ORGANIZATION]: [LOGIN_FORM_TYPE.emailOrPhonePwd, LOGIN_FORM_TYPE.phoneSms]
      }[this.userType]
      this.curLoginType = this.loginFormTabList[0].key
      const [formData, formRules] = this.loginFormTabList.reduce(
        (acc, item) => {
          acc[0][item.key] = item.data
          acc[1][item.key] = item.rules
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
          type: LOGIN_FORM_TYPE[formKey].smsCodeType
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
        this.$refs['form_' + this.curLoginType][0].validate(async valid => {
          resolve(valid)
        })
      })
      if (!isFormValid) return
      if (this.checkIsAgree() === false) return
      this.submitting = true
      try {
        const formData = this.formData[this.curLoginType]
        const account = formData[LOGIN_FORM_TYPE[this.curLoginType].loginFormAccountKey]
        await this.$store.dispatch('Login', {
          loginType: LOGIN_FORM_TYPE[this.curLoginType].hasOwnProperty('smsCodeType') ? '2' : '1',
          account: account,
          passWord: formData.passWord,
          smsCode: formData.smsCode
        })
        this.$message.success('登录成功')
        resetRouter()
        this.$router.push({ path: '/' })
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
    handleWxLogin() {
      if (this.checkIsAgree() === false) return
      this.$refs.WxLoginModal.handleShowWxLoginModalParams({
        state: WX_LOGIN_STATE[this.$route.name]
      })
    },
    handleToRegister() {
      this.$router.push({
        name: this.userType === USER_TYPE.TEACHER ? 'tRegister' : 'oRegister'
      })
    }
  }
}
</script>
