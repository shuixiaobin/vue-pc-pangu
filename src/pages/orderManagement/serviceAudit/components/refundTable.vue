<template>
  <div>
    <el-table
      :data="tableData"
      border
      class="mt20"
      @selection-change="handleSelectionChange">
    >
      <el-table-column
        fixed
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="OrderNum"
        label="订单编号"
      >
      </el-table-column>
      <el-table-column
        prop="Title"
        label="课程名称"
        width="300"
      >
      </el-table-column>
      <el-table-column
        label="审核类型"
        prop="auditType"
      >
      </el-table-column>
      <el-table-column width="180">
        <template slot="header">
          <div class="tableColumnTitle">
            <span>用户名</span>
            <span>手机号</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="tableColumnTitle">
            <span>{{scope.row.UserName}}</span>
            <telSHowHid :tel="scope.row.Phone" />
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template slot="header">
          <div class="tableColumnTitle">
            <span>付款日期</span>
            <span>补退额日期</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="tableColumnTitle">
            <span>{{scope.row.PayDate}}</span>
            <span>{{scope.row.serviceDate}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <div class="tableColumnTitle">
            <span>实收金额</span>
            <span>补退额金额</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="tableColumnTitle">
            <span>{{scope.row.MoneyReceipt}}</span>
            <span>{{scope.row.turnbackMoney}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        label="补退额状态"
      >
      </el-table-column>
      <el-table-column
        prop="reason"
        label="补退额原因"
      >
      </el-table-column>
      <el-table-column
        prop="remarkNote"
        label="补退额备注"
        width="200"
      >
        <template slot-scope="scope">
          <div
            class="tableTips"
            v-html="scope.row.OperRemark"
          >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="IsMakeSure"
        label="补退额方式"
      >
      </el-table-column>
      <el-table-column
        prop="OperUser"
        label="操作员"
        width="180"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            @click="applyRecord(scope.row)"
            type="text"
            size="small"
            v-auth="'BTES_APPLI_RECORD'"
          >申请记录</el-button>
          <el-button
            type="text"
            size="small"
            v-auth="'BTES_PASS'"
            @click="handleThrough(scope.row)"
          >通过</el-button>
          <el-button
            type="text"
            size="small"
            v-auth="'BTES_CANCEL'"
            @click="handleReject(scope.row)"
          >驳回</el-button>
          <el-button
            type="text"
            size="small"
            class="warning"
            v-auth="'BTES_CANCEL_APPLI'"
            @click="handleReject(scope.row)"
          >撤销申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <applyRecord
      ref="applyRecord"
      :applay-record-data="applayRecordData"
    />
    <cancelRecord ref="cancelRecord" />
  </div>
</template>
<script>
  import applyRecord from './applayRecord'
  import cancelRecord from './cancelRecord'
  import telSHowHid from '../../components/telShowHide'
  import { getCheckLog, setReject, setOrderThrough } from '@/api/orderManage'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        applayRecordData: [],
      }
    },
    components: {
      applyRecord,
      cancelRecord,
      telSHowHid,
    },
    props: {
      tableData: {
        type: Array,
        default: function () {
          return []
        },
      },
    },
    computed: {
      ...mapState(['username'])
    },
    methods: {
      applyRecord(row) {
        getCheckLog({
          orderNo: row.OrderNum,
        })
          .then(res => {
            if (res.code == 10000) {
              if (res.data.length !== 0) {
                this.applayRecordData = res.data
                this.$refs.applyRecord.open()
              }
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      handleThrough(row) {
        setOrderThrough({
          itemId: row.itemID,
          operUser: this.username, //操作人
        })
          .then(res => {
            if (res.code === 10000 && res.data[0].code === 1) {
              this.$message.success(res.data[0].message)
              this.$emit('refresh')
            } else {
              this.$message.error(res.data[0].message)
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      handleReject(row) {
        setReject({
          itemid: row.itemID, //订单课程记录编号
          ordernum: row.OrderNum, //订单编号
          title: row.Title, //课程名称
          type: 0, //类型
          remark: row.remarkNote, //备注
          operUser: this.username, //操作人
        })
          .then(res => {
            if (res.code === 10000 && res.data.result === 1) {
              this.$message.success(res.data.message)
              this.$emit('refresh')
            } else {
              this.$message.warning(res.data.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      cancelRecord(row) {
        this.$refs.cancelRecord.open()
      },
      handleSelectionChange(val) {
        this.$emit('selectedData', val)
      }
    },
  }
</script>
<style lang="less" scoped>
  @import '../../../../assets/css/theme-color.less';
  .tableColumnTitle {
    span {
      display: block;
      font-weight: 500;
      color: #909399;
      line-height: 30px;
      &:last-child {
        border-top: 1px solid #ccc;
      }
    }
  }
  .tableTips {
    height: 50px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .warning {
    color: @error;
  }
</style>