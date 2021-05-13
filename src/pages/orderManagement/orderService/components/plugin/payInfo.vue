<template>
	<div>
		<!-- 订单详情-支付信息模块 -->
		<el-col :span="12">
			<div class="grid-content bg-purple-dark">订单总金额: <span>{{moneyFormat(tableData.MoneyTotal)}}</span></div>
			<div class="grid-content bg-purple-dark">现金支付: 
				<!-- 现金支付=实收-图币-任务金币 -->
				<span>{{moneyFormat(tableData.MoneyReceipt - (tableData.taskchargeCost/100) - (tableData.MoneyStudyCard/100))}}</span>
			</div>
			<div class="grid-content bg-purple-dark">会员优惠: <span>{{moneyFormat(tableData.Discount)}}</span></div>
			<div class="grid-content bg-purple-dark">其他优惠: <span>{{moneyFormat(tableData.otherDiscount)}}</span></div>
		</el-col>
		<el-col :span="12">
			<div class="grid-content bg-purple-dark">图币支付: <span>{{moneyFormat(tableData.MoneyStudyCard, 'tubi')}}</span></div>
			<div class="grid-content bg-purple-dark">代金券: <span>{{moneyFormat(tableData.MoneyFree)}}</span></div>
			<div class="grid-content bg-purple-dark">优惠券: <span>{{moneyFormat(tableData.coupons)}}</span></div>
		</el-col>
	</div>
</template>

<script>
	import Util from '@/common/util.js'
	export default{
		props:{
			tableData: {
				type: Object
			}
		},
		methods: {
			moneyFormat(number, param){
				let result = Util.moneyFormat(number);
				if(result || result === 0 || result === '0'){
					if(param == 'tubi'){
						return result;
					}
					return result + '元'
				}
			}
		}
	}
</script>

<style scoped>
	.el-col {
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.847058823529412);
	}
	.el-col span{
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.647058823529412);
	}
</style>
