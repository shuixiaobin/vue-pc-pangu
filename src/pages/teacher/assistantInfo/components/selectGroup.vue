<template>
  <div class="selectGroup">
    <el-col :span="4">
      <el-form-item
        :prop="index!=null?'teacherSubjects.'+index+'.examType':'teacherGroup.examType'"
        :rules="rules.examType"
        style="margin-bottom:0"
      >
        <el-select
          v-model="items.examType"
          placeholder="请选择考试类型"
          class="mr10"
          @change="getExamTypeTwo"
        >
          <el-option
            v-for="(item) in categoryOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item
        :prop="index!=null?'teacherSubjects.'+index+'.subjectId':'teacherGroup.subjectId'"
        :rules="rules.subjectId"
        style="margin-bottom:0"
      >
        <el-select
          v-model="items.subjectId"
          placeholder="请选择科目"
          class="mr10"
        >
          <el-option
            v-for="(item) in subjectOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </div>
</template>
<script>
  import { getExamTypeOne, getExamTypeTwo } from '@/api/teacher';
  export default {
    data() {
      return {
        teacherId: this.$route.query.teacherId,
        categoryOptions: [],
        subjectOptions: []
      };
    },
    props: ['items', 'index', 'rules'],
    created() {
      this.getExamTypeOne();
      if(this.teacherId){
        this.getExamTypeTwo(this.items.examType)
      }
    },
    watch: {
      items: {
        handler(newValue, oldValue) {
          console.log(newValue.examType , oldValue.examType)
          if (newValue.examType != oldValue.examType) {
            this.getExamTypeTwo(newValue.examType);
          }
        },
        deep: true
      }
    },
    methods: {
      async getExamTypeOne() {
        try {
          const res = await getExamTypeOne();
          this.categoryOptions = res.data;
        } catch (err) {
          console.log(err);
        }
      },
      async getExamTypeTwo(ExamType) {
        try {
          const res = await getExamTypeTwo({ ExamType });
          this.subjectOptions = res.data;
        } catch (err) {
          console.log(err);
        }
      }
    }
  };
</script>
<style lang="less">
  .selectGroup {
    display: inline;
  }
</style>