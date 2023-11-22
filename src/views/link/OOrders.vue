<template>
  <div class="relative flex-auto flex flex-col bg-white rounded-3xl p-6">
    <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
      <a-form-model
        :model="formData"
      >
        <div class="flex flex-row items-start gap-4 overflow-x-auto">
          <a-form-model-item key="id" prop="id" class="flex-auto min-w-[170px]">
            <a-input
              v-model="formData.id"
              placeholder="请输入订单号"
              size="large"
              allowClear
            />
          </a-form-model-item>
          <a-form-model-item key="timeRange" prop="timeRange" class="min-w-[240px]">
            <a-range-picker v-model="formData.timeRange" size="large" allowClear>
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
          </a-form-model-item>
          <a-form-model-item key="type" prop="type" class="min-w-[240px]">
            <a-select v-model="formData.type" size="large" placeholder="请选择订单类型" allowClear>
              <a-select-option v-for="item in options['type']" :key="item.key" :value="item.key">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item key="teacher" prop="teacher" class="flex-auto min-w-[170px]">
            <a-input
              v-model="formData.teacher"
              placeholder="请输入接单人名称/ID"
              size="large"
              allowClear
            />
          </a-form-model-item>
          <a-button
            class="h-11 rounded-md text-base"
            type="primary"
            icon="search"
            size="large"
          >
            查询
          </a-button>
        </div>
      </a-form-model>
    </div>
    <div class="flex flex-wrap items-end gap-3 min-h-[56px] pt-2 pb-3" v-loading="tabParams.loading">
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
      :class="detailId ? 'h-0' : 'h-[60vh] sm:h-[600px]'"
    >
      <k-table
        ref="withdrawalRecordModalTable"
        :data="(params) => handleGetOrderOrganizationOrderList(params)"
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
    <a-drawer
      placement="right"
      :closable="false"
      :visible="!!detailId"
      :get-container="false"
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
        <div class="text-2xl font-bold text-slate-900">订单详情</div>
        <div class="text-sm text-slate-400">Order details</div>
        <div v-if="!detailData" class="pt-8">
          <a-skeleton avatar active :paragraph="{ rows: 4 }" />
        </div>
        <div
          v-else
          class="flex flex-col gap-5 sm:flex-row pt-8"
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
              <div class="flex-auto text-lg text-slate-900 font-bold">{{ detailData.task }}</div>
              <div
                class="text-yellow-500 text-xl"
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
            <div class="text-base text-slate-800">
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
              <div
                v-if="detailData.status === '1'"
                class="cursor-pointer flex items-center justify-center px-4 h-10 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
                @click.stop="handleAcceptTask(detailData)"
              >接受委托</div>
              <div
                class="cursor-pointer flex items-center justify-center px-4 h-10 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
                @click.stop="handleRefuseTask(item)"
              >拒绝委托</div>
              <div
                class="cursor-pointer flex items-center justify-center px-4 h-10 rounded-md text-sm bg-green-400 text-white hover:bg-green-300"
                @click.stop="handleFinishTask(item)"
              >交付确认</div>
              <div
                class="cursor-pointer flex items-center justify-center px-4 h-10 rounded-md text-sm bg-slate-200 text-blue-600 hover:bg-slate-300"
                @click.stop="() => {}"
              >
                联系委托方
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
    <!-- canWithdrawModal -->
    <a-modal
      v-if="canWithdrawModalParams.show"
      title="提现"
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
import { downloadFile } from '@/utils//util.js'
import KTable from '@/components/Kira/KTable'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'OOrders',
  mixins: [baseMixin],
  components: {
    KTable
  },
  data() {
    return {
      lingkeApi,
      formData: {
        id: '',
        timeRange: [],
        type: undefined,
        teacher: '',
        status: ''
      },
      options: {
        type: []
      },
      tabParams: {
        loading: false,
        tabList: []
      },
      tableCols: [

      ],
      searchParams: {
        pageIndex: 1,
        pageSize: 8,
        status: ''
      },
      dataList: [],
      detailData: null,
      infiniteId: 1,
      detailDataLoading: false,
      teacherAccountParams: {
        accountInfo: {},
        loading: false
      },
      canWithdrawModalParams: {
        show: false,
        loading: false,
        cols: [
          {
            key: 'tempColLocal1',
            label: '下单人（缺失key）',
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
            key: 'tempColLocal1',
            label: '订单号',
            width: 160
          },
          {
            key: 'tempColLocal2',
            label: '下单人',
            minWidth: 160
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
    orderTypeOptions() {
      return [
        ...Object.entries(this.codeDict.order?.type || {}).map(([key, value]) => (
          {
            key,
            value
          }
        ))
      ]
    },
    detailId() {
      return this.$route.query.id
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
  async mounted() {
    this.options['type'] = this.orderTypeOptions
    this.handleGetOrderOrganizationOrderTotal()
  },
  methods: {
    async handleGetOrderOrganizationOrderTotal() {
      this.tabParams.loading = true
      let tabList = []
      try {
        const formData = this.formData
        const res = await lingkeApi.orderOrganizationOrderTotal({
          id: formData.id || undefined,
          beginTime: formData.timeRange[0] ? formData.timeRange[0].startOf('day').valueOf() : undefined,
          endTime: formData.timeRange[1] ? formData.timeRange[1].endOf('day').valueOf() : undefined,
          type: formData.type || undefined,
          teacher: formData.teacher || undefined
        })
        if (res && res.code === 1000) {
          tabList = [
            {
              key: '',
              value: '全 部',
              num: res.data.total
            },
            ...(res.data.tabList || []).map(tab => {
              return {
                key: tab.status,
                value: tab.name,
                num: tab.num
              }
            })
          ]
        } else {
          throw new Error(res.msg || '加载统计数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.tabParams.tabList = tabList
      this.tabParams.loading = false
    },
    async handleGetOrderOrganizationOrderList(params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const formData = this.formData
        const res = await lingkeApi.orderOrganizationOrderList({
          pageIndex: params.pageNum,
          pageSize: params.pageSize,
          id: formData.id || undefined,
          beginTime: formData.timeRange[0] ? formData.timeRange[0].startOf('day').valueOf() : undefined,
          endTime: formData.timeRange[1] ? formData.timeRange[1].endOf('day').valueOf() : undefined,
          type: formData.type || undefined,
          teacher: formData.teacher || undefined,
          status: formData.status || undefined
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
    reloadAllData() {
      if (this.detailId) this.handleDetailIdChange()
      this.handleTabClick()
    },
    handleTabClick(tab) {
      if (tab) this.searchParams.status = tab.key
      this.searchParams.pageIndex = 1
      this.dataList = []
      this.infiniteId++
    },
    handleAcceptTask(item) {
      this.$confirm({
        title: '提示',
        content: `待委托方确认并完成支付。`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderUpdate({
              teacherId: this.userInfo.userId,
              id: item.id,
              status: '2'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('提交成功')
              this.reloadAllData()
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
    handleRefuseTask(item) {
      this.$confirm({
        title: '提示',
        content: `确认拒绝委托?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            // TODO: 此处要考虑怎么传达 当前这人拒绝 这个逻辑概念，目前暂用重置状态为 未处理 代替
            // 拒绝，如果是用 status 6 表示，其他人呢？当前人拒绝过则无法接 而其他未拒绝的人可以接，在字段层面如何表达
            // 公开未指定接收人的呢？-》 转化为 限制人列表 的字段逻辑？
            const res = await lingkeApi.orderUpdate({
              teacherId: this.userInfo.userId,
              id: item.id,
              status: '1'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('提交成功')
              this.reloadAllData()
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
    handleFinishTask(item) {
      this.$confirm({
        title: '提示',
        content: `若已完成订单交付，点击确认，可以提交到委托方进行订单完成确认`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderUpdate({
              teacherId: this.userInfo.userId,
              id: item.id,
              status: '4'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('已提交委托方进行确认')
              this.reloadAllData()
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
    handleToDetail(row) {
      this.$router.push({ name: 'MyOrders', query: { id: row.id } })
    },
    handleBack() {
      this.$router.push({ name: 'MyOrders' })
    },
    async handleDetailIdChange() {
      if (this.detailId) {
        this.detailDataLoading = true
        try {
          const res = await lingkeApi.orderGetOne({
            Id: parseInt(this.detailId)
          })
          if (res && res.code === 1000) {
            const detailData = res.data
            detailData.fileList = detailData.files ? this.parseFileNamesToObjs(detailData.files.split(',')) : []
            this.detailData = detailData
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
          currentTeacherId: this.userInfo.userId,
          teacher_id: this.userInfo.userId,
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
