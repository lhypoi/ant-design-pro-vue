<template>
  <div class="h-full flex items-center">
    <div class="text-2xl cursor-pointer" :class="isHome ? 'text-white' : 'text-gray-400'" @click="toHome">
      mBiobank
    </div>
    <!-- <div
      class="flex-auto ml-4 sm:ml-8 mr-2 sm:mr-16 flex items-center h-9 rounded-full border border-solid border-zinc-200 bg-neutral-50 hover:ring-1 hover:ring-indigo-500 px-6"
    >
      <div class="flex cursor-pointer">
        <a-icon
          type="search"
          class="searchIcon text-zinc-200 hover:text-indigo-500"
        />
      </div>
      <a-select
        showSearch
        class="searchInput"
        label-in-value
        :value="value"
        :show-arrow="false"
        placeholder="搜索"
        style="width: 100%"
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
    </div> -->
  </div>
</template>
<script>
import { debounce } from 'lodash-es'

export default {
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
