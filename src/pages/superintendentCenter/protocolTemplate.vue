<template>
  <div class="protocolTemplate">
    <menu-title></menu-title>
    <div class="container">
      <search-form :searchType="'0'" @search="search"></search-form>
      <protocol-table :tableData="tableData" @getList="getList"></protocol-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import MenuTitle from "../../components/menuTitle.vue";
import ProtocolTable from "./components/protocolTable.vue";
import SearchForm from "./components/searchForm.vue";
import {page} from '@/common/mixins'
import {getTempList} from '@/api/learnCenter.js'
export default {
  components: {
    SearchForm,
    MenuTitle,
    ProtocolTable,
  },

  mixins: [page],

  data() {
    return {
      tableData: [],
      searchVal: {}
    };
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      const params = {
        page: this.page,
        pageSize: this.pageSize
      }
      Object.assign(params, this.searchVal)
      getTempList(params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      }).catch(err => {
        this.$message.error(err)
      })
    },

    search(val) {
      const {name, status} = val
      const protocolName = name
      Object.assign(this.searchVal, {protocolName, status})
      this.page = 1
      this.getList()
    }
  }
};
</script>

<style lang="less" scoped>
.protocolTemplate {
  background-color: #fff;
}
</style>