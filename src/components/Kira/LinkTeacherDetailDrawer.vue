<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-drawer
      placement="right"
      :closable="false"
      :visible="!!detailId"
      :get-container="() => $parent.$el"
      :wrap-style="{ position: 'absolute' }"
      width="100%"
    >
      <div>
        <div class="pb-6">
          <a-icon
            type="left-circle"
            theme="filled"
            class="cursor-pointer text-blue-600 hover:text-blue-400 text-4xl"
            @click="handleBack"
          />
        </div>
        <div class="text-2xl font-bold text-slate-900">老师详情</div>
        <div class="text-sm text-slate-400">Teacher details</div>
        <div v-if="!detailData" class="pt-8">
          <a-skeleton avatar active :paragraph="{ rows: 4 }" />
        </div>
        <div
          v-else
          class="pt-8"
          v-loading="detailDataLoading"
        >
          <div class="link-style-form">
            <a-form-model
              :model="detailData"
              :label-col="{ span: 5 }"
              :wrapper-col="{ offset: isMobile ? 0 : 1, span: 16 }"
            >
              <div
                class="text-gray-800 text-lg font-bold px-2 py-2 border-b-2 mb-6 border-solid border-gray-600"
              >
                基本信息：
              </div>
              <a-form-model-item prop="name" label="姓名">
                <a-input
                  v-model="detailData.name"
                  placeholder="请输入姓名"
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item prop="type" label="最高学历">
                <a-select
                  allowClear
                  showArrow
                  size="large"
                  placeholder="请选择最高学历"
                  v-model="detailData.highEduLevel"
                  :disabled="true"
                >
                  <a-select-option v-for="(label, key) in highEduLevelDict" :key="key" :value="key" class="pl-5">
                    {{ label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="major" label="专业">
                <a-input
                  v-model="detailData.major"
                  placeholder="请输入专业"
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item prop="college" label="学校">
                <a-input
                  v-model="detailData.college"
                  placeholder="请输入学校"
                  :disabled="true"
                />
              </a-form-model-item>
              <div
                class="text-gray-800 text-lg font-bold px-2 py-2 border-b-2 mb-6 border-solid border-gray-600"
              >
                擅长做什么：
              </div>
              <a-form-model-item prop="advantage" :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
                <a-textarea
                  v-model="detailData.advantage"
                  :disabled="true"
                  :rows="5"
                  placeholder="请输入擅长领域：例如：擅长数据分析、数据挖掘、数据建模，精通SPSS、Python、R等分析工具，熟练掌握tableau、power等可视化工具。"
                />
              </a-form-model-item>
              <div
                class="text-gray-800 text-lg font-bold px-2 py-2 border-b-2 mb-6 border-solid border-gray-600"
              >
                会使用哪些工具：
              </div>
              <a-form-model-item prop="tools" :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
                <a-select
                  allowClear
                  showArrow
                  mode="tags"
                  size="large"
                  placeholder="请选择或直接输入"
                  v-model="detailData.tools"
                  :disabled="true"
                >
                  <a-select-option v-for="tool in localDict.toolsList" :key="tool" :value="tool" class="pl-5">
                    {{ tool }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <div
                class="text-gray-800 text-lg font-bold px-2 py-2 border-b-2 mb-6 border-solid border-gray-600"
              >
                我想做什么：
              </div>
              <a-form-model-item prop="want" :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
                <a-checkbox-group
                  v-model="detailData.want"
                  :disabled="true"
                  :options="Object.keys(orderTypeDict).map(key => ({ value: key, label: orderTypeDict[key] }))"
                  class="flex justify-between"
                />
              </a-form-model-item>
              <a-form-model-item prop="sample" label="文书sample">
                <a-upload-dragger
                  class="dragUploader"
                  :action="lingkeApi.uploadUrl"
                  :disabled="true"
                  :fileList="detailData.sample"
                  @preview="handleFileDownload"
                >
                  <div class="">
                  </div>
                </a-upload-dragger>
              </a-form-model-item>
              <div
                class="text-gray-800 text-lg font-bold px-2 py-2 border-b-2 mb-6 border-solid border-gray-600"
              >
                简历：
              </div>
              <a-form-model-item :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
                <div class="relative h-[70vh] pr-1 -mr-1 mb-5" :class="pdfBoxParams.loading ? 'overflow-hidden' : 'overflow-auto'">
                  <a-spin
                    v-if="pdfBoxParams.loading"
                    class="absolute z-10 left-0 right-0 top-0 bottom-0 bg-gray-300 flex flex-col gap-5 justify-center items-center"
                    tip="加载中......"
                  >
                    <a-icon slot="indicator" type="loading" class="text-4xl" spin />
                  </a-spin>
                  <div class="pdf-box p-3 bg-gray-500 min-h-full">
                    <vue-pdf-embed
                      v-if="detailData.cv[0]?.downloadUrl"
                      ref="pdf"
                      :source="detailData.cv[0].downloadUrl"
                      @progress="handlePdfProgress"
                    />
                  </div>
                </div>
              </a-form-model-item>
              <div
                class="text-gray-800 text-lg font-bold px-2 py-2 border-b-2 mb-6 border-solid border-gray-600"
              >
                认证信息：
              </div>
              <a-form-model-item prop="diploma" label="上传毕业证/学生证">
                <div class="flex flex-row items-center gap-8">
                  <div
                    v-if="detailData.diploma[0]"
                    class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
                  >
                    <el-image
                      v-if="detailData.diploma[0].downloadUrl"
                      class="w-28 h-auto"
                      :src="detailData.diploma[0].downloadUrl"
                      :preview-src-list="[
                        detailData.diploma[0].downloadUrl
                      ]"
                    >
                      <a-spin slot="placeholder" class="w-28 pt-4" />
                    </el-image>
                    <a-spin v-else class="w-28 pt-4" />
                  </div>
                  <div
                    v-else
                    class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md"
                  >
                    无
                  </div>
                  <component :is="getTeacherCertifiStatusText('diploma')" />
                </div>
              </a-form-model-item>
              <a-form-model-item prop="transcript" label="上传成绩单">
                <div class="flex flex-row items-center gap-8">
                  <div
                    v-if="detailData.transcript[0]"
                    class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
                  >
                    <el-image
                      v-if="detailData.transcript[0].downloadUrl"
                      class="w-28 h-auto"
                      :src="detailData.transcript[0].downloadUrl"
                      :preview-src-list="[
                        detailData.transcript[0].downloadUrl
                      ]"
                    >
                      <a-spin slot="placeholder" class="w-28 pt-4" />
                    </el-image>
                    <a-spin v-else class="w-28 pt-4" />
                  </div>
                  <div
                    v-else
                    class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md"
                  >
                    无
                  </div>
                  <component :is="getTeacherCertifiStatusText('transcript')" />
                </div>
              </a-form-model-item>
              <a-form-model-item prop="visa" label="上传签证">
                <div class="flex flex-row items-center gap-8">
                  <div
                    v-if="detailData.visa[0]"
                    class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
                  >
                    <el-image
                      v-if="detailData.visa[0].downloadUrl"
                      class="w-28 h-auto"
                      :src="detailData.visa[0].downloadUrl"
                      :preview-src-list="[
                        detailData.visa[0].downloadUrl
                      ]"
                    >
                      <a-spin slot="placeholder" class="w-28 pt-4" />
                    </el-image>
                    <a-spin v-else class="w-28 pt-4" />
                  </div>
                  <div
                    v-else
                    class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md"
                  >
                    无
                  </div>
                  <component :is="getTeacherCertifiStatusText('visa')" />
                </div>
              </a-form-model-item>
              <div
                class="text-gray-800 text-lg font-bold px-2 py-2 border-b-2 mb-6 border-solid border-gray-600"
              >
                收款信息：
              </div>
              <a-form-model-item prop="name" label="收款人姓名">
                <a-input
                  v-model="detailData.name"
                  placeholder="请输入收款人姓名"
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item prop="bankNum" label="收款人账号">
                <a-input
                  v-model="detailData.bankNum"
                  placeholder="请输入收款人账号"
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item prop="bankBranch" label="开户行支行">
                <a-input
                  v-model="detailData.bankBranch"
                  placeholder="请输入开户行支行"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
      </div>
    </a-drawer>
    <a-modal
      v-if="adminAuditTeacherModalParams.show"
      :title="'资料审核'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '640px'"
      @cancel="adminAuditTeacherModalParams.show = false"
    >
      <div class="">
        <div v-if="adminAuditTeacherModalParams.formKey" class="link-style-form">
          <a-form-model
            :model="detailData"
            :label-col="{ span: 5 }"
            :wrapper-col="{ offset: isMobile ? 0 : 1, span: 16 }"
          >
            <a-form-model-item :prop="'status'" label="审核状态">
              <a-select
                allowClear
                showArrow
                size="large"
                placeholder="请选择审核状态"
                v-model="adminAuditTeacherModalParams.formData['status']"
              >
                <template
                  v-for="(label, key) in codeDict.teacher[adminAuditTeacherModalParams.formKey + 'Status']"
                >
                  <a-select-option v-if="key !== '1'" :key="key" :value="key" class="pl-5">
                    {{ label }}
                  </a-select-option>
                </template>
              </a-select>
              <div v-if="adminAuditTeacherModalParams.formData['status'] === '3'" class="pt-2">
                <a-textarea
                  v-model="adminAuditTeacherModalParams.formData['remark']"
                  :rows="5"
                  placeholder="请描述不通过原因"
                />
              </div>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
              <div class="pt-2 flex flex-row gap-20">
                <a-button
                  class="h-11 w-40 rounded-md text-base"
                  type="primary"
                  size="large"
                  @click="handleAdminAuditTeacher"
                >
                  提交
                </a-button>
              </div>
            </a-form-model-item>
          </a-form-model>
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

export default {
  name: 'LinkTeacherDetailDrawer',
  components: {
    VuePdfEmbed
  },
  mixins: [baseMixin],
  props: {
  },
  data () {
    return {
      lingkeApi,
      detailData: null,
      detailDataLoading: false,
      pdfBoxParams: {
        loading: false
      },
      adminAuditTeacherModalParams: {
        show: false,
        formKey: '',
        formData: {
          status: undefined,
          remark: ''
        }
      }
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'userInfo',
      'localDict'
    ]),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    highEduLevelDict() {
      return this.codeDict.teacher && this.codeDict.teacher.highEduLevel || {}
    },
    orderTypeDict() {
      return this.codeDict.order && this.codeDict.order.type || {}
    },
    detailId() {
      return this.$route.query.userId
    }
  },
  watch: {
    detailId: {
      handler() {
        this.handleDetailIdChange()
      },
      immediate: true
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: this.$route.name })
    },
    async handleDetailIdChange() {
      if (this.detailId) {
        this.detailDataLoading = true
        try {
          const res = await lingkeApi.teacherGetOne({
            userId: parseInt(this.detailId)
          })
          if (res && res.code === 1000) {
            const teacherInfo = res.data
            this.detailData = {
              ...teacherInfo,
              userId: parseInt(this.detailId),
              name: teacherInfo.name,
              highEduLevel: teacherInfo.highEduLevel,
              major: teacherInfo.major,
              college: teacherInfo.college,
              advantage: teacherInfo.advantage,
              tools: teacherInfo.tools.split(','),
              want: teacherInfo.want.split(','),
              sample: this.parseFileNamesToObjs(teacherInfo.sampleList || []),
              cv: this.parseFileNamesToObjs(teacherInfo.cvList || []),
              diploma: this.parseFileNamesToObjs(teacherInfo.diplomaList || []),
              transcript: this.parseFileNamesToObjs(teacherInfo.transcriptList || []),
              visa: this.parseFileNamesToObjs(teacherInfo.visaList || []),
              bankNum: teacherInfo.bankNum,
              bankBranch: teacherInfo.bankBranch,
              idNo: teacherInfo.idNo
            }
          } else {
            throw new Error(res.msg || '加载失败')
          }
        } catch (error) {
          this.$message.error(error.message)
          console.log(error)
        }
        this.detailDataLoading = false
      } else {
        this.detailData = null
      }
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
    handlePdfProgress({ loaded, total }) {
      this.pdfBoxParams.loading = loaded !== total
    },
    getTeacherCertifiStatusText(formKey) {
      const formKeyStatus = this.detailData[formKey + 'Status'] || '1'
      const text = this.codeDict.teacher[formKey + 'Status'][formKeyStatus]
      const colorMap = {
        '1': '#2db7f5',
        '2': '#87d068',
        '3': '#f50'
      }
      const color = colorMap[formKeyStatus]
      return {
        render: () => {
          return formKeyStatus !== '1' ? (
            <div color={ color } class="text-lg" style={ { color: color } }>
              { text }
            </div>
          ) : (
            <a-button
              class="h-10 rounded-md text-base"
              type="primary"
              size="large"
              onClick={ () => this.handleShowAdminAuditTeacherModal(formKey) }
            >
              审核
            </a-button>
          )
        }
      }
    },
    handleShowAdminAuditTeacherModal(formKey) {
      this.adminAuditTeacherModalParams = {
        show: true,
        formKey: formKey,
        formData: {
          status: undefined,
          remark: ''
        }
      }
    },
    handleAdminAuditTeacher() {
      this.$confirm({
        title: '提示',
        content: `确定提交？`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.teacherUpdate({
              userId: this.detailData.userId,
              [this.adminAuditTeacherModalParams.formKey + 'Status']: this.adminAuditTeacherModalParams.formData.status,
              [this.adminAuditTeacherModalParams.formKey + 'Remark']: this.adminAuditTeacherModalParams.formData.status === '3' ? this.adminAuditTeacherModalParams.formData.remark : ''
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('提交成功')
              this.handleReload()
            } else {
              throw new Error(res.msg || '失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    handleReload() {
      if (this.detailId) this.handleDetailIdChange()
      if (this.adminAuditTeacherModalParams.show) {
        this.adminAuditTeacherModalParams.show = false
        this.detailData = null
      }
      this.$emit('reload')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
