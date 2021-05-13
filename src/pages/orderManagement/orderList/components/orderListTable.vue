<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    border
    style="width: 100%"
  >
    <el-table-column
      fixed
      prop="ordernum"
      label="订单编号"
      align="center"
      header-align="center"
      width="200"
    >
    </el-table-column>
    <el-table-column
      prop="Title"
      label="课程名称"
      align="center"
      header-align="center"
      width="300"
    >
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名"
      align="center"
      header-align="center"
      width="200"
    >
    </el-table-column>
    <el-table-column
      label="课程价格"
      align="center"
      header-align="center"
    >
      <template slot-scope="scope">
        &yen;{{scope.row.ActualPrice}}
      </template>
    </el-table-column>
    <el-table-column
      prop="address"
      label="收到金额"
      align="center"
      header-align="center"
    >
      <template slot-scope="scope">
        &yen;{{scope.row.moneyreceipt}}
      </template>
    </el-table-column>
    <el-table-column
      prop="status2"
      label="课程状态"
      align="center"
      header-align="center"
    >
      <template slot-scope="scope">
        {{scope.row.status2 | courseStatus}}
      </template>
    </el-table-column>
    <el-table-column
      prop="addtime"
      label="下单时间"
      align="center"
      header-align="center"
    >
    </el-table-column>
    <el-table-column
      prop="paydate"
      label="付款时间"
      align="center"
      header-align="center"
    >
    </el-table-column>
    <el-table-column
      label="订单状态"
      align="center"
      header-align="center"
    >
      <template slot-scope="scope">
        {{scope.row.status | orderStatus}}
      </template>
    </el-table-column>
    <el-table-column
      label="支付方式"
      align="center"
      header-align="center"
    >
      <template slot-scope="scope">
        {{ paymentTypeFilters(scope.row.paymenttype)}}
      </template>
    </el-table-column>
    <el-table-column
      prop="operuser"
      label="操作人"
      align="center"
      header-align="center"
    >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100"
      align="center"
      header-align="center"
    >
      <template slot-scope="scope">
        <el-button
          @click="look(scope.row)"
          type="text"
          size="small"
          v-auth="'OL_DETAIL'"
        >查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    data() {
      return {};
    },
    props: {
      tableData: {
        type: Array,
        default: function() {
          return [];
        }
      },
      paymentType: {
        type: Object,
        default: function() {
          return {};
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      paymentTypeFilters(num) {
        return num => {
          let str = '';
          Object.keys(this.paymentType).forEach(key => {
            if (this.paymentType[key].id == num) {
              str = this.paymentType[key].name;
            }
          });
          return str;
        };
      }
    },
    filters: {
      courseStatus(val) {
        switch (val) {
          case '1':
            return '正常';
            break;
          case '2':
            return '退班';
            break;
          case '3':
          case '5':
            return '转班';
            break;
          default:
            return '删除';
        }
      },
      orderStatus(val) {
        switch (val) {
          case '0':
            return '未处理';
            break;
          case '1':
            return '已查看';
            break;
          case '2':
            return '已到账';
            break;
          case '6':
            return '已取消';
            break;
          case '7':
            return '重复';
            break;
          case '8':
            return '保过已通过';
            break;
          case '9':
            return '保过未通过';
            break;
          case '10':
            return '待用户确认';
            break;
          case '11':
          case '12':
            return '代报名审核';
            break;
          case '13':
            return '转退班审核';
            break;
          default:
            return '删除';
        }
      }
    },
    methods: {
      look(row) {
        this.$router.push({ path: 'orderInfo', query: { OrderID: row.OrderID } });
      }
    }
  };
</script>