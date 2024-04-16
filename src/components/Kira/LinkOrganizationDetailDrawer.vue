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
        <div class="text-xl font-bold text-slate-900">企业详情</div>
        <div class="text-sm text-slate-400">Organization details</div>
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
              <div class="text-gray-400 w-20">企业ID</div>
              <div class="text-gray-950">{{ detailData.userId }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">简称</div>
              <div class="text-gray-950">{{ detailData.nickName }}</div>
            </div>
          </div>
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3 mt-6">企业认证</div>
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
              <div class="text-gray-400 w-20">企业全称</div>
              <div class="text-gray-950">{{ detailData.name }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">法人姓名</div>
              <div class="text-gray-950">{{ detailData.legalPerson }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-24">法人手机号码</div>
              <div class="text-gray-950">{{ detailData.legalPhoneNumber }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">法人身份证号码</div>
              <div class="text-gray-950">{{ detailData.idNo }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">法人身份证正面</div>
              <div>
                <LinkFormItemImg
                  :fileList.sync="detailData.cardFront"
                  :disabled="true"
                />
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">法人身份证反面</div>
              <div>
                <LinkFormItemImg
                  :fileList.sync="detailData.cardBack"
                  :disabled="true"
                />
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">营业执照</div>
              <div>
                <LinkFormItemImg
                  :fileList.sync="detailData.businessLicense"
                  :disabled="true"
                />
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
              <div class="text-gray-400 w-20">手机号码</div>
              <div class="text-gray-950">{{ detailData.legalPhoneNumber }}</div>
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
        </div>
      </div>
    </a-drawer>
    <a-modal
      v-if="adminAuditOrganizationModalParams.show"
      :title="'企业认证审核'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1000px'"
      @cancel="adminAuditOrganizationModalParams.show = false"
    >
      <div class="" v-loading="detailDataLoading">
        <div v-if="!detailData" class="pb-4">
          <a-skeleton avatar active :paragraph="{ rows: 4 }" />
        </div>
        <div v-else class="link-style-form link-style-form-sm">
          <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3">认证信息</div>
          <div class="flex flex-wrap gap-y-2">
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">企业全称</div>
              <div class="text-gray-950">{{ detailData.name }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">法人姓名</div>
              <div class="text-gray-950">{{ detailData.legalPerson }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-24">法人手机号码</div>
              <div class="text-gray-950">{{ detailData.legalPhoneNumber }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">法人身份证号码</div>
              <div class="text-gray-950">{{ detailData.idNo }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">法人身份证正面</div>
              <div>
                <LinkFormItemImg
                  :fileList.sync="detailData.cardFront"
                  :disabled="true"
                />
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-28">法人身份证反面</div>
              <div>
                <LinkFormItemImg
                  :fileList.sync="detailData.cardBack"
                  :disabled="true"
                />
              </div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">营业执照</div>
              <div>
                <LinkFormItemImg
                  :fileList.sync="detailData.businessLicense"
                  :disabled="true"
                />
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
              @click="handleAdminAuditOrganization"
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
import LinkFormItemImg from '@/components/Kira/LinkFormItemImg'

export default {
  name: 'LinkOrganizationDetailDrawer',
  components: {
    LinkFormItemImg
  },
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
      'userInfo'
    ]),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
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
          const res = await lingkeApi.organizationGetOne({
            userId: parseInt(detailId)
          })
          if (res && res.code === 200) {
            const detailData = res.data
            this.detailData = {
              ...detailData,
              cardFront: detailData.cardFront ? this.$parseFileNamesToObjs([detailData.cardFront]) : [],
              cardBack: detailData.cardBack ? this.$parseFileNamesToObjs([detailData.cardBack]) : [],
              businessLicense: this.$parseFileNamesToObjs(detailData.businessLicenseList || [])
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
    async handleShowAdminAuditOrganizationModal(item) {
      this.handleDetailIdChange(item.userId)
      this.adminAuditOrganizationModalParams.show = true
    },
    handleReload() {
      if (this.detailId) this.handleDetailIdChange(this.detailId)
      if (this.adminAuditOrganizationModalParams.show) {
        this.adminAuditOrganizationModalParams.show = false
      }
      this.$emit('reload')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
