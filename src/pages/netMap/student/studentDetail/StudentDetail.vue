<template>
  <div style="overflow-y:auto;height:100%;width:100%;overflow-x:hidden">
  <el-row :gutter="22">
    <el-col :span="hasUserName" :xs="24">
      <StudentInfo />
      <StudentFollowRecord />
      <StudentOrderDetail v-if="userName" />
      <StudentOther v-if="userName" />
    </el-col>
    <el-col :span="9" :xs="24" v-if="userName">
      <StudentStudyInfo />
      <StudentAddress /> 
      <!-- 分校情况暂时注视 -->
      <!-- <StudentBranchSchool /> -->
    </el-col>
  </el-row>
  </div>
</template>

<script>
  import StudentInfo from './components/StudentInfo'
  import StudentStudyInfo from './components/StudentStudyInfo'
  import StudentFollowRecord from './components/StudentFollowRecord'
  import StudentAddress from './components/StudentAddress'
  import StudentBranchSchool from './components/StudentBranchSchool'
  import StudentOrderDetail from './components/StudentOrderDetail'
  import StudentOther from './components/StudentOther'
  export default {
    name:'studentDetail',
    components: {
      StudentInfo,
      StudentStudyInfo,
      StudentFollowRecord,
      StudentAddress,
      StudentBranchSchool,
      StudentOrderDetail,
      StudentOther
    },
    data () {
      return {
        userName: this.$route.query.userName
      }
    },
    computed: {
      hasUserName() {
        return this.userName ? 15 : 24
      }
    }
  }
</script>