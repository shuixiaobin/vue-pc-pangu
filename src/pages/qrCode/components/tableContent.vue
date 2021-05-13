<template>
  <el-table :data="tableData" border>
    <el-table-column
      prop="serviceNum"
      label="服务号"
      align="center"
    />
    <el-table-column
      prop="channelNo"
      width="200px"
      label="渠道编号"
      align="center"
    />
    <el-table-column
      prop="channelName"
      width="150px"
      label="渠道名"
      align="center"
    />
    <el-table-column
      label="二维码"
      width="120px;"
      align="center"
    >
    <template slot-scope="{row}">
      <div>
        <img style="width: 100px; height: 100px;" :src="row.qrCode" alt="">
      </div>
    </template>
    </el-table-column>
    <el-table-column label="状态" align="center">
      <template slot-scope="row">可用</template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="提交时间"
      align="center"
    />
    <el-table-column
      label="操作"
      align="center"
      width="150px"
    >
      <template slot-scope="{row}">
        <div>
          <el-button type="text" @click="edit(row)">编辑</el-button>
          <el-button type="text" @click="remove(row)">删除</el-button>
        </div>
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
  props: ['tableData'],
  methods: {
    edit (data) {
      this.$emit('edit', {...data})
    },
    remove (data) {
      this.$emit('remove', { ...data })
    }
  }
}
</script>