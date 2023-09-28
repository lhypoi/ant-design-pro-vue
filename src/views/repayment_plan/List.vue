<template>
  <div class="min-h-screen bg-gray-100 p-3" v-loading.fullscreen.lock="listLoading">
    <div class="bg-red-200 rounded-md p-1 px-2">
      <div class="text-red-400 text-sm">
        因合作机构限制，每日23:00-02:30无法还款，请在限制前或结束后操作还款，如有疑问请联系客服。
      </div>
    </div>
    <div class="pt-4">
      <div
        v-for="item in showListData"
        :key="item.id"
        class="bg-white p-3 rounded-md shadow-sm"
      >
        <div class="flex flex-row items-center gap-2 text-sm text-gray-400">
          <div>{{ item.time }}</div>
          <div>借款{{ item.total }}</div>
          <div class="flex-auto">分{{ item.times }}期</div>
          <div v-if="!detailId" @click="handleToDetail(item)">明细 ></div>
          <div v-else @click="handleToList">返回主页 ></div>
        </div>
        <div class="border-t border-solid border-gray-200 my-3"></div>
        <div class="text-black text-sm font-bold">
          剩余待还(元)
        </div>
        <div class="text-black text-3xl pt-2 pb-1 font-bold">
          {{ item.last }}
        </div>
      </div>
    </div>
    <div v-if="detailId && showListData[0]" class="pt-4">
      <div class="bg-white p-3 pt-0 rounded-md shadow-sm">
        <a-tabs :active-key="detailTabKey" @tabClick="tabKey => detailTabKey = tabKey">
          <a-tab-pane
            v-for="tab in detailTabOptions"
            :key="tab.key"
            :tab="tab.value"
          >
            <div class="px-2 pt-0">
              <div class="flex flex-col gap-4">
                <div
                  v-for="row in showListData[0].detailData[tab.key]"
                  :key="row.id"
                  class="flex flex-row items-center pb-1 border-b border-solid border-gray-300 last:border-b-0"
                >
                  <div class="flex-auto">
                    <div class="text-gray-400 text-sm">
                      {{ `${row.curTimes}/${showListData[0].times}期 | 还款日 ${row.time}` }}
                    </div>
                    <div class="text-black text-xl font-bold">
                      {{ row.pay }}
                    </div>
                  </div>
                  <div v-if="tab.key === '2'" class="text-gray-400 text-sm font-bold">
                    已还款
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  components: {
  },
  data() {
    return {
      listData: [],
      listLoading: false,
      detailTabKey: '1',
      detailTabOptions: [
        {
          key: '1',
          value: '待还款'
        },
        {
          key: '2',
          value: '已还款'
        }
      ]
    }
  },
  computed: {
    detailId() {
      return this.$route.query.id
    },
    showListData() {
      if (this.detailId) {
        return this.listData.filter(item => item.id === this.detailId)
      } else {
        return this.listData
      }
    }
  },
  created() {
  },
  async mounted() {
    this.getListData()
  },
  methods: {
    async getListData() {
      this.listLoading = true
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 500)
      })
      const generateData = (time, total, times, hasTimes, initialInstallmentAmount) => {
        const formatter = new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: 'CNY'
        })
        const remainingAmount = total - (initialInstallmentAmount * hasTimes)
        const lastInstallmentAmount = total - (initialInstallmentAmount * (times - 1))
        const detailData = {
          '1': [],
          '2': []
        }
        const currentDate = new Date(time)
        currentDate.setMonth(currentDate.getMonth() + 1)
        for (let i = 0; i < times; i++) {
          const year = currentDate.getFullYear()
          const month = currentDate.getMonth() + 1
          const day = currentDate.getDate()
          const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
          if (i >= hasTimes) {
            detailData['1'].push({
              id: '1' + '_' + i,
              curTimes: i + 1,
              time: formattedDate,
              pay: formatter.format((i === times - 1) ? lastInstallmentAmount : initialInstallmentAmount)
            })
          } else {
            detailData['2'].push({
              id: '2' + '_' + i,
              curTimes: i + 1,
              time: formattedDate,
              pay: formatter.format(initialInstallmentAmount)
            })
          }
          currentDate.setMonth(currentDate.getMonth() + 1)
        }
        return {
          id: btoa(time),
          time: time,
          total: formatter.format(total),
          times: times,
          last: formatter.format(remainingAmount),
          detailData: detailData
        }
      }
      this.listData = [
        generateData('2021-10-26', 60500, 36, 26, 2861)
      ]
      this.listLoading = false
    },
    handleToDetail(row) {
      this.$router.push({ name: 'List', query: { id: row.id } })
    },
    handleToList() {
      this.$router.push({ name: 'List', query: { } })
    }
  }
}
</script>

<style lang="less" scoped></style>
