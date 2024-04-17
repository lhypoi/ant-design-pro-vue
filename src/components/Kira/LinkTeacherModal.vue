<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-modal
      v-if="linkTeacherModalParams.show"
      :title="'老师详情'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1100px'"
      @cancel="linkTeacherModalParams.show = false"
    >
      <div>
        <div v-loading="linkTeacherModalParams.loading" class="min-h-[400px]">
          <div v-if="linkTeacherModalParams.teacherData">
            <div class="flex flex-row items-start">
              <div class="w-24 h-24 rounded bg-blue-400 text-white flex justify-center items-center text-3xl leading-none">
                {{ teacher.nickName[0].toUpperCase() }}
              </div>
              <div class="flex-auto pl-4 flex flex-col gap-y-3 text-base">
                <div class="flex gap-x-4 justify-between">
                  <div class="font-bold">{{ teacher.nickName }}</div>
                </div>
                <div class="flex flex-col gap-1 leading-none">
                  <div class="text-ellipsis whitespace-nowrap overflow-hidden"><i class="el-icon-school text-blue-400"></i> {{ teacher.college }} {{ teacher.highEduLevelName }}</div>
                  <div class="text-ellipsis whitespace-nowrap overflow-hidden"><i class="el-icon-s-custom text-blue-400"></i> {{ teacher.major }}</div>
                </div>
              </div>
              <div v-if="userInfo.roleId === 2" class="flex items-center gap-x-4">
                <div class="cursor-pointer text-blue-400 leading-none">
                  <a-icon type="message" class="text-2xl" />
                </div>
                <a-button
                  class="h-10 rounded-md"
                  type="primary"
                  @click="$emit('handleOpenLinkOrderModal', linkTeacherModalParams.userId)"
                >
                  发布委托
                </a-button>
              </div>
            </div>
            <div class="pt-5">
              <div class="text-base">
                <i class="el-icon-s-opportunity text-blue-400"></i> {{ teacher.advantage }}
              </div>
            </div>
            <div class="pt-5">
              <a-tabs>
                <a-tab-pane v-if="teacher.cv.length" tab="简历" key="1">
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
                  <div>
                    <LinkFormItemImg
                      :fileList.sync="teacher.sample"
                      :disabled="true"
                    />
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
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import { downloadFile } from '@/utils//util.js'
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'
import LinkFormItemImg from '@/components/Kira/LinkFormItemImg'

export default {
  name: 'LinkTeacherModal',
  components: {
    VuePdfEmbed,
    LinkFormItemImg
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
    ...mapState(CUR_APP, [
      'userInfo'
    ]),
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
          cv: this.$parseFileNamesToObjs(teacherDataRes.data.cvList || []),
          sample: this.$parseFileNamesToObjs(teacherDataRes.data.sampleList || [])
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.linkTeacherModalParams.loading = false
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
