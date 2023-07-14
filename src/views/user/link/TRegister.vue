<template>
  <div class="min-h-screen relative p-6 flex flex-col justify-center">
    <!-- bg -->
    <div class="absolute top-0 left-0 h-full w-1/2 bg-indigo-50 -skew-x-6 scale-x-150 -translate-x-1/4"></div>
    <!-- logo -->
    <div class="relative flex pl-4 pb-6">
      <img src="@/assets/logo.webp" alt="" class="h-6">
    </div>
    <!-- container -->
    <div
      class="relative m-h-[624px] border border-solid border-gray-400 rounded-3xl bg-white px-4 py-8"
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
      curStep: 1,
      formData: {
        1: {
          phone: '',
          pwd: '',
          captcha: ''
        },
        2: {
          fileList: []
        },
        3: {
          name: '',
          educationAttainment: undefined,
          specializedField: '',
          college: ''
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
        if (curForm.fileList.length) flag = true
          break
        case 3:
          if (curForm.name && curForm.educationAttainment && curForm.specializedField && curForm.college) flag = true
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
</style>
