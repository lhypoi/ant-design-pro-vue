<template>
  <div>
    <a-upload
      :action="lingkeApi.uploadUrl"
      :multiple="true"
      name="fileList"
      list-type="picture-card"
      :fileList="fileList"
      :disabled="disabled"
      @change="(info) => handleFileChange(info)"
      @preview="handleImgPreview"
    >
      <div v-if="!disabled">
        <a-icon type="plus" />
        <div>点击上传</div>
      </div>
      <div v-if="disabled && !fileList.length">无</div>
    </a-upload>
    <el-image-viewer
      v-if="imgViewerVisible"
      :on-close="() => imgViewerVisible = false"
      :url-list="imgViewerUrlList"
      :initial-index="imgViewerInitialIndex"
    />
  </div>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import lingkeApi from '@/api/lingke'

export default {
  name: 'LinkFormItemImg',
  components: {
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
  },
  mixins: [baseMixin],
  props: {
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lingkeApi,
      imgViewerVisible: false,
      imgViewerInitialIndex: 0
    }
  },
  computed: {
    imgViewerUrlList() {
      return this.fileList.map((file) => file.downloadUrl || file.thumbUrl)
    }
  },
  mounted() {},
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
    },
    handleImgPreview(file) {
      this.imgViewerInitialIndex = this.fileList.findIndex((item) => item.uid === file.uid)
      this.imgViewerVisible = true
    }
  }
}
</script>

<style lang="less" scoped></style>
