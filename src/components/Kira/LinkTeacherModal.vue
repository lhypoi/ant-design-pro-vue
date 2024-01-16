<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-modal
      v-if="linkTeacherModalParams.show"
      :title="'教师详情'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1100px'"
      @cancel="linkTeacherModalParams.show = false"
    >
      <div>
        <div v-loading="linkTeacherModalParams.loading" class="min-h-[400px]">
          <div v-if="linkTeacherModalParams.teacherData">
            <div class="flex flex-row">
              <div class="w-24 rounded-md overflow-hidden">
                <div class="relative pr-[100%] pb-[100%] cursor-pointer">
                  <el-image
                    class="absolute w-full h-full"
                    :src="require('@/assets/link/task-type-1.png')"
                  />
                </div>
              </div>
              <div class="flex-auto pl-4 flex flex-col gap-y-1 text-base">
                <div class="flex gap-x-4 justify-between">
                  <div class="font-bold">{{ teacher.name }}</div>
                  <!-- <div class="font-bold">{{ `ID: ${ teacher.userId }` }}</div> -->
                </div>
                <div class="flex gap-x-4">
                  <div>{{ teacher.college }}</div>
                  <div>{{ `${ teacher.highEduLevelName }` }}</div>
                </div>
                <div class="flex gap-x-4">
                  <div>{{ `专业: ${ teacher.major }` }}</div>
                  <div>{{ `擅长使用的工具: ${ teacher.tools }` }}</div>
                </div>
              </div>
            </div>
            <div class="pt-5">
              <div class="text-base">
                {{ teacher.advantage }}
              </div>
            </div>
            <div class="pt-5 flex flex-row gap-x-4 flex-wrap gap-y-2">
              <a-button
                class="h-10 rounded-md"
                type="primary"
                @click="handleShowContact"
              >
                查看联系方式
              </a-button>
              <a-button
                class="h-10 rounded-md"
                type="primary"
                @click="$emit('handleOpenLinkOrderModal', linkTeacherModalParams.userId)"
              >
                发起委托
              </a-button>
              <a-button
                class="h-10 rounded-md"
                type="primary"
              >
                在线沟通
              </a-button>
            </div>
            <div class="pt-5">
              <a-tabs>
                <a-tab-pane tab="简历" key="1">
                  <div class="relative h-[70vh] pr-1 -mr-1 mb-5" :class="linkTeacherModalParams.pdfLoading ? 'overflow-hidden' : 'overflow-auto'">
                    <a-spin
                      v-if="linkTeacherModalParams.pdfLoading"
                      class="absolute z-10 left-0 right-0 top-0 bottom-0 bg-gray-300 flex flex-col gap-5 justify-center items-center"
                      tip="加载中......"
                    >
                      <a-icon slot="indicator" type="loading" class="text-4xl" spin />
                    </a-spin>
                    <div class="pdf-box p-3 bg-gray-500 min-h-full">
                      <vue-pdf-embed
                        v-if="teacher.cv[0]?.downloadUrl"
                        ref="pdf"
                        :source="teacher.cv[0].downloadUrl"
                        @progress="({ loaded, total }) => linkTeacherModalParams.pdfLoading = loaded !== total"
                      />
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane v-if="teacher.sample.length" tab="文书sample" key="2">
                  <div class="link-style-form">
                    <a-upload-dragger
                      class="dragUploader"
                      disabled
                      :fileList="teacher.sample"
                      @preview="handleFileDownload"
                    >
                      <div class="h-0">
                      </div>
                    </a-upload-dragger>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import { mapGetters } from 'vuex'
import lingkeApi from '@/api/lingke'
import { downloadFile } from '@/utils//util.js'
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'

export default {
  name: 'LinkTeacherModal',
  components: {
    VuePdfEmbed
  },
  mixins: [baseMixin],
  props: {
  },
  data () {
    return {
      lingkeApi,
      linkTeacherModalParams: {
        show: false,
        loading: false,
        pdfLoading: false,
        userId: '',
        teacherData: null
      }
    }
  },
  computed: {
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    teacher() {
      return this.linkTeacherModalParams.teacherData
    }
  },
  methods: {
    async handleOpenLinkTeacherModal(userId) {
      this.linkTeacherModalParams = {
        ...this.linkTeacherModalParams,
        show: true,
        loading: true,
        pdfLoading: true,
        userId: userId,
        teacherData: null
      }
      try {
        const teacherDataRes = await lingkeApi.teacherGetOne({
          userId: userId
        })
        this.linkTeacherModalParams.teacherData = {
          ...teacherDataRes.data,
          cv: this.parseFileNamesToObjs(teacherDataRes.data.cvList || []),
          sample: this.parseFileNamesToObjs(teacherDataRes.data.sampleList || [])
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.linkTeacherModalParams.loading = false
    },
    parseFileNamesToObjs(names) {
      return names.map(name => {
        const [, , fileName, , fileExtension] = name.match(/(\[.*?\])?(.*)(-.*?)(\..*)$/) || []
        return {
          uid: name,
          name: (fileName + fileExtension) || name,
          status: 'done',
          uploadResName: name,
          downloadUrl: `${lingkeApi.downloadBaseUrl}?file=${name}`
        }
      })
    },
    handleFileDownload(file) {
      downloadFile(file.downloadUrl, file.name, true)
    },
    handleShowContact() {
      this.$info({
        title: '联系方式',
        icon: () => null,
        content: (
          <div class="flex flex-col gap-y-3 pt-4">
            <div class="flex flex-row gap-x-4">
              <div>
                手机号码:
              </div>
              <div class="text-blue-400">
                { this.teacher.phoneNumber }
              </div>
            </div>
            <div class="flex flex-row gap-x-4">
              <div>
                邮箱:
              </div>
              <div class="text-blue-400">
                { '无字段' }
              </div>
            </div>
          </div>
        )
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
