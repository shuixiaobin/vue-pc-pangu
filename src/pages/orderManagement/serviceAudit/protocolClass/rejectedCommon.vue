<template>
	<!-- 驳回 -->
	<el-dialog
	  title="驳回原因"
	  :visible.sync="visible"
	  width="30%"
	  :before-close="handleClose">
		
	  <div class="protocol-body">
			<div class="protocol-body-title">
				<span style="color: #f40;">*</span>驳回原因（不得超过100字）
			</div>
			<el-input
				type="textarea"
				:rows="5"
				placeholder="请输入内容"
				v-model="textarea"
				:maxLength="100"
			>
			</el-input>
		</div>
		
	  <span slot="footer" class="dialog-footer">
	    <el-button type="primary" @click="handleClick" size="small">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
import { postTreatyRefund } from '@/api/orderManage'
	export default {
		props: {
			visible: {
				type: Boolean
			},
			orderNum: {
				type: [String, Number]
			},
			itemId: {
				type: [String, Number]
			},
		},
		data(){
			return {
				textarea: ''
			}
		},
		methods: {
			handleClose(){
				this.$emit('update:visible', false)
			},
			handleClick(){
				if( this.textarea.length === 0 ){
					this.$message.error('请先输入内容在提交！')
				} else {
					const params = {
						itemId: this.itemId,
						orderNum: this.orderNum,
						remark: this.textarea,
						operUser: this.$store.state.username,
					}
					postTreatyRefund(params).then(res => {
						if (res.code === 10000) {
							this.$emit('rejected');
							this.$alert('', '操作成功', {
								center: true,
								type: 'success'
							})
						} else {
							this.$alert(res.msg, '操作失败', {
								center: true,
								type: 'errror'
							})
						}
					}).catch(e => {
							this.$alert(e, '操作失败', {
								center: true,
								type: 'error'
							})
					});
				}
				this.$emit('update:visible', false)
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.protocol-body{
		font-size: 14px;
		width: 85%;
		margin: 0 auto;
		
		.protocol-body-title{
			margin-bottom: 10px;
		}
		
	}
</style>
