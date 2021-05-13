<template>
  <div class="student-other">
    <div class="container-title">
      <h2>其他情况</h2>
      <div class="tab-wrapper">
        <el-radio-group
          size="small"
          v-model="tabPosition"
        >
          <el-radio-button label="course">课程督学</el-radio-button>
          <!-- <el-radio-button label="1">上课进度</el-radio-button> -->
          <!-- <el-radio-button label="2">直播间聊天记录</el-radio-button> -->
          <el-radio-button label="2">专项训练</el-radio-button>
          <el-radio-button label="3">真题演练</el-radio-button>
          <el-radio-button label="12">模考</el-radio-button>
          <el-radio-button label="13">估分</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="container">
      <Superintendent v-if="tabPosition == 'course'" />
      <StudentOtherTabel v-else :answer-card-type="tabPosition" />
    </div>
  </div>
</template>

<script>
  // import StudentOtherProgressTable from './StudentOtherProgressTable'
  // import StudentOtherChatRecord from './StudentOtherChatRecord'
  import StudentOtherTabel from './StudentOtherTabel'
  import Superintendent from './Superintendent'
  export default {
    components: {
      // StudentOtherProgressTable,
      // StudentOtherChatRecord,
      StudentOtherTabel,
      Superintendent
    },
    data() {
      return {
        tabPosition: 'course',
      }
    },
  }
</script>
<style lang='less' scoped>
  .student-other {
    margin-top: 16px;
    background: #fff;
  }
</style>