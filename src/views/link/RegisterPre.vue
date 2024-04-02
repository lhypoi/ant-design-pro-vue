<template>
  <div class="bg-gradient-to-r from-indigo-400 to-indigo-500">
    <div class="mx-auto min-h-screen xl:w-[1200px] xl:flex xl:flex-col xl:justify-center">
      <div class="flex flex-col xl:flex-row">
        <div class="flex-auto flex flex-col justify-between items-center xl:items-start px-4 py-10">
          <div class="text-white text-5xl pb-10">领克数云</div>
          <div class="text-white text-2xl pb-2">一个提供高学历学术人才</div>
          <div class="text-white text-2xl">帮助客户解决学术难题的平台</div>
          <div class="flex-auto pt-5 flex flex-row gap-x-5">
            <template v-if="userType === USER_TYPE.TEACHER">
              <a-button size="large" class="rounded-md w-36 h-12 text-xl" @click="$router.push({ name: 'tRegister' })">教师注册</a-button>
              <a-button size="large" class="rounded-md w-36 h-12 text-xl" @click="$router.push({ name: 'tLogin' })">教师登录</a-button>
            </template>
            <template v-if="userType === USER_TYPE.ORGANIZATION">
              <a-button size="large" class="rounded-md w-36 h-12 text-xl" @click="$router.push({ name: 'oRegister' })">机构注册</a-button>
              <a-button size="large" class="rounded-md w-36 h-12 text-xl" @click="$router.push({ name: 'oLogin' })">机构登录</a-button>
            </template>
          </div>
        </div>
        <div class="px-10 flex flex-col items-center justify-center gap-y-5">
          <div class="flex justify-center text-white text-2xl">待定：对应角色的文案图</div>
          <img src="@/assets/p1.png" alt="" srcset="" class="max-w-[320px] xl:max-w-[400px]">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { USER_TYPE } from '@/store/mutation-types-link-dev'

export default {
  name: 'RegisterPre',
  components: {
  },
  data() {
    return {
      USER_TYPE
    }
  },
  computed: {
    userType() {
      return this.$route.meta.userType
    }
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
