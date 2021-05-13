<template>
  <el-dialog
    title="阶段测评"
    width="60%"
    :before-close="handleClose"
    :visible="evaluationVisible"
    :close-on-click-modal="false"
  >
    <el-form inline size="mini">
      <el-form-item label="阶段测试名称">
        <el-input
          v-model="name"
          placeholder="请输入阶段测试名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchEvaluation">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="listData" style="width: 100%">
      <el-table-column width="220" show-overflow-tooltip fixed prop="name" label="阶段测评名称">
      </el-table-column>
      <el-table-column prop="statusStr" label="提交状态"> </el-table-column>
      <el-table-column prop="submitTimeStr" width="150" label="交卷/生成答题卡时间">
      </el-table-column>
      <el-table-column prop="scoreStr" label="得分/满分"> </el-table-column>
      <el-table-column prop="rnum" label="答对题数"> </el-table-column>
      <el-table-column prop="qcount" label="总题数"> </el-table-column>
      <el-table-column prop="expendTime" label="总计用时"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="viewReport(scope.row)"
            >查看报告</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { getPeriodTestList } from "@/api/netMap";
const prefix = WEBPACK_BUILD_TARGET === 'production' ? 'v.huatu.com' : 'test.htexam.com'
export default {
  props: {
    evaluationVisible: {
      type: Boolean,
      default: false,
    },
    stageExamIds: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      name: "",
      listData: []
    };
  },
  created(){
    this.getListData()
  },
  methods: {
    async getListData() {
      const data = await getPeriodTestList({
        name: this.name,
        paperActivityId: this.stageExamIds.join(),
        userName: this.$route.query.userName
      });
      this.listData = data.data
    },
    searchEvaluation() {
      this.getListData();
    },
    handleClose() {
      this.$emit("update:evaluationVisible", false);
    },
    viewReport({practiceId,syllabusId}) {
      window.open(`https://${prefix}/htzx/user/index.shtml#/testStage/testReport?practiceId=${practiceId}&syllabusId=${syllabusId}&userName=${this.$route.query.userName}`)
    }
  },
};
</script>
<style lang='less' scoped>
</style>