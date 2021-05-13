<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :span-method="objectSpanMethod"
      style="width: 100%">
      <el-table-column
        :render-header="renderHeader"
        width="95"
        align="center"
        v-if="select">
        <template slot-scope="scope">
          <el-checkbox
            :disabled="scope.row.disabled"
            v-model="scope.row.selected"
            @change="checkedChange(scope.row)"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        label="所属课程ID"
        prop="classId"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="所属课程名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="stageName"
        align="center"
        width="200"
        label="阶段名称">
      </el-table-column>
      <el-table-column
        prop="selected"
        align="center"
        width="100"
        label="选择状态">
        <template slot-scope="scope">
          <div>{{scope.row.selected ? '已选择' : '未选择'}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import { selectTable } from '../../common/mixins'
export default {
  mixins: [ selectTable ],
  props: {
    tableData: Array,
    select: Boolean,
    stageMap: Object
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (!this.stageMap) return
      if (columnIndex === 1 || columnIndex === 2) {
        if (rowIndex in this.stageMap) {
          return {
            rowspan: this.stageMap[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
