<template>
	<div>
		<el-dialog
		  width="50%"
		  :visible.sync="dialogVisible"
			:before-close="handleClick"
		>
			<div slot="title" class="contentTitle">
				转移协议到另一个订单
			</div>
		
			<div>
				请输入要把此协议转移到该学员已付费的订单号：
				<el-input v-model="input" placeholder="请输入内容" size="small" style="width: 200px;"></el-input>
				<el-button size="small">转移协议</el-button>
			</div>
			
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="handleClick" size="small">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				dialogVisible: false,
				input: ''
			}
		},
		methods:{
			handleClick(){
				this.dialogVisible = false
			}
		}
	}
</script>

<style scoped="scoped">
	.contentTitle{
		font-size: 14px;
		border-bottom: 1px solid #ccc;
	}
	.font12{
		margin: 5px 0;
		font-size: 12px;
		color: rgba(0, 0, 0, .6);
	}
	.font12 span{
		margin-right: 20px;
	}
</style>
