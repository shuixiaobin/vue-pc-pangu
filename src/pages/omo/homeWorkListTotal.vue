
<template>
  <div>
    <div slot="header"
      class="clearfix" style="padding:10px">
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/OMO' }">列表</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/home/homeWorkListTotal' }">作业批改</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true"  class="demo-form-inline">

          <el-form-item label="课程地区" style="margin-left:200px">
            <el-select v-model="areaVal" style="width: 150px;height:15px">
              <el-option
                v-for="item in areaList"
                :key="item.ProvinceId"
                :label="item.Province"
                :value="item.ProvinceId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="批改状态">
            <el-select v-model="status" style="width: 150px;">
              <el-option
                v-for="item in pigaiStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
          </el-form-item>
        </el-form>
    </div>
    <TaskList :tableData="tableData" @editTask="editTask" @correcting="correcting" />
    <CourseWorkDetail ref="dialog" @submitSuccess="submitSuccess" />
    <div style="text-align: center; margin-top: 30px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import TaskList from './task-components/totalTask'
  import { page } from '@/common/mixins'
  import { totalTaskList ,omoAreaList} from '@/api/omoApi'
  import CourseWorkDetail from './task-components/courseWorkDetail'
  export default {
    mixins: [ page ],
    data () {
      return {
        tableData: [],
        areaList:[],
        pigaiStatus:[{label:'全部',value:0},{label:'未批改',value:1},{label:'已批改',value:2}],
        areaVal:'',
        status:0
      }
    },
    created () {
      this.pageSize = 10
      this.getList();
      this.getArea();
    },
    methods: {
      getArea(){
        omoAreaList().then(re=>{
          this.areaList =re.data;
          this.areaList.unshift({
            ProvinceId:'',
            Province:'全部'
          });
        })
      },
      getList () {
        totalTaskList({
          areaId:this.areaVal,
          answerStatus:this.status,
          page: this.page,
          pageSize: this.pageSize
        }).then(res => {
          this.tableData = res.data.result
          this.total = res.data.total
        }).catch(e => this.$message.error(e.message))
      },
      submitSuccess () {
         this.getList();
      },
      editTask (d) {
        this.$refs.taskDetail.showData(d)
      },
      correcting (d) {
        this.$refs.dialog.showData(d)
      }
    },
    components: {
      TaskList,
      CourseWorkDetail
    }
  }
</script>

<style scoped lang='less'>
</style>
