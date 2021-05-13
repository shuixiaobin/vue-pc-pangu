<template>
  <div>
    <div class="container-title flexStart">
      <h2>微信活码领取</h2>
      <el-button
        type="primary"
        @click="goCreate"
        size="mini"
        v-auth="'VC_NEW'"
      >新建</el-button>
    </div>
    <div class="container">
      <Search @handleSearch="handleSearch" /> 
      <tabel-component
        :tabelData="tabelData"
        @update="update"
      />
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
  </div>
</template>

<script>
  import { page } from '@/common/mixins.js'
  import { getActivityCodeList } from '@/api/scanCode'
  import TabelComponent from './components/TabelComponent'
  import Search from './components/Search'
  export default {
    mixins: [page],
    components: { TabelComponent, Search },
    data() {
      return {
        tabelData: [],
        searchParams: {}
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      handleSearch(params) {
        this.searchParams = params
        this.page = 1
        this.getList()
      },
      // 更新数据
      update() {
        this.getList()
      },
      getList() {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          ...this.searchParams
        }
        getActivityCodeList(params)
          .then(res => {
            if (res.code === 10000) {
              this.tabelData = res.data.data
              this.total = res.data.total
              this.page = res.data.current_page
            } else {
              throw new Error(res.msg)
            }
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },
      goCreate() {
        this.$router.push('/activityManagement/createCode')
      }
    }
  }
</script>
<style lang='less' scoped>
  header {
    padding: 20px;
    background: #f2f2f2;
  }
  .form-inline {
    margin-top: 20px;
  }
  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
</style>