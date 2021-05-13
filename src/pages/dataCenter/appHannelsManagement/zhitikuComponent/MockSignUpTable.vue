<template>
   <el-table :data="tableData">
    <el-table-column prop="name" label="模考名称" align="center" />
    <el-table-column prop="catgoryName" label="考试类型" align="center" />
    <el-table-column prop="subjectIdName" label="科目" align="center" />
    <el-table-column prop="number" label="报名人数" align="center" />
    <el-table-column prop="registerTimeStr" label="学员信息" align="center">
      <template slot-scope="{row}">
        <el-button v-auth="'MOCK_DOWNLOAD'" type="text" :disabled="row.disableDownload == 1" @click="handleDonwload(row)">
          下载
        </el-button>
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
    tableData: Array
  },
  methods: {
    handleDonwload (row) {
      window.open(`${BASEURL}/pand/wechat/export/mock/getUserEnrollList?recordIds=${row.recordIds}&id=${row.id}`)
    },
  },
}
</script>

<style scoped>

</style>
