<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-5 sm:p-8">
    <div class="flex flex-row">
      <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
        <a-form-model
          :model="formData"
        >
          <div class="flex flex-row items-start gap-4 overflow-x-auto">
            <a-form-model-item key="userName" prop="userName" class="flex-auto min-w-[160px]">
              <a-input
                v-model="formData.userName"
                placeholder="请输入用户名"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="phoneNumber" prop="phoneNumber" class="flex-auto min-w-[170px]">
              <a-input
                v-model="formData.phoneNumber"
                placeholder="请输入手机号码"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="timeRange" prop="timeRange" class="min-w-[240px]">
              <a-range-picker v-model="formData.timeRange" size="large" allowClear>
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
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
          </div>
        </a-form-model>
      </div>
    </div>
    <div class="flex-auto h-0">
      <k-table
        ref="table"
        :data="(params) => getAccessLog(params)"
        border
        height="100%"
        class="h-full"
      >
        <el-table-column prop="userName" label="用户名" :align="'center'" min-width="160" />
        <el-table-column prop="userRole" label="角色" :align="'center'" min-width="160" />
        <el-table-column prop="page" label="访问页面" :align="'center'" min-width="160" />
        <el-table-column prop="action" label="操作" :align="'center'" min-width="160" />
        <el-table-column prop="detail" label="详情" :align="'center'" min-width="160" />
        <el-table-column prop="createTime" label="访问时间" :align="'center'" min-width="160" />
        <el-table-column prop="remark" label="备注" :align="'center'" min-width="160" />
      </k-table>
    </div>
  </div>
</template>

<script>
import nuclearLabApi from '@/api/nuclearLab'
import KTable from '@/components/Kira/KTable'
import { mapGetters } from 'vuex'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'LoginLog',
  mixins: [baseMixin],
  components: {
    KTable
  },
  data() {
    return {
      formData: {
        userName: '',
        phoneNumber: '',
        timeRange: []
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
  },
  methods: {
    async getAccessLog(params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const res = await nuclearLabApi.accessLogList({
          userName: this.formData.userName || undefined,
          phoneNumber: this.formData.phoneNumber || undefined,
          beginTime: this.formData.timeRange[0] ? this.formData.timeRange[0].startOf('day').valueOf() : undefined,
          endTime: this.formData.timeRange[1] ? this.formData.timeRange[1].endOf('day').valueOf() : undefined,
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
