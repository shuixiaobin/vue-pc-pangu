<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
  >
    <el-table-column
      prop="teacherId"
      label="教师ID"
    >
    </el-table-column>
    <el-table-column label="姓名">
      <template slot-scope="scope">
        <el-button
          type="text"
          @click="look(scope.row)"
        >{{scope.row.name}}</el-button>
      </template>
    </el-table-column>
    <el-table-column label="类型">
      <template slot-scope="scope">
        {{scope.row.teacherType&&scope.row.teacherType.text}}
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        {{scope.row.teacherType&&scope.row.status.text}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          type="text"
          @click="edit(scope.row)"
          v-auth="'ZHU_EDIT'"
        >修改</el-button>
        <el-button
          type="text"
          v-if="scope.row.status.value=='ZC'"
          @click="changeStatus(scope.row.teacherId,2)"
          v-auth="'ZHU_BAN'"
        >禁用</el-button>
        <el-button
          type="text"
          v-if="scope.row.status.value=='JY'"
          @click="changeStatus(scope.row.teacherId,1)"
          v-auth="'ZHU_BAN'"
        >恢复</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    data() {
      return {};
    },
    props: ['tableData'],
    methods: {
      edit(row) {
        this.$emit('edit', row);
      },
      look(row) {
        this.$emit('look', row);
      },
      changeStatus(id, status) {
        this.$emit('changeStatus', id, status);
      }
    }
  };
</script>