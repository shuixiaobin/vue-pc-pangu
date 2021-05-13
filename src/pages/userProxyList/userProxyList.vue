<template>
  <div class="userProxyList">
    <div class="header clearfix">
      <span>用户代报课记录</span>
    </div>
    <uplSearch @search="search"></uplSearch>
    <uplTable :tableData="listData"></uplTable>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
  import uplSearch from './components/upl_search'
  import uplTable from './components/upl_table'
  import { getUserProxyList } from '@/api/dataClean'
  import { page } from '@/common/mixins.js'
  export default {
    mixins: [page],
    data() {
      return {
        searchData: {
          searchKey: '',
          searchValue: '',
          startTime: '',
          endTime: ''
        },
        listData: []
      }
    },
    components: {
      uplSearch,
      uplTable
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        getUserProxyList({
          ...this.searchData,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.listData = res.data.data
              this.total = res.data.total
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      search(data) {
        this.page = 1
        this.searchData = { ...data }
        this.getList()
      }
    }
  }
</script>
<style lang="less" scoped>
  .userProxyList {
    background: #fff;
    .header {
      padding: 18px 20px;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
    }
    .searchBox,
    .tableBox,
    .el-pagination {
      margin: 20px;
    }
  }
</style>