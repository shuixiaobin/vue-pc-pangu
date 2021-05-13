<template>
	<!-- 我的课表 -->

	<div class="module">
		<MenuTitle>
			<template v-slot:btn>
			</template>
		</MenuTitle>

		<div class="container" style="padding-top: 0;">
			<el-tabs v-model="activeName">
				
				<el-tab-pane label="课表日历" name="first">
					
					<!-- 日历 -->
					<myCalendar />
					
				</el-tab-pane>
				
				<el-tab-pane label="直播列表" name="second">
					
					<!-- 搜索栏 -->
					<searchBar
						@queryData="queryData"
						:page="currentChange"
						:pageSize="pageSize"
					 />			
					
					<!-- 表格 -->
					<tableContent
						:tableDate="tableDate"
					/> 	
				
					<!-- 分页 -->
					<pagination 
						:total="total"
						@handleSizeChange="handleSizeChange"
						@handleCurrentChange="handleCurrentChange"
					/> 		
					
				</el-tab-pane>
				
			</el-tabs>
		</div>

	</div>

</template>

<script>
	import searchBar from './searchBar.vue'
	import myCalendar from './myCalendar.vue'
	import tableContent from './tableContent.vue'
	import pagination from '../components/pagination.vue'
	export default {
		components:{
			searchBar,
			tableContent,
			pagination,
			myCalendar
		},
		data() {
			return {
				activeName: 'first',
				total: 0, //总条数
				tableDate: [], //搜索的 table 数据
				currentChange: '1', //当前页数
				pageSize: '10' ,//每页条数
			};
		},
		created(){
			this.activeName = this.$route.params.id == "5" ? "second" : "first";
		},
		methods: {
			queryData(data){ //查询的数据
				this.total = data.total;
				this.tableDate = data.data;
			},
			//每页条数
			handleSizeChange(pageSize){
				if(pageSize){
					this.pageSize = pageSize
				}
			},
			//当前页数
			handleCurrentChange(currentChange){
				if(currentChange){
					this.currentChange = currentChange
				}
			},
		}
	}
</script>

<style scoped="scoped" lang="less">
.container-title {
	border-bottom:  none;
}
	
</style>
