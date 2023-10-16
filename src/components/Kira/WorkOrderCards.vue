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
            class="flex flex-col px-3 pt-3 pb-2 border border-solid border-gray-400 rounded-md hover:text-blue-400 hover:border-blue-400 hover:shadow-lg"
          >
            <div class="relative pr-[100%] pb-[66%] cursor-pointer" @click="() => $emit('clickRoomImg', workOrder)">
              <el-image
                class="absolute w-full h-full"
                :src="workOrder.roomImg"
              />
            </div>
            <div class="flex flex-row items-center pt-3 pb-2">
              <div class="flex-auto font-bold">
                {{ workOrder.title || '无标题' }}
              </div>
              <!-- <div>
                <a-button
                  class="h-7 rounded-md text-sm"
                  type="primary"
                  @click="() => $emit('editTask', workOrder)"
                >
                  修改任务
                </a-button>
              </div> -->
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
            <div>
              {{ `核查员：${workOrder.chkUserList.map(chkUser => chkUser.userName).join('、') || '-'}` }}
            </div>
            <div>
              {{ `审核员：${workOrder.auditorName || '-'}` }}
            </div>
            <div>
              {{ `复核员：${workOrder.reauditorName || '-'}` }}
            </div>
            <div>
              {{ `工单创建时间：${workOrder.createTime || '-'}` }}
            </div>
            <div>
              {{ `审批完成时间：${workOrder.finishTime || '-'}` }}
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'WorkOrderCards',
  mixins: [baseMixin],
  props: {
    data: {
      type: Function,
      required: true
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
</style>
