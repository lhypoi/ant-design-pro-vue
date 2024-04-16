<template>
  <div class="w-full mx-auto max-w-[1200px] relative flex-auto flex flex-col bg-white rounded-lg shadow-sm p-6 my-6">
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
            class="rounded-md"
            type="primary"
            icon="search"
            size="large"
            @click="handleOrderSearch"
          >
            查询
          </a-button>
          <!-- <a-button
            class="rounded-md"
            type="primary"
            icon="search"
            size="large"
          >
            导出Excel
          </a-button> -->
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
          :formatter="col.formatter"
        >
          <template v-if="!col.type && !col.formatter" v-slot="scope">
            <div>{{ scope.row[col.key] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'" width="120" fixed="right">
          <template v-slot="scope">
            <div class="flex items-center justify-center gap-x-3">
              <div class="text-blue-400 cursor-pointer" @click="() => handleToDetail(scope.row)">详情</div>
              <div v-if="scope.row.status === '1' || scope.row.status === '2'" class="text-red-400 cursor-pointer" @click="() => $refs.LinkOrderDetailDrawer.handleCancelTask(scope.row, '关闭')">关闭委托</div>
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
          label: '委托ID',
          width: 160
        },
        {
          key: 'task',
          label: '委托名称',
          width: 160,
          formatter: this.$ellipsisColFormatter('task')
        },
        {
          key: 'typeName',
          label: '委托类型',
          width: 120
        },
        {
          key: 'statusName',
          label: '委托状态',
          width: 120
        },
        {
          key: 'organizationName',
          label: '委托发起方',
          width: 160,
          formatter: this.$ellipsisColFormatter('organizationName')
        },
        {
          key: 'teacherName',
          label: '委托接收方',
          width: 160,
          formatter: this.$ellipsisColFormatter('teacherName')
        },
        {
          key: 'lessonType',
          label: '课程模式',
          width: 120,
          formatter: (row) => {
            return this.codeDict.order.lessonType[row.lessonType]
          }
        },
        {
          key: 'price',
          label: '价格',
          width: 120,
          formatter: (row) => {
            return '￥' + row.unitPrice * row.lessonNum
          }
        },
        {
          key: 'createTime',
          label: '创建时间',
          width: 180
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
        if (res && res.code === 200) {
          tableData.rows = res.data.list.map(row => ({
            ...row
          }))
          tableData.total = res.data.totalCount
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
