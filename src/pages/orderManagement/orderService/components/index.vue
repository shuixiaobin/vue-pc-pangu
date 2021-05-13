<template>
	<div>
		<div class="container-title">
			<h2>{{title}}</h2>
		</div>

		<div class="container">
			<el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
				<el-tab-pane
					name="first"
					label="订单详情"
				>
					<orderDetails 
						ref="detail"
					/>
				</el-tab-pane>

				<el-tab-pane
					name="second"
					:label="title"
				>
					<!-- 退班提交 -->
					<returnClassCommit 
						v-if="do_type == 'exit'"
						:order="order"
					/>
					
					<!-- 转班提交 -->
					<classTransferCommit 
						v-else-if="do_type == 'turn'"
						:order="order"
					/>
					
					<!-- 退额提交 -->
					<refundAmountCommit 
						v-else-if="do_type == 'refund'"
						:order="order"
					/>
					
					<!-- 补额提交 -->
					<fillForeheadCommit 
						v-else-if="do_type == 'compensate'"
						:order="order"
					/>
				</el-tab-pane>

			</el-tabs>


		</div>

	</div>
</template>

<script>
	import orderDetails from './orderDetails.vue'
	import returnClassCommit from './returnClassCommit.vue'
	import classTransferCommit from './classTransferCommit.vue'
	import refundAmountCommit from './refundAmountCommit.vue'
	import fillForeheadCommit from './fillForeheadCommit.vue'
	export default {
		data() {
			return {
				activeName: 'first',
				myRoute: '',//转退补班提交信息
				orderDetails: '', //订单详情
				do_type: '', //操作类型用于判断退转补额
				order: {}, //子组件传的订单信息
				order_id: '', //订单id
			}
		},
		components:{
			orderDetails,
			returnClassCommit,  //退班
			classTransferCommit, //转班
			refundAmountCommit, //退额
			fillForeheadCommit, //补额
		},
		computed: {
			title() {
				let str = this.$route.params.name;
				if (str == 'returnClass') {
					this.do_type = 'exit'
					return '退班提交'
				} else if (str == 'classTransfer') {
					this.do_type = 'turn'
					return '转班提交'
				}else if(str === 'refundAmount'){
					this.do_type = 'refund'
					return '退额提交'
				}else if(str === 'fillForehead'){
					this.do_type = 'compensate'
					return '补额提交'
				}
				return '';
			}
		},
		mounted() {
			this.order_id = this.$route.query.order_id;
		},
		methods: {
			handleClick(tab, event){
				//切换 tab 导航
				if(Object.keys(this.order).length !== 3){
					if(tab === 'second'){
						this.order = this.$refs.detail.orderDetail;
						this.order.do_type = this.do_type;
					}
				}
			},
		}
	}
</script>

<style scoped>
</style>
