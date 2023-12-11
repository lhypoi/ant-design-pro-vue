<template>
  <div class="min-h-screen bg-gray-100" v-loading.fullscreen.lock="listLoading">
    <div class="p-3 bg-gray-200 fixed top-0 left-0 right-0">
      <a-input-search size="large" placeholder="搜索" v-model="searchText" />
    </div>
    <div class="fixed bottom-3 right-3" @click="handleToHome">
      <div class="flex flex-col items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg border border-solid border-gray-400">
        <div class="">
          <i class="el-icon-s-home text-gray-400 text-3xl"></i>
        </div>
        <div class="text-xs text-gray-400">返回首页</div>
      </div>
    </div>
    <div class="pt-16 pb-4 overflow-hidden" :class="!!detailId ? 'h-0' : 'h-auto'">
      <div v-if="showContactList.length">
        <div
          v-for="item in showContactList"
          :key="item.key"
        >
          <div class="text-base text-gray-600 px-3 py-1">
            {{ item.key }}
          </div>
          <div class="flex flex-col gap-y-1">
            <div
              v-for="listItem in item.list"
              :key="listItem['时间'] + listItem['环节'] + listItem['序号']"
              class="flex flex-row px-3 py-3 gap-x-3 bg-white"
              @click="handleToDetail(listItem)"
            >
              <div class="bg-gray-400 rounded-full w-12 h-12 flex justify-center items-center">
                <i class="el-icon-user-solid text-white text-2xl"></i>
              </div>
              <div class="flex flex-col justify-center">
                <div class="text-base text-gray-800">{{ listItem['姓名'] }}</div>
                <div class="text-sm text-gray-400">{{ listItem['单位'] }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex items-center justify-center p-5 text-gray-400"
      >
        无匹配的讲者主持
      </div>
    </div>
    <a-drawer
      placement="right"
      :closable="false"
      :visible="!!detailId"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      :body-style="{ padding: '0' }"
      width="100%"
    >
      <div class="min-h-screen bg-gray-100 pb-6">
        <div class="p-3">
          <a-icon
            type="left-circle"
            theme="filled"
            class="cursor-pointer text-gray-400 text-4xl"
            @click="handleToList"
          />
        </div>
        <div v-if="contactDetail">
          <div
            class="flex flex-row px-6 pt-3 pb-6 gap-x-4 bg-white"
          >
            <div class="">
              <div class="bg-gray-400 rounded-full w-24 h-24 flex justify-center items-center">
                <i class="el-icon-user-solid text-white text-6xl"></i>
              </div>
            </div>
            <div class="flex flex-col justify-start pt-2">
              <div class="text-2xl text-blue-500">{{ contactDetail['姓名'] }}</div>
              <div class="text-base pt-1 text-gray-400">{{ contactDetail['单位'] }}</div>
            </div>
          </div>
          <div class="text-base text-gray-500 px-3 pt-4 pb-2">
            相关讲座
          </div>
          <div class="flex flex-col gap-y-4">
            <div
              v-for="listItem in contactDetail.detailList"
              :key="listItem['时间'] + listItem['环节'] + listItem['序号']"
              class="bg-white"
            >
              <div class="px-3 py-2 text-lg text-gray-700 border-b border-solid border-gray-300">主持</div>
              <div class="px-3 py-3 flex flex-col gap-y-3">
                <div class="flex flex-row text-base">
                  <div class="text-blue-400 whitespace-nowrap">环节：</div>
                  <div class="text-gray-400">{{ listItem['环节'] }}</div>
                </div>
                <div class="flex flex-row text-base">
                  <div class="text-blue-400 whitespace-nowrap">时间：</div>
                  <div class="text-gray-400">{{ listItem['时间'] }}</div>
                </div>
                <div class="flex flex-row text-base">
                  <div class="text-blue-400 whitespace-nowrap">地点：</div>
                  <div class="text-gray-400">{{ listItem['地点'] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { read, utils } from 'xlsx'
import pinyin from 'pinyin'

export default {
  name: 'List',
  components: {
  },
  data() {
    return {
      list: [],
      listLoading: false,
      searchText: ''
    }
  },
  computed: {
    showContactList() {
      let res = []
      for (var i = 65; i <= 90; i++) {
        res.push({
          key: String.fromCharCode(i),
          list: []
        })
      }
      this.list.map(item => {
        const firstLetter = pinyin(item['姓名'], {
          style: 0
        })[0][0][0].toUpperCase()
        const searchText = this.searchText || ''
        if (!searchText || item['姓名'].indexOf(searchText) > -1) {
          const target = res.find(resItem => resItem.key === firstLetter)
          const existItem = target.list.find(existItem => existItem['姓名'] === item['姓名'])
          if (existItem) {
            existItem.detailList.push(item)
          } else {
            target.list.push({
              ...item,
              detailList: [item]
            })
          }
        }
      })
      res = res.filter(item => item.list.length)
      return res
    },
    detailId() {
      return this.$route.query.id
    },
    contactDetail() {
      let contactDetail = null
      this.showContactList.forEach(item => {
        item.list.forEach(listItem => {
          if (listItem['姓名'] === this.detailId) {
            contactDetail = listItem
          }
        })
      })
      return contactDetail
    }
  },
  async mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const f = await fetch(process.env.VUE_APP_PUBLICPATH + 'medical_forum/list.xlsx?v=2')
      const ab = await f.arrayBuffer()
      const wb = read(ab)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const range = utils.decode_range(ws['!ref'] ?? 'A1')
      range.s.r = 1
      const data = utils.sheet_to_json(ws, {
        range: range
      })
      this.list = data.filter(item => item['姓名'] && item['姓名'].trim()).map(item => ({
        ...item,
        '姓名': item['姓名'].trim()
      }))
      this.listLoading = false
    },
    handleToDetail(row) {
      this.$router.push({ name: this.$route.name, query: { id: row['姓名'] } })
    },
    handleToList() {
      this.$router.push({ name: this.$route.name, query: { } })
    },
    handleToHome() {
      window.location.href = 'http://1105.wx.trust520.com/home'
    }
  }
}
</script>

<style lang="less" scoped></style>
