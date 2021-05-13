<template>
  <div>
    <div class="container-title">
      <h2>图书搜索</h2>
    </div>
    <div class="search-box">
      <search @searchFn="searchFn"></search>
    </div>
    <div class="container-title flexStart">
      <h2>图书列表</h2>
      <el-button
        type="primary"
        size="small"
        @click="addbook"
        style="margin:0 10px;"
      >添加图书</el-button>
    </div>
    <div class="container">
      <tableBox
        :tableData="tableData"
        @refush="search"
      ></tableBox>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        class="container-pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import search from './components/bookSearch'
  import tableBox from './components/bookTable'
  import { getBookList } from '@/api/bookApi'
  export default {
    data() {
      return {
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 20,
          total: null
        }
      }
    },
    components: {
      search,
      tableBox
    },
    created() {
      this.search()
    },
    methods: {
      highLevel() {
        this.isShowHighlevel = !this.isShowHighlevel
      },
      search(data) {
        let param = data ? data : null
        if (param) {
          if (param.keyword == 'bookName') {
            param.bookName = param.content ? param.content : null
          } else if (param.keyword == 'bookId') {
            param.bookId = param.content ? param.content : null
          } else if (param.keyword == 'bookNo') {
            param.bookNo = param.content ? param.content : null
          } else {
            param.creatorName = param.content ? param.content : null
          }
        }
        getBookList({
          ...param,
          content: null,
          keyword: null,
          page: this.page.pageNum,
          pageSize: this.page.pageSize
        })
          .then(res => {
            this.tableData = res.data.list
            this.page.total = res.data.totalAllNum
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      searchFn(param) {
        this.page.pageNum = 1
        if (param) {
          if (param.keyword == 'bookName') {
            param.bookName = param.content ? param.content : null
          } else if (param.keyword == 'bookId') {
            param.bookId = param.content ? param.content : null
          } else if (param.keyword == 'bookNo') {
            param.bookNo = param.content ? param.content : null
          } else {
            param.creatorName = param.content ? param.content : null
          }
        }
        getBookList({
          ...param,
          content: null,
          keyword: null,
          page: this.page.pageNum,
          pageSize: this.page.pageSize
        })
          .then(res => {
            this.tableData = res.data.list
            this.page.total = res.data.totalAllNum
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      handleSizeChange(val) {
        this.page.pageSize = val
        this.search()
      },
      handleCurrentChange(val) {
        this.page.pageNum = val
        this.search()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      addbook() {
        this.$router.push({ path: '/home/addBook' })
      }
    }
  }
</script>
<style lang='less' scoped>
  .search-box {
    padding:16px;
    background:#fff;
  }
</style>