<template>
  <!-- 协议班退费审核 -->
  <div class="module">
    <MenuTitle> </MenuTitle>

    <div class="container-Box">
      <search-list v-auth="'XYB_FIND'" @search="search" />
    </div>

    <div class="container-Box mt16 minHeight">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column
          fixed
          prop="OrderNum"
          label="订单ID"
          width="200"
        ></el-table-column>

        <el-table-column
          prop="Title"
          label="课程名称"
          width="200"
        ></el-table-column>

        <el-table-column
          prop="auditType"
          label="审核类型"
          width="80"
        ></el-table-column>

        <el-table-column width="170">
          <template #header>
            <div class="tableColumnTitle">
              <span>用户名</span>
              <span>手机号</span>
            </div>
          </template>
          <template #default="scope">
            <div class="tableColumnTitle">
							<span>{{scope.row.UserName}}</span>
							<telSHowHid :tel="scope.row.Phone" />
            </div>
          </template>
        </el-table-column>

        <el-table-column width="170">
          <template #header>
            <div class="tableColumnTitle">
              <span>付款日期</span>
              <span>协议退费日期</span>
            </div>
          </template>
          <template #default="scope">
            <div class="tableColumnTitle">
              <span>{{ scope.row.PayDate }}</span>
              <span>{{ scope.row.serviceDate }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="170">
          <template #header>
            <div class="tableColumnTitle">
              <span>实收金额</span>
              <span>退款金额</span>
            </div>
          </template>
          <template #default="scope">
            <div class="tableColumnTitle">
              <span v-if="scope.row.MoneyReceipt"
                >￥{{ scope.row.MoneyReceipt }}</span
              >
              <span v-if="scope.row.turnbackMoney"
                >￥{{ scope.row.turnbackMoney }}</span
              >
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="auditStatus"
          label="退款状态"
          width="100"
        ></el-table-column>

        <el-table-column
          prop="reason"
          label="退班原因"
          width="170"
        ></el-table-column>

        <el-table-column label="退班备注" width="170" prop="remarkNote">
          <template #default="scope">
            <div class="tableTips" v-html="scope.row.OperRemark"></div>
          </template>
        </el-table-column>

        <el-table-column label="退款方式" width="170" prop="IsMakeSure">
        </el-table-column>

        <el-table-column label="操作员" width="130" prop="OperUser">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button v-auth="'XYB_VIEW_APPLI_FORM'" type="text" size="small" @click="showTable(scope.row)"
              >申请表</el-button >
            <el-button v-auth="'XYB_APPLI_RECORD'" type="text" size="small" @click="showRecord(scope.row)"
              >申请记录</el-button>
            <el-button v-auth="'XYB_PASS'" type="text" size="small" @click="agree(scope.row)"
              >通过</el-button>
            <el-button v-auth="'XYB_CANCEL'" type="text" size="small" @click="reject(scope.row)"
              >驳回</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-auth="'XYB_FIND'"
        :total="total"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>

    <!-- 申请表 -->
    <portocolRefund
      :visible.sync="portocolRefundVisible"
      type="笔试"
      :orderId="currentItem && currentItem.OrderID"
    />

    <!-- 申请记录 -->
    <application-record
      :visible.sync="applicationVisible"
      :item="currentItem"
    />

    <!-- 驳回 -->
    <rejectedCommon
      :visible.sync="rejectedVisible"
      :itemId="currentItem && currentItem.itemID"
      :orderNum="currentItem && currentItem.OrderNum"
			@rejected="getList"
    />
  </div>
</template>

<script>
import searchList from './searchList.vue';
import pagination from '../../components/pagination.vue';
import applicationRecord from './applicationRecord.vue';
import rejectedCommon from './rejectedCommon.vue';
import portocolRefund from './portocolRefund.vue';
import telSHowHid from '../../components/telShowHide'
import { page } from '@/common/mixins';
import { getRefundList, postRefundApproved } from '@/api/orderManage';
export default {
  components: {
    searchList,
    pagination,
    applicationRecord,
		telSHowHid,
    rejectedCommon,
    portocolRefund,
  },
  mixins: [page],
  data() {
    return {
      rejectedVisible: false, // 驳回
      applicationVisible: false, // 申请记录
      portocolRefundVisible: false, // 协议退费申请表
      tableData: [],
      currentItem: null,
      searchParams: {},
      dialog: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {
        list_type: 'treatyRefund',
        orderNo: this.searchParams.orderNo || undefined,
        istreaty: this.searchParams.istreaty || 1,
        catetype: this.searchParams.catetype || undefined,
        userName: this.searchParams.userName || undefined,
        mobile: this.searchParams.mobile || undefined,
        optUser: this.searchParams.optUser || undefined,
        classId: this.searchParams.classId || undefined,
        page: this.page,
        pageSize: this.pageSize,
      };
      if (this.searchParams.dateType == 'auditDate') {
        [params.aTimeStart, params.aTimeEnd] =
          this.searchParams.dateValue || [];
      } else {
        [params.payTimeStart, params.payTimeEnd] =
          this.searchParams.dateValue || [];
      }
      return getRefundList(params).then(res => {
        if (res.code == 10000) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    showRecord(row) {
      this.currentItem = row;
      this.applicationVisible = true;
    },
    showTable(row) {
      this.currentItem = row;
      this.portocolRefundVisible = true;
    },
    agree(item) {
      postRefundApproved({
        itemId: item.itemID,
        operUser: this.$store.state.username,
      }).then(res => {
				if (res.code == 10000) {
					if (res.data[0].code == 1) {
						this.getList();
						this.$alert('', '操作成功', {
							center: true,
							type: 'success'
						})
					} else {
						this.$alert(res.data[0].message, '操作失败', {
							center: true,
							type: 'errror'
						})
					}
				} else {
					this.$alert(res.msg, '操作失败', {
						center: true,
						type: 'errror'
					})
				}
			}).catch(e => {
					this.$alert(e, '操作失败', {
						center: true,
						type: 'error'
					})
			});
    },
    reject(row) {
      this.currentItem = row;
      this.rejectedVisible = true;
    },
  },
};
</script>

<style lang="less" scoped="scoped">
.tableColumnTitle {
	span {
		display: block;
		font-weight: 500;
		color: #909399;
		line-height: 30px;
		&:last-child {
			border-top: 1px solid #ccc;
		}
	}
}
</style>
