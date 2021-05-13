<template>
	<!-- 订单详情-基础信息模块 -->
	<div>
		<el-row>
		  <el-col :span="12">
			  <div class="grid-content bg-purple-dark">渠道来源: <span>{{DomainName}}</span></div>
			  <div class="grid-content bg-purple-dark">支付渠道: <span>{{PaymentType}}</span></div>
			  <div class="grid-content bg-purple-dark">下单时间: <span>{{AddTime}}</span></div>
			  <div class="grid-content bg-purple-dark">实收金额: 
				<span>{{moneyFormat(MoneyReceipt)}}</span>
			  </div>
			  <div class="grid-content bg-purple-dark">物流状态: <span>{{Status}}</span></div>
				<template v-if="type == 'portocolClass'">
					<div class="grid-content bg-purple-dark" v-auth="'PS_INTERVIEW_AGREEMENT'">
						协议: <span class="agreement">
							<a 
								:href="interviewProtocol"
								target="_blank"
							>
								{{treatyType == 1 ? '笔试' : (treatyType == 2 ? '面试' : '不存在')}}协议
							</a>
						</span>
					</div>
					<div class="grid-content bg-purple-dark" v-auth="'PS_REFUND_APPLICATION_FORM'">
						协议退费申请表: <span class="agreement" @click="refundDialogVisible = true">申请表</span>
					</div>
				</template>
		  </el-col>
		  
		  <el-col :span="12">
			  <div class="grid-content bg-purple-dark">平台来源: <span>{{OrderOrigin}}</span></div>
			  <div class="grid-content bg-purple-dark">支付状态: <span>{{Status}}</span></div>
			  <div class="grid-content bg-purple-dark">支付时间: <span>{{PayDate}}</span></div>
			  <div class="grid-content bg-purple-dark">发票状态: <span>{{NeedInvoice}}</span></div>
				<div class="info-right" v-if="type == 'portocolClass'">
					<div>
						<span v-auth="'PS_PERSONAL_INFO'" class="info-agreement" @click="infoDialogVisible = true">个人信息</span>
						<span v-auth="'PS_SUPPLEMENT_INFO'" class="info-agreement" @click="supplementVisible = true">补充信息</span>
					</div>
					<div>
						<span @click="handleDownload" class="info-agreement" v-auth="'PS_DOWNLOAD_PROTOCOL'">下载协议</span>
						<span class="info-agreement" @click="handleUpload" v-auth="'PS_UPLOAD_PROTOCOL'">
							{{protocolUploadType == 2 ? '协议已签，无需上传' : '上传协议'}}
						</span>
						<div style="display: inline-block;" v-if="protocolUploadType == 1" v-auth="'PS_UPLOAD_PROTOCOL'"> 
							<el-upload
								style="display: inline-block;" 
							  class="avatar-uploader"
							  :action="actionUrl" 
							  name="files" 
							  :show-file-list="false" 
							  :on-success="handleSuccess"
								:on-remove="handleRemove"
								:on-progress="handleProgress"
								:limit="1"
								ref="upload"
							>
							  <el-button size="small">选择文件</el-button>
							</el-upload>
							<span v-if="selectFileName == '未选择任何文件'" class="info-selectFile">{{selectFileName}}</span>
							<div class="file-class" v-else>
								<span>上传图片</span><span>{{selectFileName}}</span>
								<i class="el-icon-circle-close" @click.stop="clearSelectFile"></i>
							</div>
						</div>
					</div>
				</div>
		  </el-col>
		</el-row>
		
		<transfer-agreement
			ref="transferAgreement"
		/>
		
		<!-- 修改个人认证信息弹出框 -->
		<modify-info 
			:visible.sync="infoDialogVisible"
		/>
		
		<!-- 协议退费申请表 -->
		<portocolRefund 
			:visible.sync="refundDialogVisible"
		/>
		
		<!-- 补充信息 -->
		<supplementInfo
			:visible.sync="supplementVisible"
			:paymentMode="$route.query.paymentMode"
		/>
		
	</div>
	
</template>

<script>
	import Util from '@/common/util.js'
	import {getDictionaries, getProtoProtocolUpload} from '@/api/orderManage.js'
	import transferAgreement from '../common/transferAgreement.vue'
	import modifyInfo from '../portocolCommon/modifyInfo.vue'
	import portocolRefund from '../portocolCommon/portocolRefund.vue'
	import supplementInfo from '../portocolCommon/supplementInfo.vue'
	export default{
		components: { 
			transferAgreement,
			modifyInfo,
			portocolRefund,
			supplementInfo
		}, 
		props: {
			tableData: {
				type: Object
			},
			express_info: {
				type: Object
			},
			orderItem: {
				type: Array
			}
		},
		data(){
			return {
				actionUrl: `${PANGU_URL}/v1/c/schserver/upload`,
				interviewProtocol: '', //面试协议地址
				DomainName: '', //渠道来源
				PaymentType: '', //支付渠道
				AddTime: '', //下单时间
				MoneyReceipt: '', //实收金额
				Status: '', //物流状态
				OrderOrigin: '', //平台来源
				// Status: '', //支付状态
				PayDate: '', //支付时间
				NeedInvoice: '', //发票状态
				activity_type: '', //活动促销
				type: "",
				dialog: false,
				refundDialogVisible: false,
				infoDialogVisible: false,
				supplementVisible: false, // 补充信息
				treatyType: '', //面试类型   '1笔试，2面试 0 数据不存在
				selectFileName: '未选择任何文件',
				fileUrl: '', //上传文件的地址
				protocolUploadType: '', // 是否可以上传协议
				protocolDownloadUrl	: '', // 协议下载地址
			}
		},
		watch:{
			express_info(newVal){
				if(newVal){
					this.Status = newVal.Status; //发货状态
				}
			},
			tableData(newVal){
				this.DomainName = newVal.DomainName;
				this.AddTime = newVal.AddTime;
				this.PayDate = newVal.PayDate;
				this.NeedInvoice = newVal.NeedInvoice == 1 ? "需要发票" : '不需要发票';
				this.MoneyReceipt = newVal.MoneyReceipt;
				
				getDictionaries({types: 'payTypes,channel,activityType,orderStatus'}) 
					.then(res => {
						res.data.payTypes.forEach(item => { //支付渠道
							if(item.id == newVal.PaymentType){
								this.PaymentType = item.name
							}
						})
						for (let prop in res.data.channel) { //平台来源
							if(prop == newVal.OrderOrigin){
								this.OrderOrigin = res.data.channel[prop];
							}
						}
						res.data.activityType.forEach((item, index) => { //活动促销
							if(index == newVal.activity_type){
								this.activity_type = item;
							}
						})
						for (let prop in res.data.orderStatus) { //支付状态
							if(prop == newVal.Status){
								this.Status = res.data.orderStatus[prop];
							}
						}
						
					})
					.catch(err => {
						this.$message.error(err)
					})
				},
				orderItem(newVal){
					this.interviewProtocol = newVal[0].InterviewAgreementUrl
					this.treatyType = newVal[0].treatyType;
					this.protocolUploadType = newVal[0].protocolUploadType; // 是否可以上传协议
					this.protocolDownloadUrl = newVal[0].protocolDownloadUrl; // 下载协议
				}
		},

		methods: {
			moneyFormat(number){
				let result = Util.moneyFormat(number);
				if(result || result === 0 || result === '0'){
					return result + '元'
				}
			},
			clearSelectFile(){ // 清除选择的文件
				this.$refs.upload.clearFiles();
				this.selectFileName = '未选择任何文件';
			},
			overflowHidden(text){ // 超出15个字部分，打点展示
				if(text.length <= 10){
					return text
				} else {
					return text.substring(0, 10) + '...'
				}
			},
			handleDownload(){//下载协议
				if(!this.protocolDownloadUrl){
					this.$message.error('暂无协议信息')
					return;
				}
				const a = document.createElement('a')
				a.href = this.protocolDownloadUrl;
				a.target = "_black";
				a.click()
			},
			handleUpload(){ // 上传协议
				if(this.protocolUploadType == 1 && this.fileUrl){
					const params = {
						orderId: this.$route.query.orderId,
						protocolUrl: this.fileUrl
					}
					getProtoProtocolUpload(params)
						.then(res => {
							if(res.data == 1 && res.code == 10000){
								this.$message.success('保存成功')
							}
						})
						.catch(err => {
							console.log("err: ",err);
							this.$message.error(err)
						})
				}
			},
			handleSuccess(fileUrl){ // 上传文件
				this.fileUrl = fileUrl.data.src;
			},
			handleProgress(event,file){ // 文件上传时触发
				const fileName = file.name.substring(0, file.name.lastIndexOf("."))
				const suffixName = file.name.substring(file.name.lastIndexOf("."))
				this.selectFileName = this.overflowHidden(fileName) + suffixName
			},
			handleRemove(){
				this.form.refundFormUrl = "";
			}
		},
		mounted() {
			this.type = this.$route.query.type;
		}
	}
</script>

<style scoped lang="less">
	.el-col {
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.847058823529412);
	}
	.el-col span{
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.647058823529412);
	}
	.icon-img{
		width: 15px;
		height: 15px;
		display: inline-block;
	}
	span.agreement{
		font-size: 14px;
		color: #00f;
		margin: 0 20px;
		cursor: pointer;
		white-space: nowrap;
	}
	span.agreement:hover{
		text-decoration: underline;
	}
	span.selectFile{
		font-size: 13px;
	}
	.info-right{
		a.info-agreement,span.info-agreement{
			font-size: 14px;
			color: #00f;
			margin-right: 20px;
			cursor: pointer;
			white-space: nowrap;
		}
		a.info-agreement:hover,span.info-agreement:hover{
			text-decoration: underline;
		}
		span.info-selectFile{
			font-size: 13px;
		}
	}
	
	.file-class{
		display: inline-block;
		border: 1px solid #ccc;
		height: 25px;
		line-height: 25px;
		border-radius: 5px;
		span{
			display: inline-block;
			padding: 0 8px;
			
			&:first-child{
				border-right: 1px solid #ccc;
			}
			&:last-child{
				padding-right: 15px;
			}	
		}
		i{
			color: #ccc;
			margin-right: 3px;
			cursor: pointer;
		}
	}
	
</style>
