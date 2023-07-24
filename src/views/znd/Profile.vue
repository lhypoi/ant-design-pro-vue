<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="border-b border-gray-300 flex flex-row items-center justify-between">
      <div class="text-3xl py-4">Tasks</div>
      <a-button type="primary" size="large" @click="toCreateTask">
        Create Task
      </a-button>
    </div>
    <div class="flex flex-row items-center justify-between pt-8 pb-4">
      <div class="flex flex-row items-center">
        <a-input-search placeholder="input search text" style="width: 200px" v-model="formData.taskName" @search="onSearch" />
        <div class="pl-6 whitespace-nowrap text-base">Total {{ rowLen }} results</div>
      </div>
      <div class="flex flex-row items-center gap-3">
        <a-range-picker v-model="formData.timeRange" @change="onSearch">
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
        <a-select v-model="formData.status" style="width: 120px" @change="onSearch">
          <a-select-option v-for="item in statusList" :value="item.key" :key="item.key">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
    </div>

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
      <span slot="createTime" slot-scope="text">
        {{ text | timeFormat }}
      </span>
      <span slot="endTime" slot-scope="text">
        {{ text | timeFormat }}
      </span>
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="logPath" slot-scope="text">
        <a v-if="text" @click="handleDownload(text)"><a-icon type="file" theme="filled" /></a>
        <span v-else>/</span>
      </span>
      <span slot="downloadLink" slot-scope="text">
        <a v-if="text" @click="handleDownload(text)"><a-icon type="file" theme="filled" /></a>
        <span v-else>/</span>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getUserTaskList } from '@/api/cauAuth'
import { downloadFile } from '@/utils/util'
import moment from 'moment'

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
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'Task Name',
          dataIndex: 'taskName',
          width: 250
        },
        {
          title: 'Create Name',
          dataIndex: 'createTime',
          width: 160,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: 'End Name',
          dataIndex: 'endTime',
          width: 160,
          scopedSlots: { customRender: 'endTime' }
        },
        {
          title: 'Status',
          dataIndex: 'status'
        },
        {
          title: 'MD5',
          dataIndex: 'fileMd5',
          width: 280
        },
        {
          title: 'Log',
          dataIndex: 'logPath',
          scopedSlots: { customRender: 'logPath' }
        },
        {
          title: 'File',
          dataIndex: 'downloadLink',
          scopedSlots: { customRender: 'downloadLink' }
        }
      ],
      rowLen: 0,
      statusList: [
        {
          key: '',
          label: 'All'
        },
        {
          key: 'completed',
          label: 'Completed'
        },
        {
          key: 'Phasing',
          label: 'Phasing'
        },
        {
          key: 'failed',
          label: 'Failed'
        }
      ],
      formData: {
        taskName: '',
        timeRange: [],
        status: ''
      }
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
    toCreateTask() {
      this.$router.push({ name: 'Imputation' })
    },
    async getUserTaskList() {
      console.log(this.formData)
      const tableData = {
        data: []
      }
      try {
        const res = await getUserTaskList({
          taskName: this.formData.taskName || undefined,
          status: this.formData.status || undefined,
          startTime: this.formData.timeRange[0] ? this.formData.timeRange[0].valueOf() : undefined,
          endTime: this.formData.timeRange[1] ? this.formData.timeRange[1].valueOf() : undefined
        })
        if (res && res.header && res.header.resCode === '0000') {
          tableData.data = [
            ...res.body
          ].map((row, index) => ({
            ...row,
            key: row.taskId,
            fileMd5: row.fileMd5 || '/'
          }))
        } else {
          this.$message.error(res.header.resMessage || 'load fail')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.rowLen = tableData.data.length
      return tableData
    },
    onSearch() {
      this.$refs.table.loadData()
    },
    handleDownload(url) {
      downloadFile(url)
    }
  }
}
</script>

<style lang="less" scoped></style>
