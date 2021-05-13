<template>
  <div>
    <div class="container-title">
      <h2>退班审核</h2>
    </div>
    <search
      @search="search"
      :serviceType="'withDraw'"
    />
    <div class="container-Box mt16 minHeight">
      <el-button
        type="primary"
        size="small"
        @click="batchOperation(1)"
      >批量通过</el-button>
      <el-button
        type="primary"
        size="small"
        @click="batchOperation(0)"
      >批量驳回</el-button>
      <withdrawTable
        :tableData="tableData"
        @multipleSelection="getMultipleSelection"
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
  import withdrawTable from './components/withdrawTable';
  import { getAuditOrderList, orderAudit } from '@/api/orderManage';
  import { page } from '@/common/mixins';
  export default {
    mixins: [page],
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        searchData: {}
      };
    },
    components: {
      search,
      withdrawTable
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
          do_type: 'exit',
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
      },
      getMultipleSelection(val) {
        this.multipleSelection = val;
      },
      batchOperation(val) {
        if (this.multipleSelection.length > 0) {
          let orderIds = this.multipleSelection.join(',')
          orderAudit({
            order_id: orderIds,
            do_type: 'exit',
            auth_type: val
          })
            .then(res => {
              if (res.code == 1000) {
                this.$message.success(val ? '审核已通过' : '审核已驳回');
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error('请先选择订单');
        }
      }
    }
  };
</script>