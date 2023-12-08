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
        <div class="text-2xl font-bold text-slate-900">机构详情</div>
        <div class="text-sm text-slate-400">Organization details</div>
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
              <a-form-model-item prop="type" label="机构类型">
                <a-select
                  allowClear
                  showArrow
                  size="large"
                  placeholder="请选择机构类型"
                  v-model="detailData.type"
                  :disabled="true"
                >
                  <a-select-option v-for="(label, key) in organizationTypeDict" :key="key" :value="key" class="pl-5">
                    {{ label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item prop="name" label="机构名称">
                <a-input
                  v-model="detailData.name"
                  placeholder="请输入机构名称"
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item prop="legalPerson" label="法人">
                <a-input
                  v-model="detailData.legalPerson"
                  placeholder="请输入法人"
                  :disabled="true"
                />
              </a-form-model-item>
              <a-form-model-item prop="idCard" label="法人身份证">
                <div class="h-0 overflow-hidden">
                  <a-upload-dragger
                    class="dragUploader"
                    :multiple="true"
                    name="fileList"
                    :action="lingkeApi.uploadUrl"
                    :fileList="detailData.idCard"
                    @preview="handleFileDownload"
                  >
                    <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                    </div>
                  </a-upload-dragger>
                </div>
                <div class="flex flex-row items-start gap-8">
                  <div
                    v-if="detailData.idCard[0]"
                    class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
                  >
                    <el-image
                      v-if="detailData.idCard[0].downloadUrl"
                      class="w-28 h-auto"
                      :src="detailData.idCard[0].downloadUrl"
                      :preview-src-list="[
                        detailData.idCard[0].downloadUrl
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
                </div>
              </a-form-model-item>
              <a-form-model-item prop="businessLicense" label="营业执照">
                <div class="h-0 overflow-hidden">
                  <a-upload-dragger
                    class="dragUploader"
                    :multiple="true"
                    name="fileList"
                    :action="lingkeApi.uploadUrl"
                    :fileList="detailData.businessLicense"
                    @preview="handleFileDownload"
                  >
                    <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                    </div>
                  </a-upload-dragger>
                </div>
                <div class="flex flex-row items-start gap-8">
                  <div
                    v-if="detailData.businessLicense[0]"
                    class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
                  >
                    <el-image
                      v-if="detailData.businessLicense[0].downloadUrl"
                      class="w-28 h-auto"
                      :src="detailData.businessLicense[0].downloadUrl"
                      :preview-src-list="[
                        detailData.businessLicense[0].downloadUrl
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
                </div>
              </a-form-model-item>
              <a-form-model-item prop="name" label="审核状态">
                <a-select
                  allowClear
                  showArrow
                  size="large"
                  placeholder="请选择审核状态"
                  v-model="detailData.status"
                >
                  <a-select-option v-for="(label, key) in organizationStatusDict" :key="key" :value="key" class="pl-5">
                    {{ label }}
                  </a-select-option>
                </a-select>
                <div v-if="detailData.status === '3'" class="pt-2">
                  <a-textarea
                    v-model="detailData.remark"
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
                    @click="handleAdminAuditOrganization"
                  >
                    提交
                  </a-button>
                </div>
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
      </div>
    </a-drawer>
    <a-modal
      v-if="adminAuditOrganizationModalParams.show"
      :title="'机构认证审核'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '640px'"
      @cancel="adminAuditOrganizationModalParams.show = false"
    >
      <div class="" v-loading="detailDataLoading">
        <div v-if="!detailData" class="pb-4">
          <a-skeleton avatar active :paragraph="{ rows: 4 }" />
        </div>
        <div v-else class="link-style-form">
          <a-form-model
            :model="detailData"
            :label-col="{ span: 5 }"
            :wrapper-col="{ offset: isMobile ? 0 : 1, span: 16 }"
          >
            <a-form-model-item prop="name" label="审核状态">
              <a-select
                allowClear
                showArrow
                size="large"
                placeholder="请选择审核状态"
                v-model="detailData.status"
              >
                <a-select-option v-for="(label, key) in organizationStatusDict" :key="key" :value="key" class="pl-5">
                  {{ label }}
                </a-select-option>
              </a-select>
              <div v-if="detailData.status === '3'" class="pt-2">
                <a-textarea
                  v-model="detailData.remark"
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
                  @click="handleAdminAuditOrganization"
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

export default {
  name: 'LinkOrganizationDetailDrawer',
  mixins: [baseMixin],
  props: {
  },
  data () {
    return {
      lingkeApi,
      detailData: null,
      detailDataLoading: false,
      adminAuditOrganizationModalParams: {
        show: false
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
    organizationTypeDict() {
      return this.codeDict.organization && this.codeDict.organization.type || {}
    },
    organizationStatusDict() {
      return this.codeDict.organization && this.codeDict.organization.status || {}
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
          const res = await lingkeApi.organizationGetOne({
            userId: parseInt(this.detailId)
          })
          if (res && res.code === 1000) {
            const detailData = res.data
            this.detailData = {
              userId: parseInt(this.detailId),
              type: detailData.type,
              name: detailData.name,
              legalPerson: detailData.legalPerson,
              idCard: this.parseFileNamesToObjs(detailData.idCardList || []),
              businessLicense: this.parseFileNamesToObjs(detailData.businessLicenseList || []),
              status: detailData.status,
              remark: detailData.remark
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
    handleAdminAuditOrganization() {
      this.$confirm({
        title: '提示',
        content: `确定提交？`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.adminAuditOrganization({
              userId: this.detailData.userId,
              status: this.detailData.status,
              remark: this.detailData.status === '3' ? this.detailData.remark : ''
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
    async handleShowAdminAuditOrganizationModal(item) {
      if (item.userId) {
        this.detailData = null
        this.detailDataLoading = true
        this.adminAuditOrganizationModalParams.show = true
        try {
          const res = await lingkeApi.organizationGetOne({
            userId: item.userId
          })
          if (res && res.code === 1000) {
            const detailData = res.data
            this.detailData = {
              userId: item.userId,
              type: detailData.type,
              name: detailData.name,
              legalPerson: detailData.legalPerson,
              idCard: this.parseFileNamesToObjs(detailData.idCardList || []),
              businessLicense: this.parseFileNamesToObjs(detailData.businessLicenseList || []),
              status: detailData.status,
              remark: detailData.remark
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
    handleReload() {
      if (this.detailId) this.handleDetailIdChange()
      if (this.adminAuditOrganizationModalParams.show) {
        this.adminAuditOrganizationModalParams.show = false
        this.detailData = null
      }
      this.$emit('reload')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
