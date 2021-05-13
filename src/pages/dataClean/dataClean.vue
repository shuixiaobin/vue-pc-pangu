<template>
  <div>
    <div class="container-title">
      <h2>外呼数据清洗</h2>
      <el-button
        type="primary"
        @click="openDialog"
        size="mini"
      >创建任务</el-button>
    </div>
    <div class="container">
      <dataCleanTable
        class="table"
        :tableData="tableData"
      ></dataCleanTable>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="container-pagination"
      >
      </el-pagination>
    </div>
    <dialogTask
      :isOpenDialog="isOpenDialog"
      @closeDialog="closeDialog"
    ></dialogTask>
  </div>
</template>
<script>
  import { getTaskList } from '@/api/dataClean'
  import dataCleanTable from './components/table'
  import dialogTask from './components/dialog'
  import { page } from '@/common/mixins.js'
  export default {
    mixins: [page],
    data() {
      return {
        tableData: [],
        isOpenDialog: false
      }
    },
    components: {
      dataCleanTable,
      dialogTask
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        getTaskList({ page: this.page, pageSize: this.pageSize })
          .then(res => {
            if (res.code == 10000) {
              this.tableData = res.data.data
              this.total = res.data.totalNum
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      openDialog() {
        this.isOpenDialog = true
      },
      closeDialog() {
        this.isOpenDialog = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .dataClean {
    background: #fff;
    .header {
      padding: 18px 20px;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
    }
    .table {
      margin: 40px 20px;
    }
  }
</style>