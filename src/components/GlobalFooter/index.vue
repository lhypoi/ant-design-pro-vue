<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <span class="text-center">备案号：京ICP备2023016911号-2</span>
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
