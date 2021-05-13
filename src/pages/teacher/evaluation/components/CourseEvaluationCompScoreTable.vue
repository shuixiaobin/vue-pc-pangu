<template>
  <el-drawer
    title="课程评价/用户评价详情"
    size="80%"
    :append-to-body="true"
    :visible="scoreDrawerFlag"
    :before-close="handleClose"
    class="teacherEvalDrawer"
  >
    <div class="container">
      <el-form
        :model="form"
        inline
        size="small"
        ref="ruleForm"
      >
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
      <div class="button-wrapper">
        <el-select
          size="small"
          v-model="isWatch"
          placeholder="请选择"
          @change="handleEdit"
          v-auth="'CLASS_SET_LOOK'"
        >
          <el-option
            v-for="item in isWatchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          @click="handleExport"
          size="small"
          v-auth="'CLASS_EXPORT'"
        >导出</el-button>
      </div>
      <div class="desc">
        【{{extra.courseTitle}}】【{{extra.lessonTitle}}】共收到<span class="green">{{extra.totalCount}}</span>条评价，均分<span class="orange">{{extra.avgEvaluste}}</span>分
      </div>
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :max-height="tableHeight"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          label="用户昵称"
          prop="userNickName"
        >
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="score"
          sortable
          label="评分"
        >
        </el-table-column>
        <el-table-column
          prop="scoreTime"
          label="评价时间"
        >
        </el-table-column>
        <el-table-column
          prop="isHiddenStr"
          label="前端是否可见"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row.isHidden?0:1,scope.row.id)"
            >{{scope.row.isHidden?'可见':'不可见'}}</el-button>
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
  </el-drawer>
</template>

<script>
  import { page } from '@/common/mixins';
  import {
    getTeacherEvaluateDetail,
    changeTeacherCourseEvalIsWatch
  } from '@/api/teacher';
  export default {
    mixins: [page],
    props: {
      scoreDrawerFlag: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading:true,
        tableHeight: '',
        form: {
          date: this.$attrs.date
        },
        isWatchOptions: [
          {
            value: '0',
            label: '批量设置可见'
          },
          {
            value: '1',
            label: '批量设置不可见'
          }
        ],
        isWatch: '0',
        multipleSelection: [],
        extra: {
          courseTitle: '',
          lessonTitle: '',
          totalCount: '',
          avgEvaluste: ''
        }, //tips 信息
        tableData: []
      };
    },
    watch: {
      scoreDrawerFlag(nv, ov) {
        if (nv) {
          this.getList();
        }
      }
    },
    created() {
      // this.form.date = this.$attrs.date;
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
        getTeacherEvaluateDetail({
          startTime: this.form.date[0],
          endTime: this.form.date[1],
          courseId: this.$attrs.drawCourseId,
          lessonId: this.$attrs.drawLessonId,
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
        this.$emit('update:scoreDrawerFlag', false);
      },
      handleExport() {
        let exportData = {
          startTime: this.form.date[0],
          endTime: this.form.date[1],
          courseId: this.$attrs.drawCourseId,
          lessonId: this.$attrs.drawLessonId,
          page: this.page,
          pageSize: this.pageSize
        };
        let url = `${PANGU_URL}/v1/c/evaluate/evaluate_detail?&export=1&${this.$qs.stringify(
          exportData
        )}`;
        window.open(url);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val.map(item => item.id);
      },
      handleEdit(val, id) {
        changeTeacherCourseEvalIsWatch({
          ridlist: id ? id : this.multipleSelection.join('|'),
          status: val
        })
          .then(res => {
            if (res.code == 10000) {
              this.$message.success('修改成功');
              this.page = 1;
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
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
  .button-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
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