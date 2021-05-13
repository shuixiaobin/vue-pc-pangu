<template>
  <el-card>
    <div slot="header"
      class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/OMO' }">列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/home/tempalteList' }">模板列表</el-breadcrumb-item>
          <el-breadcrumb-item>模板详情</el-breadcrumb-item>
        </el-breadcrumb>
      <span style="line-height:40px;font-size:22px">{{$route.query.name}}</span>
      <el-button style="float: right;"
        @click="newTask"
        type="primary">添加作业</el-button>
    </div>

    <el-table :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="workDate"
        label="作业日期"
        align="center">
      </el-table-column>
      <el-table-column prop="title"
        label="作业标题"
        align="center">
      </el-table-column>
      <el-table-column prop="creatTime"
        align="center"
        label="创建时间">
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
            @click="deleteRow(scope.row)"
            class="serchLeft">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddTask ref="taskDetail"
      :tempId="tempId"
      :typeId="typeId"
      @refresh="getList" />
  </el-card>
</template>
<script>
  import AddTask from './addZy'
  import { page } from '@/common/mixins'
  import { courseWorkList, delWorkTask} from '@/api/omoApi'
  export default {
    mixins: [page],
    data() {
      return {
        tempId: this.$route.query.id,
        typeId:this.$route.query.type,
        tableData: [],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        courseWorkList(this.$route.query.id)
          .then((res) => {
            this.tableData = res.data
          })
          .catch((e) => this.$message.error(e.message))
      },
      newTask() {
        this.$refs.taskDetail.show()
      },
      editTask(d) {
        this.$refs.taskDetail.showData(d)
      },
      deleteRow(row) {
        this.$confirm('删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            delWorkTask(row.id).then((res) => {
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
    },
    components: {
      AddTask,
    },
  }
</script>

<style scoped lang='less'>
</style>
