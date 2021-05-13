<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
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
        label="课程ID"
        prop="id"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="课程名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        width="100"
        label="课程状态">
      </el-table-column>
      <el-table-column
        prop="createDate"
        width="200"
        align="center"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="actualPrice"
        align="center"
        width="100"
        label="实际价格">
      </el-table-column>
      <el-table-column
        v-if="!hideOutline"
        prop="syllabusHierarchy"
        align="center"
        width="100"
        label="大纲类型">
      </el-table-column>
      <el-table-column
        prop="selected"
        align="center"
        width="100"
        label="选状态">
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
    tableData: {
      type: Array,
      default () {
        return []
      },
    },
    hideOutline: Boolean,
    select: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
}
</script>

<style scoped>

</style>
