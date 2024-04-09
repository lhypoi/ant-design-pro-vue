<template>
  <div class="w-full mx-auto max-w-[1200px] relative flex-auto flex flex-col rounded-3x px-3 py-6">
    <div class="flex flex-row flex-wrap gap-y-4 gap-x-5 px-4 py-6 bg-white rounded-lg shadow-sm" v-loading="teacherAccountParams.loading">
      <div class="flex gap-2 sm:flex-col items-center">
        <div class="w-20 h-20 rounded bg-blue-400 text-white flex justify-center items-center text-3xl leading-none">
          {{ userInfo.avatarFirstLetter }}
        </div>
        <a-popover title="说明" trigger="click">
          <template slot="content">
            <p>累计金额：历史所有累计已经完成订单的金额总和，订单需要是已完成的才会纳入统计。</p>
            <p>可提现金额：累计金额 - 已提现金额</p>
          </template>
          <div class="text-blue-400 underline underline-offset-4 cursor-pointer">接单规则及提现说明</div>
        </a-popover>
      </div>
      <div class="flex-auto flex justify-around bg-[#F9FBFE] rounded-lg py-2">
        <div class="flex flex-col gap-1 items-center justify-center">
          <div class="text-sm text-[#6D6D6D]">累计订单金额</div>
          <div class="text-2xl text-[#FDA643]">￥{{ teacherAccountParams.accountInfo.totalAmount || 0 }}</div>
        </div>
        <div class="flex flex-col gap-1 items-center justify-center">
          <div class="text-sm text-[#6D6D6D]">可提现金额</div>
          <div class="text-2xl text-[#FDA643]">￥{{ teacherAccountParams.accountInfo.balance || 0 }}</div>
        </div>
        <div class="flex flex-col gap-1 items-center justify-center">
          <div class="text-sm text-[#6D6D6D]">已提现金额</div>
          <div class="text-2xl text-[#FDA643]">￥{{ teacherAccountParams.accountInfo.withdrawalAmount || 0 }}</div>
        </div>
      </div>
      <div class="flex sm:flex-col gap-3">
        <a-button
          type="primary"
          class="rounded-md"
          @click="handleOpenCanWithdrawModal"
        >
          提现
        </a-button>
        <div class="bg-[#ecf5ff] rounded-md">
          <a-button
            type="primary"
            ghost
            class="rounded-md"
            @click="handleOpenWithdrawalRecordModal"
          >
            提现记录
          </a-button>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap items-end gap-3 min-h-[60px] mt-6 px-4 py-3 bg-white rounded-lg shadow-sm" v-loading="tabParams.loading">
      <div
        v-for="tab in tabParams.tabList"
        :key="tab.key"
        class="flex whitespace-nowrap items-center justify-center text-sm rounded-lg px-4 py-2 cursor-pointer transition duration-300 ease-in-out"
        :class="[
          searchParams.status === tab.key ? 'bg-[#2192EF] text-white' : 'bg-[#cecece] hover:bg-blue-400 text-white'
        ]"
        @click="handleTabClick(tab)"
      >
        {{ `${ tab.value }（${ tab.num }）` }}</div>
    </div>
    <div
      class="mt-5 min-h-[90px]"
      v-loading="dataListLoading"
      element-loading-spinner="el-icon-loading mt-3"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="flex flex-col gap-y-3">
        <div
          v-for="item in dataList"
          :key="item.id"
          class="flex flex-col gap-1 sm:gap-3 sm:flex-row bg-white rounded-lg shadow-sm p-3 cursor-pointer hover:ring-2 min-h-[90px]"
          @click="() => handleToDetail(item)"
        >
          <div class="flex-auto flex items-center justify-center gap-3">
            <div class="w-12 h-12 rounded bg-blue-400 text-white flex justify-center items-center text-3xl leading-none">
              {{ item.organizationName?.[0].toUpperCase() }}
            </div>
            <div class="flex-auto w-0 flex flex-col sm:gap-1 justify-center">
              <div class="text-sm text-[#171515] font-bold break-all line-clamp-1">{{ item.task }}</div>
              <div class="text-sm text-[#6D6D6D] break-all line-clamp-1">
                {{ item.detail }}
              </div>
            </div>
          </div>
          <div class="flex sm:flex-col gap-1 sm:justify-center sm:w-24">
            <div class="text-sm text-[#2192EF]">#{{ item.typeName }}</div>
            <div class="text-sm text-[#FDA643]">{{ `￥${item.unitPrice}/${item.duration}h` }}</div>
          </div>
          <div class="flex sm:flex-col gap-1 sm:justify-center sm:w-48">
            <div class="text-sm text-[#6D6D6D]">发布时间</div>
            <div class="text-sm text-[#6D6D6D]">{{ item.createTime }}</div>
          </div>
          <div class="flex sm:flex-col gap-1 sm:justify-center sm:w-32">
            <div class="text-xl text-[#FDA643]">{{ `￥${item.unitPrice * item.duration}` }}</div>
          </div>
          <div class="flex flex-col sm:gap-1 items-center justify-center sm:w-44">
            <div class="text-sm text-[#6D6D6D] break-all line-clamp-1">{{ item.statusName }}</div>
            <div class="text-sm text-[#A29F9F] break-all line-clamp-1">
              请确认并付款
            </div>
          </div>
          <div
            class="flex justify-start items-center flex-wrap whitespace-nowrap sm:flex-col gap-y-2 sm:justify-center sm:items-center sm:w-28"
          >
            <div
              v-if="item.status === '1'"
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
              @click.stop="() => $refs.LinkOrderDetailDrawer.handleCatchTask(item)"
            >接受委托</div>
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
              @click.stop="() => $refs.LinkOrderDetailDrawer.handleRefuseTask(item)"
            >拒绝委托</div>
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-green-400 text-white hover:bg-green-300"
              @click.stop="() => $refs.LinkOrderDetailDrawer.handleFinishTask(item)"
            >交付确认</div>
          </div>
        </div>
      </div>
      <div v-if="!dataList.length" class="h-20 flex justify-center items-center text-gray-400 bg-white rounded-lg">空空如也</div>
    </div>
    <div class="flex flex-row justify-center py-2 bg-white rounded-lg mt-5">
      <el-pagination
        class="-mr-3"
        :disabled="dataListLoading"
        :current-page.sync="searchParams.pageIndex"
        :page-size.sync="searchParams.pageSize"
        :layout="isMobile ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next'"
        :page-sizes="pageSizes"
        :total="total"
        :pager-count="5"
        :small="isMobile"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <LinkOrderDetailDrawer
      ref="LinkOrderDetailDrawer"
      @reload="reloadAllData"
    />
    <!-- canWithdrawModal -->
    <a-modal
      v-if="canWithdrawModalParams.show"
      title="提现( 测试，返回全列表 )"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1200px'"
      @cancel="canWithdrawModalParams.show = false"
    >
      <div v-loading="canWithdrawModalParams.loading">
        <div class="pb-4">请选择要提现的订单：</div>
        <div class="h-[60vh] sm:h-[600px]">
          <k-table
            :dataRows="canWithdrawModalParams.rows"
            :border="true"
            height="100%"
            class="h-full"
            :hidePage="true"
            highlight-selection-row
            @selection-change="handleCanWithdrawModalSelectionChange"
          >
            <el-table-column
              v-for="col in canWithdrawModalParams.cols"
              :key="col.key"
              :prop="col.key"
              :type="col.type"
              :label="col.label"
              :align="col.align || 'center'"
              :fixed="col.fixed"
              :width="col.width"
              :min-width="col.minWidth"
            >
              <template v-if="!col.type" v-slot="scope">
                <div>{{ scope.row[col.key] }}</div>
              </template>
            </el-table-column>
          </k-table>
        </div>
        <div class="pt-3 flex flex-row justify-end gap-8">
          <a-button
            class="rounded-md"
            size="large"
            @click="canWithdrawModalParams.show = false"
          >
            取消
          </a-button>
          <a-button
            class="rounded-md"
            type="primary"
            size="large"
            @click="handleCanWithdrawModalSubmit"
          >
            确定
          </a-button>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-if="withdrawalRecordModalParams.show"
      title="提现记录"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1200px'"
      @cancel="withdrawalRecordModalParams.show = false"
    >
      <div>
        <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
          <a-form-model
            :model="withdrawalRecordModalParams.formData"
          >
            <div class="flex flex-row items-start gap-4 overflow-x-auto">
              <a-form-model-item key="orderId" prop="orderId" class="flex-auto min-w-[170px]">
                <a-input
                  v-model="withdrawalRecordModalParams.formData.orderId"
                  placeholder="请输入订单号"
                  size="large"
                  allowClear
                />
              </a-form-model-item>
              <a-form-model-item key="timeRange" prop="timeRange" class="min-w-[240px]">
                <a-range-picker v-model="withdrawalRecordModalParams.formData.timeRange" size="large" allowClear>
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-form-model-item>
              <a-button
                class="rounded-md"
                type="primary"
                icon="search"
                size="large"
                @click="handleWithdrawalRecordModalSearch"
              >
                查询
              </a-button>
            </div>
          </a-form-model>
        </div>
        <div class="h-[60vh] sm:h-[600px]">
          <k-table
            ref="withdrawalRecordModalTable"
            :data="(params) => getwithdrawalRecordModalRows(params)"
            :border="true"
            height="100%"
            class="h-full"
          >
            <el-table-column
              v-for="col in withdrawalRecordModalParams.cols"
              :key="col.key"
              :prop="col.key"
              :type="col.type"
              :label="col.label"
              :align="col.align || 'center'"
              :fixed="col.fixed"
              :width="col.width"
              :min-width="col.minWidth"
            >
              <template v-if="!col.type" v-slot="scope">
                <div>{{ scope.row[col.key] }}</div>
              </template>
            </el-table-column>
          </k-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import KTable from '@/components/Kira/KTable'
import LinkOrderDetailDrawer from '@/components/Kira/LinkOrderDetailDrawer'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'MyOrders',
  mixins: [baseMixin],
  components: {
    KTable,
    LinkOrderDetailDrawer
  },
  data() {
    return {
      lingkeApi,
      pageSizes: [10, 50, 100],
      total: 0,
      dataListLoading: false,
      searchParams: {
        pageIndex: 1,
        pageSize: 10,
        status: ''
      },
      dataList: [],
      teacherAccountParams: {
        accountInfo: {},
        loading: false
      },
      tabParams: {
        loading: false,
        tabList: []
      },
      canWithdrawModalParams: {
        show: false,
        loading: false,
        cols: [
          {
            key: 'organizationName',
            label: '下单人',
            width: 160
          },
          {
            key: 'task',
            label: '委托任务',
            width: 120
          },
          {
            key: 'typeName',
            label: '任务类型',
            width: 120
          },
          {
            key: 'detail',
            label: '任务详细说明',
            minWidth: 200
          },
          {
            key: 'createTime',
            label: '创建时间',
            width: 160
          },
          {
            key: 'updateTime',
            label: '更新时间',
            width: 160
          },
          {
            key: 'unitPrice',
            label: '一小时单价',
            width: 120
          },
          {
            key: 'duration',
            label: '课程时间(小时)',
            width: 120
          },
          {
            type: 'selection',
            width: 60,
            fixed: 'right'
          }
        ],
        rows: [],
        selectedRows: []
      },
      withdrawalRecordModalParams: {
        show: false,
        formData: {
          orderId: '',
          timeRange: []
        },
        cols: [
          {
            key: 'orderId',
            label: '订单号',
            width: 160
          },
          {
            key: 'organizationName',
            label: '下单人',
            width: 160
          },
          {
            key: 'organizationId',
            label: '下单人ID',
            width: 160
          },
          {
            key: 'createTime',
            label: '下单时间',
            width: 160
          },
          {
            key: 'typeName',
            label: '订单类型',
            width: 160
          },
          {
            key: 'detail',
            label: '订单详细说明',
            minWidth: 200
          },
          {
            key: 'unitPrice',
            label: '一小时单价',
            width: 120
          },
          {
            key: 'duration',
            label: '课程时间(小时)',
            width: 120
          },
          {
            key: 'amount',
            label: '委托价格',
            width: 120
          },
          {
            key: 'updateTime',
            label: '提现时间',
            width: 120
          },
          {
            key: 'fee',
            label: '手续费',
            width: 120
          },
          {
            key: 'statusName',
            label: '提现状态',
            width: 120
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
      return this.$route.query.orderId
    }
  },
  async mounted() {
    this.reloadAllData()
  },
  methods: {
    async handleGetTeacherAccount() {
      this.teacherAccountParams.loading = true
      try {
        const res = await lingkeApi.teacherGetAccount({
          userId: this.userInfo.userId
        })
        if (res && res.code === 200) {
          this.teacherAccountParams.accountInfo = res.data
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.teacherAccountParams.loading = false
    },
    async handleGetTabData() {
      this.tabParams.loading = true
      let tabList = []
      try {
        const res = await lingkeApi.orderTeacherOrderTotal({
        })
        if (res && res.code === 200) {
          tabList = [
            {
              key: '',
              value: '全 部',
              num: res.data.total
            },
            ...res.data.tabList.map(tab => {
              return {
                key: tab.status,
                value: tab.name,
                num: tab.num
              }
            })
          ]
        } else {
          throw new Error(res.message || '加载订单统计数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.tabParams.tabList = tabList
      this.tabParams.loading = false
    },
    async handleGetDataList() {
      this.dataListLoading = true
      try {
        const res = await lingkeApi.orderTeacherOrderList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          status: this.searchParams.status
        })
        if (res && res.code === 200) {
          this.dataList = res.data.list
          this.total = res.data.totalCount
        } else {
          throw new Error(res.message || '加载列表数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      } finally {
        this.dataListLoading = false
      }
    },
    async handleSearch() {
      this.searchParams.pageIndex = 1
      await this.handleGetDataList()
    },
    reloadAllData() {
      this.handleGetTeacherAccount()
      this.handleGetTabData()
      this.handleSearch()
    },
    handleTabClick(tab) {
      if (tab) this.searchParams.status = tab.key
      this.handleSearch()
    },
    handleSizeChange() {
      this.handleSearch()
    },
    handleCurrentChange() {
      this.handleGetDataList()
    },
    handleToDetail(row) {
      this.$router.push({ name: this.$route.name, query: { orderId: row.id } })
    },
    async handleOpenCanWithdrawModal() {
      this.canWithdrawModalParams = {
        ...this.canWithdrawModalParams,
        show: true,
        loading: true,
        rows: [],
        selectedRows: []
      }
      try {
        const res = await lingkeApi.orderTeacherOrderList({
          pageIndex: 1,
          pageSize: 9999,
          status: ''
        })
        if (res && res.code === 200) {
          this.canWithdrawModalParams.rows = res.data.list
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.canWithdrawModalParams.loading = false
    },
    handleCanWithdrawModalSelectionChange(rows) {
      this.canWithdrawModalParams.selectedRows = rows
    },
    async handleCanWithdrawModalSubmit() {
      this.canWithdrawModalParams.loading = true
      const resTipList = await Promise.all(this.canWithdrawModalParams.selectedRows.map(async row => {
        const amount = row.unitPrice * row.duration
        let resText = ''
        try {
          const res = await lingkeApi.withdrawalCreate({
            userId: this.userInfo.userId,
            orderId: row.id,
            amount: amount,
            fee: 0
          })
          if (res && res.data && res.data.code === 200) {
            resText = `订单【${ row.task }】提现成功`
          } else {
            throw new Error(res?.message || '系统繁忙')
          }
        } catch (error) {
          resText = `订单【${ row.task }】提现失败，${ error.message }`
          console.log(error)
        }
        return resText
      }))
      this.canWithdrawModalParams.loading = false
      this.canWithdrawModalParams.show = false
      this.reloadAllData()
      this.$info({
        title: '提现结果：',
        icon: () => null,
        content: (
          <div class="flex flex-col gap-y-3 pt-2">
            {
              resTipList.map((rowText, index) => (
                <div class="pb-1 border-b border-solid border-gray-300">{ (index + 1) + '. ' + rowText }</div>
              ))
            }
          </div>
        )
      })
    },
    handleOpenWithdrawalRecordModal() {
      this.withdrawalRecordModalParams = {
        ...this.withdrawalRecordModalParams,
        show: true,
        formData: {
          orderId: '',
          timeRange: []
        }
      }
    },
    async getwithdrawalRecordModalRows(params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const formData = this.withdrawalRecordModalParams.formData
        const res = await lingkeApi.withdrawalGetList({
          userId: this.userInfo.userId,
          pageIndex: params.pageNum,
          pageSize: params.pageSize,
          orderId: formData.orderId || undefined,
          beginTime: formData.timeRange[0] ? formData.timeRange[0].startOf('day').valueOf() : undefined,
          endTime: formData.timeRange[1] ? formData.timeRange[1].endOf('day').valueOf() : undefined
        })
        if (res && res.code === 200) {
          tableData.rows = res.data.list.map(row => ({
            ...row
          }))
          tableData.total = res.data.total
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error(error.message)
      }
      return tableData
    },
    handleWithdrawalRecordModalSearch() {
      this.$refs.withdrawalRecordModalTable.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
