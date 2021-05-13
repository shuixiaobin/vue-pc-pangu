<template>
  <div>
    <el-table :data="tableData">
      <el-table-column
        align="center"
        prop="subjectName"
        label="科目"
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="模考名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="areaNames"
        align="center"
        width="200"
        label="地区">
      </el-table-column>
      <el-table-column
        prop="activityTime"
        align="center"
        label="活动时间">
      </el-table-column>
      <el-table-column
        prop="examTime"
        align="center"
        label="考试时间">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        align="center"
        width="120"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        align="center"
        width="120"
        label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="removeExam(row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getExamDetail } from '@/api/addExam.js'
export default {
  props: ['selected'],
  data () {
    return {
      tableData: [],
    }
  },
  created () {
    this.getExamData()
  },
  methods: {
    removeExam (row) {
      this.$emit('removeExam', row)
    },
    getExamData () {
      const pms = this.selected.map(item => {
        return getExamDetail(item.subject, {paperId: item.paperId, areaId: item.areaId})
      })

      Promise.all(pms).then(res => {
        this.tableData = res
      }).catch(e => {
        this.$message.error(e.message)
      })
    }
  },
  watch: {
    selected () {
      this.getExamData()
    }
  },
}
</script>

<style scoped>

</style>
