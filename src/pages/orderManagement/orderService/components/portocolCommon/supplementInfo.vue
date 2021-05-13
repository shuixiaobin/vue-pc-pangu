<template>
	<!-- 修改补充信息 -->
	<el-dialog
		class="supplement-info"
	  title="提示"
	  :visible.sync="visible"
	  width="50%"
	  :before-close="handleClose">
		
		<template #title>
			<p class="title">修改补充信息</p>
		</template>
		
	  <div class="supplement-body">
			<el-row>
				
				<el-col :span="12" class="supplement-body-col">
					<div><span>报考部门</span><el-input v-model="tableData.examDepartment" size="small" style="width: 150px;"></el-input></div>
					<div><span>报考职位</span><el-input v-model="tableData.examPosition" size="small" style="width: 150px;"></el-input></div>
					<div><span>职位代码</span><el-input v-model="tableData.examPositionCode" size="small" style="width: 150px;"></el-input></div>
					<div v-if="tableData.payType == 1"><span>准考证号</span><el-input v-model="tableData.examCardCode" size="small" style="width: 150px;"></el-input></div>
					<div v-if="tableData.payType == 2"><span>岗位招考人数</span><el-input v-model="tableData.recruitsNum" size="small" style="width: 150px;"></el-input></div>
				</el-col>
				
				<el-col :span="12" class="supplement-body-col">
					
				</el-col>
				
			</el-row>
			
			<!-- 预收 -->
			<el-row class="supplement-body" v-if="tableData.payType == 2">
				
				<el-col :span="24" class="supplement-body-col">
					<div>
						<span>补充信息类型</span>
						<el-select
							v-model="tableData.examStandard" 
							placeholder="请选择" 
							size="small" 
							@visible-change="visibleChange"
							@change="infoTypeChange"
							ref="replenishInfoType"
						>
							<el-option label="名次符合状元标准" :value="1"></el-option>
							<el-option label="分数符合状元标准" :value="2"></el-option>
						</el-select>	
					</div>
				</el-col>
				
				<el-col :span="12" class="supplement-body-col">
					<div><span>名次</span><el-input v-model="tableData.rank" size="small" style="width: 100px;"></el-input></div>
					<div><span>成绩分数</span><el-input v-model="tableData.examScore" size="small" style="width: 100px;"></el-input></div>
					<div><span>成绩单图片</span>
						<el-button size="small" type="primary" @click="protoTranscript = true">
							{{tableData.scorePic ? '查看' : '上传'}}
						</el-button>
					</div>
				</el-col>
				
				<el-col :span="12" class="supplement-body-col">
					<div><span>最低分数线</span><el-input v-model="tableData.miniScore" size="small" style="width: 100px;"></el-input></div>
					<div style="height: 48px;line-height: 48px;">
						<span>分数差</span>
						{{poorGrades(tableData.examScore, tableData.miniScore)}}
					</div>
					<div v-if="tableData.payType == 2">
						<span>准考证图片</span>
							<el-button size="small" type="primary" @click="protoVisible = true">
								{{tableData.examCardCodePic ? '查看' : '上传'}}
							</el-button>
					</div>
				</el-col>
				
			</el-row>
			
		</div>
		
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="handleClose" size="small">取 消</el-button>
	    <el-button type="primary" @click="handleClick" size="small">确 定</el-button>
	  </span>
		
		<!-- 准考证图片 -->
		<supplementInfoUpdate
			:visible.sync="protoVisible"
			:tableData.sync="tableData"
			:modal="false"
		/>
		
		<!-- 确认切换提示 -->
		<switchPrompt 
			:visible.sync="switchVisible"
			:modal="false"
		/>
		
		<!-- 成绩单图片 -->
		<supplementInfoTranscript 
			:visible.sync="protoTranscript"
			:tableData.sync="tableData"
			:modal="false"
		/>
		
	</el-dialog>
</template>

<script>
	import { postProtoSupplementInformation, getProtoUserInfo } from '@/api/orderManage.js'
	import supplementInfoUpdate from './supplementInfoUpdate.vue'
	import switchPrompt from './switchPrompt.vue'
	import supplementInfoTranscript from './supplementInfoTranscript.vue'
	export default {
		components: {
			supplementInfoUpdate,
			switchPrompt,
			supplementInfoTranscript
		},
		props: {
			visible: {
				type: Boolean
			}
		},
		data(){
			return {
				protoVisible: false,
				switchVisible: false,
				isExpand: false,// 是否是第一次更改补充信息类型
				protoTranscript: false, // 成绩单图片
				tableData: {}
			}
		},
		computed: {
			payType(){
				return this.$route.query.payType;
			}
		},
		watch: {
			visible(newVal){
				if(newVal === true){
					this.requestData()
				}
			}
		},
		methods: {
			requestData(){ // 请求数据
				const params = {
					orderId: this.$route.query.orderId,
					classId: this.$route.query.classId,
					infoType: 2
				}
				getProtoUserInfo(params)
					.then(res => {
						if(res.data){
							this.tableData = res.data;
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
				
			},
			poorGrades(data1, data2){ // 分数差
				let num = "";
				if(data1 - data2 <= 0){
					num = data1 - data2;
				}else if(data1 - data2 > 0){
					num = "+" + data1 - data2;
				}
				num += "";
				const numArr = num.split('.');
				if(numArr[1]){
					num = numArr[0] + "." + numArr[1].slice(0, 1)
				}
				this.tableData.scoreDiff = num;
				return this.tableData.scoreDiff;
			},
			visibleChange(){
				if(this.isExpand === false){
					this.switchVisible = true;
					this.$refs.replenishInfoType.blur();
					this.isExpand = true;
				}
			},
			infoTypeChange(){
				this.tableData.rank = "";
				this.tableData.examScore = "";
				this.tableData.miniScore = "";
			},
			handleClose(){
				this.$emit('update:visible', false, false)
			},
			handleClick(){
				const params = {
					...this.tableData,
					orderId: this.$route.query.orderId
				}
				postProtoSupplementInformation(params)
					.then(res => {
						if(res.code > 0){
							this.$message.success('保存成功')
						}else{
							this.$message.error('保存失败')
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
				this.$emit('update:visible', false, true)
			}
		}
	}
</script>


<style>
	.supplement-info .el-dialog__footer{
		border-top: 1px solid #ccc;
	}
</style>

<style scoped="scoped" lang="less">
	.title{
		font-size: 15px;
		font-weight: 600;
		border-bottom: 1px solid #ccc;
	}
	.supplement-body {
		
		.supplement-body-col{
			
			padding-left: 5%;
			
			div{
				margin: 4px 0;
			}
			
			span{
				display: inline-block;
				width: 100px;
				font-weight: 650;
				font-size: 14px;
			}
			
		}
		
	}
	
</style>
