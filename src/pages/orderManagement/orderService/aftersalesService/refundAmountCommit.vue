<template>
	<!-- 退额提交 -->
	<div>

		<div style="overflow: hidden;margin-top: 50px;">
			<el-steps :active="commitProgress" space="30%" align-center style="position: relative;left: 50%;transform: translateX(-30%);">
				<el-step title="填写退额信息"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
		</div>

		<div class="body" v-show="commitProgress == 1">

			<el-form ref="form" :model="form" label-width="90px" :rules="rules">
				<el-form-item label="订单编号: ">
					<span>{{form.orderNum}}</span>
				</el-form-item>
				<el-form-item label="课程标题: ">
					<el-select v-model="form.classTitle" placeholder="请选择活动区域" size="small">
						<el-option 
							v-for="item in form.classInfo"
							:key="item.classId"
							:label="item.classTile" 
							:value="item.classId"
						></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="退额金额: " prop="refundAmount">
					<el-input v-model="form.refundAmount" placeholder="请输入" size="small"></el-input>
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

				<el-form-item label="退额原因: " prop="operationReason">
					<el-select v-model="form.operationReason" placeholder="请选择" size="small">
						<el-option label="请选择" value="请选择"></el-option>
						<el-option label="平台活动退差价" value="退额-平台活动退差价"></el-option>
						<el-option label="直播优惠退差价" value="退额-直播优惠退差价"></el-option>
						<el-option label="学员实物取消退差价" value="退额-学员实物取消退差价"></el-option>
						<el-option label="没进面试, 退费不退课" value="退额-没进面试, 退费不退课"></el-option>
						<el-option label="其他" value="退额-其他"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="备注: " prop="remark">
					<el-input type="textarea" v-model="form.remark" placeholder="请输入" size="small"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="onSubmit" size="small">下一步</el-button>
				</el-form-item>
			</el-form>

		</div>
		
		<!-- 操作成功 -->
		<submitSuccess 
			v-show="commitProgress == 2"
			:successData="successData"
		/>
		
		
	</div>

</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	import submitSuccess from './submitSuccess.vue'
	import { mapState } from 'vuex'
	export default {
		components: {
			submitSuccess
		},
		data() {
			let valiNumberPass1 = (rule, value, callback) => { //包含小数的数字
				let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
				if (value == '') {
					callback(new Error('请输入退额金额'));
				} else if (!reg.test(value)) {
					callback(new Error('请输入数字'));
				} else {
					callback();
				}
			};
			return {
				commitProgress: 1, //完成进度
				successData: {}, //操作成功的数据
				form: {
					orderNum: '', //订单编号
					orderId: '', //订单id
					classTitle: "", //课程标题
					classInfo: [], 
					refundAmount: '', //退额金额
					isMakeSure: '1', //退款方式
					turnToAdmin: '0', //退款去向
					operationReason: '请选择', //退额原因
					remark: '', //备注
					moneyReceipt: '', //原班实收金额
					userName: '', //用户名
					isZengSong: '', //是否赠送
				},
				rules: {
					refundAmount: [{
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
					operationReason: [{
						required: true,
						message: '请选择退额原因',
						trigger: 'change'
					}],
					remark: [{
						required: true,
						message: '请输入备注信息',
						trigger: 'blur'
					}]
				}
			}
		},
		mounted() {
			this.getData();
		},
		computed: {
			...mapState(['username']),
		},
		methods: {
			getData() { //请求数据
				const obj = {}
				obj.orderId = this.$route.query.orderId;
				orderManage.getTurnRetreatOrder(obj)
					.then(res => {
						this.form.orderNum = res.data.orderNum; //订单编号
						this.form.orderId = res.data.orderId; //订单id
						this.form.classInfo = res.data.classinfo;//课程信息
						this.form.userName = res.data.userName; //用户名
						this.form.moneyReceipt = res.data.classinfo[0].TruePrice;//原班实收金额
						this.form.isZengSong = res.data.classinfo[0].IsZengSong; //是否赠送
						this.form.classTitle = res.data.classinfo[0].classId; //班级id
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			onSubmit() {
				const obj = {
					orderId: this.$route.query.orderId, //订单id
					classId: this.form.classTitle, //课程id
					userName: this.form.userName, //用户名
					oldMoney: this.form.moneyReceipt, //原班实收金额
					orderNum: this.form.orderNum, //原班订单编号
					isMakeSure: this.form.isMakeSure, //退款方式
					turnToAdmin: this.form.turnToAdmin, //退款去向
					remark: this.form.remark, //备注
					operUser: this.$store.state.username, //操作人
					operationReason: this.form.operationReason, //转班、退班原因
					isZengSong: this.form.isZengSong, //赠送课程
					isConfirm: 1, //退额原因
				}
				let turnMoney = +this.form.refundAmount
				obj.turnMoney = turnMoney.toFixed(2); //退额金额
				
				const f = new FormData()
				for (let prop in obj) {
					f.append(prop, obj[prop])
				}
				orderManage.postOrderSupplement(f, {'Content-Type': 'multipart/form-data'})
					.then(res => {
						if(res.code !== 10000){
							this.$message.error(res.msg)
						}
						if(res.code == 10000){
							this.$message.success('操作成功!')
							this.successData = res.data;
							this.commitProgress = 2;
						}
					})
					.catch(err => {
						console.log(err);
					})
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.body {
		width: 500px;
		margin: 0 auto;
		margin-bottom: 80px;
	}
</style>
