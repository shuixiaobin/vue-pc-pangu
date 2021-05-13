<template>
	<!-- 数据报表 -->
	<el-dialog title="数据报表" :visible.sync="visible" :before-close="handleClick">
	  <el-table :data="gridData">
	    <el-table-column property="userName" label="班主任姓名" width="150"></el-table-column>
	    <el-table-column property="groupProb" label="加群率" width="200"></el-table-column>
	  </el-table>
		
		<el-pagination
			class="container-pagination"
		  @size-change="handleSizeChange"
		  @current-change="handleCurrentChange"
		  :current-page="page"
		  :page-sizes="pageSizes"
		  :page-size="pageSize"
		  layout="total, sizes, prev, pager, next"
		  :total="total">
		</el-pagination>
		
		<span slot="footer" class="dialog-footer">
		  <el-button type="primary" @click="handleClick" size="small">确 定</el-button>
		</span>
		
	</el-dialog>
</template>

<script>
	import {page} from '@/common/mixins.js'
	import { getDataReportList } from '@/api/learnCenter'
	export default{
		mixins: [page],
		props: {
			visible: Boolean,
			classId: {
				type: String,
				required: true
			}
		},
		data(){
			return {
				pageSizes: Object.freeze([10, 20, 30]),
				dialogTableVisible: false,
				gridData: [],
			}
		},
		watch: {
			visible(newVal){
				if(newVal){
					this.page = 1;
					this.query()
				}
			}
		},
		methods: {
			getList(){
				this.query()
			},
			async query(){
				const params = {
					classId: this.classId,
					page: this.page,
					pageSize: this.pageSize
				}
				const resp = await getDataReportList(params)
				
				if(resp.code == 10000 && resp.data.reportType == 1){ // 有数据
					this.total = resp.data.list.total;
					this.gridData = resp.data.list.data;
				}
			},
			handleClick(){
				this.$emit('update:visible', false)
			}
		}
	}
</script>

<style scoped="scoped">
</style>
