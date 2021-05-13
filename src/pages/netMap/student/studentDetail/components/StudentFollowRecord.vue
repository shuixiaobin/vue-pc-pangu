<template>
  <div class="follow-record">
    <div class="container-title">
      <h2>跟进记录
        <span
          class="no-data"
          v-if="listData.length === 0"
        >暂无跟进记录</span>
      </h2>
      <el-button
        size="small"
        type="primary"
        @click="visibleDialog=true"
      >添加</el-button>
    </div>
    <div
      class="container"
      v-if="listData.length > 0"
    >
      <div
        class="follow-record_item"
        v-for="(item, index) in listData"
        :key="index"
      >
        <div class="title">
          <h3>{{item.operator}}【{{item.departmentName}}-{{item.roleName}}_{{item.realName}}】</h3>
          <span class="date">{{item.thisCallDate}}</span>
        </div>
        <div class="record-content">
          <div class="desc">
            <el-tag
              style="margin-right:8px"
              effect="plain"
              size="small"
              type="success"
            >{{item.followStatus}}</el-tag>{{item.classInfo}}, {{item.consultationCont}}
            <div class="record-type">
              <span>{{item.exam}}-{{item.province}}-{{item.examType}}-{{item.consulPass}}</span>
              <span>回访时间：{{item.nextDate}}</span>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        style="display:flex;justify-content: center;margin-top: 20px;"
        layout="prev, pager, next"
        :total="total"
        :pageSize="pageSize"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <student-follow-record-dialog
      v-if="visibleDialog"
      :visibleDialog.sync="visibleDialog"
      @updateList="updateList"
    />
  </div>
</template>

<script>
  import { getFollowRecordList } from '@/api/netMap'
  import StudentFollowRecordDialog from './StudentFollowRecordDialog'
  import { pageMixin } from '../pageMixins'
  export default {
    mixins: [pageMixin],
    components: {
      StudentFollowRecordDialog,
    },
    data() {
      return {
        visibleDialog: false,
        userName: this.$route.query.userName,
        userMobile: this.$route.query.userMobile,
      }
    },
    methods: {
      updateList() {
        this.getListData()
      },
      async getListData() {
        try {
          const { data } = await getFollowRecordList({
            mobile: this.userMobile,
            userName: this.userName,
            page: this.page,
            pageSize: this.pageSize,
          })
          this.listData = Object.freeze(data.data) || []
          this.total = data.total
        } catch (err) {}
      },
    },
  }
</script>
<style lang='less' scoped>
  .follow-record {
    margin-top: 16px;
    background: #fff;
    .no-data {
      margin-left: 24px;
      height: 14px;
      font-size: 14px;
      font-weight: 500;
      color: #c0c4cc;
      line-height: 14px;
    }
    .follow-record_item {
      background: #ffffff;
      box-shadow: 0px -1px 0px 0px #ebeef5;
      border-radius: 2px;
      border: 1px solid #ebeef5;
      .title {
        height: 39px;
        padding: 0 15px;
        box-sizing: border-box;
        background: #f5f7fa;
        border-radius: 1px 1px 0px 0px;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        h3 {
          font-weight: 500;
          color: #303133;
        }
        .date {
          font-weight: 400;
          color: #606266;
        }
      }
      .record-content {
        padding: 16px;
        .desc {
          font-size: 14px;
          color: #303133;
          line-height: 22px;
        }
      }
      .record-type {
        margin-top: 16px;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #909399;
        line-height: 14px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>