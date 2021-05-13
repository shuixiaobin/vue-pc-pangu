<template>
  <div class="label-content">
    <div class="label-content_header">
      {{labelDetail.name || '--'}}
      <el-button
        size="small"
        v-if="labelDetail.name"
        @click="handleEdit"
      >编辑标签</el-button>
    </div>
    <div class="label-detail">
      <div class="label-item">
        <span class="label-name">标签ID：</span>
        <span class="label-value">{{labelDetail.id || '--'}}</span>
      </div>
      <div class="label-item">
        <span class="label-name">创建日期：</span>
        <span class="label-value">{{labelDetail.created_at || '--'}}</span>
      </div>
      <div class="label-item">
        <span class="label-name">创建人：</span>
        <span class="label-value">{{labelDetail.founder || '--'}}</span>
      </div>
      <div class="label-item">
        <span class="label-name">编辑人：</span>
        <span class="label-value">{{labelDetail.editor || '--'}}</span>
      </div>
      <div class="label-item">
        <span class="label-name">考试类型：</span>
        <span class="label-value">{{labelDetail.exam_type || '--'}}</span>
      </div>
      <div class="label-item">
        <span class="label-name">用户数量：</span>
        <span class="label-value">{{labelDetail.user_num || '--'}}</span>
      </div>
      <div class="label-item">
        <span class="label-name">标签备注：</span>
        <span class="label-value">{{labelDetail.remarks || '--'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      labelDetail: {
        type: Object,
        default: () => ({}),
      },
    },
    methods: {
      handleEdit() {
        this.$emit('showDialog',{type: 'edit'})
      }
    },
  }
</script>
<style lang='less' scoped>
  .label-content {
    border-left: 1px solid #e4e7ed;
    .label-content_header {
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      padding: 0 16px;
      background: #f5f7fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
    }
    .label-detail {
      padding: 20px 16px;
      box-sizing: border-box;
      .label-item {
        display: flex;
        align-items: flex-start;
        margin: 20px 0;
        &:first-child {
          margin-top: 0;
        }
        span {
          display: inline-block;
          font-size: 14px;
        }
        .label-name {
          color: #606266;
        }
        .label-value {
          color: #303133;
          flex: 1;
        }
      }
    }
  }
</style>