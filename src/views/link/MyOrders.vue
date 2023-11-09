<template>
  <div class="relative flex-auto flex flex-col bg-white rounded-3xl p-6">
    <div class="flex flex-row flex-wrap gap-y-4" v-loading="teacherAccountParams.loading">
      <div>
        <div class="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full">
          <el-image
            class="w-full h-full"
            :src="require('@/assets/link/avatar.png')"
          />
        </div>
      </div>
      <div class="pl-5 pt-1 flex flex-col gap-y-3">
        <div class="text-sm bg-gray-100 px-4 py-2 rounded-lg text-black whitespace-nowrap">累计订单金额：{{ teacherAccountParams.accountInfo.totalAmount || 0 }}</div>
        <div class="text-sm bg-gray-100 px-4 py-2 rounded-lg text-black whitespace-nowrap">可提现金额：{{ teacherAccountParams.accountInfo.balance || 0 }}</div>
        <div class="text-sm bg-gray-100 px-4 py-2 rounded-lg text-black whitespace-nowrap">已提现金额：{{ teacherAccountParams.accountInfo.withdrawalAmount || 0 }}</div>
      </div>
      <div class="sm:pl-8 sm:pt-3">
        <a-popover title="说明" trigger="click">
          <template slot="content">
            <p>累计金额：历史所有累计已经完成订单的金额总和，订单需要是已完成的才会纳入统计。</p>
            <p>可提现金额：累计金额 - 已提现金额</p>
          </template>
          <div class="text-blue-400 underline underline-offset-4 cursor-pointer">接单规则及提现说明</div>
        </a-popover>
      </div>
      <div class="flex-auto flex flex-row sm:justify-end gap-4 sm:pt-1">
        <a-button
          type="primary"
          class="rounded-md"
          size="large"
        >
          提现
        </a-button>
        <a-button
          type="primary"
          class="rounded-md"
          size="large"
        >
          提现记录
        </a-button>
      </div>
    </div>
    <div class="flex flex-wrap items-end gap-3 min-h-[72px] mt-6 pt-5 pb-4 border-t border-solid border-gray-300" v-loading="tabParams.loading">
      <div
        v-for="tab in tabParams.tabList"
        :key="tab.key"
        class="flex whitespace-nowrap items-center justify-center text-sm rounded-lg px-4 py-2 cursor-pointer transition duration-300 ease-in-out"
        :class="[
          searchParams.status === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-400 hover:text-white text-slate-400'
        ]"
        @click="handleTabClick(tab)"
      >
        {{ `${ tab.value }（${ tab.num }）` }}</div>
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
          <div class="flex flex-row justify-start items-center sm:justify-center sm:w-44">
            <div
              class="text-yellow-500 text-base"
            >{{ item.statusName }}</div>
          </div>
          <div class="flex justify-between items-center flex-wrap whitespace-nowrap sm:flex-col gap-y-3 sm:justify-center sm:items-center sm:w-28">
            <div
              v-if="item.status === '1'"
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
              @click.stop="handleAcceptTask(item)"
            >接受委托</div>
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
              @click.stop="handleRefuseTask(item)"
            >拒绝委托</div>
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-green-400 text-white hover:bg-green-300"
              @click.stop="handleFinishTask(item)"
            >交付确认</div>
            <div
              class="cursor-pointer flex items-center justify-center px-3 h-8 rounded-md text-sm bg-slate-200 text-blue-600 hover:bg-slate-300"
              @click.stop="() => {}"
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
          v-loading="detailDataLoading"
        >
          <div class="flex items-center justify-center sm:items-start">
            <div class="w-full sm:w-36 h-36 rounded-lg overflow-hidden bg-blue-50">
              <el-image
                class="w-full h-full"
                :src="require('@/assets/link/task-type-1.png')"
              />
            </div>
          </div>
          <div class="link-style-form flex flex-col sm:flex-auto">
            <div class="flex gap-x-5">
              <div class="flex-auto text-lg text-slate-900 font-bold">{{ detailData.task }}</div>
              <div
                class="text-yellow-500 text-xl"
              >{{ detailData.statusName }}</div>
            </div>
            <div class="flex flex-wrap pt-2">
              <div
                class="text-sm text-blue-600 pr-2 cursor-pointer"
              >#{{ detailData.typeName }}</div>
              <div class="text-sm text-slate-400 sm:pl-2">{{ detailData.updateTime }}</div>
            </div>
            <div class="pt-2 pb-4 flex">
              <div
                class="cursor-pointer flex items-center justify-center px-3 h-7 rounded-md text-sm bg-rose-500 text-white"
              >价格：￥{{ `${detailData.unitPrice}/h x ${detailData.duration}h` }}</div>
            </div>
            <div class="text-base text-slate-800">
              {{ detailData.detail }}
            </div>
            <div v-if="detailData.fileList && detailData.fileList.length" class="pt-8">
              <div class="text-gray-400">相关文件：</div>
              <a-upload-dragger
                class="dragUploader"
                :fileList="detailData.fileList"
                disabled
                @preview="handleFileDownload"
              >
              </a-upload-dragger>
            </div>
            <div class="flex gap-x-6 gap-y-3 pt-8 flex-wrap whitespace-nowrap">
              <div
                v-if="detailData.status === '1'"
                class="cursor-pointer flex items-center justify-center px-4 h-10 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
                @click.stop="handleAcceptTask(detailData)"
              >接受委托</div>
              <div
                class="cursor-pointer flex items-center justify-center px-4 h-10 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
                @click.stop="handleRefuseTask(item)"
              >拒绝委托</div>
              <div
                class="cursor-pointer flex items-center justify-center px-4 h-10 rounded-md text-sm bg-green-400 text-white hover:bg-green-300"
                @click.stop="handleFinishTask(item)"
              >交付确认</div>
              <div
                class="cursor-pointer flex items-center justify-center px-4 h-10 rounded-md text-sm bg-slate-200 text-blue-600 hover:bg-slate-300"
                @click.stop="() => {}"
              >
                联系委托方
              </div>
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
import { downloadFile } from '@/utils//util.js'

export default {
  name: 'MyOrders',
  components: {
  },
  data() {
    return {
      lingkeApi,
      searchParams: {
        pageIndex: 1,
        pageSize: 8,
        status: ''
      },
      dataList: [],
      detailData: null,
      infiniteId: 1,
      detailDataLoading: false,
      teacherAccountParams: {
        accountInfo: {},
        loading: false
      },
      tabParams: {
        loading: false,
        tabList: []
      }
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'teacherInfo'
    ]),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
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
    this.handleGetTeacherAccount()
    this.handleGetTabData()
  },
  methods: {
    async handleGetTeacherAccount() {
      this.teacherAccountParams.loading = true
      try {
        const res = await lingkeApi.teacherGetAccount({
          userId: this.teacherInfo.userId
        })
        if (res && res.code === 1000) {
          this.teacherAccountParams.accountInfo = res.data
        } else {
          throw new Error(res.msg || '加载失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.teacherAccountParams.loading = false
    },
    async handleGetTabData() {
      this.tabParams.loading = true
      let tabList = []
      try {
        const res = await lingkeApi.orderTotal({
          currentTeacherId: this.teacherInfo.userId
        })
        if (res && res.code === 1000) {
          tabList = [
            {
              key: '',
              value: '全 部',
              num: res.data.total
            },
            ...res.data.tabList.map(tab => {
              return {
                key: tab.status,
                value: tab.name,
                num: tab.num
              }
            })
          ]
        } else {
          throw new Error(res.msg || '加载订单统计数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.tabParams.tabList = tabList
      this.tabParams.loading = false
    },
    async infiniteHandler($state) {
      try {
        const res = await lingkeApi.orderGetList({
          currentTeacherId: this.teacherInfo.userId,
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          status: this.searchParams.status
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
    reloadAllData() {
      if (this.detailId) this.handleDetailIdChange()
      this.handleGetTeacherAccount()
      this.handleGetTabData()
      this.handleTabClick()
    },
    handleTabClick(tab) {
      if (tab) this.searchParams.status = tab.key
      this.searchParams.pageIndex = 1
      this.dataList = []
      this.infiniteId++
    },
    handleAcceptTask(item) {
      this.$confirm({
        title: '提示',
        content: `待委托方确认并完成支付。`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderUpdate({
              teacherId: this.teacherInfo.userId,
              id: item.id,
              status: '2'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('提交成功')
              this.reloadAllData()
            } else {
              throw new Error(res.msg || '失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    handleRefuseTask(item) {
      this.$confirm({
        title: '提示',
        content: `确认拒绝委托?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            // TODO: 此处要考虑怎么传达 当前这人拒绝 这个逻辑概念，目前暂用重置状态为 未处理 代替
            // 拒绝，如果是用 status 6 表示，其他人呢？当前人拒绝过则无法接 而其他未拒绝的人可以接，在字段层面如何表达
            // 公开未指定接收人的呢？-》 转化为 限制人列表 的字段逻辑？
            const res = await lingkeApi.orderUpdate({
              teacherId: this.teacherInfo.userId,
              id: item.id,
              status: '1'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('提交成功')
              this.reloadAllData()
            } else {
              throw new Error(res.msg || '失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    handleFinishTask(item) {
      this.$confirm({
        title: '提示',
        content: `若已完成订单交付，点击确认，可以提交到委托方进行订单完成确认`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderUpdate({
              teacherId: this.teacherInfo.userId,
              id: item.id,
              status: '4'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('已提交委托方进行确认')
              this.reloadAllData()
            } else {
              throw new Error(res.msg || '失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    handleToDetail(row) {
      this.$router.push({ name: 'MyOrders', query: { id: row.id } })
    },
    handleBack() {
      this.$router.push({ name: 'MyOrders' })
    },
    async handleDetailIdChange() {
      if (this.detailId) {
        this.detailDataLoading = true
        try {
          const res = await lingkeApi.orderGetOne({
            Id: parseInt(this.detailId)
          })
          if (res && res.code === 1000) {
            const detailData = res.data
            detailData.fileList = detailData.files ? this.parseFileNamesToObjs(detailData.files.split(',')) : []
            this.detailData = detailData
          } else {
            throw new Error(res.msg || '加载失败')
          }
        } catch (error) {
          this.$message.error(error.message)
          console.log(error)
        }
        this.detailDataLoading = false
      } else {
        this.detailData = null
      }
    },
    parseFileNamesToObjs(names) {
      return names.map(name => {
        const [, , fileName, , fileExtension] = name.match(/(\[.*?\])?(.*)(-.*?)(\..*)$/) || []
        return {
          uid: name,
          name: (fileName + fileExtension) || name,
          status: 'done',
          uploadResName: name,
          downloadUrl: `${lingkeApi.downloadBaseUrl}?file=${name}`
        }
      })
    },
    handleFileDownload(file) {
      downloadFile(file.downloadUrl, file.name, true)
    }
  }
}
</script>

<style lang="less" scoped></style>
