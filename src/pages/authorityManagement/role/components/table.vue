<template>
  <el-table
    :data="tableData"
    border
    fit
    style="width: 100%"
  >
    <el-table-column
      prop="systemName"
      label="所属系统"
    >
    </el-table-column>
    <el-table-column
      prop="roleName"
      label="角色"
    >
    </el-table-column>
    <el-table-column
      
      prop="bizStatusName"
      label="状态"
    >
    </el-table-column>
<!--     <el-table-column label="属性">
      <template slot-scope="scope">
        {{scope.row.defaultRole== 0?'系统默认':"--"}}
      </template>
    </el-table-column> -->
    <el-table-column
      label="最近修改"
      prop="gmtModify"
    >
    </el-table-column>
    <el-table-column
      prop="creatorName"
      label="创建人"
    >
    </el-table-column>
    <el-table-column label="操作" width="250">
      <template slot-scope="scope">
        <el-button type="text" size="small"
          @click="edit(scope.row)" v-auth="'RM_EDIT'">编辑</el-button>
        <el-button type="text" size="small"
          @click="power(scope.row)" v-auth="'RM_EDIT_POWER'">编辑权限</el-button>
        <el-dropdown>
          <el-button type="text" size="small">
            更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
                <el-button type="text" size="small" @click="preview(scope.row)" v-auth="'RM_DETAIL'">预览</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <el-button type="text" size="small" @click="deleteItem(scope.row)" v-auth="'RM_DETELE'">删除</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import {deleteRole} from '@/api/authority';
  export default {
    data() {
      return {};
    },
    props: ['tableData'],
    methods: {
      edit(row) {
        this.$emit('editData', row);
      },
      power(row) {
        this.$router.push({
              path: "/authorityManagement/editPower",
              query: { id: row.id ,name:row.roleName}
        });
      },
      preview(row){
        this.$router.push({
              path: "/authorityManagement/preview",
              query: { id: row.id }
        });
      },
      deleteItem(row){
        this.$confirm('你确定要删除角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(row.id).then(res=>{
            if(res.code == 1000000){
              this.$message.success('删除成功!');
              this.$emit('updateList');
            }else{
              this.$message.warning(res.message);
            }
          })
        }).catch(() => { 

        });
      }
    }
  };
</script>