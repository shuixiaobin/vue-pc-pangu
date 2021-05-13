<template>
	<div>
		<el-dialog
			title="订单服务申请记录"
		  width="50%"
		  :visible.sync="visible"
			:before-close="() => $emit('update:visible', false)"
		>
			<el-timeline>
				<el-timeline-item
					v-for="(activity, index) in activities"
					:key="index"
					:color="activity.resultText==='驳回'?'#f5222d':'#359bf8'"
				>
					<div>
						<p class="activity-item__title" style="">
							{{activity.logType}}———{{activity.resultText}}———{{activity.OperTime}}
						</p>
						<p class="activity-item__content">
							<span>原班ID: {{activity.ClassRid}}</span><span>原班实收金额：￥{{activity.MoneyReceipt}}</span>
							<span>实退金额：￥{{activity.turnbackMoney}}</span><span>退回方式：{{activity.IsMakeSure}}</span>
						</p>
						<p class="activity-item__content">
							<span>退班原因：{{activity.reason}}</span><span>备注：{{activity.remarkNote}}</span>
						</p>
					</div>
				</el-timeline-item>
			</el-timeline>
			
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="handleClick" size="small">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>	
import { getRefundLog } from '@/api/orderManage'

	export default{
		props: {
			visible: Boolean,
			item: Object,
		},
		data(){
			return{
				activities: [],
			}
		},
		watch: {
			visible (value) {
				if (value && this.item) {
					getRefundLog({orderNo: this.item.OrderNum}).then(res => {
						if (res.code == 10000) {
							this.activities = res.data;
						}
					})
				}
			}
		},
		methods:{
			handleClick(){
				this.$emit('update:visible', false)
			}
		}
	}
</script>

<style scoped="scoped">
  .activity-item__title {
		font-size: 16px;
		color: rgba(0, 0, 0, .7);
	}
	.activity-item__content{
		margin: 5px 0;
		font-size: 14px;
		color: rgba(0, 0, 0, .6);
	}
	.activity-item__content span{
		margin-right: 20px;
	}
</style>
