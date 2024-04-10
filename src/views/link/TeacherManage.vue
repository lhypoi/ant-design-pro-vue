<template>
  <div class="w-full mx-auto max-w-[1200px] relative flex-auto flex flex-col bg-white rounded-lg shadow-sm p-6 my-6">
    <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
      <a-form-model
        :model="formData"
      >
        <div class="flex flex-row items-start gap-4 overflow-x-auto">
          <a-form-model-item key="userId" prop="userId" class="flex-auto min-w-[170px]">
            <a-input
              v-model="formData.userId"
              placeholder="请输入老师ID"
              size="large"
              allowClear
            />
          </a-form-model-item>
          <a-form-model-item key="name" prop="name" class="flex-auto min-w-[170px]">
            <a-input
              v-model="formData.name"
              placeholder="请输入老师名称"
              size="large"
              allowClear
            />
          </a-form-model-item>
          <a-button
            class="rounded-md"
            type="primary"
            icon="search"
            size="large"
            @click="handleOrganizationOrderSearch"
          >
            查询
          </a-button>
        </div>
      </a-form-model>
    </div>
    <div
      class="flex-auto flex flex-col"
      :class="detailId ? 'h-0' : 'h-[60vh] sm:h-[600px]'"
    >
      <k-table
        ref="organizationListTable"
        :data="(params) => handleGetTeacherGetList(params)"
        :border="true"
        height="100%"
        class="h-full"
      >
        <el-table-column
          v-for="col in tableCols"
          :key="col.key"
          :prop="col.key"
          :type="col.type"
          :label="col.label"
          :align="col.align || 'center'"
          :fixed="col.fixed"
          :width="col.width"
          :min-width="col.minWidth"
        >
          <template v-if="!col.type" v-slot="scope">
            <div v-if="col.key === 'status'">
              <a-tag v-if="scope.row[col.key] === '1'" color="blue" class="m-0">待审核</a-tag>
              <a-tag v-else-if="scope.row[col.key] === '2'" color="green" class="m-0">已认证</a-tag>
              <a-tag v-else-if="scope.row[col.key] === '3'" color="red" class="m-0">认证不通过</a-tag>
              <a-tag v-else-if="!scope.row[col.key]" class="m-0">未认证</a-tag>
            </div>
            <div v-else>{{ scope.row[col.key] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'" width="120" fixed="right">
          <template v-slot="scope">
            <div class="flex items-center justify-center gap-x-3">
              <div class="text-blue-400 cursor-pointer" @click="() => handleToDetail(scope.row)">详情</div>
              <div v-if="scope.row['status'] === '1'" class="text-blue-400 cursor-pointer" @click="$refs.LinkTeacherDetailDrawer.handleShowAdminAuditTeacherModal(scope.row)">审核</div>
            </div>
          </template>
        </el-table-column>
      </k-table>
    </div>
    <LinkTeacherDetailDrawer
      ref="LinkTeacherDetailDrawer"
      @reload="handleOrganizationOrderSearch"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import KTable from '@/components/Kira/KTable'
import { baseMixin } from '@/store/app-mixin'
import LinkTeacherDetailDrawer from '@/components/Kira/LinkTeacherDetailDrawer'

export default {
  name: 'TeacherManage',
  mixins: [baseMixin],
  components: {
    KTable,
    LinkTeacherDetailDrawer
  },
  data() {
    return {
      lingkeApi,
      formData: {
        userId: '',
        name: ''
      },
      tableCols: [
        {
          key: 'userId',
          label: '老师ID',
          width: 160
        },
        {
          key: 'nickName',
          label: '昵称',
          minWidth: 160
        },
        {
          key: 'status',
          label: '状态',
          width: 120
        },
        {
          key: 'createTime',
          label: '注册时间',
          width: 160
        }
      ]
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'userInfo'
    ]),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    }),
    detailId() {
      return this.$route.query.orderId
    }
  },
  async mounted() {
  },
  methods: {
    async handleGetTeacherGetList(params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const formData = this.formData
        const res = await lingkeApi.teacherGetList({
          pageIndex: params.pageNum,
          pageSize: params.pageSize,
          userId: formData.userId ? parseInt(formData.userId) : undefined,
          name: formData.name || undefined
        })
        if (res && res.code === 200) {
          tableData.rows = res.data.list.map(row => ({
            ...row
          }))
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
    handleToDetail(row) {
      this.$router.push({ name: this.$route.name, query: { userId: row.userId } })
    },
    handleOrganizationOrderSearch() {
      this.$refs.organizationListTable.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
