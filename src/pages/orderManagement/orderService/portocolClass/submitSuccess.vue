<template>
	<!-- 填写完成信息后，提交成功页面 -->
	<div>
		
		<div class="icon">
			<i class="el-icon-success"></i>
			<p class="icon-info">操作成功</p>
			<p style="color: #909399; font-size: 14px;">请等待审核老师的处理</p>
		</div>
		
		<div class="body">
			<el-form ref="form" :model="successData" label-width="100px">
				<el-form-item label="原班ID: ">
					<span>{{successData.classId}}</span>
				</el-form-item>
				
				<el-form-item label="原班实收金额: ">
					<span v-if="successData.newClassMoney">￥{{successData.newClassMoney}}</span>
				</el-form-item>
			
				<el-form-item label="退额金额: ">
					<span v-if="successData.amount">￥{{successData.amount}}</span>
				</el-form-item>
				
				<el-form-item label="退回方式: ">
					<span>{{successData.isMakeSure}}</span>
				</el-form-item>
				
			</el-form>
			
			<div class="clsBtn">
				<el-button type="primary" @click="viewResule" size="small">查看提交结果</el-button>
				<el-button @click="returnPage" size="small">返回</el-button>
			</div>
		</div>
		
	</div>
</template>

<script>
	export default{
		props:['successData'],
		data(){
			return {
			}
		},
		methods:{
			viewResule(){//查看提交结果
				this.$router.push({
					path: '/orderManagement/serviceAudit/portocolRefundAudit',
				})
			},
			returnPage(){// 返回
				this.$router.push({
					path: '/orderManagement/orderService/portocolClass'
				})
			}
		}
	}
</script>

<style scoped>
	.icon{
		text-align: center;
	}
	.icon p{
		margin: 5px;
	}
	.icon-info{
		color: #24B366;
		font-size: 18px;
		font-weight: 500;
	}
	.el-icon-success{
		color: #24B366;
		display: inline-block;
		font-size: 48px;
	}
	.clsBtn{
		text-align: center;
	}
	.body {
		width: 300px;
		margin: 0 auto;
		margin-bottom: 80px;
	}
</style>
