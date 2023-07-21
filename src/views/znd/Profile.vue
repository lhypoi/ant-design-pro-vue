<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="border-b border-gray-300 flex flex-row items-center justify-between">
      <div class="text-3xl py-4">Tasks</div>
      <a-button type="primary" size="large">
        Create Task
      </a-button>
    </div>
    <div class="flex flex-row items-center justify-between pt-8 pb-4">
      <div class="flex flex-row items-center">
        <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />
        <div class="pl-6 whitespace-nowrap text-base">Total 0 results</div>
      </div>
      <div class="flex flex-row items-center gap-3">
        <a-range-picker @change="onChange">
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
        <a-select default-value="lucy" style="width: 120px" @change="handleChange">
          <a-select-option value="jack">
            Jack
          </a-select-option>
          <a-select-option value="lucy">
            Lucy
          </a-select-option>
          <a-select-option value="Yiminghe">
            yiminghe
          </a-select-option>
        </a-select>
      </div>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="getBucketFileList"
      :alert="false"
      :showPagination="false"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ upperLevel.name ? (index === 0 ? '' : index) : index + 1 }}
      </span>
      <span slot="name" slot-scope="text, record">
        <a v-if="record.key !== '_'" @click="handleRowClick(record)">{{ text }}</a>
        <a v-else @click="handleToParent"><a-icon type="ellipsis" /></a>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getUserTaskList, getFolderBucketFileList, getDownloadUrl } from '@/api/cauAuth'
import { downloadFile } from '@/utils/util'

export default {
  name: 'Profile',
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
          title: 'Task Name',
          dataIndex: 'md5'
        },
        {
          title: 'Create Name',
          dataIndex: 'md5'
        },
        {
          title: 'End Name',
          dataIndex: 'md5'
        },
        {
          title: 'Status',
          dataIndex: 'md5'
        }
        // {
        //   title: 'File name',
        //   dataIndex: 'name',
        //   scopedSlots: { customRender: 'name' }
        // },
        // {
        //   title: 'MD5',
        //   width: '300px',
        //   dataIndex: 'md5'
        // }
      ],
      upperLevel: {},
      levelStack: [],
      upperLevel2: {}
    }
  },
  computed: {
  },
  async mounted() {
  },
  methods: {
    async getBucketFileList() {
      const tableData = {
        data: []
      }
      try {
        const res = this.upperLevel.name ? await getFolderBucketFileList({
          bucketName: this.upperLevel.bucketName,
          region: this.upperLevel.region,
          folder: this.upperLevel.name
        }) : await getUserTaskList({

        })
        if (res && res.header && res.header.resCode === '0000') {
          tableData.data = [
            ...res.body.folderList,
            ...(this.upperLevel.name ? res.body.fileList.slice(1) : res.body.fileList)
          ].map((row, index) => ({
            ...row,
            key: index + '_' + row.name,
            md5: row.etag || '/'
          }))
          if (this.levelStack.length) {
            tableData.data.unshift({
              key: '_'
            })
          }
        } else {
          this.$message.error(res.header.resMessage || 'load fail')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      return tableData
    },
    async handleRowClick(row) {
      try {
        if (!row.etag) {
          this.levelStack.push({ ...this.upperLevel })
          this.upperLevel = { ...row }
          this.$refs.table.loadData()
        } else {
          this.handleDownload(row)
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleToParent() {
      this.upperLevel = { ...this.levelStack.pop() }
      this.$refs.table.loadData()
    },
    async handleDownload(row) {
      this.$refs.table.localLoading = true
      try {
        const res = await getDownloadUrl({
          bucketName: row.bucketName,
          region: row.region,
          filePath: row.name
        })
        if (res && res.header && res.header.resCode === '0000') {
          downloadFile(res.body, row.name)
        } else {
          this.$message.error(res.header.resMessage || 'download fail')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.$refs.table.localLoading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
