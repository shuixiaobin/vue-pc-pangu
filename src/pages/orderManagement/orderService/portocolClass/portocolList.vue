<template>
	<!-- 协议服务班-订单列表 -->
	<div class="module">
		<div class="container-title">
			<h2>
				协议班服务-{{this.$route.query.title}}
				<div class="order-num">
					<span>订单量：{{statistics.order_total}}</span>
					<span>未结转量：{{statistics.isTurn_no}}</span>
				</div>
			</h2>
		</div>
		
		<div class="container-Box">
			
			<portocolSearch
				@search="searchFunc"
			/>
			
		</div>
		
		<div class="container-Box mt16 minHeight">
			
			<el-table :data="tableData" style="margin-top: 40px;">
				<el-table-column fixed="left" prop="ordernum" align="center" label="订单编号" min-width="140"></el-table-column>
				<el-table-column prop="conSignee" align="center" label="姓名"></el-table-column>
				<el-table-column align="center" label="用户名" width="180">
					<template #default="{row}">
						<el-popover 
							placement="top-start" width="200" trigger="hover" 
							:content="row.userName" :disabled="row.userName.length <= 15"
						>
							<span slot="reference">{{overflowHidden(row.userName)}}</span>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="registerPhone" align="center" label="注册手机号" width="130"></el-table-column>
				<el-table-column prop="protocol_mobile" align="center" label="协议手机号" width="130"></el-table-column>
				<el-table-column prop="user_sex" align="center" label="性别" width="60"></el-table-column>
				<el-table-column prop="id_card" align="center" label="身份证号" width="200"></el-table-column>
				<el-table-column prop="moneyReceipt" align="center" label="实收金额">
					<template #default="{row}">
						{{moneyFormat(row.moneyReceipt)}}
					</template>
				</el-table-column>
				<el-table-column prop="courseStatus" align="center" label="课程状态">
					<template #default="{row}">
						{{courseStatus(row.classStatus)}}
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="备注留言" width="180" #default="{row}">
					<el-popover 
						placement="top-start" width="200" trigger="hover" 
						:content="row.userName" :disabled="row.userName.length <= 15"
					>
						<span slot="reference">{{overflowHidden(row.userName)}}</span>
					</el-popover>
				</el-table-column>
				<el-table-column align="center" label="操作员备注" width="180" #default="{row}">
					<el-popover 
						placement="top-start" width="200" trigger="hover" 
						:content="row.userName" :disabled="row.userName.length <= 15"
					>
						<span slot="reference">{{overflowHidden(row.userName)}}</span>
					</el-popover>
				</el-table-column> -->
				<el-table-column label="是否转结" align="center" v-auth="'PS_ISTURN'" #default="{row}">
					<!-- isTurn == 0 为未转结， isTurn == 1 为已转结 -->
					<el-checkbox 
						v-model="row.isTurn"
						:true-label="2"
						:false-label="1"
						@change="checkBoxChange(row)"
					></el-checkbox>
				</el-table-column>
				<!-- <el-table-column align="center" label="订单群服务备注" width="180" #default="{row}">
					<el-popover 
						placement="top-start" width="200" trigger="hover" 
						:content="row.userName" :disabled="row.userName.length <= 15"
					>
						<span slot="reference">{{overflowHidden(row.userName)}}</span>
					</el-popover>
				</el-table-column> -->
				
				<template v-if="payType == '全款'">
					
					<el-table-column label="准考证号" align="center" width="180">
						<template #default="{ row }">
							<el-input 
								size="small" 
								v-model="row.exam_card_code" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '11', row.exam_card_code)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="准考证图片" align="center" width="120">
						<template #default="{ row }">
							<el-button type="primary" size="small" @click="zkzUpload(row)">
								{{row.exam_card_code_pic ? "查看" : '上传'}}
							</el-button>
						</template>
					</el-table-column>
					
					<el-table-column label="报考部门" align="center" width="180">
						<template #default="{ row }">
							<el-input 
								size="small" 
								v-model="row.exam_department" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '3', row.exam_department)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="报考职位" align="center" width="180">
						<template #default="{ row }">
							<el-input 
								size="small" 
								v-model="row.exam_position" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '4', row.exam_position)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="职位代码" align="center" width="180">
						<template #default="{ row }">
							<el-input 
								size="small" 
								v-model="row.exam_position_code" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '5', row.exam_position_code)"
							></el-input>
						</template>
					</el-table-column>
					
				</template>
				
				<template v-else>
					
					<el-table-column label="岗位招考人数" align="center" width="120">
						<template #default="{ row }">
							<el-input 
								size="small"
								v-model="row.recruits_num" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '10', row.recruits_num)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="准考证号" align="center" width="180">
						<template #default="{ row }">
							<el-input 
								size="small" 
								v-model="row.exam_card_code" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '11', row.exam_card_code)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="准考证图片" align="center" width="120">
						<template #default="{ row }">
							<el-button type="primary" size="small" @click="zkzUpload(row)">
								{{row.exam_card_code_pic ? '查看' : '上传'}}
							</el-button>
						</template>
					</el-table-column>
					
					<el-table-column label="报考部门" align="center" width="180">
						<template #default="{ row }">
							<el-input
								size="small" 
								v-model="row.exam_department" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '3', row.exam_department)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="报考职位" align="center" width="180">
						<template #default="{ row }">
							<el-input
								size="small" 
								v-model="row.exam_position" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '4', row.exam_position)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="职位代码" align="center" width="180">
						<template #default="{ row }">
							<el-input
								size="small" 
								v-model="row.exam_position_code" 
								placeholder="请输入..."
								@change="inputValueChange(row.protocol_student_id, '5', row.exam_position_code)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="补充信息类型" align="center" width="190">
						<template #default="{row, $index}">
							<el-select 
								v-model="row.exam_standard" 
								placeholder="请选择" 
								size="small" 
								@click.native.capture="visibleChange(row, $index, $event)"
								@change="infoTypeChange(row)"
							>
								<el-option label="名次符合状元标准" :value="1"></el-option>
								<el-option label="分数符合状元标准" :value="2"></el-option>
							</el-select>
						</template>
					</el-table-column>
					
					<el-table-column label="名次" align="center" width="120">
						<template #default="{ row }">
							<el-input 
								size="small" 
								v-model="row.rank" 
								placeholder="请输入..."
								@change="scoreChange(row)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="最低分数线" align="center" width="120">
						<template #default="{ row }">
							<el-input 
								size="small" 
								v-model="row.mini_score" 
								placeholder="请输入..."
								@change="scoreChange(row)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column label="成绩分数" align="center" width="120">
						<template #default="{ row }">
							<el-input 
								size="small" 
								v-model="row.exam_score" 
								placeholder="请输入..."
								@change="scoreChange(row)"
							></el-input>
						</template>
					</el-table-column>
					
					<el-table-column prop="score_diff" label="分数差" align="center" width="120">
						<template #default="{row}">
							{{poorGrades(row.exam_score, row.mini_score)}}
						</template>
					</el-table-column>
					
					<el-table-column label="成绩单图片" align="center" width="120">
						<template #default="{ row }">
							<el-button type="primary" size="small" @click="cjdUpload(row)">
								{{row.score_pic ? '查看' : '上传'}}
							</el-button>
						</template>
					</el-table-column>
					
					<el-table-column label="最新维护时间" align="center" width="180">
						<template #default="{ row }">
							{{row.update_at}}
						</template>
					</el-table-column>
					
					<el-table-column label="维护人" align="center" width="120">
						<template #default="{ row }">
							{{row.operat_name}}
						</template>
					</el-table-column>
					
				</template>
				
				<el-table-column fixed="right" label="操作" width="160">
					<template #default="{ row }">
						<el-button 
							v-auth="'PS_VIEW_ORDER'"
							@click="handleClick(row)" 
							type="text" 
							size="small" 
							style="font-size: 13px;"
						>查看订单</el-button>
						<el-button
							v-auth="'PS_CONFIRM_AUDIT'"
							@click="handleAudit(row)" 
							type="text" 
							size="small" 
							style="font-size: 13px;"
						>{{row.extStatus == 0 ? '确认审核' : '取消审核'}}</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<el-pagination
				class="container-pagination"
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page="page"
			  :page-sizes="pageSizes"
			  :page-size="pageSize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="total">
			</el-pagination>
			
		</div>
		
		<!-- 准考证照片 -->
		<protoUpdate
			:visible.sync="protoVisible"
			:protoObject="protoObject"
		/>
		
		<!-- 确认审核提示 -->
		<protocolAudit 
			:visible="auditVisible"
			:auditObject="auditObject"
			@cancelVisible="cancelVisible"
		/>
		
		<!-- 确认切换提示 -->
		<switchPrompt 
			:visible.sync="switchVisible"
		/>
		
		<!-- 成绩单图片 -->
		<protoTranscript 
			:visible.sync="protoTranscript"
			:transcriptObject="transcriptObject"
		/>
		
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import Util from '@/common/util.js'
	import {page} from '@/common/mixins.js'
	import { getProtoCourseOrderList, getProtoOrderStatusAudit, 
	getProtoSaveProtocolStudent, getProtoPersonalSuppUnion } from '@/api/orderManage.js'
	import portocolSearch from './portocolSearch.vue'
	import pagination from '../../components/pagination.vue'
	import protoUpdate from '../components/portocolCommon/protoUpdate.vue'
	import protocolAudit from '../components/portocolCommon/protocolAudit.vue'
	import switchPrompt from '../components/portocolCommon/switchPrompt.vue'
	import protoTranscript from '../components/portocolCommon/protoTranscript.vue'
	export default{
		mixins:[page],
		components: {
			portocolSearch,
			pagination,
			protoUpdate,
			protocolAudit,
			switchPrompt,
			protoTranscript
		},
		data(){
			return {
				protoVisible: false,
				protoObject: {},
				auditVisible: false, // 是否审核 dialog 展示
				auditObject: {},
				protoTranscript: false,
				transcriptObject: {},
				switchVisible: false,
				statistics: {}, // 统计信息
				searchContent: {}, // 搜索的内容
				tableData: [],
				pageSizes: Object.freeze([10, 20, 30]),
			}
		},
		
		computed: {
			payType(){
				return this.$route.query.payType
			},
			...mapState(['username'])
		},
		methods:{
			getList(){
				this.query()
			},
			searchFunc(obj){ // 搜索
				this.searchContent = obj;
				this.page = 1;
				this.pageSize = 10;
				this.query();
			},
			query(){
				let payDateStr = ""; 
				const params = {
					product_id: this.$route.query.product_id, // 课程id
					orderStatus: this.searchContent.orderStatus,
					page: this.page,
					pageSize: this.pageSize
				}
				if(this.searchContent.input){
					params[this.searchContent.searchType] = this.searchContent.input;
				}
				if(this.searchContent.payDate.length > 0){
					payDateStr = Util.formatDate(this.searchContent.payDate[0]) + ',';
					payDateStr += Util.formatDate(this.searchContent.payDate[1]);
					params.payDateStr = payDateStr;
				}
				getProtoCourseOrderList(params)
					.then(res => {
						if(res.code == 10000 && res.data){
							this.total = res.data.order_list.total;	
							this.statistics = res.data.statistics;
							this.tableData = res.data.order_list.data.map(item => ({
								...item,
								isExpand: false, 
							}))
						}
					})
					.catch(err => {
						console.log("err: ",err);
					})
			},
			zkzUpload(row){ // 准考证图片上传
				this.protoObject = row;
				this.protoVisible = true;
			},
			cjdUpload(row){ // 成绩单图片上传
				this.protoTranscript = true;
				this.transcriptObject = row
			},
			/**
			 * @param {Object} protocolStudentId  协议客户主键ID	
			 * @param {Object} actionType					请求类型
			 * @param {Object} stuInfo						要修改的协议用户信息
			 */
			async inputValueChange(protocolStudentId, actionType, stuInfo){
				if(!protocolStudentId){
					this.$message.error('【暂无协议用户信息，请督促学员签署协议】')
					return;
				}
				const params = {
					protocolStudentId,
					actionType,
					stuInfo,
					operatName: this.username
				}
				const resp = await getProtoSaveProtocolStudent(params)
				if(resp.code == 10000 && resp.data.status == 1){
					// 回显维护人
					if (this.payType == '预收') {
						const obj = this.tableData.find(item => item.protocol_student_id === protocolStudentId);
						this.$set(obj, 'operat_name', resp.data.operatName);
					}
					this.$message.success('保存成功')
				}else{
					this.$message.error('保存失败')
				}
			},
			async checkBoxChange(row){ // 是否转结
				const params = {
					orderId: row.OrderID,
				}
				if(row.isTurn == 1){ // 未转结
					params.status = 4;
				}else if (row.isTurn == 2){ // 已转结
					params.status = 3;
				}
				const resp = await getProtoOrderStatusAudit(params)
				if(resp.code == 10000 && resp.data == true){
					this.$message.success('保存成功')
				}else{
					this.$message.error('保存失败')
				}
			},
			handleClick(row){
				const query = {orderId: row.OrderID, type: 'portocolClass', classId: this.$route.query.classId}
				if(this.payType){
					query.payType = this.payType
				}
				this.$router.push({
					path: '/orderManagement/orderService/portocolClass/submit',
					query
				})
			},
			async handleAudit(row){//确认审核
				const params = {
					orderId: row.OrderID,
				}
				
				if(row.extStatus == 0){ // 当前为未审核状态
					this.auditVisible = true; // 显示弹出框
					this.auditObject = row;
				}else if(row.extStatus == 1){ // 当前为已审核状态
					params.status = 2; // 修改为未审核
					const resp = await getProtoOrderStatusAudit(params)
					if(resp.code == 10000 && resp.data == true){
						row.extStatus = 0;
						this.$message.success('保存成功')
					}else{
						this.$message.error('保存失败')
					}
				}
			},
			async cancelVisible(visible, isAudit, auditObject){ // 确认审核 dialog 抛出的事件
				this.auditVisible = visible; // 取消显示 dialog
				if(isAudit == true){ // 点击的确定按钮
					const params = {
						orderId: auditObject.OrderID,
					}
					params.status = 1;// 修改为已审核状态
					const resp = await getProtoOrderStatusAudit(params)
					if(resp.code == 10000 && resp.data == true){
						auditObject.extStatus = 1;
						this.$message.success('保存成功')
					}else{
						this.$message.error('保存失败')
					}
				}
			},
			visibleChange(row, index, event){
				// 补充类型下拉框触发时运行
				if(row.isExpand == false){
					event.stopPropagation()
					row.isExpand = true; // 如果是第一次点击下拉框，弹出 dialog
					this.switchVisible = true;
				}
			},
			async scoreChange(row){ // 名次、分数发生改变时运行
				if(!row.protocol_student_id){
					this.$message.error('【暂无协议用户信息，请督促学员签署协议】')
					return;
				}
				const params = {
					protocolStudentId: row.protocol_student_id,
					operatName: this.username,
					examStandard: +row.exam_standard,
					rank: row.rank,
					miniScore: row.mini_score,
					examScore: row.exam_score
				}
				this.scoreChangeRequest(params)
			},
			async infoTypeChange(row){ 
				// 补充类型选中的值变化时触发
				row.rank = "";
				row.mini_score = "";
				row.exam_score = "";
			},
			async scoreChangeRequest(params){
				const resp = await getProtoPersonalSuppUnion(params)
				if(resp.code == 10000 && resp.data.status == 1){
					this.$message.success('保存成功')
				}else{
					this.$message.error('保存失败')
				}
			},
			overflowHidden(text){ // 超出15个字部分，打点展示
				if(text.length <= 15){
					return text
				} else {
					return text.substring(0, 15) + '...'
				}
			},
			courseStatus(classStatus){ // 课程状态
				// 状态  1：正常 2：退班 3：转班4：隐藏
				const status = ['', '正常', '退班', '转班', '隐藏', '转班未付款', '彻底删除', '退额', '协议退费']
				if(classStatus){
					return status[classStatus];
				}
			},
			poorGrades(data1, data2){ // 分数差
				if(data1 - data2 <= 0){
					return data1 - data2;
				}else if(data1 - data2 > 0){
					return "+" + data1 - data2;
				}
			},
			moneyFormat(number){
				let result = Util.moneyFormat(number);
				if(result || result === 0 || result === '0'){
					return "￥" + result
				}
				return ""
			},
		},
	}
</script>

<style scoped="scoped" lang="less">
	.order-num{
		display: inline-block;
		font-size: 14px;
		color: #333;
		margin-left: 50px;

	}
	.order-num span{
		margin-right: 15px;
	}
</style>

