<template>
	<!-- push推送 -->
	<div class="module">

		<div class="container-title">
			<h2>
				push推送-{{ this.$route.query.courseName }}
			</h2>
		</div>

		<div class="container-Box">

			<studentPushSearch 
				@search="searchFunc"
			/>

			<div class="mt30">
				<p class="font14">
					推送历史
				</p>
				<el-table :data="tableData" style="width: 100%;margin-top: 10px;">
					<el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
					<el-table-column label="通知标题" width="220">
						<template v-slot="scope">
							{{compNoticeTitle(scope.row)}}
						</template>
					</el-table-column>
					<el-table-column label="通知内容" width="220">
						<template v-slot="scope">
							{{compNoticeContent(scope.row)}}
						</template>
					</el-table-column>
					<el-table-column prop="id" label="推送任务id">
					</el-table-column>
					<el-table-column prop="pushTime" label="发送时间">
					</el-table-column>
					<el-table-column prop="creatorStr" label="创建人">
					</el-table-column>
				</el-table>
			</div>

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
	import studentPushSearch from './studentPushSearch.vue'
	import {page} from '@/common/mixins.js'
	import { postCoursePushSave, getPushCourseList } from '@/api/learnCenter'
	export default {
		mixins: [page],
		components: { studentPushSearch }, 
		data() {
			return {
				pageSizes: Object.freeze([10, 20, 30]),
				searchObj: {},
				tableData: [],
			}
		},

		created() {
			this.pushHistory()
		},
		
		methods: {
			searchFunc(obj){ // 保存的参数
				this.searchObj = obj;
				this.query()
			},
			async query(){ // 保存推送请求
				const params = {
					courseId: this.$route.query.courseId,
					userId: this.$store.state.userid,
					...this.searchObj
				}
				const resp = await postCoursePushSave(params)
				if(resp.code == 1000000){
					this.$message.success('保存成功')
					this.pushHistory()
				}else{
					this.$message.error(resp.message)
				}
			},
			
			getList(){
				this.pushHistory()
			},
			async pushHistory(){ // 推送历史
				const params = {
					page: this.page,
					pageSize: this.pageSize,
					courseId: this.$route.query.courseId
				}
				const resp = await getPushCourseList(params);
				if(resp.code == 1000000){
					this.total = resp.data.total;
					this.tableData = resp.data.resultList;
				}
			}
		},
		computed:{
			compNoticeTitle(){
				return function (row){
					if(row.title.length <= 15)return row.title;
					return row.title.slice(0, 15) + "..."
				}
			},
			compNoticeContent(){
				return function (row){
					if(row.content.length <= 15)return row.content;
					return row.content.slice(0, 15) + "..."
				}
			},
		},
	}
</script>

<style scoped="scoped">

</style>
