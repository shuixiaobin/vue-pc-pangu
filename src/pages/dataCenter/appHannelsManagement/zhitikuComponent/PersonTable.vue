<template>
  <el-table :data="tableData">
    <el-table-column prop="provinceSchoolName" label="省级分校" width="120" align="center" />
    <el-table-column prop="citySchoolName" label="地市分校" width="180" align="center" />
    <el-table-column prop="studyCentreName" label="学习中心" width="180" align="center" />
    <el-table-column prop="promoterName" label="推广员" width="120" align="center" />
    <el-table-column prop="promoterMobile" label="推广员手机号" width="150" align="center" />
    <el-table-column prop="registerCount" label="注册人数" align="center">
      <template slot-scope="{row}">
        <el-button @click="handleNumClick(row, 1)" type="text">{{row.registerCount}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="downloadCount" label="下载APP人数" width="150" align="center">
      <template slot-scope="{row}">
        <el-button @click="handleNumClick(row, 2)" type="text">{{row.downloadCount}}</el-button>
      </template>

    </el-table-column>
    <el-table-column v-if="!hideOperate" prop="date" label="二维码" width="80" align="center">
      <template slot-scope="{row}">
        <el-button @click="handleDownload(row)" type="text">下载</el-button>
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
export default {
  props: {
    tableData: Array,
    hideOperate: Boolean,
  },
  methods: {
    handleDownload (row) {
      this.$emit('download', row)
    },
    handleNumClick (row, type) {
      this.$emit('numClick', {
        row,
        type,
      })
    },
  }
}
</script>

<style scoped>

</style>
