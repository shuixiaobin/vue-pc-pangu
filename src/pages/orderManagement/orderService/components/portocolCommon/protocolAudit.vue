<template>
	<!-- 协议订单是否审核 -->
	<el-dialog
	  title="提示"
	  :visible.sync="visible"
	  width="40%"
	  :before-close="handleClose">
		
		<template #title>
			<p class="title">确认审核提示</p>
		</template>
		
	  <div class="protocol-audit-body">
			<div>
				<p>您确定学员信息符合招生标准吗？</p>
				<p>审核后学生将无法修改信息</p>
			</div>
		</div>
		
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="handleClose" size="small">取 消</el-button>
	    <el-button type="primary" @click="handleClick" size="small">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	export default {
		props: {
			visible: {
				type: Boolean
			},
			auditObject: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			handleClose(){
				this.$emit('cancelVisible', false, false)
			},
			handleClick(){
				this.$emit('cancelVisible', false, true, this.auditObject)
			}
		}
	}
</script>

<style scoped="scoped">
	.title{
		font-size: 15px;
		font-weight: 600;
		border-bottom: 1px solid #ccc;
	}
	.protocol-audit-body{
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 18px;
		height: 180px;
	}
</style>
