<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-5 sm:p-8">
    <!-- <div class="flex flex-row items-center flex-wrap gap-3 pb-5">
      <div class="flex-auto flex flex-row items-center sm:gap-16 flex-wrap">
        <div class="text-black text-lg font-bold w-full sm:w-auto">{{ `${userInfo.roleName}：${userInfo.username}` }}</div>
        <div class="text-black text-lg font-bold">{{ `待核查任务数：${unCheckTotal}` }}</div>
      </div>
      <div>
        <a-button
          class="h-9 rounded-md text-base"
          type="primary"
          @click="handleOpenTaskModal"
        >
          发起任务
        </a-button>
      </div>
    </div> -->
    <div class="flex-auto">
      <a-skeleton v-if="tabLoading" avatar active :paragraph="{ rows: 4 }" />
      <a-tabs v-else :active-key="curTabKey" class="fullTab" :class="{ 'hiddenTabNav': !tabMode }" @tabClick="tabKey => curTabKey = tabKey">
        <a-tab-pane
          v-for="tab in tabOptions"
          :key="tab.key"
          :tab="tab.value"
        >
          <div class="h-full px-2 pt-2 flex flex-col min-h-[70vh]">
            <template v-if="tab.key === ''">
              <div class="link-style-form link-style-form-sm w-full pb-5 sm:pb-0" :class="{ 'link-style-form-sm': isMobile }">
                <a-form-model
                  :model="formData[tab.key]"
                >
                  <div class="flex flex-row flex-wrap items-start gap-2 sm:gap-4 overflow-x-auto">
                    <a-form-model-item key="title" prop="title" class="min-w-[160px]">
                      <a-input
                        v-model="formData[tab.key].title"
                        placeholder="请输入工单名"
                        size="large"
                        allowClear
                      />
                    </a-form-model-item>
                    <a-form-model-item key="roomName" prop="roomName" class="min-w-[160px]">
                      <a-input
                        v-model="formData[tab.key].roomName"
                        placeholder="请输入机房名"
                        size="large"
                        allowClear
                      />
                    </a-form-model-item>
                    <a-form-model-item key="orderStatus" prop="orderStatus" class="min-w-[180px]">
                      <a-select v-model="formData[tab.key].orderStatus" size="large" placeholder="请选择工单状态" allowClear>
                        <a-select-option v-for="item in orderStatusOptions" :key="item.key" :value="item.key">
                          {{ item.value }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                    <a-form-model-item key="timeRange" prop="timeRange" class="min-w-[240px]">
                      <a-range-picker v-model="formData[tab.key].timeRange" size="large" allowClear>
                        <a-icon slot="suffixIcon" type="calendar" />
                      </a-range-picker>
                    </a-form-model-item>
                    <a-form-model-item key="chkUserName" prop="chkUserName" class="min-w-[160px]">
                      <a-input
                        v-model="formData[tab.key].chkUserName"
                        placeholder="请输入核查员"
                        size="large"
                        allowClear
                      />
                    </a-form-model-item>
                    <a-button
                      class="h-11 rounded-md text-base"
                      type="primary"
                      icon="search"
                      size="large"
                      @click="handleSearch(tab.key)"
                    >
                      查询
                    </a-button>
                  </div>
                </a-form-model>
              </div>
            </template>
            <template v-if="tab.listMode === 'table'">
              <k-table
                :ref="`tab_${tab.key}_table`"
                :data="(params) => getWorkOrderList(tab.key, params)"
                border
                height="100%"
                class="flex-auto"
              >
                <el-table-column prop="workOrderNo" label="工单号" :align="'center'" :width="200" />
                <el-table-column prop="roomName" label="机房名称" :align="'center'" width="auto" />
                <el-table-column prop="chkTime" label="核查时间" :align="'center'" :width="200" />
                <el-table-column prop="chkUserName" label="核查员" :align="'center'" :width="200" />
                <el-table-column prop="orderStatusName" label="工单状态" :align="'center'" width="auto" />
                <el-table-column
                  label="操作"
                  :align="'center'"
                  :width="250"
                >
                  <div slot-scope="scope" class="flex flex-row gap-4 justify-center">
                    <a-button
                      class="h-8 rounded-md text-sm"
                      type="primary"
                    >
                      查看详情
                    </a-button>
                    <a-button
                      class="h-8 rounded-md text-sm"
                      type="primary"
                      @click="handleOpenLab(scope.row)"
                    >
                      查看机房
                    </a-button>
                  </div>
                </el-table-column>
              </k-table>
            </template>
            <template v-if="tab.listMode === 'card'">
              <work-order-cards
                :ref="`tab_${tab.key}_table`"
                :data="(params) => getWorkOrderList(tab.key, params)"
                class="flex-auto h-0"
                @editTask="handleOpenTaskModal"
              />
            </template>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal
      v-if="labModalParams.show"
      :title="labModalParams.labData.name"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      centered
      width="90vw"
      @cancel="labModalParams.show = false"
    >
      <div class="h-[75vh] sm:h-[80vh] pt-6">
        <iframe
          :src="labModalParams.url"
          class="w-full h-full"
        ></iframe>
      </div>
    </a-modal>
    <a-modal
      v-if="taskModalParams.show"
      :title="taskModalParams.taskId ? '修改核查任务' : '发起核查任务'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '640px'"
      @cancel="taskModalParams.show = false"
    >
      <div class="pt-4">
        <div class="link-style-form" v-loading="taskModalParams.optionsLoading">
          <a-form-model
            ref="taskModalForm"
            :model="taskModalParams.formData"
            :rules="taskModalParams.formRules"
            :label-col="{ span: 5 }"
            :wrapper-col="{ offset: isMobile ? 0 : 1, span: 16 }"
          >
            <a-form-model-item key="title" prop="title" label="任务标题">
              <a-input
                v-model="taskModalParams.formData.title"
                placeholder="请输入"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="roomId" prop="roomId" label="核查机房">
              <a-select v-model="taskModalParams.formData.roomId" size="large" placeholder="请选择" allowClear @change="handleTaskModalRoomChange">
                <a-select-option v-for="item in taskModalParams.options['roomId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="chkUserId" prop="chkUserId" label="分配核查员">
              <a-select v-model="taskModalParams.formData.chkUserId" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in taskModalParams.options['chkUserId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="auditorId" prop="auditorId" label="分配审核员">
              <a-select v-model="taskModalParams.formData.auditorId" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in taskModalParams.options['auditorId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="reauditorId" prop="reauditorId" label="分配审定员">
              <a-select v-model="taskModalParams.formData.reauditorId" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in taskModalParams.options['reauditorId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
              <div class="pt-4">
                <a-button
                  class="h-11 w-52 rounded-md text-base"
                  type="primary"
                  size="large"
                  :loading="taskModalParams.submitting"
                  @click="handleTaskModalFormUpdate"
                >
                  保存
                </a-button>
                <a-button
                  v-if="taskModalParams.taskId"
                  class="h-11 w-52 rounded-md text-base mt-4"
                  type="danger"
                  size="large"
                  @click="handleTaskModalFormDelete"
                >
                  删除任务
                </a-button>
              </div>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import nuclearLabApi from '@/api/nuclearLab'
import KTable from '@/components/Kira/KTable'
import WorkOrderCards from '@/components/Kira/WorkOrderCards'
import { mapGetters } from 'vuex'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'WorkOrder',
  mixins: [baseMixin],
  components: {
    KTable,
    WorkOrderCards
  },
  data() {
    return {
      tabLoading: false,
      tabOptions: [],
      curTabKey: '',
      formData: {},
      labModalParams: {
        show: false,
        labData: null,
        url: ''
      },
      taskModalParams: {
        show: false,
        taskId: '',
        optionsLoading: false,
        submitting: false,
        formData: {
          title: '',
          roomId: undefined,
          chkUserId: undefined,
          auditorId: undefined,
          reauditorId: undefined
        },
        options: {
          roomId: [],
          chkUserId: [],
          auditorId: [],
          reauditorId: []
        },
        formRules: {
          title: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          roomId: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          chkUserId: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          auditorId: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          reauditorId: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    orderStatusOptions() {
      return [
        ...Object.entries(this.codeDict.work_order?.orderStatus || {}).map(([key, value]) => (
          {
            key,
            value
          }
        ))
      ]
    },
    unCheckTotal() {
      const target = this.tabOptions.find(tab => tab.key === '0')
      return target ? target.total : '-'
    },
    routePermissions() {
      return (this.$route.meta?.permission || []).reduce((resObj, permissionName) => {
        return Object.assign(resObj, { [permissionName]: true })
      }, {})
    },
    tabMode() {
      return false
    }
  },
  created() {
  },
  async mounted() {
    this.initTab()
    this.initTaskModalRoomOptions()
  },
  methods: {
    async initTab() {
      this.tabLoading = true
      try {
        let resTabList = []
        let resTotal = 0
        const tempJudgeNeedTab = false
        if (tempJudgeNeedTab) {
          const res = await nuclearLabApi.workOrderTotal()
          if (res && res.code === 200) {
            resTabList = res.data.tabList
            resTotal = res.data.total
          } else {
            throw new Error(res.message || '加载失败')
          }
        }
        const tabOptions = [
            {
              key: '',
              value: '全 部'
            },
            ...Object.entries(this.codeDict.work_order?.orderStatus || {}).map(([key, value]) => (
              {
                key,
                value
              }
            ))
        ]
        tabOptions.forEach(tab => {
          if (tab.key === '') {
            tab.value = `${tab.value}（${resTotal}）`
          } else {
            const totalConfig = resTabList.find(item => item.orderStatus === tab.key)
            if (totalConfig) {
              tab.total = totalConfig.num
              tab.value = `${tab.value}（${totalConfig.num}）`
            }
          }
          let listMode = 'table'
          if (tab.key === '0') {
            listMode = 'card'
          }
          tab.listMode = listMode
        })
        const formData = tabOptions.reduce((formData, tab) => {
          formData[tab.key] = {}
          if (tab.key === '') {
            formData[tab.key] = {
              title: '',
              workOrderNo: '',
              roomName: '',
              timeRange: [],
              userName: '',
              orderStatus: undefined
            }
          }
          return formData
        }, {})
        this.tabOptions = tabOptions
        this.formData = formData
      } catch (error) {
        console.log(error)
        this.$message.error(error.message)
      }
      this.tabLoading = false
    },
    async initTaskModalRoomOptions() {
      try {
        const res = await nuclearLabApi.roomAll()
        if (res && res.code === 200) {
          this.taskModalParams.options.roomId = res.data.map(item => {
            return {
              key: item.id,
              value: item.name
            }
          })
        } else {
          throw new Error(res.message || '加载机房列表失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleTaskModalRoomChange() {
      this.taskModalParams.optionsLoading = true
      let chkUserId
      let chkUserList = []
      let auditorId
      let auditorList = []
      let reauditorId
      let reauditorList = []
      try {
        const roomId = this.taskModalParams.formData.roomId
        if (roomId) {
          const res = await nuclearLabApi.roomUserInfoById(roomId)
          if (res && res.code === 200) {
            const getNewOptionsItem = (oldKey, resList) => {
              const newList = resList.map(item => {
                return {
                  key: item.id,
                  value: item.username
                }
              })
              const oldItem = newList.find(item => item.key === oldKey)
              const newKey = oldItem ? oldKey : undefined
              return [newKey, newList]
            }
            [chkUserId, chkUserList] = getNewOptionsItem(this.taskModalParams.formData.chkUserId, res.data.chkUserList)
            ;[auditorId, auditorList] = getNewOptionsItem(this.taskModalParams.formData.auditorId, res.data.auditorList)
            ;[reauditorId, reauditorList] = getNewOptionsItem(this.taskModalParams.formData.reauditorId, res.data.reauditorList)
          } else {
            throw new Error(res.message || '机房关联数据加载失败')
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.taskModalParams.formData.chkUserId = chkUserId
      this.taskModalParams.options.chkUserId = chkUserList
      this.taskModalParams.formData.auditorId = auditorId
      this.taskModalParams.options.auditorId = auditorList
      this.taskModalParams.formData.reauditorId = reauditorId
      this.taskModalParams.options.reauditorId = reauditorList
      if (this.$refs.taskModalForm) {
        this.$refs.taskModalForm.clearValidate([
          'chkUserId',
          'auditorId',
          'reauditorId'
        ])
      }
      this.taskModalParams.optionsLoading = false
    },
    handleOpenTaskModal(task) {
      this.taskModalParams = {
        ...this.taskModalParams,
        show: true,
        taskId: task?.workOrderNo || '',
        optionsLoading: false,
        submitting: false,
        formData: {
          title: task?.title || '',
          roomId: task?.roomId,
          chkUserId: task?.chkUserId,
          auditorId: task?.auditorId,
          reauditorId: task?.reauditorId
        },
        options: {
          ...this.taskModalParams.options,
          chkUserId: [],
          auditorId: [],
          reauditorId: []
        }
      }
      this.handleTaskModalRoomChange()
    },
    async handleTaskModalFormUpdate() {
      try {
        await this.$refs.taskModalForm.validate()
      } catch {
        this.$message.error('提交信息不符合要求，请检查')
        return
      }
      this.taskModalParams.submitting = true
      try {
        const params = {
          title: this.taskModalParams.formData.title,
          roomId: this.taskModalParams.formData.roomId,
          roomName: this.taskModalParams.options.roomId.find(item => item.key === this.taskModalParams.formData.roomId).value,
          chkUserId: this.taskModalParams.formData.chkUserId,
          chkUserName: this.taskModalParams.options.chkUserId.find(item => item.key === this.taskModalParams.formData.chkUserId).value,
          auditorId: this.taskModalParams.formData.auditorId,
          auditorName: this.taskModalParams.options.auditorId.find(item => item.key === this.taskModalParams.formData.auditorId).value,
          reauditorId: this.taskModalParams.formData.reauditorId,
          reauditorName: this.taskModalParams.options.reauditorId.find(item => item.key === this.taskModalParams.formData.reauditorId).value
        }
        const res = this.taskModalParams.taskId ? await nuclearLabApi.workOrderUpdateInfoById(this.taskModalParams.taskId, params) : await nuclearLabApi.workOrderCreate(params)
        if (res && res.code === 200) {
          this.$message.success('保存成功')
          this.taskModalParams.show = false
          this.handleSearch(this.curTabKey)
        } else {
          throw new Error(res.message || '保存失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.taskModalParams.submitting = false
    },
    handleTaskModalFormDelete() {
      this.$confirm({
        title: '警告',
        content: `确定删除该任务吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await nuclearLabApi.workOrderDeleteById(this.taskModalParams.taskId)
            if (res && res.code === 200) {
              this.$message.success('删除成功')
              this.taskModalParams.show = false
              this.handleSearch(this.curTabKey)
            } else {
              throw new Error(res.message || '删除失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    async getWorkOrderList(tabKey, params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const orderStatus = this.formData[tabKey].orderStatus
        let reqParams = {
          pageNum: params.pageNum,
          pageSize: params.pageSize
        }
        if (tabKey === '') {
          reqParams = {
            ...reqParams,
            roomName: this.formData[tabKey].roomName || undefined,
            chkUserName: this.formData[tabKey].chkUserName || undefined,
            orderStatus: orderStatus === undefined ? undefined : [orderStatus].join(','),
            beginTime: this.formData[tabKey].timeRange[0] ? this.formData[tabKey].timeRange[0].startOf('day').valueOf() : undefined,
            endTime: this.formData[tabKey].timeRange[1] ? this.formData[tabKey].timeRange[1].endOf('day').valueOf() : undefined
          }
        } else {
          reqParams = {
            ...reqParams,
            orderStatus: [tabKey].join(',')
          }
        }
        const res = await nuclearLabApi.workOrderList(reqParams)
        if (res && res.code === 200) {
          tableData.rows = res.data.list
          tableData.total = res.data.total
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error(error.message)
      }
      return tableData
    },
    handleSearch(tabKey) {
      this.$refs[`tab_${tabKey}_table`][0].refresh()
    },
    handleOpenLab(labData) {
      this.labModalParams.labData = labData
      this.labModalParams.url = 'http://wjw.sz.gov.cn/wsjd/fszlcs/1_dr/'
      this.labModalParams.show = true
    }
  }
}
</script>

<style lang="less" scoped>
.fullTab {
  @apply h-full flex flex-col;

  :deep(.ant-tabs-content) {
    @apply flex-auto;
  }

  &.hiddenTabNav {
    :deep(.ant-tabs-bar) {
      @apply hidden;
    }
  }
}
</style>
