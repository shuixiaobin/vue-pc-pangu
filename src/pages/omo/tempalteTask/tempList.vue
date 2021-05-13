<template>
  <div class='serch-total'>
    <el-card>
      <div slot="header"
        class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/OMO' }">列表</el-breadcrumb-item>
          <el-breadcrumb-item>模板列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
          <span style="line-height:40px;font-size:22px">作业模板管理</span>
          <el-button style="float: right;"
            @click="newTask"
            type="primary">添加模板</el-button>
        </div>
      </div>

      <el-table :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="title"
          label="模板标题"
          align="center">
        </el-table-column>
        <el-table-column label="适用地区"
          align="center">
          <template slot-scope="scope">
            <span v-for="item in scope.row.areas"
              :key="item.areId">{{item.name}} </span>
          </template>
        </el-table-column>
        <el-table-column label="考试类型"
          align="center">
          <template slot-scope="scope">
            <span v-for="it in scope.row.categories"
              :key="it.categoryId">{{it.name}} </span>
          </template>
        </el-table-column>
        <el-table-column align="center"
          label="模板类型">
          <template slot-scope="scope">
            <span>{{scope.row.templateType == 1?"开课后":"开课前"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
          label="创建时间"
          align="center">
        </el-table-column>
        <el-table-column label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button size="small"
              type="text"
              @click="editTask(scope.row)"
              class="serchLeft">编辑</el-button>
            <el-button size="small"
              type="text"
              @click="goTask(scope.row)"
              class="serchLeft">设置作业</el-button>
            <el-button size="small"
              type="text"
              @click="deleteRow(scope.row)"
              class="serchLeft">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <AddTask ref="taskDetail"
        :courseId="courseId"
        :areaList="areaList"
        :categoryList="categoryList"
        @refresh="getList" />
    </el-card>
  </div>
</template>
<script>
  import AddTask from './addTemp'
  import { getTemplateList, delTemplate,omoAreaList,categoryList } from '@/api/omoApi'
  export default {
    data() {
      return {
        courseId: this.$route.query.rid,
        tableData: [],
        areaList:[],
        categoryList:[]
      }
    },
    created() {
      this.getList();
      this.getArea();
      this.getCategry();
    },
    methods: {
      getList() {
        getTemplateList()
          .then((res) => {
            this.tableData = res.data
          })
          .catch((e) => this.$message.error(e.message))
      },
      editTask(d) {
        this.$refs.taskDetail.showData(d)
      },
      newTask() {
        this.$refs.taskDetail.show()
      },
      goTask(row) {
        this.$router.push({ path: '/home/tempalteTaskList', query: {id:row.id,name:row.title,type:row.templateType} })
      },
      correcting(d) {
        this.$router.push({
          name: 'OMOapproval',
          query: {
            id: d.id,
            courseId: this.courseId,
            title: d.title,
            workDate: d.workDate,
          },
        })
      },
      deleteRow(row) {
        this.$confirm('确定要删除该模板及模板内所有作业吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            delTemplate(row.id).then((res) => {
              if (res.code == 1000000) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                })
                this.getList()
              }
            })
          })
          .catch(() => {})
      },
      getArea(){
        omoAreaList().then(re=>{
          this.areaList =re.data
        })
      },
      getCategry(){
        categoryList().then(rel=>{
          this.categoryList=rel.data;
        })
      }
    },
    components: {
      AddTask,
    },
  }
</script>

<style scoped lang='less'>
</style>
