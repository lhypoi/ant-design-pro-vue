<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-modal
      v-if="!!detailId"
      :title="modalTitle"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1200px'"
      @cancel="handleBack"
    >
      <div>
        <div v-if="!detailData">
          <a-skeleton avatar active :paragraph="{ rows: 4 }" />
        </div>
        <div
          v-else
          v-loading="detailDataLoading"

        >
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-gray-950 text-lg pb-1">{{ detailData.task }}</div>
            <div class="flex flex-row gap-5">
              <div class="text-gray-400 text-sm">{{ detailData.createTime }}</div>
              <div class="text-blue-400 text-sm">#{{ detailData.typeName }}</div>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-y-2">
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">委托 ID</div>
              <div class="text-gray-950">{{ detailData.id }}</div>
              <div class="ml-2"><a-icon type="copy" class="cursor-pointer text-blue-400" /></div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">状态</div>
              <div class="text-blue-400">{{ detailData.statusName }}</div>
            </div>
            <div class="w-full sm:w-1/3 flex text-sm">
              <div class="text-gray-400 w-20">价格</div>
              <div class="text-[#FDA643]">￥{{ `${detailData.unitPrice * detailData.duration}` }}</div>
            </div>
            <div class="w-full flex text-sm">
              <div class="text-gray-400 w-20">相关资料</div>
              <div class="flex-auto">
                <a-upload
                  v-if="detailData.fileList && detailData.fileList.length"
                  :fileList="detailData.fileList"
                  disabled
                >
                </a-upload>
                <div v-else>-</div>
              </div>
            </div>
            <div class="w-full flex text-sm">
              <div class="text-gray-400 w-20">委托明细</div>
              <div class="text-gray-950 w-0 flex-auto">{{ detailData.detail }}</div>
            </div>
          </div>
          <div class="mt-4">
            <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-2">课程信息</div>
            <div class="flex flex-wrap gap-y-2">
              <div class="w-full sm:w-1/3 flex text-sm">
                <div class="text-gray-400 w-20">模式</div>
                <div class="text-gray-950">多课时</div>
              </div>
              <div class="w-full sm:w-2/3 flex text-sm">
                <div class="text-gray-400 w-20">时长</div>
                <div class="text-gray-950">2.5小时 * 5节课</div>
              </div>
              <div class="w-full sm:w-1/3 flex text-sm">
                <div class="text-gray-400 w-20">老师</div>
                <div v-if="detailData.teacherId" class="text-blue-400">{{ detailData.teacherName }}</div>
                <div v-else class="text-gray-600">-</div>
              </div>
              <div class="w-full sm:w-2/3 flex text-sm">
                <div class="text-gray-400 w-20">进度</div>
                <div class="text-blue-400 min-w-[200px]">
                  <a-progress :percent="2/5 * 100" :format="() => '2/5'" size="small" status="active" />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="font-bold border-l-2 border-solid border-blue-400 pl-1 leading-none mb-3">交付记录</div>
            <a-table
              :pagination="false"
              :columns="[
                {
                  title: 'Name',
                  dataIndex: 'name',
                },
                {
                  title: 'Age',
                  dataIndex: 'age',
                },
                {
                  title: 'Address',
                  dataIndex: 'address',
                },
              ]"
              :data-source="[
                {
                  key: '1',
                  name: 'John Brown',
                  age: 32,
                  address: 'New York No. 1 Lake Park',
                },
                {
                  key: '2',
                  name: 'Jim Green',
                  age: 42,
                  address: 'London No. 1 Lake Park',
                },
                {
                  key: '3',
                  name: 'Joe Black',
                  age: 32,
                  address: 'Sidney No. 1 Lake Park',
                },
              ]"
              size="small" />
          </div>
          <div class="mt-4 flex justify-end gap-4 items-center">
            <div class="cursor-pointer text-blue-400 leading-none">
              <a-icon type="message" class="text-2xl" />
            </div>
            <a-button
              class="rounded-md"
              type="primary"
              @click="handleCatchTask(detailData)"
            >
              接受委托
            </a-button>
          </div>
        </div>
        <!-- <div
          v-else
          class="flex flex-col gap-5 sm:flex-row"
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
        </div> -->
      </div>
    </a-modal>
  </div>
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
    },
    modalTitle() {
      return this.detailData ? `${ this.detailData.organizationName }的委托` : '-'
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
          if (res && res.code === 200) {
            const detailData = res.data
            detailData.fileList = detailData.files ? this.parseFileNamesToObjs(detailData.files.split(',')) : []
            this.detailData = detailData
          } else {
            throw new Error(res.message || '加载失败')
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
        const [, , fileName, , fileExtension] = name.match(/(.*?\[.*?\])?(.*)(-.*?)(\..*)$/) || []
        return {
          uid: name,
          name: (fileName + fileExtension) || name,
          status: 'done',
          downloadUrl: name
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
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('提交成功')
              this.handleReload()
            } else {
              throw new Error(res.message || '失败')
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
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('拒绝成功')
              this.handleReload()
            } else {
              throw new Error(res.message || '失败')
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
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('撤销成功')
              this.handleReload()
            } else {
              throw new Error(res.message || '失败')
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
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('确认成功')
              this.handleReload()
            } else {
              throw new Error(res.message || '失败')
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
            if (res && res.code === 200 && res.data === 1) {
              this.$message.success('已提交委托方进行确认')
              this.handleReload()
            } else {
              throw new Error(res.message || '失败')
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
