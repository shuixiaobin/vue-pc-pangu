<template>
  <el-dialog width="1000px" :visible.sync="dialogVisible" :before-close="hide">

    <el-table :data="tableData" border>
      <el-table-column prop="all" label="总订单量（个）" align="center" />
      <el-table-column prop="paySuccess" label="已支付订单量（个）" align="center" />
      <!-- <el-table-column prop="rate" label="订单支付转化率（%）" align="center" /> -->
      <el-table-column prop="total" label="订单总金额（元）" align="center" />
      <el-table-column prop="receiveMoney" label="实收金额（元）" align="center" />
      <el-table-column prop="new" label="新用户数（人）" align="center" />
      <el-table-column prop="old" label="老用户数（人）" align="center" />
      <el-table-column prop="beginCollage" label="开团数（个）" align="center" />
      <el-table-column prop="successCollage" label="成团数（个）" align="center" />
      <el-table-column prop="collagePeople" label="团员数（人）" align="center" />
    </el-table>
  </el-dialog>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getEffect } from '@/api/assemble.js'
export default {
  data () {
    return {
      dialogVisible: false,
      tableData: [],
    }
  },
  methods: {
    hide () {
      this.tableData = []
      this.dialogVisible = false
    },
    showData (id) {
      this.dialogVisible = true
      getEffect(id).then(res => {
        if (res.code !== 10000) {
          throw new Error(res.msg)
        }
				if(res.data){
					this.tableData = [res.data]
				}
      }).catch(e => {
        this.$message.error(e.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
