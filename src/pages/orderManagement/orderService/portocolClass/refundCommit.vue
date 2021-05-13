<template>
	<!-- 退费提交 -->
	
	<div>
		
		<div style="overflow: hidden;margin-top: 50px;">
			<el-steps :active="commitProgress" space="30%" align-center style="position: relative;left: 50%;transform: translateX(-30%);">
				<el-step title="填写退费信息"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
		</div>
		
		<div class="body" v-show="commitProgress == 1">
			
			<el-form ref="form" :model="form" label-width="190px" :rules="rules">
				<el-form-item label="订单编号: ">
					<span>{{form.orderNum}}</span>
				</el-form-item>
				
				<el-form-item label="退费原因: " prop="refundType">
					<el-select v-model="form.refundType" placeholder="请选择" size="small">
						<el-option label="请选择" value="0"></el-option>
						<el-option label="学员没通过" value="1"></el-option>
						<el-option label="有赞小店" value="2"></el-option>
						<el-option label="支付平台超时无法原路返回" value="3"></el-option>
					</el-select>
				</el-form-item>
				
				<div v-if="form.refundType == '1'">
					<el-form-item label="原班实收金额: ">
						<span v-if="form.oldMoney || form.oldMoney == 0">￥{{moneyFormat(form.oldMoney)}}</span>
					</el-form-item>
					
					<el-form-item label="提交退费申请单: " prop="refundFormUrl">
						<el-upload
						  class="avatar-uploader"
						  :action="actionUrl" 
						  name="files" 
						  :show-file-list="true" 
						  :on-success="handleSuccess"
							:on-remove="handleRemove"
							:limit="1"
						>
							<!-- :with-credentials="true" -->
						  <el-button size="small">选择文件</el-button>
							<!-- <span style="font-size: 12px;">仅支持：.rar、.zip格式</span> -->
						</el-upload>
					</el-form-item>
					
					<el-form-item label="图书、课时及申论批改扣费: " prop="reducePrice">
						<el-input v-model="form.reducePrice" placeholder="请输入" size="small"></el-input>
					</el-form-item>
					
					<el-form-item label="实退班金额: " prop="turnMoney">
						<el-input v-model="form.turnMoney" placeholder="请输入" size="small"></el-input>
					</el-form-item>
					
					<el-form-item label="退款方式: " prop="isMakeSure">
						<el-radio-group v-model="form.isMakeSure" size="small">
							<el-radio label="1">原路退回</el-radio>
							<el-radio label="0">手动退款</el-radio>
						</el-radio-group>
					</el-form-item>
					
					<el-form-item label="退款去向: " prop="turnToAdmin">
						<el-radio-group v-model="form.turnToAdmin" size="small">
							<el-radio label="0">退给学员</el-radio>
							<el-radio label="1">退给代报管理员虚拟账户</el-radio>
						</el-radio-group>
					</el-form-item>
					
					<el-form-item label="备注: " prop="remark">
						<el-input type="textarea" v-model="form.remark" placeholder="请输入" size="small"></el-input>
					</el-form-item>
				</div>
				
				<el-form-item>
					<el-button type="primary" @click="onSubmit('form')" size="small" v-show="form.refundType != 0">提交</el-button>
				</el-form-item>
				
				<p 
					v-if="form.refundType == '2' || form.refundType == '3'"
					style="font-size: 14px;"
				>请提交OA流程，本订单审核通过后将自动改为退班订单状态</p>
				
				
			</el-form>	
			
		</div>
		
		<submit-success
			v-show="commitProgress == 2"
			:successData="successData"
		/>
		
	</div>

</template>

<script>
	import submitSuccess from './submitSuccess.vue'
	import {mapState} from 'vuex'
	import { getProtoAgreementRefundInfo } from '@/api/orderManage.js'
	export default{
		props: {
			refundInfo: Object
		},
		components: {submitSuccess},
		data(){
			let valiNumberPass1 = (rule, value, callback) => { //包含小数的数字
				let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
				if (value === '') {
					callback(new Error('请输入退额金额'));
				} else if (!reg.test(value)) {
					callback(new Error('请输入数字'));
				} else {
					callback();
				}
			};
			return {
				actionUrl: `${PANGU_URL}/v1/c/schserver/upload`,
				commitProgress: 1, //完成进度
				successData: {}, //操作成功的数据
				form: {
					orderNum: '', //订单编号
					refundType: '0', //退费原因
					oldMoney: '', //原班实收金额
					reducePrice: '', //图书、课时及申论批改扣费
					turnMoney: '', //实退班金额
					isMakeSure: '1', //退款方式
					turnToAdmin: '0', //退款去向
					remark: '', //备注
					refundFormUrl: '', //提交退费申请单
				},
				rules: {
					refundType: [{
						required: true,
						message: '请选择退费原因',
						trigger: 'change',
					}],
					turnMoney: [{
						required: true,
						message: '请输入实际的退额金额',
						trigger: 'blur',
						validator: valiNumberPass1,
					}],
					isMakeSure: [{
						required: true,
						message: '请选择退款方式',
						trigger: 'change'
					}],
					turnToAdmin: [{
						required: true,
						message: '请选择退款去向',
						trigger: 'change'
					}],
					remark: [{
						required: true,
						message: '请输入备注信息',
						trigger: 'blur'
					}],
					refundFormUrl: [{
						required: true,
						message: '请选择要上传的文件',
					}]
				}
			}
		},
		computed: {
			...mapState(['username']),
			moneyFormat(){ //将传过来的金额按照格式用逗号分割
				return function(number){
					if(number || number == 0){
						const strNumber = number.toString().substring(0, number.toString().indexOf('.') + 3)
						const numberArr = strNumber.split('.')
						let num1 = numberArr[0];
						let num2 = numberArr.length > 1 ? '.' + numberArr[1] : '';
						num1 = num1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						
						return num1 + num2;
					}
					return ""
				}
			},
		},
		watch: {
			refundInfo(newVal){
				this.form.orderNum = newVal.orderNum;
				this.form.oldMoney = newVal.oldMoney;
			},
		},
		methods:{
			onSubmit(formName){ // 提交
				this.$refs[formName].validate((valid) => {
					if (valid) {
						const params = {
							...this.form,
							orderId: this.refundInfo.orderId,
							classId: this.refundInfo.classId,
							userName: this.refundInfo.userName,
							operUser: this.username, // 操作人
							isConfirm: '0', // 是否需要学员确认
							isZengSong: '0', // 是否赠送
						}
						if(this.form.refundType == 1){
							params.operationReason = "学员没通过"
						}else if(this.form.refundType == 2){
							params.operationReason = "有赞小店"
						}else if(this.form.refundType == 3){
							params.operationReason = "支付平台超时无法原路返回"
						}
						const yzParams = {
							...params,
							isMakeSure: '',
							turnToAdmin: ''
						}
						if(this.form.refundType == 1){ // 学员没通过
							getProtoAgreementRefundInfo(params)
								.then(res => {
									if(res.code === 10000){
										this.successData = res.data;
										this.$message.success('提交成功')
										this.commitProgress = 2;
									}else {
										this.$message.error(res.msg)
									}
								})
								.catch(err => {
									this.$message.error(err)
								})
						}
						
						if(this.form.refundType == 2 || this.form.refundType == 3){
							getProtoAgreementRefundInfo(yzParams)
								.then(res => {
									if(res.code === 10000){
										this.successData = res.data;
										this.$message.success('提交成功')
										this.commitProgress = 2;
									}else {
										this.$message.error(res.msg)
									}
								})
								.catch(err => {
									this.$message.error(err)
								})
						}
						
					} else {
						return false;
					}
				});
			},
			handleSuccess(fileUrl){ // 上传文件
				if(fileUrl.code < 0){
					this.$message.error(fileUrl.msg)
				}else{
					this.form.refundFormUrl = fileUrl.data.src;
					this.$refs.form.validateField('refundFormUrl', err => {})
				}
			},
			handleRemove(){
				this.form.refundFormUrl = "";
			}
		}
	}
</script>

<style scoped="scoped">
	.body {
		width: 500px;
		margin: 0 auto;
		margin-bottom: 80px;
		position: relative;
		right: 50px;
	}
</style>
