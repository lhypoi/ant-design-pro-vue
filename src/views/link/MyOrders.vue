<template>
  <div class="relative flex-auto flex flex-col bg-white rounded-3xl p-6">
    <div class="flex flex-row flex-wrap gap-y-4" v-loading="teacherAccountParams.loading">
      <div>
        <div class="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full">
          <el-image
            class="w-full h-full"
            :src="require('@/assets/link/avatar.png')"
          />
        </div>
      </div>
      <div class="pl-5 pt-1 flex flex-col gap-y-3">
        <div class="text-sm bg-gray-100 px-4 py-2 rounded-lg text-black whitespace-nowrap">累计订单金额：{{ teacherAccountParams.accountInfo.totalAmount || 0 }}</div>
        <div class="text-sm bg-gray-100 px-4 py-2 rounded-lg text-black whitespace-nowrap">可提现金额：{{ teacherAccountParams.accountInfo.balance || 0 }}</div>
        <div class="text-sm bg-gray-100 px-4 py-2 rounded-lg text-black whitespace-nowrap">已提现金额：{{ teacherAccountParams.accountInfo.withdrawalAmount || 0 }}</div>
      </div>
      <div class="w-full sm:w-auto sm:pl-8 sm:pt-3">
        <a-popover title="说明" trigger="click">
          <template slot="content">
            <p>累计金额：历史所有累计已经完成订单的金额总和，订单需要是已完成的才会纳入统计。</p>
            <p>可提现金额：累计金额 - 已提现金额</p>
          </template>
          <div class="text-blue-400 underline underline-offset-4 cursor-pointer">接单规则及提现说明</div>
        </a-popover>
      </div>
      <div class="flex-auto flex flex-row sm:justify-end gap-4 sm:pt-1">
        <a-button
          type="primary"
          class="rounded-md"
          size="large"
          @click="handleOpenCanWithdrawModal"
        >
          提现
        </a-button>
        <a-button
          type="primary"
          class="rounded-md"
          size="large"
          @click="handleOpenWithdrawalRecordModal"
        >
          提现记录
        </a-button>
      </div>
    </div>
    <div class="flex flex-wrap items-end gap-3 min-h-[72px] mt-6 pt-5 pb-4 border-t border-solid border-gray-300" v-loading="tabParams.loading">
      <div
        v-for="tab in tabParams.tabList"
        :key="tab.key"
        class="flex whitespace-nowrap items-center justify-center text-sm rounded-lg px-4 py-2 cursor-pointer transition duration-300 ease-in-out"
        :class="[
          searchParams.status === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-400 hover:text-white text-slate-400'
        ]"
        @click="handleTabClick(tab)"
      >
        {{ `${ tab.value }（${ tab.num }）` }}</div>
    </div>
    <div
      class="flex-auto flex flex-col"
      :class="detailId ? 'h-0' : 'h-[60vh]'"
    >
      <div
        class="flex flex-col overflow-y-auto px-2 -mx-2 space-y-3"
        :class="dataList.length ? 'py-1' : 'py-24'"
      >
        <div
          v-for="item in dataList"
          :key="item.id"
          class="flex flex-col gap-3 sm:flex-row bg-slate-50 rounded-lg p-3 drop-shadow-md cursor-pointer hover:ring-2"
          @click="handleToDetail(item)"
        >
          <div class="flex items-center justify-center sm:items-start">
            <div class="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-blue-50">
              <el-image
                class="w-full h-full"
                :src="require('@/assets/link/task-type-1.png')"
              />
            </div>
          </div>
          <div class="flex flex-col sm:flex-auto">
            <div class="text-lg text-slate-900 font-bold">{{ item.task }}</div>
            <div class="flex flex-wrap">
              <div
                class="text-sm text-blue-600 pr-2"
              >#{{ item.typeName }}</div>
              <div class="text-sm text-slate-400 sm:pl-2">{{ item.updateTime }}</div>
            </div>
            <div class="text-sm text-slate-800 line-clamp-2 pt-1">
              {{ item.detail }}
            </div>
          </div>
          <div class="flex flex-row justify-start items-center sm:justify-center sm:w-48">
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-7 rounded-md text-sm bg-rose-500 text-white"
            >价格：￥{{ `${ item.unitPrice }/h x ${ item.duration }h` }}</div>
          </div>
          <div class="flex flex-row justify-start items-center sm:justify-center sm:w-44">
            <div
              class="text-yellow-500 text-base"
            >{{ item.statusName }}</div>
          </div>
          <div class="flex justify-between items-center flex-wrap whitespace-nowrap sm:flex-col gap-y-3 sm:justify-center sm:items-center sm:w-28">
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
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-slate-200 text-blue-600 hover:bg-slate-300"
              @click.stop="() => {}"
            >
              联系委托方
            </div>
          </div>
        </div>
        <infinite-loading
          :identifier="infiniteId"
          @infinite="infiniteHandler"
        />
      </div>
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
            class="h-11 w-24 rounded-md text-base"
            size="large"
            @click="canWithdrawModalParams.show = false"
          >
            取消
          </a-button>
          <a-button
            class="h-11 w-24 rounded-md text-base"
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
                class="h-11 rounded-md text-base"
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
      searchParams: {
        pageIndex: 1,
        pageSize: 8,
        status: ''
      },
      dataList: [],
      infiniteId: 1,
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
    this.handleGetTeacherAccount()
    this.handleGetTabData()
  },
  methods: {
    async handleGetTeacherAccount() {
      this.teacherAccountParams.loading = true
      try {
        const res = await lingkeApi.teacherGetAccount({
          userId: this.userInfo.userId
        })
        if (res && res.code === 1000) {
          this.teacherAccountParams.accountInfo = res.data
        } else {
          throw new Error(res.msg || '加载失败')
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
        if (res && res.code === 1000) {
          tabList = [
            {
              key: '',
              value: '全 部',
              num: res.data.total
            },
            ...res.data.tabList.map(tab => {
              return {
                key: tab.Status,
                value: tab.Name,
                num: tab.Num
              }
            })
          ]
        } else {
          throw new Error(res.msg || '加载订单统计数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.tabParams.tabList = tabList
      this.tabParams.loading = false
    },
    async infiniteHandler($state) {
      try {
        const res = await lingkeApi.orderTeacherOrderList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          status: this.searchParams.status
        })
        if (res && res.code === 1000) {
          this.dataList = [...this.dataList, ...res.data.list]
          if (this.dataList.length) $state.loaded()
          if (this.searchParams.pageIndex < res.data.totalPage) {
            this.searchParams.pageIndex++
          } else {
            $state.complete()
          }
        } else {
          throw new Error(res.msg || '加载失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        $state.error()
        console.log(error)
      }
    },
    reloadAllData() {
      this.handleGetTeacherAccount()
      this.handleGetTabData()
      this.handleTabClick()
    },
    handleTabClick(tab) {
      if (tab) this.searchParams.status = tab.key
      this.searchParams.pageIndex = 1
      this.dataList = []
      this.infiniteId++
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
        const res = await lingkeApi.orderGetList({
          teacherId: this.userInfo.userId,
          status: ''
        })
        if (res && res.code === 1000) {
          this.canWithdrawModalParams.rows = res.data.list
        } else {
          throw new Error(res.msg || '加载失败')
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
          if (res && res.data && res.data.code === 1000) {
            resText = `订单【${ row.task }】提现成功`
          } else {
            throw new Error(res?.msg || '系统繁忙')
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
        if (res && res.code === 1000) {
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
