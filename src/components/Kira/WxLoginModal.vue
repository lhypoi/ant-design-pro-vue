<template>
  <div class="w-0 h-0 overflow-hidden absolute">
    <a-modal
      v-if="wxLoginModalParams.show"
      :title="''"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      :width="isMobile ? '90vw' : '450px'"
      @cancel="wxLoginModalParams.show = false"
    >
      <div>
        <div class="flex justify-center">
          <wxlogin
            :scope="'snsapi_login'"
            :appid="wxLoginModalParams.appId"
            :redirect_uri="wxLoginModalParams.url"
            :state="wxLoginModalParams.state"
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'WxLoginModal',
  mixins: [baseMixin],
  props: {
  },
  data () {
    return {
      wxLoginModalParams: {
        show: false,
        // abstest
        appId: 'wxe1f5def243e0390b',
        url: 'https://abstest.tenpay.com/abs/author/callBack.do',
        state: ''
      }
    }
  },
  computed: {
  },
  methods: {
    handleShowWxLoginModalParams({ state } = {}) {
      this.wxLoginModalParams = {
        ...this.wxLoginModalParams,
        show: true,
        state: state || ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
