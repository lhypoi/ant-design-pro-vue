<template>
  <div class="w-full mx-auto max-w-[1200px] relative flex-auto flex flex-col rounded-3x px-3 py-6">
    <div class="relative h-[340px] z-0 rounded-2xl overflow-hidden">
      <img src="@/assets/link/t3.webp" alt="" srcset="" class="absolute w-full h-full -z-10" />
      <div class="h-full flex flex-col px-8 pt-16 pb-4">
        <div class="text-5xl text-white">任务广场</div>
        <div class="flex-auto pt-6">
          <div class="max-w-[560px] flex items-center h-10 rounded-full bg-[#4d6bc6] pl-2 pr-4">
            <!-- <a-select
              showSearch
              class="searchInput block flex-auto text-white"
              label-in-value
              :value="fetchWord"
              :show-arrow="false"
              placeholder="请输入任务名称"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="handleFetchSearch"
              @change="handleFetchChange"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in fetchData" :key="d.value">
                {{ d.text }}
              </a-select-option>
            </a-select> -->
            <a-input
              class="searchInput2 block flex-auto text-white"
              placeholder="请输入任务名称"
              v-model="fetchWord"
            />
            <div class="flex cursor-pointer" @click="handleSearch">
              <img src="@/assets/link/t4.webp" alt="" srcset="" class="w-6 h-6" />
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-x-3 sm:gap-x-14 gap-y-3 sm:pl-6">
          <div
            v-for="orderTyp in orderTypeOptions"
            :key="orderTyp.key"
            class="min-w-[96px] h-10 flex whitespace-nowrap items-center justify-center text-lg rounded-lg px-4 cursor-pointer transition duration-300 ease-in-out"
            :class="[
              searchParams.type === orderTyp.key
                ? 'bg-[#2192ef] text-white'
                : 'bg-[#4d6bc6] hover:bg-[#2192ef] text-white',
            ]"
            @click="handleTabClick(orderTyp)"
          >
            {{ orderTyp.value }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="mt-5 min-h-[90px]"
      v-loading="dataListLoading"
      element-loading-spinner="el-icon-loading mt-3"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="flex flex-col gap-y-3">
        <div
          v-for="item in dataList"
          :key="item.id"
          class="flex flex-col gap-1 sm:gap-3 sm:flex-row bg-white rounded-lg shadow-sm p-3 cursor-pointer hover:ring-2 min-h-[90px]"
        >
          <div class="flex-auto flex items-center justify-center gap-3">
            <div class="w-12 h-12 rounded bg-blue-400 text-white flex justify-center items-center text-3xl leading-none">
              {{ item.organizationName[0].toUpperCase() }}
            </div>
            <div class="flex-auto w-0 flex flex-col sm:gap-1 justify-center">
              <div class="text-sm text-[#171515] break-all line-clamp-1">{{ item.task }}</div>
              <div class="text-sm text-[#6D6D6D] break-all line-clamp-1">
                {{ item.detail }}
              </div>
            </div>
          </div>
          <div class="flex sm:flex-col gap-1 sm:justify-center sm:w-24">
            <div class="text-sm text-[#2192EF]">#{{ item.typeName }}</div>
            <div class="text-sm text-[#FDA643]">{{ `￥${item.unitPrice}/${item.duration}h` }}</div>
          </div>
          <div class="flex sm:flex-col gap-1 sm:justify-center sm:w-48">
            <div class="text-sm text-[#6D6D6D]">发布时间</div>
            <div class="text-sm text-[#6D6D6D]">{{ item.createTime }}</div>
          </div>
          <div class="flex sm:flex-col gap-1 sm:justify-center sm:w-48">
            <div class="text-2xl text-[#FDA643]">{{ `￥${item.unitPrice * item.duration}` }}</div>
          </div>
          <div
            class="flex justify-start items-center flex-wrap whitespace-nowrap sm:flex-col gap-y-3 sm:justify-center sm:items-center sm:w-28"
          >
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-[#409EFF] text-white hover:opacity-80"
              @click.stop="() => handleToDetail(item)"
            >
              查看详情
            </div>
          </div>
        </div>
      </div>
      <div v-if="!dataList.length" class="h-20 flex justify-center items-center text-gray-400 bg-white rounded-lg">空空如也</div>
    </div>
    <div class="flex flex-row justify-center py-2 bg-white rounded-lg mt-5">
      <el-pagination
        class="-mr-3"
        :disabled="dataListLoading"
        :current-page.sync="searchParams.pageIndex"
        :page-size.sync="searchParams.pageSize"
        :layout="isMobile ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next'"
        :page-sizes="pageSizes"
        :total="total"
        :pager-count="5"
        :small="isMobile"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <LinkOrderDetailDrawer ref="LinkOrderDetailDrawer" @reload="handleTabClick" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import LinkOrderDetailDrawer from '@/components/Kira/LinkOrderDetailDrawer'
import { baseMixin } from '@/store/app-mixin'
import { debounce } from 'lodash-es'

export default {
  name: 'TaskSquare',
  mixins: [baseMixin],
  components: {
    LinkOrderDetailDrawer
  },
  data() {
    this.lastFetchId = 0
    this.handleFetchSearch = debounce(this.handleFetchSearch, 800)
    return {
      lingkeApi,
      fetchWord: undefined,
      fetchData: [],
      fetching: false,
      pageSizes: [10, 50, 100],
      total: 0,
      dataListLoading: false,
      searchParams: {
        pageIndex: 1,
        pageSize: 10,
        type: ''
      },
      dataList: [],
      infiniteId: 1
    }
  },
  computed: {
    ...mapState(CUR_APP, ['userInfo']),
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
        ...Object.entries(this.codeDict.order?.type || {}).map(([key, value]) => ({
          key,
          value
        }))
      ]
    }
  },
  async mounted() {
    await this.handleGetDataList()
  },
  methods: {
    async handleGetDataList() {
      this.dataListLoading = true
      try {
        const res = await lingkeApi.orderGetList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          task: this.fetchWord || undefined,
          status: '1',
          type: this.searchParams.type || undefined
        })
        if (res && res.code === 200) {
          this.dataList = res.data.list
          this.total = res.data.totalCount
        } else {
          throw new Error(res.message || '加载列表数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      } finally {
        this.dataListLoading = false
      }
    },
    async handleSearch() {
      this.searchParams.pageIndex = 1
      await this.handleGetDataList()
    },
    async handleFetchSearch(value) {
      console.log('fetching user', value)
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.fetchData = []
      this.fetching = true
      const response = await fetch('https://randomuser.me/api/?results=5')
      const body = await response.json()
      if (fetchId !== this.lastFetchId) {
        // for fetch callback order
        return
      }
      const fetchData = body.results.map(user => ({
        text: `${user.name.first} ${user.name.last}`,
        value: user.login.username
      }))
      this.fetchData = fetchData
      this.fetching = false
    },
    handleFetchChange(value) {
      Object.assign(this, {
        fetchWord: value,
        fetchData: [],
        fetching: false
      })
      this.handleSearch()
    },
    handleTabClick(tab) {
      if (tab) this.searchParams.type = tab.key
      this.handleSearch()
    },
    handleSizeChange() {
      this.handleSearch()
    },
    handleCurrentChange() {
      this.handleGetDataList()
    },
    handleToDetail(row) {
      this.$router.push({ name: this.$route.name, query: { orderId: row.id } })
    }
  }
}
</script>

<style lang="less" scoped>
.searchInput {
  :deep(.ant-select-selection) {
    border: none;
    background: transparent;
    box-shadow: none;
    cursor: text;
  }
}

.searchInput2 {
  border: none;
  background: transparent;
  box-shadow: none;
  cursor: text;
}
</style>
