<template>
  <el-table
    border
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%">
    <el-table-column
      :render-header="renderHeader"
      width="95"
      align="center">
      <template slot-scope="scope">
        <el-checkbox :disabled="scope.row.disabled" v-model="scope.row.selected" @change="checkedChange(scope.row)"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column prop="rid"
      label="课程ID"
      header-align="center"
      align="center"
      width="100">
    </el-table-column>
    <el-table-column prop="title"
      label="课程标题"
      header-align="center"
      align="center"
    >
    </el-table-column>
    <el-table-column prop="startDate"
      header-align="center"
      align="center"
      label="创建/上线日期"
      width="180">
    </el-table-column>
    <el-table-column prop="actualPrice"
      label="价格"
      header-align="center"
      align="center"
      width="100">
    </el-table-column>
    <el-table-column prop="status"
      header-align="center"
      align="center"
      label="状态"
      width="100">
      <template slot-scope="scope">
        {{scope.row.status |statusFilters}}
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
import { selectTable } from '@/common/mixins'
export default {
  mixins: [ selectTable ],
  filters: {
    statusFilters(val) {
      switch (Number(val)) {
        case 0: return '未上线'
        case 1: return '已上线'
        case 2: return '已下线'
      }
    }
  }
}
</script>

<style scoped>

</style>
