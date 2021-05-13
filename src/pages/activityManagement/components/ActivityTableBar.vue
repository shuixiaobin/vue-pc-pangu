<template functional>
  <div class="activity-table-bar">
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="small"
      v-auth="data.attrs.auth.ADD"
      @click="listeners.add"
    >
      新建
    </el-button>
    <el-button
      size="small"
      v-auth="data.attrs.auth.BATCH_DELETE"
      @click="listeners.batchDelete"
    >
      批量删除
    </el-button>
    <el-button
      size="small"
      v-auth="data.attrs.auth.BATCH_ONLINE"
      @click="listeners.batchOnline"
    >
      批量上线
    </el-button>
    <el-button
      size="small"
      v-auth="data.attrs.auth.BATCH_OFFLINE"
      @click="listeners.batchOffline"
    >
      批量下线
    </el-button>
    <slot/>
  </div>
</template>
<style scoped>
.activity-table-bar {
  margin-bottom: 16px;
  text-align: right;
}
</style>