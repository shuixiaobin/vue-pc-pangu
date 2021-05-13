<template>
	<!-- 补充信息类型确认切换提示 -->
	<el-dialog
	  title="提示"
	  :visible.sync="visible"
	  width="40%"
	  :before-close="handleClose"
		:modal="modal"
	>
		
		<template #title>
			<p class="title">确认切换提示</p>
		</template>
		
	  <div class="protocol-audit-body">
			<div>
				<p>您确定切换学员补充信息类型吗？</p>
				<p>切换后后续内容为空，需要您填写</p>
			</div>
		</div>
		
	  <span slot="footer" class="dialog-footer">
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
			modal: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			handleClose(){
				this.$emit('update:visible', false)
			},
			handleClick(){
				this.$emit('update:visible', false)
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
