<template>
   <el-table :data="tableData">
    <el-table-column prop="name" label="用户名" align="center" />
    <el-table-column prop="mobile" label="手机号" align="center" />
    <el-table-column prop="registerTimeStr" label="注册时间" align="center" />
  </el-table>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  props: {
    tableData: Array,
  },
}
</script>

<style scoped>

</style>
