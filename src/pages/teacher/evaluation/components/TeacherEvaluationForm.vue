<template>
  <div class="teacher-evaluation-form">
    <el-form
      size="small"
      label-width="80px"
      :model="form"
      :inline="true"
      ref="ruleForm"
    >
      <el-form-item
        label="评价日期"
        prop="date"
      >
        <el-date-picker
          style="width:300px"
          v-model="form.date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          clearable
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
          style="width:300px"
          clearable
        ></el-autocomplete>
      </el-form-item>
      <el-form-item
        label="平均分"
        v-if="isShow"
      >
        <el-form-item
          prop="minScore"
          style="width:140px;margin:0"
        >
          <el-input
            v-model="form.minScore"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <span style="display:inline-block;width:10px;">-</span>
        <el-form-item
          prop="maxScore"
          style="width:140px;margin:0"
        >
          <el-input
            v-model="form.maxScore"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
        v-if="isShow"
      >
        <el-select
          style="width:300px"
          v-model="form.status"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="专长考试"
        prop="netClassCategoryId"
        v-if="isShow"
      >
        <el-select
          style="width:300px"
          v-model="form.netClassCategoryId"
          placeholder="请选择"
          @change="getSubjectList"
          clearable
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="专长科目"
        prop="subjectType"
        v-if="isShow"
      >
        <el-select
          style="width:300px"
          v-model="form.subjectType"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in subjectList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="专兼职"
        prop="jobType"
        v-if="isShow"
      >
        <el-select
          style="width:300px"
          v-model="form.jobType"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in jobTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属学校"
        prop="fenxiao"
        v-if="isShow"
      >
        <el-select
          v-model="form.fenxiao"
          placeholder="请选择"
          style="width:300px"
          clearable
        >
          <el-option
            v-for="item in schoolList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="isShow?' ':''">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >查询</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <span
      :class="[isShow?'toggle-btn close':'toggle-btn open']"
      @click="isShow=!isShow"
    >{{isShow?'收起':'展开'}} <i
        class="iconfont"
        :class="[isShow?'iconshouqi':'iconzhankai']"
      ></i></span>
  </div>
</template>

<script>
  import {
    searchALLTeacher,
    getCategory,
    getSubjectList,
    getSchoolList
  } from '@/api/teacher';
  export default {
    props: {
      form: {
        type: Object,
        default: {
          date: [],
          teacherName: '',
          minScore: '',
          maxScore: '',
          status: '',
          netClassCategoryId: '',
          subjectType: '',
          jobType: '',
          fenxiao: ''
        }
      }
    },
    data() {
      return {
        isShow: false,
        categoryList: [], //专长列表
        subjectList: [], //专长科目
        schoolList: [], //学校列表
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
        statusOptions: [
          {
            value: '1',
            label: '正常'
          },
          {
            value: '3',
            label: '下线'
          }
        ]
      };
    },
    created() {
      this.getCategory();
      this.getSchool();
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
      async getSubjectList(netClassCategoryid) {
        try {
          const res = await getSubjectList({
            net_class_category_id: netClassCategoryid
          });
          if (res.code === 10000) {
            this.$emit('resetSubject');
            this.subjectList = Object.freeze(res.data);
          }
        } catch (err) {
          console.log(err);
        }
      },
      async getSchool() {
        try {
          const res = await getSchoolList();
          if (res.code === 10000) {
            this.schoolList = Object.freeze(res.data);
          }
        } catch (err) {
          console.log(err);
        }
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
      submitForm() {
        this.$emit('search');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$emit('search');
      }
    }
  };
</script>
<style lang='less' scoped>
  .el-date-editor .el-range-separator {
    padding: 0 13px;
  }
  .line {
    text-align: center;
  }
  .teacher-evaluation-form {
    position: relative;
  }
  
</style>