<template>
	<div>
		<!-- 批量代报名 在线 -->

		<!-- 注意事项 下载模板 -->
		<Notes
			@handleClick="handleClick"
		/>
		<el-form 
			:model="ruleForm" 
			:rules="rules" 
			ref="ruleForm" 
			label-width="170px" 
			class="demo-ruleForm elForm"
		>
			
			<el-form-item label="订单渠道:" prop="orderChannel">
				<el-select v-model="ruleForm.orderChannel" placeholder="请选择赠课原因">
					<el-option label="有赞微小店" value="34"></el-option>
					<el-option label="天猫" value="36"></el-option>
					<el-option label="京东" value="37"></el-option>
					<el-option label="图书公司" value="39"></el-option>
					<el-option label="分校" value="8"></el-option>
				</el-select>
			</el-form-item>
		
			<el-form-item label="选择文件" prop="uploadFile">
				<el-upload
					class="upload-demo clear"
					ref="upload"
					accept=".xls,.xlsx"
					action=""
					:with-credentials="true"
					:on-change="fileChange"
					:on-remove="handleRemove"
					:file-list="ruleForm.fileList"
					:http-request="httpRequest"
					:auto-upload="false"
				>
					<el-button 
						slot="trigger" 
						size="small" 
						type="primary"
					>选取文件</el-button>
					<span 
						class="el-upload__tip" 
						style="position: relative;top: -15px;"
						v-show="ruleForm.fileList.length == 0"
					>未选择任何文件</span>
					<br>
				</el-upload>
				<el-button 
					size="small" 
					type="success" 
					@click="submitUpload"
					:disabled="ruleForm.fileList.length == 0"
				>上传</el-button>
				<span class="el-upload__tip">(上传格式为.xls,xlsx)</span>
			</el-form-item>
		
			<el-form-item label="选择上传文件:" prop="uploadFile">
				<el-col :span="8">
					<el-input v-model="ruleForm.uploadFile" placeholder="显示上传文件的路径"></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item>
				<el-button 
					type="primary" 
					size="small" 
					@click="submitForm('ruleForm')"
				>{{lulkImport}}</el-button>
			</el-form-item>
		</el-form>
		
		<!-- 批量代报名结果 -->
		<failPopout 
			ref="popout"
			:onLine="onLine"
			title="批量代报名结果"
		/>
		
	</div>
</template>

<script>
	import Notes from './Notes.vue'
	import * as orderManage from '@/api/orderManage.js'
	import failPopout from './failPopout.vue'
	import { mapState } from 'vuex'
	export default{
		components:{
			failPopout,
			Notes
		},
		data(){
			return{
				ruleForm: {
					orderChannel: '34', //订单渠道
					uploadFile: '', //上传文件的路径/名称
					fileList: [], //文件列表
				},
				onLine: [], //传给批量代报名结果弹框的值
				loading: false, //加载中
				rules: {
					orderChannel: [{ //订单渠道
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					uploadFile: [{ //上传文件的路径
						required: true,
						message: '请选择上传文件',
						trigger: 'blur'
					},{ 
						required: true,
						message: '请选择上传文件',
						trigger: 'change'
					}]
				}
			}
		},
		computed:{
			...mapState(['username', 'userid']),
			lulkImport(){ //批量导入
				if(this.loading){
					return "正在执行，请稍后..."
				}else{
					return "批量导入"
				}
			}
		},
		methods: {
			httpRequest(param){ //自定义的上传实现
				// param是自带参数。 this.$refs.upload.submit() 会自动调用 httpRequest方法.在里面取得file
				let fileObj = param.file // 相当于input里取得的files
				let fd = new FormData()// FormData 对象
				fd.append('file', fileObj) //文件对象
				
				orderManage.postUploadFile(fd, {'Content-Type': 'multipart/form-data'})
					.then(res => {
						this.ruleForm.uploadFile = res.data.file;
					})
					.catch(err => {
						this.$message.error(err)
						console.log('err: ', err);
					})
			},
			submitUpload() { //上传文件
				this.$refs.upload.submit();
			},
			fileChange(file, fileList) {// fileList 是文件列表发生变化后，返回的修改后的列表对象
				this.ruleForm.fileList = [file];
			},
			handleClick(bool){ //如果点击了下载模板就请求接口 下载文件
				if(bool === true){
					window.open(`${PANGU_URL}/v1/c/order/download?type=1`, '_parent')
				}
			},
			handleRemove(file, fileList) { //移除文件时
				this.ruleForm.fileList = [];
			},
			submitForm(formName) { //批量导入
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						
						const obj = {
							adminId: this.$store.state.userid, //操作人id
							adminName: this.$store.state.username, //操作人姓名
							excel: this.ruleForm.uploadFile, //上传文件名称
							OrderOrigin: this.ruleForm.orderChannel, //订单渠道
						}
						orderManage.postBatchGmatOnline(obj)
							.then(res => {
								// console.log('res: ', res);
								this.onLine = res.data;
								this.$refs.popout.dialogTableVisible = true; //点击提交时,调用子组件.
							})
							.catch(err => {
								console.log('err: ', err);
								this.$message.error(err)
							})
						this.loading = false;
					} else {
						// console.log('error submit!!');
						this.$message.error('error submit!!')
						return false;
					}
				});
			},
		}
	}
</script>

<style scoped="scoped">
	.elForm{
		margin-left: 100px;
		margin-bottom: 100px;
	}
	.elForm .el-form-item{
		margin: 20px 0px;
	}
	.clear >>> .el-upload--text{
		border: 0; 
		width: inherit;
		height: inherit;
	}
	.clear >>> li{
		width: 400px;
	}
	.clear >>> li:hover{
		background-color: #e4e8ff;
	}
	/* .clear 
		/deep/.el-upload--text{
		border: 0; 
		width: inherit;
		height: inherit;
	} */
</style>	
