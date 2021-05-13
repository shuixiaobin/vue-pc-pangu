<template>
	<el-container>
		<el-container direction="vertical">
			<!-- 基础信息 -->
			<el-main>
				<div class="flex-title">
					<h3 class="netmap-common_title">基础信息</h3>
					<div>{{OrderNum}}</div>
				</div>
				
				<div class="main">
					<basic-info
						:tableData="tableData"
						:express_info="express_info"
						:orderItem="orderItem"
					></basic-info>
				</div>
			</el-main>
			
			<!-- 用户信息 -->
			<el-main>
				<div class="flex-title">
					<h3 class="netmap-common_title">用户信息</h3>
				</div>
				
				<div class="main">
					<user-info
						:tableData="tableData"
						:invoice_info="invoice_info"
						:orderExt="orderExt"
					></user-info>
				</div>
			</el-main>
			
			<!-- 班级信息 -->
			<el-main>
				<div class="flex-title">
					<h3 class="netmap-common_title">班级信息</h3>
				</div>
				
				<div class="main">
					<class-info
						:allTableData="allTableData"
					></class-info>
				</div>
			</el-main>
			
			<!-- 图书信息 -->
			<el-main>
				<div class="flex-title">
					<h3 class="netmap-common_title">图书信息</h3>
				</div>
				
				<div class="main">
					<book-info
						:express_info="express_info"
						:tableData="tableData"
					></book-info>
				</div>
			</el-main>
			
			<!-- 支付信息 -->
			<el-main>
				<div class="flex-title">
					<h3 class="netmap-common_title">支付信息</h3>
				</div>
				
				<div class="main">
					<pay-info
						:tableData="tableData"
					></pay-info>
				</div>
			</el-main>
			
		</el-container>
		
		<el-aside>
			<div class="flex-title">
				<h3 class="netmap-common_title">操作记录</h3>
			</div>
			
			<div class="main">
				<operation-records
					:operateLog="operateLog"
				/>
			</div>
		</el-aside>
		
	</el-container>
</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	import BasicInfo from './plugin/basicInfo.vue'
	import UserInfo from './plugin/userInfo.vue'
	import ClassInfo from './plugin/classInfo.vue'
	import BookInfo from './plugin/bookInfo.vue'
	import PayInfo from './plugin/payInfo.vue'
	import OperationRecords from './plugin/operationRecords.vue'
	export default {
		components: {
			BasicInfo,
			UserInfo,
			ClassInfo,
			BookInfo,
			PayInfo,
			OperationRecords
		},
		data(){
			return {
				OrderNum: '', //订单号
				tableData: {},
				invoice_info: {}, //发票信息
				express_info: {}, //物流信息
				allTableData: {}, //所有的字段
				orderDetail: {}, //订单信息
				operateLog: [], //操作记录
				orderItem: [] ,// 订单详情
				refundSubmit: {}, // 退费提交需要的数据
				orderExt: {}
			}
		},
		mounted() {
			const obj = {
				order_id: this.$route.query.orderId
			}
			// //传入订单 id 请求订单详情
			orderManage.getOrderDetails(obj)
				.then(res => {
					if(res.code < 0){
						this.$message.error(res.msg)
					}else{
						this.OrderNum = res.data.order.OrderNum;
						this.tableData = res.data.order;
						this.invoice_info = res.data.invoice_info;
						this.express_info = res.data.express_info;
						this.allTableData = res.data;
						this.orderItem = res.data.order_item;
						this.orderExt = res.data.order_ext;
						// this.orderDetail.order_id = res.data.order.OrderID; //订单id 
						// this.orderDetail.class_id = res.data.class_info.main[0].rid; //主课 id
						this.operateLog = res.data.operate_log; //操作记录
						
						
						for(let props in res.data.class_info) {
							this.refundSubmit.classId = res.data.class_info[props].rid; // 班级ID
							this.refundSubmit.userName = res.data.class_info[props].UserName; // 用户名
						}
						this.refundSubmit.oldMoney = res.data.order.MoneyReceipt; // 实收金额
						this.refundSubmit.orderNum = res.data.order.OrderNum; // 订单编号
						this.refundSubmit.orderId = this.$route.query.orderId;// 订单id
						this.$emit('refundSubmit', this.refundSubmit) // 将这些信息提交到父元素，父元素交给退费提交 tab 页使用
					}
				})
				.catch(err => {
					this.$message.error(err.msg)
				})
		},
	}
</script>

<style scoped>
	.el-aside {
		line-height: 40px;
		border: 1px solid #EBEEF5;
	}
	.el-main {
		background-color: #FFF;
		color: #333;
		line-height: 40px;
		border: 1px solid #EBEEF5;
		margin-right: 16px;
		margin-bottom: 16px;
		padding-top: 0;
		padding-left: 0;
		padding-right: 0;
	}
	.main{
		padding: 0 16px;
	}
	.flex-title{
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 39px;
		padding: 0 15px;
		background: #F5F7FA;
		border-radius: 1px 1px 0px 0px;
		margin-bottom: 16px;
	}
	.flex-title .netmap-common_title{
		font-size: 20px;
		font-weight: 650;
		color: rgba(0, 0, 0, 0.847058823529412);
	}
	.flex-title div{
		font-size: 14px;
		color: rgba(0, 0, 0, 0.647058823529412);
	}
</style>
