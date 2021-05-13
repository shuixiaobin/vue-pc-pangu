<template>
  <div>
    <div class="container-title">
      <h2>角色管理</h2>
    </div>
    <div class="container-Box">
      <searchBox @search="search" />
    </div>
    <div class="container-Box mt20 minHeight">
      <div class="clearfix">
        <el-button
          size="small"
          icon="el-icon-plus"
          @click="add"
          v-auth="'RM_ADD'"
          class="fr"
        >添加</el-button>
      </div>
      <tableBox
        :tableData='tableData'
        @updateList='getList'
        class="mt20"
        @editData="editData"
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
    <dialogBox
      ref="dialog"
      :systemList="systemList"
      @refresh="getList"
    />
  </div>
</template>
<script>
  import searchBox from './components/search';
  import tableBox from './components/table';
  import dialogBox from './components/add';
  import { page } from '@/common/mixins';
  import { getSystemList,getRoleList } from '@/api/authority';
  export default {
    mixins: [page],
    data() {
      return {
        systemList: [{name:"潘多拉",id:1},{name:"申论 ",id:2},{name:"盘古",id:3}],
        tableData: []
      };
    },
    components: {
      searchBox,
      tableBox,
      dialogBox
    },
    created() {
      //this.getSystemList();
      this.getList();
    },
    methods: {
/*       getSystemList() {
        getSystemList()
          .then(res => {
            if (res.code == 1000000) {
              this.systemList = res.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }, */
      getList(data) {
        this.formLine = data ? data : this.formLine;
        getRoleList({
          ...this.formLine,
          page: this.page -1,
          pageSize: this.pageSize
        })
          .then(res => {
            this.tableData = res.data.content;
            this.total = res.data.totalElements;
          })
          .catch(err => {
            console.log(err);
          });
      },
      search(data) {
        this.page = 1;
        this.getList(data);
      },
      add() {
        this.$refs.dialog.openDialog(1);
      },

      editData(row) {
        this.$refs.dialog.openDialog(2, row);
      }
    }
  };
</script>