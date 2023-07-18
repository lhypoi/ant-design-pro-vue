<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <h1 class="text-4xl font-bold text-center pt-2 pb-3">{{ title }}</h1>
    <div class="border-t border-gray-300 my-4"></div>
    <div v-for="(item, index) in publicEmailDomains" :key="index" class="text-gray-500 py-1 text-xl text-center">{{ item }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PublicEmailDomains',
  components: {
  },
  data() {
    return {
      title: 'Public Email Domains'
    }
  },
  computed: {
    ...mapState({
      publicEmailDomains: state => state.user.publicEmailDomains
    })
  },
  created() {
  },
  async mounted() {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped></style>
