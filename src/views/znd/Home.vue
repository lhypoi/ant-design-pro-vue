<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="flex flex-row justify-center h-28 mt-20">
      <img src="@/assets/znd/logo.png" class="h-full w-auto" alt="">
    </div>
    <div class="flex flex-row items-start justify-between px-32 pt-20">
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
    <div class="flex flex-row justify-between px-20 pt-10">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
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
    ...mapGetters(['hasLogin'])
  },
  created() {
  },
  async mounted() {
  },
  methods: {
    handleSearch() {
      if (!this.hasLogin) {
        this.$router.push({ name: 'Login' })
      } else {
        this.$refs.homeForm.validate(async valid => {
          if (valid) {
            this.$router.push({ name: 'HomeSearch', query: { ...this.formData } })
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
