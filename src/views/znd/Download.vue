<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="w-full">
      <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold text-center pt-2 pb-5">{{ article.title }}</h1>
        <div class="border-t border-gray-300 my-4"></div>
        <div v-for="(section, index) in article.sections" :key="index">
          <h2 class="text-2xl font-bold pt-4 pb-1">{{ section.title }}</h2>
          <div v-for="(item, index2) in section.content" :key="index2" class="text-gray-500 py-1 text-xl indent-6">{{ item }}</div>
        </div>
      </div>
    </div>
    <h2 class="text-2xl font-bold pt-4 pb-1">File list</h2>

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
      <span slot="size" slot-scope="text">
        {{ text | filesize }}
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getBucketFileList, getFolderBucketFileList, getDownloadUrl } from '@/api/cauAuth'
import { downloadFile } from '@/utils/util'

export default {
  name: 'Download',
  components: {
    STable
  },
  data () {
    return {
      article: {
        title: `Data download`,
        sections: [
          {
            title: 'Limitations on Use',
            content: [
              `1.1 You agree to use data for non-commercial research purposes only;`,
              `1.2 You agree that you will not attempt to link the data provided to a third-party database;`,
              `1.3 You agree not to transfer or disclose all or part of the data to others. Instead, please direct them to this website;`,
              `1.4 You accept any part of the data provided by the project team, the original data creator, the copyright owner, etc.;`,
              `1.5 You understand and acknowledge that data is protected by copyright and other intellectual property rights. Providers shall have the sole right to prosecute patents and patent application claiming or covering unauthorized data and Inventions;`,
              `1.6 You accept that this agreement will terminate immediately after you violate this agreement, and you will be required to destroy any data you hold;`,
              `1.7 You accept that it may be necessary for the project team or its designated agent to change the terms of this agreement from time to time to solve new problems. Providers reserve the right to change these terms at any time without prior notice. Use of this website will be subject to the terms of use of the latest version published on this website.`
            ]
          }
        ]
      },
      columns: [
        {
          title: '#',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'File name',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'MD5',
          width: '350px',
          dataIndex: 'md5'
        },
        {
          title: 'size',
          width: '200px',
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' }
        }
      ],
      upperLevel: {},
      levelStack: [],
      upperLevel2: {}
    }
  },
  computed: {
    isAdmin() {
      return this.$route.name === 'DownloadAdmin'
    }
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
        }, { isAdmin: this.isAdmin }) : await getBucketFileList({}, { isAdmin: this.isAdmin })
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
        }, { isAdmin: this.isAdmin })
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
