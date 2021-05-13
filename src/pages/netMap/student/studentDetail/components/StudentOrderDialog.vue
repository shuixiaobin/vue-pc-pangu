<template>
  <el-dialog
    title="订单详情"
    width="90%"
    :before-close="handleClose"
    :visible="dialogTableVisible"
  >
    <StudentOrderTable :list-data="listData" />
    <el-pagination
      style="display:flex;justify-content: center;margin-top: 20px;"
      layout="prev, pager, next"
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @current-change="currentChange"
    >
    </el-pagination>
  </el-dialog>
</template>

<script>
  import StudentOrderTable from './StudentOrderTable'
  export default {
    components: {
      StudentOrderTable,
    },
    props: {
      dialogTableVisible: {
        type: Boolean,
        default: false,
      },
      listData: {
        type: Array,
        default: () => [],
      },
      page: {
        type: Number,
        default: 1,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        pageSize: 5,
      }
    },

    methods: {
      currentChange(val) {
        this.$emit('update:page', val)
      },
      handleClose() {
        this.$emit('update:dialogTableVisible', false)
      },
    },
  }
</script>
<style lang='less' scoped>
</style>