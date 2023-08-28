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
        @click="handleOrderType(orderTyp.key)"
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
            <div class="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-blue-200"></div>
          </div>
          <div class="flex flex-col sm:flex-auto">
            <div class="text-lg text-slate-900 font-bold">{{ item.task }}</div>
            <div class="flex flex-wrap pt-2">
              <div
                class="text-sm text-blue-600 pr-2 cursor-pointer hover:underline"
              >#{{ item.typeName }}</div>
              <div class="text-sm text-slate-400 sm:pl-2">{{ item.updateTime }}</div>
            </div>
            <div class="text-sm text-slate-800 line-clamp-2">
              {{ item.detail }}
            </div>
          </div>
          <div class="-mt-1 mb-1 sm:my-0 flex flex-row justify-start items-center sm:px-4 sm:w-44">
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-7 rounded-md text-sm bg-rose-500 text-white"
            >价格：{{ item.unitPrice }}</div>
          </div>
          <div class="flex justify-between items-center sm:flex-col sm:justify-center sm:items-start sm:pr-2">
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
            >抢任务</div>
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm sm:mt-3 bg-slate-200 text-blue-600 hover:bg-slate-300"
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
        >
          <div class="flex items-center justify-center sm:items-start">
            <div class="w-full sm:w-36 h-36 rounded-lg overflow-hidden bg-blue-200"></div>
          </div>
          <div class="flex flex-col sm:flex-auto">
            <div class="text-lg text-slate-900 font-bold">{{ detailData.task }}</div>
            <div class="flex flex-wrap pt-2">
              <div
                class="text-sm text-blue-600 pr-2 cursor-pointer hover:underline"
              >#{{ detailData.typeName }}</div>
              <div class="text-sm text-slate-400 sm:pl-2">{{ detailData.updateTime }}</div>
            </div>
            <div class="pt-1 pb-4 flex">
              <div
                class="cursor-pointer flex items-center justify-center px-3 h-7 rounded-md text-sm bg-rose-500 text-white"
              >价格：{{ `${detailData.unitPrice}/h x ${detailData.duration}h` }}</div>
            </div>
            <div class="text-sm text-slate-800 line-clamp-2">
              {{ detailData.detail }}
            </div>
          </div>
          <div class="flex justify-between gap-5 pt-5 sm:pt-0">
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
            >抢任务</div>
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-slate-200 text-blue-600 hover:bg-slate-300"
            >
              联系委托方
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'

export default {
  name: 'TaskSquare',
  components: {
  },
  data() {
    return {
      searchParams: {
        pageIndex: 1,
        pageSize: 8,
        type: ''
      },
      dataList: [],
      detailData: null
    }
  },
  computed: {
    ...mapState(CUR_APP, [
    ]),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
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
    },
    infiniteId() {
      return `type_${this.searchParams.type}`
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
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'TaskSquare' })
    },
    async infiniteHandler($state) {
      try {
        const res = await lingkeApi.orderGetList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
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
    handleOrderType(type) {
      this.searchParams.pageIndex = 1
      this.dataList = []
      this.searchParams.type = type
    },
    handleToDetail(row) {
      this.$router.push({ name: 'TaskSquare', query: { id: row.id } })
    },
    async handleDetailIdChange() {
      if (this.detailId) {
        try {
          const res = await lingkeApi.orderGetOne({
            Id: parseInt(this.detailId)
          })
          if (res && res.code === 1000) {
            this.detailData = res.data
          } else {
            throw new Error(res.msg || '加载失败')
          }
        } catch (error) {
          this.$message.error(error.message)
          console.log(error)
        }
      } else {
        this.detailData = null
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
