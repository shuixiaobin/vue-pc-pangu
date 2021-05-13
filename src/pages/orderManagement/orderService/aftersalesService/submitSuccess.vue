<template>
	<!-- 填写完成信息后，提交成功页面 -->
	<div>
		
		<div class="icon">
			<i class="el-icon-success"></i>
			<p class="icon-info">操作成功</p>
			<p style="color: #909399; font-size: 14px;">请等待审核老师的处理</p>
		</div>
		
		<div class="body">
			<el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="原班ID: ">
					<span>{{form.classId}}</span>
				</el-form-item>
				
				<el-form-item label="原班实收金额: ">
					<span>{{form.newClassMoney}}</span>
				</el-form-item>
			
				<el-form-item label="退额金额: ">
					<span>{{form.amount}}</span>
				</el-form-item>
				
				<el-form-item label="退回方式: ">
					<span>{{form.isMakeSure}}</span>
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
				form: {
					classId: '',//原班id
					newClassMoney: '', //原班实收金额
					amount: '', //退额金额
					isMakeSure: '', //退回方式
				}
			}
		},
		watch:{
			successData(newVal){
				console.log(newVal);
				this.form.amount = newVal.amount;
				this.form.classId = newVal.classId;
				this.form.isMakeSure = newVal.isMakeSure;
				this.form.newClassMoney = newVal.newClassMoney;
			}
		},
		methods:{
			viewResule(){//查看提交结果
				this.$router.push({
					path: '/orderManagement/serviceAudit/refundAudit',
					query: {source: "orderService"}
				})
			},
			returnPage(){// 返回
				this.$router.push({
					path: '/orderManagement/orderService/aftersalesService'
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
