<template>
  <div class="protocolParameter">
    <menu-title></menu-title>
    <div class="container">
      <search-form :searchType="'1'" @search="search"></search-form>
      <el-button type="primary" @click="addParamTemp" v-auth="'PARAM_ADD'">新增协议参数</el-button>
      <parameter-table :tableData="tableData" @refresh="getList"></parameter-table>
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
    <parameter-dialog ref="paramDia" @refresh="getList"></parameter-dialog>
  </div>
</template>

<script>
import menuTitle from "../../components/menuTitle.vue";
import ParameterTable from "./components/parameterTable.vue";
import SearchForm from "./components/searchForm.vue";
import ParameterDialog from "./components/parameterDialog";
import { getParamList } from "@/api/learnCenter.js";
import {page} from '@/common/mixins.js'
export default {
  components: { menuTitle, SearchForm, ParameterTable, ParameterDialog },

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
      getParamList(params).then((res) => {
        this.tableData = res.data.data
        this.total = res.data.total
      });
    },

    search(val) {
      const {name, templateType, categoryId} = val
      let param = name
      Object.assign(this.searchVal, {param, templateType, categoryId})
      this.page = 1
      this.getList()
    },

    addParamTemp() {
      this.$refs.paramDia.openDialog();
    },
  },
};
</script>

<style lang="less" scoped>
.protocolParameter {
  background-color: #fff;

  .container .search-form {
    display: inline;
  }
}
</style>