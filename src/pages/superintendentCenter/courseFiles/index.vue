<template>
	<!-- 学员信息维护 -->
	<div class="module">
		<MenuTitle>
		</MenuTitle>
		
		<div class="container-Box">
			<el-select v-model="searchInTime.searchType" placeholder="请选择" size="small" style="width: 120px;">
				<el-option label="课程标题" value="2"></el-option>
				<el-option label="课程id" value="1"></el-option>
			</el-select>
		
			<el-input v-model="searchInTime.input" placeholder="请输入内容" size="small" class="courseInput"></el-input>
		
			<el-button type="primary" size="small" class="courseButton" @click="searchFunc" v-auth="'CF_FIND'">查询</el-button>
			<el-button size="small" @click="reset">重置</el-button>
		
		</div>
		
		<div class="container-Box mt16">
			
			<el-table
				:data="tableData"
				style="width: 100%"
				@sort-change="sortChange"
			>
				<el-table-column
					fixed
					prop="classId"
					label="课程id"
					width="150"
					align="center"
				>
				</el-table-column>
				<el-table-column
					prop="title"
					label="课程名称"
					width="220">
				</el-table-column>
				<el-table-column
					prop="studentNum"
					label="学员人数"
					width="80">
				</el-table-column>
				<el-table-column
					prop="newNum"
					label="今日学员新增"
					width="120">
				</el-table-column>
				<el-table-column
					prop="grouProbability"
					label="加群率"
					sortable
					width="120">
				</el-table-column>
				<el-table-column
					prop="noGroupNum"
					label="未加群"
					width="80">
				</el-table-column>
				<el-table-column
					prop="remarkProbability"
					label="群服务备注率"
					sortable
					width="140">
				</el-table-column>
				<el-table-column
					prop="noRemarkNum"
					label="未备注"
					width="100">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="200"
					#default="{row}"
				>
					<el-button 
						type="text" 
						size="small" 
						v-auth="'CF_STUDENTS_TABLE'"
						@click="jumpStudents(row)" 
					>学员表</el-button>
					<el-button 
						type="text" 
						size="small" 
						v-auth="'CF_PUSH'"
						@click="jumpStudentsPush(row)" 
					>push推送</el-button>
					<el-button 
						type="text" 
						size="small" 
						v-auth="'CF_DATA_REPORT'"
						@click="handleData(row.classId)" 
					>数据报表</el-button>
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
			
			<dataReport 
				:visible.sync="visible"
				:classId="classId"
			/>
			
		</div>
		
	</div>
</template>

<script>
	import {page} from '@/common/mixins.js'
	import dataReport from './dataReport.vue'
	import { getCourseArchivesList } from '@/api/learnCenter'
	export default{
		mixins: [page],
		components:{ 
			dataReport 
		},
		data(){
			return {
				visible: false,
				classId: '',
				pageSizes: Object.freeze([10, 20, 30]),
				searchInTime: { // 实时的搜索框结果
					searchType: '2',
					input: '',
				},
				searchResult: { // 点击搜索后的结果
					searchType: '',
					input: ''
				},
				tableData: [],
			}
		},

		methods:{
			getList(){
				this.query()
			},
			searchFunc(){
				this.searchResult = { //点击查询之后，将数据保存一份
					...this.searchInTime
				}

				this.page = 1;
				this.pageSize = 10;
				this.query();
			},
			async query(){ // 请求数据
				const {searchType, input} = this.searchResult;
				if(!input){
					this.$message.error('请输入要查询的内容')
					return;
				}
				const params = {
					searchType: searchType,
					telNo: this.$store.state.phone,
					page: this.page,
					pageSize: this.pageSize
				}
				searchType == '1' && (params.classIds = input);
				searchType == '2' && (params.title = input);
				
				const resp = await getCourseArchivesList(params)
				if(resp.code == 10000){
					this.total = resp.data.total;
					this.tableData = resp.data.data;
				} else {
					this.$message.error(resp.msg)
				}
				
			},
			reset(){ // 重置
				this.searchInTime.input = ''
			},
			
			// 学员表
			jumpStudents(row){
				this.$router.push({
					path: '/superintendentCenter/courseFiles/studentTable',
					query: {courseName: row.title, courseId: row.classId}
				})
			},
			
			// push推送
			jumpStudentsPush(row){
				this.$router.push({
					path: '/superintendentCenter/courseFiles/studentPush',
					query: {courseName: row.title, courseId: row.classId}
				})
			},
			
			//表格的排序条件发生变化的时候会触发该事件
			sortChange(row){
				console.log("row: ",row);
			},
			
			// 数据报表
			handleData(classId){
				this.visible = true;
				this.classId = classId.toString();
			}
		}
	}
</script>

<style scoped="scoped">
	.courseInput {
		width: 200px;
	}
	
	.courseButton {
		margin-left: 80px;
	}
</style>
