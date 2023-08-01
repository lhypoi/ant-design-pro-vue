<template>
  <div class="Login flex-auto flex flex-col bg-white rounded-3xl p-8 pt-16">
    <div class="flex flex-row">
      <div class="w-0">

      </div>
      <div class="w-full">
        <a-form-model
          class="form"
          ref="loginForm"
          :model="formData"
          :rules="formRules"
          :label-col="formColConfig.label"
          :wrapper-col="formColConfig.wrapper"
          :colon="false"
        >
          <a-form-model-item :wrapper-col="formColConfig.noLabelRow">
            <div class="text-4xl pb-8 font-bold text-black border-b border-solid border-gray-200">Login</div>
          </a-form-model-item>
          <a-form-model-item ref="email" label="E-Mail Address" prop="email">
            <a-input
              v-model="formData.email"
              placeholder="It should be a valid and non-public domain email address."
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
          <a-form-model-item :wrapper-col="formColConfig.noLabelRow">
            <div class="flex flex-row gap-12 mt-2">
              <a-button type="primary" class="submit" size="large" :loading="submitting" @click="onSubmit">
                Log In
              </a-button>
              <a-button type="primary" class="submit" size="large" @click="handleToRegister">
                Sign Up
              </a-button>
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const regexConfig = {
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  password: /^.{8,}$/
}

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      formRules: {
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
        ]
      },
      submitting: false
    }
  },
  computed: {
    ...mapState({
      publicEmailDomains: state => state.user.publicEmailDomains
    }),
    formColConfig() {
      const label = { span: 6 }
      const wrapper = { span: 16 }
      const noLabelRow = { span: 16, offset: 6 }
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
    onSubmit() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.submitting = true
          try {
            await this.$store.dispatch('Login', {
              email: this.formData.email,
              password: this.formData.password
            })
            this.$message.success('login success')
            this.$router.push({ name: 'Home' })
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
          this.submitting = false
        }
      })
    },
    handleToRegister() {
      this.$router.push({ name: 'Register' })
    }
  }
}
</script>

<style lang="less" scoped>
.Login {
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
