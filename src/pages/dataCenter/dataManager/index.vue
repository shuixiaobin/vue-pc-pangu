<template>
	<!-- 注册数据管理 -->
	<div class="module">
		<MenuTitle>
		</MenuTitle>
		
		<div class="container-Box">
			<search @search="searchFunc"/>
		</div>
		
		<div class="container-Box mt16 minHeight">
		
			<el-table
				ref="singleTable"
				:data="tableData"
				style="width: 100%"
				border
			>
				<el-table-column fixed="left" property="name" width="150" align="center"></el-table-column>
				
				<template v-for="([k, v]) in Object.entries(obj)">
					
					<el-table-column 
						:key="k" 
						:label="v.label" 
						width="120" 
						align="center" 
						#default="{row}"
					>
						<span :class="[v.compare(row) ? 'green' : 'red']">{{row[k]}}</span>
					</el-table-column>
					
					<el-table-column 
						:key="v.lastName" 
						:property="v.lastName" 
						label="去年同期" 
						width="120" 
						align="center" 
					/>
				
				</template>
				
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
	import search from './search.vue'
	import Util from '@/common/util.js'
	import { getDataQuery } from '@/api/dataCenter.js'
	export default {
		mixins: [page],
		components: {
			search
		},
		data(){
			return {
				pageSizes: Object.freeze([10, 20, 30]),
				isDay: false,
				beginTime: '',
				endTime: '',
				tableData: [],
				obj: {
					'alluser': {
						label: '查询总计',
						lastName: 'lastAllUser',
						compare: (row) => row.alluser >= row.lastAllUser 
					},
					'android': {
						label: 'Android',
						lastName: 'lastAndroid',
						compare: (row) => row.android >= row.lastAndroid 
					},
					'ios': {
						label: 'iPhone',
						lastName: 'lastIos',
						compare: (row) => row.ios >= row.lastIos 
					},
					'pc': {
						label: 'PC',
						lastName: 'lastPc',
						compare: (row) => row.pc >= row.lastPc 
					},
					'androidIpad': {
						label: 'Android-pad',
						lastName: 'lastAndroidIpad',
						compare: (row) => row.androidIpad >= row.lastAndroidIpad 
					},
					'iosIpad': {
						label: 'iPad',
						lastName: 'lastIosIpad',
						compare: (row) => row.iosIpad >= row.lastIosIpad 
					},
					'weChat': {
						label: '微信',
						lastName: 'lastWeChat',
						compare: (row) => row.weChat >= row.lastWeChat 
					},
					'mobile': {
						label: 'M站',
						lastName: 'lastMobile',
						compare: (row) => row.mobile >= row.lastMobile 
					},
					'smallRoutine': {
						label: '小程序',
						lastName: 'lastSmallRoutine',
						compare: (row) => row.smallRoutine >= row.lastSmallRoutine 
					},
					'phpBatch': {
						label: 'PHP批量注册',
						lastName: 'lastPhpBatch',
						compare: (row) => row.phpBatch >= row.lastPhpBatch 
					},
					'education': {
						label: '教育同步',
						lastName: 'lastEducation',
						compare: (row) => row.education >= row.lastEducation 
					},
					'teacherSync': {
						label: '教师网同步',
						lastName: 'lastTeacherSync',
						compare: (row) => row.teacherSync >= row.lastTeacherSync 
					},
					'teacherAndroid': {
						label: '教师安卓',
						lastName: 'lastTeacherAndroid',
						compare: (row) => row.teacherAndroid >= row.lastTeacherAndroid 
					},
					'teacherIos': {
						label: '教师苹果',
						lastName: 'lastTeacherIos',
						compare: (row) => row.teacherIos >= row.lastTeacherIos 
					},
					'others': {
						label: '其他',
						lastName: 'lastOthers',
						compare: (row) => row.others >= row.lastOthers 
					},
				}
			}
		},
		methods: {
			getList(){
				this.query()
			},
			searchFunc(params){
				if(params.beginTime){
					this.beginTime = Util.dateFormatter(params.beginTime)
					this.endTime = Util.dateFormatter(params.endTime)
				}
				this.isDay = params.isDay;
				
				this.page = 1;
				this.pageSize = 10;
				this.query();
			},
			query() { // 查询
				const params = {
					page: this.page,
					pageSize: this.pageSize,
					isDay: this.isDay
				}
				if(this.beginTime){
					params.beginTime = this.beginTime;
					params.endTime = this.endTime;
				}
				
				getDataQuery(params)
					.then(res => {
						if(res.data){
							this.total = res.data.total;
							this.tableData = res.data.resultList;
						}
					})
					.catch(err => {
						this.$message.error(err)
						console.log("err: ",err);
					})
			},
		}
	}
</script>

<style scoped="scoped">
	.green{
		color: #13CE66;
	}
	.red{
		color: #F01416;
	}
</style>
