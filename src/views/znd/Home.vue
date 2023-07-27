<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div class="flex flex-row justify-center h-28 mt-20">
      <img src="http://chinamap-public-sh.oss-cn-shanghai.aliyuncs.com/static%2Ffiles%2FchinaMap.png" class="h-full w-auto" alt="">
    </div>
    <div class="flex flex-row items-center justify-between pb-4 px-32 pt-20">
      <a-input-search placeholder="Search a gene symbol, rsID, region, or position" size="large" v-model="searchVal" @search="handleSearech" />
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
      searchVal: ''
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
    handleSearech() {
      if (!this.hasLogin) {
        this.$router.push({ name: 'Login' })
      } else {
        this.$router.push({ name: 'HomeSearch', query: { search: this.searchVal } })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
