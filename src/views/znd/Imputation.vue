<template>
  <div class="Imputation flex-auto flex flex-col bg-white rounded-3xl p-8 pt-16">
    <div class="text-4xl pb-4 mb-10 mx-24 text-center font-bold text-black border-b border-solid border-gray-200">
      Genotype Imputation
      <div v-if="hasLogin" class="flex flex-row justify-end">
        <router-link class="text-sm pt-4 text-blue-400 font-normal" :to="{ name: 'Profile' }">
          <a-button type="primary" class="success-btn" icon="file-sync" size="large">
            My Profile
          </a-button>
        </router-link>
      </div>
    </div>
    <a-form-model
      class="form"
      ref="imputationForm"
      :model="formData"
      :rules="formRules"
      :label-col="formColConfig.label"
      :wrapper-col="formColConfig.wrapper"
      :colon="false"
    >
      <a-form-model-item ref="taskName" label="Task Name" prop="taskName">
        <a-input
          v-model="formData.taskName"
          placeholder="Please input"
          size="large"
        />
      </a-form-model-item>
      <a-form-model-item ref="ref_panel" label="Reference Panel" prop="ref_panel">
        <a-select v-model="formData.ref_panel" size="large">
          <a-select-option value="1KCIGP">
            1KCIGP
          </a-select-option>
          <!-- <a-select-option value="1KCIGP-v1">
            1KCIGP-v1
          </a-select-option> -->
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="phasing" label="Phased" prop="phasing">
        <a-select v-model="formData.phasing" size="large">
          <a-select-option value="true">
            YES
          </a-select-option>
          <a-select-option value="false">
            NO
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="quality_control" label="Quality Control" prop="quality_control">
        <a-select v-model="formData.quality_control" size="large">
          <a-select-option value="true">
            YES
          </a-select-option>
          <a-select-option value="false">
            NO
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="fileList" label="Input VCF Files" prop="fileList">
        <a-upload :file-list="formData.fileList" :remove="handleFileRemove" :before-upload="beforeUpload">
          <a-button :loading="fileAnalysising"> <a-icon v-if="!fileAnalysising" type="upload" /> {{ fileAnalysising ? 'MD5 calculating' : 'Uploading Files' }} </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item ref="email" label="Email" prop="email">
        <a-input v-model="formData.email" placeholder="Please input" size="large" />
      </a-form-model-item>
      <a-form-model-item ref="agree1" prop="agree1" :wrapper-col="formColConfig.noLabelRow">
        <a-checkbox v-model="formData.agree1" size="large" class="text-sm">
          I accept the <router-link class="text-blue-400" :to="{ name: 'License' }">mbiobank license.</router-link>
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item ref="agree2" prop="agree2" :wrapper-col="formColConfig.noLabelRow">
        <a-checkbox v-model="formData.agree2" size="large" class="text-sm">
          I will report any inadvertent data release, security breach or other data management incident of which I become aware.
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="formColConfig.noLabelRow">
        <a-button type="primary" class="success-btn mt-2" size="large" :loading="submitting" @click="onSubmit">
          Submit Task
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { createTask } from '@/api/createTask'
import SparkMD5 from 'spark-md5'

export default {
  name: 'Imputation',
  data() {
    return {
      formData: {
        taskName: '',
        ref_panel: '1KCIGP',
        phasing: 'true',
        quality_control: 'true',
        md5_incoming: '',
        fileList: [],
        email: '',
        agree1: false,
        agree2: false
      },
      formRules: {
        taskName: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        fileList: [
          {
            validator: (rule, value, callback) => {
              try {
                if (value.length === 0) {
                  callback(new Error('Please upload file'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        email: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!this.hasLogin && !value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        agree1: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value) {
                  callback(new Error('Please agree'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        agree2: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value) {
                  callback(new Error('Please agree'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ]
      },
      fileAnalysising: false,
      submitting: false
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters(['hasLogin']),
    formColConfig() {
      const label = { span: 6 }
      const wrapper = { span: 12 }
      const noLabelRow = { span: 12, offset: 6 }
      return {
        label,
        wrapper,
        noLabelRow
      }
    }
  },
  mounted() {
    this.formData.taskName = this.getCurTaskName()
  },
  methods: {
    getCurTaskName() {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const hours = String(currentDate.getHours()).padStart(2, '0')
      const minutes = String(currentDate.getMinutes()).padStart(2, '0')
      const seconds = String(currentDate.getSeconds()).padStart(2, '0')
      const taskName = `imputation_${year}_${month}_${day}_${hours}_${minutes}_${seconds}`
      return taskName
    },
    handleFileRemove() {
      this.formData.fileList = []
      this.formData.md5_incoming = ''
    },
    beforeUpload(file) {
      this.formData.fileList = [file]
      try {
        this.fileAnalysising = true
        const reader = new FileReader()
        const Spark = new SparkMD5.ArrayBuffer()
        reader.onload = (event) => {
          const maxSize = 500 * 1024 * 1024 // 500MB
          const sizeValid = file.size < maxSize
          if (!sizeValid) {
            this.$message.error('File size cannot exceed 500MB')
            this.formData.fileList = []
            this.fileAnalysising = false
            return
          }
          const buffer = event.target.result
          const bcfHeader = '1f8b08040000000000ff060042430200'
          const fileHeader = Array.from(new Uint8Array(buffer.slice(0, 16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
          const bcfValid = fileHeader === bcfHeader
          if (!bcfValid) {
            this.$message.error('File is invalid')
            this.formData.fileList = []
            this.fileAnalysising = false
            return
          }
          Spark.append(event.target.result)
          const md5 = Spark.end()
          this.formData.md5_incoming = md5
          this.fileAnalysising = false
        }
        reader.readAsArrayBuffer(file)
      } catch (error) {
        console.log(error)
      }
      return false
    },
    onSubmit() {
      this.$refs.imputationForm.validate(async valid => {
        if (valid) {
          this.submitting = true
          try {
            const formData = new FormData()
            formData.append('taskName', this.formData.taskName)
            formData.append('ref_panel', this.formData.ref_panel)
            formData.append('phasing', this.formData.phasing)
            formData.append('quality_control', this.formData.quality_control)
            formData.append('md5_incoming', this.formData.md5_incoming)
            formData.append('file', this.formData.fileList[0])
            formData.append('email', this.formData.email)
            const res = await createTask(formData)
            if (res && res.header && res.header.resCode === '0000') {
              this.$success({
                title: 'Your file has been successfully submitted and your task is running. Once this task complete, we will send an e-mail to inform you' + (this.hasLogin ? ' and you can download the result in your profile.' : '.'),
                okText: this.hasLogin ? 'To Profile' : 'OK',
                onOk: () => {
                  if (this.hasLogin) {
                    this.$router.push({ name: 'Profile' })
                  }
                }
              })
            } else {
              this.$message.error(res.header.resMessage || 'submit fail')
            }
          } catch (error) {
            this.$message.error('submit fail')
            console.log(error)
          }
          this.submitting = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.Imputation {
  :deep(.form) {
    .ant-form-item-label {
      @apply pr-5;
      label {
        @apply text-base;
      }
    }
  }
}
</style>
