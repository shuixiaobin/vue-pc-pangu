<template>
	<!-- 注册数据管理 搜索 -->
	<div>
		
		<div class="item">
			<span style="font-size: 13px;">时间范围&nbsp;&nbsp;</span>
			<el-date-picker
				v-model="date"
				size="small"
				type="datetimerange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期">
			</el-date-picker>
		</div>

		<div class="item">
			<span style="font-size: 13px;">显示类型&nbsp;&nbsp;</span>
			<el-select v-model="isDay" placeholder="请选择" size="small">
				<el-option label="总计显示" :value="false"></el-option>
				<el-option label="按天显示" :value="true"></el-option>
			</el-select>
		</div>
		
		<div class="item">
			<el-button type="primary" size="small" @click="query">查询</el-button>
			<el-button size="small" @click="handleReset">重置</el-button>
		</div>
		
	</div>
</template>

<script>
	const endTime = new Date();
	const startTime = new Date();
	startTime.setMonth(startTime.getMonth() - 1);
	export default {
		data(){
			return {
				date: [startTime, endTime],
				isDay: false
			}
		},
		
		mounted() {
			this.query()
		},
		
		methods: {
			query(){
				const params = {
					isDay: this.isDay,
				}
				if(this.date.length == 2){
					params.beginTime = new Date(this.date[0])
					params.endTime = new Date(this.date[1])
				}
				
				this.$emit('search', params)
			},
			handleReset(){
				this.date = [];
				this.isDay = false;
			},
		}
	}
</script>

<style scoped="scoped">
	.item{
		display: inline-block;
		margin-right: 30px;
	}
</style>
