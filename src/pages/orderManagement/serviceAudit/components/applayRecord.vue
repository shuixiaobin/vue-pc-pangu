<template>
  <el-dialog
    title="订单服务申请记录"
    :visible.sync="isShowApplyRecord"
    :close-on-click-modal="false"
    width="50%"
    @close="isShowApplyRecord = false"
  >
    <el-timeline>
      <el-timeline-item
        :hide-timestamp="true"
        :timestamp="createTimestamp(ardItem.update_time)"
        :color="ardItem.logType==='补退额'?'#f5222d':'#359bf8'"
        v-for="(ardItem, ardIndex) in applayRecordData"
        :key="ardIndex"
        class="timeLine"
      >
        <h3>{{ardItem.logType}}————{{ardItem.resultText}}————{{ardItem.OperTime}}</h3>
        <p>原班ID：{{ardItem.ClassRid}}&#12288;&#12288;原班实收金额：&yen;{{ardItem.MoneyReceipt}}&#12288;&#12288;实退金额：&yen;{{ardItem.turnbackMoney}}&#12288;&#12288;退回方式：{{ardItem.IsMakeSure}}</p>
        <p>原因：{{ardItem.reason}}&#12288;&#12288;备注：{{ardItem.remarkNote}}</p>
      </el-timeline-item>
    </el-timeline>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        size="small"
        @click="isShowApplyRecord = false"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import util from '@/common/util';
  export default {
    data() {
      return {
        isShowApplyRecord: false
      };
    },
    computed: {
      createTimestamp() {
        return data => {
          return util.timeStampDate(data * 1000);
        };
      }
    },
    methods: {
      open() {
        this.isShowApplyRecord = true;
      }
    },
    filters: {
      filterType(val) {
        switch (val) {
          case 'turn':
            return '转班';
            break;
          case 'refund':
            return '退额';
            break;
          case 'compensate':
            return '补额';
            break;
          case 'exit':
            return '退班';
            break;
        }
      },
      filterStatus(val) {
        switch (val) {
          case 1:
            return '申请成功';
            break;
          case 2:
            return '审核成功';
            break;
          case 3:
            return '审核失败';
            break;
        }
      }
    },
    props: {
      applayRecordData: {
        type: Array,
        default: function() {
          return [];
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  .timeLine {
    line-height: 20px;
    h3 {
      font-size: 16px;
      padding-bottom: 5px;
      color: #5f5f5f;
    }
    p {
      font-size: 14px;
      padding: 2px 0;
      color: #5f5f5f;
    }
  }
</style>