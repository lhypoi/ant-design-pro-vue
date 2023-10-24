<template>
  <div>
    <a-modal
      v-if="workOrderDetailModalParams.show"
      :title="workOrderDetailModalParams.title"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1200px'"
      @cancel="workOrderDetailModalParams.show = false"
    >
      <div v-loading="workOrderDetailModalParams.modalLoading">
        <div v-if="workOrderDetailModalParams.detailData">
          <div v-if="!logMode" class="flex flex-row justify-end -mb-4 sm:-mb-8">
            <a-button
              class="h-8 rounded-md text-sm"
              type="primary"
              @click="() => $emit('clickRoomImg', workOrderDetailModalParams.detailData)"
            >
              三维界面
            </a-button>
          </div>
          <div class="flex flex-row">
            <div class="flex-auto flex flex-row flex-wrap gap-x-5 sm:gap-x-10 gap-y-2 whitespace-nowrap">
              <div class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">工单号：</span>
                {{ workOrderDetailModalParams.detailData.workOrderNo }}
              </div>
              <div class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">工单名：</span>
                {{ workOrderDetailModalParams.detailData.title }}
              </div>
              <div v-if="workOrderDetailModalParams.detailData.finishTime" class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">审批完成时间：</span>
                {{ workOrderDetailModalParams.detailData.finishTime || '-' }}
              </div>
              <div class="flex flex-rowmin-w-[140px] sm:min-w-[320px]">
                <div class="font-bold">管理员：</div>
                <a-popover v-if="workOrderDetailModalParams.detailData.creatorName" title="手机号码" trigger="click">
                  <template slot="content">
                    <p>{{ workOrderDetailModalParams.detailData.createPhoneNumber }}</p>
                  </template>
                  <div class="text-blue-400 cursor-pointer">{{ workOrderDetailModalParams.detailData.creatorName }}</div>
                </a-popover>
                <div v-else>-</div>
              </div>
              <div class="flex flex-row min-w-[140px] sm:min-w-[320px]">
                <div class="font-bold">核查员：</div>
                <template v-if="workOrderDetailModalParams.detailData['chkUserList'] && workOrderDetailModalParams.detailData['chkUserList'].length">
                  <a-popover
                    v-for="(chkUser, index) in workOrderDetailModalParams.detailData['chkUserList']"
                    :key="chkUser.userId + index"
                    title="手机号码"
                    trigger="click"
                  >
                    <template slot="content">
                      <p>{{ chkUser.phoneNumber }}</p>
                    </template>
                    <span class="text-blue-400 cursor-pointer">{{ chkUser.userName }}</span>
                    <span v-if="index !== workOrderDetailModalParams.detailData['chkUserList'].length - 1">、</span>
                  </a-popover>
                </template>
                <div v-else>-</div>
              </div>
              <div class="flex flex-row min-w-[140px] sm:min-w-[320px]">
                <div class="font-bold">审核员：</div>
                <a-popover v-if="workOrderDetailModalParams.detailData.auditorName" title="手机号码" trigger="click">
                  <template slot="content">
                    <p>{{ workOrderDetailModalParams.detailData.auditPhoneNumber }}</p>
                  </template>
                  <div class="text-blue-400 cursor-pointer">{{ workOrderDetailModalParams.detailData.auditorName }}</div>
                </a-popover>
                <div v-else>-</div>
              </div>
              <div class="flex flex-row min-w-[140px] sm:min-w-[320px]">
                <div class="font-bold">复核员：</div>
                <a-popover v-if="workOrderDetailModalParams.detailData.reauditorName" title="手机号码" trigger="click">
                  <template slot="content">
                    <p>{{ workOrderDetailModalParams.detailData.reauditPhoneNumber }}</p>
                  </template>
                  <div class="text-blue-400 cursor-pointer">{{ workOrderDetailModalParams.detailData.reauditorName }}</div>
                </a-popover>
                <div v-else>-</div>
              </div>
              <div class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">机房名：</span>
                {{ workOrderDetailModalParams.detailData.roomName }}
              </div>
              <div class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">机房点位图：</span>
                <span class="text-blue-400 cursor-pointer" @click="handleImgPriview([workOrderDetailModalParams.detailData.pointImg])">查看</span>
              </div>
              <div class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">工单状态：</span>
                {{ workOrderDetailModalParams.detailData.orderStatusName }}
              </div>
              <div class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">核查轮次：</span>
                {{ workOrderDetailModalParams.detailData.round }}
              </div>
              <div class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">工单创建时间：</span>
                {{ workOrderDetailModalParams.detailData.createTime }}
              </div>
              <div class="min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">数据更新时间：</span>
                {{ workOrderDetailModalParams.detailData.updateTime }}
              </div>
              <div class="flex flex-row min-w-[140px] sm:min-w-[320px]">
                <span class="font-bold">机房核查视频：</span>
                <div
                  class="flex flex-row"
                  v-loading="workOrderDetailModalParams.detailData.tempLoading['chkVideo']"
                  element-loading-spinner="el-icon-loading mt-3"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                  <span
                    class="text-blue-400 cursor-pointer"
                    @click="() => $emit('videoPriview', workOrderDetailModalParams.detailData['chkVideo'])"
                  >播放</span>
                  <span
                    v-if="workOrderDetailModalParams.detailData.canCheck === 1"
                    class="text-blue-400 cursor-pointer ml-2"
                    @click="() => $refs['form_chkVideo'].click()"
                  >上传</span>
                </div>
                <div class="w-0 h-0 overflow-hidden absolute">
                  <a-upload-dragger
                    :multiple="true"
                    :action="nuclearLabApi.uploadUrl"
                    :headers="{
                      'x-token': token
                    }"
                    accept="video/*"
                    :fileList="workOrderDetailModalParams.detailData.tempRow['chkVideo']"
                    @change="info => handleFormFileChange(info, workOrderDetailModalParams.detailData.tempRow, 'chkVideo', true, () => handlePointTableRowImgSave(workOrderDetailModalParams.detailData, 'chkVideo'), true, workOrderDetailModalParams.detailData)"
                  >
                    <div :ref="`form_chkVideo`" ></div>
                  </a-upload-dragger>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-6">
            <k-table
              :dataRows="workOrderDetailModalParams.detailData.logList"
              border
              :hidePage="true"
            >
              <el-table-column prop="chkStartTime" label="开始核查时间" :align="'center'" :width="200" />
              <el-table-column prop="chkTime" label="核查提交时间" :align="'center'" :width="200" />
              <el-table-column prop="chkUserName" label="核查员" :align="'center'" :width="150">
                <div slot-scope="scope">
                  <a-popover v-if="scope.row['chkUserName']" title="手机号码" trigger="click">
                    <template slot="content">
                      <p>{{ scope.row['chkPhoneNumber'] }}</p>
                    </template>
                    <div class="text-blue-400 cursor-pointer">{{ scope.row['chkUserName'] }}</div>
                  </a-popover>
                  <div v-else>-</div>
                </div>
              </el-table-column>
              <el-table-column prop="auditStartTime" label="审核开始时间" :align="'center'" :width="200" />
              <el-table-column prop="auditTime" label="审核完成时间" :align="'center'" :width="200" />
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
              <el-table-column prop="reauditStartTime" label="复核开始时间" :align="'center'" :width="200" />
              <el-table-column prop="reauditTime" label="复核完成时间" :align="'center'" :width="200" />
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
            </k-table>
          </div>
          <div class="pt-6">
            <k-table
              :dataRows="workOrderDetailModalParams.pointsTableRows"
              border
              :span-method="workOrderDetailModalParams.pointsTableSpanMethod"
              :hidePage="true"
            >
              <el-table-column
                v-for="col in workOrderDetailModalParams.pointsTableCols"
                :key="col.key"
                :prop="col.key"
                :label="col.label"
                :align="col.align || 'center'"
                :width="col.width"
                :min-width="col.minWidth"
              >
                <template
                  slot-scope="scope"
                >
                  <div
                    v-if="col.editType === 'text'"
                    v-loading="scope.row.tempLoading[col.key]"
                    element-loading-spinner="el-icon-loading mt-3"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                  >
                    <a-input
                      v-model="scope.row.tempRow[col.key]"
                      @blur="handlePointTableRowInputSave(scope.row, col.key)"
                    />
                  </div>
                  <div
                    v-else-if="col.editType === 'number'"
                    v-loading="scope.row.tempLoading[col.key]"
                    element-loading-spinner="el-icon-loading mt-3"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                  >
                    <a-input-number
                      v-model="scope.row.tempRow[col.key]"
                      @blur="handlePointTableRowInputSave(scope.row, col.key)"
                    />
                  </div>
                  <div
                    v-else-if="col.editType === 'radio'"
                    v-loading="scope.row.tempLoading[col.key]"
                    element-loading-spinner="el-icon-loading mt-3"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                  >
                    <a-radio-group
                      v-model="scope.row.tempRow[col.key]"
                      @change="handlePointTableRowCheckboxSave(scope.row, col.key)"
                    >
                      <a-row>
                        <a-col
                          v-for="item in (col.editOptionsFun ? col.editOptionsFun(scope.row) : col.editOptions)"
                          :key="item.label"
                          :span="24"
                          class="text-left"
                        >
                          <a-radio :value="item.key">
                            {{ item.label }}
                          </a-radio>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                  </div>
                  <div
                    v-else-if="col.editType === 'img'"
                    v-loading="scope.row.tempLoading[col.key]"
                    element-loading-spinner="el-icon-loading mt-3"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    class="link-style-form"
                  >
                    <a-upload-dragger
                      class="dragUploader"
                      style="margin-bottom: 0;"
                      :multiple="true"
                      :action="nuclearLabApi.uploadUrl"
                      :headers="{
                        'x-token': token
                      }"
                      accept="image/*"
                      :fileList="scope.row.tempRow[col.key]"
                      @change="info => handleFormFileChange(info, scope.row.tempRow, col.key, false, () => handlePointTableRowImgSave(scope.row, col.key))"
                      @preview="file => handleImgPriview([file.uploadRes])"
                    >
                      <div v-if="!col.editImgHideUpload" class="rounded-md bg-sky-50 flex flex-col items-center pt-2 pb-2">
                        <div>
                          <span class="text-indigo-500">{{ col.imgCtrlText ? col.imgCtrlText(scope.row) : '点击上传' }}</span>
                        </div>
                      </div>
                    </a-upload-dragger>
                  </div>
                  <div
                    v-else-if="col.key === 'chkConfirm'"
                  >
                    <div>
                      <a-button
                        class="h-8 rounded-md text-sm"
                        type="primary"
                        :disabled="!(workOrderDetailModalParams.detailData.canCheck === 1 && scope.row.chkStatus === '0') ||
                          (scope.row['chkImgList'] || []).length === 0 ||
                          ((scope.row['chkJudgeList'] || []).length > 1 && (!scope.row['chkJudgeId'] || scope.row['chkJudgeId'] === 1))
                        "
                        @click="handlePointChkStatusUpdate(scope.row)"
                      >
                        确定
                      </a-button>
                    </div>
                  </div>
                  <div
                    v-else-if="col.editType === 'remarkModal'"
                    v-loading="scope.row.tempLoading[col.key]"
                    element-loading-spinner="el-icon-loading mt-3"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                  >
                    <div class="w-full flex flex-row">
                      <div class="flex-auto flex flex-row">
                        <template v-if="col.editRemarkModalConfig.statusNameKey">{{ scope.row[col.editRemarkModalConfig.statusNameKey] }}</template>
                        <template v-if="col.editRemarkModalConfig.statusNameKey && scope.row[col.editRemarkModalConfig.statusNameKey] && scope.row[col.editRemarkModalConfig.remarkKey]">，</template>
                        <template>{{ scope.row[col.editRemarkModalConfig.remarkKey] }}</template>
                      </div>
                      <div class="pl-3">
                        <a-button
                          class="h-8 rounded-md text-sm"
                          type="primary"
                          :disabled="col.disabledFun ? col.disabledFun(scope.row, col) : false"
                          @click="handleOpenEditRemarkModal(scope.row, col)"
                        >
                          编辑
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else-if="col.key === 'point' && !scope.row['point']"
                  >
                    其他意见
                  </div>
                  <div
                    v-else
                  >
                    {{ scope.row[col.key] }}
                  </div>
                </template>
              </el-table-column>
            </k-table>
          </div>
          <div
            class="flex flex-row justify-end"
          >
            <a-button
              v-if="workOrderDetailModalParams.detailData.canCheck === 1"
              class="h-10 rounded-md text-sm mt-3"
              type="primary"
              @click="handleWorkOrderSubmit"
            >
              核查提交
            </a-button>
            <a-button
              v-if="workOrderDetailModalParams.detailData.canAudit === 1"
              class="h-10 rounded-md text-sm mt-3"
              type="primary"
              @click="handleWorkOrderAuditSubmit"
            >
              审核提交
            </a-button>
            <a-button
              v-if="workOrderDetailModalParams.detailData.canReaudit === 1"
              class="h-10 rounded-md text-sm mt-3"
              type="primary"
              @click="handleWorkOrderReAuditSubmit"
            >
              复核提交
            </a-button>
          </div>
          <div v-if="!logMode" class="pt-6">
            <div class="text-sm pb-2">核查审批意见记录</div>
            <k-table
              :dataRows="workOrderDetailModalParams.detailData.logList"
              border
              :hidePage="true"
              v-loading="workOrderDetailModalParams.WorkOrderLogExportLoading"
            >
              <el-table-column prop="round" label="轮次" :align="'center'" :min-width="200">
                <div slot-scope="scope">
                  <div>{{ `第${ scope.row['round'] }次核查审批意见记录` }}</div>
                </div>
              </el-table-column>
              <el-table-column prop="updateTime" label="更新时间" :align="'center'" :min-width="180" />
              <el-table-column
                label="操作"
                :align="'center'"
                :width="250"
              >
                <div slot-scope="scope" class="flex flex-row flex-wrap gap-3 justify-center">
                  <a-button
                    class="h-8 rounded-md text-sm"
                    type="primary"
                    @click="handleWorkOrderLogExport(scope.row)"
                  >
                    输出PDF
                  </a-button>
                  <a-button
                    class="h-8 rounded-md text-sm"
                    type="primary"
                    @click="handleOpenWorkOrderLogDetail(scope.row)"
                  >
                    表单查看
                  </a-button>
                </div>
              </el-table-column>
            </k-table>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-if="editRemarkModal.show"
      :title="editRemarkModal.title"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '640px'"
      @cancel="editRemarkModal.show = false"
    >
      <div v-loading="editRemarkModal.loading">
        <div class="link-style-form" ref="editRemarkModalForm">
          <a-form-model
            :model="editRemarkModal"
            :label-col="{ span: 5 }"
            :wrapper-col="{ offset: isMobile ? 0 : 1, span: 16 }"
          >
            <a-form-model-item
              v-if="editRemarkModal['statusKey']"
              key="status"
              prop="status"
              :label="editRemarkModal.statusLabel"
            >
              <a-select
                v-model="editRemarkModal['status']"
                size="large"
                placeholder="请选择"
                allowClear
                :getPopupContainer="() => $refs.editRemarkModalForm"
                :disabled="!editRemarkModal.sourceRow.point && workOrderDetailModalParams.pointsTableRows.filter(row => !!row.point).some(row => row[editRemarkModal.statusKey] === '2')"
              >
                <a-select-option v-for="item in editRemarkModal.statusOptions" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              key="remark"
              prop="remark"
              label="说明"
            >
              <a-textarea
                v-model="editRemarkModal['remark']"
                placeholder="请输入"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
              <div class="pt-2 flex flex-row gap-20">
                <a-button
                  class="h-11 w-24 rounded-md text-base"
                  type="primary"
                  size="large"
                  @click="handlePointTableRowRemarkModalSave"
                >
                  确定
                </a-button>
                <a-button
                  class="h-11 w-24 rounded-md text-base"
                  type="primary"
                  size="large"
                  @click="editRemarkModal.show = false"
                >
                  取消
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
import { baseMixin } from '@/store/app-mixin'
import nuclearLabApi from '@/api/nuclearLab'
import KTable from '@/components/Kira/KTable'
import { mapGetters } from 'vuex'
import { downloadByStream } from '@/utils//util.js'

export default {
  name: 'WorkOrderDetail',
  mixins: [baseMixin],
  components: {
    KTable
  },
  props: {
    logMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      nuclearLabApi,
      workOrderDetailModalParams: {
        show: false,
        workOrderNo: '',
        title: '',
        modalLoading: false,
        detailData: null,
        pointsTableRows: [],
        pointsTableCols: [],
        pointsTableSpanMethod: ({ row, column, columnIndex }) => {
          if (!row.point) {
            if (columnIndex === 0) {
              return [1, 9]
            } else if (columnIndex < 9) {
              return [0, 0]
            }
          }
        },
        WorkOrderLogExportLoading: false
      },
      editRemarkModal: {
        show: false,
        loading: false,
        title: '',
        statusLabel: '',
        statusNameKey: '',
        statusKey: '',
        status: undefined,
        statusOptions: [],
        remarkKey: '',
        remark: '',
        sourceRow: null
      }
    }
  },
  computed: {
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    ...mapGetters(['token'])
  },
  methods: {
    async openWorkOrderDetailModal(rowData, globalDisabledMode) {
      this.workOrderDetailModalParams = {
        ...this.workOrderDetailModalParams,
        show: true,
        workOrderNo: rowData.workOrderNo,
        title: rowData.title,
        modalLoading: true,
        detailData: null,
        pointsTableRows: [],
        WorkOrderLogExportLoading: false
      }
      try {
        const res = this.logMode ? await nuclearLabApi.workOrderLogDetail({
          workOrderNo: rowData.workOrderNo,
          round: rowData.round,
          disable: globalDisabledMode ? 1 : undefined
        }) : await nuclearLabApi.workOrderDetail({
          workOrderNo: rowData.workOrderNo,
          disable: globalDisabledMode ? 1 : undefined
        })
        if (res && res.code === 200) {
          const detailData = res.data
          // 构造工单对象级别的可编辑上下文 S
          detailData.tempRow = {
            chkVideo: res.data.chkVideo ? [
              {
                uid: res.data.chkVideo,
                name: res.data.chkVideo.split('/').pop().replace(/-.+?\./, '.'),
                status: 'done',
                uploadRes: res.data.chkVideo
              }
            ] : []
          }
          detailData.tempLoading = {
            chkVideo: false
          }
          this.workOrderDetailModalParams.detailData = detailData
          // 构造工单对象级别的可编辑上下文 E
          const canEdit = this.workOrderDetailModalParams.detailData.canEdit === 1
          const canCheck = this.workOrderDetailModalParams.detailData.canCheck === 1
          this.workOrderDetailModalParams.pointsTableCols = [
            {
              key: 'point',
              label: '编号',
              width: 80
            },
            {
              key: 'location',
              label: '位置',
              // editType: canEdit ? 'text' : '',
              width: 100
            },
            {
              key: 'name',
              label: '名称',
              // editType: canEdit ? 'text' : '',
              width: 100
            },
            {
              key: 'prompt',
              label: '文字说明',
              // editType: canEdit ? 'text' : '',
              minWidth: 160
            },
            {
              key: 'referImgList',
              label: '参考图',
              editType: 'img',
              // editImgHideUpload: !canEdit,
              editImgHideUpload: true,
              width: 180
            },
            {
              key: 'chkRemark',
              label: '核查备注',
              editType: (canEdit || canCheck) ? 'text' : '',
              minWidth: 160
            },
            {
              key: (canEdit || canCheck) ? 'chkJudgeId' : 'chkJudgeName',
              label: '判别',
              editType: (canEdit || canCheck) ? 'radio' : '',
              editOptionsFun: (row) => {
                return (row.chkJudgeList || []).map(item => ({
                  key: item.id,
                  label: item.name
                })) || []
              },
              width: 100
            },
            {
              key: 'chkImgList',
              label: '图片',
              editType: 'img',
              editImgHideUpload: !(canEdit || canCheck),
              imgCtrlText: (row) => {
                return `点击上传（${row.chkImgNum}张）`
              },
              width: 180
            },
            {
              key: 'chkConfirm',
              label: '核查确认',
              width: 100
            },
            {
              key: 'chkAnswer',
              label: '核查回复',
              editType: 'remarkModal',
              disabledFun: (row, col) => {
                return !(this.workOrderDetailModalParams.detailData.canEdit === 1 || this.workOrderDetailModalParams.detailData[col.editRemarkModalConfig.disabledPassKey] === 1)
              },
              editRemarkModalConfig: {
                disabledPassKey: 'canCheck',
                title: '核查回复/备注',
                statusLabel: '',
                statusNameKey: '',
                statusKey: '',
                statusOptions: [],
                remarkKey: 'chkAnswer'
              },
              minWidth: 180
            },
            {
              key: 'auditRemark',
              label: '审核意见',
              editType: 'remarkModal',
              disabledFun: (row, col) => {
                return !(this.workOrderDetailModalParams.detailData.canEdit === 1 || this.workOrderDetailModalParams.detailData[col.editRemarkModalConfig.disabledPassKey] === 1)
              },
              editRemarkModalConfig: {
                disabledPassKey: 'canAudit',
                title: '审核意见',
                statusLabel: '审核',
                statusNameKey: 'auditStatusName',
                statusKey: 'auditStatus',
                statusOptions: Object.entries(this.codeDict.work_order_point.auditStatus).map(([key, value]) => (
                  {
                    key,
                    value
                  }
                )),
                remarkKey: 'auditRemark'
              },
              width: 180
            },
            {
              key: 'reauditRemark',
              label: '复核意见',
              editType: 'remarkModal',
              disabledFun: (row, col) => {
                return !(this.workOrderDetailModalParams.detailData.canEdit === 1 || this.workOrderDetailModalParams.detailData[col.editRemarkModalConfig.disabledPassKey] === 1)
              },
              editRemarkModalConfig: {
                disabledPassKey: 'canReaudit',
                title: '复核意见',
                statusLabel: '复核',
                statusNameKey: 'reauditStatusName',
                statusKey: 'reauditStatus',
                statusOptions: Object.entries(this.codeDict.work_order_point.reauditStatus).map(([key, value]) => (
                  {
                    key,
                    value
                  }
                )),
                remarkKey: 'reauditRemark'
              },
              width: 180
            }
          ]
          this.workOrderDetailModalParams.pointsTableRows = (res.data.pointList || []).map((defaultRowData) => {
            return this.generatePointTableRow({
              ...defaultRowData
            })
          }).concat(this.generatePointTableRow({
            chkAnswer: detailData.chkAnswer,
            auditStatusName: detailData.auditStatusName,
            auditStatus: detailData.auditStatus,
            auditRemark: detailData.auditRemark,
            reauditStatusName: detailData.reauditStatusName,
            reauditStatus: detailData.reauditStatus,
            reauditRemark: detailData.reauditRemark
          }))
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.workOrderDetailModalParams.modalLoading = false
    },
    generatePointTableRow(defaultRowData = {}) {
      const newRow = {
        localId: defaultRowData.id || defaultRowData.localId || Math.random(),
        ...defaultRowData,
        tempRow: {},
        tempLoading: {}
      }
      this.workOrderDetailModalParams.pointsTableCols.map(col => {
        if (col.editType === 'text' || col.editType === 'number') {
          newRow[col.key] = newRow[col.key] || ''
          newRow.tempRow[col.key] = newRow[col.key]
          newRow.tempLoading[col.key] = false
        } else if (col.editType === 'multiSelect') {
          newRow[col.key] = newRow[col.key] || []
          newRow.tempRow[col.key] = newRow[col.key]
          newRow.tempLoading[col.key] = false
        } else if (col.editType === 'radio') {
          newRow[col.key] = newRow[col.key] || undefined
          newRow.tempRow[col.key] = newRow[col.key]
          newRow.tempLoading[col.key] = false
        } else if (col.editType === 'img') {
          newRow[col.key] = newRow[col.key] || []
          newRow.tempRow[col.key] = newRow[col.key].map(name => ({
            uid: name,
            name: name.split('/').pop().replace(/-.+?\./, '.'),
            status: 'done',
            uploadRes: name
          }))
          newRow.tempLoading[col.key] = false
        }
      })
      return newRow
    },
    async pointTableRowReqSave(curRow, colKey) {
      const curRowKeyValue = colKey === 'chkVideo' ? (curRow[colKey][0] || '') : curRow[colKey]
      if (this.workOrderDetailModalParams.detailData.canEdit === 1) {
        await nuclearLabApi.workOrderUpdateInfoById(this.workOrderDetailModalParams.workOrderNo, curRow.point ? {
          pointList: [
            {
              point: curRow.point,
              [colKey]: curRowKeyValue
            }
          ]
        } : {
          [colKey]: curRowKeyValue
        })
      } else if (this.workOrderDetailModalParams.detailData.canCheck === 1) {
        curRow.point ? await nuclearLabApi.workOrderCheck({
          workOrderNo: this.workOrderDetailModalParams.workOrderNo,
          point: curRow.point,
          [colKey]: curRowKeyValue
        }) : await nuclearLabApi.workOrderBatchCheckPoint({
          workOrderNo: this.workOrderDetailModalParams.workOrderNo,
          [colKey]: curRowKeyValue
        })
      }
    },
    async handlePointTableRowInputSave(curRow, colKey) {
      curRow[colKey] = curRow.tempRow[colKey]
      curRow.tempLoading[colKey] = true
      await this.pointTableRowReqSave(curRow, colKey)
      curRow.tempLoading[colKey] = false
      this.$emit('reloadWorkOrderList')
    },
    async handlePointTableRowCheckboxSave(curRow, colKey) {
      curRow[colKey] = curRow.tempRow[colKey]
      curRow.tempLoading[colKey] = true
      await this.pointTableRowReqSave(curRow, colKey)
      curRow.tempLoading[colKey] = false
      this.$emit('reloadWorkOrderList')
    },
    handleImgPriview(src) {
      this.$emit('imgPriview', src)
    },
    handleFormFileChange(info, formObj, itemKey, single, updateCallback, showFullLoading, curRow) {
      if (showFullLoading) {
        curRow.tempLoading[itemKey] = true
      }
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.uploadRes = file.response.data.url
        }
        return file
      })
      formObj[itemKey] = fileList
      if (updateCallback) updateCallback()
    },
    async handlePointTableRowImgSave(curRow, colKey) {
      const isAllFileDone = curRow.tempRow[colKey].every(file => file.status === 'done')
      if (!isAllFileDone) return
      curRow[colKey] = curRow.tempRow[colKey].map(file => file.uploadRes)
      curRow.tempLoading[colKey] = true
      await this.pointTableRowReqSave(curRow, colKey)
      curRow.tempLoading[colKey] = false
      this.$emit('reloadWorkOrderList')
    },
    handleOpenEditRemarkModal(row, col) {
      const editRemarkModalConfig = col.editRemarkModalConfig
      this.editRemarkModal = {
        show: true,
        loading: false,
        title: editRemarkModalConfig.title,
        statusLabel: editRemarkModalConfig.statusLabel,
        statusNameKey: editRemarkModalConfig.statusNameKey,
        statusKey: editRemarkModalConfig.statusKey,
        statusOptions: editRemarkModalConfig.statusOptions,
        remarkKey: editRemarkModalConfig.remarkKey,
        status: row[editRemarkModalConfig.statusKey],
        remark: row[editRemarkModalConfig.remarkKey],
        sourceRow: row
      }
    },
    async handlePointTableRowRemarkModalSave() {
      this.editRemarkModal.loading = true
      const curRow = this.editRemarkModal.sourceRow
      const formChangeParams = {
        ...(this.editRemarkModal.statusKey ? {
          [this.editRemarkModal.statusKey]: this.editRemarkModal.status
        } : {}),
        [this.editRemarkModal.remarkKey]: this.editRemarkModal.remark
      }
      if (this.workOrderDetailModalParams.detailData.canEdit === 1) {
        await nuclearLabApi.workOrderUpdateInfoById(this.workOrderDetailModalParams.workOrderNo, curRow.point ? {
          pointList: [
            {
              point: curRow.point,
              ...formChangeParams
            }
          ]
        } : {
          ...formChangeParams
        })
      } else if (this.workOrderDetailModalParams.detailData.canCheck === 1) {
        curRow.point ? await nuclearLabApi.workOrderCheck({
          workOrderNo: this.workOrderDetailModalParams.workOrderNo,
          point: curRow.point,
          ...formChangeParams
        }) : await nuclearLabApi.workOrderBatchCheckPoint({
          workOrderNo: this.workOrderDetailModalParams.workOrderNo,
          ...formChangeParams
        })
      } else if (this.workOrderDetailModalParams.detailData.canAudit === 1) {
        curRow.point ? await nuclearLabApi.workOrderUpdateAuditPoint({
          workOrderNo: this.workOrderDetailModalParams.workOrderNo,
          point: curRow.point,
          ...formChangeParams
        }) : await nuclearLabApi.workOrderUpdateAudit({
          workOrderNo: this.workOrderDetailModalParams.workOrderNo,
          ...formChangeParams
        })
        if (curRow.point && this.editRemarkModal.status === '2') {
          await nuclearLabApi.workOrderUpdateAudit({
            workOrderNo: this.workOrderDetailModalParams.workOrderNo,
            [this.editRemarkModal.statusKey]: '2'
          })
        }
      } else if (this.workOrderDetailModalParams.detailData.canReaudit === 1) {
        curRow.point ? await nuclearLabApi.workOrderUpdateReAuditPoint({
          workOrderNo: this.workOrderDetailModalParams.workOrderNo,
          point: curRow.point,
          ...formChangeParams
        }) : await nuclearLabApi.workOrderUpdateReAudit({
          workOrderNo: this.workOrderDetailModalParams.workOrderNo,
          ...formChangeParams
        })
        if (curRow.point && this.editRemarkModal.status === '2') {
          await nuclearLabApi.workOrderUpdateReAudit({
            workOrderNo: this.workOrderDetailModalParams.workOrderNo,
            [this.editRemarkModal.statusKey]: '2'
          })
        }
      }
      this.editRemarkModal.loading = false
      this.editRemarkModal.show = false
      if (this.editRemarkModal.statusKey) {
        const curStatusObj = this.editRemarkModal.statusOptions.find(item => item.key === this.editRemarkModal.status)
        this.editRemarkModal.sourceRow[this.editRemarkModal.statusKey] = this.editRemarkModal.status
        this.editRemarkModal.sourceRow[this.editRemarkModal.statusNameKey] = curStatusObj ? curStatusObj.value : ''
        if (curRow.point && this.editRemarkModal.status === '2') {
          this.workOrderDetailModalParams.pointsTableRows.find(row => !row.point)[this.editRemarkModal.statusKey] = '2'
          this.workOrderDetailModalParams.pointsTableRows.find(row => !row.point)[this.editRemarkModal.statusNameKey] = curStatusObj ? curStatusObj.value : ''
        }
      }
      this.editRemarkModal.sourceRow[this.editRemarkModal.remarkKey] = this.editRemarkModal.remark
      this.$emit('reloadWorkOrderList')
    },
    handlePointChkStatusUpdate(curRow) {
      if (curRow['chkJudgeList'].length > 1 && !curRow['chkJudgeId']) {
        this.$message.info('未核查完')
        return
      }
      if (curRow['chkImgNum'] && curRow['chkImgNum'] !== curRow['chkImgList'].length) {
        this.$message.info('未核查完')
        return
      }
      this.$confirm({
        title: '提示',
        content: `确定核查确认?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await nuclearLabApi.workOrderCheck({
              workOrderNo: this.workOrderDetailModalParams.workOrderNo,
              point: curRow.point,
              chkStatus: '1'
            })
            if (res && res.code === 200) {
              this.$message.success('成功')
              curRow.chkStatus = '1'
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
    handleWorkOrderSubmit() {
      const allChkStatusOk = this.workOrderDetailModalParams.pointsTableRows.filter(row => !!row.point).every(row => row.chkStatus === '1')
      if (!allChkStatusOk) {
        this.$message.info('点位未核查完成')
        return
      }
      this.$confirm({
        title: '提示',
        content: `确定核查提交?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await nuclearLabApi.workOrderSubmit({
              workOrderNo: this.workOrderDetailModalParams.workOrderNo
            })
            if (res && res.code === 200) {
              await nuclearLabApi.accessLogCreate({
                action: this.workOrderDetailModalParams.workOrderNo,
                detail: '核查完成',
                page: '表单核查审批界面',
                remark: ''
              })
              this.$message.success('提交成功')
              this.$emit('reloadWorkOrderList')
              this.workOrderDetailModalParams.show = false
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
    handleWorkOrderAuditSubmit() {
      const allAuditStatusSelected = this.workOrderDetailModalParams.pointsTableRows.every(row => row.auditStatus === '1' || row.auditStatus === '2')
      if (!allAuditStatusSelected) {
        this.$message.info('点位未审核完成')
        return
      }
      this.$confirm({
        title: '提示',
        content: `确定审核提交?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await nuclearLabApi.workOrderUpdateAuditSubmitById(this.workOrderDetailModalParams.workOrderNo)
            if (res && res.code === 200) {
              await nuclearLabApi.accessLogCreate({
                action: this.workOrderDetailModalParams.workOrderNo,
                detail: '审核完成',
                page: '表单核查审批界面',
                remark: ''
              })
              this.$message.success('提交成功')
              this.$emit('reloadWorkOrderList')
              this.workOrderDetailModalParams.show = false
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
    handleWorkOrderReAuditSubmit() {
      const allReAuditStatusSelected = this.workOrderDetailModalParams.pointsTableRows.every(row => row.reauditStatus === '1' || row.reauditStatus === '2')
      if (!allReAuditStatusSelected) {
        this.$message.info('点位未复核完成')
        return
      }
      this.$confirm({
        title: '提示',
        content: `确定复核提交?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await nuclearLabApi.workOrderUpdateReAuditSubmitById(this.workOrderDetailModalParams.workOrderNo)
            if (res && res.code === 200) {
              await nuclearLabApi.accessLogCreate({
                action: this.workOrderDetailModalParams.workOrderNo,
                detail: '复核完成',
                page: '表单核查审批界面',
                remark: ''
              })
              this.$message.success('提交成功')
              this.$emit('reloadWorkOrderList')
              this.workOrderDetailModalParams.show = false
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
    async handleWorkOrderLogExport(row) {
      this.workOrderDetailModalParams.WorkOrderLogExportLoading = true
      const res = await nuclearLabApi.workOrderLogExport({
        workOrderNo: this.workOrderDetailModalParams.workOrderNo,
        round: row.round
      })
      downloadByStream(res, `${this.workOrderDetailModalParams.workOrderNo}_第${ row['round'] }次核查审批意见记录.pdf`)
      this.workOrderDetailModalParams.WorkOrderLogExportLoading = false
    },
    async handleOpenWorkOrderLogDetail(row) {
      this.$emit('openWorkOrderLogDetail', row)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
