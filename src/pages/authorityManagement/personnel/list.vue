<template>
  <div>
    <div class="container-title">
      <h2>人员管理</h2>
    </div>
    <searchBox
      @search="search"
      :roleList="roleList"
    />
    <div class="container-Box mt20 minHeight">
      <div class="clearfix">
        <el-button
          size="small"
          icon="el-icon-plus"
          @click="add"
          v-auth="'PM_ADD'"
          class="fr"
        >添加</el-button>
      </div>
      <tableBox
        :tableData='tableData'
        class="mt20"
        @edit="edit"
        @editPhone="editPhone"
        @blocked="blocked"
        @lock="lock"
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
      :departOptions="departOptions"
      :roleList="roleList"
      @refresh="getList"
    />
    <EditPhone ref="editPhoneDialog" @updated="getList"/>
  </div>
</template>
<script>
import searchBox from "./components/search";
import tableBox from "./components/table";
import dialogBox from "./components/add";
import EditPhone from "./components/editPhone"
import { page } from "@/common/mixins";
import {
  getUserList,
  getProperAuthList,
  getSelectRoleList,
  roleBlocked,
  roleLock
} from "@/api/authority";
export default {
  mixins: [page],
  data() {
    return {
      formLine: {},
      departOptions: [], //部门列表
      roleList: [], //角色列表
      tableData: [],
    };
  },
  components: {
    tableBox,
    searchBox,
    dialogBox,
    EditPhone
  },
  created() {
    this.getList();
    this.getProperAuthList();
    this.getSelectRoleList();
  },
  methods: {
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
    getSelectRoleList() {
      getSelectRoleList()
        .then(res => {
          if (res.code == 1000000) {
            this.roleList = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getList(data) {
      this.formLine = data ? data : this.formLine;
      getUserList({
        ...this.formLine,
        page: this.page - 1,
        pageSize: this.pageSize
      })
        .then(res => {
          this.tableData = res.data.result;
          this.total = res.data.total;
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
    edit(row) {
      this.$refs.dialog.openDialog(2, row);
    },
    editPhone(row) {
      this.$refs.editPhoneDialog.openDialog(row);
    },
    blocked(row) {
      let confirmName = row.bizStatus == 2 ? "用户解禁" : "用户封禁";
      let confirmTips =
        row.bizStatus == 2 ? "是否确定解禁该用户？" : "是否确定封禁该用户？";
      //console.log(row.id, row.bizStatus);
      this.$confirm(confirmTips, confirmName, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          roleBlocked(row.id, row.bizStatus === 2 ? "0" : "2")
            .then(res => {
              if (res.code == 1000000) {
                this.$message.success(confirmName + "成功!");
                this.getList(); //刷选列表
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    lock(row) {
      console.log(row.id, row.lockStatus);
      roleLock(row.id, row.lockStatus == 0 ? "1" : "0")
        .then(res => {
          if (res.code == 1000000) {
            this.$message.success(
              row.lockStatus == 0 ? "解锁成功!" : "锁定成功!"
            );
            this.getList(); //刷选列表
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
