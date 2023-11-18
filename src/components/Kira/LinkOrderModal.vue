<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-modal
      v-if="linkOrderModalParams.show"
      :title="'发布委托'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '640px'"
      @cancel="linkOrderModalParams.show = false"
    >
      <div class="pt-4">
        <div class="link-style-form" v-loading="linkOrderModalParams.loading">
          <a-form-model
            ref="linkOrderModalForm"
            :model="linkOrderModalParams.formData"
            :rules="linkOrderModalParams.formRules"
            :label-col="{ span: 5 }"
            :wrapper-col="{ offset: isMobile ? 0 : 1, span: 16 }"
          >
            <a-form-model-item key="type" prop="type" label="任务类型">
              <a-select v-model="linkOrderModalParams.formData.type" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in linkOrderModalParams.options['type']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="task" prop="task" label="委托任务">
              <a-input
                v-model="linkOrderModalParams.formData.task"
                placeholder="如SPSS回归分析辅导 - 提供数据"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="detail" prop="detail" label="任务详细说明">
              <a-textarea
                v-model="linkOrderModalParams.formData.detail"
                placeholder="请输入"
                :rows="3"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="unitPrice" prop="unitPrice" label="一小时单价">
              <a-input-number
                v-model="linkOrderModalParams.formData.unitPrice"
                placeholder="请输入"
                size="large"
                class="w-full"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="duration" prop="duration" label="辅导时间(小时)">
              <a-input-number
                v-model="linkOrderModalParams.formData.duration"
                placeholder="请输入"
                size="large"
                class="w-full"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="files" prop="files" label="相关文件">
              <a-upload-dragger
                class="dragUploader"
                :multiple="true"
                name="fileList"
                :action="lingkeApi.uploadUrl"
                :fileList="linkOrderModalParams.formData.files"
                @change="info => handleFormFileChange(info, linkOrderModalParams.formData, 'files', false)"
                @preview="handleFileDownload"
              >
                <div class="rounded-md bg-sky-50 flex flex-col items-center py-4">
                  <div>
                    <span class="text-indigo-500">点击上传</span>
                  </div>
                </div>
              </a-upload-dragger>
            </a-form-model-item>
            <a-form-model-item key="teacherId" prop="teacherId" label="委托对象">
              <a-select
                v-model="linkOrderModalParams.formData.teacherId"
                size="large"
                placeholder="请选择"
                allowClear
                show-search
                option-filter-prop="children"
              >
                <a-select-option v-for="item in linkOrderModalParams.options['teacherId']" :key="item.key" :value="item.key">
                  {{ item.value + ' ID:' + item.key }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
              <div class="pt-4">
                <a-button
                  class="h-11 w-52 rounded-md text-base"
                  type="primary"
                  size="large"
                  :loading="linkOrderModalParams.submitting"
                  @click="handleLinkOrderModalFormUpdate"
                >
                  发布委托
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
import { mapGetters } from 'vuex'
import lingkeApi from '@/api/lingke'
import { downloadFile } from '@/utils//util.js'

export default {
  name: 'LinkOrderModal',
  mixins: [baseMixin],
  props: {
  },
  data () {
    return {
      lingkeApi,
      linkOrderModalParams: {
        show: false,
        loading: false,
        submitting: false,
        orderId: '',
        formData: {
          type: undefined,
          task: '',
          detail: '',
          unitPrice: undefined,
          duration: undefined,
          files: [],
          teacherId: undefined
        },
        options: {
          type: [],
          teacherId: []
        },
        formRules: {
          type: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择任务类型'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          task: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请填写委托任务'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          detail: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请填写任务详细说明'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          unitPrice: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请填写一小时单价'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          duration: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请填写辅导时间'))
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
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    orderTypeOptions() {
      return [
        ...Object.entries(this.codeDict.order?.type || {}).map(([key, value]) => (
          {
            key,
            value
          }
        ))
      ]
    }
  },
  methods: {
    async handleOpenLinkOrderModal(orderId, teacherId) {
      this.linkOrderModalParams = {
        ...this.linkOrderModalParams,
        show: true,
        loading: true,
        submitting: false,
        orderId: orderId,
        formData: {
          type: undefined,
          task: '',
          detail: '',
          unitPrice: undefined,
          duration: undefined,
          files: [],
          teacherId: teacherId
        },
        options: {
          type: this.orderTypeOptions,
          teacherId: []
        }
      }
      try {
        const teacherIdOptionsRes = await lingkeApi.teacherGetOptions({})
        this.linkOrderModalParams.options['teacherId'] = teacherIdOptionsRes.data.map(row => (
          {
            key: row.userId,
            value: row.name
          }
        ))
        if (orderId) {
          const formDataRes = await lingkeApi.orderGetOne({
            Id: parseInt(this.detailId)
          })
          const formData = formDataRes.data
          formData.fileList = formData.files ? this.parseFileNamesToObjs(formData.files.split(',')) : []
          this.linkOrderModalParams.formData = formData
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.linkOrderModalParams.loading = false
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
    handleFormFileChange(info, formObj, itemKey, single, updateCallback) {
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.uploadResName = file.response.data[0]
          file.downloadUrl = `${lingkeApi.tempFileBaseUrl}/${file.response.data[0]}`
        }
        return file
      })
      formObj[itemKey] = fileList
      if (updateCallback) updateCallback()
    },
    async handleLinkOrderModalFormUpdate() {
      try {
        await this.$refs.linkOrderModalForm.validate()
      } catch {
        this.$message.error('提交信息不符合要求，请检查')
        return
      }
      this.linkOrderModalParams.submitting = true
      try {
        const params = {
          type: this.linkOrderModalParams.formData.type,
          task: this.linkOrderModalParams.formData.task,
          detail: this.linkOrderModalParams.formData.detail,
          unitPrice: this.linkOrderModalParams.formData.unitPrice,
          duration: this.linkOrderModalParams.formData.duration,
          files: this.linkOrderModalParams.formData.files.map(file => file.uploadResName).join(','),
          teacherId: this.linkOrderModalParams.formData.teacherId || undefined
        }
        const res = this.linkOrderModalParams.orderId ? await lingkeApi.orderUpdate({
          id: this.linkOrderModalParams.orderId,
          ...params
        }) : await lingkeApi.orderCreate(params)
        if (res && res.code === 1000) {
          this.$message.success('发布成功')
          this.linkOrderModalParams.show = false
        } else {
          throw new Error(res.msg || '发布失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.linkOrderModalParams.submitting = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
