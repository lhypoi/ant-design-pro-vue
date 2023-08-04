<template>
  <div class="TRegister relative">
    <!-- bg -->
    <div class="absolute top-0 left-0 h-full w-1/2 bg-indigo-50 -skew-x-6 scale-x-150 -translate-x-1/4"></div>
    <div class="relative min-h-screen mx-auto px-8 py-10 xl:max-w-[1200px]">
      <div class="pb-16">
        <img src="@/assets/logo.webp" alt="" class="h-6">
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
              @click="handleStepPre"
            >
              前往登录
              <a-icon type="caret-right" theme="filled" />
            </a-button>
          </div>
        </div>
        <div v-else class="mx-auto xl:max-w-[600px] min-h-[600px] flex flex-col pt-16 pb-16">
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
                            class="sendCodeBtn"
                            type="primary"
                            :disabled="sendBtnData.disabled"
                            :loading="sendBtnData.loading"
                            @click="handleSendSmsCode(item.key)"
                          >发送验证码</a-button>
                        </div>
                      </a-form-model-item>
                    </template>
                    <template v-if="item.key === 2">
                      <a-form-model-item prop="cv">
                        <a-upload-dragger
                          class="dragUploader"
                          :multiple="true"
                          name="fileList"
                          :action="uploadUrl"
                          :fileList="formData[item.key].cv"
                          @change="info => handleFileChange(info, item.key, 'cv', true)"
                        >
                          <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                            <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                            <div class="pt-4 text-slate-950 text-lg font-bold">
                              将简历拖到此处，或<span class="text-indigo-500">点击上传</span>
                            </div>
                            <div class="pt-2 text-sm text-gray-400">
                              可导入pdf / docx / doc 格式简历，最大10MB
                            </div>
                          </div>
                        </a-upload-dragger>
                      </a-form-model-item>
                    </template>
                    <template v-if="item.key === 3">
                      <div class="text-sm font-bold text-black pb-3">我想做什么：</div>
                      <a-form-model-item prop="name">
                        <a-input
                          v-model="formData[item.key].name"
                          placeholder="请输入姓名"
                        />
                      </a-form-model-item>
                      <a-form-model-item prop="highEduLevel">
                        <a-select
                          show-search
                          allowClear
                          showArrow
                          size="large"
                          placeholder="请选择学历"
                          v-model="formData[item.key].highEduLevel"
                        >
                          <a-select-option v-for="(label, key) in highEduLevelDict" :key="key" :value="key" class="pl-5">
                            {{ label }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <a-form-model-item prop="major">
                        <a-input
                          v-model="formData[item.key].major"
                          placeholder="请输入专业"
                        />
                      </a-form-model-item>
                      <a-form-model-item prop="college">
                        <a-input
                          v-model="formData[item.key].college"
                          placeholder="请输入毕业大学"
                        />
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">擅长做什么：</div>
                      <a-form-model-item prop="advantage">
                        <a-textarea
                          v-model="formData[item.key].advantage"
                          :rows="5"
                          placeholder="请输入擅长领域：例如：擅长数据分析、数据挖掘、数据建模，精通SPSS、Python、R等分析工具，熟练掌握tableau、power等可视化工具。"
                        />
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">会使用哪些工具：</div>
                      <a-form-model-item prop="tools">
                        <a-select
                          allowClear
                          showArrow
                          mode="tags"
                          size="large"
                          placeholder="请选择或直接输入"
                          v-model="formData[item.key].tools"
                        >
                          <a-select-option v-for="tool in toolsList" :key="tool" :value="tool" class="pl-5">
                            {{ tool }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">我想做什么：</div>
                      <a-form-model-item prop="want">
                        <a-checkbox-group
                          v-model="formData[item.key].want"
                          :options="Object.keys(orderTypeDict).map(key => ({ value: key, label: orderTypeDict[key] }))"
                          class="flex justify-between"
                        />
                      </a-form-model-item>
                      <a-form-model-item prop="sample">
                        <a-upload-dragger
                          class="dragUploader"
                          :multiple="true"
                          name="fileList"
                          :action="uploadUrl"
                          :fileList="formData[item.key].sample"
                          @change="info => handleFileChange(info, item.key, 'sample', true)"
                        >
                          <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                            <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                            <div class="pt-4 text-slate-950 text-lg font-bold">
                              将文书拖到此处，或<span class="text-indigo-500">点击上传</span>
                            </div>
                            <div class="pt-2 text-sm text-gray-400">
                              可导入pdf / docx / doc 格式简历，最大10MB
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
                class="stepBtn"
                @click="handleStepPre"
              >
                返回上一步
              </a-button>
              <a-button
                type="primary"
                block
                class="stepBtn"
                :loading="submitting"
                @click="handleStepNext"
              >
                {{ curStep === 3 ? '提交' : '下一步' }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { uploadUrl, sendSmsCode, teacherSignup } from '@/api/lingke'

const regexConfig = {
  phoneNumber: /^1[0-9]{10}$/
}

export default {
  name: 'TRegister',
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
        },
        {
          key: 3,
          label: '第三步'
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
          cv: []
        },
        3: {
          name: '',
          highEduLevel: undefined,
          major: '',
          college: '',
          advantage: '',
          tools: [],
          want: [],
          sample: []
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
          cv: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请上传简历'))
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
        3: {
          name: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入姓名'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          highEduLevel: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择学历'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          major: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入专业'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          college: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入毕业大学'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          advantage: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入擅长领域'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          tools: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请选择或输入使用工具'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          want: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请选择想做什么'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          sample: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请上传文书'))
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
        countdown: 60,
        timer: null
      },
      showResultPanel: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    highEduLevelDict() {
      return this.codeDict.teacher && this.codeDict.teacher.highEduLevel || {}
    },
    orderTypeDict() {
      return this.codeDict.order && this.codeDict.order.type || {}
    },
    toolsList() {
      return [
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
          this.handleToStep3()
          break
        case 3:
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
    async handleToStep3() {
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
        const res = await teacherSignup({
          phoneNumber: this.formData[1].phoneNumber,
          passWord: this.formData[1].passWord,
          smsCode: this.formData[1].smsCode,
          cv: this.formData[2].cv[0].url,
          name: this.formData[3].name,
          highEduLevel: this.formData[3].highEduLevel,
          major: this.formData[3].major,
          college: this.formData[3].college,
          advantage: this.formData[3].advantage,
          tools: this.formData[3].tools.join(','),
          want: this.formData[3].want.join(','),
          sample: this.formData[3].sample[0].url
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
.dragUploader {
  @apply w-full mb-2;
  display: block;

  :deep(.ant-upload-drag)  {
    @apply bg-transparent border-none rounded-none;

    .ant-upload {
      @apply p-0;
    }
  }
}

.TRegister {
  :deep(.ant-form) {
    .ant-form-item {
      .ant-form-item-control {
        @apply pb-1;
      }

      .ant-form-explain {
        @apply pl-5;
      }

      .ant-input {
        @apply h-11 mb-1 rounded-md text-base border-gray-400 pl-5;
      }

      textarea.ant-input {
        @apply h-auto;
      }

      .ant-select {
        @apply block mb-1;

        .ant-select-selection {
          @apply rounded-md text-base border-gray-400;
          min-height: 44px;
          padding-top: 2px;
          padding-bottom: 6px;
        }

        .ant-select-selection__rendered {
          @apply ml-5 mr-7;
        }

        .ant-select-selection--multiple .ant-select-arrow,
        .ant-select-selection--multiple .ant-select-selection__clear {
          @apply top-6;
        }
      }

      .ant-checkbox-group {
        @apply mb-1;
      }
    }
  }

  .sendCodeBtn {
    @apply h-11 rounded-md text-base border-0;
  }

  .stepBtn {
    @apply h-12 rounded-md text-base border-0;
  }
}
</style>
