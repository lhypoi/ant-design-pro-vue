<template>
  <div>
    <div
      class="fixed top-0 left-0 w-full h-16 bg-white z-50 shadow-md"
    >
      <div
        class="m-auto w-full h-full max-w-[1400px] flex justify-between items-center px-4"
      >
        <div class="flex items-center">
          <img src="@/assets/link/t2.webp" alt="Logo" class="h-10 mr-2" />
        </div>
        <template v-if="hasLogin">
          <div class="border-l border-solid border-gray-950 h-8 ml-6 mr-6"></div>
          <div class="flex-auto overflow-hidden">
            <a-menu :selectedKeys="[$route.name]" mode="horizontal" class="h-full leading-[64px]">
              <a-menu-item
                v-for="menu in menus"
                :key="menu.name"
                @click="() => $router.push({ name: menu.name })"
              >
                <a-icon :type="menu.meta.icon" />
                <a-badge :count="1" :offset="[8, 0]">
                  <span>{{ menu.meta.title }}</span>
                </a-badge>
              </a-menu-item>
            </a-menu>
          </div>
          <div class="h-full flex items-center">
            <a-dropdown>
              <div class="h-full flex items-center gap-x-3 cursor-pointer hover:bg-gray-100 px-3">
                <div class="w-8 h-8 rounded-full bg-blue-400 text-white flex justify-center items-center text-xl leading-none">{{ userInfo.name[0].toUpperCase() }}</div>
                <span class="text-lg hover:text-blue-400 hidden sm:inline">{{ userInfo.name }}</span>
              </div>
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="handleLogout">退出登录</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </template>
      </div>
    </div>
    <div class="min-h-screen flex flex-col pt-16">
      <div
        class="flex-auto flex flex-col"
      >
        <router-view :key="$route.path" />
      </div>
      <div
        v-if="showFooter"
        class="bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.1)]"
      >
        <div
          class="m-auto w-full h-full max-w-[1200px] flex justify-between items-center px-4 py-4"
        >
          <div class="flex items-center">
            <img src="logo.png" alt="Logo" class="h-8 mr-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters
} from 'vuex'
import { Modal } from 'ant-design-vue'
import storage from 'store'
import { TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

export default {
  name: 'BasicLayout',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info,
      mainMenu: state => state.permission.addRouters
    }),
    ...mapGetters(['hasLogin']),
    menus() {
      const routes = this.mainMenu.find(item => item.path === '/')
      const children = (routes && routes.children) || []
      const showChildren = children.filter(item => !item.hidden)
      return showChildren
    },
    showFooter() {
      return false
    }
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.$store.commit(TOGGLE_MOBILE_TYPE, window.innerWidth < 640)
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: storage.get('defaultLoginRoute') || 'Login' })
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>
