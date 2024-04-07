<template>
  <div class="w-full mx-auto max-w-[1200px] px-3 py-6 flex-auto flex flex-col sm:flex-row gap-4">
    <div class="bg-white rounded-xl p-6 sm:w-60 shadow-sm">
      <div class="flex justify-center items-center">
        <div class="w-20 h-20 rounded bg-blue-400 text-white flex justify-center items-center text-3xl leading-none">{{ userInfo.name[0].toUpperCase() }}</div>
      </div>
      <div class="pt-5 flex flex-row flex-wrap justify-between gap-4">
        <div
          v-for="tab in tabList"
          :key="tab.key"
          class="w-[calc(50%-8px)] flex flex-row justify-center gap-2 p-3 rounded-full sm:w-full cursor-pointer"
          :class="tab.key === curTabKey ? 'bg-blue-500 text-white' : 'bg-slate-100 text-gray-950 hover:bg-blue-400 hover:text-white'"
          @click="handleToTab(tab)"
        >
          <div>
            <a-icon :type="tab.icon" theme="filled" class="text-inherit" />
          </div>
          <div>
            {{ tab.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="link-style-form link-style-form-sm flex-auto min-h-[75vh] overflow-hidden bg-white rounded-xl py-5 px-2 shadow-sm flex flex-col" v-loading="loading">
      <div class="flex-auto h-0 overflow-auto px-3">
        <a-form-model
          :ref="'form_' + curTabKey"
          :model="formData[curTabKey]"
          :rules="formRules[curTabKey]"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 21 }"
          labelAlign="right"
        >
          <template v-if="curTabKey === '1'">
            <div class="text-base text-gray-950 font-bold pb-2">信息完善进度：{{ infoFullPercent }}%</div>
            <div>
              <a-progress
                :percent="infoFullPercent"
                :show-info="false"
                :stroke-color="{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }"
              />
            </div>
            <div class="pt-2 pb-5 text-gray-400">
              信息越完善，自身信誉越高，同时在平台的曝光也会越大，可以吸引更多有辅导需求的同学。
            </div>
            <div class="text-base text-gray-950 font-bold pb-2">基本信息：</div>
            <a-form-model-item prop="name" label="昵称">
              <a-input
                v-model="formData[curTabKey].name"
                placeholder="请输入姓名"
                size="large"
              />
            </a-form-model-item>
            <a-form-model-item prop="highEduLevel" label="最高学历">
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
            <a-form-model-item prop="major" label="专业">
              <a-input
                v-model="formData[curTabKey].major"
                placeholder="请输入专业"
                size="large"
              />
            </a-form-model-item>
            <a-form-model-item prop="college" label="学校">
              <a-input
                v-model="formData[curTabKey].college"
                placeholder="请输入毕业大学"
                size="large"
              />
            </a-form-model-item>
            <LinkFormItemImg
              formItemKey="diploma"
              formItemLabel="毕业证/学生证"
              :fileList="formData[curTabKey]['diploma']"
              :illustrativeGraphsUrl="illustrativeGraphs['diploma']"
              @change="fileList => formData[curTabKey]['diploma'] = fileList"
            />
            <LinkFormItemImg
              formItemKey="transcript"
              formItemLabel="成绩单"
              :fileList="formData[curTabKey]['transcript']"
              :illustrativeGraphsUrl="illustrativeGraphs['transcript']"
              @change="fileList => formData[curTabKey]['transcript'] = fileList"
            />
            <div class="text-base text-gray-950 font-bold pb-2">擅长做什么：</div>
            <a-form-model-item prop="advantage" :wrapper-col="{ offset: 3 }">
              <a-textarea
                v-model="formData[curTabKey].advantage"
                :rows="5"
                placeholder="请输入擅长领域：例如：擅长数据分析、数据挖掘、数据建模，精通SPSS、Python、R等分析工具，熟练掌握tableau、power等可视化工具。"
              />
            </a-form-model-item>
            <div class="text-base text-gray-950 font-bold pb-2">我想做什么：</div>
            <a-form-model-item prop="want" :wrapper-col="{ offset: 3 }">
              <a-checkbox-group
                v-model="formData[curTabKey].want"
                :options="Object.keys(orderTypeDict).map(key => ({ value: key, label: orderTypeDict[key] }))"
                class="flex justify-between"
              />
            </a-form-model-item>
            <a-form-model-item v-if="formData[curTabKey].want.includes('3')" prop="sample" label="文书sample">
              <a-upload-dragger
                class="dragUploader"
                :multiple="true"
                name="fileList"
                :action="lingkeApi.uploadUrl"
                :fileList="formData[curTabKey].sample"
                @change="info => handleFileChange(info, curTabKey, 'sample', -5)"
                @preview="handleFileDownload"
              >
                <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                  <div class="pt-4 text-slate-950 text-lg font-bold">
                    请上传留学文书sample，支持上传多个，<span class="text-red-400">至多五個</span>
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
            <div class="" :class="pdfBoxParams.loading ? 'overflow-hidden' : 'overflow-auto'">
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
            <div class="text-sm text-gray-500 pb-3">收款人姓名：</div>
            <a-form-model-item prop="name">
              <a-input
                v-model="formData[curTabKey].name"
                placeholder="请输入收款人姓名"
                disabled
              />
            </a-form-model-item>
            <div class="text-sm text-gray-500 pb-3">收款人账号：</div>
            <a-form-model-item prop="bankNum">
              <a-input
                v-model="formData[curTabKey].bankNum"
                placeholder="请输入收款人账号"
              />
            </a-form-model-item>
            <div class="text-sm text-gray-500 pb-3">开户行支行：</div>
            <a-form-model-item prop="bankBranch">
              <a-input
                v-model="formData[curTabKey].bankBranch"
                placeholder="请输入开户行支行"
              />
            </a-form-model-item>
          </template>
        </a-form-model>
      </div>
      <div class="pt-4 flex flex-row justify-center gap-5">
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
import LinkFormItemImg from '@/components/Kira/LinkFormItemImg'

export default {
  name: 'PersonalCenter',
  components: {
    VuePdfEmbed,
    LinkFormItemImg
  },
  data() {
    return {
      lingkeApi,
      loading: false,
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
          title: '收款信息',
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
          sample: [],
          diploma: [],
          transcript: []
        },
        '2': {
          cv: []
        },
        '3': {
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
    infoFullPercent() {
      return 40
    }
  },
  created() {
  },
  async mounted() {
    this.initFormData()
  },
  methods: {
    async initFormData() {
      this.loading = true
      try {
        const res = await lingkeApi.teacherGetOne({
          userId: this.userInfo.userId
        })
        if (res && res.code === 200) {
          const teacherInfo = res.data
          const formData = {
            '1': {
              name: teacherInfo.name,
              highEduLevel: teacherInfo.highEduLevel,
              major: teacherInfo.major,
              college: teacherInfo.college,
              advantage: teacherInfo.advantage,
              tools: teacherInfo.tools.split(','),
              want: teacherInfo.want.split(','),
              sample: this.parseFileNamesToObjs(teacherInfo.sampleList || []),
              diploma: this.parseFileNamesToObjs(teacherInfo.diplomaList || []),
              transcript: this.parseFileNamesToObjs(teacherInfo.transcriptList || [])
            },
            '2': {
              cv: this.parseFileNamesToObjs(teacherInfo.cvList || [])
            },
            '3': {
              ...teacherInfo,
              visa: this.parseFileNamesToObjs(teacherInfo.visaList || [])
            },
            '4': {
              name: teacherInfo.name,
              bankNum: teacherInfo.bankNum,
              bankBranch: teacherInfo.bankBranch,
              idNo: teacherInfo.idNo
            }
          }
          this.formData = formData
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.loading = false
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
            const formData = this.formData[this.curTabKey]
            switch (this.curTabKey) {
              case '1':
                Object.assign(params, {
                  name: formData.name,
                  highEduLevel: formData.highEduLevel,
                  major: formData.major,
                  college: formData.college,
                  advantage: formData.advantage,
                  tools: formData.tools.join(','),
                  want: formData.want.join(','),
                  sample: formData.want.includes('3') ? (formData.sample[0]?.response && formData.sample[0].uploadResName) : '',
                  diploma: formData.diploma[0]?.response && formData.diploma[0].uploadResName,
                  transcript: formData.transcript[0]?.response && formData.transcript[0].uploadResName
                })
                break
              case '2':
                Object.assign(params, {
                  cv: formData.cv[0]?.response && formData.cv[0].uploadResName
                })
                break
              case '3':
                Object.assign(params, {
                  visa: formData.visa[0]?.response && formData.visa[0].uploadResName
                })
                break
              case '4':
                Object.assign(params, {
                  bankNum: formData.bankNum,
                  bankBranch: formData.bankBranch,
                  idNo: formData.idNo
                })
                break
              default:
                break
            }
            const res = await lingkeApi.teacherUpdate(params)
            if (res && res.data === 1) {
              await this.$store.dispatch('GetInfo')
              this.$message.success('保存成功')
              this.initFormData()
            } else {
              throw new Error(res.message || '保存失败')
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
      if (single === true) {
        fileList = fileList.slice(-1)
      } else if (single < 0) {
        fileList = fileList.slice(single)
      }
      fileList = fileList.map(file => {
        if (file.response) {
          if (file.response.code === 200) {
            file.uploadResName = file.response.data[0]
            file.downloadUrl = `${lingkeApi.tempFileBaseUrl}/${file.response.data[0]}`
          } else {
            this.$message.error(file.response.message || '上传失败')
          }
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
      const fileItem = this.formData[this.curTabKey][formKey][0]
      if (!fileItem) {
        return null
      }
      const isFileChange = !!(fileItem.response)
      const formKeyStatus = isFileChange ? '1' : (this.formData[this.curTabKey][formKey + 'Status'] || '1')
      const text = isFileChange ? '文件上传成功，请保存' : this.codeDict.teacher[formKey + 'Status'][formKeyStatus]
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
