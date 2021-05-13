<template>
  <el-drawer
    title="课程评分"
    size="80%"
    :visible="drawerFlag"
    :before-close="handleClose"
  >
    <el-form
      :inline="true"
      :model="form"
      size="small"
      class="form-inline"
    >
      <el-form-item
        label="课程标题"
        prop="title"
      >
        <el-input
          v-model="form.title"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="课程类型"
        prop="type"
      >
        <el-select
          v-model="form.type"
          placeholder="请输入"
        >
          <el-option
            label="区域一"
            value="shanghai"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="评价日期"
        prop="date"
      >
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >查询</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="container">
      <div class="clearfix">
        <el-button
          @click="handleExport"
          size="small"
        >导出</el-button>
      </div>
      <div class="desc">
        教师姓名 共收到<span class="green">18</span>条评价，均分<span class="orange">4.9</span>分
      </div>
      <CourseGradeTable />
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
  </el-drawer>
</template>

<script>
  const endTime = new Date();
  const startTime = new Date();
  startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 365);
  import Util from '@/common/util';
  import { page } from '@/common/mixins'
  import { getTeacherCourseEvalList } from '@/api/teacher'
  import CourseGradeTable from './CourseGradeTable'
  export default {
    mixins: [page],
    components: {
      CourseGradeTable,
    },
    props: {
      drawerFlag: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        form: {
          type: '',
          date: [Util.formatDate(startTime), Util.formatDate(endTime)] //评价日期
        },
      }
    },

    methods: {
      async getTeacherCourseEvalList() {
        try {
          const parmas = {
            startTime: '',
            endTime: '',
            teacherId: '',
            netClasstitle: '',
            type: '',
            page: this.page,
            pageSize: this.pageSize,
            orderBy: '',
            orderSort: 'asc', //asc:升序，desc:降序，默认asc
            export: 0,
          }
          const res = await getTeacherCourseEvalList(parmas)
          console.log(res)
        } catch (err) {
          console.log(err)
        }
      },
      handleClose() {
        this.$emit('update:drawerFlag', false)
      },
      onSubmit() {},
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleExport() {},
      getList() {},
    },
  }
</script>
<style lang='less' scoped>
  @import '../../../../assets/css/theme-color.less';
  .el-form {
    padding: 0 24px;
  }
  .container {
    padding: 24px;
    .el-button {
      float: right;
    }
  }

  .desc {
    width: 100%;
    height: 40px;
    background: rgba(24, 86, 255, 0.1);
    line-height: 40px;
    text-indent: 16px;
    color: #303133;
    margin-top: 8px;
    font-size: 14px;
    i {
      color: @primary;
    }
    .green {
      color: @success;
    }
    .orange {
      color: @warning;
    }
  }
</style>