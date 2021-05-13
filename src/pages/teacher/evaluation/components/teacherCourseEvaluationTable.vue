<template>
  <el-drawer
    title="教师课程评价"
    size="80%"
    :append-to-body="true"
    :visible="scoreDrawerFlag"
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
        <el-form-item
          label="课程标题"
          prop="netClasstitle"
        >
          <el-input
            v-model.trim="form.netClasstitle"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="课程类型"
          prop="type"
        >
          <el-select
            v-model="form.type"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="评价日期"
          prop="date"
        >
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
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
        <div>
          <el-select
            size="small"
            v-model="isWatch"
            placeholder="请选择"
            @change="handleEdit"
            v-if="!source"
            v-auth="'TEACHER_SET_LOOK'"
          >
            <el-option
              v-for="item in isWatchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-button
          @click="handleExport"
          size="small"
          v-auth="'TEACHER_EXPORT'"
        >导出</el-button>
      </div>
      <div class="desc">
        {{tips.teacherName}} 共收到<span class="green">{{tips.total}}</span>条评价，均分<span class="orange">{{tips.avg}}</span>分
      </div>
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="ScoreChange"
        :max-height="tableHeight"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          width="55"
          v-if="!source"
        >
        </el-table-column>
        <el-table-column
          label="序号"
          prop="number"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="netClasstitle"
          label="课程标题"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="lessionTitle"
          label="课件标题"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="评价用户名"
        >
        </el-table-column>
        <el-table-column
          prop="courseScore"
          sortable="custom"
          label="评分"
        >
        </el-table-column>
        <el-table-column
          prop="courseRemark"
          label="评分内容"
        >
        </el-table-column>
        <el-table-column
          prop="rateDate"
          label="评价时间"
        >
        </el-table-column>
        <el-table-column
          prop="hiddenStatus"
          label="前端是否可见"
          v-if="!source"
        >
        </el-table-column>
        <el-table-column
          label="设置"
          fixed="right"
          v-if="!source"
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
    getTeacherCourseEvalList,
    changeTeacherCourseEvalIsWatch
  } from '@/api/teacher';
  export default {
    mixins: [page],
    props: {
      source: {
        type: String,
        default: ''
      },
      scoreDrawerFlag: {
        type: Boolean,
        default: false
      },
      teacherId: {
        type: [String, Number],
        default: ''
      },
      date: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    data() {
      return {
        loading:true,
        tableHeight: '',
        form: {
          netClasstitle: '',
          type: '',
          date: this.date
        },
        tableSortData: {
          orderSort: '',
          orderBy: ''
        },
        typeList: [
          {
            value: 'live',
            label: '直播'
          },
          {
            value: 'video',
            label: '录播'
          }
        ],
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
        tips: {
          teacherName: '',
          avg: '',
          total: ''
        },
        tableData: []
      };
    },
    watch: {
      scoreDrawerFlag(nv, ov) {
        if (nv) {
          this.getList();
        }
      },
      date(nv,ov){
        this.form.date = nv;
      }
    },
    created() {
      //this.form.date = this.date;
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
      ScoreChange({ column, prop, order }) {
        this.page = 1;
        this.tableSortData.orderBy = prop ? prop : '';
        this.tableSortData.orderSort = order
          ? order == 'ascending'
            ? 'asc'
            : 'desc'
          : '';
        this.getList();
      },
      getList() {
        let { date, ...newSearchData } = this.form;
        getTeacherCourseEvalList({
          teacherId: this.teacherId,
          startTime: this.form.date && this.form.date[0],
          endTime: this.form.date && this.form.date[1],
          ...newSearchData,
          ...this.tableSortData,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.loading = false;
              this.tips.teacherName = res.data.teacherName;
              this.tips.total = res.data.total;
              this.tips.avg = res.data.avg;
              this.total = res.data.total;
              this.tableData = res.data.lists;
            } else {
              this.loading = false;
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            this.loading = false;
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
        this.page = 1
        this.$emit('update:scoreDrawerFlag', false);
      },
      handleExport() {
        // if(this.form.netClasstitle){
				let { date, ...newSearchData } = this.form;
				let filterData = {
					startTime: this.form.date && this.form.date[0] ? this.form.date[0] : '',
					endTime: this.form.date && this.form.date[1] ? this.form.date[1] : '',
					teacherId: this.teacherId,
					...newSearchData
				};
				let url = `${PANGU_URL}/v1/c/evaluate/evaluate_list_by_teacher_id?&export=1&page=${
					this.page
				}&pageSize=${this.pageSize}&${this.$qs.stringify(
					filterData
				)}&${this.$qs.stringify(this.tableSortData)}`;
				window.open(url);
        // }else{
        //   this.$message.warning('请输入要导出的课程标题')
        // }
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
            }else{
              this.$message.error(res.msg)
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