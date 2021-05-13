<template>
	<!-- 成绩单照片上传 -->
	<el-dialog 
		class="proto-update" 
		title="提示" 
		:visible.sync="visible" 
		width="35%" 
		:before-close="handleCancel"
		:modal="modal"
	>
		<template #title>
			<p class="title">成绩单图片</p>
		</template>
		
		<div class="proto-update-container">
			<TearcherUpload 
				:imageUrl.sync="piceureSrc"
				ref="tearcherUpload"
			/>
			<span class="update" @click="handleUploadChange">上传更换</span>
		</div>
		
		<span slot="footer" class="dialog-footer">
			<el-button @click="handleCancel" size="small">取消</el-button>
			<el-button type="primary" @click="handleUpdate" size="small">更新</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import TearcherUpload from './TearcherUpload.vue'
	import { getProtoSaveProtocolStudent } from '@/api/orderManage.js'
	export default{
		props: {
			visible: Boolean,
			modal: {
				type: Boolean,
				default: true
			},
			transcriptObject: {
				type: Object,
				default: () => {}
			}
		},
		components: {
			TearcherUpload
		},
		data(){
			return {
				piceureSrc: ''
			}
		},
		watch:{
			visible(newVal){
				if(newVal){
					this.piceureSrc = this.transcriptObject.score_pic
				}
			}
		},
		methods: {
			handleCancel(){
				this.$emit('update:visible', false)
			},
			async handleUpdate(){
				if(!this.transcriptObject.protocol_student_id){
					this.$message.error('【暂无协议用户信息，请督促学员签署协议】')
					return;
				}
				this.transcriptObject.score_pic = this.piceureSrc;
				const params = {
					protocolStudentId: this.transcriptObject.protocol_student_id,
					stuInfo: this.transcriptObject.score_pic,
					actionType: '12',
					operatName: this.$store.state.username,
				}
				const resp = await getProtoSaveProtocolStudent(params)
				if(resp.data.status == 1 && resp.code == 10000){
					this.$message.success('上传成功')
				}else{
					this.$message.error('上传失败')
				}
				this.$emit('update:visible', false)
			},
			handleUploadChange(){ // 上传更换
				if(this.$refs.tearcherUpload.$refs.uploadI){
					this.$refs.tearcherUpload.$refs.uploadI.click();
				}else if(this.$refs.tearcherUpload.$refs.upLoadImg){
					this.$refs.tearcherUpload.$refs.upLoadImg.click();
				}
			}
		}
	}
</script>

<style>
	.proto-update .el-dialog__footer{
		border-top: 1px solid #ccc;
	}
</style>

<style scoped="scoped" lang="less">
	.proto-update-container{
		text-align: center;
		margin:20px 20px;
		
		span.update{
			display: block;
			text-align: right;
			margin-top: -30px;
			color: #1890ff;
			cursor: pointer;
		}
		
	}
	.title{
		font-size: 15px;
		font-weight: 600;
		border-bottom: 1px solid #ccc;
	}
	
</style>
