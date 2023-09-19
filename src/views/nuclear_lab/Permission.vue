<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="flex flex-row">
      <div class="link-style-form w-full">
        <a-form-model
          :model="formData"
        >
          <div class="flex flex-row items-start gap-4">
            <a-form-model-item key="keyword" prop="keyword" class="flex-auto">
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
        <el-table-column prop="username" label="用户名" :align="'center'" :width="200" />
        <el-table-column prop="roleName" label="角色" :align="'center'" :width="200" />
        <el-table-column prop="phoneNumber" label="手机号码" :align="'center'" :width="200" />
        <el-table-column
          label="操作"
          :align="'center'"
          :fixed="'right'"
        >
        </el-table-column>
      </k-table>
    </div>
  </div>
</template>

<script>
import nuclearLabApi from '@/api/nuclearLab'
import KTable from '@/components/Kira/KTable'

export default {
  name: 'Permission',
  components: {
    KTable
  },
  data() {
    return {
      formData: {
        keyword: ''
      }
    }
  },
  computed: {
  },
  created() {
  },
  async mounted() {
  },
  methods: {
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
