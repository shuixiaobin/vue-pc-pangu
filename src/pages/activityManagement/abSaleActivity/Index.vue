<template>
  <div>
    <MenuTitle/>
    <ActivitySearch ref="search" v-auth="auth.FIND" @search="getList" />
    <div class="container-Box mt16 minHeight">
      <ActivityTableBar
        :auth="auth"
        @add="toActivityAdd"
        @batchDelete="activityDelete(selection)"
        @batchOnline="activityOnline(selectionIds)"
        @batchOffline="activityOffline(selectionIds)"
      >
        <el-button size="small" v-auth="auth.BATCH_IMPORT"
           @click="openImportDialog">
          批量导入
        </el-button>
      </ActivityTableBar>
      <ActivityTable
        ref="table"
        :tableData="tableData"
        :loading="loading"
        :propMap="propMap"
        @selection-change="selection = $event"
        @sort-change="onSortChange"
      >
        <template #column>
          <el-table-column prop="activityName"
            label="活动名称"
            width="400">
            <template #default="{ row }">
              购
              <a :href="getClassUrl(row.classA)" target="_blank" class="el-button--text">{{row.classA}}</a>
              后，
              <a :href="getClassUrl(row.classB)" target="_blank" class="el-button--text">{{row.classB}}</a>
              {{getActivityName(row)}}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="活动方式">
            <template #default="{ row }">
              {{row.type == 1 ? '打折' : '直降'}}
            </template>
          </el-table-column>
        </template>
        <template #handle="{ row }">
          <!-- 只有未上线活动可编辑 -->
          <table-row-button
            v-if="editVisible(row)"
            v-auth="auth.EDIT"
            @click="toEdit(row.activityId)"
            >编辑</table-row-button
          >
          <table-row-button v-if="viewVisible(row)" v-auth="auth.DETAIL" type="text" @click="toView(row.activityId)"
            >查看</table-row-button
          >

          <table-row-button
            v-if="onlineVisible(row)"
            v-auth="auth.ONLINE"
            @click="activityOnline([row.activityId], row)"
            >上线</table-row-button
          >
          <table-row-button
            v-if="offlineVisible(row)"
            v-auth="auth.OFFLINE"
            @click="activityOffline([row.activityId], row)"
            >下线</table-row-button
          >

          <table-row-button
            v-auth="auth.DETAIL"
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
    <ImportDialog :visible.sync="importDialogVisible" @imported="onImported"/>
  </div>
</template>
<script>
import ActivitySearch from './components/ActivitySearch';
import ActivityTable from '../components/ActivityTable';
import ActivityTableBar from '../components/ActivityTableBar';
import TableRowButton from '@/components/Table/TableRowButton'
import {
  getAbSaleActivityList,
  setAbSaleActivityOnline,
  setAbSaleActivityOffline,
  delAbSaleActivity,
  delAbSaleActivityBatch,
} from '@/api/activityManage';
import { activityIndexMixin } from '../mixins'
import { page } from '@/common/mixins';
import ImportDialog from './components/ImportDialog';

const XhrFunMap = {
  getList: getAbSaleActivityList,
  online: setAbSaleActivityOnline,
  offline: setAbSaleActivityOffline,
  delete: delAbSaleActivity,
  deleteBatch: delAbSaleActivityBatch
}

export default {
  components: {
    ActivitySearch,
    ActivityTable,
    ActivityTableBar,
    TableRowButton,
    ImportDialog
  },
  
  mixins: [page, activityIndexMixin],
  data () {
    const auth = {
      ADD: 'ASA_ADD',
      EDIT: 'ASA_EDIT',
      FIND: 'ASA_FIND',
      DETAIL: 'ASA_DETAIL',
      DELETE: 'ASA_DELETE',
      ONLINE: 'ASA_ONLINE',
      OFFLINE: 'ASA_OFFLINE',
      BATCHDELETE: 'ASA_BATCH_DELETE',
      BATCHONLINE: 'ASA_BATCH_ONLINE',
      BATCHOFFLINE: 'ASA_BATCH_OFFLINE',
      BATCH_IMPORT: 'ASA_BATCH_IMPORT'
    }
    return {
      auth,
      importDialogVisible: false,
      propMap: {
        activityId: 'id',
        startTime: 'beginDate',
        endTime: 'endDate',
        createTime: 'createDate',
        activityStatus: 'status',
        createUser: 'optName'
      }
    }
  },
  methods: {
    getXhrFun (type) {
      if (XhrFunMap[type]) {
        return XhrFunMap[type]
      } else {
        throw Error('缺少请求方法')
      }
    },
    getActivityName (row) {
      let typeStr = '';
      if (row.type == 1) {
        typeStr = '打折 ' + row.sale;
      } else if (row.type == 2) {
        typeStr = '直降 ￥' + row.sale;
      }
      return typeStr;
    },
    getClassUrl (classId) {
      return `${PC_URL}cla/class_detail_${classId}.htm`;
    },
    openImportDialog () {
      this.importDialogVisible = true;
    },
    onImported() {
      this.$refs.search && this.$refs.search.reset();
      this.page = 1;
      this.getList();
    }
  },
};
</script>
<style lang="less" scoped>
</style>