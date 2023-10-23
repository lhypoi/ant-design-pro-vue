<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-5 sm:p-8">
    <div v-if="topDescBoxMode" class="flex flex-row items-center flex-wrap gap-3 pb-6">
      <div class="flex-auto flex flex-row items-center sm:gap-16 flex-wrap">
        <div class="text-black text-lg font-bold w-full sm:w-auto">{{ `${userInfo.roleName}：${userInfo.username}` }}</div>
      </div>
      <div>
        <a-button
          v-if="showPubTaskBtn"
          class="h-9 rounded-md text-base"
          type="primary"
          @click="handleOpenTaskModal"
        >
          发起任务
        </a-button>
      </div>
    </div>
    <template v-if="formData">
      <div class="link-style-form link-style-form-sm w-full">
        <a-form-model
          :model="formData"
        >
          <div class="flex flex-row flex-wrap items-start gap-4 pt-4 pb-2 overflow-x-auto">
            <a-form-model-item key="title" prop="title" class="w-[150px] -mt-4">
              <a-input
                v-model="formData.title"
                placeholder="请输入工单名"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="workOrderNo" prop="workOrderNo" class="w-[150px] -mt-4">
              <a-input
                v-model="formData.workOrderNo"
                placeholder="请输入工单号"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item v-show="!shortFormMode && formData.formExpand" key="roomName" prop="roomName" class="w-[150px] -mt-4">
              <a-input
                v-model="formData.roomName"
                placeholder="请输入机房名"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item v-show="!shortFormMode && formData.formExpand" key="timeRange" prop="timeRange" class="min-w-[240px] -mt-4">
              <a-range-picker v-model="formData.timeRange" size="large" allowClear>
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-form-model-item>
            <a-form-model-item v-show="!shortFormMode && formData.formExpand" key="userName" prop="userName" class="w-[150px] -mt-4">
              <a-input
                v-model="formData.userName"
                placeholder="请输入人员"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item v-show="!shortFormMode && formData.formExpand" key="orderStatus" prop="orderStatus" class="min-w-[180px] -mt-4">
              <a-select v-model="formData.orderStatus" size="large" placeholder="请选择工单状态" allowClear>
                <a-select-option v-for="item in orderStatusOptions" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="-mt-4">
              <div class="flex flex-row items-center">
                <a-button
                  class="h-11 rounded-md text-base"
                  type="primary"
                  icon="search"
                  size="large"
                  @click="handleSearch"
                >
                  查询
                </a-button>
                <div v-if="!shortFormMode" class="flex flex-row items-center ml-4 gap-1 cursor-pointer text-blue-400" @click="formData.formExpand = !formData.formExpand">
                  <template v-if="formData.formExpand">
                    收起
                    <a-icon type="up" />
                  </template>
                  <template v-else>
                    展开
                    <a-icon type="down" />
                  </template>
                </div>
              </div>
            </a-form-model-item>
          </div>
        </a-form-model>
      </div>
    </template>
    <div class="flex-auto">
      <a-skeleton v-if="tabLoading" avatar active :paragraph="{ rows: 4 }" />
      <a-tabs v-else :active-key="curTabKey" class="fullTab" :class="{ 'hiddenTabNav': !tabMode }" @tabClick="handleTabClick">
        <a-tab-pane
          v-for="tab in tabOptions"
          :key="tab.key"
          :tab="`${tab.value}（${tab.num}）`"
        >
          <div class="h-full px-2 pt-2 flex flex-col min-h-[70vh]">
            <template v-if="listShowMode === 'table'">
              <k-table
                :data="(params) => getWorkOrderList(tab.key, params)"
                border
                height="100%"
                class="flex-auto"
              >
                <el-table-column prop="workOrderNo" label="工单号" :align="'center'" :width="200" />
                <el-table-column prop="title" label="工单名" :align="'center'" :width="200" />
                <el-table-column prop="roomName" label="机房名" :align="'center'" :min-width="150" />
                <el-table-column prop="createTime" label="工单创建时间" :align="'center'" :width="200" />
                <el-table-column prop="orderStatusName" label="工单状态" :align="'center'" :min-width="150" />
                <el-table-column prop="round" label="核查次数" :align="'center'" :width="100" />
                <el-table-column prop="creatorName" label="创建人" :align="'center'" :width="150">
                  <div slot-scope="scope">
                    <a-popover v-if="scope.row['creatorName']" title="手机号码" trigger="click">
                      <template slot="content">
                        <p>{{ scope.row['createPhoneNumber'] }}</p>
                      </template>
                      <div class="text-blue-400 cursor-pointer">{{ scope.row['creatorName'] }}</div>
                    </a-popover>
                    <div v-else>-</div>
                  </div>
                </el-table-column>
                <el-table-column prop="chkUserList" label="核查员" :align="'center'" :width="150">
                  <div slot-scope="scope" class="flex flex-col gap-1 justify-center">
                    <template v-if="scope.row['chkUserList'] && scope.row['chkUserList'].length">
                      <a-popover
                        v-for="(chkUser, index) in scope.row['chkUserList']"
                        :key="chkUser.userId + index"
                        title="手机号码"
                        trigger="click"
                      >
                        <template slot="content">
                          <p>{{ chkUser.phoneNumber }}</p>
                        </template>
                        <div class="text-blue-400 cursor-pointer">{{ chkUser.userName }}</div>
                      </a-popover>
                    </template>
                    <div v-else>-</div>
                  </div>
                </el-table-column>
                <el-table-column prop="auditorName" label="审核员" :align="'center'" :width="150">
                  <div slot-scope="scope">
                    <a-popover v-if="scope.row['auditorName']" title="手机号码" trigger="click">
                      <template slot="content">
                        <p>{{ scope.row['auditPhoneNumber'] }}</p>
                      </template>
                      <div class="text-blue-400 cursor-pointer">{{ scope.row['auditorName'] }}</div>
                    </a-popover>
                    <div v-else>-</div>
                  </div>
                </el-table-column>
                <el-table-column prop="reauditorName" label="复核员" :align="'center'" :width="150">
                  <div slot-scope="scope">
                    <a-popover v-if="scope.row['reauditorName']" title="手机号码" trigger="click">
                      <template slot="content">
                        <p>{{ scope.row['reauditPhoneNumber'] }}</p>
                      </template>
                      <div class="text-blue-400 cursor-pointer">{{ scope.row['reauditorName'] }}</div>
                    </a-popover>
                    <div v-else>-</div>
                  </div>
                </el-table-column>
                <el-table-column prop="remark" label="备注" :align="'center'" :width="200" />
                <el-table-column
                  label="操作"
                  :align="'center'"
                  :width="250"
                >
                  <div slot-scope="scope" class="flex flex-row flex-wrap gap-3 justify-center">
                    <a-button
                      v-if="scope.row['canEdit'] === 1 && scope.row['orderStatus'] !== '4'"
                      class="h-8 rounded-md text-sm"
                      type="primary"
                      @click="handleOpenTaskModal(scope.row)"
                    >
                      修改任务
                    </a-button>
                    <a-button
                      v-if="scope.row['canEdit'] === 1 && scope.row['orderStatus'] === '4'"
                      class="h-8 rounded-md text-sm"
                      type="primary"
                      @click="handleOpenWorkOrderDetailModal(scope.row, '数据修改')"
                    >
                      数据修改
                    </a-button>
                    <a-button
                      v-if="scope.row['canEdit'] === 1"
                      class="h-8 rounded-md text-sm"
                      type="primary"
                      @click="handleTaskDelete(scope.row)"
                    >
                      取消工单
                    </a-button>
                    <a-button
                      class="h-8 rounded-md text-sm"
                      type="primary"
                      @click="handleOpenOrderLab(scope.row)"
                    >
                      三维查看
                    </a-button>
                    <a-button
                      class="h-8 rounded-md text-sm"
                      type="primary"
                      @click="handleOpenWorkOrderDetailModal(scope.row, '表单查看')"
                    >
                      表单查看
                    </a-button>
                  </div>
                </el-table-column>
              </k-table>
            </template>
            <template v-if="listShowMode === 'card'">
              <work-order-cards
                :data="(params) => getWorkOrderList(tab.key, params)"
                class="flex-auto h-0"
                :updatingMode="orderCardsUpdatingMode"
                @clickRoomImg="handleOpenOrderLab"
                @openOrderDetailForm="handleOpenWorkOrderDetailModal"
                @reloadWorkOrderList="handleSearch"
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
      <div class="h-[75vh] sm:h-[80vh]">
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
                placeholder="建议命名格式：地点-机房名-时间"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="roomId" prop="roomId" label="机房名">
              <a-select v-model="taskModalParams.formData.roomId" size="large" placeholder="请选择" allowClear @change="handleTaskModalRoomChange">
                <a-select-option v-for="item in taskModalParams.options['roomId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="chkUserId" prop="chkUserId" label="核查员一">
              <a-select v-model="taskModalParams.formData.chkUserId" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in taskModalParams.options['chkUserId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="chkUserId2" prop="chkUserId2" label="核查员二">
              <a-select v-model="taskModalParams.formData.chkUserId2" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in taskModalParams.options['chkUserId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="auditorId" prop="auditorId" label="审核员">
              <a-select v-model="taskModalParams.formData.auditorId" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in taskModalParams.options['auditorId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="reauditorId" prop="reauditorId" label="复核员">
              <a-select v-model="taskModalParams.formData.reauditorId" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in taskModalParams.options['reauditorId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="remark" prop="remark" label="备注">
              <a-input
                v-model="taskModalParams.formData.remark"
                placeholder="请输入"
                size="large"
                allowClear
              />
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
              </div>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
    </a-modal>
    <el-image
      v-if="imgPreviewParams.src.length"
      ref="imgPreview"
      class="w-0 h-0 overflow-hidden"
      lazy
      :src="imgPreviewParams.src[0]"
      :preview-src-list="imgPreviewParams.src"
    />
    <a-modal
      v-if="videoPreviewParams.show"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '800px'"
      @cancel="videoPreviewParams.show = false"
    >
      <div v-if="videoPreviewParams.src" class="pt-5">
        <video width="100%" height="auto" controls>
          <source :src="videoPreviewParams.src" type="video/mp4">
          <source :src="videoPreviewParams.src" type="video/ogg">
          您的浏览器不支持Video标签。
        </video>
      </div>
      <div v-else>未上传</div>
    </a-modal>
    <WorkOrderDetail
      ref="WorkOrderDetail"
      @reloadWorkOrderList="handleSearch"
      @imgPriview="handleImgPriview"
      @videoPriview="handleVideoPriview"
      @clickRoomImg="handleOpenOrderLab"
    />
  </div>
</template>

<script>
import nuclearLabApi from '@/api/nuclearLab'
import KTable from '@/components/Kira/KTable'
import WorkOrderCards from '@/components/Kira/WorkOrderCards'
import WorkOrderDetail from '@/components/Kira/WorkOrderDetail'
import { mapGetters } from 'vuex'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'WorkOrder',
  mixins: [baseMixin],
  components: {
    KTable,
    WorkOrderCards,
    WorkOrderDetail
  },
  data() {
    return {
      imgPreviewParams: {
        src: []
      },
      videoPreviewParams: {
        show: false,
        src: ''
      },
      formData: null,
      tabLoading: false,
      tabOptions: [],
      curTabKey: '',
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
          chkUserId2: undefined,
          auditorId: undefined,
          reauditorId: undefined,
          remark: ''
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
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters(['token']),
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
    routePermissions() {
      return (this.$route.meta?.permission || []).reduce((resObj, permissionName) => {
        return Object.assign(resObj, { [permissionName]: true })
      }, {})
    },
    topDescBoxMode() {
      return this.routePermissions.adminOrderHandle ||
        this.routePermissions.checkOrderHandle ||
        this.routePermissions.auditOrderHandle ||
        this.routePermissions.reAuditOrderHandle
    },
    showPubTaskBtn() {
      return this.routePermissions.adminOrderHandle
    },
    shortFormMode() {
      return this.routePermissions.checkOrderHandle ||
        this.routePermissions.auditOrderHandle ||
        this.routePermissions.reAuditOrderHandle
    },
    tabMode() {
      return this.routePermissions.adminOrderHandle ||
        this.routePermissions.checkOrderHandle ||
        this.routePermissions.auditOrderHandle ||
        this.routePermissions.reAuditOrderHandle
    },
    listShowMode() {
      if (this.routePermissions.roomCheckShow ||
        this.routePermissions.checkOrderHandle ||
        this.routePermissions.auditOrderHandle ||
        this.routePermissions.reAuditOrderHandle
      ) {
        return 'card'
      }
      return 'table'
    },
    orderCardsUpdatingMode() {
      return this.routePermissions.checkOrderHandle ||
        this.routePermissions.auditOrderHandle ||
        this.routePermissions.reAuditOrderHandle
    }
  },
  async mounted() {
    // 因为layout层更新的isMobile的时机问题，初次渲染时用settimeout延迟
    setTimeout(() => {
      this.initFormData()
      this.updateTab()
      this.initTaskModalRoomOptions()
    }, 0)
  },
  methods: {
    initFormData() {
      this.formData = {
        formExpand: !this.isMobile,
        title: '',
        workOrderNo: '',
        roomName: '',
        timeRange: [],
        userName: '',
        orderStatus: undefined
      }
    },
    async updateTab() {
      this.tabLoading = true
      try {
        let resTab = {
          total: 0,
          tabList: []
        }
        if (this.tabMode) {
          const res = await nuclearLabApi.workOrderTotal({
            title: this.formData.title || undefined,
            workOrderNo: this.formData.workOrderNo || undefined,
            roomName: this.formData.roomName || undefined,
            beginTime: this.formData.timeRange[0] ? this.formData.timeRange[0].startOf('day').valueOf() : undefined,
            endTime: this.formData.timeRange[1] ? this.formData.timeRange[1].endOf('day').valueOf() : undefined,
            userName: this.formData.userName || undefined,
            orderStatus: this.formData.orderStatus || undefined
          })
          if (res && res.code === 200) {
            resTab = res.data
          } else {
            throw new Error(res.message || '加载失败')
          }
        }
        const tabOptions = [
          {
            key: '',
            value: '全 部',
            num: resTab.total
          },
          ...resTab.tabList.map((item) => (
            {
              key: item.orderStatus,
              value: item.name,
              num: item.num
            }
          ))
        ]
        this.tabOptions = tabOptions
      } catch (error) {
        console.log(error)
        this.$message.error(error.message)
      }
      // 延缓一个周期显示，确保老组件被销毁
      this.$nextTick(() => {
        this.tabLoading = false
      })
    },
    async getWorkOrderList(tabKey, params) {
      const tableData = {
        rows: [],
        total: 0
      }
      let res = null
      try {
        const reqParams = {
          pageNum: params.pageNum,
          pageSize: params.pageSize,
          title: this.formData.title || undefined,
          workOrderNo: this.formData.workOrderNo || undefined,
          roomName: this.formData.roomName || undefined,
          beginTime: this.formData.timeRange[0] ? this.formData.timeRange[0].startOf('day').valueOf() : undefined,
          endTime: this.formData.timeRange[1] ? this.formData.timeRange[1].endOf('day').valueOf() : undefined,
          userName: this.formData.userName || undefined,
          orderStatus: this.formData.orderStatus || tabKey || undefined
        }
        if (this.routePermissions['roomCheckShow']) {
          res = await nuclearLabApi.workOrderListDone(reqParams)
        } else {
          res = await nuclearLabApi.workOrderList(reqParams)
        }
        if (res && res.code === 200) {
          if (this.tabMode && this.tabOptions.find(tab => tab.key === tabKey).num === 0) {
            tableData.rows = []
            tableData.total = 0
          } else {
            tableData.rows = res.data.list
            tableData.total = res.data.total
          }
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error(error.message)
      }
      return tableData
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
      let chkUserId2
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
            ;[chkUserId2] = getNewOptionsItem(this.taskModalParams.formData.chkUserId2, res.data.chkUserList)
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
      this.taskModalParams.formData.chkUserId2 = chkUserId2
      this.taskModalParams.options.chkUserId = chkUserList
      this.taskModalParams.formData.auditorId = auditorId
      this.taskModalParams.options.auditorId = auditorList
      this.taskModalParams.formData.reauditorId = reauditorId
      this.taskModalParams.options.reauditorId = reauditorList
      if (this.$refs.taskModalForm) {
        this.$refs.taskModalForm.clearValidate([
          'chkUserId',
          'chkUserId2',
          'auditorId',
          'reauditorId'
        ])
      }
      this.taskModalParams.optionsLoading = false
    },
    handleOpenOrderLab(workOrder) {
      if (this.routePermissions.roomCheckShow) {
        nuclearLabApi.accessLogCreate({
          action: `访问${workOrder.roomName}`,
          detail: '',
          page: this.$route.meta.title,
          remark: ''
        })
      } else {
        nuclearLabApi.accessLogCreate({
          action: workOrder.workOrderNo,
          detail: '三维查看',
          page: this.$route.meta.title,
          remark: ''
        })
      }
      this.labModalParams.labData = {
        name: workOrder.roomName
      }
      // url参数：token，workNumber，roomId
      const url = new URL('http://159.75.246.27:66/')
      url.searchParams.append('token', this.token)
      url.searchParams.append('roomId', workOrder.roomId)
      url.searchParams.append('workNumber', workOrder.workOrderNo)
      this.labModalParams.url = url.toString()
      this.labModalParams.show = true
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
          chkUserId: task?.chkUserList && task.chkUserList[0] && task.chkUserList[0].userId,
          chkUserId2: task?.chkUserList && task.chkUserList[1] && task.chkUserList[1].userId,
          auditorId: task?.auditorId,
          reauditorId: task?.reauditorId,
          remark: task?.remark || ''
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
          chkUserId: this.taskModalParams.formData.chkUserId || 0,
          chkUserId2: this.taskModalParams.formData.chkUserId2 || 0,
          auditorId: this.taskModalParams.formData.auditorId || 0,
          reauditorId: this.taskModalParams.formData.reauditorId || 0,
          remark: this.taskModalParams.formData.remark
        }
        const res = this.taskModalParams.taskId ? await nuclearLabApi.workOrderUpdateInfoById(this.taskModalParams.taskId, params) : await nuclearLabApi.workOrderCreate(params)
        if (res && res.code === 200) {
          if (this.taskModalParams.taskId) {
            nuclearLabApi.accessLogCreate({
              action: this.taskModalParams.taskId,
              detail: '修改任务',
              page: this.$route.meta.title,
              remark: ''
            })
          } else {
            nuclearLabApi.accessLogCreate({
              action: '发起任务',
              detail: res.data,
              page: this.$route.meta.title,
              remark: ''
            })
          }
          this.$message.success('保存成功')
          this.taskModalParams.show = false
          this.handleSearch()
        } else {
          throw new Error(res.message || '保存失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.taskModalParams.submitting = false
    },
    handleTaskDelete(row) {
      this.$confirm({
        title: '警告',
        content: `确定删除工单数据?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await nuclearLabApi.workOrderDeleteById(row.workOrderNo)
            if (res && res.code === 200) {
              nuclearLabApi.accessLogCreate({
                action: row.workOrderNo,
                detail: '取消工单',
                page: this.$route.meta.title,
                remark: ''
              })
              this.$message.success('删除成功')
              this.taskModalParams.show = false
              this.handleSearch()
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
    handleSearch() {
      this.updateTab()
    },
    handleTabClick(tabKey) {
      if (tabKey !== this.curTabKey) {
        this.curTabKey = tabKey
      }
    },
    handleOpenWorkOrderDetailModal(row, accessLogDetail) {
      if (accessLogDetail) {
        nuclearLabApi.accessLogCreate({
          action: row.workOrderNo,
          detail: accessLogDetail,
          page: this.$route.meta.title,
          remark: ''
        })
      }
      this.$refs.WorkOrderDetail.openWorkOrderDetailModal(row)
    },
    handleImgPriview(src) {
      this.imgPreviewParams.src = src
      this.$nextTick(() => {
        this.$refs.imgPreview.clickHandler()
      })
    },
    handleVideoPriview(src) {
      this.videoPreviewParams = {
        show: true,
        src: src
      }
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
