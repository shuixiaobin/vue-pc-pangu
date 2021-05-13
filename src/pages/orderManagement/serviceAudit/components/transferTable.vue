<template>
  <div>
    <el-table
      :data="tableData"
      border
      class="mt20"
    >
      <el-table-column
        fixed
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="OrderID"
        label="订单ID"
      >
      </el-table-column>
      <el-table-column width="300">
        <template slot="header">
          <div class="tableColumnTitle">
            <span>原课程名称</span>
            <span>新课程名称</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="tableColumnTitle">
            <span>{{scope.row.title}}</span>
            <span>新课程名称</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核类型">
        转班
      </el-table-column>
      <el-table-column
        label="审核状态"
      >
        <template slot-scope="scope">
          {{scope.row.IsMakeSure | TurnBackStautsFilters}}
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template slot="header">
          <div class="tableColumnTitle">
            <span>用户名</span>
            <span>手机号</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="tableColumnTitle">
            <span>{{scope.row.username}}</span>
            <telSHowHid :tel="scope.row.Phone" />
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template slot="header">
          <div class="tableColumnTitle">
            <span>付款日期</span>
            <span>转班日期</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="tableColumnTitle">
            <span>{{scope.row.paydate}}</span>
            <span>{{scope.row.StatusDate}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template slot="header">
          <div class="tableColumnTitle">
            <span>课程原价</span>
            <span>代报金额</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="tableColumnTitle">
            <span>&yen;{{scope.row.reveivePrice}}</span>
            <span>代报金额</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="province"
        label="转班金额"
      >
      </el-table-column>
      <el-table-column
        prop="province"
        label="转班状态"
      >
      </el-table-column>
      <el-table-column
        label="开班类型"
      >
       -
      </el-table-column>
      <el-table-column
        prop="province"
        label="转班原因"
      >
      </el-table-column>
      <el-table-column
        label="转班备注"
        width="200"
      >
        <template slot-scope="scope">
          <div class="tableTips">
            {{scope.row.remark}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="退款方式"
      >
      </el-table-column>
      <el-table-column
        prop="OptUser"
        label="操作员"
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
          >申请记录</el-button>
          <el-button
            type="text"
            size="small"
            @click="operation(scope.row.OrderID,1)"
          >通过</el-button>
          <el-button
            type="text"
            size="small"
            @click="operation(scope.row.OrderID,0)"
          >驳回</el-button>
          <el-button
            type="text"
            size="small"
            class="warning"
            @click="cancelRecord"
          >撤销申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <applyRecord ref="applyRecord" />
    <cancelRecord ref="cancelRecord" />
  </div>
</template>
<script>
  import applyRecord from './applayRecord';
  import cancelRecord from './cancelRecord';
  import telSHowHid from '../../components/telShowHide';
  import { getAuditRequestRecord, orderAudit } from '@/api/orderManage';
  export default {
    data() {
      return {};
    },
    components: {
      applyRecord,
      cancelRecord,
      telSHowHid
    },
    props: {
      tableData: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    methods: {
      applyRecord(row) {
        getAuditRequestRecord({
          order_id: row.OrderID
        })
          .then(res => {
            if (res.code == 10000) {
              this.applayRecordData = res.data;
              this.$refs.applyRecord.open();
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      operation(OrderID, val) {
        orderAudit({
          order_id: OrderID,
          do_type: 'turn',
          auth_type: val
        })
          .then(res => {
            if (res.code == 1000) {
              this.$message.success(val ? '审核已通过' : '审核已驳回');
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      cancelRecord(row) {
        this.$refs.cancelRecord.open();
      }
    },
    filters:{
      TurnBackStautsFilters(val) {
        switch (val) {
          case 0:
            return '已填写';
            break;
          case 1:
            return 'OA已提交';
            break;
          case 2:
            return '已退款';
            break;
          case 3:
            return '退款失败';
            break;
          default:
            return '未退款';
        }
      }      
    }
  };
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
  }
  .warning {
    color: @error;
  }
</style>