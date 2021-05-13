<template>
  <div class="sutdent-other_table">
    <el-table :data="listData" style="width: 100%">
      <el-table-column fixed prop="title" show-overflow-tooltip width="220" label="课程名称">
      </el-table-column>
      <el-table-column prop="classId" label="课程id"> </el-table-column>
      <el-table-column prop="status" label="课程进度"> </el-table-column>
      <el-table-column prop="status" label="听课占比"> </el-table-column>
      <el-table-column prop="progress" label="阶段测评进度"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" :disabled="scope.row.stageExamIds.length==0" @click="stageEvaluation(scope.row)"
            >阶段测评</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="page"
        @current-change="currentChange"
        :total="total"
      >
      </el-pagination>
    </div>
    <StageEvaluationDialog
      v-if="evaluationVisible"
      :evaluationVisible.sync="evaluationVisible"
      :stageExamIds="stageExamIds"
    />
  </div>
</template>

<script>
import { getsuperintendentList } from "@/api/netMap";
import StageEvaluationDialog from "./StageEvaluationDialog";
import { pageMixin } from "../pageMixins";
export default {
  mixins:[pageMixin],
  components: { StageEvaluationDialog },
  data() {
    return {
      evaluationVisible: false,
      stageExamIds: []
    };
  },
  methods: {
    async getListData() {
      const data = await getsuperintendentList({
        page: this.page,
        pageSize: this.pageSize,
        userName: this.$route.query.userName
      });
      if (data.code == 10000) {
        this.listData = data.data.data;
        this.total = data.data.total;
      } else {
        this.$message.error(data.msg);
      }
    },
    stageEvaluation(row) {
      this.evaluationVisible = true;
      this.stageExamIds = row.stageExamIds
    },
  },
};
</script>
<style lang="less" scoped>
.sutdent-other_table {
  .pagination {
    display: flex;
    justify-content: center;
    .el-button {
      border: none;
    }
    .el-icon-arrow-left {
      margin-right: 10px;
    }
    .el-icon-arrow-right {
      margin-left: 10px;
    }
  }
}
</style>