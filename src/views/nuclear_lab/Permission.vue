<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-5 sm:p-8">
    <div class="flex flex-row">
      <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
        <a-form-model
          :model="formData"
        >
          <div class="flex flex-row items-start gap-4 overflow-x-auto">
            <a-form-model-item key="keyword" prop="keyword" class="flex-auto min-w-[160px]">
              <a-input
                v-model="formData.keyword"
                placeholder="请输入用户名"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-button
              class="h-11 rounded-md text-base"
              type="primary"
              icon="search"
              size="large"
              @click="handleSearch"
            >
              查询
            </a-button>
            <a-button
              class="h-11 rounded-md text-base"
              type="primary"
              size="large"
              @click="handleOpenUserModal"
            >
              新增用户
            </a-button>
          </div>
        </a-form-model>
      </div>
    </div>
    <div class="flex-auto h-0">
      <k-table
        ref="table"
        :data="(params) => getUserList(params)"
        border
        height="100%"
        class="h-full"
      >
        <el-table-column prop="username" label="用户名" :align="'center'" min-width="160" />
        <el-table-column prop="roleName" label="角色" :align="'center'" min-width="200" />
        <el-table-column prop="phoneNumber" label="手机号码" :align="'center'" min-width="160" />
        <el-table-column
          label="操作"
          :align="'center'"
          :width="200"
        >
          <div slot-scope="scope" class="flex flex-row gap-4 justify-center">
            <a-button
              class="h-8 rounded-md text-sm"
              type="danger"
              @click="handleUserModalFormDelete(scope.row)"
            >
              删除
            </a-button>
            <a-button
              class="h-8 rounded-md text-sm"
              type="primary"
              @click="handleOpenUserModal(scope.row)"
            >
              修改
            </a-button>
          </div>
        </el-table-column>
      </k-table>
    </div>
    <a-modal
      v-if="userModalParams.show"
      :title="userModalParams.userId ? '修改用户信息' : '新增用户'"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '640px'"
      @cancel="userModalParams.show = false"
    >
      <div class="pt-4">
        <div class="link-style-form" v-loading="userModalParams.loading">
          <a-form-model
            ref="userModalForm"
            :model="userModalParams.formData"
            :rules="userModalParams.formRules"
            :label-col="{ span: 5 }"
            :wrapper-col="{ offset: isMobile ? 0 : 1, span: 16 }"
          >
            <a-form-model-item key="username" prop="username" label="姓名">
              <a-input
                v-model="userModalParams.formData.username"
                placeholder="请输入"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="roleId" prop="roleId" label="角色权限">
              <a-select v-model="userModalParams.formData.roleId" size="large" placeholder="请选择" allowClear>
                <a-select-option v-for="item in userModalParams.options['roleId']" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item key="roomIdList" prop="roomIdList" label="机房权限选择">
              <a-checkbox-group v-model="userModalParams.formData.roomIdList" size="large" style="width: 100%;">
                <div class="pt-1">
                  <a-row>
                    <a-col v-for="item in userModalParams.options['roomIdList']" :key="item.key" :span="8">
                      <a-checkbox :value="item.key" name="roomIdList">
                        {{ item.value }}
                      </a-checkbox>
                    </a-col>
                  </a-row>
                </div>
              </a-checkbox-group>
            </a-form-model-item>
            <a-form-model-item key="phoneNumber" prop="phoneNumber" label="手机号码">
              <a-input
                v-model="userModalParams.formData.phoneNumber"
                placeholder="手机号码即为账号"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item v-if="!userModalParams.userId" key="password" prop="password" label="密码">
              <a-input-password
                v-model="userModalParams.formData.password"
                placeholder="请输入"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ offset: isMobile ? 0 : 6, span: 16 }">
              <div class="pt-4">
                <a-button
                  class="h-11 w-52 rounded-md text-base"
                  type="primary"
                  size="large"
                  :loading="userModalParams.submitting"
                  @click="handleUserModalFormUpdate"
                >
                  保存
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
import nuclearLabApi from '@/api/nuclearLab'
import KTable from '@/components/Kira/KTable'
import { mapGetters } from 'vuex'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'Permission',
  mixins: [baseMixin],
  components: {
    KTable
  },
  data() {
    return {
      formData: {
        keyword: ''
      },
      userModalParams: {
        show: false,
        userId: '',
        loading: false,
        submitting: false,
        formData: {
          username: '',
          roleId: undefined,
          roomIdList: [],
          phoneNumber: '',
          password: ''
        },
        options: {
          roleId: [],
          roomIdList: []
        },
        formRules: {
          username: [
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
          roleId: [
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
          roomIdList: [
            {
              validator: (rule, value, callback) => {
                try {
                  if (!value.length) {
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
          phoneNumber: [
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
          password: [
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
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    })
  },
  created() {
  },
  async mounted() {
    this.initUserModalRoleOptions()
    this.initUserModalRoomOptions()
  },
  methods: {
    async initUserModalRoleOptions() {
      try {
        const res = await nuclearLabApi.roleListAll()
        if (res && res.code === 200) {
          this.userModalParams.options.roleId = res.data.map(item => {
            return {
              key: item.id,
              value: item.name
            }
          })
        } else {
          throw new Error(res.message || '加载角色列表失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async initUserModalRoomOptions() {
      try {
        const res = await nuclearLabApi.roomAll()
        if (res && res.code === 200) {
          this.userModalParams.options.roomIdList = res.data.map(item => {
            return {
              key: item.id,
              value: item.name
            }
          })
        } else {
          throw new Error(res.message || '加载机房列表失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleOpenUserModal(user) {
      this.userModalParams = {
        ...this.userModalParams,
        show: true,
        userId: user?.id || '',
        loading: true,
        submitting: false,
        formData: {
          username: '',
          roleId: undefined,
          roomIdList: [],
          phoneNumber: '',
          password: ''
        }
      }
      try {
        if (user?.id) {
          const res = await nuclearLabApi.userById(user.id)
          if (res && res.code === 200) {
            this.userModalParams = {
              ...this.userModalParams,
              formData: {
                username: res.data.username || '',
                roleId: res.data.roleId || undefined,
                roomIdList: res.data.roomList.map(item => item.id) || [],
                phoneNumber: res.data.phoneNumber || '',
                password: res.data.password || ''
              }
            }
          } else {
            throw new Error(res.message || '获取失败')
          }
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.userModalParams.loading = false
    },
    async handleUserModalFormUpdate() {
      try {
        await this.$refs.userModalForm.validate()
      } catch {
        this.$message.error('提交信息不符合要求，请检查')
        return
      }
      this.userModalParams.submitting = true
      try {
        const params = {
          username: this.userModalParams.formData.username,
          roleId: this.userModalParams.formData.roleId,
          roomIdList: this.userModalParams.formData.roomIdList,
          phoneNumber: this.userModalParams.formData.phoneNumber,
          password: this.userModalParams.formData.password || undefined
        }
        const res = this.userModalParams.userId ? await nuclearLabApi.userUpdateById(this.userModalParams.userId, params) : await nuclearLabApi.userRegister(params)
        if (res && res.code === 200) {
          this.$message.success('保存成功')
          this.userModalParams.show = false
          this.handleSearch()
        } else {
          throw new Error(res.message || '保存失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.userModalParams.submitting = false
    },
    handleUserModalFormDelete(user) {
      this.$confirm({
        title: '警告',
        content: `确定删除该用户吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await nuclearLabApi.userDeleteById(user.id)
            if (res && res.code === 200) {
              this.$message.success('删除成功')
              this.handleSearch()
            } else {
              throw new Error(res.message || '删除失败')
            }
          } catch (error) {
            this.$message.error(error.message)
            console.log(error)
          }
        }
      })
    },
    async getUserList(params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const res = await nuclearLabApi.userList({
          keyword: this.formData.keyword,
          pageNum: params.pageNum,
          pageSize: params.pageSize
        })
        if (res && res.code === 200) {
          tableData.rows = res.data.list
          tableData.total = res.data.total
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error(error.message)
      }
      return tableData
    },
    handleSearch() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
