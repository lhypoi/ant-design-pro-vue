<template>
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
            <div class="flex-auto text-lg text-slate-900 font-bold break-all ">{{ detailData.task }}</div>
            <div
              class="text-yellow-500 text-xl whitespace-nowrap"
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
          <div class="text-base text-slate-800 break-all ">
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
            <a-button
              class="h-10 rounded-md"
              type="primary"
              @click="handleCatchTask(detailData)"
            >
              接受委托
            </a-button>
            <a-button
              class="h-10 rounded-md"
              type="danger"
              @click="handleRefuseTask(detailData)"
            >
              拒绝委托
            </a-button>
            <a-button
              class="success-btn h-10 rounded-md"
              type="primary"
              @click="handlePayTask(detailData)"
            >
              支付
            </a-button>
            <a-button
              class="success-btn h-10 rounded-md"
              type="primary"
              @click="handleFinishTask(detailData)"
            >
              交付确认
            </a-button>
            <a-button
              class="h-10 rounded-md"
              type="primary"
            >
              联系委托方
            </a-button>
            <a-button
              class="h-10 rounded-md"
              type="danger"
              @click="handleCancelTask(detailData)"
            >
              撤销委托
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import { downloadFile } from '@/utils//util.js'

export default {
  name: 'LinkOrderDetailDrawer',
  mixins: [baseMixin],
  props: {
  },
  data () {
    return {
      lingkeApi,
      detailData: null,
      detailDataLoading: false
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
  methods: {
    handleBack() {
      this.$router.push({ name: this.$route.name })
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
    },
    handleCatchTask(item) {
      this.$confirm({
        title: '提示',
        content: `待委托方确认并完成支付`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderUpdate({
              teacherId: this.userInfo.userId,
              id: item.id,
              status: '2'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('提交成功')
              this.handleReload()
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
            const res = await lingkeApi.orderUpdate({
              teacherId: this.userInfo.userId,
              id: item.id,
              status: '6'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('拒绝成功')
              this.handleReload()
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
    handleCancelTask(item) {
      this.$confirm({
        title: '提示',
        content: `确认撤销委托?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderUpdate({
              id: item.id,
              isDeleted: '1'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('撤销成功')
              this.handleReload()
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
    handlePayTask(item) {
      this.$confirm({
        title: '提示',
        content: `确认支付?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await lingkeApi.orderUpdate({
              id: item.id,
              status: '3'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('确认成功')
              this.handleReload()
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
              teacherId: this.userInfo.userId,
              id: item.id,
              status: '4'
            })
            if (res && res.code === 1000 && res.data === 1) {
              this.$message.success('已提交委托方进行确认')
              this.handleReload()
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
    handleReload() {
      if (this.detailId) this.handleDetailIdChange()
      this.$emit('reload')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
