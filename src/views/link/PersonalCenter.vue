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
                <a-select-option v-for="tool in localDict.toolsList" :key="tool" :value="tool" class="pl-5">
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
                  <div :ref="`formCtrl_${curTabKey}_cv`" class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  </div>
                </a-upload-dragger>
              </a-form-model-item>
            </div>
            <div class="relative h-[70vh] pr-1 -mr-1 mb-5" :class="pdfBoxParams.loading ? 'overflow-hidden' : 'overflow-auto'">
              <a-spin
                v-if="pdfBoxParams.loading"
                class="absolute z-10 left-0 right-0 top-0 bottom-0 bg-gray-300 flex flex-col gap-5 justify-center items-center"
                tip="加载中......"
              >
                <a-icon slot="indicator" type="loading" class="text-4xl" spin />
              </a-spin>
              <div class="pdf-box p-3 bg-gray-500 min-h-full">
                <vue-pdf-embed
                  v-if="formData[curTabKey].cv[0]?.downloadUrl"
                  ref="pdf"
                  :source="formData[curTabKey].cv[0].downloadUrl"
                  @progress="handlePdfProgress"
                />
              </div>
            </div>
          </template>
          <template v-if="curTabKey === '3'">
            <div class="text-base text-gray-500 pb-3">认证进度：</div>
            <div>
              <a-progress
                :percent="teacherCertifiPercent"
                :stroke-color="{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }" />
            </div>
            <div class="pt-2 pb-10 text-gray-400">
              说明：每完成一个认证，会加一颗星，星越多，认证等级越高，会提升自身信誉，同时在平台的曝光也会越大， 可以吸引更多有辅导需求的同学。
            </div>
            <div class="text-sm text-gray-500 flex flex-row gap-3 items-center justify-between pt-3 pb-4 border-t border-solid border-gray-200">
              上传毕业证/学生证：
              <component :is="getTeacherCertifiStatusText('diploma')" />
            </div>
            <div class="h-0 overflow-hidden">
              <a-form-model-item prop="diploma">
                <a-upload-dragger
                  class="dragUploader"
                  :multiple="true"
                  name="fileList"
                  :action="lingkeApi.uploadUrl"
                  :fileList="formData[curTabKey].diploma"
                  @change="info => handleFileChange(info, curTabKey, 'diploma', true)"
                  @preview="handleFileDownload"
                >
                  <div :ref="`formCtrl_${curTabKey}_diploma`" class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  </div>
                </a-upload-dragger>
              </a-form-model-item>
            </div>
            <div class="pb-10 flex flex-row items-start gap-8">
              <div
                v-if="!formData[curTabKey].diploma[0]"
                class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md hover:border-indigo-400 hover:text-indigo-400"
                @click="handleFileCtrlClick(curTabKey, 'diploma')"
              >
                点击上传
              </div>
              <div
                v-else
                class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
              >
                <el-image
                  v-if="formData[curTabKey].diploma[0].downloadUrl"
                  class="w-28 h-auto"
                  :src="formData[curTabKey].diploma[0].downloadUrl"
                  :preview-src-list="[
                    formData[curTabKey].diploma[0].downloadUrl
                  ]"
                >
                  <a-spin slot="placeholder" class="w-28 pt-4" />
                </el-image>
                <a-spin v-else class="w-28 pt-4" />
                <div
                  class="text-gray-400 text-sm cursor-pointer hover:text-indigo-400"
                  @click="handleFileCtrlClick(curTabKey, 'diploma')"
                >重新上传</div>
              </div>
              <div class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2">
                <el-image
                  class="w-28 h-auto"
                  :src="illustrativeGraphs['diploma']"
                  :preview-src-list="[
                    illustrativeGraphs['diploma']
                  ]"
                />
                <div class="text-gray-400 text-sm">示例图</div>
              </div>
            </div>
            <div class="text-sm text-gray-500 flex flex-row gap-3 items-center justify-between pt-3 pb-4 border-t border-solid border-gray-200">
              上传成绩单：
              <component :is="getTeacherCertifiStatusText('transcript')" />
            </div>
            <div class="h-0 overflow-hidden">
              <a-form-model-item prop="transcript">
                <a-upload-dragger
                  class="dragUploader"
                  :multiple="true"
                  name="fileList"
                  :action="lingkeApi.uploadUrl"
                  :fileList="formData[curTabKey].transcript"
                  @change="info => handleFileChange(info, curTabKey, 'transcript', true)"
                  @preview="handleFileDownload"
                >
                  <div :ref="`formCtrl_${curTabKey}_transcript`" class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  </div>
                </a-upload-dragger>
              </a-form-model-item>
            </div>
            <div class="pb-10 flex flex-row items-start gap-8">
              <div
                v-if="!formData[curTabKey].transcript[0]"
                class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md hover:border-indigo-400 hover:text-indigo-400"
                @click="handleFileCtrlClick(curTabKey, 'transcript')"
              >
                点击上传
              </div>
              <div
                v-else
                class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
              >
                <el-image
                  v-if="formData[curTabKey].transcript[0].downloadUrl"
                  class="w-28 h-auto"
                  :src="formData[curTabKey].transcript[0].downloadUrl"
                  :preview-src-list="[
                    formData[curTabKey].transcript[0].downloadUrl
                  ]"
                >
                  <a-spin slot="placeholder" class="w-28 pt-4" />
                </el-image>
                <a-spin v-else class="w-28 pt-4" />
                <div
                  class="text-gray-400 text-sm cursor-pointer hover:text-indigo-400"
                  @click="handleFileCtrlClick(curTabKey, 'transcript')"
                >重新上传</div>
              </div>
              <div class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2">
                <el-image
                  class="w-28 h-auto"
                  :src="illustrativeGraphs['transcript']"
                  :preview-src-list="[
                    illustrativeGraphs['transcript']
                  ]"
                />
                <div class="text-gray-400 text-sm">示例图</div>
              </div>
            </div>
            <div class="text-sm text-gray-500 flex flex-row gap-3 items-center justify-between pt-3 pb-4 border-t border-solid border-gray-200">
              上传签证：
              <component :is="getTeacherCertifiStatusText('visa')" />
            </div>
            <div class="h-0 overflow-hidden">
              <a-form-model-item prop="visa">
                <a-upload-dragger
                  class="dragUploader"
                  :multiple="true"
                  name="fileList"
                  :action="lingkeApi.uploadUrl"
                  :fileList="formData[curTabKey].visa"
                  @change="info => handleFileChange(info, curTabKey, 'visa', true)"
                  @preview="handleFileDownload"
                >
                  <div :ref="`formCtrl_${curTabKey}_visa`" class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  </div>
                </a-upload-dragger>
              </a-form-model-item>
            </div>
            <div class="pb-10 flex flex-row items-start gap-8">
              <div
                v-if="!formData[curTabKey].visa[0]"
                class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md hover:border-indigo-400 hover:text-indigo-400"
                @click="handleFileCtrlClick(curTabKey, 'visa')"
              >
                点击上传
              </div>
              <div
                v-else
                class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
              >
                <el-image
                  v-if="formData[curTabKey].visa[0].downloadUrl"
                  class="w-28 h-auto"
                  :src="formData[curTabKey].visa[0].downloadUrl"
                  :preview-src-list="[
                    formData[curTabKey].visa[0].downloadUrl
                  ]"
                >
                  <a-spin slot="placeholder" class="w-28 pt-4" />
                </el-image>
                <a-spin v-else class="w-28 pt-4" />
                <div
                  class="text-gray-400 text-sm cursor-pointer hover:text-indigo-400"
                  @click="handleFileCtrlClick(curTabKey, 'visa')"
                >重新上传</div>
              </div>
              <div class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2">
                <el-image
                  class="w-28 h-auto"
                  :src="illustrativeGraphs['visa']"
                  :preview-src-list="[
                    illustrativeGraphs['visa']
                  ]"
                />
                <div class="text-gray-400 text-sm">示例图</div>
              </div>
            </div>
          </template>
          <template v-if="curTabKey === '4'">
            <div class="text-sm text-gray-500 pb-3">银行卡号：</div>
            <a-form-model-item prop="bankNum">
              <a-input
                v-model="formData[curTabKey].bankNum"
                placeholder="请输入银行卡号"
              />
            </a-form-model-item>
            <div class="text-sm text-gray-500 pb-3">开户行支行：</div>
            <a-form-model-item prop="bankBranch">
              <a-input
                v-model="formData[curTabKey].bankBranch"
                placeholder="请输入开户行支行"
              />
            </a-form-model-item>
            <div class="text-sm text-gray-500 pb-3">身份证号码：</div>
            <a-form-model-item prop="idNo">
              <a-input
                v-model="formData[curTabKey].idNo"
                placeholder="请输入身份证号码"
              />
            </a-form-model-item>
          </template>
        </a-form-model>
      </div>
      <div class="pt-1 flex flex-row gap-5">
        <a-button
          v-if="curTabKey === '2'"
          type="danger"
          class="step-btn w-40"
          @click="handleFileCtrlClick(curTabKey, 'cv')"
        >
          重新上传
        </a-button>
        <a-button
          v-if="curTabKey === '1' || curTabKey === '2' || curTabKey === '3' || curTabKey === '4'"
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
        },
        '3': {
          diploma: [],
          transcript: [],
          visa: []
        },
        '4': {
          bankNum: '',
          bankBranch: '',
          idNo: ''
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
        },
        '2': {
          cv: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
                    callback(new Error('请上传简历'))
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
      pdfBoxParams: {
        loading: false
      },
      illustrativeGraphs: {
        diploma: require('@/assets/link/illustrativeGraphs1.webp'),
        transcript: require('@/assets/link/illustrativeGraphs2.webp'),
        visa: require('@/assets/link/illustrativeGraphs3.webp')
      }
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'userInfo',
      'localDict'
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
    teacherCertifiPercent() {
      const percentMap = {
        diploma: 30,
        transcript: 30,
        visa: 40
      }
      let resPrecent = 0
      Object.keys(percentMap).forEach(key => {
        if (this.userInfo[key + 'Status'] === '2') {
          resPrecent = resPrecent + percentMap[key]
        }
      })
      return resPrecent
    }
  },
  created() {
    this.initFormData()
  },
  async mounted() {
  },
  methods: {
    initFormData() {
      const teacherInfo = this.userInfo
      const formData = {
        '1': {
          name: teacherInfo.name,
          highEduLevel: teacherInfo.highEduLevel,
          major: teacherInfo.major,
          college: teacherInfo.college,
          advantage: teacherInfo.advantage,
          tools: teacherInfo.tools.split(','),
          want: teacherInfo.want.split(','),
          sample: this.parseFileNamesToObjs(teacherInfo.sampleList || [])
        },
        '2': {
          cv: this.parseFileNamesToObjs(teacherInfo.cvList || [])
        },
        '3': {
          diploma: this.parseFileNamesToObjs(teacherInfo.diplomaList || []),
          transcript: this.parseFileNamesToObjs(teacherInfo.transcriptList || []),
          visa: this.parseFileNamesToObjs(teacherInfo.visaList || [])
        },
        '4': {
          bankNum: teacherInfo.bankNum,
          bankBranch: teacherInfo.bankBranch,
          idNo: teacherInfo.idNo
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
              userId: this.userInfo.userId
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
                  sample: this.formData[this.curTabKey].sample[0].uploadResName
                })
                break
              case '2':
                Object.assign(params, {
                  cv: this.formData[this.curTabKey].cv[0].uploadResName
                })
                break
              case '3':
                Object.assign(params, {
                  diploma: this.formData[this.curTabKey].diploma[0]?.uploadResName || '',
                  transcript: this.formData[this.curTabKey].transcript[0]?.uploadResName || '',
                  visa: this.formData[this.curTabKey].visa[0]?.uploadResName || ''
                })
                break
              case '4':
                Object.assign(params, {
                  bankNum: this.formData[this.curTabKey].bankNum,
                  bankBranch: this.formData[this.curTabKey].bankBranch,
                  idNo: this.formData[this.curTabKey].idNo
                })
                break
              default:
                break
            }
            const res = await lingkeApi.teacherUpdate(params)
            if (res && res.data === 1) {
              await this.$store.dispatch('GetInfo')
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
          file.uploadResName = file.response.data[0]
          file.downloadUrl = `${lingkeApi.tempFileBaseUrl}/${file.response.data[0]}`
        }
        return file
      })
      this.formData[formKey][itemKey] = fileList
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
    handleFileCtrlClick(formKey, itemKey) {
      this.$refs[`formCtrl_${formKey}_${itemKey}`].click()
    },
    handlePdfProgress({ loaded, total }) {
      this.pdfBoxParams.loading = loaded !== total
    },
    getTeacherCertifiStatusText(formKey) {
      const isFileEmpty = !this.formData[this.curTabKey][formKey][0]
      if (isFileEmpty) {
        return null
      }
      const formKeyStatus = this.userInfo[formKey + 'Status'] || '1'
      const text = this.codeDict.teacher[formKey + 'Status'][formKeyStatus]
      const colorMap = {
        1: '#2db7f5',
        2: '#87d068',
        3: '#f50'
      }
      const color = colorMap[formKeyStatus]
      return {
        render: () => {
          return (
            <a-tag color={ color } class="mr-0">
              { text }
            </a-tag>
          )
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
