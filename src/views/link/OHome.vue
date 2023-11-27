<template>
  <div class="relative flex-auto flex flex-col bg-white rounded-3xl p-6">
    <div class="flex items-center justify-center bg-gray-300 h-[200px]">
      待定轮播
    </div>
    <div class="flex flex-wrap items-end gap-3 min-h-[72px] pt-7 -mb-1">
      <div class="link-style-form w-full link-style-form-sm pb-5 sm:pb-0">
        <a-form-model
          :model="searchParams"
        >
          <div class="flex flex-row items-start gap-4 overflow-x-auto">
            <a-form-model-item key="name" prop="name" class="flex-auto min-w-[170px]">
              <a-input
                v-model="searchParams.name"
                placeholder="请输入老师名称"
                size="large"
                allowClear
              />
            </a-form-model-item>
            <a-button
              class="h-11 rounded-md text-base"
              type="primary"
              icon="search"
              size="large"
              @click="handleSearch"
            >
              查询
            </a-button>
            <a-button
              class="h-11 rounded-md text-base"
              type="primary"
              icon="search"
              size="large"
              @click="$refs.LinkOrderModal.handleOpenLinkOrderModal()"
            >
              发起委托
            </a-button>
          </div>
        </a-form-model>
      </div>
    </div>
    <div
      class="flex-auto flex flex-col"
      :class="'h-[60vh]'"
      v-loading="dataListLoading"
    >
      <div class="h-full pb-4 px-2 -mx-2 py-1 overflow-auto">
        <div class="grid grid-cols-1 xl:grid-cols-3 justify-between gap-5">
          <div
            v-for="teacher in dataList"
            :key="teacher.userId"
            class="flex flex-col bg-slate-50 rounded-lg p-3 drop-shadow-md cursor-pointer hover:ring-2"
          >
            <div class="flex flex-row">
              <div class="w-24 rounded-md overflow-hidden">
                <div class="relative pr-[100%] pb-[100%] cursor-pointer">
                  <el-image
                    class="absolute w-full h-full"
                    :src="require('@/assets/link/task-type-1.png')"
                  />
                </div>
              </div>
              <div class="flex-auto pl-4 flex flex-col gap-y-1 text-base">
                <div class="flex gap-x-4 justify-between">
                  <div class="font-bold">{{ teacher.name }}</div>
                  <div class="font-bold">{{ `ID: ${ teacher.userId }` }}</div>
                </div>
                <div class="flex gap-x-4">
                  <div>{{ teacher.college }}</div>
                  <div>{{ `${ teacher.highEduLevelName }` }}</div>
                </div>
                <div class="flex gap-x-4">
                  <div>{{ `专业: ${ teacher.major }` }}</div>
                </div>
              </div>
            </div>
            <div class="pt-3 pb-2">
              <div class="text-base line-clamp-1">
                {{ teacher.advantage }}
              </div>
            </div>
            <div class="flex flex-row gap-x-2 flex-wrap gap-y-2">
              <a-button
                class="h-7 rounded-md"
                type="primary"
                @click="$refs.LinkOrderModal.handleOpenLinkOrderModal(undefined, teacher.userId)"
              >
                发起委托
              </a-button>
              <a-button
                class="h-7 rounded-md"
                type="primary"
              >
                在线沟通
              </a-button>
              <a-button
                class="h-7 rounded-md"
                type="primary"
                @click="$refs.LinkTeacherModal.handleOpenLinkTeacherModal(teacher.userId)"
              >
                查看简历
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-end pt-3">
      <el-pagination
        class="-mr-3"
        :disabled="dataListLoading || searchParams.sizeChangeFlag"
        :current-page.sync="searchParams.pageIndex"
        :page-size.sync="searchParams.pageSize"
        :layout="isMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next'"
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
import { mapState, mapGetters } from 'vuex'
import { CUR_APP } from '@/store/mutation-types'
import lingkeApi from '@/api/lingke'
import KTable from '@/components/Kira/KTable'
import LinkOrderModal from '@/components/Kira/LinkOrderModal'
import LinkTeacherModal from '@/components/Kira/LinkTeacherModal'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'OHome',
  mixins: [baseMixin],
  components: {
    KTable,
    LinkOrderModal,
    LinkTeacherModal
  },
  data() {
    return {
      lingkeApi,
      pageSizes: [50, 100, 200, 500],
      total: 0,
      searchParams: {
        sizeChangeFlag: false,
        pageIndex: 1,
        pageSize: 50,
        name: ''
      },
      dataList: [],
      dataListLoading: false
    }
  },
  computed: {
    ...mapState(CUR_APP, [
      'userInfo'
    ]),
    ...mapGetters('asyncConfig', {
      codeDict: 'codeDict'
    })
  },
  async mounted() {
    this.handleGetDataList()
  },
  methods: {
    async handleGetDataList() {
      this.dataListLoading = true
      let dataList = []
      let total = 0
      try {
        const res = await lingkeApi.teacherGetList({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          name: this.searchParams.name || undefined
        })
        if (res && res.code === 1000) {
          dataList = res.data.list
          total = res.data.totalCount
        } else {
          throw new Error(res.msg || '加载列表数据失败')
        }
      } catch (error) {
        this.$message.error(error.message)
        console.log(error)
      }
      this.dataList = dataList
      this.total = total
      this.dataListLoading = false
    },
    async handleSearch() {
      this.searchParams.sizeChangeFlag = true
      this.searchParams.pageIndex = 1
      await this.handleGetDataList()
      this.searchParams.sizeChangeFlag = false
    },
    handleSizeChange() {
      this.handleSearch()
    },
    handleCurrentChange() {
      if (this.searchParams.sizeChangeFlag) return
      this.handleGetDataList()
    }
  }
}
</script>

<style lang="less" scoped></style>
