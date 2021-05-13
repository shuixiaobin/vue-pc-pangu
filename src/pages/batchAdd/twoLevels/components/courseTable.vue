<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        align="center"
        label="课程ID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="套餐名称">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作（添加操作有延迟，如未加上请稍后刷新）"
        width="350">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">去调整大纲顺序</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
export default {
  props: ['tableData'],
  data () {
    return {
    }
  },
  methods: {
    handleClick (data) {
      const href = `/NetClass/NetClass/getSyllabusIndex?netClassId=${data.id}&isSuit=${data.isSuit}&isMianKu=${data.isMianKu}&title=${data.name}`
      window.open(href, '_blank')
    }
  }
}
</script>

<style scoped>

</style>
