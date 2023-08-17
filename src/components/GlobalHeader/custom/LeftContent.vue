<template>
  <div class="h-full flex flex-row items-center flex-auto pr-4">
    <div>
      <!-- 强制覆盖，因为 antd pro 在此处的样式规则是直接指到 img 标签 -->
      <img :src="logoImg" alt="logo" style="display: block; height: 24px; width: auto;">
    </div>
    <div
      class="group flex-auto max-w-[400px] ml-8 flex items-center h-9 rounded-full border border-solid border-zinc-200 bg-neutral-50 hover:ring-1 hover:ring-indigo-500 px-6"
    >
      <div class="flex cursor-pointer">
        <a-icon
          type="search"
          class="searchIcon text-zinc-200 group-hover:text-indigo-500"
        />
      </div>
      <a-select
        showSearch
        class="searchInput block flex-auto"
        label-in-value
        :value="value"
        :show-arrow="false"
        placeholder="搜索"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        @search="fetchUser"
        @change="handleChange"
      >
        <a-spin
          v-if="fetching"
          slot="notFoundContent"
          size="small"
        />
        <a-select-option
          v-for="d in data"
          :key="d.value"
        >
          {{ d.text }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash-es'
import { CUR_APP } from '@/store/mutation-types'

export default {
  name: 'LeftContent',
  data() {
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
    return {
      data: [],
      value: [],
      fetching: false
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'logoImg'
    ]),
    isHome() {
      return this.$route.name === 'Home'
    }
  },
  methods: {
    toHome() {
      this.$router.push({ name: 'Home' })
    },
    fetchUser(value) {
      console.log('fetching user', value)
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
      fetch('https://randomuser.me/api/?results=5')
        .then(response => response.json())
        .then(body => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }
          const data = body.results.map(user => ({
            text: `${user.name.first} ${user.name.last}`,
            value: user.login.username
          }))
          this.data = data
          this.fetching = false
        })
    },
    handleChange(value) {
      Object.assign(this, {
        value,
        data: [],
        fetching: false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.searchIcon {
  :deep(svg) {
    width: 18px;
    height: 18px;
  }
}

.searchInput {
  :deep(.ant-select-selection) {
    border: none;
    background: transparent;
    box-shadow: none;
    cursor: text;
  }
}
</style>
