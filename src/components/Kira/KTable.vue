<template>
  <div class="KTable flex flex-col">
    <el-table
      v-bind="$attrs"
      v-on="$listeners"
      v-loading="localLoading"
      :data="dataRows || rows"
    >
      <template v-for="name in Object.keys($slots)" :slot="name">
        <slot :name="name" />
      </template>
    </el-table>
    <div v-if="!hidePage" class="flex flex-row justify-end pt-3">
      <el-pagination
        class="-mr-3"
        :disabled="localLoading"
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
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'KTable',
  mixins: [baseMixin],
  props: {
    data: {
      type: Function,
      default: () => ({})
    },
    hidePage: {
      type: Boolean,
      default: false
    },
    dataRows: {
      type: Array,
      required: false,
      default: () => null
    }
  },
  data () {
    return {
      shouldUpdate: false,
      localLoading: false,
      pageNum: 1,
      pageSize: 50,
      pageSizes: [50, 100, 200, 500],
      total: 0,
      rows: []
    }
  },
  watch: {
    shouldUpdate: {
      handler () {
        if (this.shouldUpdate) {
          this.$nextTick(async () => {
            await this.loadData()
            this.shouldUpdate = false
          })
        }
      },
      immediate: true
    }
  },
  created () {
    this.shouldUpdate = true
  },
  methods: {
    async handleSizeChange() {
      this.pageNum = 1
      this.shouldUpdate = true
    },
    async handleCurrentChange() {
      this.shouldUpdate = true
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
      this.pageNum = 1
      this.shouldUpdate = true
    }
  }
}
</script>

<style lang="less" scoped>
// .KTable {
//   :deep(.el-table) {
//     th.el-table__cell {
//       background: #f5f7fa;
//     }
//   }
// }
</style>
