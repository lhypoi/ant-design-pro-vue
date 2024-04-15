<template>
  <div class="w-full mx-auto max-w-[1200px] px-3 py-6 flex-auto flex flex-col sm:flex-row gap-4">
    <div class="bg-white rounded-xl p-6 sm:w-60 shadow-sm">
      <div class="flex justify-center items-center">
        <div class="w-20 h-20 rounded bg-blue-400 text-white flex justify-center items-center text-3xl leading-none">
          {{ userInfo.avatarFirstLetter }}
        </div>
      </div>
      <div class="pt-5 flex flex-row flex-wrap justify-between gap-4">
        <div
          v-for="tab in tabList"
          :key="tab.key"
          class="w-[calc(50%-8px)] flex flex-row justify-center gap-2 p-3 rounded-lg sm:w-full cursor-pointer"
          :class="
            tab.key === curTabKey
              ? 'bg-blue-500 text-white'
              : 'bg-gray-400 text-white hover:bg-blue-400 hover:text-white'
          "
          @click="handleToTab(tab)"
        >
          <div>
            <i :class="tab.icon" class="text-inherit"></i>
          </div>
          <div>
            {{ tab.title }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="link-style-form link-style-form-sm flex-auto min-h-[75vh] overflow-hidden bg-white rounded-xl py-5 px-2 shadow-sm flex flex-col"
      v-loading="loading"
    >
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
            <div class="text-base text-gray-950 font-bold pb-2">基础信息：</div>
            <a-form-model-item prop="nickName" label="昵称">
              <a-input v-model="formData[curTabKey].nickName" placeholder="请输入昵称" size="large" />
            </a-form-model-item>
          </template>
          <template v-if="curTabKey === '2'">
            <div>
              <a-result
                v-if="!formData[curTabKey].status"
                status="warning"
                title="待认证"
                sub-title="为保障您的权益，请尽快完成实名认证"
              />
              <a-result
                v-else-if="formData[curTabKey].status === '1'"
                status="info"
                title="审核中"
                sub-title="认证信息审核中，请耐心等待"
              />
              <a-result
                v-else-if="formData[curTabKey].status === '2'"
                status="success"
                title="认证成功"
                sub-title="已完成实名认证"
              />
              <a-result
                v-else-if="formData[curTabKey].status === '3'"
                status="error"
                title="认证失败"
                :sub-title="formData[curTabKey].remark || ''"
              />
            </div>
            <a-form-model-item prop="name" label="企业全称">
              <a-input
                v-model="formData[curTabKey].name"
                placeholder="请输入企业全称"
                :disabled="formData[curTabKey].status != '3'"
              />
            </a-form-model-item>
            <a-form-model-item prop="legalPerson" label="法人姓名">
              <a-input
                v-model="formData[curTabKey].legalPerson"
                placeholder="请输入法人姓名"
                :disabled="formData[curTabKey].status != '3'"
              />
            </a-form-model-item>
            <a-form-model-item prop="legalPhoneNumber" label="法人手机号码">
              <a-input v-model="formData[curTabKey].legalPhoneNumber" placeholder="请输入手机号码" size="large" />
            </a-form-model-item>
            <a-form-model-item prop="legalSmsCode" label="验证码" ref="legalSmsCode">
              <div class="flex flex-row gap-3">
                <a-input
                  v-model="formData[curTabKey].legalSmsCode"
                  placeholder="请输入验证码"
                  size="large"
                  @blur="
                    () => {
                      $refs.legalSmsCode.onFieldChange()
                    }
                  "
                  @change="
                    () => {
                      $refs.legalSmsCode.onFieldChange()
                    }
                  "
                />
                <a-button
                  class="send-code-btn"
                  type="primary"
                  :disabled="sendBtnData.disabled"
                  :loading="sendBtnData.loading"
                  @click="handleSendSmsCode(undefined, 'legalPhoneNumber', '1')"
                >
                  {{
                    sendBtnData.loading
                      ? '发送中'
                      : sendBtnData.disabled
                        ? `${sendBtnData.countdown}s 后重新发送`
                        : '发送验证码'
                  }}
                </a-button>
              </div>
            </a-form-model-item>
            <a-form-model-item prop="idNo" label="法人身份证号">
              <a-input v-model="formData[curTabKey].idNo" placeholder="请输入法人身份证号" size="large" />
            </a-form-model-item>
            <LinkFormItemImg
              formItemKey="cardFront"
              formItemLabel="身份证正面"
              :fileList.sync="formData[curTabKey]['cardFront']"
            />
            <LinkFormItemImg
              formItemKey="cardBack"
              formItemLabel="身份证反面"
              :fileList.sync="formData[curTabKey]['cardBack']"
            />
            <LinkFormItemImg
              formItemKey="businessLicense"
              formItemLabel="营业执照"
              :fileList.sync="formData[curTabKey]['businessLicense']"
            />
          </template>
          <template v-if="curTabKey === '3'">
            <div class="text-base text-gray-950 font-bold pb-2">
              持卡人（请在
              <span class="cursor-pointer text-blue-400" @click="handleToTab({ key: '2' })">企业认证</span> 中完善）：
            </div>
            <a-form-model-item label="持卡人姓名">
              <a-input v-model="formData[curTabKey].legalPerson" placeholder="无" size="large" disabled />
            </a-form-model-item>
            <a-form-model-item label="身份证号码">
              <a-input v-model="formData[curTabKey].idNo" placeholder="无" size="large" disabled />
            </a-form-model-item>
            <div class="text-base text-gray-950 font-bold pb-2">银行卡：</div>
            <a-form-model-item prop="bankBranch" label="开户行支行">
              <a-input v-model="formData[curTabKey].bankBranch" placeholder="请输入开户行支行" size="large" />
            </a-form-model-item>
            <a-form-model-item prop="bankNum" label="银行卡号码">
              <a-input v-model="formData[curTabKey].bankNum" placeholder="请输入银行卡号码" size="large" />
            </a-form-model-item>
          </template>
          <template v-if="curTabKey === '4'">
            <el-collapse
              accordion
            >
              <el-collapse-item
                v-for="subForm in tabList.find((tab) => tab.key === curTabKey).subFormList"
                :key="subForm.key"
                :name="subForm.key"
              >
                <div slot="title" class="text-base text-gray-950 font-bold">{{ subForm.title }}</div>
                <a-form-model
                  :ref="'form_' + subForm.key"
                  :model="formData[subForm.key]"
                  :rules="formRules[subForm.key]"
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  labelAlign="right"
                >
                  <template v-if="subForm.key === '41'">
                    <a-form-model-item v-if="formData[subForm.key].oldEmail" prop="oldEmail" label="当前邮箱">
                      <a-input v-model="formData[subForm.key].oldEmail" placeholder="无" size="large" disabled />
                    </a-form-model-item>
                    <a-form-model-item prop="email" :label="formData[subForm.key].oldEmail ? '新邮箱' : '邮箱'">
                      <a-input
                        v-model="formData[subForm.key].email"
                        :placeholder="formData[subForm.key].oldEmail ? '请输入新邮箱' : '请输入邮箱'"
                        size="large"
                      />
                    </a-form-model-item>
                    <a-form-model-item prop="emailCode" label="验证码" ref="emailCode">
                      <div class="flex flex-row gap-3">
                        <a-input
                          v-model="formData[subForm.key].emailCode"
                          placeholder="请输入验证码"
                          size="large"
                          @blur="
                            () => {
                              $refs.emailCode[0].onFieldChange()
                            }
                          "
                          @change="
                            () => {
                              $refs.emailCode[0].onFieldChange()
                            }
                          "
                        />
                        <a-button
                          class="send-code-btn"
                          type="primary"
                          :disabled="sendBtnData.disabled"
                          :loading="sendBtnData.loading"
                          @click="handleSendSmsCode(subForm.key, 'email')"
                        >
                          {{
                            sendBtnData.loading
                              ? '发送中'
                              : sendBtnData.disabled
                                ? `${sendBtnData.countdown}s 后重新发送`
                                : '发送验证码'
                          }}
                        </a-button>
                      </div>
                    </a-form-model-item>
                    <a-row>
                      <a-col :sm="{ offset: 3 }">
                        <a-button type="primary" class="send-code-btn success-btn" @click="handleSave(subForm.key)">
                          {{ formData[subForm.key].oldEmail ? '更换邮箱' : '绑定邮箱' }}
                        </a-button>
                      </a-col>
                    </a-row>
                  </template>
                  <template v-if="subForm.key === '44'">
                    <a-form-model-item v-if="formData[subForm.key].oldPhone" prop="oldPhone" label="当前手机号">
                      <a-input v-model="formData[subForm.key].oldPhone" placeholder="无" size="large" disabled />
                    </a-form-model-item>
                    <a-form-model-item prop="phone" :label="formData[subForm.key].oldPhone ? '新手机号' : '手机号'">
                      <a-input
                        v-model="formData[subForm.key].phone"
                        :placeholder="formData[subForm.key].oldPhone ? '请输入新手机号' : '请输入手机号'"
                        size="large"
                      />
                    </a-form-model-item>
                    <a-form-model-item prop="phoneCode" label="验证码" ref="phoneCode">
                      <div class="flex flex-row gap-3">
                        <a-input
                          v-model="formData[subForm.key].phoneCode"
                          placeholder="请输入验证码"
                          size="large"
                          @blur="
                            () => {
                              $refs.phoneCode[0].onFieldChange()
                            }
                          "
                          @change="
                            () => {
                              $refs.phoneCode[0].onFieldChange()
                            }
                          "
                        />
                        <a-button
                          class="send-code-btn"
                          type="primary"
                          :disabled="sendBtnData.disabled"
                          :loading="sendBtnData.loading"
                          @click="handleSendSmsCode(subForm.key, 'phone', '1')"
                        >
                          {{
                            sendBtnData.loading
                              ? '发送中'
                              : sendBtnData.disabled
                                ? `${sendBtnData.countdown}s 后重新发送`
                                : '发送验证码'
                          }}
                        </a-button>
                      </div>
                    </a-form-model-item>
                    <a-row>
                      <a-col :sm="{ offset: 3 }">
                        <a-button type="primary" class="send-code-btn success-btn" @click="handleSave(subForm.key)">
                          {{ formData[subForm.key].oldPhone ? '更换手机号' : '绑定手机号' }}
                        </a-button>
                      </a-col>
                    </a-row>
                  </template>
                  <template v-if="subForm.key === '42'">
                    <a-form-model-item prop="wechatName" label="微信号">
                      <a-input v-model="formData[subForm.key]['wechatName']" placeholder="无" size="large" disabled />
                    </a-form-model-item>
                    <a-row>
                      <a-col :sm="{ offset: 3 }">
                        <a-button type="primary" class="send-code-btn success-btn">
                          {{ formData[subForm.key]['openId'] ? '更换微信' : '绑定微信' }}
                        </a-button>
                      </a-col>
                    </a-row>
                  </template>
                  <template v-if="subForm.key === '43'">
                    <a-form-model-item prop="email" label="邮箱">
                      <a-input v-model="formData[subForm.key].email" placeholder="无" size="large" disabled />
                    </a-form-model-item>
                    <a-form-model-item prop="emailCodeForPassWord" label="验证码" ref="emailCodeForPassWord">
                      <div class="flex flex-row gap-3">
                        <a-input
                          v-model="formData[subForm.key].emailCodeForPassWord"
                          placeholder="请输入验证码"
                          size="large"
                          @blur="
                            () => {
                              $refs.emailCodeForPassWord[0].onFieldChange()
                            }
                          "
                          @change="
                            () => {
                              $refs.emailCodeForPassWord[0].onFieldChange()
                            }
                          "
                        />
                        <a-button
                          class="send-code-btn"
                          type="primary"
                          :disabled="!formData[subForm.key].email || sendBtnData.disabled"
                          :loading="sendBtnData.loading"
                          @click="handleSendSmsCode(subForm.key, 'email')"
                        >
                          {{
                            sendBtnData.loading
                              ? '发送中'
                              : sendBtnData.disabled
                                ? `${sendBtnData.countdown}s 后重新发送`
                                : '发送验证码'
                          }}
                        </a-button>
                      </div>
                    </a-form-model-item>
                    <a-form-model-item prop="newPassWord" label="新密码">
                      <a-input-password autocomplete="new-passWord" v-model="formData[subForm.key].newPassWord" placeholder="请输入新密码" size="large" />
                    </a-form-model-item>
                    <a-form-model-item prop="confirmPassWord" label="确认密码">
                      <a-input-password v-model="formData[subForm.key].confirmPassWord" placeholder="请再次输入新密码" size="large" />
                    </a-form-model-item>
                    <a-row>
                      <a-col :sm="{ offset: 3 }">
                        <a-button type="primary success-btn" class="send-code-btn" @click="handleSave(subForm.key)">
                          确定
                        </a-button>
                      </a-col>
                    </a-row>
                  </template>
                </a-form-model>
              </el-collapse-item>
            </el-collapse>
          </template>
          <template v-if="curTabKey === '5'">
            <div class="flex flex-col items-center pt-5">
              <div class="relative w-56 h-56" >
                <el-image
                  class="absolute w-full h-full"
                  :src="require('@/assets/link/avatar.png')"
                />
              </div>
              <div class="text-lg font-bold pt-6">微信扫码关注公众号</div>
              <div class="text-sm text-gray-400 pt-1">及时获取最新订单通知</div>
            </div>
          </template>
        </a-form-model>
      </div>
      <div class="pt-4 flex flex-row justify-center gap-5">
        <a-button v-if="curTabKey === '1'" type="primary" class="step-btn w-40 success-btn" @click="handleSave()">
          保存
        </a-button>
        <a-button v-if="curTabKey === '2'" type="primary" class="step-btn w-40 success-btn" @click="handleSave()">
          提交审核
        </a-button>
        <a-button v-if="curTabKey === '3'" type="primary" class="step-btn w-40 success-btn" @click="handleSave()">
          绑定
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
import LinkFormItemImg from '@/components/Kira/LinkFormItemImg'

export default {
  name: 'PersonalCenter',
  components: {
    LinkFormItemImg
  },
  data() {
    return {
      lingkeApi,
      loading: false,
      sendBtnData: {
        disabled: false,
        loading: false,
        countdown: 60,
        timer: null
      },
      tabList: [
        {
          title: '企业信息',
          key: '1',
          icon: 'el-icon-user-solid'
        },
        {
          title: '企业认证',
          key: '2',
          icon: 'el-icon-c-scale-to-original'
        },
        {
          title: '付款信息',
          key: '3',
          icon: 'el-icon-bank-card'
        },
        {
          title: '账号设置',
          key: '4',
          icon: 'el-icon-setting',
          subFormList: [
            {
              title: '邮箱',
              key: '41'
            },
            {
              title: '手机',
              key: '44'
            },
            {
              title: '微信',
              key: '42'
            },
            {
              title: '密码',
              key: '43'
            }
          ]
        },
        {
          title: '消息提醒',
          key: '5',
          icon: 'el-icon-message'
        }
      ],
      formData: {
        1: {
          nickName: ''
        },
        2: {
          name: '',
          legalPerson: '',
          legalPhoneNumber: '',
          legalSmsCode: '',
          idNo: '',
          cardFront: [],
          cardBack: [],
          businessLicense: [],
          status: undefined,
          remark: ''
        },
        3: {
          legalPerson: '',
          idNo: '',
          bankBranch: '',
          bankNum: ''
        },
        51: {
          oldEmail: '',
          email: '',
          emailCode: ''
        },
        52: {
          openId: '',
          wechatName: ''
        },
        53: {
          email: '',
          emailCodeForPassWord: '',
          newPassWord: '',
          confirmPassWord: ''
        },
        54: {
          oldPhone: '',
          phone: '',
          phoneCode: ''
        }
      },
      formRules: {
        1: {
          nickName: [
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
        2: {
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
          ],
          legalPhoneNumber: [
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
          legalSmsCode: [
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
          idNo: [
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
          cardFront: [
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
          cardBack: [
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
          businessLicense: [
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
          ]
        },
        3: {
          bankBranch: [
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
          bankNum: [
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
        41: {
          email: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error(this.formData[41]['oldEmail'] ? '请输入新邮箱' : '请输入邮箱'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          emailCode: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入验证码'))
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
        42: {},
        43: {
          emailCodeForPassWord: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入验证码'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          newPassWord: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入新密码'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          confirmPassWord: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入确认密码'))
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
        44: {
          phone: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error(this.formData[44]['oldPhone'] ? '请输入新手机号' : '请输入手机号'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          phoneCode: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入验证码'))
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
    ...mapState(CUR_APP, ['userInfo', 'localDict']),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    curTabKey() {
      return this.$route.query.tab || '1'
    }
  },
  created() {},
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
            1: {
              nickName: organizationInfo.nickName
            },
            2: {
              name: organizationInfo.name,
              legalPerson: organizationInfo.legalPerson,
              legalPhoneNumber: organizationInfo.legalPhoneNumber,
              legalSmsCode: '',
              idNo: organizationInfo.idNo,
              cardFront: organizationInfo.cardFront ? this.parseFileNamesToObjs([organizationInfo.cardFront]) : [],
              cardBack: organizationInfo.cardBack ? this.parseFileNamesToObjs([organizationInfo.cardBack]) : [],
              businessLicense: this.parseFileNamesToObjs(organizationInfo.businessLicenseList || []),
              status: organizationInfo.status,
              remark: organizationInfo.remark
            },
            3: {
              legalPerson: organizationInfo.legalPerson,
              idNo: organizationInfo.idNo,
              bankBranch: organizationInfo.bankBranch,
              bankNum: organizationInfo.bankNum
            },
            41: {
              oldEmail: organizationInfo.email || '',
              email: '',
              emailCode: ''
            },
            42: {
              openId: '',
              wechatName: ''
            },
            43: {
              email: organizationInfo.email || '',
              emailCodeForPassWord: '',
              newPassWord: '',
              confirmPassWord: ''
            },
            44: {
              oldPhone: organizationInfo.legalPhoneNumber || '',
              phone: '',
              phoneCode: ''
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
    getFormRef(subFormKey) {
      const formKey = subFormKey || this.curTabKey
      return Array.isArray(this.$refs['form_' + formKey])
        ? this.$refs['form_' + formKey][0]
        : this.$refs['form_' + formKey]
    },
    async handleSave(subFormKey) {
      try {
        await this.getFormRef(subFormKey).validate()
      } catch {
        this.$message.error('填写信息不符合要求，请检查')
        return
      }
      let defaultTitle = '提示'
      let defaultMessageAction = '保存'
      let defaultContent = () => `确定${defaultMessageAction}吗`
      if (!subFormKey) {
        switch (this.curTabKey) {
          case '2':
            defaultMessageAction = '提交'
            break
          case '3':
            defaultMessageAction = '绑定'
            break
        }
      } else {
        switch (subFormKey) {
          case '41':
          case '43':
            defaultMessageAction = '绑定'
            break
          case '44':
            defaultTitle = '修改密码'
            defaultMessageAction = '修改'
            defaultContent = () => `修改密码后将重新登陆`
            break
        }
      }
      this.$confirm({
        title: defaultTitle,
        content: defaultContent(),
        icon: () => null,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const params = {
              userId: this.userInfo.userId
            }
            let res = null
            if (!subFormKey) {
              const formData = this.formData[this.curTabKey]
              switch (this.curTabKey) {
                case '1':
                  Object.assign(params, {
                    nickName: formData.nickName
                    // highEduLevel: formData.highEduLevel,
                    // major: formData.major,
                    // college: formData.college,
                    // advantage: formData.advantage,
                    // want: formData.want.join(','),
                    // sample: formData.want.includes('3')
                    //   ? formData.sample
                    //       .filter((file) => file.downloadUrl)
                    //       .map((file) => file.downloadUrl)
                    //       .join(',')
                    //   : '',
                    // diploma: formData.diploma[0]?.response && formData.diploma[0].downloadUrl,
                    // transcript: formData.transcript[0]?.response && formData.transcript[0].downloadUrl
                  })
                  break
                case '2':
                  Object.assign(params, {
                    cv: (formData.cv[0]?.response && formData.cv[0].downloadUrl) || ''
                  })
                  break
                case '3':
                  Object.assign(params, {
                    visa: formData.visa[0]?.response && formData.visa[0].downloadUrl
                  })
                  break
                case '4':
                  Object.assign(params, {
                    bankBranch: formData.bankBranch,
                    bankNum: formData.bankNum
                  })
                  break
                default:
                  break
              }
              res = await lingkeApi.organizationUpdate(params)
            } else {
              const formData = this.formData[subFormKey]
              switch (subFormKey) {
                case '51':
                  Object.assign(params, {
                    email: formData.email,
                    smsCode: formData.emailCode
                  })
                  res = await lingkeApi.teacherChangeEmail(params)
                  break
                case '52':
                  break
                case '53':
                  Object.assign(params, {
                    email: formData.email,
                    smsCode: formData.emailCodeForPassWord,
                    passWord: formData.newPassWord,
                    rePassWord: formData.confirmPassWord
                  })
                  res = await lingkeApi.teacherChangePasswd(params)
                  break
                default:
                  break
              }
            }
            if (res && res.data === 1) {
              await this.$store.dispatch('GetInfo')
              this.$message.success(defaultMessageAction + '成功')
              this.initFormData()
            } else {
              throw new Error(res.message || defaultMessageAction + '失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    async handleSendSmsCode(subFormKey, itemKey, sendType) {
      const isFormValid = await new Promise((resolve) => {
        this.getFormRef(subFormKey).validateField(itemKey, (err) => {
          resolve(!err)
        })
      })
      if (!isFormValid) return
      this.sendBtnData.disabled = true
      this.sendBtnData.loading = true
      try {
        const res = await lingkeApi.sendSmsCode({
          account: this.formData[subFormKey || this.curTabKey][itemKey],
          type: sendType || '2'
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
    handleToTab(tab) {
      this.$router.push({ name: this.$route.name, query: { tab: tab.key } })
      this.getFormRef().clearValidate()
    },
    handleFileChange(info, formKey, itemKey, single) {
      let fileList = [...info.fileList]
      if (single) fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.downloadUrl = file.response.data[0]
        }
        return file
      })
      this.formData[formKey][itemKey] = fileList
    },
    parseFileNamesToObjs(names) {
      return names.map((name) => {
        const [, , fileName, , fileExtension] = name.match(/(.*?\[.*?\])?(.*)(-.*?)(\..*)$/) || []
        return {
          uid: name,
          name: fileName + fileExtension || name,
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
