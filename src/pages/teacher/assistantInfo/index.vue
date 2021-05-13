<template>
  <div>
    <MenuTitle></MenuTitle>
    <div class="container-Box">
      <indexSearch @search="search" />
    </div>
    <div class="container-Box mt20 minHeight">
      <div class="clearfix">
        <el-button
          size="small"
          @click="add"
          v-auth="'ZHU_ADD'"
          class="fr"
        >新增</el-button>
      </div>
      <indexTable
        class="mt20"
        :tableData="tableData"
        @edit="edit"
        @look="look"
        @changeStatus="changeStatus"
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
  import indexSearch from './components/indexSearch';
  import indexTable from './components/indexTable';
  import { page } from '@/common/mixins';
  import { getAssistantList, changeAssistantStatus } from '@/api/teacher';
  export default {
    mixins: [page],
    data() {
      return {
        searchData: {
          id: '',
          name: ''
        },
        tableData: []
      };
    },
    components: {
      indexSearch,
      indexTable
    },
    created() {
      this.getList();
    },
    methods: {
      search(data) {
        this.page = 1;
        this.getList(data);
      },
      getList(params) {
        let searchData = params ? params : this.searchData;
        getAssistantList({
          ...searchData,
          page: this.page,
          size: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.tableData = res.data.content;
              this.total = res.data.totalElements;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      add() {
        this.$router.push({ path: '/teacher/addAssistant' });
      },
      edit(row) {
        this.$router.push({
          path: '/teacher/addAssistant',
          query: { teacherId: row.teacherId }
        });
      },
      look(row) {
        this.$router.push({
          path: '/teacher/addAssistant',
          query: { teacherId: row.teacherId, isLook: true }
        });
      },
      changeStatus(id, status) {
        changeAssistantStatus({
          id,
          status
        })
          .then(res => {
            if (res.code == 10000) {
              this.$message.success(status == 1 ? '恢复成功' : '已被禁用');
              this.page = 1;
              this.getList();
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };
</script>