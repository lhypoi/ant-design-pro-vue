<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <h1 class="text-4xl font-bold text-center pt-2 pb-4">BARCODE SNPs for Pig (BSP)</h1>
    <div class="text-base indent-6 pb-1">A database of specific SNPs for indigenous pigs worldwide. It also supplies quick and precise tools for predicting the breed or population a given individual belongs to, and their potential ancestors.</div>
    <div class="pt-6">
      <a-tabs :default-active-key="tabForms[0].key" size="large">
        <a-tab-pane v-for="item in tabForms" :key="item.key" :tab="item.title">
          <div class="px-4">
            <template v-if="item.key === '1'">
              <div class="flex flex-row items-center justify-between pt-4 pb-4">
                <div class="pr-12 flex-auto">
                  <a-select
                    show-search
                    allowClear
                    showArrow
                    mode="multiple"
                    placeholder="Select breed"
                    v-model="searchFormData[item.key].breed"
                    @change="() => handleSearch(item.key)"
                    class="w-full"
                  >
                    <a-select-option v-for="breed in item.breedList" :key="breed" :value="breed">
                      {{ breed }}
                    </a-select-option>
                  </a-select>
                </div>
                <a-button type="primary" :loading="searchResData[item.key].exporting" @click="() => handleFunc1Export(item.key)">
                  Export
                </a-button>
              </div>
              <s-table
                :ref="'table' + item.key"
                size="default"
                rowKey="key"
                :columns="func1Columns"
                :data="(params) => querySNPData(item.key, params)"
                :alert="false"
                showPagination="auto"
              >
                <span slot="serial" slot-scope="text, record, index">
                  {{ index + 1 }}
                </span>
              </s-table>
            </template>
            <template v-if="item.key === '2' || item.key === '3'">
              <div class="flex flex-row p-4 gap-2 bg-gray-100 mt-1 rounded-lg">
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
                  class="w-40 block"
                  :file-list="formData[item.key].fileList1"
                  :remove="() => handleFileRemove(item.key, 'fileList1')"
                  :before-upload="(file) => beforeUpload(item.key, 'fileList1', file)"
                >
                  <a-button class="w-40"> {{ 'Upload map file' }} </a-button>
                </a-upload>
                <a-upload
                  class="w-40 block"
                  :file-list="formData[item.key].fileList2"
                  :remove="() => handleFileRemove(item.key, 'fileList2')"
                  :before-upload="(file) => beforeUpload(item.key, 'fileList2', file)"
                >
                  <a-button class="w-40"> {{ 'Upload ped file' }} </a-button>
                </a-upload>
                <a-button type="primary" :loading="formData[item.key].creating" @click="createBsp(item.key)">
                  Create
                </a-button>
              </div>
              <div class="flex flex-row items-center justify-between pt-9 pb-4">
                <div class="flex flex-row items-center">
                  <a-input-search placeholder="input search text" style="width: 200px" v-model="searchFormData[item.key].bspName" @search="() => handleSearch(item.key)" />
                  <div class="pl-6 whitespace-nowrap text-base">Total {{ searchResData[item.key].rowLen }} results</div>
                  <div class="pl-4">
                    <div class="underline cursor-pointer text-blue-500" @click="handleFullDownload(item.key)">Download {{ item.key === '2' ? 'Low' : 'High' }} Density Full Library Locations</div>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-3">
                  <a-range-picker v-model="searchFormData[item.key].timeRange" @change="() => handleSearch(item.key)">
                    <a-icon slot="suffixIcon" type="calendar" />
                  </a-range-picker>
                </div>
              </div>
              <s-table
                :ref="'table' + item.key"
                size="default"
                rowKey="key"
                :columns="columns"
                :data="() => getUserBsp(item.key)"
                :alert="false"
                :showPagination="false"
              >
                <span slot="serial" slot-scope="text, record, index">
                  {{ index + 1 }}
                </span>
                <span slot="createTime" slot-scope="text">
                  {{ text | timeFormat }}
                </span>
                <span slot="detail" slot-scope="text, record">
                  <a @click="handleShowDetail(item.key, record.fileId)">detail</a>
                </span>
              </s-table>
              <a-modal
                v-if="searchResData[item.key].detailModal"
                :visible="true"
                title="Detail"
                :width="800"
                @ok="() => searchResData[item.key].detailModal = false"
                @cancel="() => searchResData[item.key].detailModal = false"
              >
                <div v-if="searchResData[item.key].detailStatus === 'processing'" class="py-4 text-blue-400">
                  Processing, currently at {{ searchResData[item.key].detailProgress }}%.
                </div>
                <div class="flex flex-row justify-end pb-4">
                  <a-button
                    type="primary"
                    class="success-btn"
                    @click="() => handleFunc23Export(item.key)"
                  >
                    Export
                  </a-button>
                </div>
                <div class="max-h-[600px] overflow-y-auto">
                  <s-table
                    size="default"
                    rowKey="key"
                    :columns="item.key === '2' ? modalDetailColumns : modalDetailFunc3Columns"
                    :data="() => getBspStatus(item.key)"
                    :alert="false"
                    :showPagination="false"
                  >
                    <span slot="serial" slot-scope="text, record, index">
                      {{ index + 1 }}
                    </span>
                    <span slot="createTime" slot-scope="text">
                      {{ text | timeFormat }}
                    </span>
                  </s-table>
                </div>
              </a-modal>
            </template>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getUserBsp, getBspStatus, getBreedList, querySNPData } from '@/api/cauAuth'
import { createBsp } from '@/api/createBsp'
import { exportDownload } from '@/api/exportDownload'
import moment from 'moment'
import { downloadFile, downloadByStream, getCurTimeStr, exportToExcel } from '@/utils/util'

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
          breedList: []
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
          title: 'Estimation of potential ancestor',
          breedList: [
            'Anqing Six-end-white pig',
            'Bama Xiang pig',
            'Bamei pig'
          ]
        }
      ],
      formData: {
        '2': {
          breed: [],
          fileList1: [],
          fileList2: [],
          creating: false
        },
        '3': {
          breed: [],
          fileList1: [],
          fileList2: [],
          creating: false
        }
      },
      searchFormData: {
        '1': {
          breed: []
        },
        '2': {
          bspName: '',
          timeRange: []
        },
        '3': {
          bspName: '',
          timeRange: []
        }
      },
      searchResData: {
        '1': {
          exporting: false
        },
        '2': {
          rowLen: 0,
          detailId: '',
          detailModal: false,
          detailStatus: null,
          detailProgress: 0,
          rows: []
        },
        '3': {
          rowLen: 0,
          detailId: '',
          detailModal: false,
          detailStatus: null,
          detailProgress: 0,
          rows: []
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
          title: 'BSP Name',
          dataIndex: 'bspName'
        },
        {
          title: 'Create Name',
          dataIndex: 'createTime',
          width: 160,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '',
          dataIndex: 'detail',
          width: 160,
          align: 'center',
          scopedSlots: { customRender: 'detail' }
        }
      ],
      modalDetailColumns: [
        {
          title: '#',
          width: '60px',
          align: 'center',
          dataIndex: 'serialNo',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'Prediction Breed',
          dataIndex: 'Prediction Breed'
        },
        {
          title: 'sampleNo',
          dataIndex: 'sampleNo',
          width: 160
        },
        {
          title: 'accuracy',
          dataIndex: 'accuracy',
          width: 100
        }
      ],
      modalDetailFunc3Columns: [
        {
          title: '#',
          width: '60px',
          align: 'center',
          dataIndex: 'serialNo',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'Prediction Breed',
          dataIndex: 'Prediction Breed'
        },
        {
          title: 'sampleNo',
          dataIndex: 'sampleNo',
          width: 160
        },
        {
          title: 'prediction probability',
          dataIndex: 'prediction probability',
          width: 120
        },
        {
          title: 'Prediction Possibility for Prediction Breed',
          dataIndex: 'Prediction Possibility for Prediction Breed',
          width: 100
        },
        {
          title: 'judgment',
          dataIndex: 'judgment',
          width: 120
        }
      ],
      func1Columns: [
        {
          title: '#',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'Breed',
          dataIndex: 'breed'
        },
        {
          title: 'Rs ID',
          dataIndex: 'rsID'
        },
        {
          title: 'Position',
          dataIndex: 'position'
        },
        {
          title: 'Chromosome',
          dataIndex: 'chromosome'
        },
        {
          title: 'Alt',
          dataIndex: 'alt'
        },
        {
          title: 'Pk',
          dataIndex: 'pk'
        },
        {
          title: 'Ref',
          dataIndex: 'ref'
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
  created() {
  },
  async mounted() {
    this.initAsyncConfig()
  },
  methods: {
    async initAsyncConfig() {
      try {
        const getBreedListRes = await getBreedList({})
        if (getBreedListRes && getBreedListRes.header && getBreedListRes.header.resCode === '0000') {
          this.tabForms[0].breedList = getBreedListRes.body
        }
      } catch (error) {
        console.log(error)
      }
    },
    async querySNPData(tabKey, params) {
      const tableData = {
        data: [],
        pageSize: params.pageSize,
        pageNo: params.pageNo,
        totalCount: 0
      }
      try {
        const res = await querySNPData({
          breed: this.searchFormData[tabKey].breed.join(','),
          currentPage: params.pageNo,
          pageSize: params.pageSize
        })
        if (res && res.header && res.header.resCode === '0000') {
          tableData.data = [
            ...res.body.data
          ].map((row, index) => ({
            ...row,
            key: row.pk
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
    },
    async getUserBsp(tabKey) {
      const tableData = {
        data: []
      }
      try {
        const res = await getUserBsp({
          bspName: this.searchFormData[tabKey].bspName || undefined,
          startTime: this.searchFormData[tabKey].timeRange[0] ? this.searchFormData[tabKey].timeRange[0].valueOf() : undefined,
          endTime: this.searchFormData[tabKey].timeRange[1] ? this.searchFormData[tabKey].timeRange[1].valueOf() : undefined,
          fnType: tabKey === '2' ? 'fn2' : 'fn3'
        })
        if (res && res.header && res.header.resCode === '0000') {
          tableData.data = [
            ...res.body
          ].map((row, index) => ({
            ...row,
            key: row.bspId
          }))
        } else {
          this.$message.error(res.header.resMessage || 'load fail')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.searchResData[tabKey].rowLen = tableData.data.length
      return tableData
    },
    handleSearch(tabKey) {
      const tableName = 'table' + tabKey
      this.$refs[tableName][0].refresh(true)
    },
    async getBspStatus(tabKey) {
      const tableData = {
        data: []
      }
      try {
        const res = await getBspStatus({
          fileId: this.searchResData[tabKey].detailId,
          fnType: tabKey === '2' ? 'fn2' : 'fn3'
        })
        if (res && res.header && res.header.resCode === '0000') {
          tableData.data = [
            ...res.body.result.Identification
          ].map((row, index) => ({
            ...row,
            key: row.serialNo
          }))
        } else if (res && res.header && res.header.resCode === '202') {
          this.searchResData[tabKey].detailStatus = 'processing'
          this.searchResData[tabKey].detailProgress = res.body.progress
        } else {
          this.$message.error(res.header.resMessage || 'load fail')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.searchResData[tabKey].rows = tableData.data
      return tableData
    },
    handleShowDetail(tabKey, detailId) {
      this.searchResData[tabKey].detailId = detailId
      this.searchResData[tabKey].detailStatus = null
      this.searchResData[tabKey].detailProgress = 0
      this.searchResData[tabKey].detailModal = true
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
      if (!this.formData[tabKey].fileList1[0]) {
        this.$message.warning('Please upload map file')
        return
      }
      if (!this.formData[tabKey].fileList2[0]) {
        this.$message.warning('Please upload ped file')
        return
      }
      this.formData[tabKey].creating = true
      try {
        const formData = new FormData()
        formData.append('bspName', this.getCurBspName())
        formData.append('predicitonType', this.formData[tabKey].breed.length ? 'part' : 'all')
        formData.append('breed', this.formData[tabKey].breed.join(','))
        formData.append('file1', this.formData[tabKey].fileList1[0])
        formData.append('file2', this.formData[tabKey].fileList2[0])
        formData.append('fnType', tabKey === '2' ? 'fn2' : 'fn3')
        const res = await createBsp(formData)
        if (res && res.header && res.header.resCode === '0000') {
          this.$message.success('create success')
          this.handleSearch(tabKey)
        } else {
          this.$message.error(res.header.resMessage || 'create fail')
        }
      } catch (error) {
        this.$message.error('create fail')
        console.log(error)
      }
      this.formData[tabKey].creating = false
    },
    handleFullDownload(tabKey) {
      const url = tabKey === '2' ? '/znd/function2-feature loci information.txt' : '/znd/function3-feature loci information.txt'
      const name = tabKey === '2' ? 'Low Density Full Library Locations.txt' : 'High Density Full Library Locations.txt'
      downloadFile(url, name)
    },
    async handleFunc1Export(tabKey) {
      if (this.searchFormData[tabKey].breed.length) {
        this.searchResData[tabKey].exporting = true
        try {
          const stream = await exportDownload({
            breed: this.searchFormData[tabKey].breed.join(',')
          })
          downloadByStream(stream, 'snps_' + getCurTimeStr() + '.xlsx')
        } catch (error) {
          this.$message.error('export fail')
          console.log(error)
        }
        this.searchResData[tabKey].exporting = false
      }
    },
    handleFunc23Export(tabKey) {
      if (!this.searchResData[tabKey].rows.length) {
        return
      }
      const columns = Object.keys(this.searchResData[tabKey].rows[0]).map(key => ({
        key,
        header: key
      }))
      const rows = this.searchResData[tabKey].rows
      exportToExcel(columns, rows, 'bsp_' + this.searchResData[tabKey].detailId + '.xlsx')
    }
  }
}
</script>

<style lang="less" scoped></style>
