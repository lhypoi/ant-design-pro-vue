<template>
  <div class="KTable flex flex-col">
    <el-table
      v-bind="$attrs"
      v-loading="localLoading"
      :data="rows"
    >
      <template v-for="name in Object.keys($slots)" :slot="name">
        <slot :name="name" />
      </template>
    </el-table>
    <div class="flex flex-row justify-end pt-3">
      <el-pagination
        class="-mr-3"
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
  </div>
</template>

<script>
import T from 'ant-design-vue/es/table/Table'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'KTable',
  mixins: [baseMixin],
  props: Object.assign({}, T.props, {
    data: {
      type: Function,
      required: true
    }
  }),
  data () {
    return {
      localLoading: false,
      pageNum: 1,
      pageSize: 50,
      pageSizes: [50, 100, 200, 500],
      total: 0,
      sizeChangeFlag: false,
      rows: []
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
    }
  }
}
</script>

<style lang="less" scoped>
.KTable {
  :deep(.el-table) {
    th.el-table__cell {
      background: #f5f7fa;
    }
  }
}
</style>
