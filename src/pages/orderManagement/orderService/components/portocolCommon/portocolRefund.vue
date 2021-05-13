<template>
	<!-- 协议退费申请表 -->

	<el-dialog title="协议退费申请表" :visible.sync="visible" width="70%" :before-close="handleCancel">

		<template #title>
			<p class="title">协议退费申请表</p>
		</template>

		<applyTable v-if="returnType == 1" :info="info" />
		
		<p class="kefuUpload" v-else-if="returnType == 2">客服后台上传，打包下载即可</p>
		
		<p style="text-align: center;font-size: 18px;color: #999;" v-else>暂无数据</p>
		
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCancel" size="small">取 消</el-button>
			<el-button 
				type="primary" 
				@click="packToDownload" 
				size="small"
				:disabled="returnType == 0"
			>打包下载</el-button>
		</div>

	</el-dialog>


</template>

<script>
	import { getProtoApplicationForm, getProtoZipDownload } from '@/api/orderManage.js'
	import applyTable from '../../../serviceAudit/components/applyTable.vue'
	export default {
		components: {applyTable},
		props:{
			visible: Boolean
		},
		data() {
			return {
				dialogTableVisible: false,
				info: {},
				returnType: 0
			}
		},
		computed: {
			orderId(){
				return this.$route.query.orderId
			}
		},
		watch: {
			visible(newVal){
				if(newVal === true){
					this.requestData()
				}
			}
		},
		methods: {
			requestData(){
				const params = {order_id: this.orderId}
				getProtoApplicationForm(params)
					.then(res => {
						if (res.code == 10000) {
							if (res.data.returnType == 1) {
								// 学生
								this.info = res.data
								this.returnType = 1
							} else if (res.data.res.data.returnType == 2) {
								// 客服
								this.info = res.data
								this.returnType = 2
								this.packToDownload();
							} else {
								// 不存在
								this.returnType = 0
							}
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			handleCancel(){
				this.$emit('update:visible', false)
			},
			packToDownload(){ // 打包下载
				const params = {order_id: this.orderId}
				getProtoZipDownload(params)
					.then(res => {
						if (res.code == 10000) {
							let link = document.createElement("a");
							link.href = res.data.zip_path;
							link.click();
						} else {
							this.$message.error(res.msg);
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
				// this.$emit('update:visible', false)
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.title {
		font-size: 15px;
		font-weight: 600;
		border-bottom: 1px solid #ccc;
	}

	.application-form {

		
		padding-bottom: 30px;

		.header {
			text-align: center;
			font-size: 18px;
			font-weight: bold;
		}

		.date {
			text-align: right;
			font-weight: bold;
			margin-right: 20px;
		}

		.info {

			margin-left: 100px;

			.head-line {
				width: 80px;
				font-size: 17px;
				font-weight: bold;
				display: inline-block;
			}

			.line20 {
				line-height: 20px;
			}

			.style1 {
				vertical-align: top;
			}

		}
	}
	.sub-title{
		margin-left: 50px;
		margin-top: 20px;
		
		.subtitle{
			font-size: 16px;
		}
		
		.head-line {
			font-size: 17px;
			font-weight: bold;
		}
		
	}
	
	.kefuUpload{
		font-size: 20px;
		text-align: center;
	}
	
</style>
