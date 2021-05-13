<template>
  <el-dialog
    title="批量审批失败结果"
    :visible="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <div class="batch-container">
      <div class="title-wrapper">
				<p class="is-success-title">审核结果</p>
        <p class="order-num-title">订单编号</p>
        <p class="reason-title">结果详情</p>
      </div>
      <div
        class="batch-content"
        v-for="(item,index) in batchData"
        :key="index"
      >
				<div class="is-success">{{item.code == 1 ? '成功' : '失败'}}</div>
        <div class="order-num">{{item.orderNum}}</div>
        <div
          class="reason"
          v-html="item.message"
        ></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
        required: true,
      },
      batchData: {
        type: Array,
        default: () => [],
      },
    },

    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false)
      },
    },
  }
</script>
<style lang='less' scoped>
  .batch-container {
    line-height: 2;
    .batch-content,
    .title-wrapper {
      display: flex;
    }
		.is-success-title,
		.is-success {
			width: 80px;
		}
    .order-num,
    .order-num-title {
      width: 200px;
    }
    .reason,
    .reason-title {
			margin-left: 10px;
      flex: 1;
    }
  }
</style>