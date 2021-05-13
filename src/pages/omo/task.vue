<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>作业列表</span>
      <el-button style="float: right;" @click="addTask" type="primary">添加作业</el-button>
    </div>
    <TaskList :tableData="tableData" @editTask="editTask" @correcting="correcting" />
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
    <AddTask ref="taskDetail" :courseId="courseId" @refresh="getList" />
  </el-card>
</template>
<script>
  import TaskList from './task-components/taskList'
  import AddTask from './task-components/addTask'
  import { page } from '@/common/mixins'
  import { getTaskList } from '@/api/omoApi'
  export default {
    mixins: [ page ],
    data () {
      return {
        courseId: this.$route.query.rid,
        tableData: []
      }
    },
    created () {
      this.pageSize = 20
      this.getList()
    },
    methods: {
      getList () {
        getTaskList({
          page: this.page,
          pageSize: this.pageSize,
          courseId: this.courseId
        }).then(res => {
          this.tableData = res.data.result
          this.total = res.data.total
        }).catch(e => this.$message.error(e.message))
      },
      addTask () {
        this.$refs.taskDetail.show()
      },
      editTask (d) {
        this.$refs.taskDetail.showData(d)
      },
      correcting (d) {
        this.$router.push({
          name: 'OMOapproval',
          query: {
            id: d.id,
            courseId: this.courseId,
            title: d.title,
            workDate: d.workDate,
						query: this.$route.query
          }
        })
      }
    },
    components: {
      TaskList,
      AddTask,
    }
  }
</script>

<style scoped lang='less'>
</style>
