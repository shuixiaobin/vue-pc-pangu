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

          <table-row-button v-auth="auth.DETAIL"
            type="text"
            @click="toCopy(row.activityId)"
            >复制</table-row-button
          >

          <table-row-button
            v-if="deleteVisible(row)"
            v-auth="auth.DELETE"
            type="text"
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
import ActivityTable from '../components/ActivityTable';
import ActivityTableBar from '../components/ActivityTableBar';
import TableRowButton from '@/components/Table/TableRowButton'
import {
  getDiscountActivityList,
  setDiscountActivityOnline,
  setDiscountActivityOffline,
  delDiscountActivity,
  delDiscountActivityBatch,
} from '@/api/activityManage';
import { activityIndexMixin } from '../mixins';
import { page } from '@/common/mixins';

const XhrFunMap = {
  getList: getDiscountActivityList,
  online: setDiscountActivityOnline,
  offline: setDiscountActivityOffline,
  delete: delDiscountActivity,
  deleteBatch: delDiscountActivityBatch,
};

export default {
  components: {
    ActivitySearch,
    ActivityTable,
    ActivityTableBar,
    TableRowButton,
  },

  mixins: [page, activityIndexMixin],
  data() {
    const auth = {
      ADD: 'DA_ADD',
      EDIT: 'DA_EDIT',
      FIND: 'DA_FIND',
      DETAIL: 'DA_DETAIL',
      DELETE: 'DA_DELETE',
      ONLINE: 'DA_ONLINE',
      OFFLINE: 'DA_OFFLINE',
      BATCH_DELETE: 'DA_BATCH_DELETE',
      BATCH_ONLINE: 'DA_BATCH_ONLINE',
      BATCH_OFFLINE: 'DA_BATCH_OFFLINE'
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