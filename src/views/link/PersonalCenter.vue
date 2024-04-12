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
            <a-form-model-item prop="nickName" label="昵称">
              <a-input v-model="formData[curTabKey].nickName" placeholder="请输入昵称" size="large" />
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
              <a-input v-model="formData[curTabKey].major" placeholder="请输入专业" size="large" />
            </a-form-model-item>
            <a-form-model-item prop="college" label="学校">
              <a-input v-model="formData[curTabKey].college" placeholder="请输入毕业大学" size="large" />
            </a-form-model-item>
            <LinkFormItemImg
              formItemKey="diploma"
              formItemLabel="毕业证/学生证"
              :fileList.sync="formData[curTabKey]['diploma']"
              :illustrativeGraphsUrl="illustrativeGraphs['diploma']"
            />
            <LinkFormItemImg
              formItemKey="transcript"
              formItemLabel="成绩单"
              :fileList.sync="formData[curTabKey]['transcript']"
              :illustrativeGraphsUrl="illustrativeGraphs['transcript']"
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
                :options="Object.keys(orderTypeDict).map((key) => ({ value: key, label: orderTypeDict[key] }))"
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
                @change="(info) => handleFileChange(info, curTabKey, 'sample', -5)"
                @preview="handleFileDownload"
              >
                <div class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10">
                  <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                  <div class="pt-4 text-slate-950 text-lg font-bold">
                    请上传留学文书sample，支持上传多个，<span class="text-red-400">至多五個</span>
                  </div>
                  <div class="pt-2 text-sm text-gray-400">可导入pdf / docx / doc 格式，最大10MB</div>
                </div>
              </a-upload-dragger>
            </a-form-model-item>
          </template>
          <template v-if="curTabKey === '2'">
            <div :class="formData[curTabKey].cv[0]?.downloadUrl ? 'h-0 overflow-hidden' : ''">
              <a-form-model-item prop="cv" :wrapper-col="{ span: 24 }">
                <a-upload-dragger
                  class="dragUploader"
                  :multiple="true"
                  name="fileList"
                  :action="lingkeApi.uploadUrl"
                  :fileList="formData[curTabKey].cv"
                  @change="(info) => handleFileChange(info, curTabKey, 'cv', true)"
                  @preview="handleFileDownload"
                >
                  <div
                    :ref="`formCtrl_${curTabKey}_cv`"
                    class="rounded-md bg-sky-50 flex flex-col items-center pt-14 pb-10"
                  >
                    <a-icon type="cloud-upload" class="text-4xl text-gray-400" />
                    <div class="pt-4 text-slate-950 text-lg font-bold">请上传简历</div>
                    <div class="pt-2 text-sm text-gray-400">可导入pdf / docx / doc 格式，最大10MB</div>
                  </div>
                </a-upload-dragger>
              </a-form-model-item>
            </div>
            <template v-if="formData[curTabKey].cv[0]?.downloadUrl">
              <div class="flex justify-end gap-4 pb-3">
                <div class="text-sm cursor-pointer text-red-400" @click="handleDelCv">删除</div>
                <div class="text-sm cursor-pointer text-blue-400" @click="handleFileCtrlClick(curTabKey, 'cv')">
                  重新上传
                </div>
              </div>
              <div :class="pdfBoxParams.loading ? 'overflow-hidden' : 'overflow-auto'">
                <a-spin
                  v-if="pdfBoxParams.loading"
                  class="absolute z-10 left-0 right-0 top-0 bottom-0 bg-gray-300 flex flex-col gap-5 justify-center items-center"
                  tip="加载中......"
                >
                  <a-icon slot="indicator" type="loading" class="text-4xl" spin />
                </a-spin>
                <div class="pdf-box p-3 bg-gray-500 min-h-full">
                  <vue-pdf-embed
                    ref="pdf"
                    :source="formData[curTabKey].cv[0].downloadUrl"
                    @progress="handlePdfProgress"
                  />
                </div>
              </div>
            </template>
          </template>
          <template v-if="curTabKey === '3'">
            <div>
              <a-result
                v-if="formData[curTabKey].status === '0'"
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
                :sub-title="formData[curTabKey].remark || '认证失败，请重新提交'"
              />
            </div>
            <a-form-model-item prop="realName" label="姓名">
              <a-input v-model="formData[curTabKey].realName" placeholder="请输入真实姓名" size="large" />
            </a-form-model-item>
            <a-form-model-item prop="phoneNumber" label="手机号码">
              <a-input v-model="formData[curTabKey].phoneNumber" placeholder="请输入手机号码" size="large" />
            </a-form-model-item>
            <a-form-model-item prop="certificationSmsCode" label="验证码" ref="certificationSmsCode">
              <div class="flex flex-row gap-3">
                <a-input
                  v-model="formData[curTabKey].certificationSmsCode"
                  placeholder="请输入验证码"
                  size="large"
                  @blur="
                    () => {
                      $refs.certificationSmsCode.onFieldChange()
                    }
                  "
                  @change="
                    () => {
                      $refs.certificationSmsCode.onFieldChange()
                    }
                  "
                />
                <a-button
                  class="send-code-btn"
                  type="primary"
                  :disabled="sendBtnData.disabled"
                  :loading="sendBtnData.loading"
                  @click="handleSendSmsCode(undefined, 'phoneNumber')"
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
            <a-form-model-item prop="idNo" label="身份证号">
              <a-input v-model="formData[curTabKey].idNo" placeholder="请输入身份证号" size="large" />
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
          </template>
          <template v-if="curTabKey === '4'">
            <div class="text-base text-gray-950 font-bold pb-2">
              持卡人（请在
              <span class="cursor-pointer text-blue-400" @click="handleToTab({ key: '3' })">实名认证</span> 中完善）：
            </div>
            <a-form-model-item label="持卡人姓名">
              <a-input v-model="formData[curTabKey].realName" placeholder="无" size="large" disabled />
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
          <template v-if="curTabKey === '5'">
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
                  <template v-if="subForm.key === '51'">
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
                  <template v-if="subForm.key === '52'">
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
                  <template v-if="subForm.key === '53'">
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
          <template v-if="curTabKey === '6'">
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
        <a-button
          v-if="curTabKey === '1' || curTabKey === '2'"
          type="primary"
          class="step-btn w-40 success-btn"
          @click="handleSave()"
        >
          保存
        </a-button>
        <a-button v-if="curTabKey === '3'" type="primary" class="step-btn w-40 success-btn" @click="handleSave()">
          提交审核
        </a-button>
        <a-button v-if="curTabKey === '4'" type="primary" class="step-btn w-40 success-btn" @click="handleSave()"> 绑定 </a-button>
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
      sendBtnData: {
        disabled: false,
        loading: false,
        countdown: 60,
        timer: null
      },
      tabList: [
        {
          title: '个人信息',
          key: '1',
          icon: 'el-icon-user-solid'
        },
        {
          title: '附件简历',
          key: '2',
          icon: 'el-icon-date'
        },
        {
          title: '实名认证',
          key: '3',
          icon: 'el-icon-c-scale-to-original'
        },
        {
          title: '收款信息',
          key: '4',
          icon: 'el-icon-bank-card'
        },
        {
          title: '账号设置',
          key: '5',
          icon: 'el-icon-setting',
          subFormList: [
            {
              title: '邮箱',
              key: '51'
            },
            {
              title: '微信',
              key: '52'
            },
            {
              title: '密码',
              key: '53'
            }
          ]
        },
        {
          title: '消息提醒',
          key: '6',
          icon: 'el-icon-message'
        }
      ],
      formData: {
        1: {
          nickName: '',
          highEduLevel: undefined,
          major: '',
          college: '',
          diploma: [],
          transcript: [],
          advantage: '',
          want: [],
          sample: []
        },
        2: {
          cv: []
        },
        3: {
          status: '1',
          remark: '',
          realName: '',
          phoneNumber: '',
          certificationSmsCode: '',
          idNo: '',
          cardFront: [],
          cardBack: []
        },
        4: {
          realName: '',
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
        }
      },
      formRules: {
        1: {
          nickName: [
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
          ]
        },
        2: {},
        3: {
          realName: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入真实姓名'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          phoneNumber: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入手机号码'))
                  }
                } catch (error) {
                  console.log(error)
                  callback(error)
                }
                callback()
              }
            }
          ],
          certificationSmsCode: [
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
          idNo: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入身份证号'))
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
                    callback(new Error('请上传身份证正面照片'))
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
                    callback(new Error('请上传身份证反面照片'))
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
        4: {
          bankBranch: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error('请输入开户行支行'))
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
                    callback(new Error('请输入银行卡号码'))
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
        51: {
          email: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.trim()) {
                    callback(new Error(this.formData[51]['oldEmail'] ? '请输入新邮箱' : '请输入邮箱'))
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
        52: {},
        53: {
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
    ...mapState(CUR_APP, ['userInfo', 'localDict']),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    curTabKey() {
      return this.$route.query.tab || '1'
    },
    highEduLevelDict() {
      return (this.codeDict.teacher && this.codeDict.teacher.highEduLevel) || {}
    },
    orderTypeDict() {
      return (this.codeDict.order && this.codeDict.order.type) || {}
    },
    infoFullPercent() {
      const percent =
        (Object.keys(this.formData['1'])
          .filter(
            (key) =>
              key === 'nickName' ||
              key === 'highEduLevel' ||
              key === 'major' ||
              key === 'college' ||
              key === 'advantage' ||
              key === 'want' ||
              key === 'diploma' ||
              key === 'transcript'
          )
          .filter((key) => {
            return this.formData['1'][key] && this.formData['1'][key].length
          }).length /
          8) *
        100
      return parseInt(percent)
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
        const res = await lingkeApi.teacherGetOne({
          userId: this.userInfo.userId
        })
        if (res && res.code === 200) {
          const teacherInfo = res.data
          console.log(teacherInfo)
          const formData = {
            1: {
              nickName: teacherInfo.nickName,
              highEduLevel: teacherInfo.highEduLevel,
              major: teacherInfo.major,
              college: teacherInfo.college,
              advantage: teacherInfo.advantage,
              want: (teacherInfo.want || '').split(','),
              sample: this.parseFileNamesToObjs(teacherInfo.sampleList || []),
              diploma: this.parseFileNamesToObjs(teacherInfo.diplomaList || []),
              transcript: this.parseFileNamesToObjs(teacherInfo.transcriptList || [])
            },
            2: {
              cv: this.parseFileNamesToObjs(teacherInfo.cvList || [])
            },
            3: {
              status: '1',
              remark: '',
              realName: '',
              phoneNumber: '',
              certificationSmsCode: '',
              idNo: '',
              cardFront: [],
              cardBack: []
            },
            4: {
              realName: '',
              idNo: '',
              bankBranch: teacherInfo.bankBranch,
              bankNum: teacherInfo.bankNum
            },
            51: {
              oldEmail: teacherInfo.email || '',
              email: '',
              emailCode: ''
            },
            52: {
              openId: '',
              wechatName: ''
            },
            53: {
              email: teacherInfo.email || '',
              emailCodeForPassWord: '',
              newPassWord: '',
              confirmPassWord: ''
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
      return Array.isArray(this.$refs['form_' + formKey]) ? this.$refs['form_' + formKey][0] : this.$refs['form_' + formKey]
    },
    async handleSave(subFormKey) {
      try {
        await this.getFormRef(subFormKey).validate()
      } catch {
        this.$message.error('填写信息不符合要求，请检查')
        return
      }
      let defaultMessageAction = '保存'
      if (!subFormKey) {
        switch (this.curTabKey) {
          case '3':
            defaultMessageAction = '提交'
            break
          case '4':
            defaultMessageAction = '绑定'
            break
        }
      } else {
        switch (subFormKey) {
          case '51':
            defaultMessageAction = '绑定'
            break
          case '53':
            defaultMessageAction = '修改'
            break
        }
      }
      this.$confirm({
        title: '提示',
        content: `确定${defaultMessageAction}吗?`,
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
                    nickName: formData.nickName,
                    highEduLevel: formData.highEduLevel,
                    major: formData.major,
                    college: formData.college,
                    advantage: formData.advantage,
                    want: formData.want.join(','),
                    sample: formData.want.includes('3')
                      ? formData.sample
                          .filter((file) => file.downloadUrl)
                          .map((file) => file.downloadUrl)
                          .join(',')
                      : '',
                    diploma: formData.diploma[0]?.response && formData.diploma[0].downloadUrl,
                    transcript: formData.transcript[0]?.response && formData.transcript[0].downloadUrl
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
              res = await lingkeApi.teacherUpdate(params)
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
    handleDelCv() {
      this.$confirm({
        title: '提示',
        content: `确定删除吗?`,
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          this.formData[this.curTabKey].cv = []
        }
      })
    },
    async handleSendSmsCode(subFormKey, itemKey) {
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
          type: '2'
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
      this.$router.push({ name: 'PersonalCenter', query: { tab: tab.key } })
      this.getFormRef().clearValidate()
    },
    handleFileChange(info, formKey, itemKey, single) {
      let fileList = [...info.fileList]
      if (single === true) {
        fileList = fileList.slice(-1)
      } else if (single < 0) {
        fileList = fileList.slice(single)
      }
      fileList = fileList.map((file) => {
        if (file.response) {
          if (file.response.code === 200) {
            file.downloadUrl = file.response.data[0]
          } else {
            this.$message.error(file.response.message || '上传失败')
          }
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
    },
    handlePdfProgress({ loaded, total }) {
      this.pdfBoxParams.loading = loaded !== total
    },
    getTeacherCertifiStatusText(formKey) {
      const fileItem = this.formData[this.curTabKey][formKey][0]
      if (!fileItem) {
        return null
      }
      const isFileChange = !!fileItem.response
      const formKeyStatus = isFileChange ? '1' : this.formData[this.curTabKey][formKey + 'Status'] || '1'
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
            <a-tag color={color} class="mr-0">
              {text}
            </a-tag>
          )
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
