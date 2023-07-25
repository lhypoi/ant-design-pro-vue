<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <h1 class="text-4xl font-bold text-center pt-2 pb-4">BARCODE SNPs for Pig (BSP)</h1>
    <div class="text-base indent-6 pb-1">A database of specific SNPs for indigenous pigs worldwide. It also supplies quick and precise tools for predicting the breed or population a given individual belongs to, and their potential ancestors.</div>
    <div class="pt-6">
      <a-tabs :default-active-key="tabForms[1].key" size="large">
        <a-tab-pane v-for="item in tabForms" :key="item.key" :tab="item.title">
          <div class="px-4">
            <template v-if="item.key === '1'">
              <div class="flex flex-row items-center justify-between pt-4 pb-4">
                <a-select
                  show-search
                  allowClear
                  placeholder="Select breed"
                  v-model="formData[item.key].filteredVal"
                  @change="handleFormDataChange"
                  class="w-60"
                >
                  <a-select-option v-for="filteredOption in item.filteredOptions" :key="filteredOption" :value="filteredOption">
                    {{ filteredOption }}
                  </a-select-option>
                </a-select>
                <a-button type="primary">
                  Export
                </a-button>
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
              </s-table>
            </template>
            <template v-if="item.key === '2'">
              <div class="flex flex-row pt-4 pb-4 gap-2">
                <a-select
                  show-search
                  allowClear
                  showArrow
                  mode="multiple"
                  placeholder="Select breed"
                  v-model="formData[item.key].breed"
                  class="w-full"
                >
                  <a-select-option v-for="filteredOption in item.breedList" :key="filteredOption" :value="filteredOption">
                    {{ filteredOption }}
                  </a-select-option>
                </a-select>
                <a-upload
                  :file-list="formData[item.key].fileList1"
                  :remove="() => handleFileRemove(item.key, 'fileList1')"
                  :before-upload="(file) => beforeUpload(item.key, 'fileList1', file)"
                >
                  <a-button> {{ 'Upload map file' }} </a-button>
                </a-upload>
                <a-upload
                  :file-list="formData[item.key].fileList2"
                  :remove="() => handleFileRemove(item.key, 'fileList2')"
                  :before-upload="(file) => beforeUpload(item.key, 'fileList2', file)"
                >
                  <a-button> {{ 'Upload ped file' }} </a-button>
                </a-upload>
                <a-button type="primary" @click="createBsp(item.key)">
                  Create
                </a-button>
                <div class="ml-8">
                  <a-button type="primary" class="success-btn" icon="sync" />
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
              </s-table>
            </template>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { STable } from '@/components'
// import { getUserTaskList } from '@/api/cauAuth'
// import { createBsp } from '@/api/createBsp'

export default {
  name: 'BSP',
  components: {
    STable
  },
  data() {
    return {
      tabForms: [
        {
          key: '1',
          title: 'The database of specific SNPs',
          filteredOptions: [
            'pig1',
            'pig2',
            'pig3'
          ]
        },
        {
          key: '2',
          title: 'Breed prediction',
          breedList: [
            'Anqing Six-end-white pig',
            'Bama Xiang pig',
            'Bamei pig'
          ]
        },
        {
          key: '3',
          title: 'Estimation of potential ancestor'
        }
      ],
      formData: {
        '1': {
          filteredVal: undefined
        },
        '2': {
          breed: [],
          fileList1: [],
          fileList2: [],
          creating: false
        }
      },
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
  },
  async mounted() {
  },
  methods: {
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
    },
    handleFormDataChange() {
      console.log(this.formData)
    },
    handleFileRemove(tabKey, formKey) {
      this.formData[tabKey][formKey] = []
    },
    beforeUpload(tabKey, formKey, file) {
      this.formData[tabKey][formKey] = [file]
      return false
    },
    getCurBspName() {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const hours = String(currentDate.getHours()).padStart(2, '0')
      const minutes = String(currentDate.getMinutes()).padStart(2, '0')
      const seconds = String(currentDate.getSeconds()).padStart(2, '0')
      const taskName = `bsp_${year}_${month}_${day}_${hours}_${minutes}_${seconds}`
      return taskName
    },
    async createBsp(tabKey) {
      this.formData[tabKey].creating = true
      try {
        const formData = new FormData()
        formData.append('bspName', this.getCurBspName())
        formData.append('predicitonType', this.formData[tabKey].breed.length ? 'part' : 'all')
        formData.append('breed', this.formData[tabKey].breed.join(','))
        formData.append('file1', this.formData[tabKey].fileList1[0])
        formData.append('file2', this.formData[tabKey].fileList2[0])
        formData.append('fnType', tabKey === '2' ? 'fn2' : 'fn3')
        console.log(formData)
        // const res = await createTask(formData)
        // if (res && res.message) {
        //   this.$success({
        //     title: 'Your file has been successfully submitted and your task is running. Once this task complete, we will send an e-mail to inform you and you can download the result in your profile.',
        //     okText: 'To Profile',
        //     onOk: () => {
        //       this.$router.push({ name: 'Profile' })
        //     }
        //   })
        // }
      } catch (error) {
        this.$message.error('submit fail')
        console.log(error)
      }
      this.formData[tabKey].creating = false
    }
  }
}
</script>

<style lang="less" scoped></style>
