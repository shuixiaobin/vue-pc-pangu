<template>
  <el-form
    size="small"
    :inline="true"
    :model="ruleForm"
    ref="ruleForm"
    class="rule-form"
  >
    <el-form-item
      label="教师姓名"
      prop="teacherName"
    >
      <el-input
        v-model="ruleForm.teacherName"
        placeholder="请输入"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="所属学校"
      prop="school"
    >
      <el-select
        v-model="ruleForm.school"
        placeholder="请输入"
      >
        <el-option
          v-for="item in schoolOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="状态"
      prop="status"
    >
      <el-select
        v-model="ruleForm.status"
        placeholder="请输入"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="专长考试"
      prop="exam"
    >
      <el-select
        v-model="ruleForm.exam"
        placeholder="请输入"
      >
        <el-option
          v-for="(item) in categoryList"
          :key="item.value"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="专兼职"
      prop="partTime"
    >
      <el-select
        v-model="ruleForm.partTime"
        placeholder="请输入"
      >
        <el-option
          v-for="item in jobTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="评价日期"
      prop="date"
    >
      <el-date-picker
        v-model="ruleForm.date"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleDateChange"
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
</template>

<script>
  const endTime = new Date();
  const startTime = new Date();
  startTime.setMonth(startTime.getMonth() - 1);
  import Util from '@/common/util';
  import { searchTeacher, getSchoolType, getCategory } from '@/api/teacher';
  export default {
    data() {
      return {
        statusOptions: [
          {
            value: '0',
            label: '待审核'
          },
          {
            value: '1',
            label: '正常'
          },
          {
            value: '3',
            label: '下线'
          }
        ],
        jobTypeOptions: [
          {
            value: '1',
            label: '专职'
          },
          {
            value: '2',
            label: '兼职'
          }
        ],
        schoolOptions: [], //学校列表
        categoryList: [], //专长考试列表
        ruleForm: {
          teacherName: '', //教师姓名
          school: '', //所属学校
          status: '1', //状态
          exam: '', //专长考试
          partTime: '', //专兼职
          date: [Util.formatDate(startTime), Util.formatDate(endTime)] //评价日期
        }
      };
    },

    mounted() {
      this.getSchoolType(); 
      this.getCategory();
      const params = {
        teacherName: this.ruleForm.teacherName,
        fenXiaoId: this.ruleForm.school,
        status: this.ruleForm.status,
        categoryId: this.ruleForm.exam,
        jobType: this.ruleForm.partTime,
        startTime: `${this.ruleForm.date[0]} 00:00:00`  || '',
        endTime: `${this.ruleForm.date[1]} 23:59:59` || ''
      };
      this.$emit('search', params);
    },

    methods: {
      async getCategory() {
        try {
          const res = await getCategory();
          if (res.code === 10000) {
            this.categoryList = Object.freeze(res.data);
          }
        } catch (err) {
          console.log(err);
        }
      },
      async getSchoolType() {
        try {
          const res = await getSchoolType();
          this.schoolOptions = Object.freeze(res.data);
        } catch (err) {
          console.log(err);
        }
      },
      submitForm() {
        const params = {
          teacherName: this.ruleForm.teacherName,
          fenXiaoId: this.ruleForm.school,
          status: this.ruleForm.status,
          categoryId: this.ruleForm.exam,
          jobType: this.ruleForm.partTime,
          startTime: this.ruleForm.date ? `${this.ruleForm.date[0]} 00:00:00` : '',
          endTime: this.ruleForm.date ? `${this.ruleForm.date[1]} 23:59:59` : '',
        }
        this.$emit('search', params)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleDateChange(val) {
        if (val) {
          const end = new Date(val[1]).getTime()
          const start = new Date(val[0]).getTime()
          const yearValue = 3600 * 1000 * 24 * 365
          if (end - start > yearValue) {
            this.$message.warning('查询区间请不要大于1年哦，若需查询多年数据建议分别查哦！')
            this.ruleForm.date = [Util.formatDate(startTime), Util.formatDate(endTime)]
          }
        }
      }
    }
  };
</script>
<style lang='less' scoped>
</style>