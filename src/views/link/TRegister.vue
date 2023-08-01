<template>
  <div class="TRegister relative">
    <!-- bg -->
    <div class="absolute top-0 left-0 h-full w-1/2 bg-indigo-50 -skew-x-6 scale-x-150 -translate-x-1/4"></div>
    <div class="relative min-h-screen mx-auto px-8 py-10 xl:max-w-[1200px]">
      <div class="pb-16">
        <img src="@/assets/logo.webp" alt="" class="h-6">
      </div>
      <div class="mx-auto p-4 border border-solid border-gray-400 rounded-3xl bg-white xl:max-w-[1000px]">
        <div class="mx-auto xl:max-w-[600px] pt-16 pb-16">
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
                <div class="px-1 pt-10">
                  <a-form-model
                    :model="formData"
                    :rules="{}"
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
                      <a-form-model-item prop="smsCode">
                        <div class="flex flex-row gap-3">
                          <a-input
                            v-model="formData[item.key].smsCode"
                            placeholder="请输入验证码"
                          />
                          <a-button
                            class="sendCodeBtn"
                            type="primary"
                          >发送验证码</a-button>
                        </div>
                      </a-form-model-item>
                    </template>
                    <template v-if="item.key === 2">
                      <a-form-model-item prop="phoneNumber">
                        <a-upload-dragger
                          class="dragUploader"
                          name="file"
                          :multiple="true"
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          :fileList="formData[item.key].cv"
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
                          placeholder="请选择学历"
                          v-model="formData[item.key].highEduLevel"
                        >
                          <a-select-option v-for="filteredOption in []" :key="filteredOption" :value="filteredOption">
                            {{ filteredOption }}
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
                          :rows="4"
                          placeholder="请输入擅长领域：例如：擅长数据分析、数据挖掘、数据建模，精通SPSS、Python、R等分析工具，熟练掌握tableau、power等可视化工具。"
                        />
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">会使用哪些工具：</div>
                      <a-form-model-item prop="tools">
                        <a-select
                          show-search
                          allowClear
                          showArrow
                          placeholder="请选择或直接输入"
                          v-model="formData[item.key].tools"
                        >
                          <a-select-option v-for="filteredOption in []" :key="filteredOption" :value="filteredOption">
                            {{ filteredOption }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <div class="text-sm font-bold text-black pb-3">我想做什么：</div>
                      <a-form-model-item prop="want">
                        <a-checkbox-group
                          v-model="formData[item.key].want"
                          :options="['Apple', 'Pear', 'Orange']"
                        />
                      </a-form-model-item>
                    </template>
                  </a-form-model>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div class="w-full pt-32 flex gap-4">
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
              :disabled="!canStepNext"
              :loading="nextLoading"
              @click="handleStepNext"
            >
              {{ curStep === 3 ? '提交' : '下一步' }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <!-- logo -->
    <div class="hidden relative flex pl-4 pb-6">
      <img src="@/assets/logo.webp" alt="" class="h-6">
    </div>
    <!-- container -->
    <div
      class="hidden relative m-h-[624px] border border-solid border-gray-400 rounded-3xl bg-white px-4 py-8"
    >
      <!-- step -->
      <div class="w-full mt-8 border border-solid border-gray-400 rounded-md p-1 flex">
        <div
          v-for="item in stepList"
          :key="item.key"
          class="flex-auto flex items-center justify-center h-12 text-base rounded-md transition-colors"
          :class="item.key === curStep ? 'bg-blue-50 text-slate-950' : 'text-gray-400'"
        >{{ item.label }}</div>
      </div>
      <!-- form box -->
      <div class="w-full overflow-x-hidden min-h-[360px] p-1">
        <transition name="moveR" mode="out-in">
          <!-- form1 -->
          <div v-if="curStep === 1" :key="1">
            <div class="mt-6 border border-solid border-gray-400 rounded-md px-2 py-2 hover:border-transparent hover:ring-2">
              <a-input v-model="formData[curStep].phone" placeholder="*请输入手机号码" />
            </div>
            <div class="mt-6 border border-solid border-gray-400 rounded-md px-2 py-2 hover:border-transparent hover:ring-2">
              <a-input-password v-model="formData[curStep].pwd" placeholder="*请输入密码" />
            </div>
            <div class="mt-6 border border-solid border-gray-400 rounded-md px-2 py-2 hover:border-transparent hover:ring-2 flex">
              <a-input v-model="formData[curStep].captcha" placeholder="*请输入验证码" />
              <div class="pl-4 pr-2 whitespace-nowrap flex items-center underline underline-offset-4 text-indigo-400 cursor-pointer">发送验证码</div>
            </div>
          </div>
          <!-- form2 -->
          <div v-if="curStep === 2" :key="2" class="pt-6 pb-4 overflow-hidden">
            <div>
              <a-upload-dragger
                class="dragUploader"
                name="file"
                :multiple="true"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :fileList="formData[curStep].fileList"
                @change="handleFileChange"
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
            </div>
          </div>
          <!-- form3 -->
          <div v-if="curStep === 3" :key="3">
            <div class="mt-6 border border-solid border-gray-400 rounded-md px-2 py-2 hover:border-transparent hover:ring-2">
              <a-input v-model="formData[curStep].name" placeholder="*请输入姓名" />
            </div>
            <div class="mt-6 border border-solid border-gray-400 rounded-md px-2 py-2 hover:border-transparent hover:ring-2">
              <a-select v-model="formData[curStep].educationAttainment" class="w-full" placeholder="*请选择学历">
                <a-select-option v-for="item in educationAttainmentList" :key="item.key" :value="item.key">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
            <div class="mt-6 border border-solid border-gray-400 rounded-md px-2 py-2 hover:border-transparent hover:ring-2">
              <a-input v-model="formData[curStep].specializedField" placeholder="*请输入专业" />
            </div>
            <div class="mt-6 border border-solid border-gray-400 rounded-md px-2 py-2 hover:border-transparent hover:ring-2">
              <a-input v-model="formData[curStep].college" placeholder="*请输入大学" />
            </div>
          </div>
        </transition>
      </div>
      <!-- opt box -->
      <div class="w-full pt-3 flex">
        <!-- pre -->
        <div
          v-if="curStep > 1"
          class="transition-all w-1/2 mr-5 flex items-center justify-center text-base rounded-md py-4 bg-neutral-50 text-gray-400 hover:ring-2 cursor-pointer"
          @click="handleStepPre"
        >
          返回上一步
        </div>
        <!-- next -->
        <div
          class="transition-all w-1/2 flex-auto flex items-center justify-center text-base rounded-md py-4"
          :class="canStepNext ? 'bg-indigo-500 text-white hover:ring-2 cursor-pointer' : 'bg-neutral-50 text-gray-400 cursor-not-allowed'"
          @click="handleStepNext"
        >
          <a-icon v-if="nextLoading" type="loading" class="mr-2" />
          {{ curStep === 3 ? '提交' : '下一步' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TRegister',
  components: {
  },
  data() {
    return {
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
      curStep: 3,
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
          tools: undefined,
          want: [],
          sample: ''
        }
      },
      educationAttainmentList: [
        {
          label: '专科',
          key: '1'
        },
        {
          label: '本科',
          key: '2'
        },
        {
          label: '博士',
          key: '3'
        },
        {
          label: '硕士',
          key: '4'
        }
      ],
      nextLoading: false
    }
  },
  computed: {
    canStepNext() {
      let flag = false
      const curForm = this.formData[this.curStep]
      switch (this.curStep) {
        case 1:
          if (curForm.phone && curForm.pwd && curForm.captcha) flag = true
          break
        case 2:
        // if (curForm.fileList.length) flag = true
          break
        case 3:
          // if (curForm.name && curForm.educationAttainment && curForm.specializedField && curForm.college) flag = true
          break
        default:
          break
      }
      return flag
    }
  },
  async mounted() {
    console.log(this)
  },
  methods: {
    handleStepNext() {
      if (!this.canStepNext) return
      switch (this.curStep) {
        case 1:
          this.handleToStep2()
          break
        case 2:
          this.handleToStep2()
          break
        case 3:
          this.handleSubmit()
          break
        default:
          break
      }
    },
    async handleToStep2() {
      this.nextLoading = true
      try {
        await new Promise(resolve => setTimeout(() => {
          resolve()
        }, 500))
      } catch (error) {
        console.log(error)
      }
      this.nextLoading = false
      this.curStep++
    },
    async handleToStep3() {
      this.nextLoading = true
      try {
        await new Promise(resolve => setTimeout(() => {
          resolve()
        }, 500))
      } catch (error) {
        console.log(error)
      }
      this.nextLoading = false
      this.curStep++
    },
    async handleSubmit() {
      this.nextLoading = true
      try {
        await new Promise(resolve => setTimeout(() => {
          resolve()
        }, 500))
      } catch (error) {
        console.log(error)
      }
      this.nextLoading = false
    },
    handleStepPre() {
      this.curStep--
    },
    handleFileChange(info) {
      this.formData[this.curStep].fileList = info.fileList
    }
  }
}
</script>

<style lang="less" scoped>
.dragUploader {
  @apply w-full;
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
      .ant-input {
        @apply h-12 rounded-md text-base border-gray-400 pl-5;
      }

      .ant-select {
        @apply block;

        .ant-select-selection__rendered {
          @apply h-full;
        }

        .ant-select-selection {
          @apply h-12 rounded-md text-base border-gray-400;
        }
      }
    }
  }

  .sendCodeBtn {
    @apply h-12 rounded-md text-base border-0;
  }

  .stepBtn {
    @apply h-12 rounded-md text-base border-0;
  }
}
</style>
