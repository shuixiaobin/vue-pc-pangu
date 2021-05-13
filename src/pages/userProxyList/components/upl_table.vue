<template>
  <div class="tableBox">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="orderNum"
        label="订单编号"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        prop="classTitle"
        label="课程名称"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        label="被代报用户名"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        prop="moneyReceipt"
        label="收到金额"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createdDate"
        label="下单日期"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="订单状态"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        prop="agentName"
        label="代报用户名"
        align="center"
        header-align="center"
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    props: {
      tableData: {
        type: Array,
        default: function() {
          return []
        }
      }
    }
  }
</script>