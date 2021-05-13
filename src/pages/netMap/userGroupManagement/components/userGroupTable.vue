<template>
  <el-table border :data="tableData" style="width: 100%" class="tableFixedBug">
    <el-table-column label="用户分群" width="250">
      <template slot-scope="scope">
        <span class="showFont15">{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column label="描述" width="250">
       <template slot-scope="scope">
        <span class="showFont15">{{scope.row.description}}</span>
      </template>     
    </el-table-column>
    <el-table-column label="分群人数">
      <template slot-scope="scope">
        <span class="showFont15">{{scope.row.status=='3'?scope.row.groupSize+'人':'查询中...'}}</span>
      </template>    
    </el-table-column>
    <el-table-column prop="createAt" label="创建时间" width="180"> </el-table-column>
    <el-table-column prop="createBy" label="创建人"> </el-table-column>
    <el-table-column label="操作" fixed="right" width="140">
      <template slot-scope="scope">
         <el-button type="text" size="small" v-auth="'UFM_DETAIL'" @click="look(scope.row)">查看</el-button>
         <el-button type="text" size="small" @click="download(scope.row)" v-auth="'UFM_DOWN'" v-if="scope.row.downLoadUrl">下载</el-button>
         <el-button type="text" size="small" v-auth="'UFM_DETELE'" @click="del(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { mapState } from 'vuex'
import { delUserGroupList } from '@/api/netMap'
export default {
  props: ['tableData'],
  computed:{
    ...mapState(['username'])
  },
  methods:{
    look(row){
      this.$router.push({path:'userGroupSetting',query:{
        isPending:row.status,
        id:row.id?row.id:''
      }})
    },
    download(row){
      if(row.downLoadUrl){
        window.open(row.downLoadUrl)
      }else{
        this.$message.warning('暂无生成下载地址')
      }
    },
    del(row){
      this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const data = await delUserGroupList({
            id:row.id,
            userName:this.username
          })
          if(data.code==10000){
            this.$message.success('删除成功！')
            this.$emit('refresh')
          }else{
            this.$message.error(data.msg)
          }
        }).catch(() => {
          this.$message.info('已取消删除');          
        });      
    }
  }
}
</script>

<style scoped>
.showFont15{
  display: block;
  width:220px;
  height:30px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style>
.tableFixedBug .el-table__fixed-right{
    height: 100% !important;
}
</style>
