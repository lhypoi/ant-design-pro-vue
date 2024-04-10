<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-drawer
      v-if="!!detailId"
      placement="right"
      :closable="false"
      :visible="true"
      :get-container="() => $parent.$el"
      :wrap-style="{ position: 'absolute' }"
      width="100%"
    >
      <div>
        <div class="pb-2">
          <a-icon
            type="left-circle"
            theme="filled"
            class="cursor-pointer text-blue-600 hover:text-blue-400 text-3xl"
            @click="handleBack"
          />
        </div>
        <div class="text-xl font-bold text-slate-900">老师详情</div>
        <div class="text-sm text-slate-400">Teacher details</div>
        <div v-if="!detailData" class="pt-8">
          <a-skeleton avatar active :paragraph="{ rows: 4 }" />
        </div>
        <div
          v-else
          class="pt-6"
          v-loading="detailDataLoading"
        >
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3">基础信息</div>
          <div class="flex flex-wrap gap-y-2">
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">用户ID</div>
              <div class="text-gray-950">{{ detailData.userId }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">昵称</div>
              <div class="text-gray-950">{{ detailData.nickName }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">最高学历</div>
              <div class="text-gray-950">{{ detailData.highEduLevelName }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">专业</div>
              <div class="text-gray-950">{{ detailData.major }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">学校</div>
              <div class="text-gray-950">{{ detailData.college }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">毕业证/学生证</div>
              <div>
                <el-image
                  v-if="detailData.diploma[0]"
                  class="w-28 h-auto"
                  :src="detailData.diploma[0].downloadUrl"
                  :preview-src-list="[
                    detailData.diploma[0].downloadUrl
                  ]"
                />
                <div v-else>-</div>
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">成绩单</div>
              <div>
                <el-image
                  v-if="detailData.transcript[0]"
                  class="w-28 h-auto"
                  :src="detailData.transcript[0].downloadUrl"
                  :preview-src-list="[
                    detailData.transcript[0].downloadUrl
                  ]"
                />
                <div v-else>-</div>
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-24">我想做什么</div>
              <div class="text-gray-950">{{ orderTypeDict[detailData.want] }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">擅长做什么</div>
              <div class="text-gray-950">{{ detailData.advantage }}</div>
            </div>
          </div>
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3 mt-6">实名信息</div>
          <div class="flex flex-wrap gap-y-2">
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">认证状态</div>
              <div>
                <a-tag v-if="detailData.status === '1'" color="blue" class="m-0">待审核</a-tag>
                <a-tag v-else-if="detailData.status === '2'" color="green" class="m-0">已认证</a-tag>
                <a-tag v-else-if="detailData.status === '3'" color="red" class="m-0">认证不通过</a-tag>
                <a-tag v-else-if="!detailData.status" class="m-0">未认证</a-tag>
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">姓名</div>
              <div class="text-gray-950">{{ detailData.realName }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-24">手机号码</div>
              <div class="text-gray-950">{{ detailData.phoneNumber }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">身份证号码</div>
              <div class="text-gray-950">{{ detailData.idNo }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">身份证正面</div>
              <div>
                <el-image
                  v-if="detailData.cardFront[0]"
                  class="w-28 h-auto"
                  :src="detailData.cardFront[0].downloadUrl"
                  :preview-src-list="[
                    detailData.cardFront[0].downloadUrl
                  ]"
                />
                <div v-else>-</div>
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">身份证反面</div>
              <div>
                <el-image
                  v-if="detailData.cardBack[0]"
                  class="w-28 h-auto"
                  :src="detailData.cardBack[0].downloadUrl"
                  :preview-src-list="[
                    detailData.cardBack[0].downloadUrl
                  ]"
                />
                <div v-else>-</div>
              </div>
            </div>
          </div>
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3 mt-6">账号信息</div>
          <div class="flex flex-wrap gap-y-2">
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">邮箱</div>
              <div class="text-gray-950">{{ detailData.email }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">微信</div>
              <div class="text-gray-950">{{ detailData.wechatName }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">注册时间</div>
              <div class="text-gray-950">{{ detailData.createTime }}</div>
            </div>
          </div>
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3 mt-6">简历</div>
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
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-0 mt-6">文书sample</div>
          <a-upload
            :action="lingkeApi.uploadUrl"
            :disabled="true"
            :fileList="detailData.sample"
            @preview="handleFileDownload"
          >
          </a-upload>
        </div>
      </div>
    </a-drawer>
    <a-modal
      v-if="adminAuditTeacherModalParams.show"
      :title="'老师实名审核'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1000px'"
      @cancel="adminAuditTeacherModalParams.show = false"
    >
      <div class="" v-loading="detailDataLoading">
        <div v-if="!detailData" class="pb-4">
          <a-skeleton avatar active :paragraph="{ rows: 4 }" />
        </div>
        <div v-else class="link-style-form link-style-form-sm">
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3">实名信息</div>
          <div class="flex flex-wrap gap-y-2">
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">姓名</div>
              <div class="text-gray-950">{{ detailData.realName }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-24">手机号码</div>
              <div class="text-gray-950">{{ detailData.phoneNumber }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">身份证号码</div>
              <div class="text-gray-950">{{ detailData.idNo }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">身份证正面</div>
              <div>
                <el-image
                  v-if="detailData.cardFront[0]"
                  class="w-28 h-auto"
                  :src="detailData.cardFront[0].downloadUrl"
                  :preview-src-list="[
                    detailData.cardFront[0].downloadUrl
                  ]"
                />
                <div v-else>-</div>
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">身份证反面</div>
              <div>
                <el-image
                  v-if="detailData.cardBack[0]"
                  class="w-28 h-auto"
                  :src="detailData.cardBack[0].downloadUrl"
                  :preview-src-list="[
                    detailData.cardBack[0].downloadUrl
                  ]"
                />
                <div v-else>-</div>
              </div>
            </div>
          </div>
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-1 mt-6">审核操作</div>
          <a-form-model
            :model="detailData"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 22 }"
            labelAlign="left"
          >
            <a-form-model-item prop="name" label="审核结果">
              <a-radio-group v-model="detailData.status" size="large">
                <a-radio v-for="item in options['statusOpt']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-radio>
              </a-radio-group>
              <div v-if="detailData.status === '3'" class="pt-2">
                <a-textarea
                  v-model="detailData.remark"
                  :rows="5"
                  placeholder="请输入不通过原因"
                />
              </div>
            </a-form-model-item>
          </a-form-model>
          <div class="pt-4 flex justify-center">
            <a-button
              class="rounded-md"
              type="primary"
              size="large"
              @click="handleAdminAuditTeacher"
            >
              提交
            </a-button>
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
        show: false
      },
      options: {
        statusOpt: [
          {
            key: '2',
            value: '审核通过'
          },
          {
            key: '3',
            value: '审核不通过'
          }
        ]
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
        this.handleDetailIdChange(this.detailId)
      },
      immediate: true
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: this.$route.name })
    },
    async handleDetailIdChange(detailId) {
      if (detailId) {
        this.detailDataLoading = true
        this.detailData = null
        try {
          const res = await lingkeApi.teacherGetOne({
            userId: parseInt(detailId)
          })
          if (res && res.code === 200) {
            const detailData = res.data
            this.detailData = {
              ...detailData,
              want: (detailData.want || '').split(','),
              sample: this.parseFileNamesToObjs(detailData.sampleList || []),
              cv: this.parseFileNamesToObjs(detailData.cvList || []),
              diploma: this.parseFileNamesToObjs(detailData.diplomaList || []),
              transcript: this.parseFileNamesToObjs(detailData.transcriptList || []),
              cardFront: detailData.cardFront ? this.parseFileNamesToObjs([detailData.cardFront]) : [],
              cardBack: detailData.cardBack ? this.parseFileNamesToObjs([detailData.cardBack]) : []
            }
          } else {
            throw new Error(res.message || '加载失败')
          }
        } catch (error) {
          this.$message.error(error.message)
          console.log(error)
        }
        this.detailDataLoading = false
      }
    },
    parseFileNamesToObjs(names) {
      return names.map(name => {
        const [, , fileName, , fileExtension] = name.match(/(.*?\[.*?\])?(.*)(-.*?)(\..*)$/) || []
        return {
          uid: name,
          name: (fileName + fileExtension) || name,
          status: 'done',
          downloadUrl: name
        }
      })
    },
    handleFileDownload(file) {
      downloadFile(file.downloadUrl, file.name, true)
    },
    handlePdfProgress({ loaded, total }) {
      this.pdfBoxParams.loading = loaded !== total
    },
    handleShowAdminAuditTeacherModal(item) {
      this.handleDetailIdChange(item.userId)
      this.adminAuditTeacherModalParams.show = true
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
              status: this.detailData.status,
              remark: this.detailData.status === '3' ? this.detailData.remark : ''
            })
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('提交成功')
              this.handleReload()
            } else {
              throw new Error(res.message || '失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    handleReload() {
      if (this.detailId) this.handleDetailIdChange(this.detailId)
      if (this.adminAuditTeacherModalParams.show) {
        this.adminAuditTeacherModalParams.show = false
      }
      this.$emit('reload')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
