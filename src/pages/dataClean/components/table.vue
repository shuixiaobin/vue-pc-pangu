<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="taskName"
        label="任务名称"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="上传时间"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        label="时间范围"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          {{scope.row.start}}-{{scope.row.end}}
        </template>
      </el-table-column>
      <el-table-column
        label="任务状态"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          {{scope.row.taskStatus|taskStatusFilter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="创建者"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row&&scope.row.taskStatus===2&&scope.row.downloadFilePath"
            @click="download(scope.row.downloadFilePath)"
          >下载</el-button>
          <span v-if="scope.row&&scope.row.taskStatus===4&&scope.row.errorCause">原因：{{scope.row.errorCause}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    props: {
      tableData: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    filters: {
      taskStatusFilter(status) {
        switch (status) {
          case 1:
            return '处理中'
            break
          case 2:
            return '已完成'
            break
          case 3:
            return '已取消'
            break
          case 4:
            return '处理失败'
            break
          default:
            return '处理中'
        }
      }
    },
    methods: {
      download(url) {
        window.open(url)
      }
    }
  }
</script>