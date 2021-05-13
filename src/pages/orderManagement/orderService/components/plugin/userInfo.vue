<template>
	<div>
		<!-- 订单详情-用户信息模块 -->
		<el-col :span="12">
			<div class="grid-content bg-purple-dark">用户id: <span>{{tableData.UserID}}</span></div>
			<div class="grid-content bg-purple-dark">手机号: <span>{{tableData.UserMobile}}</span></div>
			<div class="grid-content bg-purple-dark">收件人: <span>{{tableData.ConSignee}}</span></div>
			<div class="grid-content bg-purple-dark">收件地址: 
				<span>{{consigneeAddress}}</span>
			</div>
			<div class="grid-content bg-purple-dark">发票类型: 
				<span>{{tableData.title_type == 1 ? '单位' : (tableData.title_type == 2 ? '个人' : '-')}}</span>
			</div>
			<!-- <div class="grid-content bg-purple-dark">邮政编码: <span>{{tax_num}}</span></div> -->
		</el-col>
		
		<el-col :span="12">
			<div class="grid-content bg-purple-dark">用户名: <span>{{tableData.UserName}}</span></div>
			<div class="grid-content bg-purple-dark">邮箱: <span>{{tableData.Email}}</span></div>
			<div class="grid-content bg-purple-dark">收件电话: <span>{{tableData.Phone}}</span></div>
			<div class="grid-content bg-purple-dark">是否开票: 
				<span>{{tableData.Invoiced == 1 ? '已开' : '未开'}}</span>
			</div>
			<div class="grid-content bg-purple-dark">发票抬头: <span>{{invoice_info.invoice_title}}</span></div>
		</el-col>
	</div>
</template>

<script>
	export default{
		props: {
			tableData: {
				type: Object
			},
			invoice_info: {
				type: Object
			},
			orderExt: {
				type: Object
			}
		},
		data(){
			return {
				theRecipientPhoneShow: false, //收件人电话显示情况
			}
		},
		computed: {
			consigneeAddress(){
				const {DzProvince, DzCity, DzArea} = this.orderExt;
				return DzProvince + " " + DzCity + " " + DzArea + " " + this.tableData.Address
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
	.icon-img{
		width: 15px;
		height: 15px;
		display: inline-block;
		cursor: pointer;
	}
	
</style>
