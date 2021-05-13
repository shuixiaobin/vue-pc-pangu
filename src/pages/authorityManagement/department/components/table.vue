<template>
  <el-table
    :data="tableData"
    border
    row-key="id"
    default-expand-all
    :tree-props="{children: 'children'}"
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      label="部门名称"
    >
    </el-table-column>
    <el-table-column
      prop="leaderName"
      label="主管"
      width="180"
    >
    </el-table-column>
    <el-table-column
      prop="memberCount"
      label="成员数"
      width="200"
    >
    </el-table-column>
    <el-table-column
      label="操作"
      width="200"
    >
      <template slot-scope="scope">
        <el-button
          type="primary"
          size="mini"
          plain
          v-if="scope.row.parentId!=-1"
          @click="edit(scope.row)"
          v-auth="'DM_EDIT'"
        >编辑</el-button>
        <el-button
          type="danger"
          size="mini"
          plain
          v-if="scope.row.parentId!=-1 && scope.row.memberCount==0"
          @click="del(scope.row)"
          v-auth="'DM_EDIT'"
        >删除</el-button>
        <!-- v-if="scope.row.parentId!=-1 && scope.row.memberCount==0" -->
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    data() {
      return {
        formData: {}
      };
    },
    props: ['tableData', 'departOptions'],
    methods: {
      edit(row) {
        this.$emit('edit', row);
      },
      del(row){
        this.$emit('del', row);
      }
    }
  };
</script>