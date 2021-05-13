<template>
  <div class="user-group">
    <MenuTitle>
      <template v-slot:btn>
        <el-button size="small" v-auth="'UFM_ADD'" @click="navToUserGroupSetting">新建用户分群</el-button>
      </template>
    </MenuTitle>
    <div class="container">
      <UserGroupTable :tableData="tableData" @refresh="refresh"/>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="container-pagination">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import UserGroupTable from './components/userGroupTable'
  import { userGroupList } from '@/api/netMap'
  import { page } from './pageMinxins'
  export default {
    data () {
      return {
        tableData: [{}]
      }
    },
    mixins: [ page ],
    created(){
      //this.getlistData()
    },
    activated(){
      //console.log(7777)
      this.getlistData()
    },
    methods: {
      async getlistData(){
        try{
          const data = await userGroupList({
            page:this.page,
            pageSize:this.pageSize
          })
          if (data.code === 10000) {
            this.tableData = data.data.items
            this.total = data.data.totalNums
          } else {
            this.$message.error(data.msg)
          }
        }catch(err){
          console.log(err)
        }
      },
      refresh(){
        this.page = 1
        this.getlistData()
      },
      navToUserGroupSetting () {
        this.page = 1
        this.$router.push({
          name: 'userGroupSetting'
        })
      }
    },
    components: {
      UserGroupTable,
    },
  }
</script>
<style lang='less' scoped>

</style>
