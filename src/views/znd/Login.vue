<template>
  <div class="Login flex-auto flex flex-col bg-white rounded-3xl p-8 pt-16">
    <h1 v-if="isPageToBSP" class="text-4xl font-bold text-center pt-2 pb-16">BARCODE SNPs for Pig (BSP)</h1>
    <div class="flex flex-row">
      <div v-if="isPageToBSP" class="w-1/2">
        <div class="flex flex-col items-center pl-10 pr-12">
          <div class="text-3xl font-bold text-black pb-5">Welcome to BSP</div>
          <div class="text-xl indent-6">BARCODE SNPs for Pig (BSP), a  database of specific SNPs for indigenous pigs worldwide. It also supplies quick and precise tools for predicting the breed or population a given individual belongs to, and their potential ancestors.</div>
        </div>
        <div class="flex flex-col pl-10 pr-12 pt-20">
          <div class="text-3xl font-bold text-black pb-4">Online analysis：</div>
          <div
            class="text-xl pb-4 underline underline-offset-8 text-blue-400 cursor-pointer hover:text-blue-600"
            @click="handleToHelp(1)"
          >1. The database of specific SNPs</div>
          <div
            class="text-xl pb-4 underline underline-offset-8 text-blue-400 cursor-pointer hover:text-blue-600"
            @click="handleToHelp(2)"
          >2. Breed prediction</div>
          <div
            class="text-xl pb-4 underline underline-offset-8 text-blue-400 cursor-pointer hover:text-blue-600"
            @click="handleToHelp(3)"
          >3. Estimation of potential ancestor</div>
        </div>
      </div>
      <div :class="isPageToBSP ? 'w-1/2' : 'w-full'">
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
            <div
              class="font-bold text-black "
              :class="isPageToBSP ? 'text-3xl' : 'text-4xl border-b border-solid border-gray-200 pb-8'"
            >Login</div>
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
          <a-form-model-item v-if="isPageToBSP" :wrapper-col="formColConfig.noLabelRow">
            <div class="pt-12 flex flex-row">
              <a-button icon="container" type="primary" class="w-40 h-12 text-xl" size="large" @click="handleToHelp(0)">
                Help
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
    isPageToBSP() {
      return this.$route.query.redirect === '/BSP'
    },
    formColConfig() {
      const label = { span: this.isPageToBSP ? 5 : 6 }
      const wrapper = { span: this.isPageToBSP ? 19 : 16 }
      const noLabelRow = { span: this.isPageToBSP ? 19 : 16, offset: this.isPageToBSP ? 5 : 6 }
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
    },
    handleToHelp(target) {
      switch (target) {
        case 0:
          this.$router.push({ name: 'HelpBSP' })
          break
        case 1:
          this.$router.push({ name: 'HelpBSP', hash: '#Module_1_The_database_of_specific_SNPs_3' })
          break
        case 2:
          this.$router.push({ name: 'HelpBSP', hash: '#Module_2_Breed_prediction_22' })
          break
        case 3:
          this.$router.push({ name: 'HelpBSP', hash: '#Module_3_Estimation_of_potential_ancestors_31' })
          break
        default:
          break
      }
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
