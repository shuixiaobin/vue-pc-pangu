<template>
  <div class="teacher-evaluation">
    <TeacherEvaluationForm
      @search="search"
      @resetSubject="resetSubject"
      :form="searchData"
    />
    <div class="table-wrapper">
      <div class="button-wrapper clearfix">
        <el-button
          class="handleExport"
          size="small"
          @click="handleExport"
          v-auth="'TEACHER_EXPORT'"
        >导出</el-button>
      </div>
      <el-table
        border
        :data="tableData"
        style="width: 100%;margin-top:8px;"
        @sort-change="ScoreChange"
      >
        <el-table-column
          prop="teacherId"
          label="教师ID"
        >
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="教师姓名"
        >
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="专长考试"
        >
        </el-table-column>
        <el-table-column
          prop="subjectType"
          label="专长科目"
        >
        </el-table-column>
        <el-table-column
          prop="liveCount"
          label="直播评价数"
        >
        </el-table-column>
        <el-table-column
          prop="liveAvgScore"
          sortable="custom"
          label="直播评分"
        >
        </el-table-column>
        <el-table-column
          prop="videoCount"
          label="录播评价数"
        >
        </el-table-column>
        <el-table-column
          prop="videoAvgScore"
          sortable="custom"
          label="录播评分"
        >
        </el-table-column>
        <el-table-column
          prop="avgScore"
          sortable="custom"
          label="平均分"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleOpenScoreTable(scope.row)" style="cursor:pointer">
              {{scope.row.avgScore}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        class="container-pagination"
      >
      </el-pagination>
      <TeacherCourseEvaluationTable
        :score-drawer-flag.sync="scoreDrawerFlag"
        :teacherId="teacherId"
        :date="searchData.date"
      />
    </div>
  </div>
</template>

<script>
import TeacherEvaluationForm from "./TeacherEvaluationForm";
import TeacherCourseEvaluationTable from "./teacherCourseEvaluationTable.vue";
import { page } from "@/common/mixins";
import { getTeacherEvalList } from "@/api/teacher";
import Util from "@/common/util";
const endTime = new Date();
const startTime = new Date();
startTime.setMonth(startTime.getMonth() - 1);
export default {
  mixins: [page],
  components: {
    TeacherEvaluationForm,
    TeacherCourseEvaluationTable
  },
  data() {
    return {
      scoreDrawerFlag: false,
      searchData: {
        date: [Util.formatDate(startTime), Util.formatDate(endTime)],
        teacherName: "",
        minScore: "",
        maxScore: "",
        status: "",
        netClassCategoryId: "",
        subjectType: "",
        jobType: "",
        fenxiao: ""
      },
      tableSortData: {
        orderSort: "",
        orderBy: ""
      },
      tableData: [],
      teacherId: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetSubject() {
      this.searchData.subjectType = "";
    },
    getList() {
      let { date, ...newSearchData } = this.searchData;
      getTeacherEvalList({
        startTime: this.searchData.date && this.searchData.date[0],
        endTime: this.searchData.date && this.searchData.date[1],
        ...newSearchData,
        ...this.tableSortData,
        page: this.page,
        pageSize: this.pageSize
      })
        .then(res => {
          if (res.code == 10000) {
            this.tableData = res.data.lists;
            this.total = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    search() {
      this.page = 1;
      this.getList();
    },
    ScoreChange({ column, prop, order }) {
      this.page = 1;
      this.tableSortData.orderBy = prop ? prop : "";
      this.tableSortData.orderSort = order
        ? order == "ascending"
          ? "asc"
          : "desc"
        : "";
      this.getList();
    },
    handleExport() {
      if (this.searchData.teacherName) {
        let { date, ...newSearchData } = this.searchData;
        let filterData = {
          startTime:
            this.searchData.date && this.searchData.date[0]
              ? this.searchData.date[0]
              : "",
          endTime:
            this.searchData.date && this.searchData.date[1]
              ? this.searchData.date[1]
              : "",
          ...newSearchData
        };
        let url = `${PANGU_URL}/v1/c/evaluate/teacher_list?&export=1&page=${
          this.page
        }&pageSize=${this.pageSize}&${this.$qs.stringify(
          filterData
        )}&${this.$qs.stringify(this.tableSortData)}`;
        window.open(url);
      } else {
        this.$message.warning("请填写要导出的授课教师");
      }
    },
    handleClose() {
      this.$emit("update:drawerFlag", false);
    },
    handleOpenScoreTable(row) {
      this.scoreDrawerFlag = true;
      this.teacherId = row.teacherId;
    }
  }
};
</script>
<style lang='less' scoped>
.teacher-evaluation {
  .table-wrapper {
    padding: 16px;
    border-top: 28px solid #f4f5fb;
  }
  .button-wrapper {
    .handleExport {
      float: right;
    }
  }
}
</style>
