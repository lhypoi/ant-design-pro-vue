<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="flex flex-row justify-center h-14">
      <img src="@/assets/znd/logo.png" class="h-full w-auto" alt="">
    </div>
    <div class="flex flex-row items-start justify-between px-32 pt-10">
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
      <div style="width: 750px;">
        <div id="main" style="height:500px; width:100%;">
        </div>
      </div>
      <div class="flex flex-row justify-between pl-10">
        <div class="flex flex-col mr-10" style="width: 65%;">
          <div class="flex flex-col  pb-6">
            <div class="text-2xl font-bold pb-2">Version</div>
            <div>2020-08.PHASE1</div>
          </div>
          <div class="flex flex-col  pb-6">
            <div class="text-2xl font-bold pb-2">Size of data</div>
            <div>Breed(Population):50</div>
            <div>Cohort: 1,011 samples</div>
            <div>Sequencing bases: 66 Tb</div>
          </div>
          <div class="flex flex-col  pb-6">
            <div class="text-2xl font-bold pb-2">Number of variants</div>
            <div>SNP: 50,590,445</div>
            <div>INDEL: 12,870,753</div>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="flex flex-col pb-6">
            <div class="text-2xl font-bold pb-2">The latest news</div>
            <ul style="list-style-type: circle;">
              <li>2023-08 BSP function of 1KCIGP has been public available.</li>
              <li>2023-08 1KCIGP PHASE1 data has been released.</li>
            </ul>
          </div>
        </div>
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
      echarts: {},
      myData: [
        { name: 'Beijing', value: '0' }, { name: 'Tianjin', value: '0' },
        { name: 'Shanghai', value: '1' }, { name: 'Chongqing', value: '0' },
        { name: 'Hebei', value: '0' }, { name: 'Henan', value: '1' },
        { name: 'Yunnan', value: '3' }, { name: 'Liaoning', value: '0' },
        { name: 'Heilongjiang', value: '1' }, { name: 'Hunan', value: '4' },
        { name: 'Anhui', value: '3' }, { name: 'Shandong', value: '3' },
        { name: 'Xinjiang', value: '0' }, { name: 'Jiangsu', value: '5' },
        { name: 'Zhejiang', value: '3' }, { name: 'Jiangxi', value: '3' },
        { name: 'Hubei', value: '3' }, { name: 'Guangxi', value: '2' },
        { name: 'Gansu', value: '0' }, { name: 'Shanxi', value: '1' },
        { name: 'Inner Mongolia', value: '0' }, { name: 'Shaanxi', value: '2' },
        { name: 'Jilin', value: '0' }, { name: 'Fujian', value: '2' },
        { name: 'Guizhou', value: '2' }, { name: 'Guangdong', value: '4' },
        { name: 'Qinghai', value: '0' }, { name: 'Tibet', value: '0' },
        { name: 'Sichuan', value: '2' }, { name: 'Ningxia', value: '0' },
        { name: 'Hainan', value: '2' }, { name: 'Taiwan', value: '0' },
        { name: 'Hongkong', value: '0' }, { name: 'Macao', value: '0' }
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
    ...mapGetters(['hasLogin'])
  },
  created() {
  },
  async mounted() {
    this.echarts = window.echarts
    this.initChart()
  },
  methods: {
    initChart() {
      var optionMap = {
        backgroundColor: '#FFFFFF',
        title: {
          text: 'Samples distribution',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        // 左侧小导航图标
        visualMap: {
        x: 'left',
        y: 'middle',
        min: 0,
        max: 5,
        inRange: {
          color: [
            '#FFFFFF',
            '#3D6DB5'
          ]
        },
        text: ['High', 'Low'],
        calculable: true
      },

        // 配置属性
        series: [{
          name: 'Breed number',
          type: 'map',
          mapType: 'china',
          roam: true,
          label: {
            normal: {
              show: false // 省份名称
            },
            emphasis: {
              show: false
            }
          },
          layoutCenter: ['60%', '50%'], // 位置
          layoutSize: '80%', // 大小
          data: this.myData // 数据
        }]
      }
      // 初始化echarts实例
      var myChart = this.echarts.init(document.getElementById('main'))

      // 使用制定的配置项和数据显示图表
      myChart.setOption(optionMap)
    },
    randomData () {
      return Math.round(Math.random() * 500)
    },
    handleSearch() {
      this.$refs.homeForm.validate(async valid => {
        if (valid) {
          this.$router.push({ name: 'HomeSearch', query: { ...this.formData } })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
