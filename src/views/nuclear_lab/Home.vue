<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-5 sm:p-8">
    <div class="flex flex-row">
      <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
        <a-form-model
          ref="homeForm"
          :model="formData"
        >
          <div class="flex flex-row items-start gap-4 overflow-x-auto">
            <a-form-model-item key="keyword" prop="keyword" class="flex-auto min-w-[170px]">
              <a-input
                v-model="formData.keyword"
                placeholder="请输入机房名称"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-form-model-item key="roomId" prop="roomId" class="flex-auto min-w-[170px]">
              <a-input
                v-model="formData.roomId"
                placeholder="请输入机房编号"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-button
              class="h-11 rounded-md text-base"
              type="primary"
              icon="search"
              size="large"
              @click="loadData"
            >
              查询
            </a-button>
          </div>
        </a-form-model>
      </div>
    </div>
    <div class="relative flex-auto h-0">
      <div v-loading="loading" class="h-full overflow-auto px-2 -mx-2 pb-2">
        <div v-if="!loading && !roomList.length" class="pt-10">
          <a-empty />
        </div>
        <div class="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 justify-between gap-5">
          <div
            v-for="room in roomList"
            :key="room.index"
            class="flex flex-col items-center gap-2 p-4 pb-2 border border-solid border-gray-400 rounded-md cursor-pointer hover:text-blue-400 hover:border-blue-400 hover:shadow-lg"
            @click="handleOpenLab(room)"
          >
            <div class="relative pr-[100%] pb-[66%]" >
              <el-image
                class="absolute w-full h-full"
                :src="room.img"
              />
            </div>
            <div class="text-sm">
              {{ room.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-end pt-4">
      <a-pagination
        :current="formData.pageNum"
        :total="total"
        show-size-changer
        :page-size-options="['50', '100', '200', '500']"
        :page-size="formData.pageSize"
        :show-total="total => `共 ${total} 个`"
        @change="handlePageChange"
        @showSizeChange="handlePageChange"
      />
    </div>
    <a-modal
      v-if="labModalParams.show"
      :title="labModalParams.labData.name"
      :visible="true"
      :footer="null"
      :maskClosable="false"
      centered
      width="90vw"
      @cancel="labModalParams.show = false"
    >
      <div class="h-[75vh] sm:h-[80vh] pt-6">
        <iframe
          :src="labModalParams.url"
          class="w-full h-full"
        ></iframe>
      </div>
    </a-modal>
  </div>
</template>

<script>
import nuclearLabApi from '@/api/nuclearLab'

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      formData: {
        keyword: '',
        roomId: '',
        pageNum: 1,
        pageSize: 50
      },
      loading: false,
      roomList: [],
      total: 0,
      labModalParams: {
        show: false,
        labData: null,
        url: ''
      }
    }
  },
  computed: {
  },
  created() {
  },
  async mounted() {
    this.loadData()
  },
  methods: {
    handleSearch() {
      this.formData.pageNum = 1
      this.loadData()
    },
    handlePageChange(current, size) {
      this.formData.pageNum = current
      this.formData.pageSize = size
      this.loadData()
    },
    async loadData() {
      this.loading = true
      try {
        const res = await nuclearLabApi.roomList({
          keyword: this.formData.keyword,
          roomId: this.formData.roomId,
          pageNum: this.formData.pageNum,
          pageSize: this.formData.pageSize
        })
        if (res && res.code === 200) {
          this.roomList = res.data.list
          this.total = res.data.total
        } else {
          throw new Error(res.message || '加载失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error(error.message)
      }
      this.loading = false
    },
    handleOpenLab(labData) {
      this.labModalParams.labData = labData
      this.labModalParams.url = 'http://wjw.sz.gov.cn/wsjd/fszlcs/1_dr/'
      this.labModalParams.show = true
    }
  }
}
</script>

<style lang="less" scoped></style>
