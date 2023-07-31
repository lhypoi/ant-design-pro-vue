<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="flex flex-row items-start justify-between px-10 pt-4">
      <div class="w-3/12 pr-2">
        <a-select v-model="formData.type" size="large" class="w-full">
          <a-select-option v-for="item in typeList" :key="item.key" :value="item.key">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
      <div class="w-7/12">
        <a-form-model
          ref="homeForm"
          :model="formData"
          :rules="formRules"
        >
          <div class="flex flex-row items-start gap-1">
            <template v-if="formData.type === 'gene'">
              <a-form-model-item key="gene" prop="gene" style="width: 100%">
                <a-input
                  v-model="formData.gene"
                  placeholder="Please input gene"
                  size="large"
                />
              </a-form-model-item>
            </template>
            <template v-if="formData.type === 'id'">
              <a-form-model-item key="id" prop="id" style="width: 100%">
                <a-input
                  v-model="formData.id"
                  placeholder="Please input id"
                  size="large"
                />
              </a-form-model-item>
            </template>
            <template v-if="formData.type === 'range'">
              <a-form-model-item key="chrom" prop="chrom" style="width: 36%">
                <a-input
                  addon-before="chr"
                  style="display: block; top: 0; height: 40px; overflow: hidden;"
                  size="large"
                  v-model="formData.chrom"
                  placeholder="1-18, X or Y"
                />
              </a-form-model-item>
              <a-form-model-item key="startPos" prop="startPos" style="width: 32%">
                <a-input
                  style="display: block; top: 0; height: 40px; overflow: hidden;"
                  size="large"
                  v-model="formData.startPos"
                  placeholder="start position"
                />
              </a-form-model-item>
              <a-form-model-item key="endPos" prop="endPos" style="width: 32%">
                <a-input
                  style="display: block; top: 0; height: 40px; overflow: hidden;"
                  size="large"
                  v-model="formData.endPos"
                  placeholder="end position"
                />
              </a-form-model-item>
            </template>
            <template v-if="formData.type === 'pos'">
              <a-form-model-item key="chrom2" prop="chrom2" style="width: 36%">
                <a-input
                  addon-before="chr"
                  style="display: block; top: 0; height: 40px; overflow: hidden;"
                  size="large"
                  v-model="formData.chrom2"
                  placeholder="1-18, X or Y"
                />
              </a-form-model-item>
              <a-form-model-item key="pos" prop="pos" style="width: 64%">
                <a-input
                  style="display: block; top: 0; height: 40px; overflow: hidden;"
                  size="large"
                  v-model="formData.pos"
                  placeholder="position"
                />
              </a-form-model-item>
            </template>
          </div>
        </a-form-model>
      </div>
      <div class="w-2/12 pl-4">
        <a-button
          type="primary"
          class="success-btn"
          block
          icon="search"
          size="large"
          @click="handleSearch"
        >
          Search
        </a-button>
      </div>
    </div>
    <div class="px-10">
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="(params) => searchMainData(params)"
        :alert="false"
        showPagination="auto"
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
import { searchMainData } from '@/api/cauAuth'

export default {
  name: 'HomeSearch',
  components: {
    STable
  },
  data() {
    return {
      columns: [
        {
          title: '#',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: 'CHROM',
          dataIndex: 'CHROM'
        },
        {
          title: 'POS',
          dataIndex: 'POS'
        },
        {
          title: 'ID',
          dataIndex: 'ID'
        },
        {
          title: 'REF',
          dataIndex: 'REF'
        },
        {
          title: 'ALT',
          dataIndex: 'ALT'
        },
        {
          title: 'QUAL',
          dataIndex: 'QUAL'
        },
        {
          title: 'Alt_freq',
          dataIndex: 'Alt_freq'
        },
        {
          title: 'gene',
          dataIndex: 'gene'
        },
        {
          title: 'European_AF',
          dataIndex: 'European_AF'
        }
      ],
      typeList: [
        {
          label: 'Gene symbol',
          key: 'gene'
        },
        {
          label: 'rsID',
          key: 'id'
        },
        {
          label: 'Regions',
          key: 'range'
        },
        {
          label: 'Positions',
          key: 'pos'
        }
      ],
      formData: {
        type: 'gene',
        gene: '',
        id: '',
        chrom: '',
        chrom2: '',
        pos: '',
        startPos: '',
        endPos: ''
      },
      formRules: {
        gene: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        id: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        chrom: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        chrom2: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        pos: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        startPos: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ],
        endPos: [
          {
            validator: (rule, value, callback) => {
              try {
                if (!value.trim()) {
                  callback(new Error('Please input'))
                }
              } catch (error) {
                console.log(error)
                callback(error)
              }
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    const query = this.$route.query
    this.formData = {
      ...this.formData,
      ...query
    }
  },
  async mounted() {
  },
  methods: {
    handleSearch() {
      this.$refs.homeForm.validate(async valid => {
        if (valid) {
          this.$refs.table.refresh(true)
        }
      })
    },
    async searchMainData(params) {
      const tableData = {
        data: [],
        pageSize: params.pageSize,
        pageNo: params.pageNo,
        totalCount: 0
      }
      try {
        const searchData = {}
        if (this.formData.type === 'gene') {
          searchData.gene = this.formData.gene
        } else if (this.formData.type === 'id') {
          searchData.id = this.formData.id
        } else if (this.formData.type === 'range') {
          searchData.chrom = 'chr' + this.formData.chrom
          searchData.startPos = this.formData.startPos
          searchData.endPos = this.formData.endPos
        } else if (this.formData.type === 'pos') {
          searchData.chrom = 'chr' + this.formData.chrom2
          searchData.pos = this.formData.pos
        }
        const res = await searchMainData({
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
            key: row.pk + '_' + row.POS + '_' + row.CHROM + '_' + row.ALT + '_' + row.Alt_freq + '_' + row.ID
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
