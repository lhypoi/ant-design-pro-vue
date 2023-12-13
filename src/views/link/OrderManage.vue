<template>
  <div class="relative flex-auto flex flex-col bg-white rounded-3xl p-6">
    <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
      <a-form-model
        :model="formData"
      >
        <div class="flex flex-row items-start gap-x-4 flex-wrap">
          <a-form-model-item key="id" prop="id" class="w-full sm:w-[360px]">
            <a-input
              v-model="formData.id"
              placeholder="请输入订单号"
              size="large"
              allowClear
            />
          </a-form-model-item>
          <a-form-model-item key="timeRange" prop="timeRange" class="w-full sm:w-[360px]">
            <a-range-picker v-model="formData.timeRange" size="large" allowClear>
              <a-icon slot="suffixIcon" type="calendar"></a-icon>
            </a-range-picker>
          </a-form-model-item>
          <a-form-model-item key="type" prop="type" class="w-full sm:w-[360px]">
            <a-select v-model="formData.type" size="large" placeholder="请选择订单类型" allowClear>
              <a-select-option v-for="item in options['type']" :key="item.key" :value="item.key">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item key="teacher" prop="teacher" class="w-full sm:w-[360px]">
            <a-input
              v-model="formData.teacher"
              placeholder="请输入接单人名称/ID"
              size="large"
              allowClear
            />
          </a-form-model-item>
          <a-form-model-item key="status" prop="status" class="w-full sm:w-[360px]">
            <a-select v-model="formData.status" size="large" placeholder="请选择订单状态" allowClear>
              <a-select-option v-for="item in options['status']" :key="item.key" :value="item.key">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-button
            class="h-11 rounded-md text-base"
            type="primary"
            icon="search"
            size="large"
            @click="handleOrderSearch"
          >
            查询
          </a-button>
          <a-button
            class="h-11 rounded-md text-base"
            type="primary"
            icon="search"
            size="large"
          >
            导出Excel
          </a-button>
        </div>
      </a-form-model>
    </div>
    <div
      class="flex-auto flex flex-col"
      :class="detailId ? 'h-0' : 'h-[60vh] sm:h-[600px]'"
    >
      <k-table
        ref="orderListTable"
        :data="(params) => handleGetOrderGetList(params)"
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
            <div v-if="col.key === 'status'">{{ `${ scope.row['statusName'] }${ scope.row['status'] === '3' ? '，' + scope.row['remark'] : '' }` }}</div>
            <div v-else>{{ scope.row[col.key] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'" width="120" fixed="right">
          <template v-slot="scope">
            <div class="flex flex-col items-center justify-center gap-y-3">
              <a-button
                class="h-7 rounded-md"
                type="primary"
                @click="handleToDetail(scope.row)"
              >
                查看详情
              </a-button>
            </div>
          </template>
        </el-table-column>
      </k-table>
    </div>
    <LinkOrderDetailDrawer
      ref="LinkOrderDetailDrawer"
      @reload="handleOrderSearch"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import KTable from '@/components/Kira/KTable'
import { baseMixin } from '@/store/app-mixin'
import LinkOrderDetailDrawer from '@/components/Kira/LinkOrderDetailDrawer'

export default {
  name: 'OrderManage',
  mixins: [baseMixin],
  components: {
    KTable,
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
        status: undefined
      },
      options: {
        type: [],
        status: []
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
    orderStatusOptions() {
      return [
        ...Object.entries(this.codeDict.order?.status || {}).map(([key, value]) => (
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
    this.options['status'] = this.orderStatusOptions
  },
  methods: {
    async handleGetOrderGetList(params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const formData = this.formData
        const res = await lingkeApi.orderGetList({
          pageIndex: params.pageNum,
          pageSize: params.pageSize,
          id: formData.id ? parseInt(formData.id) : undefined,
          beginTime: formData.timeRange[0] ? formData.timeRange[0].startOf('day').format() : undefined,
          endTime: formData.timeRange[1] ? formData.timeRange[1].endOf('day').format() : undefined,
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
    handleToDetail(row) {
      this.$router.push({ name: this.$route.name, query: { orderId: row.id } })
    },
    handleOrderSearch() {
      this.$refs.orderListTable.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
