<template>
  <div class="relative flex-auto flex flex-col bg-white rounded-3xl p-6">
    <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
      <a-form-model
        :model="formData"
      >
        <div class="flex flex-row items-start gap-4 overflow-x-auto">
          <a-form-model-item key="userId" prop="userId" class="flex-auto min-w-[170px]">
            <a-input
              v-model="formData.userId"
              placeholder="请输入用户ID"
              size="large"
              allowClear
            />
          </a-form-model-item>
          <a-form-model-item key="name" prop="name" class="flex-auto min-w-[170px]">
            <a-input
              v-model="formData.name"
              placeholder="请输入机构名称"
              size="large"
              allowClear
            />
          </a-form-model-item>
          <a-button
            class="h-11 rounded-md text-base"
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
        :data="(params) => handleGetOrganizationGetList(params)"
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
            <div v-if="col.key === 'status'">{{ `${ scope.row['statusName'] }${ scope.row['status'] === '3' ? '，' + scope.row['remark'] : '' }` }}</div>
            <div v-else>{{ scope.row[col.key] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'" width="120" fixed="right">
          <template v-slot="scope">
            <div class="flex flex-col items-center justify-center gap-y-3">
              <a-button
                class="h-7 rounded-md"
                type="primary"
                @click="handleToDetail(scope.row)"
              >
                查看详情
              </a-button>
              <a-button
                class="success-btn h-7 rounded-md"
                type="primary"
                @click="$refs.LinkOrganizationDetailDrawer.handleShowAdminAuditOrganizationModal(scope.row)"
              >
                审核
              </a-button>
            </div>
          </template>
        </el-table-column>
      </k-table>
    </div>
    <LinkOrganizationDetailDrawer
      ref="LinkOrganizationDetailDrawer"
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
import LinkOrganizationDetailDrawer from '@/components/Kira/LinkOrganizationDetailDrawer'

export default {
  name: 'OrganizationManage',
  mixins: [baseMixin],
  components: {
    KTable,
    LinkOrganizationDetailDrawer
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
          label: '用户ID',
          width: 160
        },
        {
          key: 'phoneNumber',
          label: '手机号码',
          width: 160
        },
        {
          key: 'typeName',
          label: '机构类型',
          width: 160
        },
        {
          key: 'name',
          label: '机构名称',
          minWidth: 160
        },
        {
          key: 'legalPerson',
          label: '法人',
          width: 120
        },
        {
          key: 'status',
          label: '认证状态',
          width: 200
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
    async handleGetOrganizationGetList(params) {
      const tableData = {
        rows: [],
        total: 0
      }
      try {
        const formData = this.formData
        const res = await lingkeApi.organizationGetList({
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
