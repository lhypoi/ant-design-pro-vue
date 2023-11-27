<template>
  <div class="relative flex-auto flex flex-col bg-white rounded-3xl p-6">
    <div class="text-2xl font-bold text-slate-900">任务广场</div>
    <div class="text-sm text-slate-400">Mission square</div>
    <div class="flex flex-wrap items-end gap-3 pt-7 pb-3">
      <div
        v-for="orderTyp in orderTypeOptions"
        :key="orderTyp.key"
        class="flex whitespace-nowrap items-center justify-center text-base rounded-lg px-4 py-2 cursor-pointer transition duration-300 ease-in-out"
        :class="[
          searchParams.type === orderTyp.key ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-400 hover:text-white text-slate-400'
        ]"
        @click="handleTabClick(orderTyp)"
      >
        {{ orderTyp.value }}</div>
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
          <div class="flex justify-between items-center flex-wrap whitespace-nowrap sm:flex-col gap-y-3 sm:justify-center sm:items-center sm:w-28">
            <div
              v-if="item.status === '1'"
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
              @click.stop="() => $refs.LinkOrderDetailDrawer.handleCatchTask(item)"
            >抢任务</div>
            <div
              v-if="item.status === '1'"
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-slate-200 text-blue-600 hover:bg-slate-300"
              @click.stop="() => {}"
            >
              联系委托方
            </div>
            <div
              v-if="item.status != '1'"
              class="text-yellow-500 font-bold text-base"
            >
              {{ item.statusName }}
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
      @reload="handleTabClick"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import LinkOrderDetailDrawer from '@/components/Kira/LinkOrderDetailDrawer'

export default {
  name: 'TaskSquare',
  components: {
    LinkOrderDetailDrawer
  },
  data() {
    return {
      lingkeApi,
      searchParams: {
        pageIndex: 1,
        pageSize: 8,
        type: ''
      },
      dataList: [],
      infiniteId: 1
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
    },
    orderTypeOptions() {
      return [
        {
          key: '',
          value: '全 部'
        },
        ...Object.entries(this.codeDict.order?.type || {}).map(([key, value]) => (
          {
            key,
            value
          }
        ))
      ]
    }
  },
  async mounted() {
  },
  methods: {
    async infiniteHandler($state) {
      try {
        const res = await lingkeApi.orderGetList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          status: '1',
          type: this.searchParams.type
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
    handleTabClick(tab) {
      if (tab) this.searchParams.type = tab.key
      this.searchParams.pageIndex = 1
      this.dataList = []
      this.infiniteId++
    },
    handleToDetail(row) {
      this.$router.push({ name: this.$route.name, query: { orderId: row.id } })
    }
  }
}
</script>

<style lang="less" scoped></style>
