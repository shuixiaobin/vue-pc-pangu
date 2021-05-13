<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="courseTitle"
      label="课程标题"
      align="center">
    </el-table-column>
    <el-table-column prop="courseWorkTitle"
      label="作业标题"
      align="center">
    </el-table-column>
    <el-table-column prop="phoneNum"
      label="手机号"
      align="center">
    </el-table-column>
    <el-table-column prop="realName"
      align="center"
      label="真实姓名">
    </el-table-column>
    <el-table-column prop="submitTime"
      label="提交时间"
      align="center">
    </el-table-column>
    <el-table-column prop="cardStatus"
      align="center"
      label="批改状态">
      <template slot-scope="scope">
        {{scope.row.cardStatus == 1?"未批改":(scope.row.cardStatus == 2?"已批改":'')}}
      </template>
    </el-table-column>
    <el-table-column label="操作"
      align="center">
      <template slot-scope="scope">
        <el-button size="small" type="text" @click="downLine(scope.row)" class="serchLeft">批改</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  props: ['tableData'],
  methods: {
    downLine (d) {
      this.$emit('correcting', d)
    }
  }
}
</script>

<style scoped>

</style>
