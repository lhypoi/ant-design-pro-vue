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
            >
              机房点位修改
            </a-button>
            <a-button
              class="h-8 rounded-md text-sm"
              type="danger"
              @click="delete1(scope)"
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
    <!-- <a-modal :visible="true">
      <video width="640" height="360" controls>
        <source src="https://bw-nrl.oss-cn-shenzhen.aliyuncs.com/nrl/file/20231010/uc-berkely-phd-math-a86c89a918104ec3.mp4" type="video/mp4">
        您的浏览器不支持 HTML5 视频播放器，请升级浏览器。
      </video>
    </a-modal> -->
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
          pointList: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请设置'))
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
        roomId: '',
        cols: [
          {
            key: 'point',
            label: '编号',
            edit: true,
            editType: 'text',
            width: 80
          },
          {
            key: 'location',
            label: '位置',
            edit: true,
            editType: 'text',
            width: 200
          },
          {
            key: 'judgeIdList',
            label: '判别选项',
            edit: true,
            editType: 'multiSelect',
            editOptions: [
              {
                key: '未判别',
                label: '未判别'
              },
              {
                key: '正常',
                label: '正常'
              },
              {
                key: '异常',
                label: '异常'
              },
              {
                key: '符合',
                label: '符合'
              },
              {
                key: '不符合',
                label: '不符合'
              }
            ],
            width: 300
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
              img: [row.img].map(name => ({
                uid: name,
                name: name,
                status: 'done',
                uploadRes: name
              })),
              imgUploading: false,
              pointImg: [row.pointImg].map(name => ({
                uid: name,
                name: name,
                status: 'done',
                uploadRes: name
              })),
              pointImgUploading: false,
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
          this.handleTableTempRowFileSave(row, colKey, loadingKey)
        }
        return file
      })
      row.tempRow[colKey] = fileList
    },
    async handleTableTempRowFileSave(row, colKey, loadingKey) {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 500)
      })
      row.tempRow[loadingKey] = false
    },
    async handleTableTempRowInputSave(row, colKey, loadingKey) {
      row.tempRow[loadingKey] = true
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 500)
        console.log(row)
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
    handleFormFileChange(info, formObj, itemKey, single) {
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.uploadRes = file.response.data.url
        }
        return file
      })
      formObj[itemKey] = fileList
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
          pointList: [],
          url: this.roomModalParams.formData.url,
          remark: this.roomModalParams.formData.remark
        }
        const res = await nuclearLabApi.roomCreate(params)
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
    }
  }
}
</script>

<style lang="less" scoped></style>
