<template>
  <div>
    <MenuTitle>
      <template v-slot:btn>
        <el-button
          size="small"
          @click="openReportDialog"
          v-auth="'OL_EXPORT'"
        >导出</el-button>
      </template>
    </MenuTitle>
    <div class="container-Box">
      <orderListSearch
        @openMultiSearch="openMultiSearch"
        @search="singleSearch"
				@selectChange="selectChange"
        :SelectOptions="SelectOptions"
      />
			<!-- 会员订单 -->
			<!-- <template v-if="orderType == 1">
				<orderListSearchVipOrder
					v-show="isShowMultiSearch"
				/>
			</template> -->
			<!-- 课程订单 -->
			<!-- <template v-if="orderType == 2"> -->
				<orderListSearchMulti
				  v-show="isShowMultiSearch"
				  :SelectOptions="SelectOptions"
				  @search="multiSearch"
				/>
			<!-- </template> -->
      <span
      :class="[isShowMultiSearch?'toggle-btn close':'toggle-btn open']"
      @click="isShowMultiSearch=!isShowMultiSearch"
    >{{isShowMultiSearch?'收起':'展开'}} <i
        class="iconfont"
        :class="[isShowMultiSearch?'iconshouqi':'iconzhankai']"
      ></i></span>
    </div>
    <div class="container-Box mt16 minHeight">
      <orderListTable
        :tableData="tableData"
        :paymentType="paymentType"
        :loading="loading"
      />
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
    <reportDialog
      ref="reportDialog"
      :SelectOptions="SelectOptions"
      :searchData="searchData"
    />
  </div>
</template>
<script>
import orderListSearchVipOrder from './components/orderListSearchVipOrder.vue'
import orderListSearch from "./components/orderListSearch";
import orderListSearchMulti from "./components/orderlistSearchMulti";
import orderListTable from "./components/orderListTable";
import reportDialog from "./components/reportDialog";
import {
  getOrderSelectOptions,
  getOrderSingleList,
  getOrderMultiList
} from "@/api/orderManage";
import { page } from "@/common/mixins";
export default {
  mixins: [page],
  data() {
    return {
      isShowMultiSearch: false, //是否展开多条件查询
      isShowReportDailog: false, //导出订单弹框
      SelectOptions: [], //单条件搜索类型
      tableData: [],
      loading: false, //表格加载
      getType: getOrderSingleList, //请求方式
      pageSizes: [10, 20, 30, 50, 100, 200],
      pageSize: 20,
      paymentType: {}, //支付方式
      searchData: {} ,//单条件搜索
			orderType: '', // 订单类型
    };
  },
  components: {
    orderListSearch,
    orderListSearchMulti,
    orderListTable,
    reportDialog,
		orderListSearchVipOrder
  },
  created() {
    this.getOrderSelectOptions();
  },
  methods: {
    getOrderSelectOptions() {
      getOrderSelectOptions()
        .then(res => {
          if (res.code == 10000) {
            this.SelectOptions = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    openMultiSearch(val) {
      this.isShowMultiSearch = val;
    },
    getList() {
      this.getType({
        ...this.searchData,
        page: this.page,
        pageCount: this.pageSize
      })
        .then(res => {
          if (res.code == 100000) {
            this.loading = false;
            this.tableData = res.data[1] ? res.data[1] : [];
            this.paymentType = res.data[2] ? res.data[2] : {};
            this.total = Number(res.data[0] ? res.data[0].totleCount : 0);
          } else {
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    singleSearch(params) {
      this.searchData = { ...params };
      if (this.searchData && this.searchData.Keyword) {
        this.loading = true;
        this.page = 1;
        this.getType = getOrderSingleList;
        this.getList();
      } else if(this.searchData && this.searchData.vipKeyword){
				this.loading = true;
				this.page = 1;
				// this.getType = getOrderSingleList;
				// this.getList();
			} else {
        this.$message.error("单条件搜索项不能为空");
      }
    },
		selectChange(type){ // 订单类型改变时 触发
			this.orderType = type;
		},
    multiSearch(params) {
      this.loading = true;
      this.searchData = { ...params, time01: params.time01.join(" - ") };
      this.page = 1;
      this.getType = getOrderMultiList;
      this.getList();
    },
    openReportDialog() {
      this.$refs.reportDialog.open();
    }
  }
};
</script>
<style lang="less" scoped>
.mt16 {
  margin-top: 16px;
}
</style>
