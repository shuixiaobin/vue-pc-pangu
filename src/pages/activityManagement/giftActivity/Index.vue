<template>
  <div>
    <MenuTitle> </MenuTitle>
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
        @selection-change="selection = $event"
        @sort-change="onSortChange"
      >
        <template #handle="{ row }">
          <!-- 只有未上线活动可编辑 -->
          <table-row-button
            v-if="editVisible(row)"
            type="text"
            v-auth="auth.EDIT"
            @click="toEdit(row.activityId)"
            >编辑</table-row-button
          >
          <table-row-button
            v-if="viewVisible(row)"
            type="text"
            v-auth="auth.DETAIL"
            @click="toView(row.activityId)"
            >查看</table-row-button
          >

          <table-row-button
            v-if="onlineVisible(row)"
            type="text"
            v-auth="auth.ONLINE"
            @click="activityOnline([row.activityId], row)"
            >上线</table-row-button
          >
          <table-row-button
            v-if="offlineVisible(row)"
            type="text"
            v-auth="auth.OFFLINE"
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
            type="text"
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
import ActivityTable from '../components/ActivityTable';
import ActivityTableBar from '../components/ActivityTableBar';
import TableRowButton from '@/components/Table/TableRowButton'

import {
  getGiftActivityList,
  setGiftActivityOnline,
  setGiftActivityOffline,
  delGiftActivity,
  delGiftActivityBatch,
} from '@/api/activityManage';
import { activityIndexMixin } from '../mixins';
import { page } from '@/common/mixins';

const XhrFunMap = {
  getList: getGiftActivityList,
  online: setGiftActivityOnline,
  offline: setGiftActivityOffline,
  delete: delGiftActivity,
  deleteBatch: delGiftActivityBatch,
};

export default {
  components: {
    ActivitySearch,
    ActivityTable,
    ActivityTableBar,
    TableRowButton
  },
  mixins: [page, activityIndexMixin],
  data () {
    const auth = {
      ADD: 'GA_ADD',
      EDIT: 'GA_EDIT',
      FIND: 'GA_FIND',
      DETAIL: 'GA_DETAIL',
      DELETE: 'GA_DELETE',
      ONLINE: 'GA_ONLINE',
      OFFLINE: 'GA_OFFLINE',
      BATCH_DELETE: 'GA_BATCH_DELETE',
      BATCH_ONLINE: 'GA_BATCH_ONLINE',
      BATCH_OFFLINE: 'GA_BATCH_OFFLINE'
    }
    return {
      auth
    }
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