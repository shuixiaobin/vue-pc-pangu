<template>
  <div class="stu">
      <el-table :data="tabelData" border
        style="width: 100%">
        <el-table-column prop="userName"
          label="用户名"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column prop="realName"
          label="真实姓名"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column prop="phoneNum"
          header-align="center"
          align="center"
          label="手机号">
        </el-table-column>
        <el-table-column
          label="购买时间"
          header-align="center"
          align="center">
            <template slot-scope="scope">
              {{formatTime2(new Date(scope.row.buyTime))}}
            </template>
        </el-table-column>
        <el-table-column label="操作"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary"
              @click="editStudent(scope.row)"
              class="serchLeft">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination_box">
        <el-pagination @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="pageData.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageData.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.total">
        </el-pagination>
      </div> 
      <el-dialog
        title="编辑真实姓名"
        :visible.sync="dialogVisible"
        width="30%">
          <p style="margin-bottom:10px;">{{edit.userName}}的真实姓名：</p>
          <el-input v-model="edit.realName" placeholder="请输入内容"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
  import * as omoApi from '@/api/omoApi.js'
  import { getCookie } from '@/config/utils'
  import Util from '@/common/util.js'
  export default {
    data() {
      return {
        tabelData: [],
        dialogVisible:false,
        pageData:{
          page:1,
          pageSize:10,
          total:0
        },
        edit:{
          userName:'',
          realName:'',
          userId:''
        }
      }
    },
    computed: {
    },
    created() {
      this.getList();
    },
    methods: {
      // 改变显示数目
      sizeChange(val) {
        this.pageData.pageSize  = val
        this.pageData.page = 1
        this.getList()
      },
      formatTime2(date) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()

        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()

        return (
          [year, month, day].map(Util.formatNumber).join('-') +
          ' ' +
          [hour, minute, second].map(Util.formatNumber).join(':')
        )
      },
      pageChange(val) {
        this.pageData.page = val
        this.getList()
      },
      getContent(val){
        console.log(val)
      },
      getList() { 
        const params = {
          page: this.pageData.page,
          pageSize: this.pageData.pageSize,
          courseId:this.$route.query.rid
        } 
        omoApi.getStudentInfo(params)
          .then(res => {
            if (res.code == 1000000) {
              this.tabelData = res.data.result
              this.pageData.total = res.data.total
            } else {
              throw new Error(res.msg)
            }
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },
      editStudent(row){
        this.edit.userName=row.userName;
        this.edit.userId=row.userId;  
        this.edit.realName='';
        this.dialogVisible=true;
      },
      confirm(){
        omoApi.saveStudentInfo({
          userId:this.edit.userId,
          realName:this.edit.realName
        }).then(res => {
            if (res.code == 1000000) {
              this.$message.success("修改成功")
              this.dialogVisible=false;
              this.pageData.page = 1
              this.getList()
            } else {
              throw new Error(res.msg)
            }
        }).catch(e => {
            this.$message.error(e.message)
        })
      }

    },
  }
</script>

<style scoped lang='less'>
  .stu{
    .pagination_box {
      padding: 30px 0;
      .el-pagination {
        text-align: center;
      }
    }
  }


</style>
