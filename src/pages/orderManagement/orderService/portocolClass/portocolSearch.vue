<template>
	<div class="container-searchLine">
		<div style="display: inline-block;">
			<span>付款时间 </span>
			<el-date-picker
				v-model="payDate"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				size="small"
			>
			</el-date-picker>
		</div>
		
		<el-select v-model="searchType" placeholder="请选择" size="small" style="width: 120px; margin-left: 20px;">
			<el-option label="协议手机号" value="protocolMobile"></el-option>
			<el-option label="注册手机号" value="registerPhone"></el-option>
			<el-option label="用户名" value="userName"></el-option>
		</el-select>
		
		<el-input 
			v-model="input"
			placeholder="请输入内容" 
			size="small" 
			class="courseInput"
		></el-input>
		
		<div style="display: inline-block;">
			<span style="margin-left:10px;">状态</span>
			<el-select v-model="orderStatus" placeholder="请选择" size="small" style="width: 120px; ">
				<el-option label="全部" value="0"></el-option>
				<el-option label="已结转" value="3"></el-option>
				<el-option label="未结转" value="4"></el-option>
				<el-option label="已审核" value="1"></el-option>
				<el-option label="未审核" value="2"></el-option>
			</el-select>
		</div>
		
		<el-button type="primary" size="small" class="courseButton" @click="query" v-auth="'PS_USER_FIND'">查询</el-button>
		<el-button size="small" @click="reset">重置</el-button>
		<!-- <el-button style="float: right;" type="primary" size="small">导出</el-button> -->
	</div>
</template>

<script>
	export default{
		data(){
			return {
				searchType: 'protocolMobile',
				orderStatus: '0',
				input: '',
				payDate: [], //付款时间
			}
		},
		mounted() {
			this.query()
		},
		methods:{
			query(){
				const searchObj = {
					searchType: this.searchType,
					orderStatus: this.orderStatus,
					input: this.input,
					payDate: this.payDate
				}
				this.$emit('search', searchObj)
			},
			reset(){
				this.input = "";
				this.payDate = [];
			}
		}
	}
</script>

<style scoped="scoped">
	.courseInput {
		width: 200px;
	}
	.courseButton {
		margin-left: 20px;
	}
</style>
