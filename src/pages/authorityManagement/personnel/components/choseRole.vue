<template>

  <el-dialog title="选择角色"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal='false'
    @close="dialogFormVisible =false"
    width="60%"
    :modal="false"
    append-to-body
    center class="chosseRole">

    <el-form :inline="true"
      :model="formInline"
      ref="formInline"
      class="demo-form-inline">
      <el-form-item label="角色：">
        <el-input v-model.trim="formInline.roleName"
          size="mini"
          placeholder="输入角色名称"
          clearable
          style="width:120px;"></el-input>
      </el-form-item>

      <el-form-item label="所属系统：">
        <el-select v-model="formInline.systemId"
          size="mini"
          placeholder="请选择"
          style="width:100%;">
          <el-option :label="item.name"
            :value="item.id"
            v-for="(item,index) in systemList"
            :key="index"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary"
          size="mini"
          @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData"
      border
      fit
      style="width: 100%">
      <el-table-column prop="systemName"
        label="所属系统">
      </el-table-column>
      <el-table-column prop="roleName"
        label="角色">
      </el-table-column>
      <el-table-column prop="bizStatusName"
        label="状态">
      </el-table-column>
      <el-table-column label="属性">
        <template slot-scope="scope">
          {{scope.row.defaultRole== 0?'系统默认':scope.row.defaultRole}}
        </template>
      </el-table-column>
      <el-table-column label="最近修改"
        prop="gmtModify">
      </el-table-column>
      <el-table-column prop="creatorName"
        label="创建人">
      </el-table-column>
      <el-table-column label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button type="text"
            v-if="!inCludeAry.includes(scope.row.id)"
            size="small"
            @click="joinRow(scope.row.id)"
            v-auth="'RM_EDIT'">加入</el-button>
          <el-button type="text"
            v-else
            size="small"
            @click="cancelRow(scope.row.id)"
            v-auth="'RM_EDIT'">取消加入</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @current-change="getList"
        :current-page="page"
        :page-size="10"
        :total="total"
        class="container-pagination"
     >
      </el-pagination>

    <div slot="footer"
      class="dialog-footer">
      <el-button @click="dialogFormVisible = false">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { getRoleList } from '@/api/authority'
  import { addNewRole, editNewRole } from '@/api/authority'
  export default {
    props: ['includeItems'],
    data() {
      return {
        page:1,
        pageSize:10,
        total:'',
        formInline: {
          roleName: '',
          bizStatus: '1',
          systemId:3,
        },
        systemList: [{name:"潘多拉",id:1},{name:"申论 ",id:2},{name:"盘古",id:3}],
        dialogFormVisible:false,
        tableData:[],
        total:'',
        inCludeAry:[]
      }
    },
    created(){
      this.onSubmit()
    },
    methods: {
        joinRow(id){
          this.inCludeAry.push(id);
          this.$emit("setJoin",id)
        },
        cancelRow(id){
          this.inCludeAry=  this.inCludeAry.filter(function(item) {
                return item != id
          });
          this.$emit("cancelJoin",id)
        },
        setShow(a) {
          this.dialogFormVisible = a;
          if(a)
          this.inCludeAry =this.includeItems;
        },
/*         setData(b) {
          this.inCludeAry = b;
        }, */
        onSubmit() {
          this.page = 1;
          this.getList();
        },
        getList(a) {
          a > 0 ?this.page =a:'';
          getRoleList({
            ...this.formInline,
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
        }
  
    }
  }
</script>

<style lang="less" scoped>
  .chosseRole{
    z-index: 2010;
  } 
</style>