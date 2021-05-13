<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%;"
    @sort-change="ScoreChange"
  >
    <el-table-column
      prop="courseId"
      label="课程ID"
      width="80"
    >
    </el-table-column>
    <el-table-column
      prop="courseTitle"
      label="课程名称"
    >
    </el-table-column>
    <el-table-column
      prop="lessonId"
      label="课件ID"
      width="80"
    >
    </el-table-column>
    <el-table-column
      prop="lessonTitle"
      label="课件名称"
    >
    </el-table-column>
    <el-table-column
      prop="teacherName"
      label="授课教师"
      width="100"
    >
    </el-table-column>
    <el-table-column
      prop="bjyRoomId"
      label="百家云房间ID"
      width="160"
    >
    </el-table-column>
    <el-table-column
      prop="beginTime"
      label="授课时间"
      width="180"
    >
    </el-table-column>
    <el-table-column
      prop="personCount"
      label="评价数"
      width="70"
    >
    </el-table-column>
    <el-table-column
      prop="avgScore"
      sortable="custom"
      label="平均评分"
      width="120"
    >
      <template slot-scope="scope">
        <el-button
          type="text"
          @click="handleOpenScoreTable(scope.row)"
          style="cursor:pointer;"
        >
          {{scope.row.avgScore}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      tableData: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {};
    },
    methods: {
      handleOpenScoreTable(row) {
        this.$emit('handleOpenScoreTable', row);
      },
      ScoreChange({ column, prop, order }) {
        this.$emit('ScoreChange', order);
      }
    }
  };
</script>
<style lang='less' scoped>
</style>