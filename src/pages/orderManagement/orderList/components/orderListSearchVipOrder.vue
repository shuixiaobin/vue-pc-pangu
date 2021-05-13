<template>
	<div>
		<el-form
			ref="ruleForm"
		  size="small"
		  :inline="true"
		  :model="formData"
		  class="demo-form-inline"
		>
			<el-form-item>
				<el-select
					v-model="formData.dateType"
					size="small"
				>
					<el-option label="下单日期" value="1"></el-option>
					<el-option label="支付日期" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="date">
				<el-date-picker
					size="small"
					v-model="formData.date"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
		  
			<el-form-item label="订单状态" style="display: block;">
				<el-select v-model="formData.orderState" placeholder="请选择订单状态">
					<el-option label="待支付" value="1"></el-option>
					<el-option label="已取消" value="2"></el-option>
					<el-option label="已支付" value="3"></el-option>
				</el-select>
			</el-form-item>
			
			<el-form-item label="订单类型" prop="orderType">
				<el-checkbox-group v-model="formData.orderType">
					<el-checkbox
						v-for="item in formData.orderTypeArr"
						:key="item.id"
						:label="item.value"
						name="type"
					>{{item.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			
			<el-form-item>
		    <el-button
		      type="primary"
		      @click="onSubmit"
		      size="small"
		    >查询</el-button>
				<el-button
				  @click="onReset"
				  size="small"
				>重置</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	const endTime = new Date();
	const startTime = new Date();
	startTime.setMonth(startTime.getMonth() - 1);
	export default {
		data(){
			return {
				formData: {
					dateType: '1',
					date: [startTime, endTime],
					orderState: '1',
					orderType: [],
					orderTypeArr: [
						{name: '注册赠送', value: '1'},
						{name: '成长值升级', value: '2'},
						{name: '分享亲友卡赠送', value: '3'},
						{name: '购买', value: '4'},
						{name: '购课赠送', value: '5'},
						{name: '活动赠送', value: '6'},
					]
				}
			}
		},
		methods: {
			onSubmit(){
				console.log("this.formData.orderType: ",this.formData.orderType);
			},
			onReset(){
				this.$refs.ruleForm.resetFields();
			}
		}
	}
</script>

<style>
</style>
