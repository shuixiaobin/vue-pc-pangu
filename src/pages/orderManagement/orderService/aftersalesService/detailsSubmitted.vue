<template>
	<!-- 退补额详情提交 -->
	<div class="module">
		<div class="container-title">
			<h2>退补额详情</h2>
		</div>
		
		<div class="container">
			
			<el-tabs v-model="activeName" @tab-click="handleClick">
				
				<el-tab-pane label="订单详情" name="first">
					
					<orderDetails />
					
				</el-tab-pane>
				
				<el-tab-pane label="退额提交" name="second">

					<refundAmount />
					
				</el-tab-pane>
			
				<!-- <el-tab-pane label="补额提交" name="third">
					
				</el-tab-pane> -->
			</el-tabs>
			
		</div>
		
	</div>
	
</template>

<script>
	import orderDetails from '../components/orderDetails.vue'
	import refundAmount from './refundAmountCommit.vue'
	export default{
		components:{
			orderDetails,
			refundAmount
		}, 
		data() {
			return {
				activeName: 'first'
			};
		},
		methods: {
			handleClick(tab, event) {
				// console.log(tab, event);
			},
		}
	}
</script>

<style scoped="scoped">
</style>
