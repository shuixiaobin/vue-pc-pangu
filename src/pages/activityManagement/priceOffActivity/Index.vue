<template>
  <div>
    <MenuTitle />
    <ActivitySearch ref="search" v-auth="auth.FIND" @search="getList" />
    <div class="container-Box mt16 minHeight">
      <ActivityTableBar
        :auth="auth"
        @add="toActivityAdd"
        @batchDelete="activityDelete(selection)"
        @batchOnline="activityOnline(selectionIds)"
        @batchOffline="activityOffline(selectionIds)"
      />
      <ActivityTable
        ref="table"
        :tableData="tableData"
        :loading="loading"
        :propMap="propMap"
        @selection-change="selection = $event"
        @sort-change="onSortChange"
      >
        <template #handle="{ row }">
          <!-- 只有未上线活动可编辑 -->
          <table-row-button
            v-if="editVisible(row)"
            v-auth="auth.EDIT"
            type="text"
            @click="toEdit(row.activityId)"
            >编辑</table-row-button
          >
          <table-row-button
            v-if="viewVisible(row)"
            v-auth="auth.DETAIL"
            type="text"
            @click="toView(row.activityId)"
            >查看</table-row-button
          >

          <table-row-button
            v-if="onlineVisible(row)"
            v-auth="auth.ONLINE"
            type="text"
            @click="activityOnline([row.activityId], row)"
            >上线</table-row-button
          >
          <table-row-button
            v-if="offlineVisible(row)"
            v-auth="auth.OFFLINE"
            type="text"
            @click="activityOffline([row.activityId], row)"
            >下线</table-row-button
          >

          <table-row-button
            v-auth="auth.DETAIL"
            type="text"
            @click="toCopy(row.activityId)"
            >复制</table-row-button
          >
          <table-row-button
            v-if="deleteVisible(row)"
            v-auth="auth.DELETE"
            @click="activityDelete([row])"
            >删除</table-row-button
          >
        </template>
      </ActivityTable>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="container-pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import ActivitySearch from '../components/ActivitySearch';
import ActivityTableBar from '../components/ActivityTableBar';
import ActivityTable from '../components/ActivityTable';
import TableRowButton from '@/components/Table/TableRowButton'
import {
  getPriceOffActivityList,
  setPriceOffActivityOnline,
  setPriceOffActivityOffline,
  delPriceOffActivity,
  delPriceOffActivityBatch,
} from '@/api/activityManage';
import { activityIndexMixin } from '../mixins';
import { page } from '@/common/mixins';

const XhrFunMap = {
  getList: getPriceOffActivityList,
  online: setPriceOffActivityOnline,
  offline: setPriceOffActivityOffline,
  delete: delPriceOffActivity,
  deleteBatch: delPriceOffActivityBatch,
};

export default {
  components: {
    ActivitySearch,
    ActivityTableBar,
    ActivityTable,
    TableRowButton
  },

  mixins: [page, activityIndexMixin],
  data() {
    const auth = {
      ADD: 'POA_ADD',
      EDIT: 'POA_EDIT',
      FIND: 'POA_FIND',
      DETAIL: 'POA_DETAIL',
      DELETE: 'POA_DELETE',
      ONLINE: 'POA_ONLINE',
      OFFLINE: 'POA_OFFLINE',
      BATCH_DELETE: 'POA_BATCH_DELETE',
      BATCH_ONLINE: 'POA_BATCH_ONLINE',
      BATCH_OFFLINE: 'POA_BATCH_OFFLINE'
    }
    return {
      auth,
      propMap: {
        activityId: 'rid',
        activityName: 'Title',
        startTime: 'StartTime',
        endTime: 'EndTime',
        createTime: 'createtime',
        activityStatus: 'status',
        createUser: 'optname',
      },
    };
  },
  methods: {
    getXhrFun(type) {
      if (XhrFunMap[type]) {
        return XhrFunMap[type];
      } else {
        throw Error('缺少请求方法');
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>