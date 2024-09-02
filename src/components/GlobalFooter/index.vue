<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a class="text-center" href="https://beian.miit.gov.cn" target="_blank">备案号：京ICP备2023016911号-2</a>
      <span class="text-center mx-10">@1KCIGP</span>
    </template>
    <!-- <template v-slot:copyright>
      <a href="https://github.com/vueComponent" target="_blank">vueComponent</a>
    </template> -->
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
