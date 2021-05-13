<template>
  <div>
    <MenuTitle></MenuTitle>
    <search
      @search="search"
      :serviceType="'behalf'"
    />
    <div class="container-Box mt16 minHeight">
      <!-- <el-button
        type="primary"
        size="small"
      >批量通过</el-button>
      <el-button
        type="primary"
        size="small"
      >批量驳回</el-button> -->
      <behalfTable
        :tableData="tableData"
        :loading="loading"
        @refresh="refresh"
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
  import search from './components/search';
  import behalfTable from './components/behalfTable';
  import { getBehalfAuditList } from '@/api/orderManage';
  import { page } from '@/common/mixins';
  export default {
    mixins: [page],
    data() {
      return {
        loading: false,
        tableData: [],
        searchData: {}
      };
    },
    components: {
      search,
      behalfTable
    },
    methods: {
      search(data) {
        this.loading = true;
        this.page = 1;
        this.getList(data);
      },
      getList(params) {
        this.searchData = params || this.searchData;
        let {
          catetype,
          istreaty,
          payTimeEnd,
          payTimeStart,
          aTimeEnd,
          aTimeStart,
          ...newSearchData
        } = this.searchData;
        getBehalfAuditList({
          cTimeStart: this.searchData.aTimeStart,
          cTimeEnd: this.searchData.aTimeEnd,
          ...newSearchData,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.loading = false;
              this.tableData = res.data.data;
              this.total = res.data.page.totleCount;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      refresh() {
        this.loading = true;
        this.page = 1;
        this.getList(this.searchData);
      }
    }
  };
</script>