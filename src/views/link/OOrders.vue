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
            @click="handleOrganizationOrderSearch"
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
          formData.status === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-400 hover:text-white text-slate-400'
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
        ref="organizationOrderTable"
        :data="(params) => handleGetOrderOrganizationOrderList(params)"
        :border="true"
        height="100%"
        class="h-full"
      >
        <el-table-column
          v-for="col in tableCols"
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
        <el-table-column label="操作" :align="'center'" width="120" fixed="right">
          <template v-slot="scope">
            <div class="flex flex-col items-center justify-center gap-y-3">
              <a-button
                class="h-7 rounded-md"
                type="primary"
                @click="$refs.LinkOrderModal.handleOpenLinkOrderModal(scope.row['id'])"
              >
                编辑
              </a-button>
              <a-button
                class="h-7 rounded-md"
                type="primary"
                @click="handleToDetail(scope.row)"
              >
                查看详情
              </a-button>
              <a-button
                class="h-7 rounded-md"
                type="danger"
                @click="$refs.LinkOrderDetailDrawer.handleCancelTask(scope.row)"
              >
                撤销委托
              </a-button>
              <a-button
                class="success-btn h-7 rounded-md"
                type="primary"
                @click="$refs.LinkOrderDetailDrawer.handlePayTask(scope.row)"
              >
                支付
              </a-button>
            </div>
          </template>
        </el-table-column>
      </k-table>
    </div>
    <LinkOrderModal
      ref="LinkOrderModal"
      @reload="handleOrganizationOrderSearch"
    />
    <LinkOrderDetailDrawer
      ref="LinkOrderDetailDrawer"
      @reload="handleOrganizationOrderSearch"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import KTable from '@/components/Kira/KTable'
import { baseMixin } from '@/store/app-mixin'
import LinkOrderModal from '@/components/Kira/LinkOrderModal'
import LinkOrderDetailDrawer from '@/components/Kira/LinkOrderDetailDrawer'

export default {
  name: 'OOrders',
  mixins: [baseMixin],
  components: {
    KTable,
    LinkOrderModal,
    LinkOrderDetailDrawer
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
        {
          key: 'id',
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
          width: 120
        },
        {
          key: 'task',
          label: '需求描述',
          width: 120
        },
        {
          key: 'updateTime',
          label: '交付时间/辅导时间',
          width: 160
        },
        {
          key: 'unitPrice',
          label: '委托单价',
          width: 120
        },
        {
          key: 'duration',
          label: '辅导时间(小时)',
          width: 120
        },
        {
          key: 'price',
          label: '委托价格',
          width: 120
        },
        {
          key: 'teacherId',
          label: '接单人ID',
          width: 120
        },
        {
          key: 'teacherName',
          label: '接单人',
          width: 120
        },
        {
          key: 'statusName',
          label: '委托状态',
          width: 120
        }
      ]
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
      return this.$route.query.orderId
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
          id: formData.id ? parseInt(formData.id) : undefined,
          beginTime: formData.timeRange[0] ? formData.timeRange[0].startOf('day').format() : undefined,
          endTime: formData.timeRange[1] ? formData.timeRange[1].endOf('day').format() : undefined,
          type: formData.type || undefined,
          teacher: formData.teacher || undefined
        })
        if (res && res.code === 200) {
          tabList = [
            {
              key: '',
              value: '全 部',
              num: res.data.total
            },
            ...(res.data.tabList || []).map(tab => {
              return {
                key: tab.Status,
                value: tab.Name,
                num: tab.Num
              }
            })
          ]
        } else {
          throw new Error(res.message || '加载统计数据失败')
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
          id: formData.id ? parseInt(formData.id) : undefined,
          beginTime: formData.timeRange[0] ? formData.timeRange[0].startOf('day').format() : undefined,
          endTime: formData.timeRange[1] ? formData.timeRange[1].endOf('day').format() : undefined,
          type: formData.type || undefined,
          teacher: formData.teacher || undefined,
          status: formData.status || undefined
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
    handleTabClick(tab) {
      if (tab) this.formData.status = tab.key
      this.$refs.organizationOrderTable.refresh()
    },
    handleToDetail(row) {
      this.$router.push({ name: this.$route.name, query: { orderId: row.id } })
    },
    handleOrganizationOrderSearch() {
      this.handleGetOrderOrganizationOrderTotal()
      this.$refs.organizationOrderTable.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
