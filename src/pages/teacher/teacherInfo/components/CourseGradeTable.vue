<template>
  <el-table
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column
      prop="date"
      label="序号"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="课程标题"
    >
    </el-table-column>
    <el-table-column
      prop="address"
      label="类型"
    >
    </el-table-column>
    <el-table-column
      prop="address"
      label="课件标题"
    >
    </el-table-column>
    <el-table-column
      prop="address"
      label="评价用户名"
    >
    </el-table-column>
    <el-table-column
      prop="address"
      label="评分"
      sortable
    >
    </el-table-column>
    <el-table-column
      prop="address"
      label="评分内容"
    >
    </el-table-column>
    <el-table-column
      prop="address"
      label="评价时间"
    >
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      tableData: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {}
    },

    methods: {},
  }
</script>
<style lang='less' scoped>
</style>