<template>
	<!-- 订单详情-操作记录 -->
	<div>
		
		<!-- <div class="item" v-for="(item, ind) in tableDate" :key="ind">
			
			<p>[{{item.operateDate}}]</p> 时间
			<p>【{{item.remark}}】</p> 操作备注
			<p>{{item.operateClass}}</p>操作课程
			<p>{{item.statusName}}</p>
			<p>{{item.operateUserName}}</p>操作员
			
		</div> -->
		
		<div>暂无数据</div>
		
		
	</div>


</template>

<script>
	export default {
		props: ['operateLog'],
		data() {
			return {
				tableDate: []
			}
		},
		watch:{
			operateLog(newVal){
				this.tableDate = newVal;
			}
		}
	}
</script>

<style scoped>
	.item{
		margin-bottom: 30px;
	}
</style>
