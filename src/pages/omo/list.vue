<template>
  <div>
    <div>
      <!-- <P class="title">OMO面试班管理</P> -->
      <search-com 
        class="searchHeader"
				@putSearch="putSearch"
        @batchAddHomework="batchAddHomework" 
			/>
      <el-table :data="tableData" border
        style="width: 100%">
        <el-table-column prop="rid"
          label="课程ID"
          header-align="center"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column prop="title"
          label="课程标题"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="startDate"
          header-align="center"
          align="center"
          label="创建/上线日期"
          width="180">
        </el-table-column>
        <el-table-column prop="actualPrice"
          label="价格"
          header-align="center"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column prop="status"
          header-align="center"
          align="center"
          label="状态"
          width="100">
          <template slot-scope="scope">
            {{scope.row.status |statusFilters}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 1 ||scope.row.status == 2"
              size="small" type="primary"
              @click="downLine(scope.row)"
              class="serchLeft">管理</el-button>
            <el-button  size="small" v-if="scope.row.status == 1 ||scope.row.status == 2"
              @click="pushMsg(scope.row)" type="primary"
              class="serchLeft">推送消息</el-button>
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
    </div>
    <BatchAddTaskDialog ref="batchAdd" />
  </div>
</template>
<script>
  import searchCom from './components/serch.vue'
  import BatchAddTaskDialog from './components/batchAddTaskDialog'
  import * as omoApi from '@/api/omoApi.js'
  import { getCookie } from '@/config/utils'

  export default {
    data() {
      var checkNumer = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'));
        }
        setTimeout(() => {
            const reg=/^([1-9]\d|\d)$/;
            if ( reg.test(value) ) {
              callback();
            } else {
              callback(new Error('请输入0到99之间的整数'));
            }
        }, 200);
      };
      return {
        centerDialogVisible:false,
        formData: {
          size: 10,
          type: '',
          status: '',
          keyword: ''
        },
        tableData: [],
        pageData: {
          page: 1,
          size: 10,
          total: 0
        }
      }
    },
    components: {
      searchCom,
      BatchAddTaskDialog
    },
    computed: {
    },
    created() {
      this.getList();
    },
    methods: {
      batchAddHomework () {
        this.$refs.batchAdd.show()
      },
      putSearch(data) {
        Object.assign(this.formData,data)
        this.formData.page = 1
        this.getList()
      },
      // 改变显示数目
      sizeChange(val) {
        this.formData.size = this.pageData.size = val
        this.formData.page = this.pageData.page = 1
        this.getList()
      },
      pageChange(val) {
        this.formData.page = val
        this.getList()
      },
   
      getList() {
          omoApi.get_course_list(this.formData).then(json => {
             this.tableData = json.data.data;
             this.pageData.total = json.data.totleCount;
          }).catch(err => {

          })
      },
      downLine(row) {
          this.$router.push({
              path: "/home/OMODetail",
              query:row
          });
      },
      pushMsg(row){
        this.$confirm('是否向学员推送:"新的学习资料已更新，请进入课程并查看讲义?"', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return  omoApi.pushMsg({courseId:row.rid})
        }).then(res => {
            if (res.code === 1000000) {
              this.$message({
                message: '推送成功!',
                type: 'success'
              })
              this.$router.push({
                path: "/home/OMODetail/task",
                query:row
              });
            }
        }).catch(err => {
            this.$message.error(err.message)
        })
      }
    },
    filters: {
      statusFilters(val) {
        let item
        switch (Number(val)) {
          case 0:
            item = '未上线'
            break
          case 1:
            item = '已上线'
            break
          case 2:
            item = '已下线'
            break
        }
        return item
      }
    }
  }
</script>

<style scoped lang='less'>
  .searchHeader {
    margin-bottom: 50px;
  }
  .pagination_box {
    padding: 20px 0;

    .el-pagination {
      text-align: center;
    }
  }
  .title{
    font-size: 22px;
    margin-left: 15px;
  }
</style>
