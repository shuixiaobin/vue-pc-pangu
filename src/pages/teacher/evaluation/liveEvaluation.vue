<template>
  <div class="live-evaluation">
    <MenuTitle></MenuTitle>
    <div class="container-Box">
      <el-form
        :inline="true"
        :model="form"
        size="small"
        class="form-inline"
        ref="ruleForm"
      >
        <el-form-item
          label="评论日期"
          prop="date"
        >
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"            
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="授课教师"
          prop="teacherName"
        >
          <el-autocomplete
            v-model="form.teacherName"
            :fetch-suggestions="querySearchAsync"
            value-key="TeacherName"
            placeholder="请输入教师名字"
            @select="handleSelect"
            @change="clearTeacherId"
            clearable
          ></el-autocomplete>
        </el-form-item>
        <el-form-item
          label="课程名称"
          prop="courseTitle"
        >
          <el-input
            v-model="form.courseTitle"
            placeholder="请输入课程名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >查询</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container-Box mt20 minHeight">
      <div class="button-wrapper clearfix">
        <el-button
          size="small"
          @click="handleExport"
          v-auth="'ZP_EXPORT'"
          class="handleExport"
        >导出</el-button>
      </div>
      <LiveEvaluationTable
        :tableData="tableData"
        @handleOpenScoreTable="handleOpenScoreTable"
        @ScoreChange="ScoreChange"
        style="margin-top:8px"
      />
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="container-pagination"
      >
      </el-pagination>
    </div>
    <LiveEvaluationScoreTable
      :drawerFlag.sync="drawerFlag"
      :lessonId="lessonId"
    />
  </div>
</template>

<script>
  import { page } from '@/common/mixins';
  import Util from '@/common/util';
  import { searchALLTeacher, getLiveEvalList } from '@/api/teacher';
  import LiveEvaluationTable from './components/LiveEvaluationTable';
  import LiveEvaluationScoreTable from './components/LiveEvaluationScoreTable';
  const endTime = new Date();
  const startTime = new Date();
  startTime.setMonth(startTime.getMonth() - 1);
  export default {
    mixins: [page],
    components: {
      LiveEvaluationTable,
      LiveEvaluationScoreTable
    },
    data() {
      return {
        form: {
          date: [`${Util.formatDate(startTime)} 00:00:00`, `${Util.formatDate(endTime)} 23:59:59`],
          courseTitle: '',
          teacherId: '',
          teacherName: ''
        },
        orderSort: '', //表格平均分排序
        tableData: [], //直播评价数据
        lessonId: 0, //直播评价详情id
        drawerFlag: false
      };
    },
    created() {
      this.getList();
    },
    methods: {
      handleDateChange(val) {
        if (val) {
          const end = new Date(val[1]).getTime();
          const start = new Date(val[0]).getTime();
          const yearValue = 3600 * 1000 * 24 * 366;
          if (end - start > yearValue) {
            this.$message.warning(
              '查询区间请不要大于1年哦，若需查询多年数据建议分别查哦！'
            );
            this.form.date = [
              Util.formatDate(startTime),
              Util.formatDate(endTime)
            ];
          }
        }
      },
      handleSelect(item) {
        this.form.teacherId = item.TeacherId;
      },
      async querySearchAsync(queryString, callback) {
        try {
          const res = await searchALLTeacher();
          if (res.code == 10000) {
            let restaurants = Object.freeze(res.data);
            let results = queryString
              ? restaurants.filter(this.createStateFilter(queryString))
              : restaurants;
            callback(results);
          }
        } catch (err) {
          console.log(err);
        }
      },
      createStateFilter(queryString) {
        return state => {
          return (
            state.TeacherName.toLowerCase().indexOf(queryString.toLowerCase()) ===
            0
          );
        };
      },
      clearTeacherId(){
        this.form.teacherId = ''
      },
      getList() {
        let { date, teacherName, ...newSearchData } = this.form;
        getLiveEvalList({
          startTime: this.form.date && this.form.date[0],
          endTime: this.form.date && this.form.date[1],
          ...newSearchData,
          sort: this.orderSort,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.tableData = res.data.list;
              this.total = res.data.total;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      ScoreChange(order) {
        this.page = 1;
        this.orderSort = order ? (order == 'ascending' ? 'asc' : 'desc') : '';
        this.getList();
      },
      onSubmit() {
        this.page = 1;
        this.getList();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.form.teacherId = '';
        this.page = 1;
        this.getList();
      },
      handleExport() {
        if(this.form.teacherId||this.form.courseTitle){
            let { date, teacherName, ...newSearchData } = this.form;
            let filterData = {
              startTime: this.form.date && this.form.date[0] ? this.form.date[0] : '',
              endTime: this.form.date && this.form.date[1] ? this.form.date[1] : '',
              ...newSearchData
            };
            let url = `${PANGU_URL}/v1/c/evaluate/schedule_evaluate_list?&export=1&page=${
              this.page
            }&pageSize=${this.pageSize}&sort=${this.orderSort}&${this.$qs.stringify(
              filterData
            )}`;
            window.open(url);
        }else{
          this.$message.error('请输入要导出的授课教师或者课程名称')
        }
      },
      handleOpenScoreTable(row) {
        this.drawerFlag = true;
        this.lessonId = row.lessonId;
      }
    }
  };
</script>
<style lang="less" scoped>
  .button-wrapper {
    .handleExport {
      float: right;
    }
  }
</style>
