<template>
	<!-- 退班提交 -->
	<div style="overflow: hidden;">
		<el-steps :active="commitProgress" space="30%" align-center>
			<el-step title="填写退班信息"></el-step>
			<el-step title="完成"></el-step>
		</el-steps>
		

		<el-form
			v-if="commitProgress === 1"
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
						
						<tr class="el-tds" v-for="item in red_envelopes_receive_list" :key="item.userId">
							<td>{{item.openName}}</td>
							<td>￥{{moneyFormat(item.receivePrice)}}</td>
							<td>{{item.status}}</td>
							<td>{{item.receiveTime}}</td>
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

			<el-form-item label="图书、课时及申论批改扣费: ">
				<el-col :span="8">
					<el-input v-model="ruleForm.manual_deduction_fee" placeholder="请输入"></el-input>
				</el-col>
			</el-form-item>

			<el-form-item label="实退班金额: " prop="actualRefundAmount">
				<el-col :span="8">
					<el-input v-model.trim="ruleForm.actualRefundAmount" placeholder="请输入"></el-input>
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

			<el-form-item label="退班原因: " prop="whyBackClass">
				<el-select v-model="ruleForm.whyBackClass" placeholder="请选择退班原因">
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
					<el-input type="textarea" v-model="ruleForm.note" placeholder="请输入" cols="20" rows="3">
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
			v-else-if="commitProgress === 2"
			:params="params"
		/>
			
		
	</div>
</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	import { mapState } from 'vuex'
	import submitSuccess from './submitSuccess.vue'
	export default {
		props: ['order'],
		components: {
			submitSuccess
		},
		data() {
			let valiNumberPass1 = (rule, value, callback) => { //包含小数的数字
				let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
				if (value == '') {
					callback(new Error('请输入实退班金额'));
				} else if (!reg.test(value)) {
					callback(new Error('请输入数字'));
				} else {
					callback();
				}
			};
			return {
				labelPosition: 'right', //文字对齐方向
				red_envelopes_receive_list: [ //红包领取金额查看详情
					{
						openName: '', //用户名
						receivePrice: '', //红包领取金额
						status: '', //红包是否体现
						receiveTime: '' //领取时间
					},
					{
						openName: 'L_0_M_8_20200724202032', //用户名
						receivePrice: '66.00', //红包领取金额
						isReflect: '是', //红包是否体现
						receiveTime: '2016-09-21  08:50:08' //领取时间
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
					manual_deduction_fee: '', //图书、课时及申论批改扣费
					actualRefundAmount: '', //实退班金额
					refundWay: '0', //退款方式
					refundTo: '0', //退款去向
					reasons: [], //退班原因
					whyBackClass: '', //退班原因
					note: '', //备注
				},
				current_class_id: '', //当前课id
				main_class_id: '', //主课id
				params: {}, //子组件的数据
				commitProgress: 1, //完成进度
				rules: {
					actualRefundAmount: [{//实退班金额验证
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
					whyBackClass: [{ //退班原因验证
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
				const config = {types: "reasons", ext_params: {reasons: {type: "exit"}}}
				orderManage.getDictionaries(config)
					.then(res => {
						this.ruleForm.reasons = res.data.reasons;
					})
					.catch(err => {
						this.$message.error(err.msg)
					})
					
				//请求一些固定的值
				orderManage.getServiceDetail(newVal) 
					.then(res => {
						console.log("ressss: ", res);
						this.ruleForm.order_no = res.data.order_no; //订单编号
						this.ruleForm.netclass_titles = res.data.netclass_titles; //课程标题
						this.ruleForm.receipt_money = res.data.receipt_money; //原班实收金额
						this.ruleForm.red_envelopes_sum = res.data.red_envelopes_sum; //红包大小
						this.ruleForm.red_envelopes_receive_sum = res.data.red_envelopes_receive_sum; //已领取
						this.ruleForm.red_envelopes_withdraw_sum = res.data.red_envelopes_withdraw_sum; //已提现 / 红包应扣余额
						this.ruleForm.manual_deduction_fee = res.data.manual_deduction_fee; //图书、课时及申论批改扣费
						this.current_class_id = res.data.current_class_id;//当前课id
						this.main_class_id = res.data.main_class_id; //主课id
						
						this.red_envelopes_receive_list = res.data.red_envelopes_receive_list; //红包领取金额
						this.red_envelopes_receive_list.forEach(item => {
							if(item.status == 1){
								item.status = '正常'
							}else if(item.status == 0){
								item.status = '失效'
							}else if(item.status == 2){
								item.status = '已提现'
							}else{
								item.status = '-'
							}
						})
					})
					.catch(err => {
						this.$message.error(err)
					})	
			}
		},
		mounted() {
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						const str = `【退 ${this.ruleForm.actualRefundAmount} 元】`
						this.$confirm(`学员应${str}`, '退班提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							const req = {
								operator: this.$store.state.username, //操作人
								order_id: this.$route.query.order_id, //订单id 
								main_class_id: +this.main_class_id, //主课id
								current_class_id: +this.current_class_id, //当前课id
								receipt_money: this.ruleForm.receipt_money, //原班实收金额
								not_refund_total_fee: this.ruleForm.manual_deduction_fee + this.ruleForm.red_envelopes_withdraw_sum, //系统返回不退款金额
								customer_refund_fee: this.ruleForm.actualRefundAmount, //用户填写退款金额
								refund_type: this.ruleForm.refundWay, //退款方式
								refund_whereabouts: this.ruleForm.refundTo, //退款去向
								refund_reason: this.ruleForm.whyBackClass, //转退班原因
								refund_remark: this.ruleForm.note, //转退班备注
								need_make_sure: 1, //是否需要用户确认
							};
							// const formStr = Object.entries(req).map(item => `${item[0]}=${encodeURIComponent(item[1])}`).join('&')
							// console.log(formStr)
							const formData = new FormData()
							Object.keys(req).forEach((key) => {
								formData.append(key, req[key])
							})
							orderManage.postServiceExit(formData)
								.then(res => {
									if(res.code === 10000){
										// if(res.code === -1){
										const params = {
											title: '填写退班信息',
											titleOne: '原班ID',
											titleOneVal: this.main_class_id,
											titleTwo: '原班实收金额',
											titleTwoVal: this.ruleForm.receipt_money,
											titleThree: '实退金额',
											titleThreeVal: this.ruleForm.actualRefundAmount,
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
							this.$message.error(err.message)
						});
					} else {
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
					if(isNaN(number) === false && number != null){
						let res = number.toString().split('.');
						var len = res[0].length;
						if(len <= 3){
							if(res[1]){
								return number + '.' + res[1];								
							}else if(!res[1]){
								return number + '.00'
							}else{
								return '0.00'
							}
						}
						var r = len % 3;
						let result =  r > 0 ? res[0].slice(0, r) + "," + res[0].slice(r, len).match(/\d{3}/g).join(",") : res[0].slice(r, len).match(/\d{3}/g).join(",");
						if(res[1]){
							return result + '.' + res[1];
						}else if(!res[1]){
							return result + '.00'
						}else{
							return '0.00'
						}
					}else{
						return '0.00'
					}
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
