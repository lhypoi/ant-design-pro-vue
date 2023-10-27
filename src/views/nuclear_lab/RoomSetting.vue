<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-5 sm:p-8">
    <div class="flex flex-row">
      <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
        <a-form-model
          :model="formData"
        >
          <div class="flex flex-row items-start gap-4 overflow-x-auto">
            <a-form-model-item key="keyword" prop="keyword" class="flex-auto min-w-[170px]">
              <a-input
                v-model="formData.keyword"
                placeholder="请输入机房名称"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="roomId" prop="roomId" class="flex-auto min-w-[170px]">
              <a-input
                v-model="formData.roomId"
                placeholder="请输入机房编号"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-button
              class="h-11 rounded-md text-base"
              type="primary"
              icon="search"
              size="large"
              @click="handleSearch"
            >
              查询
            </a-button>
            <a-button
              class="h-11 rounded-md text-base"
              type="primary"
              icon="search"
              size="large"
              @click="handleOpenRoomModal"
            >
              新增机房
            </a-button>
          </div>
        </a-form-model>
      </div>
    </div>
    <div class="flex-auto h-0">
      <k-table
        ref="table"
        :data="(params) => getUserLoginLog(params)"
        border
        height="100%"
        class="h-full"
      >
        <el-table-column prop="id" label="编号" :align="'center'" width="60" />
        <el-table-column prop="name" label="机房名" :align="'center'" min-width="160" />
        <el-table-column prop="userName" label="创建人" :align="'center'" min-width="100" />
        <el-table-column prop="createTime" label="创建时间" :align="'center'" min-width="160" />
        <el-table-column label="模型url" :align="'center'" width="200">
          <div
            slot-scope="scope"
            v-loading="scope.row.tempRow['urlLoading']"
            element-loading-spinner="el-icon-loading mt-3"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <a-input
              v-model="scope.row.tempRow['url']"
              @blur="handleTableTempRowInputSave(scope.row, 'url', 'urlLoading')"
            />
          </div>
        </el-table-column>
        <el-table-column label="机房图" :align="'center'" min-width="160">
          <div
            slot-scope="scope"
            class="flex flex-row gap-5 justify-center"
            v-loading="scope.row.tempRow['imgUploading']"
            element-loading-spinner="el-icon-loading mt-3"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <div class="cursor-pointer text-blue-400" @click="handleImgPriview([scope.row['img']])">
              查看
            </div>
            <div class="cursor-pointer text-blue-400" @click="$refs[`tableTempRow_${scope.row.id}_img`].click()">
              上传
            </div>
            <div class="w-0 h-0 overflow-hidden absolute">
              <a-upload-dragger
                :multiple="true"
                :action="nuclearLabApi.uploadUrl"
                :headers="{
                  'x-token': token
                }"
                :fileList="scope.row.tempRow['img']"
                @change="info => handleTableTempRowFileChange(info, scope.row, 'img', 'imgUploading', true)"
              >
                <div :ref="`tableTempRow_${scope.row.id}_img`" ></div>
              </a-upload-dragger>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="机房点位图" :align="'center'" min-width="160">
          <div
            slot-scope="scope"
            class="flex flex-row gap-5 justify-center"
            v-loading="scope.row.tempRow['pointImgUploading']"
            element-loading-spinner="el-icon-loading mt-3"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <div class="cursor-pointer text-blue-400" @click="handleImgPriview([scope.row['pointImg']])">
              查看
            </div>
            <div class="cursor-pointer text-blue-400" @click="$refs[`tableTempRow_${scope.row.id}_pointImg`].click()">
              上传
            </div>
            <div class="w-0 h-0 overflow-hidden absolute">
              <a-upload-dragger
                :multiple="true"
                :action="nuclearLabApi.uploadUrl"
                :headers="{
                  'x-token': token
                }"
                :fileList="scope.row.tempRow['pointImg']"
                @change="info => handleTableTempRowFileChange(info, scope.row, 'pointImg', 'pointImgUploading', true)"
              >
                <div :ref="`tableTempRow_${scope.row.id}_pointImg`" ></div>
              </a-upload-dragger>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="备注" :align="'center'" width="200">
          <div
            slot-scope="scope"
            v-loading="scope.row.tempRow['remarkLoading']"
            element-loading-spinner="el-icon-loading mt-3"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <a-input
              v-model="scope.row.tempRow['remark']"
              @blur="handleTableTempRowInputSave(scope.row, 'remark', 'remarkLoading')"
            />
          </div>
        </el-table-column>
        <el-table-column label="操作" :align="'center'" width="260">
          <div slot-scope="scope" class="flex flex-row gap-4 justify-center">
            <a-button
              class="h-8 rounded-md text-sm"
              type="primary"
              @click="handleOpenPointModal(scope.row)"
            >
              机房点位修改
            </a-button>
            <a-button
              class="h-8 rounded-md text-sm"
              type="danger"
              @click="handleRoomDelete(scope.row)"
            >
              数据删除
            </a-button>
          </div>
        </el-table-column>
      </k-table>
    </div>
    <el-image
      v-if="imgPreviewParams.src.length"
      ref="imgPreview"
      class="w-0 h-0 overflow-hidden"
      lazy
      :src="imgPreviewParams.src[0]"
      :preview-src-list="imgPreviewParams.src"
    />
    <a-modal
      v-if="roomModalParams.show"
      :title="'新增机房'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '640px'"
      @cancel="roomModalParams.show = false"
    >
      <div class="pt-4">
        <div class="link-style-form">
          <a-form-model
            ref="roomModalForm"
            :model="roomModalParams.formData"
            :rules="roomModalParams.formRules"
            :label-col="{ span: 5 }"
            :wrapper-col="{ offset: isMobile ? 0 : 1, span: 16 }"
          >
            <a-form-model-item key="name" prop="name" label="机房名">
              <a-input
                v-model="roomModalParams.formData.name"
                placeholder="请输入"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="img" prop="img" label="机房图">
              <a-upload-dragger
                class="dragUploader"
                :multiple="true"
                :action="nuclearLabApi.uploadUrl"
                :headers="{
                  'x-token': token
                }"
                accept="image/*"
                :fileList="roomModalParams.formData.img"
                @change="info => handleFormFileChange(info, roomModalParams.formData, 'img', true)"
                @preview="file => handleImgPriview([file.uploadRes])"
              >
                <div class="rounded-md bg-sky-50 flex flex-col items-center pt-2 pb-2">
                  <div>
                    <span class="text-indigo-500">点击上传</span>
                  </div>
                </div>
              </a-upload-dragger>
            </a-form-model-item>
            <a-form-model-item key="pointImg" prop="pointImg" label="机房点位图">
              <a-upload-dragger
                class="dragUploader"
                :multiple="true"
                :action="nuclearLabApi.uploadUrl"
                :headers="{
                  'x-token': token
                }"
                accept="image/*"
                :fileList="roomModalParams.formData.pointImg"
                @change="info => handleFormFileChange(info, roomModalParams.formData, 'pointImg', true)"
                @preview="file => handleImgPriview([file.uploadRes])"
              >
                <div class="rounded-md bg-sky-50 flex flex-col items-center pt-2 pb-2">
                  <div>
                    <span class="text-indigo-500">点击上传</span>
                  </div>
                </div>
              </a-upload-dragger>
            </a-form-model-item>
            <a-form-model-item key="pointList" prop="pointList" label="点位映射">
              <a-button
                class="h-8 rounded-md text-sm"
                type="primary"
                @click="handleOpenPointModal(roomModalParams.formData)"
              >
                机房点位设置
              </a-button>
            </a-form-model-item>
            <a-form-model-item key="url" prop="url" label="模型url">
              <a-input
                v-model="roomModalParams.formData.url"
                placeholder="请输入"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="remark" prop="remark" label="备注">
              <a-input
                v-model="roomModalParams.formData.remark"
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
                  :loading="roomModalParams.submitting"
                  @click="handleRoomModalFormUpdate"
                >
                  保存
                </a-button>
              </div>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-if="pointModalParams.show"
      :title="pointModalParams.roomId ? '机房点位修改' : '机房点位设置'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1300px'"
      @cancel="pointModalParams.show = false"
    >
      <div class="pt-4" v-loading="pointModalParams.loading">
        <div>
          <k-table
            :dataRows="pointModalParams.rows"
            border
            :hidePage="true"
          >
            <el-table-column
              v-for="col in pointModalParams.cols"
              :key="col.key"
              :prop="col.key"
              :label="col.label"
              :align="'center'"
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
                    @blur="handlePointModalTableRowInputSave(scope.row, col.key)"
                  />
                </div>
                <div
                  v-if="col.editType === 'number'"
                  v-loading="scope.row.tempLoading[col.key]"
                  element-loading-spinner="el-icon-loading mt-3"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                  <a-input-number
                    v-model="scope.row.tempRow[col.key]"
                    :disabled="col.disabledFun ? col.disabledFun(scope.row) : false"
                    @blur="handlePointModalTableRowInputSave(scope.row, col.key)"
                  />
                </div>
                <div
                  v-else-if="col.editType === 'multiSelect'"
                  v-loading="scope.row.tempLoading[col.key]"
                  element-loading-spinner="el-icon-loading mt-3"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                  <a-checkbox-group
                    v-model="scope.row.tempRow[col.key]"
                    @change="handlePointModalTableRowCheckboxSave(scope.row, col.key)"
                  >
                    <a-row>
                      <a-col
                        v-for="item in col.editOptions"
                        :key="item.label"
                        :span="8"
                        class="text-left"
                      >
                        <a-checkbox :value="item.key">
                          {{ item.label }}
                        </a-checkbox>
                      </a-col>
                    </a-row>
                  </a-checkbox-group>
                </div>
                <div
                  v-else-if="col.editType === 'radio'"
                  v-loading="scope.row.tempLoading[col.key]"
                  element-loading-spinner="el-icon-loading mt-3"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                  <a-radio-group
                    v-model="scope.row.tempRow[col.key]"
                    @change="handlePointModalTableRowCheckboxSave(scope.row, col.key)"
                  >
                    <a-row>
                      <a-col
                        v-for="item in col.editOptions"
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
                    @change="info => handleFormFileChange(info, scope.row.tempRow, col.key, false, () => handlePointModalTableRowImgSave(scope.row, col.key))"
                    @preview="file => handleImgPriview([file.uploadRes])"
                  >
                    <div class="rounded-md bg-sky-50 flex flex-col items-center pt-2 pb-2">
                      <div>
                        <span class="text-indigo-500">点击上传</span>
                      </div>
                    </div>
                  </a-upload-dragger>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              :align="'center'"
              :width="100"
            >
              <div slot-scope="scope">
                <a-button
                  class="h-8 rounded-md text-sm"
                  type="danger"
                  @click="handlePointModalTableDeleteRow(scope.row)"
                >
                  删除
                </a-button>
              </div>
            </el-table-column>
          </k-table>
        </div>
        <div class="pt-3 flex flex-row justify-end">
          <a-button
            class="h-8 rounded-md text-sm"
            type="primary"
            @click="handlePointModalTableAddRow"
          >
            新增点位
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import nuclearLabApi from '@/api/nuclearLab'
import KTable from '@/components/Kira/KTable'
import { mapGetters } from 'vuex'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'LoginLog',
  mixins: [baseMixin],
  components: {
    KTable
  },
  data() {
    return {
      nuclearLabApi,
      formData: {
        keyword: '',
        roomId: ''
      },
      imgPreviewParams: {
        src: []
      },
      roomModalParams: {
        show: false,
        submitting: false,
        formData: {
          name: '',
          img: [],
          pointImg: [],
          pointList: [],
          url: '',
          remark: ''
        },
        formRules: {
          name: [
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
          img: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请上传'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          pointImg: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请上传'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          url: [
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
          ]
        }
      },
      pointModalParams: {
        show: false,
        loading: false,
        roomId: '',
        cols: [
          {
            key: 'point',
            label: '编号',
            editType: 'number',
            disabledFun: (row) => {
              return !!row.id
            },
            width: 120
          },
          {
            key: 'location',
            label: '位置',
            editType: 'text',
            width: 100
          },
          {
            key: 'name',
            label: '名称',
            editType: 'text',
            width: 100
          },
          {
            key: 'prompt',
            label: '文字说明',
            editType: 'text',
            minWidth: 160
          },
          {
            key: 'referImgList',
            label: '参考图',
            editType: 'img',
            width: 180
          },
          {
            key: 'judgeIdList',
            label: '判别',
            editType: 'radio',
            editOptions: [
              {
                key: [2],
                label: '无'
              },
              {
                key: [1, 3, 4],
                label: '未判别 正常 异常'
              },
              {
                key: [1, 5, 6],
                label: '未判别 符合 不符合'
              }
            ],
            width: 180
          },
          {
            key: 'imgList',
            label: '图片',
            editType: 'img',
            width: 180
          },
          {
            key: 'chkImgNum',
            label: '核查图片数量',
            editType: 'number',
            width: 120
          }
        ],
        rows: []
      }
    }
  },
  computed: {
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    ...mapGetters(['token'])

  },
  created() {
  },
  async mounted() {
  },
  methods: {
    async getUserLoginLog(params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const res = await nuclearLabApi.roomList({
          keyword: this.formData.keyword,
          roomId: this.formData.roomId,
          pageNum: params.pageNum,
          pageSize: params.pageSize
        })
        if (res && res.code === 200) {
          tableData.rows = res.data.list.map(row => ({
            ...row,
            tempRow: {
              img: row.img ? [row.img].map(name => ({
                uid: name,
                name: name,
                status: 'done',
                uploadRes: name
              })) : [],
              imgUploading: false,
              pointImg: row.pointImg ? [row.pointImg].map(name => ({
                uid: name,
                name: name,
                status: 'done',
                uploadRes: name
              })) : [],
              pointImgUploading: false,
              url: row.url || '',
              urlLoading: false,
              remark: row.remark || '',
              remarkLoading: false
            }
          }))
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
    handleSearch() {
      this.$refs.table.refresh()
    },
    handleImgPriview(src) {
      this.imgPreviewParams.src = src
      this.$nextTick(() => {
        this.$refs.imgPreview.clickHandler()
      })
    },
    handleTableTempRowFileChange(info, row, colKey, loadingKey, single) {
      row.tempRow[loadingKey] = true
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.uploadRes = file.response.data.url
          // 当前表格只有单文件列，直接走回调
          row[colKey] = file.uploadRes
          this.handleTableTempRowFileSave(row, colKey, loadingKey)
        }
        return file
      })
      row.tempRow[colKey] = fileList
    },
    async handleTableTempRowFileSave(row, colKey, loadingKey) {
      await nuclearLabApi.roomUpdateById(row.id, {
        [colKey]: row[colKey]
      })
      nuclearLabApi.accessLogCreate({
        action: `${row.name}-上传`,
        detail: '',
        page: this.$route.meta.title,
        remark: ''
      })
      row.tempRow[loadingKey] = false
    },
    async handleTableTempRowInputSave(row, colKey, loadingKey) {
      if (row.tempRow[colKey] === row[colKey]) return
      row.tempRow[loadingKey] = true
      row[colKey] = row.tempRow[colKey]
      await nuclearLabApi.roomUpdateById(row.id, {
        [colKey]: row[colKey]
      })
      row.tempRow[loadingKey] = false
    },
    handleOpenRoomModal() {
      this.roomModalParams = {
        ...this.roomModalParams,
        show: true,
        submitting: false,
        formData: {
          name: '',
          img: [],
          pointImg: [],
          pointList: [],
          url: '',
          remark: ''
        }
      }
    },
    handleFormFileChange(info, formObj, itemKey, single, updateCallback) {
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
    async handleRoomModalFormUpdate() {
      try {
        await this.$refs.roomModalForm.validate()
      } catch {
        this.$message.error('提交信息不符合要求，请检查')
        return
      }
      this.roomModalParams.submitting = true
      try {
        const params = {
          name: this.roomModalParams.formData.name,
          img: this.roomModalParams.formData.img[0].uploadRes,
          pointImg: this.roomModalParams.formData.pointImg[0].uploadRes,
          pointList: this.roomModalParams.formData.pointList || [],
          url: this.roomModalParams.formData.url,
          remark: this.roomModalParams.formData.remark
        }
        const res = await nuclearLabApi.roomCreate(params)
        nuclearLabApi.accessLogCreate({
          action: `创建机房`,
          detail: this.roomModalParams.formData.name,
          page: this.$route.meta.title,
          remark: ''
        })
        if (res && res.code === 200) {
          this.$message.success('保存成功')
          this.roomModalParams.show = false
          this.handleSearch()
        } else {
          throw new Error(res.message || '保存失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.roomModalParams.submitting = false
    },
    async handlePointModalTableAddRow() {
      const lastRowPoint = this.pointModalParams.rows.length ? this.pointModalParams.rows[this.pointModalParams.rows.length - 1].point : '0'
      const newRow = this.generatePointModalTableRow({
        point: !isNaN(lastRowPoint) ? (Number(lastRowPoint) + 1) : (lastRowPoint + '_copy'),
        name: '-',
        prompt: '-',
        judgeIdList: this.pointModalParams.cols.find(col => col.key === 'judgeIdList').editOptions[0].key
      })
      this.pointModalParams.rows.push(newRow)
      if (!this.pointModalParams.roomId) {
        this.roomModalParams.formData.pointList.push({
          localId: newRow.localId,
          ...this.pointModalParams.cols.reduce((pointObj, col) => Object.assign(pointObj, { [col.key]: newRow[col.key] }), {})
        })
      } else {
        this.pointModalParams.loading = true
        await nuclearLabApi.pointCreate({
          roomId: this.pointModalParams.roomId,
          ...this.pointModalParams.cols.reduce((pointObj, col) => Object.assign(pointObj, { [col.key]: newRow[col.key] }), {})
        })
        nuclearLabApi.accessLogCreate({
          action: `${this.pointModalParams.sourceRoomRow.name}-机房点位修改`,
          detail: '',
          page: this.$route.meta.title,
          remark: ''
        })
        this.handleOpenPointModal({
          ...this.pointModalParams.sourceRoomRow,
          id: this.pointModalParams.roomId,
          pointList: this.pointModalParams.rows
        })
        this.pointModalParams.loading = false
      }
    },
    generatePointModalTableRow(defaultRowData = {}) {
      const newRow = {
        localId: defaultRowData.id || defaultRowData.localId || Math.random(),
        ...defaultRowData,
        tempRow: {},
        tempLoading: {}
      }
      this.pointModalParams.cols.map(col => {
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
    async handlePointModalTableDeleteRow(curRow) {
      this.$confirm({
        title: '警告',
        content: `确定删除该点位吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            this.pointModalParams.rows = this.pointModalParams.rows.filter(row => row.localId !== curRow.localId)
            if (!this.pointModalParams.roomId) {
              this.roomModalParams.formData.pointList = this.roomModalParams.formData.pointList.filter(row => row.localId !== curRow.localId)
            } else {
              this.pointModalParams.loading = true
              await nuclearLabApi.pointDeleteById(curRow.id)
              nuclearLabApi.accessLogCreate({
                action: `${this.pointModalParams.sourceRoomRow.name}-机房点位修改`,
                detail: '',
                page: this.$route.meta.title,
                remark: ''
              })
              this.pointModalParams.loading = false
            }
            this.$message.success('删除成功')
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    async handleRoomDelete(curRow) {
      this.$confirm({
        title: '警告',
        content: `确定删除该数据吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            this.$refs.table.localLoading = true
            await nuclearLabApi.roomDeleteById(curRow.id)
            nuclearLabApi.accessLogCreate({
              action: `${curRow.name}-数据删除`,
              detail: '',
              page: this.$route.meta.title,
              remark: ''
            })
            this.$refs.table.localLoading = false
            this.$message.success('删除成功')
            this.handleSearch()
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    async handleOpenPointModal(roomForm) {
      const defaultRowDatas = roomForm.pointList || []
      this.pointModalParams = {
        ...this.pointModalParams,
        show: true,
        loading: !!roomForm.id,
        roomId: roomForm.id || '',
        rows: defaultRowDatas.map((defaultRowData) => this.generatePointModalTableRow(defaultRowData)),
        sourceRoomRow: roomForm.id ? roomForm : null
      }
      if (roomForm.id) {
        try {
          const res = await nuclearLabApi.roomInfo({
            roomId: roomForm.id
          })
          this.pointModalParams = {
            ...this.pointModalParams,
            loading: false,
            rows: res.data.points.map((defaultRowData) => {
              const judgeIdListTxt = defaultRowData.judgeList ? JSON.stringify(defaultRowData.judgeList.map(item => item.id)) : null
              const judgeIdListOption = this.pointModalParams.cols.find(col => col.key === 'judgeIdList').editOptions.find(option => JSON.stringify(option.key) === judgeIdListTxt)
              return this.generatePointModalTableRow({
                ...defaultRowData,
                judgeIdList: judgeIdListOption ? judgeIdListOption.key : undefined
              })
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    async handlePointModalTableRowInputSave(curRow, colKey) {
      if (curRow[colKey] === curRow.tempRow[colKey]) return
      curRow[colKey] = curRow.tempRow[colKey]
      if (!this.pointModalParams.roomId) {
        const roomModalFormPonitsRow = this.roomModalParams.formData.pointList.find(row => row.localId === curRow.localId)
        roomModalFormPonitsRow[colKey] = curRow[colKey]
      } else {
        curRow.tempLoading[colKey] = true
        await nuclearLabApi.pointUpdateById(curRow.id, {
          [colKey]: curRow[colKey]
        })
        nuclearLabApi.accessLogCreate({
          action: `${this.pointModalParams.sourceRoomRow.name}-机房点位修改`,
          detail: '',
          page: this.$route.meta.title,
          remark: ''
        })
        curRow.tempLoading[colKey] = false
      }
    },
    async handlePointModalTableRowCheckboxSave(curRow, colKey) {
      curRow[colKey] = curRow.tempRow[colKey]
      if (!this.pointModalParams.roomId) {
        const roomModalFormPonitsRow = this.roomModalParams.formData.pointList.find(row => row.localId === curRow.localId)
        roomModalFormPonitsRow[colKey] = curRow[colKey]
      } else {
        curRow.tempLoading[colKey] = true
        await nuclearLabApi.pointUpdateById(curRow.id, {
          [colKey]: curRow[colKey]
        })
        nuclearLabApi.accessLogCreate({
          action: `${this.pointModalParams.sourceRoomRow.name}-机房点位修改`,
          detail: '',
          page: this.$route.meta.title,
          remark: ''
        })
        curRow.tempLoading[colKey] = false
      }
    },
    async handlePointModalTableRowImgSave(curRow, colKey) {
      const isAllFileDone = curRow.tempRow[colKey].every(file => file.status === 'done')
      if (!isAllFileDone) return
      curRow[colKey] = curRow.tempRow[colKey].map(file => file.uploadRes)
      if (!this.pointModalParams.roomId) {
        const roomModalFormPonitsRow = this.roomModalParams.formData.pointList.find(row => row.localId === curRow.localId)
        roomModalFormPonitsRow[colKey] = curRow[colKey]
      } else {
        curRow.tempLoading[colKey] = true
        await nuclearLabApi.pointUpdateById(curRow.id, {
          [colKey]: curRow[colKey]
        })
        nuclearLabApi.accessLogCreate({
          action: `${this.pointModalParams.sourceRoomRow.name}-机房点位修改`,
          detail: '',
          page: this.$route.meta.title,
          remark: ''
        })
        curRow.tempLoading[colKey] = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
