<template>
	<!-- 班主任管理-学员表 -->
	<div class="module">
		
		<div class="container-title">
			<h2>
				课程档案-{{this.$route.query.courseName}}
			</h2>
		</div>
		
		<div class="container-Box">
			<studentTableSearch
				@search="searchFunc"
			/>
		</div>
		
		<div class="container-Box mt16">
		
			<el-table :data="tableData" style="margin-top: 40px;">
				<el-table-column fixed="left" prop="orderId" align="center" label="课程id" width="150"></el-table-column>
				<el-table-column prop="userName" align="center" label="用户名" width="220"></el-table-column>
				<el-table-column prop="goodPhone" align="center" label="收货手机号" width="130"></el-table-column>
				<el-table-column prop="registerPhone" align="center" label="注册手机号" width="130"></el-table-column>
				<el-table-column prop="classProgress" align="center" label="课件进度"></el-table-column>
				<el-table-column prop="courseStatus" align="center" label="课程状态" #default="{row}">
					{{courseStatus(row.classStatus)}}
				</el-table-column>
				<el-table-column prop="remark" align="center" label="备注留言" width="150"></el-table-column>
				<el-table-column prop="operRemark" align="center" label="操作员备注" width="150"></el-table-column>
				
				<el-table-column label="是否加群" align="center" #default="{row}" v-auth="'CF_IS_ADD_GROUP'">
					<el-checkbox 
						:true-label="1"
						:false-label="0"
						v-model="row.isGroup" 
						@change="orderGroupRequest(row.orderId, row.userId, 'isGroup', row.isGroup)"
					/>
				</el-table-column>
				<el-table-column align="center" label="订单群服务备注" width="180" #default="{row}" v-auth="'CF_GROUP_NOTE'">
						<el-input
						  type="textarea"
						  :rows="2"
						  placeholder="请输入内容"
						  v-model="row.groupRemark"
							@change="orderGroupRequest(row.orderId, row.userId, 'groupRemark', row.groupRemark)"
						>
						</el-input>
				</el-table-column>
				
				<el-table-column prop="groupTime" align="center" label="最新维护时间" width="160"></el-table-column>
				<el-table-column prop="operUser" align="center" label="维护操作员" width="180"></el-table-column>
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
		
	</div>
</template>

<script>
	import {page} from '@/common/mixins.js'
	import studentTableSearch from './studentTableSearch.vue'
	import { getStudentList, postStudentOrderGroup} from '@/api/learnCenter'
	export default{
		mixins: [page],
		components:{ studentTableSearch },
		data(){
			return {
				pageSizes: Object.freeze([10, 20, 30]),
				tableData: [],
				searchParams: {} // 搜索的字段
			}
		},
		mounted() {
			this.query()
		},
		methods:{
			getList(){
				this.query()
			},
			searchFunc(obj){
				this.searchParams = obj
				
				this.page = 1;
				this.pageSize = 10;
				this.query()
			},
			async query(){ // 发送请求
				const {conditionSearch, input, payDate, groupSearch} = this.searchParams
				
				const params = {
					classId: this.$route.query.courseId,
					groupSearch: groupSearch || '0', // 是否加群
					page: this.page,
					pageSize: this.pageSize
				}
				if(input || payDate){ // 如果文本框，或日期时间框有值按条件搜索，如果没值表示搜索全部
					params.conditionSearch = conditionSearch;
					switch(conditionSearch){
						case '1': 
							params.goodPhone = input;
							break;
						case '2':
							params.registerPhone = input;
							break;
						case '3':
							params.userName = input;
							break;
						case '4':
							params.payDate = payDate;
							break;
					}
				}
				
				const resp = await getStudentList(params)
				if(resp.code == 10000){
					this.total = resp.data.total;
					this.tableData = resp.data.data
				}
			},
			
			/**
			 * 是否加群 或 订单群服务备注 发送请求 
			 * @param {String} orderId
			 * @param {String} userId	 用户id
			 * @param {String} key     代表是否加群 或 群备注的 key 值
			 * @param {String} value
			 */
			async orderGroupRequest(orderId, userId, key, value){
				const params = {
					orderId,
					userId,
					operName: this.$store.state.username,
				}
				key == 'isGroup' ? (params.isGroup = value) : (params.groupRemark = value);
				const resp = await postStudentOrderGroup(params)
				if(resp.data && resp.data.operAction === 1){
					this.$message.success('保存成功')
				}else{
					this.$message.error('保存失败')
				}
			},
			//课程状态
			courseStatus(stateNum){
				const status = ['', '正常', '退班', '转班', '隐藏', '转班未付款', '彻底删除']
				return status[stateNum];
			},
		}
	}
</script>

<style>
</style>
