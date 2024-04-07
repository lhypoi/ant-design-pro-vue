<template>
  <div class="flex-auto flex flex-col sm:flex-row gap-4">
    <div class="bg-white rounded-3xl p-6 sm:w-60">
      <div class="text-2xl font-bold text-slate-900">账号设置</div>
      <div class="text-sm text-slate-400">Account Setting</div>
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
            <a-form-model-item prop="name" label="当前ID">
              <a-input
                v-model="formData[curTabKey].name"
                :disabled="true"
              />
            </a-form-model-item>
            <a-divider style="margin: 0px; padding: 16px 0 0;">
              <span class="text-gray-400 font-normal text-sm">微信绑定</span>
            </a-divider>
            <a-form-model-item prop="wxName" label="微信名" ref="wxName">
              <div class="flex flex-row gap-3">
                <a-input
                  v-model="formData[curTabKey].wxName"
                  :disabled="true"
                />
                <a-button
                  class="send-code-btn success-btn"
                  type="primary"
                  @click="$refs.WxLoginModal.handleShowWxLoginModalParams({
                    state: WX_LOGIN_STATE.T_ACCOUNT_SETTING
                  })"
                >{{ formData[curTabKey].wxName ? `重新绑定` : '添加微信' }}</a-button>
              </div>
            </a-form-model-item>
            <a-divider style="margin: 0px; padding: 16px 0 0;">
              <span class="text-gray-400 font-normal text-sm">手机号绑定</span>
            </a-divider>
            <a-form-model-item prop="phoneNumber" label="当前手机号">
              <a-input
                v-model="formData[curTabKey].phoneNumber"
                :disabled="true"
              />
            </a-form-model-item>
            <a-form-model-item prop="newPhoneNumber" label="新手机号">
              <a-input
                v-model="formData[curTabKey].newPhoneNumber"
                placeholder="请输入新手机号"
              />
            </a-form-model-item>
            <a-form-model-item prop="smsCode" label="验证码" ref="smsCode">
              <div class="flex flex-row gap-3">
                <a-input
                  v-model="formData[curTabKey].smsCode"
                  placeholder="请输入验证码"
                  @blur="() => { $refs.smsCode.onFieldChange() }"
                  @change="() => { $refs.smsCode.onFieldChange() }"
                />
                <a-button
                  class="send-code-btn"
                  type="primary"
                  :disabled="sendBtnData.disabled"
                  :loading="sendBtnData.loading"
                  @click="handleSendSmsCode('newPhoneNumber')"
                >{{ sendBtnData.disabled ? `发送验证码(${ sendBtnData.countdown }s)` : '发送验证码' }}</a-button>
              </div>
            </a-form-model-item>
          </template>
          <template v-if="curTabKey === '2'">
            <a-form-model-item prop="phoneNumber" label="当前账号">
              <a-input
                v-model="formData[curTabKey].phoneNumber"
                :disabled="true"
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
            <a-form-model-item prop="smsCode" label="验证码" ref="smsCode">
              <div class="flex flex-row gap-3">
                <a-input
                  v-model="formData[curTabKey].smsCode"
                  placeholder="请输入验证码"
                  @blur="() => { $refs.smsCode.onFieldChange() }"
                  @change="() => { $refs.smsCode.onFieldChange() }"
                />
                <a-button
                  class="send-code-btn"
                  type="primary"
                  :disabled="sendBtnData.disabled"
                  :loading="sendBtnData.loading"
                  @click="handleSendSmsCode('phoneNumber')"
                >{{ sendBtnData.disabled ? `发送验证码(${ sendBtnData.countdown }s)` : '发送验证码' }}</a-button>
              </div>
            </a-form-model-item>
          </template>
          <template v-if="curTabKey === '3'">
            <div class="flex flex-col items-center gap-y-8">
              <div class="relative w-56 h-56" >
                <el-image
                  class="absolute w-full h-full"
                  :src="require('@/assets/link/avatar.png')"
                />
              </div>
              <div class="text-lg">扫码关注公众号，可及时接收平台消息，防止客官漏掉重要消息哦。</div>
            </div>
          </template>
        </a-form-model>
      </div>
      <div v-if="curTabKey === '1' || curTabKey === '2'" class="pt-1 flex flex-row gap-5">
        <a-button
          type="primary"
          class="step-btn w-40"
          @click="handleSave"
        >
          提交
        </a-button>
      </div>
    </div>
    <WxLoginModal ref="WxLoginModal" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import { downloadFile } from '@/utils//util.js'
import { WX_LOGIN_STATE } from '@/store/mutation-types-link-dev'
import WxLoginModal from '@/components/Kira/WxLoginModal'

export default {
  name: 'TAccountSetting',
  components: {
    WxLoginModal
  },
  data() {
    return {
      lingkeApi,
      WX_LOGIN_STATE,
      loading: false,
      tabList: [
        {
          title: '账号绑定',
          key: '1',
          icon: 'skin'
        },
        {
          title: '密码修改',
          key: '2',
          icon: 'hdd'
        },
        {
          title: '消息提醒设置',
          key: '3',
          icon: 'message'
        }
      ],
      formData: {
        '1': {
          name: '',
          phoneNumber: '',
          newPhoneNumber: '',
          smsCode: ''
        },
        '2': {
          phoneNumber: '',
          passWord: '',
          rePassWord: '',
          smsCode: ''
        }
      },
      formRules: {
        '1': {
          newPhoneNumber: [
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
          smsCode: [
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
          ],
          smsCode: [
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
      sendBtnData: {
        disabled: false,
        loading: false,
        countdown: 0,
        timer: null
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
    async handleSendSmsCode(formItemKey) {
      const isFormValid = await new Promise((resolve) => {
        this.$refs['form_' + this.curTabKey].validateField(formItemKey, (err) => {
          resolve(!err)
        })
      })
      if (!isFormValid) return
      this.sendBtnData.disabled = true
      this.sendBtnData.loading = true
      try {
        const res = await lingkeApi.sendSmsCode({
          phoneNumber: this.formData[this.curTabKey][formItemKey]
        })
        if (res && res.code === 200) {
          this.$message.success('发送成功')
          this.sendBtnData.timer = setInterval(() => {
            this.sendBtnData.countdown--
            if (this.sendBtnData.countdown <= 0) {
              clearInterval(this.sendBtnData.timer)
              this.sendBtnData.timer = null
              this.sendBtnData.countdown = 60
              this.sendBtnData.disabled = false
            }
          }, 1000)
        } else {
          throw new Error(res.message || '发送失败')
        }
      } catch (error) {
        this.sendBtnData.disabled = false
        this.$message.error(error.message)
        console.log(error)
      }
      this.sendBtnData.loading = false
    },
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
              phoneNumber: teacherInfo.phoneNumber,
              newPhoneNumber: '',
              smsCode: ''
            },
            '2': {
              phoneNumber: teacherInfo.phoneNumber,
              passWord: '',
              rePassWord: '',
              smsCode: ''
            }
          }
          this.formData = formData
          this.sendBtnData = {
            disabled: false,
            loading: false,
            countdown: 60,
            timer: null
          }
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
                  phoneNumber: this.formData[this.curTabKey].newPhoneNumber,
                  smsCode: this.formData[this.curTabKey].smsCode
                })
                res = await lingkeApi.teacherUpdate(params)
                break
              case '2':
                Object.assign(params, {
                  phoneNumber: this.formData[this.curTabKey].phoneNumber,
                  passWord: this.formData[this.curTabKey].passWord,
                  rePassWord: this.formData[this.curTabKey].rePassWord,
                  smsCode: this.formData[this.curTabKey].smsCode
                })
                res = await lingkeApi.teacherChangePasswd(params)
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
    }
  }
}
</script>

<style lang="less" scoped></style>
