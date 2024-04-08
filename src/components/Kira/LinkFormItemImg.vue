<template>
  <a-form-model-item :prop="formItemKey" :label="formItemLabel" :label-col="labelCol" :wrapper-col="wrapperCol">
    <div>
      <div class="h-0 overflow-hidden">
        <a-upload-dragger
          class="dragUploader"
          :multiple="true"
          name="fileList"
          :action="lingkeApi.uploadUrl"
          :fileList="fileList"
          @change="(info) => handleFileChange(info)"
        >
          <div :ref="`formCtrl`" class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10"></div>
        </a-upload-dragger>
      </div>
      <div class="flex flex-row items-start gap-8">
        <div
          v-if="!fileList[0]"
          class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md hover:border-indigo-400 hover:text-indigo-400"
          @click="handleFileCtrlClick"
        >
          点击上传
        </div>
        <div v-else class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2">
          <el-image
            v-if="fileList[0].downloadUrl"
            class="w-28 h-auto"
            :src="fileList[0].downloadUrl"
            :preview-src-list="[fileList[0].downloadUrl]"
          >
            <a-spin slot="placeholder" class="w-28 pt-4" />
          </el-image>
          <a-spin v-else class="w-28 pt-4" />
          <div class="text-gray-400 text-sm cursor-pointer hover:text-indigo-400" @click="handleFileCtrlClick">
            重新上传
          </div>
        </div>
        <div v-if="illustrativeGraphsUrl" class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2">
          <el-image class="w-28 h-auto" :src="illustrativeGraphsUrl" :preview-src-list="[illustrativeGraphsUrl]" />
          <div class="text-gray-400 text-sm">示例图</div>
        </div>
      </div>
    </div>
  </a-form-model-item>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import lingkeApi from '@/api/lingke'

export default {
  name: 'LinkFormItemImg',
  mixins: [baseMixin],
  props: {
    labelCol: {
      type: Object,
      default: undefined
    },
    wrapperCol: {
      type: Object,
      default: undefined
    },
    formItemKey: {
      type: String,
      default: ''
    },
    formItemLabel: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: () => []
    },
    single: {
      type: [Boolean, Number],
      default: true
    },
    illustrativeGraphsUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lingkeApi
    }
  },
  computed: {},
  methods: {
    handleFileChange(info) {
      let fileList = [...info.fileList]
      if (this.single === true) {
        fileList = fileList.slice(-1)
      } else if (this.single < 0) {
        fileList = fileList.slice(this.single)
      }
      fileList = fileList.map((file) => {
        if (file.response) {
          if (file.response.code === 200) {
            file.downloadUrl = file.response.data[0]
          } else {
            this.$message.error(file.response.message || '上传失败')
          }
        }
        return file
      })
      this.$emit('update:fileList', fileList)
    },
    handleFileCtrlClick() {
      this.$refs[`formCtrl`].click()
    }
  }
}
</script>

<style lang="less" scoped></style>
