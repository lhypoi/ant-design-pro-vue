<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="flex flex-row items-center justify-between pb-4 px-10 pt-4">
      <a-input-search placeholder="Search a gene symbol, rsID, region, or position" size="large" v-model="searchVal" @search="handleSearech" />
    </div>
    <div class="pt-2 px-10">
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="getUserTaskList"
        :alert="false"
        :showPagination="false"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
    </div>
  </div>
</template>

<script>
import { STable } from '@/components'

export default {
  name: 'HomeSearch',
  components: {
    STable
  },
  data() {
    return {
      searchVal: '',
      columns: [
        {
          title: '#',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'taskName',
          dataIndex: 'taskName'
        },
        {
          title: 'breed',
          dataIndex: 'breed'
        },
        {
          title: 'Chromosome',
          dataIndex: 'Chromosome'
        },
        {
          title: 'position',
          dataIndex: 'position'
        },
        {
          title: 'rs ID',
          dataIndex: 'rs'
        },
        {
          title: 'REF',
          dataIndex: 'REF'
        },
        {
          title: 'ALT',
          dataIndex: 'ALT'
        }
      ]
    }
  },
  computed: {
  },
  created() {
    this.searchVal = this.$route.query.search
  },
  async mounted() {
  },
  methods: {
    handleSearech() {
      // if (!this.hasLogin) {
      //   this.$router.push({ name: 'Login' })
      // } else {
      //   this.showTable = true
      // }
    },
    async getUserTaskList() {
      console.log(this.searchVal)
      const tableData = {
        data: []
      }
      try {
        // const res = await getUserTaskList({
        //   taskName: this.formData.taskName || undefined,
        //   status: this.formData.status || undefined,
        //   startTime: this.formData.timeRange[0] ? this.formData.timeRange[0].valueOf() : undefined,
        //   endTime: this.formData.timeRange[1] ? this.formData.timeRange[1].valueOf() : undefined
        // })
        // if (res && res.header && res.header.resCode === '0000') {
        //   tableData.data = [
        //     ...res.body
        //   ].map((row, index) => ({
        //     ...row,
        //     key: row.taskId,
        //     fileMd5: row.fileMd5 || '/'
        //   }))
        // } else {
        //   this.$message.error(res.header.resMessage || 'load fail')
        // }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.rowLen = tableData.data.length
      return tableData
    }
  }
}
</script>

<style lang="less" scoped></style>
