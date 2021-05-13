<template>
  <div>
    <el-row :gutter="24">
      <el-col
        :span="7"
        style="padding-left:0"
      >
        <el-select
          style="width:100%"
          v-model="teachSubject.examType"
          placeholder="请选择"
          @change="handleCategoryChange"
        >
          <el-option
            v-for="(item) in pkCategoryOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-select
          style="width:100%"
          v-model="teachSubject.subjectType"
          placeholder="请选择"
          @focus="handleFocus"
        >
          <el-option
            v-for="(item) in subjectOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-select
          style="width:100%"
          v-model="teachSubject.teacherCourseLevel"
          placeholder="请选择"
        >
          <el-option
            v-for="(item) in teacherCourseLevelOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getCourseLevel, getExamTypeOne, getExamTypeTwo } from '@/api/teacher'
  export default {
    props: {
      teachSubject: {
        type: Object,
        default: {
          examType: '',
          subjectType: '',
          teacherCourseLevel: '',
        },
      },
      pkCategoryOptions: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        teacherCourseLevelOptions: [],
        subjectOptions: [],
      }
    },
    mounted() {
      this.getCourseLevel()
      if (this.teachSubject.examType) {
        this.getExamTypeTwo(this.teachSubject.examType)
      }
    },
    methods: {
      handleCategoryChange(val) {
        this.teachSubject.subjectType = ''
      },
      handleFocus() {
        if (this.teachSubject.examType === '') {
          this.$message.warning('请先选择1级考试科目！')
          return
        }
      },
      async getCourseLevel() {
        try {
          const res = await getCourseLevel()
          this.teacherCourseLevelOptions = res.data
        } catch (err) {
          console.log(err)
        }
      },
      async getExamTypeTwo(ExamType) {
        try {
          const res = await getExamTypeTwo({ ExamType })
          this.subjectOptions = res.data
        } catch (err) {
          console.log(err)
        }
      },
    },
  }
</script>