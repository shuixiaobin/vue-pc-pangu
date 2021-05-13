<template>
  <div class="evaluation">
    <MenuTitle />
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="教师评价"
        name="1"
      >
      </el-tab-pane>
      <el-tab-pane
        label="课程评价"
        name="2"
      ></el-tab-pane>
    </el-tabs>
    <TeacherEvaluation v-if="activeName==='1'" />
    <CourseEvaluationComp v-if="activeName==='2'" />
  </div>
</template>

<script>
  import CourseEvaluationComp from './components/CourseEvaluationComp';
  import TeacherEvaluation from './components/teacherEvaluation';
  export default {
    components: {
      TeacherEvaluation,
      CourseEvaluationComp
    },
    data() {
      return {
        activeName: '1'
      };
    }
  };
</script>
<style lang='less' scoped>
  .evaluation {
    background: #fff;
    .container-title {
      border-bottom: none;
    }
    .el-tabs {
      padding-left: 16px;
    }
  }
</style>