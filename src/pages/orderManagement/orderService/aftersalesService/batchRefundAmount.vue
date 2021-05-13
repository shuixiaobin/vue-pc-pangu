<template>
	<!-- 补退额-批量退额 -->
	<div>
		
		<div class="container-title">
			<h2>批量退额</h2>
		</div>
		
		<div class="container-Box">
			
			<el-form
				:model="ruleForm" 
				ref="ruleForm" 
				label-width="170px" 
				class="demo-ruleForm elForm"
			>
				
				<el-form-item style="margin-right: 30px;text-align: right;">
					<el-button size="small" type="primary" @click="downloadTemplate">下载模板</el-button>
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
				
				<el-form-item>
					<el-button 
						type="primary" 
						size="small" 
						@click="submitForm('ruleForm')"
						v-auth="'BTES_IMPORT'"
					>{{lulkImport}}</el-button>
				</el-form-item>
			
			</el-form>	
				
				
			<el-dialog title="批量退额导入结果" :visible.sync="dialogTableVisible">
			  <el-table :data="gridData">
			    <el-table-column property="orderNum" label="订单编号" width="150"></el-table-column>
			    <el-table-column property="code" label="是否成功" width="100">
						<template slot-scope="scope">
							<span v-if="scope.row.code == '1'" style="color: #13CE66;">成功</span>
							<span v-else style="color: #f40;">失败</span>
						</template>
					</el-table-column>
			    <el-table-column style="color: #f00;" property="message" label="原因"></el-table-column>
			  </el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="dialogTableVisible = false" size="small">确 定</el-button>
				</div>
			</el-dialog>	
			
		</div>
		
	</div>
</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	import { mapState } from 'vuex'
	export default{
		data(){
			return {
				ruleForm: {
					uploadFile: '', //上传文件的路径/名称
					fileList: [], //文件列表
				},
				loading: false, //加载中
				gridData: [], //批量退额导入结果
				dialogTableVisible: false,
			}
		},
		computed:{
			...mapState(['username']),
			lulkImport(){ //批量导入
				if(this.loading){
					return "正在执行，请稍后..."
				}else{
					return "批量导入"
				}
			}
		},
		methods:{
			downloadTemplate(){ //下载模板
				window.open(`${PANGU_URL}/v1/c/order/download?type=3`, '_parent')
			},
			httpRequest(param){ //自定义的上传实现
				// param是自带参数。 this.$refs.upload.submit() 会自动调用 httpRequest方法.在里面取得file
				let fileObj = param.file // 相当于input里取得的files
				let fd = new FormData()// FormData 对象
				fd.append('file', fileObj) //文件对象
				
				orderManage.postRefundUploadFile(fd, {'Content-Type': 'multipart/form-data'})
					.then(res => {
						this.ruleForm.uploadFile = res.data.file;
						this.$message.success('上传成功！')
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			submitUpload() { //上传文件
				this.$refs.upload.submit();
			},
			fileChange(file, fileList) {// fileList 是文件列表发生变化后，返回的修改后的列表对象
				this.ruleForm.fileList = [file];
			},
			handleRemove(file, fileList) { //移除文件时
				this.ruleForm.fileList = [];
			},
			submitForm(formName) { //批量导入
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						
						const obj = {
							operUser: this.$store.state.username, //操作人姓名
							excel: this.ruleForm.uploadFile, //上传文件名称
						}
						
						orderManage.postOrderRefundDoplay(obj)
							.then(res => {
								if(res.code > 0){
									this.$message.success('导入成功')
									this.gridData = res.data; //弹出的表格框
									this.dialogTableVisible = true;
								}else if(res.code <= 0){
									this.$message.error('请先上传文件！');
								}
								this.loading = false;
							})
							.catch(err => {
								this.$message.error(err)
								this.loading = false;
							})
						
						this.loading = false;
					} else {
						this.$message.error('error submit!!')
						return false;
					}
				});
			}
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
</style>
