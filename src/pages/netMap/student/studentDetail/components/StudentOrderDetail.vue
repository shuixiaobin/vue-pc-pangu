<template>
  <div class="order-detail">
    <div class="container-title">
      <h2>
        订单详情
        <span
          class="no-data"
          v-if="listData.length === 0"
        >暂无跟进记录</span>
      </h2>
      <i
        class="iconfont iconfull-o"
        @click="fullScreen"
      ></i>
    </div>
    <div
      class="container"
      v-if="listData.length > 0"
    >
      <StudentOrderTable :list-data="listData" />
      <el-pagination
        style="display:flex;justify-content: center;margin-top: 20px;"
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="page"
        :total="total"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <StudentOrderDialog
      :dialog-table-visible.sync="dialogTableVisible"
      :page.sync="page"
      :total="total"
      :list-data="listData"
    />
  </div>
</template>

<script>
  import StudentOrderTable from './StudentOrderTable'
  import StudentOrderDialog from './StudentOrderDialog'
  import { getStudentOrderList } from '@/api/netMap'
  import { pageMixin } from '../pageMixins'
  export default {
    mixins: [pageMixin],
    components: {
      StudentOrderTable,
      StudentOrderDialog,
    },
    data() {
      return {
        userName: this.$route.query.userName,
        dialogTableVisible: false,
      }
    },
    methods: {
      async getListData() {
        try {
          const { data } = await getStudentOrderList({
            page: this.page,
            pageSize: this.pageSize,
            userName: this.userName,
          })
          this.listData = Object.freeze(data.data)
          this.total = data.total
        } catch (err) {
          console.log(err)
        }
      },
      fullScreen() {
        this.dialogTableVisible = true
      },
    },
  }
</script>
<style lang='less' scoped>
  .order-detail {
    margin-top: 16px;
    background: #fff;
    .no-data {
      margin-left: 24px;
      height: 14px;
      font-size: 14px;
      font-weight: 500;
      color: #c0c4cc;
      line-height: 14px;
    }
    .iconfull-o {
      font-size: 24px;
    }
  }
</style>