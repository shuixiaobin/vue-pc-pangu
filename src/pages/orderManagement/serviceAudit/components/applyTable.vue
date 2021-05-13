<template>
  <div >
		<div class="application-form">

			<h2 class="header">华图在线{{info.treatyType == 1 ? '笔试' : '面试'}}协议退费申请表</h2>

			<p class="date">填表日期： {{createDate || '&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日'}}</p>

			<div class="info">

				<div class="form-item class-title">
					<span class="head-line">课程名称：</span><span>{{info.title}}</span> </div>

				<div class="form-item">
					<span class="head-line">姓名：</span><span>{{info.userName}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">报考部门：</span><span>{{info.examDepartment}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">性别：</span><span>{{info.gender}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">报考职位：</span><span>{{info.examPosition}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">联系电话：</span><span>{{info.mobile}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">职位代码：</span><span>{{info.examPositionCode}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">身份证号：</span><span>{{info.idCard}}</span>
				</div>
				<div>
					<span class="head-line">准考证号：</span><span>{{info.examCardCode}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">{{info.treatyType == 1 ? '笔试' : '面试'}}成绩：</span><span>{{info.score}}</span>
				</div>
				<div class="form-item position">
					<span class="head-line">职位招考人数：</span>
					<span class="style1" v-if="info.recruitsNum || info.recruitsNum == 0">{{info.recruitsNum}}人</span>
				</div>
				<!-- <div v-if="info.treatyType == 1" class="form-item">
					<span class="head-line">政策加分：</span><span>{{info.olicyBonus}}</span>
				</div> -->
				<div class="form-item">
					<span class="head-line">开户名：</span><span>{{info.bankUsername}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">银行卡号：</span><span>{{info.bankCardNumber}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">退费金额：</span><span>{{amountFormat(info.refundAmount)}}</span>
				</div>
				<div class="form-item">
					<span class="head-line">缴费金额：</span><span>{{amountFormat(info.MoneyReceipt)}}</span>
				</div>
				
				
			</div>

		</div>

		<div class="sub-title" v-if="info.treatyType === 1">
			
			<p class="subtitle">必传资料</p>
			<div style="margin-left: 40px;">
				<p class="head-line"><i :class="info.isIdCardUrl ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>身份证正反面复印件</p>
				<p class="head-line"><i :class="info.isExamCardPic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>准考证</p>
				<p class="head-line"><i :class="info.isWrittenExamPic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>笔试成绩单</p>
				<p class="head-line"><i :class="info.isEntryFacePic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>进面试名单</p>
			</div>
			
			<p class="subtitle" style="margin-top: 20px;">选传资料</p>
			<div style="margin-left: 40px;">
				<p class="head-line"><i :class="info.isEmployListPic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>最终拟录名单</p>	
			</div>
			
		</div>
		
		<div class="sub-title" v-else>
			<p class="subtitle">必传资料</p>
			<div style="margin-left: 40px;">
				<p class="head-line"><i :class="info.isIdCardUrl ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>身份证正反面复印件</p>
				<p class="head-line"><i :class="info.isExamCardPic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>准考证</p>
				<p class="head-line"><i :class="info.isEntryFacePic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>进面名单</p>
				<p class="head-line"><i :class="info.isInterviewPic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>面试成绩单</p>
				<p class="head-line"><i :class="info.isPhysicalListPic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>体检名单</p>
				<p class="head-line"><i :class="info.isPublicListPic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>公示名单</p>
			</div>
			<p class="subtitle" style="margin-top: 20px;">选传资料</p>
			<div style="margin-left: 40px;">
				<p class="head-line"><i :class="info.isWrittenExamPic ? 'el-icon-circle-check' : 'el-icon-circle-close'"/>笔试成绩单</p>
			</div>
		</div>
  </div>
</template>
<script>
import Util from '@/common/util'
export default {
  props: {
    info: Object
  },
  computed: {
    createDate () {
      if (this.info.createAt) {
        return Util.dateFormatter(this.info.createAt, 'yyyy年MM月dd日');
      } else {
				return ''
      }
    }
  },
	methods: {
		amountFormat(number){
			if(number || number == 0){
				return "￥" + number
			}
		}
	}
}
</script>
<style lang="less" scoped>
	.application-form {
		border-bottom: 1px dashed;
		.header {
			text-align: center;
			font-size: 20px;
			font-weight: bold;
		}

		.date {
			text-align: right;
			font-weight: bold;
			margin-right: 20px;
		}

		.info {
			padding: 30px 20px;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 8px 16px;
			.form-item {
				display: flex;
				line-height: 32px;
				&.class-title {
					grid-column-start: span 2;
				}
			}
			.head-line {
				flex: 0 0 auto;
				width: 80px;
				font-size: 16px;
				font-weight: bold;
			}
		}
	}
	.sub-title{
		padding: 20px;
		
		.subtitle{
			font-size: 16px;
		}
		
		.head-line {
			font-size: 17px;
			font-weight: bold;
			margin: 5px 0;
			.el-icon-circle-check,
			.el-icon-circle-close {
				margin-right: 5px;
			}
			.el-icon-circle-check {
				color: #24B366;
			}
			.el-icon-circle-close {
				color: #FF4D4F;
			}
		}
		
	}
	.apply-checkbox {
		margin-right: 10px;
	}
	.position {
		position: relative;
		.style1{
			position: absolute;
			bottom: 0;
			left: 80px;
		}
	}
</style>