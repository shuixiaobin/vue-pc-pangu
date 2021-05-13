<template>
  <el-drawer
    title="课程评价/课件评价"
    size="80%"
    :visible="drawerFlag"
    :before-close="handleClose"
    :wrapperClosable="false"
    class="teacherEvalDrawer"
  >
    <div class="container">
      <el-form
        :model="form"
        inline
        size="small"
        ref="ruleForm"
      >
        <el-form-item prop="keyword">
          <el-input
            placeholder="请输入"
            v-model.trim="form.keyword"
            style="width:400px"
            clearable
          >
            <el-select
              v-model="form.select"
              slot="prepend"
              placeholder="课件名称"
              style="width:100px;"
            >
              <el-option
                v-for="(item,index) in selectList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item
          label="评价日期"
          prop="date"
        >
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width:380px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >查询</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div
        class="clearfix"
        style="margin-top:14px;"
      >
        <el-button
          @click="handleExport"
          style="float:right"
          size="small"
          v-auth="'CLASS_EXPORT'"
        >导出</el-button>
      </div>
      <div class="desc">
        【{{extra.courseName}}】共收到<span class="green">{{extra.totalCount}}</span>条评价，均分<span class="orange">{{extra.avgScore}}</span>分
      </div>
      <el-table
        border
        :data="tableData"
        style="width: 100%;"
        :max-height="tableHeight"
        v-loading="loading"
      >
        <el-table-column
          label="课件ID"
          prop="lessonId"
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
        >
        </el-table-column>
        <el-table-column
          prop="personCount"
          label="评分人数"
        >
        </el-table-column>
        <el-table-column
          prop="zbAvgScore"
          sortable
          label="直播评均分"
        >
        </el-table-column>
        <el-table-column
          prop="lbAvgScore"
          sortable
          label="录播评均分"
        >
        </el-table-column>
        <el-table-column
          prop="avgScore"
          label="平均分"
          sortable
        >
          <template slot-scope="scope">
            <el-button type="text"  @click="handleOpenScore(scope.row)" style="cursor:pointer">
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
    <CourseEvaluationCompScoreTable
      :score-drawer-flag.sync="scoreDrawerFlag"
      :drawLessonId="drawLessonId"
      v-bind="$attrs"
    />
  </el-drawer>
</template>

<script>
  import { page } from '@/common/mixins';
  import { getTeacherLessonList } from '@/api/teacher';
  import CourseEvaluationCompScoreTable from './CourseEvaluationCompScoreTable';
  export default {
    mixins: [page],
    components: {
      CourseEvaluationCompScoreTable
    },
    props: {
      drawerFlag: {
        type: Boolean,
        default: false
      }
      // drawCourseId: {
      //   type: Number,
      //   default: 0
      // }
    },
    data() {
      return {
        loading:true,
        tableHeight: '',
        drawLessonId: 0, //选中的课件id
        selectList: [
          { label: '课件名称', value: 'lessonName' },
          { label: '课件ID', value: 'lessonId' },
          { label: '教师名称', value: 'teacherName' }
        ],
        form: {
          select: 'lessonName',
          keyword: '',
          date: this.$attrs.date
        },
        scoreDrawerFlag: false,
        extra: {
          courseName: '',
          totalCount: '',
          avgScore: ''
        }, //tips 信息
        tableData: []
      };
    },
    watch: {
      drawerFlag(nv, ov) {
        if (nv) {
          this.getList();
        }
      },
      '$attrs.date'(nv,ov){
        this.form.date = nv
      }
    },
    created() {
      //this.form.date = this.$attrs.date;
      this.getTableHeight();
    },
    mounted() {
      let _this = this;
      window.onresize = () => {
        if (_this.resizeFlag) {
          clearTimeout(_this.resizeFlag);
        }
        _this.resizeFlag = setTimeout(() => {
          _this.getTableHeight();
          _this.resizeFlag = null;
        }, 100);
      };
    },
    methods: {
      getTableHeight() {
        let tableH = 360;
        this.tableHeight = window.innerHeight - tableH;
      },
      getList() {
        let filterSearchData = this.filterSearchData();
        getTeacherLessonList({
          ...filterSearchData,
          courseId: this.$attrs.drawCourseId,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.loading = false
              this.extra = res.data.extra;
              this.tableData = res.data.list;
              this.total = res.data.total;
            }
          })
          .catch(err => {
            this.loading = false
            console.log(err);
          });
      },
      filterSearchData() {
        let data = this.form;
        if (data.select == 'lessonName') {
          return {
            startTime: data.date ? data.date[0] : '',
            endTime: data.date ? data.date[1] : '',
            lessonId: '',
            lessonName: data.keyword,
            teacherName: ''
          };
        } else if (data.select == 'lessonId') {
          return {
            startTime: data.date ? data.date[0] : '',
            endTime: data.date ? data.date[1] : '',
            lessonId: data.keyword,
            lessonName: '',
            teacherName: ''
          };
        } else {
          return {
            startTime: data.date ? data.date[0] : '',
            endTime: data.date ? data.date[1] : '',
            lessonId: '',
            lessonName: '',
            teacherName: data.keyword
          };
        }
      },
      submitForm() {
        this.page = 1;
        this.getList();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.page = 1;
        this.getList();
      },
      handleClose() {
        this.page = 1;
        this.$emit('update:drawerFlag', false);
      },
      handleOpenScore(row) {
        this.scoreDrawerFlag = true;
        this.drawLessonId = row.lessonId;
      },
      handleExport() {
        if(this.form.keyword){
          let filterSearchData = this.filterSearchData();
          console.log(filterSearchData);
          let url = `${PANGU_URL}/v1/c/evaluate/lesson_list?&export=1&courseId=${
            this.$attrs.drawCourseId
          }&${this.$qs.stringify(filterSearchData)}`;
          window.open(url);
        }else{
          this.$message.error('请输入要导出的课件名称或者课件ID或者教师名称')
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      //离开组件的时候触发
      window.onresize = null;
      next();
    }
  };
</script>
<style lang='less' scoped>
  @import '../../../../assets/css/theme-color.less';
  .container {
    padding: 20px;
  }
  .desc {
    margin: 8px 0;
    width: 100%;
    height: 40px;
    background: rgba(24, 86, 255, 0.1);
    line-height: 40px;
    text-indent: 16px;
    color: #303133;
    font-size: 14px;
    .green {
      color: @success;
    }
    .orange {
      color: @warning;
    }
  }
</style>