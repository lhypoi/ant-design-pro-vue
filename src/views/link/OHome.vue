<template>
  <div class="w-full mx-auto max-w-[1200px] relative flex-auto flex flex-col rounded-3x py-6">
    <div v-loading="dataTopLoading" class="bg-white shadow-sm rounded-lg p-5">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="(item, index) in dataTopList" :key="index">
          <div class="h-full bg-gray-200 overflow-hidden rounded-xl">
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="flex flex-wrap items-end gap-3 mt-6 mb-3">
      <div class="link-style-form w-full link-style-form-sm">
        <a-form-model :model="searchParams">
          <div class="flex flex-row items-start gap-4 overflow-x-auto">
            <div class="flex-auto min-w-[170px] flex items-center h-10 rounded-full bg-white pl-2 pr-4 shadow-sm">
              <a-input
                class="searchInput2 block flex-auto"
                placeholder="老师名称\学校\专业"
                v-model="searchParams.name"
              />
              <div class="flex cursor-pointer" @click="handleSearch">
                <img src="@/assets/link/t4.webp" alt="" srcset="" class="w-6 h-6" />
              </div>
            </div>
            <a-button
              class="rounded-md"
              type="primary"
              icon="edit"
              size="large"
              @click="$refs.LinkOrderModal.handleOpenLinkOrderModal()"
            >
              发布委托
            </a-button>
          </div>
        </a-form-model>
      </div>
    </div>
    <div
      class="min-h-[90px]"
      v-loading="dataListLoading"
      element-loading-spinner="el-icon-loading mt-3"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="grid grid-cols-1 xl:grid-cols-2 justify-between gap-5">
        <div
          v-for="teacher in dataList"
          :key="teacher.userId"
          class="flex flex-col bg-white rounded-lg p-3 drop-shadow-sm hover:ring-2"
        >
          <div class="flex flex-row">
            <div class="w-24 h-24 rounded bg-blue-400 text-white flex justify-center items-center text-3xl leading-none">
              {{ teacher.nickName[0].toUpperCase() }}
            </div>
            <div class="flex-auto w-0 overflow-hidden pl-4 flex flex-col gap-y-2 text-base">
              <div class="flex gap-x-4 justify-between">
                <div class="font-bold text-ellipsis whitespace-nowrap overflow-hidden">{{ teacher.nickName }}</div>
                <div class="text-sm text-blue-400 cursor-pointer whitespace-nowrap" @click="$refs.LinkTeacherModal.handleOpenLinkTeacherModal(teacher.userId)">去看他 ></div>
              </div>
              <div class="flex flex-col gap-1 leading-none">
                <div class="text-ellipsis whitespace-nowrap overflow-hidden"><i class="el-icon-school text-blue-400"></i> {{ teacher.college }} {{ teacher.highEduLevelName }}</div>
                <div class="text-ellipsis whitespace-nowrap overflow-hidden"><i class="el-icon-s-custom text-blue-400"></i> {{ teacher.major }}</div>
                <div class="text-ellipsis whitespace-nowrap overflow-hidden"><i class="el-icon-s-opportunity text-blue-400"></i> {{ teacher.advantage }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!dataList.length" class="h-20 flex justify-center items-center text-gray-400 bg-white rounded-lg">空空如也</div>
    </div>
    <div class="flex flex-row justify-center py-2 bg-white rounded-lg mt-5">
      <el-pagination
        :disabled="dataListLoading"
        :current-page.sync="searchParams.pageIndex"
        :page-size.sync="searchParams.pageSize"
        :layout="isMobile ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next'"
        :page-sizes="pageSizes"
        :total="total"
        :pager-count="5"
        background
        :small="isMobile"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <LinkOrderModal ref="LinkOrderModal" />
    <LinkTeacherModal
      ref="LinkTeacherModal"
      @handleOpenLinkOrderModal="userId => $refs.LinkOrderModal.handleOpenLinkOrderModal(undefined, userId)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import LinkOrderModal from '@/components/Kira/LinkOrderModal'
import LinkTeacherModal from '@/components/Kira/LinkTeacherModal'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'OHome',
  mixins: [baseMixin],
  components: {
    LinkOrderModal,
    LinkTeacherModal
  },
  data() {
    return {
      lingkeApi,
      pageSizes: [10, 50, 100],
      total: 0,
      searchParams: {
        pageIndex: 1,
        pageSize: 10,
        name: ''
      },
      dataList: [],
      dataListLoading: false,
      dataTopLoading: false,
      dataTopList: []
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'userInfo'
    ])
  },
  async mounted() {
    this.handleGetDataTop()
    this.handleGetDataList()
  },
  methods: {
    async handleGetDataTop() {
      this.dataTopLoading = true
      try {
        // TODO: new url
        const res = await lingkeApi.teacherGetList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          name: this.searchParams.name || undefined
        })
        if (res && res.code === 200) {
          this.dataTopList = res.data.list
        } else {
          throw new Error(res.message || '加载数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      } finally {
        this.dataTopLoading = false
      }
    },
    async handleGetDataList() {
      this.dataListLoading = true
      try {
        const res = await lingkeApi.teacherGetList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          name: this.searchParams.name || undefined
        })
        if (res && res.code === 200) {
          this.dataList = res.data.list
          this.total = res.data.total
        } else {
          throw new Error(res.message || '加载列表数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      } finally {
        this.dataListLoading = false
      }
    },
    async handleSearch() {
      this.searchParams.pageIndex = 1
      await this.handleGetDataList()
    },
    handleSizeChange() {
      this.handleSearch()
    },
    handleCurrentChange() {
      this.handleGetDataList()
    }
  }
}
</script>

<style lang="less" scoped>
.searchInput2 {
  border: none;
  background: transparent;
  box-shadow: none;
  cursor: text;
}
</style>
