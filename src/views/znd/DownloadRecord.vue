<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="(params) => getDownloadRecord(params)"
      :alert="false"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getDownloadRecord } from '@/api/cauAuth'

export default {
  name: 'DownloadRecord',
  components: {
    STable
  },
  data () {
    return {
      columns: [
        {
          title: '#',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'Key',
          dataIndex: 'key'
        },
        {
          title: 'Download Time',
          dataIndex: 'createTime',
          width: 160
        },
        {
          title: 'Bucket Name',
          dataIndex: 'bucketName'
        },
        {
          title: 'Region Name',
          dataIndex: 'regionName'
        },
        {
          title: 'Download Link',
          dataIndex: 'downloadUrl',
          width: 250
        },
        {
          title: 'Email',
          dataIndex: 'email'
        }
      ]
    }
  },
  computed: {
  },
  async mounted() {
  },
  methods: {
    async getDownloadRecord(params) {
      const tableData = {
        data: [],
        pageSize: params.pageSize,
        pageNo: params.pageNo,
        totalCount: 0
      }
      try {
        const searchData = {}
        const res = await getDownloadRecord({
          searchData: searchData,
          pageData: {
            currentPage: params.pageNo,
            pageSize: params.pageSize
          }
        })
        if (res && res.header && res.header.resCode === '0000') {
          tableData.data = [
            ...res.body.data
          ].map((row, index) => ({
            ...row,
            key: row.key
          }))
          tableData.totalCount = res.body.total
        } else {
          this.$message.error(res.header.resMessage || 'load fail')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      return tableData
    }
  }
}
</script>

<style lang="less" scoped></style>
