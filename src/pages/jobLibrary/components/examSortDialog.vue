<template>
  <el-dialog
    title="考试类型排序"
    :visible="true"
    width="50%"
    :show-close="false"
  >
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column label="序号" width="100">
        <template slot-scope="{$index}">
          {{1 + $index}}
        </template>
      </el-table-column>
      <el-table-column
        prop="examTypeName"
        align="center"
        label="考试类型"
        width="180">
      </el-table-column>
      <el-table-column
        label="排序">
        <template slot-scope="{row}">
          <el-input type="tel" v-model="row.priority"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getSortList, saveSortList } from '../api'
export default {
  data () {
    return {
      tableData: [],
    }
  },
  created () {
    this.getList()
  },
  methods: {
    renderIndexHeader (h) {
      return h('div', '序号')
    },
    getList () {
      getSortList().then(res => {
        this.tableData = res.data
      }).catch(e => this.$message.error(e.message))
    },
    close () {
      this.$emit('update:dialogVisible', false)
    },
    confirm () {
      saveSortList(this.tableData).then(res => {
        this.$message.success('操作成功')
        this.close()
      }).catch(e => this.$message.error(e.message))
    },
  }
}
</script>

<style scoped>

</style>
