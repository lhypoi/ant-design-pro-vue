<template>
  <div class="flex flex-col">
    <div
      class="flex-auto h-0"
      v-loading="localLoading"
    >
      <div class="h-full pb-4 pr-2 -mr-2 overflow-auto">
        <div class="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 justify-between gap-5">
          <div
            v-for="workOrder in rows"
            :key="workOrder.workOrderNo"
            class="flex flex-col px-3 pt-3 pb-2 border border-solid border-gray-400 rounded-md hover:border-blue-400 hover:shadow-lg"
          >
            <div v-if="!updatingMode" class="relative pr-[100%] pb-[66%] cursor-pointer" @click="() => $emit('clickRoomImg', workOrder)">
              <el-image
                class="absolute w-full h-full"
                :src="workOrder.roomImg"
              />
            </div>
            <div class="flex flex-row items-center pt-3 pb-2">
              <div class="flex-auto font-bold">
                {{ workOrder.title || '无标题' }}
              </div>
            </div>
            <div>
              {{ `机房名：${workOrder.roomName || '-'}` }}
            </div>
            <div>
              {{ `工单号：${workOrder.workOrderNo || '-'}` }}
            </div>
            <div>
              {{ `创建人：${workOrder.creatorName || '-'}` }}
            </div>
            <div class="flex flex-row">
              <div>核查员：</div>
              <template v-if="workOrder['chkUserList'] && workOrder['chkUserList'].length">
                <a-popover
                  v-for="(chkUser, index) in workOrder['chkUserList']"
                  :key="chkUser.userId + index"
                  title="手机号码"
                  trigger="click"
                  :overlayClassName="!updatingMode ? 'hidden' : ''"
                >
                  <template slot="content">
                    <p>{{ chkUser.phoneNumber }}</p>
                  </template>
                  <span :class="updatingMode ? 'text-blue-400 cursor-pointer' : ''">{{ chkUser.userName }}</span>
                  <span v-if="index !== workOrder['chkUserList'].length - 1">、</span>
                </a-popover>
              </template>
              <div v-else>-</div>
            </div>
            <div class="flex flex-row">
              <div>审核员：</div>
              <a-popover
                v-if="workOrder.auditorName"
                title="手机号码"
                trigger="click"
                :overlayClassName="!updatingMode ? 'hidden' : ''"
              >
                <template slot="content">
                  <p>{{ workOrder.auditPhoneNumber }}</p>
                </template>
                <div :class="updatingMode ? 'text-blue-400 cursor-pointer' : ''">{{ workOrder.auditorName }}</div>
              </a-popover>
              <div v-else>-</div>
            </div>
            <div class="flex flex-row">
              <div>复核员：</div>
              <a-popover
                v-if="workOrder.reauditorName"
                title="手机号码"
                trigger="click"
                :overlayClassName="!updatingMode ? 'hidden' : ''"
              >
                <template slot="content">
                  <p>{{ workOrder.reauditPhoneNumber }}</p>
                </template>
                <div :class="updatingMode ? 'text-blue-400 cursor-pointer' : ''">{{ workOrder.reauditorName }}</div>
              </a-popover>
              <div v-else>-</div>
            </div>
            <div v-if="updatingMode">
              {{ `工单状态：${workOrder.orderStatusName || '-'}` }}
            </div>
            <div v-if="updatingMode">
              {{ `核查轮次：${workOrder.round || '-'}` }}
            </div>
            <div>
              {{ `工单创建时间：${workOrder.createTime || '-'}` }}
            </div>
            <div v-if="updatingMode">
              {{ `数据更新时间：${workOrder.updateTime || '-'}` }}
            </div>
            <div v-if="updatingMode">
              {{ `备注：${workOrder.remark || '-'}` }}
            </div>
            <div v-if="!updatingMode">
              {{ `审批完成时间：${workOrder.finishTime || '-'}` }}
            </div>
            <div v-if="updatingMode" class="flex flex-row justify-end pt-1 pb-1">
              <!-- 认领工单核查直至核查提交，请确认。 -->
              <a-button
                class="h-8 rounded-md"
                type="primary"
                @click="handleOpenWorkOrderDetailModal(workOrder)"
              >
                {{ (workOrder.canAudit === 1 || workOrder.canReaudit === 1) ? '去审核' : workOrder.canCheck === 1 ? '去核查' : '查看' }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-end pt-3">
      <el-pagination
        :disabled="localLoading || sizeChangeFlag"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
        :layout="isMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next'"
        :page-sizes="pageSizes"
        :total="total"
        :pager-count="5"
        background
        :small="isMobile"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <a-modal
      v-if="workOrderDetailModalParams.show"
      :title="workOrderDetailModalParams.title"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '400px'"
      @cancel="workOrderDetailModalParams.show = false"
    >
      <div v-loading="workOrderDetailModalParams.loading">
        <div v-if="workOrderDetailModalParams.sourceCard.canCheck === 1" class="text-red-400 pb-2 text-base">
          认领工单核查直至核查提交，请确认。
        </div>
        <div class="pt-4 flex flex-row gap-20">
          <a-button
            v-if="workOrderDetailModalParams.sourceCard.canCheck === 1"
            class="h-9 w-24 rounded-md text-base"
            type="primary"
            size="large"
            @click="handleOpenFullDetailModal('3d')"
          >
            三维核查
          </a-button>
          <a-button
            v-else
            class="h-9 w-24 rounded-md text-base"
            type="primary"
            size="large"
            @click="handleOpenFullDetailModal('3d')"
          >
            三维查看
          </a-button>
          <a-button
            v-if="workOrderDetailModalParams.sourceCard.canCheck === 1"
            class="h-9 w-24 rounded-md text-base"
            type="primary"
            size="large"
            @click="handleOpenFullDetailModal('form')"
          >
            表单核查
          </a-button>
          <a-button
            v-else-if="workOrderDetailModalParams.sourceCard.canAudit === 1 || workOrderDetailModalParams.sourceCard.canReaudit === 1"
            class="h-9 w-24 rounded-md text-base"
            type="primary"
            size="large"
            @click="handleOpenFullDetailModal('form')"
          >
            表单审批
          </a-button>
          <a-button
            v-else
            class="h-9 w-24 rounded-md text-base"
            type="primary"
            size="large"
            @click="handleOpenFullDetailModal('form')"
          >
            表单查看
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import nuclearLabApi from '@/api/nuclearLab'

export default {
  name: 'WorkOrderCards',
  mixins: [baseMixin],
  props: {
    data: {
      type: Function,
      required: true
    },
    updatingMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localLoading: false,
      pageNum: 1,
      pageSize: 50,
      pageSizes: [50, 100, 200, 500],
      total: 0,
      sizeChangeFlag: false,
      rows: [],
      workOrderDetailModalParams: {
        show: false,
        loading: false,
        title: '',
        sourceCard: null
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async handleSizeChange() {
      this.sizeChangeFlag = true
      this.pageNum = 1
      await this.loadData()
      this.sizeChangeFlag = false
    },
    async handleCurrentChange() {
      if (this.sizeChangeFlag) return
      await this.loadData()
    },
    async loadData() {
      this.localLoading = true
      try {
        const res = await this.data({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        this.rows = res.rows
        this.total = res.total
      } catch (error) {
        console.log(error)
      }
      this.localLoading = false
    },
    async refresh () {
      this.sizeChangeFlag = true
      this.pageNum = 1
      await this.loadData()
      this.sizeChangeFlag = false
    },
    handleOpenWorkOrderDetailModal(sourceCard) {
      this.workOrderDetailModalParams = {
        ...this.workOrderDetailModalParams,
        show: true,
        loading: false,
        title: '选择方式',
        sourceCard: sourceCard
      }
    },
    async handleOpenFullDetailModal(showType) {
      this.workOrderDetailModalParams.loading = true
      if (this.workOrderDetailModalParams.sourceCard.canCheck === 1) {
        await nuclearLabApi.workOrderUpdateStartCheckById(this.workOrderDetailModalParams.sourceCard.workOrderNo)
      } else if (this.workOrderDetailModalParams.sourceCard.canAudit === 1) {
        await nuclearLabApi.workOrderUpdateStartAuditById(this.workOrderDetailModalParams.sourceCard.workOrderNo)
      } else if (this.workOrderDetailModalParams.sourceCard.canReaudit === 1) {
        await nuclearLabApi.workOrderUpdateStartReAuditById(this.workOrderDetailModalParams.sourceCard.workOrderNo)
      }
      let accessLogDetail = ''
      if (showType === 'form') {
        if (this.workOrderDetailModalParams.sourceCard.canCheck === 1) {
          accessLogDetail = `去核查-${ '表单核查' }`
        } else if (this.workOrderDetailModalParams.sourceCard.canAudit === 1) {
          accessLogDetail = `去审核-${ '表单审批' }`
        } else if (this.workOrderDetailModalParams.sourceCard.canReaudit === 1) {
          accessLogDetail = `去复核-${ '表单审批' }`
        } else {
          accessLogDetail = `查看-${ '表单审批' }`
        }
      }
      if (accessLogDetail) {
        await nuclearLabApi.accessLogCreate({
          action: this.workOrderDetailModalParams.sourceCard.workOrderNo,
          detail: accessLogDetail,
          page: this.$route.meta.title,
          remark: ''
        })
      }
      this.workOrderDetailModalParams.loading = false
      if (showType === '3d') {
        this.$emit('clickRoomImg', this.workOrderDetailModalParams.sourceCard)
      } else if (showType === 'form') {
        this.$emit('openOrderDetailForm', this.workOrderDetailModalParams.sourceCard)
      }
      this.workOrderDetailModalParams.show = false
      this.$emit('reloadWorkOrderList')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
