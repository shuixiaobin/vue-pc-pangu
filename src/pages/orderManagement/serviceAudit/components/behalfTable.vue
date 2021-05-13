<template>
  <div>
    <el-table
      v-loading="loading"
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
        prop="OrderNum"
        label="订单编号"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="Title"
        label="课程名称"
        width="300"
      >
      </el-table-column>
      <el-table-column label="审核类型">
        --
      </el-table-column>
      <el-table-column
        prop="IsMakeSure"
        label="审核状态"
      >
      </el-table-column>
      <el-table-column
        prop="netStatus"
        label="课程状态"
      >
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
            <span>{{scope.row.UserName}}</span>
            <span>{{scope.row.Phone}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="AddTime"
        label="下单日期"
      >
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <div class="tableColumnTitle">
            <span>课程原价</span>
            <span>代报金额</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="tableColumnTitle">
            <span>&yen;{{scope.row.MoneyTotal}}</span>
            <span>&yen;{{scope.row.MoneySum}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="代报名原因">
        ---
      </el-table-column>
      <el-table-column
        label="备注"
        width="200"
      >
        <template slot-scope="scope">
          <div class="tableTips">
            {{scope.row.OperRemark}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="OperUser"
        label="操作员"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        header-align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="behalfReviewChange(1,scope.row.OrderID)"
            v-auth="'RSS_PASS'"
          >通过</el-button>
          <el-button
            type="text"
            size="small"
            @click="behalfReviewChange(2,scope.row.OrderID)"
            v-auth="'RSS_CANCEL'"
          >驳回</el-button>
          <el-button
            type="text"
            size="small"
            class="warning"
            @click="cancelRecord(scope.row.OrderID)"
            v-auth="'RSS_CANCEL_APPLI'"
          >撤销申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <applyRecord ref="applyRecord" />
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import applyRecord from './applayRecord';
  import TelSHowHid from '../../components/telShowHide';
  import { behalfReviewChange, behalfReviewRevoke } from '@/api/orderManage';
  export default {
    data() {
      return {};
    },
    components: {
      applyRecord,
      TelSHowHid
    },
    computed: {
      ...mapState(['username'])
    },
    props: {
      tableData: {
        type: Array,
        default: function() {
          return [];
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      behalfReviewChange(mark, orderId) {
        behalfReviewChange({
          mark, //1通过 2驳回
          orderId, //订单id
          status: 1, //默认传1
          operUser: this.username //操作人
        })
          .then(res => {
            if (res.code == 10000) {
              this.$message.success(mark ? '审核已通过' : '审核已驳回');
              this.$emit('refresh');
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      cancelRecord(orderId) {
        this.$confirm('确定要撤销申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            behalfReviewRevoke({
              orderId,
              operUser: this.username //操作人
            })
              .then(res => {
                if (res.code == 10000) {
                  this.$message.success('撤销成功！');
                  this.$emit('refresh');
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message.info('已取消删除');
          });
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
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .warning {
    color: @error;
  }
</style>