<template>
	<div>
		<!-- 注意事项 -->
		<div class="background">
			<div>
				<span>注意事项:</span><br>
				<span>①请务必先下载模板，按格式填写后再导入；</span>
				<el-button style="color: #1890ff;" size="small" @click="handleClick">下载模板</el-button>
			</div>
		</div>
		
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			handleClick(){ //点击之后告诉父级，让父级去请求数据
				this.$emit('handleClick', true)
			}
		}
	}
</script>

<style scoped="scoped">
	.background{
		margin-top: 10px;
		background-color: #00c0ef;
		border-bottom-color:rgb(0, 172, 214);
	}
	.background div{
		padding: 15px 30px 15px 15px;
		position: relative;
		font-size: 14px;
		color: #FFF;
	}
	.background button{
		position: absolute;
		right: 50px;
		top: 31%;
		
	}
	
</style>
