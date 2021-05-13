<template>
	<div>
		
		<div class="clearfix" style="margin-bottom: 10px;">
			<el-button
				@click="batchRefundAmount()" 
				size="small"
				class="export fr"
			>批量退额</el-button>
		</div>
		
		<!-- 信息列表 -->
		<el-table 
			:data="tableData" 
			border 
			style="width: 100%"
		>
			<el-table-column 
				fixed 
				align="center" 
				prop="orderNum" 
				label="订单编号" 
				width="220"
			></el-table-column>

			<el-table-column 
				align="center" 
				prop="classTitle" 
				label="课程名称" 
				width="200"
			></el-table-column>

			<el-table-column align="center"  width="170">
				<template slot="header" slot-scope="scope">
					<div class="headerTitile">
						<span>用户名</span>
						<span>手机号</span>
					</div>
				</template>
				<template slot-scope="scope" v-if="isData">
					<div class="borderTitile">
						<span>{{scope.row.userName}}</span>
						<span>{{scope.row.userMobile}}</span>
					</div>
				</template>
			</el-table-column>
			
			<el-table-column align="center" width="170">
				<template slot="header" slot-scope="scope">
					<div class="headerTitile">
						<span>下单日期</span>
						<span>付款日期</span>
					</div>
				</template>
				<template slot-scope="scope" v-if="isData">
					<div class="borderTitile">
						<span>{{scope.row.addTime}}</span>
						<span>{{scope.row.payDate}}</span>
					</div>
				</template>
			</el-table-column>
			
			<el-table-column align="center" width="170">
				<template slot="header" slot-scope="scope">
					<div class="headerTitile">
						<span>订单金额</span>
						<span>实收金额</span>
					</div>
				</template>
				<template slot-scope="scope" v-if="isData">
					<div class="borderTitile">
						<!-- <span>￥{{moneyFormat(scope.row.moneySum)}}/</span>
						<span>￥{{moneyFormat(scope.row.moneyReceipt)}}</span> -->
						<span v-if="scope.row.moneySum">￥{{scope.row.moneySum}}</span>
						<span v-if="scope.row.moneyReceipt">￥{{scope.row.moneyReceipt}}</span>
					</div>
				</template>
			</el-table-column>
			
			<el-table-column align="center" width="170">
				<template slot="header" slot-scope="scope">
					<div class="headerTitile">
						<span>课程状态</span>
						<span>订单状态</span>
					</div>
				</template>
				<template slot-scope="scope" v-if="isData">
					<div class="borderTitile">
						<span>{{scope.row.itemStatus}}</span>
						<span>{{scope.row.orderStatus}}</span>
					</div>
				</template>
			</el-table-column>

			
			<el-table-column
				align="center" 
				prop="moneyTotal" 
				label="结算金额" 
				width="170"
			></el-table-column>

			<el-table-column align="center" width="190">
				<template slot="header" slot-scope="scope">
					<div class="headerTitile">
						<span>订单服务时间</span>
						<span>订单服务金额</span>
					</div>
				</template>
				<template slot-scope="scope" v-if="isData">
					<div class="borderTitile">
						<span>{{scope.row.serviceDate}}</span>
						<span v-if="scope.row.serviceAmount">￥{{scope.row.serviceAmount}}</span>
					</div>
				</template>
			</el-table-column>

			<el-table-column 
				align="center" 
				prop="operationReason" 
				label="订单服务原因" 
				width="170"
			></el-table-column>

			<el-table-column 
				align="center" 
				label="订单服务备注" 
				width="170" 
				prop="itemReMark"
			>
			</el-table-column>
			
			<el-table-column align="center" width="150">
				<template slot="header" slot-scope="scope">
					<div class="headerTitile">
						<span>退款方式</span>
						<span>操作员</span>
					</div>
				</template>
				<template slot-scope="scope" v-if="isData">
					<div class="borderTitile">
						<span>{{scope.row.isMakeSure}}</span>
						<span>{{scope.row.operUser}}</span>
					</div>
				</template>
			</el-table-column>
			
			<el-table-column fixed="right" label="操作" width="140">
					<template slot-scope="scope">
						<el-button
							type="text"
							size="small"
							@click="handleClick(scope.row.orderId)"
							:disabled="!isData"
							v-auth="'BTES_VIEW'"
						>查看</el-button>
					</template>
			</el-table-column>
		</el-table>
		
		<dialogUndoApply ref="dialog"/>
	</div>
</template>

<script>
	import dialogUndoApply from '../orderService/components/dialogUndoApply.vue'
	export default {
		props: {
			title: {
				type: String,
				required: true
			},
			fontColor: {
				type: String,
				required: true,
				default(){
					return "blue"
				}
			},
			tableDate: Array,
			refundAmount: String, //退额
			fillForehead: String,//补额
		},
		components: {
			dialogUndoApply,
		},
		data() {
			return {
				isData: false, //第一次是否请求完成
				revocation: true, //是否显示撤销申请
				tableData: [],
			}
		},
		watch: {
			tableDate(newVal, oldVal){
				this.tableData = newVal;
				this.tableData.map(item => {
					this.$set(item, 'isShow', false)
					this.$set(item, 'showPhone', '')
					this.$set(item, 'classTypes', '-')
				})
				this.isData = true;
			}
		},
		methods: {
			batchRefundAmount(){ //批量退额
				this.$router.push({
					path: '/orderManagement/orderService/aftersalesService/batchSubmit'
				})
			},
			//点击操作按钮跳转
			handleClick(orderId) {
				this.$router.push({
					path: `${this.$route.path}/submit`,
					query: {orderId: orderId}
				})
			},
			open(){
				this.$refs.dialog.open()
			}
		},
		computed: {
			moneyFormat(){ //将传过来的金额按照格式用逗号分割
				return function(number){
					const regex = /(?!^)(?=(\d{3})+$)/g; 
					const result = number.replace(regex, ',');
					return result;
				}
			},
		}
	}
</script>

<style scoped>
	.headerTitile, .borderTitile{
		width: 100%;
		padding: 0;
	}
	.headerTitile span, .borderTitile span{
		display: block;
		text-align: left;
	}
	
	.headerTitile span:last-child,.borderTitile span:last-child{
		border-top: 1px solid #ccc; 
	}
	.icon-img{
		font-size: 22px;
		position: absolute;
		right: 10px;
		top: 45px;
		cursor: pointer;
	}
	.font{
		font-size: 13px;
	}
	.font-red{
		color: #FF0000;
	}
	.blue{
		color: #1856FF;
	}
	.red{
		color: #ff0000;
	}
	.export{
		color: #303133;
	}
	.export:hover{
		background-color: #1856FF;
		color: #fff;
	}
	.clearfix{
		content: '';
		display: block;
		clear: both;
	}
</style>
