<template>
  <div class="w-full mx-auto max-w-[1200px] px-3 py-6 flex-auto flex flex-col sm:flex-row gap-4">
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
    <div class="link-style-form flex-auto overflow-hidden bg-white rounded-3xl p-6 sm:pt-12 sm:px-12" v-loading="loading">
      <div class="">
        <a-form-model
          :ref="'form_' + curTabKey"
          :model="formData[curTabKey]"
          :rules="formRules[curTabKey]"
        >
          <template v-if="curTabKey === '1'">
            <a-form-model-item prop="type" label="机构类型">
              <a-select
                allowClear
                showArrow
                size="large"
                placeholder="请选择机构类型"
                v-model="formData[curTabKey].type"
                :disabled="formData[curTabKey].status != '3'"
              >
                <a-select-option v-for="(label, key) in organizationTypeDict" :key="key" :value="key" class="pl-5">
                  {{ label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item prop="name" label="机构名称">
              <a-input
                v-model="formData[curTabKey].name"
                placeholder="请输入机构名称"
                :disabled="formData[curTabKey].status != '3'"
              />
            </a-form-model-item>
            <a-form-model-item prop="legalPerson" label="法人">
              <a-input
                v-model="formData[curTabKey].legalPerson"
                placeholder="请输入法人"
                :disabled="formData[curTabKey].status != '3'"
              />
            </a-form-model-item>
            <a-form-model-item prop="idCard" label="法人身份证">
              <div class="h-0 overflow-hidden">
                <a-upload-dragger
                  class="dragUploader"
                  :multiple="true"
                  name="fileList"
                  :action="lingkeApi.uploadUrl"
                  :fileList="formData[curTabKey].idCard"
                  @change="info => handleFileChange(info, curTabKey, 'idCard', true)"
                  @preview="handleFileDownload"
                >
                  <div :ref="`formCtrl_${curTabKey}_idCard`" class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  </div>
                </a-upload-dragger>
              </div>
              <div class="flex flex-row items-start gap-8">
                <div
                  v-if="formData[curTabKey].idCard[0]"
                  class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
                >
                  <el-image
                    v-if="formData[curTabKey].idCard[0].downloadUrl"
                    class="w-28 h-auto"
                    :src="formData[curTabKey].idCard[0].downloadUrl"
                    :preview-src-list="[
                      formData[curTabKey].idCard[0].downloadUrl
                    ]"
                  >
                    <a-spin slot="placeholder" class="w-28 pt-4" />
                  </el-image>
                  <a-spin v-else class="w-28 pt-4" />
                  <div
                    v-if="formData[curTabKey].status === '3'"
                    class="text-gray-400 text-sm cursor-pointer hover:text-indigo-400"
                    @click="handleFileCtrlClick(curTabKey, 'idCard')"
                  >重新上传</div>
                </div>
                <div
                  v-else-if="formData[curTabKey].status === '3'"
                  class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md hover:border-indigo-400 hover:text-indigo-400"
                  @click="handleFileCtrlClick(curTabKey, 'idCard')"
                >
                  点击上传
                </div>
                <div
                  v-else
                  class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md"
                >
                  无
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item prop="businessLicense" label="营业执照">
              <div class="h-0 overflow-hidden">
                <a-upload-dragger
                  class="dragUploader"
                  :multiple="true"
                  name="fileList"
                  :action="lingkeApi.uploadUrl"
                  :fileList="formData[curTabKey].businessLicense"
                  @change="info => handleFileChange(info, curTabKey, 'businessLicense', true)"
                  @preview="handleFileDownload"
                >
                  <div :ref="`formCtrl_${curTabKey}_businessLicense`" class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  </div>
                </a-upload-dragger>
              </div>
              <div class="flex flex-row items-start gap-8">
                <div
                  v-if="formData[curTabKey].businessLicense[0]"
                  class="flex flex-col items-center gap-2 border border-solid border-gray-300 rounded-md p-2"
                >
                  <el-image
                    v-if="formData[curTabKey].businessLicense[0].downloadUrl"
                    class="w-28 h-auto"
                    :src="formData[curTabKey].businessLicense[0].downloadUrl"
                    :preview-src-list="[
                      formData[curTabKey].businessLicense[0].downloadUrl
                    ]"
                  >
                    <a-spin slot="placeholder" class="w-28 pt-4" />
                  </el-image>
                  <a-spin v-else class="w-28 pt-4" />
                  <div
                    v-if="formData[curTabKey].status === '3'"
                    class="text-gray-400 text-sm cursor-pointer hover:text-indigo-400"
                    @click="handleFileCtrlClick(curTabKey, 'businessLicense')"
                  >重新上传</div>
                </div>
                <div
                  v-else-if="formData[curTabKey].status === '3'"
                  class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md hover:border-indigo-400 hover:text-indigo-400"
                  @click="handleFileCtrlClick(curTabKey, 'businessLicense')"
                >
                  点击上传
                </div>
                <div
                  v-else
                  class="w-32 h-32 flex justify-center items-center border border-solid border-gray-300 cursor-pointer text-gray-400 text-base rounded-md"
                >
                  无
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item prop="name" label="审核状态">
              <div class="text-base font-bold">
                <div v-if="formData[curTabKey].status === '1'" class="text-blue-400">{{ formData[curTabKey].statusName }}</div>
                <div v-if="formData[curTabKey].status === '2'" class="text-green-400">{{ formData[curTabKey].statusName }}</div>
                <div v-if="formData[curTabKey].status === '3'" class="text-red-400">{{ formData[curTabKey].statusName + '，' + formData[curTabKey].remark }}</div>
              </div>
            </a-form-model-item>
          </template>
          <template v-if="curTabKey === '2'">
            <div class="text-sm text-gray-500 pb-3">当前密码：</div>
            <a-form-model-item prop="currentPasswd">
              <a-input
                v-model="formData[curTabKey].currentPasswd"
                placeholder="请输入当前密码"
              />
            </a-form-model-item>
            <div class="text-sm text-gray-500 pb-3">新密码：</div>
            <a-form-model-item prop="passWord">
              <a-input
                v-model="formData[curTabKey].passWord"
                placeholder="请输入新密码"
              />
            </a-form-model-item>
            <div class="text-sm text-gray-500 pb-3">确认新密码：</div>
            <a-form-model-item prop="rePassWord">
              <a-input
                v-model="formData[curTabKey].rePassWord"
                placeholder="请输入确认新密码"
              />
            </a-form-model-item>
          </template>
        </a-form-model>
      </div>
      <div class="pt-1 flex flex-row gap-5">
        <a-button
          v-if="curTabKey === '1' && formData[curTabKey].status === '3'"
          type="danger"
          class="step-btn w-40"
          @click="handleSave"
        >
          提交
        </a-button>
        <a-button
          v-if="curTabKey === '2'"
          type="primary"
          class="step-btn w-40"
          @click="handleSave"
        >
          确定
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

export default {
  name: 'PersonalCenter',
  components: {
  },
  data() {
    return {
      lingkeApi,
      loading: false,
      tabList: [
        {
          title: '企业信息',
          key: '1',
          icon: 'skin'
        },
        {
          title: '密码修改',
          key: '2',
          icon: 'hdd'
        }
      ],
      formData: {
        '1': {
          type: undefined,
          name: '',
          legalPerson: '',
          idCard: [],
          businessLicense: [],
          status: undefined,
          statusName: '',
          remark: ''
        },
        '2': {
          currentPasswd: '',
          passWord: '',
          rePassWord: ''
        }
      },
      formRules: {
        '1': {
          type: [
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
          ],
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
          legalPerson: [
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
        },
        '2': {
          currentPasswd: [
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
          passWord: [
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
          rePassWord: [
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
    organizationTypeDict() {
      return this.codeDict.organization && this.codeDict.organization.type || {}
    },
    curTabKey() {
      return this.$route.query.tab || '1'
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
        const res = await lingkeApi.organizationGetOne({
          userId: this.userInfo.userId
        })
        if (res && res.code === 200) {
          const organizationInfo = res.data
          const formData = {
            '1': {
              type: organizationInfo.type,
              name: organizationInfo.name,
              legalPerson: organizationInfo.legalPerson,
              idCard: this.parseFileNamesToObjs(organizationInfo.idCardList || []),
              businessLicense: this.parseFileNamesToObjs(organizationInfo.businessLicenseList || []),
              status: organizationInfo.status,
              statusName: organizationInfo.statusName,
              remark: organizationInfo.remark
            },
            '2': {
              currentPasswd: '',
              passWord: '',
              rePassWord: ''
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
        content: `确定提交吗?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const params = {
              userId: this.userInfo.userId
            }
            let res = null
            switch (this.curTabKey) {
              case '1':
                Object.assign(params, {
                  type: this.formData[this.curTabKey].type,
                  name: this.formData[this.curTabKey].name,
                  legalPerson: this.formData[this.curTabKey].legalPerson,
                  idCard: this.formData[this.curTabKey].idCard[0]?.downloadUrl || '',
                  businessLicense: this.formData[this.curTabKey].businessLicense[0]?.downloadUrl || ''
                })
                res = await lingkeApi.organizationUpdate(params)
                break
              case '2':
                Object.assign(params, {
                  currentPasswd: this.formData[this.curTabKey].currentPasswd,
                  passWord: this.formData[this.curTabKey].passWord,
                  rePassWord: this.formData[this.curTabKey].rePassWord
                })
                res = await lingkeApi.organizationChangePasswd(params)
                break
              default:
                break
            }
            if (res && res.data === 1) {
              await this.$store.dispatch('GetInfo')
              this.$message.success('提交成功')
              this.initFormData()
            } else {
              throw new Error(res.message || '提交失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    handleToTab(tab) {
      this.$router.push({ name: this.$route.name, query: { tab: tab.key } })
    },
    handleFileChange(info, formKey, itemKey, single) {
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          file.downloadUrl = file.response.data[0]
        }
        return file
      })
      this.formData[formKey][itemKey] = fileList
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
    handleFileCtrlClick(formKey, itemKey) {
      this.$refs[`formCtrl_${formKey}_${itemKey}`].click()
    }
  }
}
</script>

<style lang="less" scoped></style>
