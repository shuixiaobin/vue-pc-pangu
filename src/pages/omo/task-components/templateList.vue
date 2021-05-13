<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="templateTitle"
      label="模板标题"
      align="center">
    </el-table-column>
    <el-table-column prop="workTitle"
      label="作业标题"
      align="center">
    </el-table-column>
    <el-table-column prop="workDate"
      label="作业日期"
      align="center">
    </el-table-column>
    <el-table-column prop="receiveCount"
      align="center"
      label="收到人数">
    </el-table-column>
    <el-table-column prop="submitCount"
      label="提交人数"
      align="center">
    </el-table-column>
    <el-table-column prop="correctCount"
      align="center"
      label="批改人数">
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
