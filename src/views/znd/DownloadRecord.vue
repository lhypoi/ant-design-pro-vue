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
      <span slot="createTime" slot-scope="text">
        {{ text | timeFormat }}
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getDownloadRecord } from '@/api/cauAuth'
import moment from 'moment'

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
          title: 'Bucket Name',
          dataIndex: 'bucketName'
        },
        {
          title: 'Region Name',
          dataIndex: 'regionName'
        },
        {
          title: 'File Name',
          dataIndex: 'fileName',
          width: 250
        },
        {
          title: 'Download Time',
          dataIndex: 'createTime',
          width: 160,
          scopedSlots: { customRender: 'createTime' }
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
  filters: {
    timeFormat (value) {
      return value ? moment(new Date(parseInt(value))).format('YYYY-MM-DD HH:mm:ss') : '/'
    }
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
        const res = await getDownloadRecord({
          currentPage: params.pageNo,
          pageSize: params.pageSize
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
