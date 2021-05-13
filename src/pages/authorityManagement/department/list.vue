<template>
  <div>
    <div class="container-title">
      <h2>部门管理</h2>
    </div>
    <div class="container-Box minHeight">
      <div class="clearfix">
      <el-button
        size="small"
        icon="el-icon-plus"
        @click="add"
        class="fr"
        v-auth="'DM_ADD'"
      >添加</el-button>
      </div>
      <tableData
        class="mt20"
        :tableData="tableData"
        :departOptions='departOptions'
        @edit="editTable"
        @del="delTable"
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
      <dialogBox
        ref="dialog"
        :departOptions='departOptions'
        @refresh='getList'
      />
    </div>
  </div>
</template>
<script>
import tableData from "./components/table";
import dialogBox from "./components/dialog";
import { page } from "@/common/mixins";
import {
  getDepartList,
  getProperAuthList,
  delDepartMent
} from "@/api/authority";
export default {
  mixins: [page],
  data() {
    return {
      tableData: [],
      departOptions: []
    };
  },
  components: { tableData, dialogBox },
  created() {
    this.getList();
    this.getProperAuthList();
  },
  methods: {
    getList() {
      getDepartList({
        page: this.page,
        pageSize: this.pageSize
      })
        .then(res => {
          if (res.code == 1000000) {
            this.tableData = res.data.result;
            this.total = res.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getProperAuthList() {
      getProperAuthList()
        .then(res => {
          if (res.code == 1000000) {
            this.departOptions = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    add() {
      this.$refs.dialog.openDialog(1);
    },
    editTable(row) {
      this.$refs.dialog.openDialog(2, row);
    },
    delTable(row) {
      this.$confirm("确定要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(() => {
          delDepartMent(row.id)
            .then(res => {
              if (res.code == 1000000) {
                this.$message.success("删除成功!");
                this.getList();
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    }
  }
};
</script>
