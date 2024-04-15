<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-modal
      v-if="!!detailId"
      :title="modalTitle"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1200px'"
      @cancel="handleBack"
    >
      <div>
        <div v-if="!detailData">
          <a-skeleton avatar active :paragraph="{ rows: 4 }" />
        </div>
        <div
          v-else
          v-loading="detailDataLoading"

        >
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-gray-950 text-lg pb-1">{{ detailData.task }}</div>
            <div class="flex flex-row gap-5">
              <div class="text-gray-400 text-sm">{{ detailData.createTime }}</div>
              <div class="text-blue-400 text-sm">#{{ detailData.typeName }}</div>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-y-2">
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">委托 ID</div>
              <div class="text-gray-950">{{ detailData.id }}</div>
              <div class="ml-2"><a-icon type="copy" class="cursor-pointer text-blue-400" @click="handleCopy(detailData.id + '')"/></div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">状态</div>
              <div class="text-blue-400">{{ detailData.statusName }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">价格</div>
              <div class="text-[#FDA643]">￥{{ `${detailData.unitPrice * detailData.lessonNum}` }}</div>
            </div>
            <div class="w-full flex text-sm">
              <div class="text-gray-400 w-20">相关资料</div>
              <div class="flex-auto">
                <a-upload
                  v-if="detailData.fileList && detailData.fileList.length"
                  :fileList="detailData.fileList"
                  disabled
                  class="-mt-2 block"
                  @preview="handleFileDownload"
                >
                </a-upload>
                <div v-else>-</div>
              </div>
            </div>
            <div class="w-full flex text-sm">
              <div class="text-gray-400 w-20">委托明细</div>
              <div class="text-gray-950 w-0 flex-auto">{{ detailData.detail }}</div>
            </div>
          </div>
          <div class="mt-4">
            <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-2">课程信息</div>
            <div class="flex flex-wrap gap-y-2">
              <div class="w-full sm:w-1/3 flex text-sm">
                <div class="text-gray-400 w-20">模式</div>
                <div class="text-gray-950">{{ codeDict.order?.lessonType?.[detailData.lessonType] }}</div>
              </div>
              <div class="w-full sm:w-2/3 flex text-sm">
                <div class="text-gray-400 w-20">时长</div>
                <div class="text-gray-950">{{ `${detailData.unitDuration}小时 ${ detailData.lessonType === '2' ? `* ${ detailData.lessonNum }节课` : '' }` }}</div>
              </div>
              <div v-if="detailData.status !== '1'" class="w-full sm:w-1/3 flex text-sm">
                <div class="text-gray-400 w-20">老师</div>
                <div v-if="detailData.teacherId" class="text-blue-400 cursor-pointer" @click="$refs.LinkTeacherModal.handleOpenLinkTeacherModal(detailData.userId)">{{ detailData.teacherName }}</div>
                <div v-else class="text-gray-600">-</div>
              </div>
              <div v-if="detailData.status !== '1' && detailData.status !== '2' && detailData.status !== '6'" class="w-full sm:w-2/3 flex text-sm">
                <div class="text-gray-400 w-20">交付进度</div>
                <div class="text-blue-400 min-w-[200px]">
                  <a-progress :percent="detailData.lessonProgress / detailData.lessonNum * 100" :format="() => `${ detailData.lessonProgress }/${ detailData.lessonNum }`" size="small" status="active" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="detailData.status !== '1' && detailData.status !== '2' && detailData.status !== '6'" class="mt-4">
            <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3">交付记录</div>
            <a-table
              :pagination="false"
              :columns="deliverColumns"
              :data-source="detailData.deliverList"
              size="small"
            >
              <template slot="operator" slot-scope="text, record">
                <div>{{ record.status === '1' ? detailData.teacherName : detailData.organizationName }}</div>
              </template>
              <template slot="remark" slot-scope="text, record">
                <div>{{ record.status === '1' ? '发起交付' : record.status === '2' ? `第${record.lessonNo}节课已交付` : (text || '-') }}</div>
              </template>
            </a-table>
          </div>
          <div class="mt-4 flex justify-end gap-4 items-center">
            <div class="cursor-pointer text-blue-400 leading-none">
              <a-icon type="message" class="text-2xl" />
            </div>
            <a-button
              v-if="detailData.status === '1' && userInfo.roleId === 1"
              class="rounded-md"
              type="primary"
              v-link-click:teacher1="() => handleCatchTask(detailData)"
            >
              接受委托
            </a-button>
            <div
              v-if="detailData.status === '1' && userInfo.roleId === 1 && detailData.teacherId === userInfo.userId"
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-[#EF6D21] text-white hover:opacity-80"
              v-link-click:teacher1="() => handleRefuseTask(detailData)"
            >
              拒绝委托
            </div>
            <a-button
              v-if="detailData.status === '2' && userInfo.roleId === 2"
              class="success-btn rounded-md"
              type="primary"
              @click="() => handlePayTask(detailData)"
            >
              付 款
            </a-button>
            <a-button
              v-if="(detailData.status === '1' || detailData.status === '2') && userInfo.roleId === 2"
              class="rounded-md"
              type="danger"
              @click="() => handleCancelTask(detailData)"
            >
              取消委托
            </a-button>
            <a-button
              v-if="detailData.status === '3' && userInfo.roleId === 1"
              class="success-btn rounded-md"
              type="primary"
              @click="() => handleFinishTask(detailData)"
            >
              发起交付
            </a-button>
            <a-button
              v-if="detailData.status === '4' && userInfo.roleId === 2"
              class="rounded-md"
              type="primary"
              @click="() => handleShowAuditDeliverModal()"
            >
              审核交付
            </a-button>
          </div>
        </div>
        <!-- <div
          v-else
          class="flex flex-col gap-5 sm:flex-row"
          v-loading="detailDataLoading"
        >
          <div class="flex items-center justify-center sm:items-start">
            <div class="w-full sm:w-36 h-36 rounded-lg overflow-hidden bg-blue-50">
              <el-image
                class="w-full h-full"
                :src="require('@/assets/link/task-type-1.png')"
              />
            </div>
          </div>
          <div class="link-style-form flex flex-col sm:flex-auto">
            <div class="flex gap-x-5">
              <div class="flex-auto text-lg text-slate-900 font-bold break-all ">{{ detailData.task }}</div>
              <div
                class="text-yellow-500 text-xl whitespace-nowrap"
              >{{ detailData.statusName }}</div>
            </div>
            <div class="flex flex-wrap pt-2">
              <div
                class="text-sm text-blue-600 pr-2 cursor-pointer"
              >#{{ detailData.typeName }}</div>
              <div class="text-sm text-slate-400 sm:pl-2">{{ detailData.updateTime }}</div>
            </div>
            <div class="pt-2 pb-4 flex">
              <div
                class="cursor-pointer flex items-center justify-center px-3 h-7 rounded-md text-sm bg-rose-500 text-white"
              >价格：￥{{ `${detailData.unitPrice}/h x ${detailData.duration}h` }}</div>
            </div>
            <div class="text-base text-slate-800 break-all ">
              {{ detailData.detail }}
            </div>
            <div v-if="detailData.fileList && detailData.fileList.length" class="pt-8">
              <div class="text-gray-400">相关文件：</div>
              <a-upload-dragger
                class="dragUploader"
                :fileList="detailData.fileList"
                disabled
                @preview="handleFileDownload"
              >
              </a-upload-dragger>
            </div>
            <div class="flex gap-x-6 gap-y-3 pt-8 flex-wrap whitespace-nowrap">
              <a-button
                class="h-10 rounded-md"
                type="primary"
                @click="handleCatchTask(detailData)"
              >
                接受委托
              </a-button>
              <a-button
                class="h-10 rounded-md"
                type="danger"
                @click="handleRefuseTask(detailData)"
              >
                拒绝委托
              </a-button>
              <a-button
                class="success-btn h-10 rounded-md"
                type="primary"
                @click="handlePayTask(detailData)"
              >
                支付
              </a-button>
              <a-button
                class="success-btn h-10 rounded-md"
                type="primary"
                @click="handleFinishTask(detailData)"
              >
                交付确认
              </a-button>
              <a-button
                class="h-10 rounded-md"
                type="primary"
              >
                联系委托方
              </a-button>
              <a-button
                class="h-10 rounded-md"
                type="danger"
                @click="handleCancelTask(detailData)"
              >
                撤销委托
              </a-button>
            </div>
          </div>
        </div> -->
      </div>
    </a-modal>
    <LinkTeacherModal
      ref="LinkTeacherModal"
    />
    <a-modal
      v-if="auditDeliverModalParams.show"
      :title="'审核交付'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '600px'"
      @cancel="auditDeliverModalParams.show = false"
    >
      <div class="">
        <div class="link-style-form link-style-form-sm">
          <a-form-model
            ref="auditDeliverModalForm"
            :model="auditDeliverModalParams.formData"
            :rules="auditDeliverModalParams.formRules"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
            labelAlign="left"
          >
            <a-form-model-item prop="status" label="结果">
              <a-radio-group v-model="auditDeliverModalParams.formData['status']" size="large">
                <a-radio v-for="item in auditDeliverModalParams.formOptions['status']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item v-if="auditDeliverModalParams.formData['status'] === '3'" prop="remark" label="原因">
              <a-textarea
                v-model="auditDeliverModalParams.formData.remark"
                :rows="5"
                placeholder="请说明拒绝交付原因"
              />
            </a-form-model-item>
          </a-form-model>
          <div class="pt-1 flex justify-center">
            <a-button
              class="rounded-md"
              type="primary"
              size="large"
              @click="handleAuditDeliver"
            >
              确定
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
import LinkTeacherModal from '@/components/Kira/LinkTeacherModal'

export default {
  name: 'LinkOrderDetailDrawer',
  components: {
    LinkTeacherModal
  },
  mixins: [baseMixin],
  props: {
  },
  data () {
    return {
      lingkeApi,
      detailData: null,
      detailDataLoading: false,
      deliverColumns: [
        {
          title: '操作方',
          dataIndex: 'operator'
        },
        {
          title: '交付课程',
          dataIndex: 'lessonNo'
        },
        {
          title: '时间',
          dataIndex: 'createTime'
        },
        {
          title: '交付状态',
          dataIndex: 'statusName'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        }
      ],
      auditDeliverModalParams: {
        show: false,
        formData: {
          status: undefined,
          remark: ''
        },
        formRules: {
          status: [
            { required: true, message: '请选择结果' }
          ],
          remark: [
            { required: true, message: '请说明拒绝交付原因' }
          ]
        },
        formOptions: {
          status: [
            { value: '交付内容无误，确认交付', key: '2' },
            { value: '交付内容有误，拒绝交付', key: '3' }
          ]
        }
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
      return this.$route.query.orderId
    },
    modalTitle() {
      return this.detailData ? `${ this.detailData.organizationName }的委托` : '-'
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
          const res = await lingkeApi.orderGetOne({
            id: parseInt(this.detailId)
          })
          if (res && res.code === 200) {
            const detailData = res.data
            detailData.fileList = detailData.files ? this.parseFileNamesToObjs(detailData.files.split(',')) : []
            this.detailData = detailData
          } else {
            throw new Error(res.message || '加载失败')
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
    handleCatchTask(item) {
      this.$confirm({
        title: '接受委托',
        icon: () => null,
        content: `确认接受委托吗`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderTeacherUpdate({
              id: item.id,
              status: '2'
            })
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('已抢委托，等待委托方确认')
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
    handleRefuseTask(item) {
      this.$confirm({
        title: '拒绝委托',
        icon: () => null,
        content: `确认拒绝委托吗`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderTeacherUpdate({
              id: item.id,
              status: '6'
            })
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('拒绝成功')
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
    handleCancelTask(item) {
      this.$confirm({
        title: '取消委托',
        icon: () => null,
        content: `取消后将不可恢复，确定取消吗`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderDelete({
              id: item.id
            })
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('取消成功')
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
    handlePayTask(item) {
      this.$confirm({
        title: '付款',
        icon: () => null,
        content: `确认付款吗`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderOrganizationUpdate({
              id: item.id,
              status: '3'
            })
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('付款成功')
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
    handleFinishTask(item) {
      this.$confirm({
        title: '发起交付',
        icon: () => null,
        content: `发起交付后委托方将审核你的交付`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderDeliver({
              id: item.id
            })
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('已发起交付，等待委托方审核')
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
    handleShowAuditDeliverModal() {
      this.auditDeliverModalParams = {
        ...this.auditDeliverModalParams,
        show: true,
        formData: {
          status: undefined,
          remark: ''
        }
      }
    },
    async handleAuditDeliver() {
      console.log(this.$refs)
      try {
        await this.$refs.auditDeliverModalForm.validate()
      } catch {
        this.$message.error('提交信息不符合要求，请检查')
        return
      }
      this.$confirm({
        title: '审核交付',
        icon: () => null,
        content: `${ this.detailData.lessonProgress === (this.detailData.lessonNum - 1) ? '确认交付后订单金额将结算到对方账户' : '确认交付后将开始下一课时' }`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderAuditDeliver({
              id: this.detailData.id,
              status: this.auditDeliverModalParams.formData.status,
              remark: this.auditDeliverModalParams.formData.remark || undefined
            })
            if (res && res.code === 200 && res.data === 1) {
              if (this.auditDeliverModalParams.formData.status === '3') {
                this.$message.info('你已拒绝交付')
              } else if (this.detailData.lessonProgress === (this.detailData.lessonNum - 1)) {
                this.$message.success('确认交付，订单已完成')
              } else {
                this.$message.success('确认交付，将开始下一课时')
              }
              this.auditDeliverModalParams.show = false
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
      if (this.detailId) this.handleDetailIdChange()
      this.$emit('reload')
    },
    handleCopy(text) {
      this.$copyText(text).then(() => {
        this.$message.success('复制成功')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
