<template>
	<!-- 填写完成信息后，提交成功页面 -->
	<div style="overflow: hidden;" v-if="params">
		<el-steps :active="2" space="30%" align-center>
			<el-step :title="params.title"></el-step>
			<el-step title="完成"></el-step>
		</el-steps>
		<div style="overflow: hidden;margin-top: 50px;">
			<el-steps :active="commitProgress" space="30%" align-center style="position: relative;left: 50%;transform: translateX(-30%);">
				<el-step title="填写退额信息"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
		</div>
		
		<div class="icon">
			<i class="el-icon-success"></i>
			<p class="icon-info">操作成功</p>
			<p style="color: #909399; font-size: 14px;">请等待审核老师的处理</p>
		</div>
		
		<div class="classInfo" v-if="parameter">
			<div>
				{{parameter.titleOne}}: <span>{{parameter.titleOneVal}}</span>
			</div>
			<div>
				{{parameter.titleTwo}}: <span>￥{{parameter.titleTwoVal}}</span>
			</div>
			<div>
				{{parameter.titleThree}}: <span>￥{{parameter.titleThreeVal}}</span>
			</div>
			<div v-if="parameter.titleFour">
				{{parameter.titleFour}}: <span>{{refundWay}}</span>
			</div>
			<div v-if="parameter.titleFive">
				{{parameter.titleFive}}: <span>{{confirmPayment}}</span>
			</div>
		</div>
		
		<div class="clsBtn">
			<el-button type="primary" @click="viewResule">查看提交结果</el-button>
			<el-button @click="returnPage">返回</el-button>
		</div>
		
	</div>
</template>

<script>
	export default{
		props: ['params'],
		data(){
			return {
				path: '', //返回的路径
				parameter: {}, //
				commitProgress: 2, //流程
			}
		},
		watch:{
			params(newVal){
				// console.log("params: " + newVal);
				this.parameter = newVal;
				console.log("params", params);
				if(this.parameter.name = 'classTransfer'){
					this.parameter.titleThreeVal = -this.parameter.titleThreeVal;
				}
			}
		},
		mounted() {
			let path = this.$route.path.split('/');	//取出根目录
			this.path = "/" + path[1] + "/" + path[2] + '/' + path[3];
			//当前的页面所有的字段都是由父组件传递过来的
			console.log('path: ', path);
			console.log('this.path: ', this.path);
			console.log('ref: ', this);
			this.parameter = this.$parent.params;
		},
		methods: {
			//返回，重新回到订单服务列表
			returnPage(){
				this.$router.push({path: this.path})
			},
			//查看提交结果
			viewResule(){
				//转班服务
				if(this.parameter.name === 'classTransfer'){
					this.$router.push({name: 'transferAudit'})
				}
			}
		},
		computed:{
			refundWay(){
				if(this.params.titleFourVal == 0){
					return '原路返回'
				}else if(this.params.titleFourVal == 1){
					return '手动退款'
				}
			},
			confirmPayment(){ //用户是否确认付款
				if(this.params.titleFiveVal == 0){
					return '否'
				}else if(this.params.titleFiveVal == 1){
					return '是'
				}
			}
		}
	}
</script>

<style scoped>
	.el-steps {
		margin-top: 40px;
		margin-bottom: 30px;
		position: relative;
		left: 50%;
		transform: translate(-31%);
	}
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
	.classInfo{
		margin: 32px 0;
		text-align: center;
		width: 480px;
		height: 100px;
		background-color: #F5F7FA;
		border-radius: 2px;
		box-sizing: border-box;
		position: relative;
		left: 50%;
		transform: translate(-50%);
	}
	.classInfo div{
		color: #606266;
		font-size: 14px;
		width: 48%;
		display: inline-block;
		text-align: left;
		padding: 16px 0 0px 26px;
	}
	.clsBtn{
		text-align: center;
	}
	
</style>
