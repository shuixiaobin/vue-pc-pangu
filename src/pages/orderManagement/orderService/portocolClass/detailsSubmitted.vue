<template>
	<!-- 退费详情 -->
	<div class="module">
		<div class="container-title">
			<h2>退费提交</h2>
		</div>
		
		<div class="container">
			
			<el-tabs v-model="activeName">
				
				<el-tab-pane label="订单详情" name="first">
					
					<orderDetails 
						@refundSubmit="handleFunc"
					/>
					
				</el-tab-pane>
				
				<el-tab-pane label="协议退费提交" name="second" v-auth="'PS_PROTOCOL_REFUND_SUBMIT'">
		
					<refundAmount
						:refundInfo="refundSubmit"
					/>
					
				</el-tab-pane>
			</el-tabs>
			
		</div>
		
	</div>
	
</template>

<script>
	import orderDetails from '../components/orderDetails.vue'
	import refundAmount from './refundCommit.vue'
	export default{
		components:{
			orderDetails,
			refundAmount
		}, 
		data() {
			return {
				activeName: 'first',
				refundSubmit: {}
			};
		},
		methods: {
			handleFunc(obj){
				this.refundSubmit = obj;
			}
		}
	}
</script>

<style scoped="scoped">
</style>
