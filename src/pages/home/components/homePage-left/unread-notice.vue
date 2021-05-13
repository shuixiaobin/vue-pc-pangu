<template>
  <div class="notice-content-wrap">
    <div class="tableList">
      <el-table :data="tableData" style="width: 100%" :show-header="false">
        <el-table-column prop="contentDesc" style="min-width: 80%">
          <template slot-scope="scope" @click="handleDialog(scope.row._id)">
            <span @click="handleDialog(scope.row._id)">{{scope.row.contentDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" style="min-width: 20%"> </el-table-column>
      </el-table>
    </div>
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
    <left-home-dialog ref="openDialog" @getList="getList"></left-home-dialog>
  </div>
</template>

<script>
import leftHomeDialog from "./left-home-dialog.vue";
import { page } from "@/common/mixins";
import {getNoticeList} from '@/api/auth'
export default {
  mixins: [page],
  components: { leftHomeDialog },
  data() {
    return {
      params: {
        userName: '',
        isRead: 3,
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0
    };
  },
  created() {
    this.getNoticeList()
  },
  methods: {
    getNoticeList() {
      let userName = localStorage.getItem('userName')
      this.params.userName = userName
      getNoticeList(this.params).then(res => {
        if(res.code === 10000) {
          this.tableData = res.data.data
          this.total = res.data.total
          this.$emit('sendTable', this.tableData)
        }
      })
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getNoticeList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getNoticeList()
    },
    handleDialog(id) {
      this.$refs.openDialog.openDetail({
        userName: this.params.userName,
        id,
        sel: '2',
        isRead: 3
      })
    },
    getList() {
      this.getNoticeList()
    }
  },
};
</script>

<style lang='less' scoped>
.notice-content-wrap {
  width: 100%;
  height: 100%;
  min-height: 600px;

   /deep/ .el-table_1_column_1 {
    cursor: pointer;
  }
}
</style>