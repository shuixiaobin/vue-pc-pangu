<template>
  <div class="course-evaluation">
    <CourseEvaluationForm
      @search="search"
      :form="searchData"
    />
    <div class="table-wrapper">
      <div class="button-wrapper clearfix">
        <el-button
          class="handleExport"
          size="small"
          @click="handleExport"
          v-auth="'CLASS_EXPORT'"
        >导出</el-button>
      </div>
      <el-table
        border
        :data="tableData"
        style="width: 100%;margin-top:8px;"
        @sort-change="ScoreChange"
      >
        <el-table-column
          prop="courseId"
          label="课程ID"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="courseTitle"
          label="课程名称"
          width="350"
        >
        </el-table-column>
        <el-table-column
          prop="lessonCount"
          label="课件数"
        >
        </el-table-column>
        <el-table-column
          prop="personCount"
          label="评分人数"
        >
        </el-table-column>
        <el-table-column
          prop="zbAvgScore"
          label="直播评均分"
        >
        </el-table-column>
        <el-table-column
          prop="lbAvgScore"
          label="录播评均分"
        >
        </el-table-column>
        <el-table-column
          prop="avgScore"
          label="平均分"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleOpenDrawer(scope.row)" style="cursor:pointer">
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
    </div>
    <CoursewareEvaluationTable
      :drawerFlag.sync="drawerFlag"
      :drawCourseId="drawCourseId"
      :date="searchData.date"
    />
  </div>
</template>

<script>
  import CourseEvaluationForm from './CourseEvaluationForm';
  import CoursewareEvaluationTable from './CoursewareEvaluationTable';
  import { page } from '@/common/mixins';
  import { getTeacherCourseList } from '@/api/teacher';
  import Util from '@/common/util';
  const endTime = new Date();
  const startTime = new Date();
  startTime.setMonth(startTime.getMonth() -1);
  export default {
    mixins: [page],
    components: {
      CourseEvaluationForm,
      CoursewareEvaluationTable
    },
    data() {
      return {
        drawerFlag: false,
        searchData: {
          date: [`${Util.formatDate(startTime)} 00:00:00`, `${Util.formatDate(endTime)} 23:59:59`],
          select: 'courseName',
          keyword: '',
          minScore: '',
          maxScore: ''
        },
        tableSortData: {
          sort: '',
          orderBy: ''
        },
        tableData: [],
        drawCourseId: 0
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        let filterSearchData = this.filterSearchData();
        getTeacherCourseList({
          ...filterSearchData,
          //...this.tableSortData,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.tableData = res.data.list;
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
      filterSearchData() {
        let data = this.searchData;
        if (data.select == 'courseName') {
          return {
            startTime: data.date ? data.date[0] : '',
            endTime: data.date ? data.date[1] : '',
            courseId: '',
            courseName: data.keyword
            // minScore: data.minScore,
            // maxScore: data.maxScore
          };
        } else {
          return {
            startTime: data.date ? data.date[0] : '',
            endTime: data.date ? data.date[1] : '',
            courseId: data.keyword,
            courseName: ''
            // minScore: data.minScore,
            // maxScore: data.maxScore
          };
        }
      },
      ScoreChange({ column, prop, order }) {
        //暂时下期做
        //sortable="custom" tab-cloumn添加的属性
        // this.page = 1;
        // this.tableSortData.orderBy = prop ? prop : '';
        // if (order == 'ascending') {
        //   this.tableSortData.sort = 'asc';
        // } else if (order == 'descending') {
        //   this.tableSortData.sort = 'desc';
        // } else {
        //   this.tableSortData.sort = '';
        // }
        // this.getList();
      },
      handleExport() {
        let filterSearchData = this.filterSearchData();
        if (filterSearchData.courseId || filterSearchData.courseName) {
          let url = `${PANGU_URL}/v1/c/evaluate/course_list?&export=1&${this.$qs.stringify(
            filterSearchData
          )}`;
          window.open(url);
        } else {
          this.$message.warning('请先输入要导出的课程id或者课程名称');
        }
      },
      handleOpenDrawer(row) {
        this.drawerFlag = true;
        this.drawCourseId = row.courseId;
      }
    }
  };
</script>
<style lang='less' scoped>
  .course-evaluation {
    .table-wrapper {
      padding: 16px;
      border-top: 16px solid #f0f1f6;
    }
    .button-wrapper {
      .handleExport {
        float: right;
      }
    }
  }
</style>