<template>
  <div class="flex-auto flex flex-col sm:flex-row gap-4">
    <div class="bg-white rounded-3xl p-6 sm:w-60">
      <div class="text-2xl font-bold text-slate-900">个人中心</div>
      <div class="text-sm text-slate-400">Personal center</div>
      <div class="pt-5 sm:pt-8 flex flex-row flex-wrap justify-between gap-4">
        <div
          v-for="tab in tabList"
          :key="tab.key"
          class="w-[calc(50%-8px)] flex flex-row justify-between p-3 rounded-lg sm:w-full cursor-pointer"
          :class="tab.key === curTabKey ? 'bg-blue-500 text-white' : 'bg-slate-100 text-blue-400 hover:bg-blue-400 hover:text-white'"
          @click="handleToTab(tab)"
        >
          <div>
            {{ tab.title }}
          </div>
          <div>
            <a-icon :type="tab.icon" theme="filled" class="text-inherit" />
          </div>
        </div>
      </div>
    </div>
    <div class="link-style-form flex-auto overflow-hidden bg-white rounded-3xl p-6 sm:pt-12 sm:px-12">
      <div class="">
        <a-form-model
          :ref="'form_' + curTabKey"
          :model="formData[curTabKey]"
          :rules="formRules[curTabKey]"
        >
          <template v-if="curTabKey === '1'">
            <div class="text-base text-gray-500 pb-3">基本信息：</div>
            <a-form-model-item prop="name">
              <a-input
                v-model="formData[curTabKey].name"
                placeholder="请输入姓名"
              />
            </a-form-model-item>
            <a-form-model-item prop="highEduLevel">
              <a-select
                show-search
                allowClear
                showArrow
                size="large"
                placeholder="请选择学历"
                v-model="formData[curTabKey].highEduLevel"
              >
                <a-select-option v-for="(label, key) in highEduLevelDict" :key="key" :value="key" class="pl-5">
                  {{ label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item prop="major">
              <a-input
                v-model="formData[curTabKey].major"
                placeholder="请输入专业"
              />
            </a-form-model-item>
            <a-form-model-item prop="college">
              <a-input
                v-model="formData[curTabKey].college"
                placeholder="请输入毕业大学"
              />
            </a-form-model-item>
            <div class="text-base text-gray-500 pb-3">擅长做什么：</div>
            <a-form-model-item prop="advantage">
              <a-textarea
                v-model="formData[curTabKey].advantage"
                :rows="5"
                placeholder="请输入擅长领域：例如：擅长数据分析、数据挖掘、数据建模，精通SPSS、Python、R等分析工具，熟练掌握tableau、power等可视化工具。"
              />
            </a-form-model-item>
            <div class="text-base text-gray-500 pb-3">会使用哪些工具：</div>
            <a-form-model-item prop="tools">
              <a-select
                allowClear
                showArrow
                mode="tags"
                size="large"
                placeholder="请选择或直接输入"
                v-model="formData[curTabKey].tools"
              >
                <a-select-option v-for="tool in toolsList" :key="tool" :value="tool" class="pl-5">
                  {{ tool }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <div class="text-base text-gray-500 pb-3">我想做什么：</div>
            <a-form-model-item prop="want">
              <a-checkbox-group
                v-model="formData[curTabKey].want"
                :options="Object.keys(orderTypeDict).map(key => ({ value: key, label: orderTypeDict[key] }))"
                class="flex justify-between"
              />
            </a-form-model-item>
            <a-form-model-item prop="sample">
              <a-upload-dragger
                class="dragUploader"
                :multiple="true"
                name="fileList"
                :action="lingkeApi.uploadUrl"
                :fileList="formData[curTabKey].sample"
                @change="info => handleFileChange(info, curTabKey, 'sample', true)"
                @preview="handleFileDownload"
              >
                <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                  <div class="pt-4 text-slate-950 text-lg font-bold">
                    将文书拖到此处，或<span class="text-indigo-500">点击上传</span>
                  </div>
                  <div class="pt-2 text-sm text-gray-400">
                    可导入pdf / docx / doc 格式简历，最大10MB
                  </div>
                </div>
              </a-upload-dragger>
            </a-form-model-item>
          </template>
          <template v-if="curTabKey === '2'">
            <div class="text-base text-gray-500 pb-3">简历：</div>
            <div class="h-0 overflow-hidden">
              <a-form-model-item prop="cv">
                <a-upload-dragger
                  class="dragUploader"
                  :multiple="true"
                  name="fileList"
                  :action="lingkeApi.uploadUrl"
                  :fileList="formData[curTabKey].cv"
                  @change="info => handleFileChange(info, curTabKey, 'cv', true)"
                  @preview="handleFileDownload"
                >
                  <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                    <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                    <div class="pt-4 text-slate-950 text-lg font-bold">
                      将文书拖到此处，或<span class="text-indigo-500">点击上传</span>
                    </div>
                    <div class="pt-2 text-sm text-gray-400">
                      可导入pdf / docx / doc 格式简历，最大10MB
                    </div>
                  </div>
                </a-upload-dragger>
              </a-form-model-item>
            </div>
            <div class="relative h-[70vh] pr-1 -mr-1 mb-5" :class="testLoading ? 'overflow-hidden' : 'overflow-auto'">
              <a-spin
                class="absolute z-10 left-0 right-0 top-0 bottom-0 bg-gray-300 flex flex-col gap-5 justify-center items-center"
                tip="加载中......"
              >
                <a-icon slot="indicator" type="loading" class="text-4xl" spin />
              </a-spin>
              <div class="pdf-box p-3 bg-gray-500 min-h-full">
                <!-- <vue-pdf-embed
                  :source="`${lingkeApi.downloadUrl}?file=${formData[curTabKey].cv[0].url}`"
                /> -->
              </div>
            </div>
          </template>
        </a-form-model>
      </div>
      <div class="pt-1 flex flex-row gap-5">
        <a-button
          v-if="curTabKey === '2'"
          type="danger"
          class="step-btn w-40"
          @click="handleSave"
        >
          重新上传
        </a-button>
        <a-button
          v-if="curTabKey === '1' || curTabKey === '2'"
          type="primary"
          class="step-btn w-40"
          @click="handleSave"
        >
          保存
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import { downloadFile } from '@/utils//util.js'
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'

export default {
  name: 'PersonalCenter',
  components: {
    VuePdfEmbed
  },
  data() {
    return {
      testLoading: true,
      lingkeApi,
      tabList: [
        {
          title: '个人信息',
          key: '1',
          icon: 'skin'
        },
        {
          title: '附件简历',
          key: '2',
          icon: 'profile'
        },
        {
          title: '认证',
          key: '3',
          icon: 'safety-certificate'
        },
        {
          title: '银行卡信息',
          key: '4',
          icon: 'hdd'
        }
      ],
      formData: {
        '1': {
          name: '',
          highEduLevel: undefined,
          major: '',
          college: '',
          advantage: '',
          tools: [],
          want: [],
          sample: []
        },
        '2': {
          cv: []
        }
      },
      formRules: {
        '1': {
          name: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入姓名'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          highEduLevel: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value) {
                    callback(new Error('请选择学历'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          major: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入专业'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          college: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入毕业大学'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          advantage: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入擅长领域'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          tools: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请选择或输入使用工具'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          want: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请选择想做什么'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          sample: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请上传文书'))
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
    ...mapState(CUR_APP, [
      'teacherInfo'
    ]),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    curTabKey() {
      return this.$route.query.tab || '1'
    },
    highEduLevelDict() {
      return this.codeDict.teacher && this.codeDict.teacher.highEduLevel || {}
    },
    orderTypeDict() {
      return this.codeDict.order && this.codeDict.order.type || {}
    },
    toolsList() {
      return [
        'Java',
        'C',
        'C++',
        'Python',
        'SPSS',
        'R',
        'STATA',
        'Eview',
        'Power BI',
        'Tableau',
        'Excel',
        'SAS',
        'Matlab',
        'Latex',
        'go',
        'JS',
        'HTML',
        'VUE'
      ]
    },
    orderTypeOptions() {
      return [
        {
          key: '',
          value: '全 部'
        },
        ...Object.entries(this.codeDict.order?.type || {}).map(([key, value]) => (
          {
            key,
            value
          }
        ))
      ]
    },
    infiniteId() {
      return `type_${this.searchParams.type}`
    },
    detailId() {
      return this.$route.query.id
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
  created() {
    this.initFormData()
  },
  async mounted() {
  },
  methods: {
    initFormData() {
      const teacherInfo = this.teacherInfo
      const formData = {
        '1': {
          name: teacherInfo.name,
          highEduLevel: teacherInfo.highEduLevel,
          major: teacherInfo.major,
          college: teacherInfo.college,
          advantage: teacherInfo.advantage,
          tools: teacherInfo.tools.split(','),
          want: teacherInfo.want.split(','),
          sample: teacherInfo.sampleList.map(name => ({
            uid: name,
            name: name,
            status: 'done',
            url: name
          }))
        },
        '2': {
          cv: teacherInfo.cvList.map(name => ({
            uid: name,
            name: name,
            status: 'done',
            url: name
          }))
        }
      }
      this.formData = formData
    },
    async handleSave() {
      try {
        await this.$refs['form_' + this.curTabKey].validate()
      } catch {
        this.$message.error('填写信息不符合要求，请检查')
        return
      }
      this.$confirm({
        title: '提示',
        content: `确定保存吗?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const params = {
              userId: this.teacherInfo.userId
            }
            switch (this.curTabKey) {
              case '1':
                Object.assign(params, {
                  name: this.formData[this.curTabKey].name,
                  highEduLevel: this.formData[this.curTabKey].highEduLevel,
                  major: this.formData[this.curTabKey].major,
                  college: this.formData[this.curTabKey].college,
                  advantage: this.formData[this.curTabKey].advantage,
                  tools: this.formData[this.curTabKey].tools.join(','),
                  want: this.formData[this.curTabKey].want.join(','),
                  sample: this.formData[this.curTabKey].sample[0].url
                })
                break
              default:
                break
            }
            const res = await lingkeApi.teacherUpdate(params)
            if (res && res.data === 1) {
              await this.$store.dispatch('GetInfo')
              this.initFormData()
              this.$message.success('保存成功')
            } else {
              throw new Error(res.msg || '保存失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    handleToTab(tab) {
      this.$router.push({ name: 'PersonalCenter', query: { tab: tab.key } })
    },
    handleFileChange(info, formKey, itemKey, single) {
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.data[0]
        }
        return file
      })
      this.formData[formKey][itemKey] = fileList
    },
    handleFileDownload(file) {
      const url = `${lingkeApi.downloadUrl}?file=${file.url}`
      downloadFile(url, file.name, true)
    },
    handleBack() {
      this.$router.push({ name: 'TaskSquare' })
    },
    async infiniteHandler($state) {
      try {
        const res = await lingkeApi.orderGetList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          type: this.searchParams.type
        })
        if (res && res.code === 1000) {
          this.dataList = [...this.dataList, ...res.data.list]
          if (this.dataList.length) $state.loaded()
          if (this.searchParams.pageIndex < res.data.totalPage) {
            this.searchParams.pageIndex++
          } else {
            $state.complete()
          }
        } else {
          throw new Error(res.msg || '加载失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        $state.error()
        console.log(error)
      }
    },
    handleOrderType(type) {
      this.searchParams.pageIndex = 1
      this.dataList = []
      this.searchParams.type = type
    },
    handleToDetail(row) {
      this.$router.push({ name: 'TaskSquare', query: { id: row.id } })
    },
    async handleDetailIdChange() {
      if (this.detailId) {
        try {
          const res = await lingkeApi.orderGetOne({
            Id: parseInt(this.detailId)
          })
          if (res && res.code === 1000) {
            this.detailData = res.data
          } else {
            throw new Error(res.msg || '加载失败')
          }
        } catch (error) {
          this.$message.error(error.message)
          console.log(error)
        }
      } else {
        this.detailData = null
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
