<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a class="text-center" href="https://beian.miit.gov.cn" target="_blank">备案号：京ICP备2023016911号-2</a>
      <span class="text-center mx-10">@1KCIGP</span>
      <span class="pl-20">
        <a href="" class="inline-flex items-center gap-1 cursor-pointer">
          <img src="@/assets/znd/beian.png" style="width: 16px; height: auto" />
          <span style="color: #939393">
            京公网安备 11010802042839号
          </span>
        </a>
      </span>
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
