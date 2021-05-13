<template>
  <div>
    <div class="container-title">
      <h2>转班审核</h2>
    </div>
    <search @search="search" />
    <div class="container-Box mt16 minHeight">
      <el-button
        type="primary"
        size="small"
      >批量通过</el-button>
      <el-button
        type="primary"
        size="small"
      >批量驳回</el-button>
      <transferTable :tableData="tableData" />
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
  import transferTable from './components/transferTable';
  import { getAuditOrderList } from '@/api/orderManage';
  import { page } from '@/common/mixins';
  export default {
    mixins: [page],
    data() {
      return {
        tableData: [],
        searchData: {}
      };
    },
    components: {
      search,
      transferTable
    },
    methods: {
      search(data) {
        this.page = 1;
        this.getList(data);
      },
      getList(params) {
        this.searchData = params || this.searchData;
        let start_date = this.searchData.date[0] ? this.searchData.date[0] : '';
        let end_date = this.searchData.date[1] ? this.searchData.date[1] : '';
        let { date, ...newSearchData } = this.searchData;
        getAuditOrderList({
          start_date,
          end_date,
          do_type: 'turn',
          ...newSearchData,
          page: this.page,
          page_size: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.tableData = res.data.data;
              this.total = res.data.total;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };
</script>