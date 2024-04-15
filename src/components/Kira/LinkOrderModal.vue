<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-modal
      v-if="linkOrderModalParams.show"
      :title="'发布委托'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '1000px'"
      @cancel="linkOrderModalParams.show = false"
    >
      <div class="pt-4">
        <div class="link-style-form link-style-form-sm" v-loading="linkOrderModalParams.loading">
          <a-form-model
            ref="linkOrderModalForm"
            :model="linkOrderModalParams.formData"
            :rules="linkOrderModalParams.formRules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-form-model-item key="task" prop="task" label="委托名称">
              <a-input
                v-model="linkOrderModalParams.formData.task"
                placeholder="如SPSS回归分析辅导 - 提供数据"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="type" prop="type" label="任务类型">
              <a-select v-model="linkOrderModalParams.formData.type" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in linkOrderModalParams.options['type']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="detail" prop="detail" label="委托明细">
              <a-textarea
                v-model="linkOrderModalParams.formData.detail"
                placeholder="请输入"
                :rows="3"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="files" prop="files" label="相关资料">
              <a-upload-dragger
                class="dragUploader"
                :multiple="false"
                name="fileList"
                :action="lingkeApi.uploadUrl"
                :fileList="linkOrderModalParams.formData.files"
                @change="info => handleFormFileChange(info, linkOrderModalParams.formData, 'files', true)"
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
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="lessonType" prop="lessonType" label="课程模式">
              <a-radio-group v-model="linkOrderModalParams.formData.lessonType" size="large">
                <a-radio v-for="item in linkOrderModalParams.options['lessonType']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item v-if="linkOrderModalParams.formData.lessonType === '2'" key="lessonNum" prop="lessonNum" label="课程节数">
              <a-select v-model="linkOrderModalParams.formData.lessonNum" size="large" placeholder="请选择" allowClear>
                <span slot="suffixIcon">节</span>
                <a-select-option v-for="item in linkOrderModalParams.options['lessonNum']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="unitDuration" prop="unitDuration" label="课程时长">
              <a-select v-model="linkOrderModalParams.formData.unitDuration" size="large" placeholder="请选择" allowClear>
                <span slot="suffixIcon">小时</span>
                <a-select-option v-for="item in linkOrderModalParams.options['unitDuration']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="unitPrice" prop="unitPrice" :label="`${linkOrderModalParams.formData.lessonType === '2' ? '每节课' : ''}委托价格`">
              <a-input-number
                v-model="linkOrderModalParams.formData.unitPrice"
                placeholder="请输入"
                size="large"
                class="w-full"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                allowClear
              />
            </a-form-model-item>
          </a-form-model>
          <div class="flex flex-col items-center gap-y-3 pt-5">
            <div v-if="courseTotalPriceTxt" class="mb-4 border border-solid border-gray-300 rounded-lg flex items-center justify-center py-6 px-8 text-gray-600">
              {{ courseTotalPriceTxt }}
            </div>
            <div v-if="!linkOrderModalParams.orderId" class="flex justify-center items-center flex-wrap gap-y-1 whitespace-nowrap text-sm leading-none">
              <a-icon
                type="check-circle"
                theme="filled"
                class="cursor-pointer text-lg"
                :class="linkOrderModalParams.isAgree ? 'text-blue-600' : 'text-gray-400'"
                @click="linkOrderModalParams.isAgree = !linkOrderModalParams.isAgree"
              />
              <div class="text-gray-400 ml-2">已阅读并同意</div>
              <div class="text-blue-400 cursor-pointer">《服务协议》</div>
              <div class="text-blue-400 cursor-pointer">《隐私协议》</div>
            </div>
            <div class="">
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
          </div>
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
        isAgree: false,
        formData: {
          type: undefined,
          task: '',
          detail: '',
          duration: undefined,
          files: [],
          teacherId: undefined,
          lessonType: undefined,
          unitDuration: undefined,
          lessonNum: undefined,
          unitPrice: undefined
        },
        options: {
          type: [],
          teacherId: [],
          lessonType: [],
          unitDuration: [
            {
              key: 0.5,
              value: 0.5
            },
            {
              key: 1,
              value: 1
            },
            {
              key: 1.5,
              value: 1.5
            },
            {
              key: 2,
              value: 2
            },
            {
              key: 2.5,
              value: 2.5
            },
            {
              key: 3,
              value: 3
            }
          ],
          lessonNum: [
            {
              key: 1,
              value: 1
            },
            {
              key: 2,
              value: 2
            },
            {
              key: 3,
              value: 3
            },
            {
              key: 4,
              value: 4
            },
            {
              key: 5,
              value: 5
            },
            {
              key: 6,
              value: 6
            },
            {
              key: 7,
              value: 7
            },
            {
              key: 8,
              value: 8
            },
            {
              key: 9,
              value: 9
            },
            {
              key: 10,
              value: 10
            }
          ]
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
                    callback(new Error('请填写委托名称'))
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
                    callback(new Error('请填写委托明细'))
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
          ],
          unitDuration: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择课程时长'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          lessonNum: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择课程节数'))
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
                    callback(new Error('请填写委托价格'))
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
    },
    lessonTypeOptions() {
      return [
        ...Object.entries(this.codeDict.order?.lessonType || {}).map(([key, value]) => (
          {
            key,
            value
          }
        ))
      ]
    },
    courseTotalPriceTxt() {
      let txt = ''
      const formData = this.linkOrderModalParams.formData
      if (formData.lessonType === '1' && formData.unitDuration && formData.unitPrice) {
        txt = `合计：${formData.unitPrice}元, 共${formData.unitDuration}小时`
      } else if (formData.lessonType === '2' && formData.lessonNum && formData.unitPrice && formData.unitDuration) {
        txt = `合计：共${formData.lessonNum}节课, 每节课${formData.unitPrice}元`
      }
      return txt
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
        isAgree: false,
        formData: {
          type: undefined,
          task: '',
          detail: '',
          unitPrice: undefined,
          duration: undefined,
          files: [],
          teacherId: teacherId,
          lessonType: undefined
        },
        options: {
          ...this.linkOrderModalParams.options,
          type: this.orderTypeOptions,
          lessonType: this.lessonTypeOptions,
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
        let formData = { ...this.linkOrderModalParams.formData }
        if (orderId) {
          const formDataRes = await lingkeApi.orderGetOne({
            id: parseInt(orderId)
          })
          formData = { ...formData, ...formDataRes.data }
          formData.files = formDataRes.data.files ? this.parseFileNamesToObjs(formDataRes.data.files.split(',')) : []
        }
        formData.lessonType = formData.lessonType || '1'
        this.linkOrderModalParams.formData = formData
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.linkOrderModalParams.loading = false
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
    handleFormFileChange(info, formObj, itemKey, single, updateCallback) {
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.downloadUrl = file.response.data[0]
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
      if (!this.linkOrderModalParams.orderId && !this.linkOrderModalParams.isAgree) {
        this.$message.error('请先阅读并同意《服务协议》和《隐私协议》')
        return false
      }
      this.linkOrderModalParams.submitting = true
      try {
        const params = {
          task: this.linkOrderModalParams.formData.task,
          type: this.linkOrderModalParams.formData.type,
          detail: this.linkOrderModalParams.formData.detail,
          files: this.linkOrderModalParams.formData.files.filter(file => file.downloadUrl).map(file => file.downloadUrl).join(',') || undefined,
          teacherId: this.linkOrderModalParams.formData.teacherId || undefined,
          lessonType: this.linkOrderModalParams.formData.lessonType,
          lessonNum: this.linkOrderModalParams.formData.lessonNum || 1,
          unitDuration: this.linkOrderModalParams.formData.unitDuration,
          unitPrice: this.linkOrderModalParams.formData.unitPrice
        }
        const res = this.linkOrderModalParams.orderId ? await lingkeApi.orderUpdate({
          id: this.linkOrderModalParams.orderId,
          ...params
        }) : await lingkeApi.orderCreate(params)
        if (res && res.code === 200) {
          this.$message.success('发布成功')
          this.$emit('reload')
          this.linkOrderModalParams.show = false
        } else {
          throw new Error(res.message || '发布失败')
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
