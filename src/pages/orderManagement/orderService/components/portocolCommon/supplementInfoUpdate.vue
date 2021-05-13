<template>
	<!-- 修改补充信息-准考证照片上传 -->
	<el-dialog 
		class="proto-update" 
		title="提示" 
		:visible.sync="visible" 
		width="35%" 
		:before-close="handleCancel"
		:modal="modal"
	>
		<template #title>
			<p class="title">准考证图片</p>
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
			tableData: {
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
		watch: {
			visible(newVal){
				if(newVal){
					this.piceureSrc = this.tableData.examCardCodePic;
				}
			}
		},
		methods: {
			handleCancel(){
				this.$emit('update:visible', false)
			},
			async handleUpdate(){
				this.tableData.examCardCodePic = this.piceureSrc;
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
