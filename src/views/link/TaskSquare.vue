<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="text-2xl font-bold text-slate-900">任务广场</div>
    <div class="text-sm text-slate-400">Mission square</div>
    <div class="flex flex-wrap items-end pt-5">
      <div
        v-for="item in filterOptions"
        :key="item.key"
        class="flex whitespace-nowrap items-center justify-center mr-4 mb-4 text-lg rounded-lg px-6 py-2 cursor-pointer transition duration-300 ease-in-out"
        :class="[
          curFilterOption === item.key ? 'font-bold bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-400 hover:text-white text-slate-400'
        ]"
        @click="curFilterOption = item.key"
      >
        {{ item.label }}</div>
    </div>
    <div class="flex-auto flex flex-col">
      <div
        v-if="dataList.length"
        class="flex flex-col space-y-3"
      >
        <div
          v-for="item in dataList"
          :key="item.i"
          class="flex flex-col sm:flex-row bg-slate-100 rounded-lg p-3 hover:ring-2"
        >
          <div class="flex items-center justify-center sm:items-start">
            <div class="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-blue-200"></div>
          </div>
          <div class="flex flex-col sm:pl-3 sm:pr-3 sm:flex-auto">
            <div class="text-lg text-slate-900">{{ item.title }}</div>
            <div class="flex flex-wrap pt-1">
              <div
                v-for="tag in item.tags"
                :key="tag.title"
                class="text-sm text-blue-600 pr-2 cursor-pointer hover:underline"
              >#{{ tag.title }}</div>
              <div class="text-sm text-slate-400 w-full sm:w-auto sm:pl-2">{{ item.time }}</div>
            </div>
            <div class="text-sm text-slate-800 pt-1 line-clamp-4 sm:line-clamp-2">
              {{ item.content }}
            </div>
          </div>
          <div class="flex pt-2 justify-between px-1 sm:px-0 sm:pt-0 sm:flex-col sm:justify-end">
            <div
              class="cursor-pointer flex items-center justify-center w-24 h-8 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
            >接受委托</div>
            <div
              class="cursor-pointer flex items-center justify-center w-24 h-8 rounded-md text-sm sm:mt-3 bg-slate-200 text-blue-600 hover:bg-slate-300"
            >
              联系委托方
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex-auto flex items-center justify-center"
      >
        <a-spin :spinning="loading">
          <a-empty description="空空如也" />
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'

export default {
  name: 'TaskSquare',
  components: {
  },
  data() {
    return {
      filterOptions: [
        {
          key: '0',
          label: '全 部'
        },
        {
          key: '1',
          label: '课业辅导'
        },
        {
          key: '2',
          label: '论文辅导'
        },
        {
          key: '3',
          label: '留学文书'
        }
      ],
      curFilterOption: '0',
      dataList: [],
      loading: false
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'teacherInfo'
    ])
  },
  created() {
  },
  async mounted() {
    console.log(this.teacherInfo)
    await this.getDataList()
  },
  methods: {
    async getDataList() {
      this.loading = true
      try {
        const res = await lingkeApi.orderGetList({
        })
        if (res && res.code === 1000) {
          this.dataList = res.data.list
        } else {
          throw new Error(res.msg || '加载失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
