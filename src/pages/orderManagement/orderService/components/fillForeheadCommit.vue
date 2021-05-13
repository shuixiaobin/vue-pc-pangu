<template>
	<!-- 补额提交 -->
	<div style="overflow: hidden;">
		<el-steps :active="commitProgress" space="30%" align-center>
			<el-step title="填写补额信息"></el-step>
			<el-step title="完成"></el-step>
		</el-steps>

		<el-form 
			v-if="commitProgress == 1"
			:label-position="labelPosition" 
			:rules="rules" 
			ref="ruleForm" 
			label-width="40%" 
			size="small" 
			:model="ruleForm"
		>
			<el-form-item label="原订单编号: ">
				<span>{{ruleForm.order_no}}</span>
			</el-form-item>

			<el-form-item label="课程标题: ">
				<span>{{ruleForm.netclass_titles}}</span>
			</el-form-item>

			<el-form-item label="原班实收金额: ">
				<span>￥{{moneyFormat(ruleForm.receipt_money)}}</span>
			</el-form-item>

			<el-form-item label="补额金额: " prop="compensate_price">
				<el-col :span="8">
					<el-input 
						v-model.trim="ruleForm.compensate_price" 
						placeholder="请输入"
					></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="用户电话: " prop="user_mobile">
				<el-col :span="8">
					<el-input 
						v-model="ruleForm.user_mobile" 
						placeholder="请输入"
					></el-input>
				</el-col>
			</el-form-item>

			<el-form-item label="所属地区: " prop="area">
				<el-col :span="4" style="margin: 0 5px 0 0">
					<el-input 
						v-model="ruleForm.province" 
						placeholder="请输入省份"
					></el-input>
				</el-col>
				<el-col :span="4" style="margin: 0 5px;">
					<el-input 
						v-model="ruleForm.city" 
						placeholder="请输入城市"
					></el-input>
				</el-col>
				<el-col :span="4" style="margin: 0 5px;">
					<el-input 
						v-model="ruleForm.area" 
						placeholder="请输入地区"
					></el-input>
				</el-col>
			</el-form-item>

			<el-form-item label="用户地址: " prop="address">
				<el-col :span="8">
					<el-input 
						v-model="ruleForm.address" 
						placeholder="请输入"
					></el-input>
				</el-col>
			</el-form-item>

			<el-form-item label="补额原因: " prop="whyBackClass">
				<el-select v-model="ruleForm.whyBackClass" placeholder="请选择补额原因">
					<el-option
						v-for="(item, key) in ruleForm.reasons"
						:key="key"
						:label="item"
						:value="key"
					></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="备注: " prop="note">
				<el-col :span="10">
					<el-input 
						type="textarea" 
						v-model="ruleForm.note" 
						placeholder="请输入" 
						cols="20" 
						rows="3"
					>
					</el-input>
				</el-col>
			</el-form-item>

			<el-form-item>
				<el-button 
					style="margin:20px 0 50px 0;" 
					type="primary" 
					@click="submitForm('ruleForm')" 
					size="medium"
				>下一步</el-button>
			</el-form-item>

		</el-form>
		
		<submitSuccess
			v-else-if="commitProgress == 2"
			:params="params"
		/>
		
	</div>
</template>

<script>
	import submitSuccess from './submitSuccess.vue'
	import * as orderManage from '@/api/orderManage'
	import { mapState } from 'vuex'
	export default {
		props: ['order'],
		components: {
			submitSuccess
		},
		data() {
			let valiNumberPass1 = (rule, value, callback) => { //包含小数的数字
				let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
				if (value === '') {
					callback(new Error('请输入补额金额'));
				} else if (!reg.test(value)) {
					callback(new Error('请输入正确的实际退班金额'));
				} else {
					callback();
				}
			};
			//手机号验证
			let validatorPhone = function (rule, value, callback) {
				if (value === '') {
					callback(new Error('用户手机号不能为空'))
				} else if (!/^1\d{10}$/.test(value)) {
					callback(new Error('手机号格式错误'))
				} else {
					callback()
				}
			}
			return {
				labelPosition: 'right', //文字对齐方向
				ruleForm: {
					order_no: '', //订单编号
					netclass_titles: '', //课程标题
					receipt_money: '', //原班实收金额
					compensate_price: '', //补额金额
					user_mobile: '', //用户电话
					province: '', //省份
					city: '', //城市
					area: '', //地区
					address: '', //用户地址
					reasons: [], //补额原因
					whyBackClass: '', //补额原因
					note: '', //备注
				},
				current_class_id: '', //当前课id 
				main_class_id: '', //主课id
				params: {}, //子组件的数据
				commitProgress: 1, //完成进度
				rules: {
					compensate_price: [{//补额金额验证
						required: true,
						trigger: 'blur',
						validator: valiNumberPass1,
						type: 'float'
					}],
					user_mobile: [{ //手机号验证
						required: true, 
						validator: validatorPhone, 
						trigger: 'blur',
					}], 
					area: [{ //所属地区
						required: true,
						message: '请输入完整的所属地区',
						trigger: 'blur',
					}],
					address:[{ //地址
						required: true,
						message: '请输入用户地址',
						trigger: 'blur',
					}],
					whyBackClass: [{ //补额原因验证
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					note: [{ //备注验证
						required: true,
						message: '请输入备注',
						trigger: 'blur',
						max: 99
					}]
				}
			}
		},
		watch: {
			order(newVal){
				//获取原因
				const config = {types: "reasons", ext_params: {reasons: {type: "compensate"}}}
				orderManage.getDictionaries(config)
					.then(res => {
						this.ruleForm.reasons = res.data.reasons;
					})
					.catch(err => {
						this.$message.error(err.msg)
					})
				
				this.main_class_id = newVal.order_id;
				orderManage.getServiceDetail(newVal)
					.then(res => {
						this.ruleForm.order_no = res.data.order_no; //订单编号
						this.ruleForm.netclass_titles = res.data.netclass_titles; //课程标题
						this.ruleForm.receipt_money = res.data.receipt_money; //原班实收金额
						
					})
					.catch(err => {
						this.$message.error(err)
					})
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let str = `【补 ${this.ruleForm.compensate_price} 元】`
						
						this.$confirm(`学员应${str}`, '退补额提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							
							const req = {
								operator: this.$store.state.username, //操作人
								order_id: this.$route.query.order_id, //订单id
								user_mobile: this.ruleForm.user_mobile, //用户手机号
								province: this.ruleForm.province, //省
								city: this.ruleForm.city, //市
								area: this.ruleForm.area, //区
								address: this.ruleForm.address, //地址
								compensate_price: this.ruleForm.compensate_price, //补额金额
								compensate_reason: this.ruleForm.whyBackClass, //原因
								compensate_remark: this.ruleForm.note, //备注
							}
							const formData = new FormData()
							Object.keys(req).forEach((key) => {
								formData.append(key, req[key])
							})
							orderManage.postServiceCompensate(formData)
								.then(res => {
									if(res.code === 10000){
										const params = {
											title: '填写补额信息',
											titleOne: '原班ID',
											titleOneVal: this.main_class_id,
											titleTwo: '原班实收金额',
											titleTwoVal: this.ruleForm.receipt_money,
											titleThree: '补额金额',
											titleThreeVal: this.ruleForm.compensate_price,
											titleFive: '是否需要用户确认付款',
											// titleFiveVal: this.ruleForm.refundWay
											titleFiveVal: 1
										}
										this.params = params;
										this.commitProgress = 2;
										// this.$router.push({name: 'fillSubmitSuccess', params})
									}else{
										this.commitProgress = 1;
										throw new Error(res.msg)
									}
								})
								.catch(err => {
									this.$message.error(err.message)
								})
							
						}).catch((err) => {
							// this.$message({
							// 	type: 'info',
							// 	message: '取消操作'
							// });
							console.log('err: ', err);
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleInput(e) {
				// 通过正则过滤小数点后两位
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
			}
		},
		computed: {
			...mapState(['username']),
			moneyFormat() { //将传过来的金额按照格式用逗号分割
				return function(number) {
					let res = number.toString().split('.');
					var len = res[0].length;
					if (len <= 3) {
						return number;
					}
					var r = len % 3;
					let result = r > 0 ? res[0].slice(0, r) + "," + res[0].slice(r, len).match(/\d{3}/g).join(",") : res[0].slice(r,
						len).match(/\d{3}/g).join(",");
					return result + '.' + res[1];
				}
			},
		}
	}
</script>

<style scoped>
	.el-form-item {
		margin: 10px 0 !important;
	}

	.el-form-item.is-required {
		margin: 20px 0 !important;
	}

	.el-steps {
		margin-top: 40px;
		margin-bottom: 70px;
		position: relative;
		left: 50%;
		transform: translate(-31%);
	}
	
	.el-tables{
		border: 1px solid #ccc;
		width: 100%;
		box-sizing: border-box;
		text-align: center;
	}
	
	.el-tables .el-ths th{
		background-color: #ddd;		
		text-align: center;
	}
	
	.el-tables .el-tds{
		border-bottom: 1px solid #ddd;
		height: 50px;
		
	}
 	
	
</style>
