<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div v-if="!showTable" class="flex flex-row justify-center h-28 mt-20">
      <img src="http://chinamap-public-sh.oss-cn-shanghai.aliyuncs.com/static%2Ffiles%2FchinaMap.png" class="h-full w-auto" alt="">
    </div>
    <div class="flex flex-row items-center justify-between pb-4" :class="showTable ? 'px-10 pt-4' : 'px-32 pt-20'">
      <a-input-search placeholder="Search a gene symbol, rsID, region, or position" size="large" v-model="searchVal" @search="handleSearech" />
    </div>
    <div v-if="!showTable" class="flex flex-row justify-between px-20 pt-10">
      <div class="flex flex-col items-center">
        <div class="text-2xl font-bold pb-2">Version</div>
        <div>2020-03.beta</div>
      </div>
      <div class="flex flex-col items-center">
        <div class="text-2xl font-bold pb-2">Size of data</div>
        <div>Cohort: 10,588 samples</div>
        <div>Sequencing bases: 1,380 Tb</div>
      </div>
      <div class="flex flex-col items-center">
        <div class="text-2xl font-bold pb-2">Number of variants</div>
        <div>SNP: 136,745,826</div>
        <div>INDEL: 10,703,115</div>
      </div>
    </div>
    <div v-if="showTable" class="pt-2 px-10">
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
import { mapGetters } from 'vuex'

export default {
  name: 'Info',
  components: {
    STable
  },
  data() {
    return {
      showTable: false,
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
    ...mapGetters(['hasLogin'])
  },
  created() {
  },
  async mounted() {
  },
  methods: {
    handleSearech() {
      if (!this.hasLogin) {
        this.$router.push({ name: 'Login' })
      } else {
        this.showTable = true
      }
    },
    async getUserTaskList() {
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
