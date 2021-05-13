<template>
	<!-- 退额提交 -->
	<div style="overflow: hidden;">
		<!-- <el-col :span="24" align-center style="margin-bottom: 30px;"> -->
		<el-steps :active="commitProgress" space="30%" align-center>
			<el-step title="填写退额信息"></el-step>
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
			<el-form-item label="订单编号: ">
				<span>{{ruleForm.order_no}}</span>
			</el-form-item>

			<el-form-item label="课程标题: ">
				<span>{{ruleForm.netclass_titles}}</span>
			</el-form-item>

			<el-form-item label="原班实收金额: ">
				<span>￥{{moneyFormat(ruleForm.receipt_money)}}</span>
			</el-form-item>

			<el-form-item label="红包领取金额: ">
				<span>红包大小{{ruleForm.red_envelopes_sum}}元，</span>
				<span>已领取{{ruleForm.red_envelopes_receive_sum}}，</span>
				<span>已经提现{{ruleForm.red_envelopes_withdraw_sum}}元</span>
				<el-button type="text" @click="dialogTableVisible = true">查看详情</el-button>

				<el-dialog title="查看详情" :visible.sync="dialogTableVisible">
					<table class="el-tables">
						<tr class="el-ths">
							<th>用户名</th>
							<th>红包领取金额</th>
							<th>红包是否提现</th>
							<th>领取时间</th>
						</tr>
						
						<tr class="el-tds" v-for="item in redEnvelopeDetails" :key="item.userId">
							<td>{{item.userId}}</td>
							<td>￥{{moneyFormat(item.redEnvelopeMoney)}}</td>
							<td>{{item.isReflect}}</td>
							<td>{{item.getTime}}</td>
						</tr>
					</table>

					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogTableVisible = false">取 消</el-button>
						<el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
					</div>
				</el-dialog>
			</el-form-item>

			<el-form-item label="红包应扣余额: ">
				<span>￥{{moneyFormat(ruleForm.red_envelopes_withdraw_sum)}}</span>
			</el-form-item>

			<el-form-item label="退额金额: " prop="refundAmount">
				<el-col :span="8">
					<el-input v-model.trim="ruleForm.refundAmount" placeholder="请输入"></el-input>
				</el-col>
			</el-form-item>

			<el-form-item label="退款方式: " prop="refundWay">
				<el-radio-group v-model="ruleForm.refundWay">
					<el-radio label="0">原路返回</el-radio>
					<el-radio label="1">手动退款</el-radio>
				</el-radio-group>
			</el-form-item>
			
			<el-form-item label="退款去向: " prop="refundTo">
				<el-radio-group v-model="ruleForm.refundTo">
					<el-radio label="0">原路返回</el-radio>
					<el-radio label="1">退给代报管理员虚拟账户</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="退额原因: " prop="whyBackClass">
				<el-select v-model="ruleForm.whyBackClass" placeholder="请选择退额原因">
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
	import * as orderManage from '@/api/orderManage.js'
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
					callback(new Error('请输入退额金额'));
				} else if (!reg.test(value)) {
					callback(new Error('请输入数字'));
				} else {
					callback();
				}
			};
			return {
				labelPosition: 'right', //文字对齐方向
				redEnvelopeDetails: [ //红包领取金额查看详情
					{
						userId: 'L_0_M_8_20200724202034', //用户名
						redEnvelopeMoney: '3333.00', //红包领取金额
						isReflect: '是', //红包是否体现
						getTime: '2016-09-21  08:50:08' //领取时间
					},
					{
						userId: 'L_0_M_8_20200724202032', //用户名
						redEnvelopeMoney: '66.00', //红包领取金额
						isReflect: '是', //红包是否体现
						getTime: '2016-09-21  08:50:08' //领取时间
					}
				],
				dialogTableVisible: false, //查看红包详情弹出框是否可见
				ruleForm: {
					order_no: '', //订单编号
					netclass_titles: '', //课程标题
					receipt_money: '', //原班实收金额
					red_envelopes_sum: '', //红包大小
					red_envelopes_receive_sum: '', //已领取
					red_envelopes_withdraw_sum: '', //已提现 / 红包应扣余额
					refundAmount: '', //退额金额
					refundWay: '0', //退款方式
					refundTo: '0', //退款去向
					reasons: [], //退额原因
					whyBackClass: '', //退额原因
					note: '', //备注
				},
				current_class_id: '', //当前课id
				main_class_id: '', //主课id
				params: {}, //子组件的数据
				commitProgress: 1, //完成进度
				rules: {
					refundAmount: [{//退额金额验证
						required: true,
						message: '请输入正确的实际退班金额',
						trigger: 'blur',
						validator: valiNumberPass1,
						type: 'float'
					}],
					refundWay: [{ //退款方式验证
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					refundTo: [{ //退款去向验证
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					whyBackClass: [{ //退额原因验证
						required: true,
						message: '请选择',
						trigger: ['change', 'blur']
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
				const config = {types: "reasons", ext_params: {reasons: {type: "refund"}}}
				orderManage.getDictionaries(config)
					.then(res => {
						this.ruleForm.reasons = res.data.reasons;
					})
					.catch(err => {
						this.$message.error(err.msg)
					})
				
				orderManage.getServiceDetail(newVal)
					.then(res => {
						console.log('res: ', res);
						this.ruleForm.order_no = res.data.order_no; //订单编号
						this.ruleForm.netclass_titles = res.data.netclass_titles; //课程标题
						this.ruleForm.receipt_money = res.data.receipt_money; //原班实收金额
						this.ruleForm.red_envelopes_sum = res.data.red_envelopes_sum; //红包大小
						this.ruleForm.red_envelopes_receive_sum = res.data.red_envelopes_receive_sum; //已领取
						this.ruleForm.red_envelopes_withdraw_sum = res.data.red_envelopes_withdraw_sum; //已提现 / 红包应扣余额
						
						this.current_class_id = res.data.current_class_id;//当前课id
						this.main_class_id = res.data.main_class_id; //主课id
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
						let str = `【应退学员 ${this.ruleForm.refundAmount} 元】`
						this.$confirm(`${str}`, '退差额提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							const req = {
								operator: this.$store.state.username, //操作人
								order_id: this.$route.query.order_id, //订单id 
								main_class_id: this.main_class_id, //主课id
								current_class_id: this.current_class_id, //当前课id
								not_refund_total_fee: this.ruleForm.red_envelopes_withdraw_sum, //不退金额
								customer_refund_fee: this.ruleForm.refundAmount, //用户填写退款金额
								refund_type: this.ruleForm.refundWay, //退款方式
								refund_whereabouts: this.ruleForm.refundTo, //退款去向
								refund_reason: this.ruleForm.whyBackClass, //转退班原因
								refund_remark: this.ruleForm.note, //转退班备注
							};
							
							const formData = new FormData()
							Object.keys(req).forEach((key) => {
								formData.append(key, req[key])
							})
							orderManage.postServiceRefund(formData)
								.then(res => {
									if(res.code === 1000){
										const params = {
											title: '填写退额信息',
											titleOne: '原班ID',
											titleOneVal: this.main_class_id,
											titleTwo: '原班实收金额',
											titleTwoVal: this.ruleForm.receipt_money,
											titleThree: '退额金额',
											titleThreeVal: this.ruleForm.refundAmount,
											titleFour: '退回方式',
											titleFourVal: this.ruleForm.refundWay
										}
										this.params = params;
										this.commitProgress = 2;
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
