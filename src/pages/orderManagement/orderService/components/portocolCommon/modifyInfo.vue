<template>
	<!-- 修改信息弹出框 -->
	<el-dialog title="修改个人认证信息" :visible="visible" :before-close="handleCancel">
	  
		<template slot="title">
			<p class="title">修改个人认证信息</p>
		</template>
		
		<el-form 
			:rules="rules" 
			:model="form"
			ref="ruleForm"
			label-width="120px"
		>
	  
			<el-form-item label="姓名: " prop="userName">
	      <el-input class="input-width" v-model="form.userName"></el-input>
	    </el-form-item>
			
			<el-form-item label="手机号: " prop="mobile">
			  <el-input class="input-width" maxlength="11" v-model="form.mobile"></el-input>
			</el-form-item>
			
			<el-form-item label="身份证号: " prop="idCard">
	      <el-input class="input-width" maxlength="18" v-model="form.idCard"></el-input>
	    </el-form-item>

			<el-form-item v-if="paymentMode == 3 || paymentMode == 4" label="准考证号: " prop="examCardCode">
	      <el-input class="input-width" v-model="form.examCardCode"></el-input>
	    </el-form-item>

			<el-form-item v-if="paymentMode == 2 || paymentMode == 4" label="省份: " prop="province">
				<el-select v-model="form.province" placeholder="请选择">
					<el-option
						v-for="item in provinceList"
						:key="item.id"
						:value="item.province"
						:label="item.province">
					</el-option>
				</el-select>
	    </el-form-item>
		
		</el-form>
	  
		<div slot="footer" class="dialog-footer">
	    <el-button @click="handleCancel" size="small">取 消</el-button>
	    <el-button :disabled="editFlag" type="primary" @click="submitForm('ruleForm')" size="small">确定并发起重新签署</el-button>
	  </div>
	
	</el-dialog>
</template>

<script>
	import { getDictionaries, getProtoUserInfo, postProtoPersonalInfomation } from '@/api/orderManage'
	export default{
		props:{
			visible: Boolean,
		},
		data(){
			return {
				form: {},
				defaultInfo: {}, // 用来判断有没有修改过
				provinceList: [],
				rules: {
					userName: [{ 
						required: true, 
						message: '请输入姓名', 
						trigger: 'blur',
					},{
						pattern: /^[\u4e00-\u9fa5]{2,4}$/,
						message: '请输入正确的姓名'
					}],
					mobile: [{
						required: true,
						message: '请输入手机号', 
						trigger: 'blur',
					},{
						pattern: /^[1][0-9]{10}$/,
						message: '请输入正确的手机号'
					}],
					idCard: [{
						required: true,
						message: '请输入身份证号', 
						trigger: 'blur',
					},{
						pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
						message: '请输入正确的身份证号'
					}],
					examCardCode: [{
						required: true,
						message: '请输入准考证号', 
						trigger: 'blur',
					}],
					province: [{
						required: true,
						message: '请选择省份', 
						trigger: 'blur',
					}]
				}
			}
		},
		computed: {
			editFlag() {
				for(const key in this.form) {
					if (this.form[key] !== this.defaultInfo[key]) {
						return false;
					}
				}
				return true;
			},
			orderId(){
				return this.$route.query.orderId
			},
			paymentMode(){ // 付费模式
				/**
				 * payType		支付模式：1全款2预收
				 * islType		申论类型： 1申论0普通
				 * 
				 * payType		动作类型 ：１全款普通２全款申论3预收普通4预收申论
				 */
				// return 4
				if(this.form.payType == 1 && this.form.islType == 1){
					return 2; // 全款申论
				}else if(this.form.payType == 1 && this.form.islType == 0){
					return 1; // 全款普通
				}else if(this.form.payType == 2 && this.form.islType == 1){
					return 4; // 预收申论
				}else if(this.form.payType == 2 && this.form.islType == 0){
					return 3; // 预收普通
				}
			}
		},
		watch: {
			visible (value) {
				if (value) {
					this.initForm();
				}
			}
		},
		created() {
			this.getProvinceList();
		},
		methods: {
			initForm () {
				const params = {
					orderId: this.$route.query.orderId,
					classId: this.$route.query.classId,
					infoType: 1
				}
				getProtoUserInfo(params)
					.then(res => {
						if(res.data){
							this.form = res.data;
							this.defaultInfo = JSON.parse(JSON.stringify(res.data));
							
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
				
				
			},
			getProvinceList () {
				getDictionaries({types: 'province'}) //请求省份
					.then(res => {
						this.provinceList = res.data.province
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			handleCancel(){
				this.$emit('update:visible', false)
			},
			submitForm(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						delete this.form.islType;
						const params = {
							...this.form,
							orderId: this.orderId,
							payType: this.paymentMode
						}
						
						postProtoPersonalInfomation(params)
							.then(res => {
								if(res.code == 10000 && res.data > 0){
									this.$message.success('保存成功')
									this.$emit('update:visible', false)
								}else{
									this.$message.error(res.msg)
								}
							})
							.catch(err => {
								this.$message.error(err)
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			}
		}
	}
</script>

<style scoped="scoped">
	.input-width{
		width: 300px;
	}
	.title{
		font-size: 15px;
		font-weight: 600;
		border-bottom: 1px solid #ccc;
	}
</style>
