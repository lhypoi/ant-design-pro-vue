<template>
  <a-dropdown v-if="hasLogin" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" :src="avatarImg" class="antd-pro-global-header-index-avatar" />
      <span class="text-white">{{ userInfo.username }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <!-- <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <a-icon type="user" />
          {{ $t('menu.account.center') }}
        </a-menu-item> -->
        <!-- <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          {{ $t('menu.account.settings') }}
        </a-menu-item> -->
        <!-- <a-menu-divider v-if="menu" /> -->
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          {{ $t('menu.account.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else style="display: block; background: transparent;">
    <div class="h-full flex flex-row items-center">
      <div class="text-base text-gray-400 cursor-pointer hover:text-white pr-4" @click="handleToLogin">Log In</div>
      <div class="text-base text-gray-400 cursor-pointer hover:text-white" @click="handleToRegister">Sign Up</div>
    </div>
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AvatarDropdown',
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      avatarImg: require('@/assets/missing-face.png')
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info
    }),
    ...mapGetters(['hasLogin'])
  },
  mounted() {
  },
  methods: {
    handleToCenter () {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'Login' })
          })
        },
        onCancel () {}
      })
    },
    handleToRegister() {
      this.$router.push({ name: 'Register' })
    },
    handleToLogin() {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  :deep(.action) {
    margin-right: 8px;
  }
  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}
</style>
