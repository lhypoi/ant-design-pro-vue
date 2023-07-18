<template>
  <div class="Register flex-auto flex flex-col bg-white rounded-3xl p-8 pt-16">
    <a-form-model
      class="form"
      ref="ruleForm"
      :model="formData"
      :rules="formRules"
      :label-col="formColConfig.label"
      :wrapper-col="formColConfig.wrapper"
      :colon="false"
      @validate="handleValidate"
    >
      <a-form-model-item :wrapper-col="formColConfig.noLabelRow">
        <div class="text-4xl pb-8 font-bold text-black border-b border-solid border-gray-200">Register</div>
      </a-form-model-item>
      <a-form-model-item ref="username" label="User Name" prop="username">
        <a-input
          v-model="formData.username"
          placeholder="6-12 chars. Lowercase, digits and _ only. First character must be a letter."
          size="large"
        />
      </a-form-model-item>
      <a-form-model-item ref="password" label="Password" prop="password">
        <a-input-password
          v-model="formData.password"
          placeholder="At least 8 characters."
          size="large"
        />
      </a-form-model-item>
      <a-form-model-item ref="password2" label="Confirm Password" prop="password2">
        <a-input-password
          v-model="formData.password2"
          placeholder="At least 8 characters."
          size="large"
        />
      </a-form-model-item>
      <a-form-model-item ref="email" label="E-Mail Address" prop="email">
        <div class="flex flex-row gap-4 relative">
          <a-input
            v-model="formData.email"
            placeholder="It should be a valid and non-public domain email address."
            size="large"
            @blur="() => {$refs.email.onFieldBlur()}"
            @change="() => {$refs.email.onFieldChange()}"
          />
          <a-button
            type="primary"
            size="large"
            :disabled="!emailVerification.canSend"
            :loading="emailVerification.sending"
            @click="sendMailCode"
          >Send Code</a-button>
          <div class="absolute left-full whitespace-nowrap pl-6">
            <router-link :to="{ name: 'PublicEmailDomains' }" target="_blank">
              List of illegal email domains
            </router-link>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item ref="code" label="Code" prop="code">
        <a-input
          v-model="formData.code"
          placeholder="Please input code."
          size="large"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="formColConfig.noLabelRow">
        <a-button type="primary" class="submit mt-2" size="large" @click="onSubmit">
          Submit
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { sendMailCode } from '@/api/cau'

const regexConfig = {
  username: /^[a-z][a-z0-9_]{5,11}$/,
  password: /^.{8,}$/,
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
}

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        password2: '',
        email: '',
        code: ''
      },
      formRules: {
        username: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                } else if (!regexConfig.username.test(value)) {
                  callback(new Error('Please input 6-12 chars. Lowercase, digits and _ only. First character must be a letter.'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                } else if (!regexConfig.password.test(value)) {
                  callback(new Error('Please input at least 8 characters.'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        password2: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                } else if (!regexConfig.password.test(value)) {
                  callback(new Error('Please input at least 8 characters.'))
                } else if (value !== this.formData.password) {
                  callback(new Error('Confirm password does not match password.'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        email: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                } else if (!regexConfig.email.test(value) || this.publicEmailDomains.includes(value.split('@')[1])) {
                  callback(new Error('Please input valid and non-public domain email address.'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        code: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
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
      emailVerification: {
        canSend: false,
        sending: false
      }
    }
  },
  computed: {
    ...mapState({
      publicEmailDomains: state => state.user.publicEmailDomains
    }),
    formColConfig() {
      const label = { span: 6 }
      const wrapper = { span: 12 }
      const noLabelRow = { span: 12, offset: 6 }
      return {
        label,
        wrapper,
        noLabelRow
      }
    }
  },
  mounted() {
  },
  methods: {
    handleValidate(name, valid) {
      if (name === 'email') {
        this.emailVerification.canSend = valid
      }
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    async sendMailCode() {
      this.emailVerification.sending = true
      try {
        const res = await sendMailCode({
          email: '904579880@qq.com'
        })
        if (res && res.body === 1) {
          this.$message.success('send success')
        }
      } catch (error) {
        this.$message.error('send fail')
        console.log(error)
      }
      this.emailVerification.sending = false
    }
  }
}
</script>

<style lang="less" scoped>
.Register {
  :deep(.form) {
    .ant-form-item-label {
      @apply pr-5;
      label {
        @apply text-base;
      }
    }
  }

  .submit {
    @apply bg-green-500 border-0;
  }
}
</style>
