<template>
  <div class="TRegister relative">
    <!-- bg -->
    <div class="absolute top-0 left-0 h-full w-1/2 bg-indigo-50 -skew-x-6 scale-x-150 -translate-x-1/4"></div>
    <div class="relative min-h-screen mx-auto px-8 py-10 xl:max-w-[1200px]">
      <div class="pb-16">
        <img :src="logoImg" alt="" class="h-6">
      </div>
      <div class="mx-auto p-4 border border-solid border-gray-400 rounded-3xl bg-white xl:max-w-[1000px]">
        <div v-if="showResultPanel" class="mx-auto xl:max-w-[600px] min-h-[600px] flex flex-col items-center pt-16 pb-16">
          <div class="h-40 w-40">
            <img src="@/assets/link/r1.webp" alt="" class="w-full">
          </div>
          <div class="text-2xl text-gray-500 pt-8 pb-20">注册成功</div>
          <div class="w-full px-28">
            <a-button
              type="primary"
              block
              size="large"
              class="rounded-xl h-14 text-xl"
              @click="handleToLogin"
            >
              前往登录
              <a-icon type="caret-right" theme="filled" />
            </a-button>
          </div>
        </div>
        <div v-else class="link-style-form mx-auto xl:max-w-[600px] min-h-[600px] flex flex-col pt-16 pb-16">
          <div class="border border-solid border-gray-400 rounded-md flex p-1">
            <div
              v-for="item in stepList"
              :key="item.key"
              class="flex-auto flex items-center justify-center h-11 text-base rounded-md transition-colors"
              :class="item.key === curStep ? 'bg-blue-50 text-slate-800' : 'text-gray-400'"
            >{{ item.label }}</div>
          </div>
          <div class="-mx-1">
            <a-tabs :active-key="curStep" :tabBarStyle="{ display: 'none' }">
              <a-tab-pane
                v-for="item in stepList"
                :key="item.key"
                :tab="item.key"
              >
                <div class="px-1 pt-12">
                  <a-form-model
                    :ref="'form_' + item.key"
                    :model="formData[item.key]"
                    :rules="formRules[item.key]"
                  >
                    <template v-if="item.key === 1">
                      <a-form-model-item prop="phoneNumber">
                        <a-input
                          v-model="formData[item.key].phoneNumber"
                          placeholder="请输入手机号码"
                        />
                      </a-form-model-item>
                      <a-form-model-item prop="passWord">
                        <a-input-password
                          v-model="formData[item.key].passWord"
                          placeholder="请输入密码"
                        />
                      </a-form-model-item>
                      <a-form-model-item prop="smsCode" ref="smsCode">
                        <div class="flex flex-row gap-3">
                          <a-input
                            v-model="formData[item.key].smsCode"
                            placeholder="请输入验证码"
                            @blur="() => { $refs.smsCode[0].onFieldChange() }"
                            @change="() => { $refs.smsCode[0].onFieldChange() }"
                          />
                          <a-button
                            class="send-code-btn"
                            type="primary"
                            :disabled="sendBtnData.disabled"
                            :loading="sendBtnData.loading"
                            @click="handleSendSmsCode(item.key)"
                          >{{ sendBtnData.disabled ? `发送验证码(${ sendBtnData.countdown }s)` : '发送验证码' }}</a-button>
                        </div>
                      </a-form-model-item>
                    </template>
                    <template v-if="item.key === 2">
                      <div class="text-sm font-bold text-black pb-3">机构类型：</div>
                      <a-form-model-item prop="type">
                        <a-select
                          allowClear
                          showArrow
                          size="large"
                          placeholder="请选择机构类型"
                          v-model="formData[item.key].type"
                        >
                          <a-select-option v-for="(label, key) in organizationTypeDict" :key="key" :value="key" class="pl-5">
                            {{ label }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">机构名称：</div>
                      <a-form-model-item prop="name">
                        <a-input
                          v-model="formData[item.key].name"
                          placeholder="请输入机构名称"
                        />
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">法人：</div>
                      <a-form-model-item prop="legalPerson">
                        <a-input
                          v-model="formData[item.key].legalPerson"
                          placeholder="请输入法人"
                        />
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">法人身份证：</div>
                      <a-form-model-item prop="idCard">
                        <a-upload-dragger
                          class="dragUploader"
                          :multiple="true"
                          name="fileList"
                          :action="uploadUrl"
                          :fileList="formData[item.key].idCard"
                          @change="info => handleFileChange(info, item.key, 'idCard', true)"
                        >
                          <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                            <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                            <div class="pt-4 text-slate-950 text-lg font-bold">
                              将文件拖到此处，或<span class="text-indigo-500">点击上传</span>
                            </div>
                          </div>
                        </a-upload-dragger>
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">营业执照：</div>
                      <a-form-model-item prop="businessLicense">
                        <a-upload-dragger
                          class="dragUploader"
                          :multiple="true"
                          name="fileList"
                          :action="uploadUrl"
                          :fileList="formData[item.key].businessLicense"
                          @change="info => handleFileChange(info, item.key, 'businessLicense', true)"
                        >
                          <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                            <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                            <div class="pt-4 text-slate-950 text-lg font-bold">
                              将文件拖到此处，或<span class="text-indigo-500">点击上传</span>
                            </div>
                          </div>
                        </a-upload-dragger>
                      </a-form-model-item>
                    </template>
                  </a-form-model>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div class="flex-auto flex flex-col justify-end pt-8">
            <div class="flex gap-4">
              <a-button
                v-if="curStep > 1"
                type="primary"
                block
                class="step-btn"
                @click="handleStepPre"
              >
                返回上一步
              </a-button>
              <a-button
                type="primary"
                block
                class="step-btn"
                :loading="submitting"
                @click="handleStepNext"
              >
                {{ curStep === 2 ? '提交' : '下一步' }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { uploadUrl, sendSmsCode, organizationSignup } from '@/api/lingke'
import { CUR_APP } from '@/store/mutation-types'

const regexConfig = {
  phoneNumber: /^1[0-9]{10}$/
}

export default {
  name: 'ORegister',
  components: {
  },
  data() {
    return {
      uploadUrl,
      stepList: [
        {
          key: 1,
          label: '第一步'
        },
        {
          key: 2,
          label: '第二步'
        }
      ],
      curStep: 1,
      formData: {
        1: {
          phoneNumber: '',
          passWord: '',
          smsCode: ''
        },
        2: {
          type: undefined,
          name: '',
          legalPerson: '',
          idCard: [],
          businessLicense: []
        }
      },
      formRules: {
        1: {
          phoneNumber: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入手机号码'))
                  } else if (!regexConfig.phoneNumber.test(value)) {
                    callback(new Error('请输入正确的手机号码'))
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
        2: {
          type: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择机构类型'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          name: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入机构名称'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          legalPerson: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入法人'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          idCard: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请上传法人身份证'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          businessLicense: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请上传营业执照'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ]
        }
      },
      sendBtnData: {
        disabled: false,
        loading: false,
        countdown: 0,
        timer: null
      },
      showResultPanel: false,
      submitting: false
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'logoImg',
      'localDict'
    ]),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    organizationTypeDict() {
      return this.codeDict.organization && this.codeDict.organization.type || {}
    }
  },
  async mounted() {
  },
  methods: {
    async handleSendSmsCode(formKey) {
      const isFormValid = await new Promise((resolve) => {
        this.$refs['form_' + formKey][0].validateField('phoneNumber', (err) => {
          resolve(!err)
        })
      })
      if (!isFormValid) return
      this.sendBtnData.disabled = true
      this.sendBtnData.loading = true
      try {
        const res = await sendSmsCode({
          phoneNumber: this.formData[formKey].phoneNumber
        })
        if (res && res.code === 1000) {
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
          throw new Error(res.msg || '发送失败')
        }
      } catch (error) {
        this.sendBtnData.disabled = false
        this.$message.error(error.message)
        console.log(error)
      }
      this.sendBtnData.loading = false
    },
    handleFileChange(info, formKey, itemKey, single) {
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.data[0]
        }
        return file
      })
      this.formData[formKey][itemKey] = fileList
    },
    handleStepNext() {
      switch (this.curStep) {
        case 1:
          this.handleToStep2()
          break
        case 2:
          this.handleSubmit()
          break
        default:
          break
      }
    },
    async handleToStep2() {
      try {
        await this.$refs['form_' + this.curStep][0].validate()
      } catch {
        this.$message.error('填写信息不符合要求，请检查')
        return
      }
      this.curStep++
    },
    async handleSubmit() {
      try {
        await this.$refs['form_' + this.curStep][0].validate()
      } catch {
        this.$message.error('填写信息不符合要求，请检查')
        return
      }
      this.submitting = true
      try {
        const res = await organizationSignup({
          phoneNumber: this.formData[1].phoneNumber,
          passWord: this.formData[1].passWord,
          smsCode: this.formData[1].smsCode,
          type: this.formData[2].type,
          name: this.formData[2].name,
          legalPerson: this.formData[2].legalPerson,
          idCard: this.formData[2].idCard[0].url,
          businessLicense: this.formData[2].businessLicense[0].url
        })
        if (res && res.data === 1) {
          this.showResultPanel = true
        } else {
          throw new Error(res.msg || '注册失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.submitting = false
    },
    handleStepPre() {
      this.curStep--
    },
    handleToLogin() {
      this.$router.push({
        name: 'tLogin'
      })
    }
  },
  beforeDestroy() {
    if (this.sendBtnData.timer) {
      clearInterval(this.sendBtnData.timer)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
