<template>
	<!-- 协议班服务 -->
	<div class="module">
		<MenuTitle>
		</MenuTitle>

		<div class="container-Box">

			<courseListSearch @search="searchFunc"/>
			
		</div>
		
		<div class="container-Box mt16 minHeight">

			<el-table :data="tableData" style="width: 100%;margin-top: 40px;">
				<el-table-column fixed prop="classId" label="课程id"></el-table-column>
				<el-table-column prop="title" label="课程名称">
					<template #default="{row}">
						<el-popover 
							placement="top-start" width="200" trigger="hover" 
							:content="row.title" :disabled="row.title.length <= 15"
						>
							<span slot="reference">{{overflowHidden(row.title)}}</span>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="pay_type" label="付费模式"></el-table-column>
				<el-table-column prop="status_desc" label="课程状态"></el-table-column>
				<el-table-column fixed="right" label="操作" v-auth="'PS_ADMISS_MANAGE'">
					<template slot-scope="scope">
						<el-button 
							@click="handleClick(scope.row)" 
							type="text" 
							size="small" 
							style="font-size: 13px;"
						>招生管理</el-button>
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

	</div>
</template>

<script>
	import {page} from '@/common/mixins.js'
	import { getProtoCourseList } from '@/api/orderManage.js'
	import courseListSearch from './courseListSearch.vue'
	// import {mapState} from 'vuex'
	export default {
		components: {courseListSearch},
		mixins: [page],
		data() {
			return {
				searchType: '1',
				inputValue: '',
				pageSizes: Object.freeze([10, 20, 30]),
				tableData: [],
			}
		},
		computed: {
			// ...mapState(['staffNo'])
		},
		methods: {
			getList(){
				this.query()
			},
			searchFunc(searchType, inputValue){
				this.searchType = searchType;
				this.inputValue = inputValue;
				this.page = 1;
				this.pageSize = 10;
				this.query();
			},
			query() { // 查询
				// if(!this.staffNo){
				// 	this.$message.error('缺少OA工号信息，请联系管理员操作')
				// 	return;
				// }
				const params = {
					page: this.page,
					pageSize: this.pageSize,
					// staffNo: this.staffNo
				}
				if(this.inputValue){
					params.searchType = this.searchType;
					this.searchType == '1' ? params.title = this.inputValue : params.classIds = this.inputValue;
				}
				getProtoCourseList(params)
					.then(res => {
						if(res.data){
							this.total = res.data.total;
							this.tableData = res.data.data;
						}else{
							this.$message.error(res.msg)
						}
						// console.log("res: ",res);
					})
					.catch(err => {
						this.$message.error(err.message)
					})	
			},
			handleClick(row){
				this.$router.push({
					path: '/orderManagement/orderService/portocolClass/portocolList',
					query: {product_id: row.classId,title: row.title, payType: row.pay_type, classId: row.classId}
				})
			},
			overflowHidden(text){ // 超出15个字部分，打点展示
				if(text.length <= 15){
					return text
				} else {
					return text.substring(0, 15) + '...'
				}
			}
		}
	}
</script>

<style></style>