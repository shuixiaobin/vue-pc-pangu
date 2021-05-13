<template>
  <div class="student-order_table">
    <el-table
      :data="listData"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        width="350"
        fixed
      >
        <template slot="header">
          订单编号 <br>
          课程名称
        </template>
        <template slot-scope="scope">
          <p>订单：{{scope.row.orderNum}}</p>
          <p
            class="ellipsis"
            :title="scope.row.title"
          >{{scope.row.title}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        width="200"
      >
        <template slot="header">
          下单日期 <br />
          付款日期
        </template>
        <template slot-scope="scope">
          <p>{{scope.row.addTime}}</p>
          <p>{{scope.row.payDate}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address">
        <template slot="header">
          订单金额 <br />
          实收金额
        </template>
        <template slot-scope="scope">
          <p>{{scope.row.totalMoney}}</p>
          <p>{{scope.row.receipt}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        width="100"
      >
        <template slot="header">
          支付状态 <br />
          订单状态
        </template>
        <template slot-scope="scope">
          <p>{{scope.row.payStatus}}</p>
          <p>{{scope.row.orderStatus}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="订单备注"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="200"
      >
        <template slot="header">
          转退班时间 <br />
          转退班金额
        </template>
        <template slot-scope="scope">
          <p>{{scope.row.statusDate}}</p>
          <p>{{scope.row.turnbackMoney}}</p>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        prop="turnRemark"
        label="转退班备注"
      >
      </el-table-column>
      <el-table-column
        prop="refundType"
        label="退款方式"
      >
      </el-table-column>
      <el-table-column
        prop="operate"
        label="操作员"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      listData: {
        type: Array,
        default: () => [],
      },
    },
  }
</script>
<style lang='less' scoped>
  .ellipsis {
    width: 320px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  p {
    height: 30px;
    line-height: 30px;
  }
</style>