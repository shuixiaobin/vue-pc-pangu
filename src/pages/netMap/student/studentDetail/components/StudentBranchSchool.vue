<template>
  <div class="branch-school">
    <div class="container-title">
      <h2>所在分校情况</h2>
    </div>
    <div class="container">
      <div class="school-info_item">
        <div class="school-info">
          <div class="school-info_left">
            <b class="name">浙江分校</b>
            <span class="time">开课时间：2020-09-20</span>
          </div>
          <div class="school-info_right">
            <el-tag
              effect="plain"
            >分校在读</el-tag>
            <el-tag
              effect="plain"
            >分校报班用户</el-tag>
          </div>
        </div>
        <el-row>
          <el-col :span="10">
            商品名称商品名称
          </el-col>
          <el-col :span="10">
            产品名称产品名称
          </el-col>
          <el-col :span="4">
            ¥7,637
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },

    methods: {},
  }
</script>
<style lang='less' scoped>
  .branch-school {
    margin-top: 16px;
    .el-row {
      background: #f5f7fa;
      padding: 16px;
      box-sizing: border-box;
      font-size: 12px;
      font-weight: 400;
      color: #303133;
      line-height: 14px;
      margin-top: 12px;
    }
    .school-info_item {
      padding-bottom: 16px;
      border-bottom: 1px solid #e4e7ed;
      .school-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .school-info_left {
          display: flex;
          flex-direction: column;
          .name {
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            line-height: 14px;
          }
          .time {
            height: 12px;
            font-size: 12px;
            font-weight: 400;
            color: #606266;
            line-height: 12px;
            margin-top: 12px;
          }
        }
      }
    }
  }
</style>