<template>
  <el-table
    :data="tableData"
    border
    fit
    style="width: 100%"
    class="personnerTable"
  >
    <el-table-column
      prop="id"
      label="用户ID"
      width="120"
      fixed="left"
    >
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名"
      width="250"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="150"
    >
    </el-table-column>
    <el-table-column
      label="角色"
      width="200"
    >
      <template slot-scope="scope">
        <el-tag
          v-for="(item,index) in newRoleNames(scope.row.roleNames)"
          :key="index"
          size="small"
          class="mt5"
        >{{item}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="departmentName"
      label="所属部门"
      width="200"
    >
    </el-table-column>
    <el-table-column
      prop="bizStatusName"
      label="状态"
      width="150"
    >
    </el-table-column>
    <el-table-column
      prop="userTypeName"
      label="账号类型"
      width="150"
    >
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="150"
    >
    </el-table-column>
    <el-table-column
      label="最近登录"
      width="200"
    >
      <template slot-scope="scope">
        {{Util.timeStampDate(scope.row.loginTime)}}
      </template>
    </el-table-column>
    <el-table-column
      label="创建日期"
      width="200"
    >
      <template slot-scope="scope">
        {{Util.timeStampDate(scope.row.gmtCreate)}}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      fixed="right"
      width="350"
    >
      <template slot-scope="scope">
        <el-button
          type="primary"
          size="mini"
          plain
          @click="edit(scope.row)"
          v-auth="'PM_EDIT'"
        >编辑</el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          @click="editPhone(scope.row)"
          v-auth="'PM_UPDATE_PHONE'"
        >修改手机</el-button>
        <el-button
          type="success"
          size="mini"
          plain
          @click="blocked(scope.row)"
          v-auth="'PM_UNBAN'"
        >{{scope.row.bizStatus===2?'解禁用户':'封禁用户'}}</el-button>
        <el-button
          type="danger"
          size="mini"
          plain
          @click="lock(scope.row)"
          v-auth="'PM_BAN'"
        >{{scope.row.lockStatus == 0?'锁定':'解锁'}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import Util from '@/common/util';
  export default {
    data() {
      return {
        Util
      };
    },
    props: ['tableData'],
    computed: {
      newRoleNames() {
        return function(name) {
          return name ? name.split(',') : [];
        };
      }
    },
    methods: {
      edit(row) {
        this.$emit('edit', row);
      },
      editPhone(row) {
        this.$emit('editPhone', row);
      },
      blocked(row) {
        this.$emit('blocked', row);
      },
      lock(row) {
        this.$emit('lock', row);
      }
    }
  };
</script>
<style lang="less">
  .personnerTable {
    .mt5 {
      margin: 5px;
    }
  }
</style>