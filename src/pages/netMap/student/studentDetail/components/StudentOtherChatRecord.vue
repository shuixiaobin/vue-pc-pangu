<template>
  <div>
    <el-table
      :data="listData"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="课程名称"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="课程ID"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="课件名称"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="直播教师ID"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="记录时间"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      style="display:flex;justify-content: center;margin-top: 20px;"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
  import { pageMixin } from '../pageMixins'
  export default {
    mixins: [pageMixin],
    data() {
      return {}
    },

    methods: {
      getListData() {},
    },
  }
</script>
<style lang='less' scoped>
</style>