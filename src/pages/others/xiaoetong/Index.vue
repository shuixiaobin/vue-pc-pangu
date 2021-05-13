<template>
  <div>
    <MenuTitle />
    <TableSearch v-auth="auth.FIND" ref="search" @search="search" />
    <div class="container-Box mt16 minHeight">
      <ListTable ref="table" :tableData="tableData" :loading="loading">
        <template #handle="{ row }">
          <table-row-button v-auth="auth.BIND" type="text" @click="openBindDialog(row)">
            {{
              row.net_classes_rid && row.net_classes_rid.length
                ? '修改'
                : '绑课'
            }}
          </table-row-button>
        </template>
      </ListTable>
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
    <ClassBinder
      :visible.sync="binderVisible"
      :classIds="selectClass && selectClass.net_classes_rid"
      :rid="selectClass && selectClass.rid"
      @binded="onClassBinded"
    />
  </div>
</template>

<script>
import TableRowButton from '@/components/Table/TableRowButton';
import ListTable from './components/ListTable';
import TableSearch from './components/TableSearch';
import { getXiaoetongClassList } from '@/api/other.js';
import { page } from '@/common/mixins';
import ClassBinder from './components/ClassBinder.vue';
export default {
  components: {
    TableSearch,
    ListTable,
    TableRowButton,
    ClassBinder,
  },
  mixins: [page],
  data() {
    const auth = {
      FIND: 'XET_FIND',
      BIND: 'XET_BIND',
    }
    return {
      auth,
      tableData: [],
      selectClass: null,
      binderVisible: false,
      loading: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    search() {
      this.page = 1;
      this.getList();
    },
    getList() {
      let searchData = this.$refs.search.getSearchData();
      getXiaoetongClassList({
        ...searchData,
        page: this.page,
        page_size: this.pageSize,
      })
        .then(res => {
          if (res.code === 0) {
            this.tableData = res.list;
            this.total = res.total;
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    bindVisible() {},
    openBindDialog(row) {
      this.selectClass = row;
      this.binderVisible = true;
    },
    onClassBinded() {
      this.getList();
    }
  },
};
</script>

<style>
</style>