<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        :render-header="renderHeader"
        width="95"
        align="center"
        v-if="select">
        <template slot-scope="scope">
          <el-checkbox :disabled="scope.row.disabled" v-model="scope.row.selected" @change="checkedChange(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        label="试卷ID"
        prop="id"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="测试试卷名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        width="100"
        label="试卷状态">
      </el-table-column>
      <el-table-column
        prop="examTime"
        width="350"
        align="center"
        label="考试时间">
      </el-table-column>
      <el-table-column
        prop="selectState"
        align="center"
        width="100"
        label="选状态">
        <template slot-scope="scope">
          <div>{{scope.row.selected ? '已选择' : '未选择'}}</div>
        </template>
      </el-table-column>
      <slot></slot>
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
    select: {
      type: Boolean,
      default: true
    }
  },
}
</script>

<style scoped>

</style>
