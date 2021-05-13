<template>
	<!-- 我的评价 -->
	
	<div class="module">
		<MenuTitle>
			<template v-slot:btn>
			</template>
		</MenuTitle>
		
		<div class="container-Box">
			
			<!-- 搜索栏 -->
			<searchBar 
				@queryData="queryData"
				@isLoading="isLoading"
				@tableCatchChange="tableCatchChange"
				:page="currentChange"
				:pageSize="pageSize"
				:sortList="sortList"
			/>			
			
		</div>
		
		<div class="container" style="margin-top: 20px;">
			
			<!-- 表格 -->
			<tableContent 
				:tableList="tableList"
				:loadings="loadings"
				:tableCatch="tableCatch"
				@sortListChange="sortListChange"
			/> 	
							
			<!-- 分页 -->
			<pagination 
				:total="total"
				@handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
			/> 	
			
		</div>
		
	</div>
	
</template>

<script>
	import searchBar from './searchBar.vue'
	import tableContent from './tableContent.vue'
	import pagination from '../components/pagination.vue'
	export default{
		components:{
			searchBar,
			tableContent,
			pagination, 
		},
		data(){
			return {
				total: 0, 
				tableList: [], //数据列表
				currentChange: '1', //当前页数
				pageSize: '10' ,//每页条数
				loadings: false, //正在加载
				sortList: {}, //排序列表
				tableCatch: {}, //缓存的导出数据
			}
		},
		methods:{
			tableCatchChange(value){ //缓存的导出数据
				this.tableCatch = value;
			},
			isLoading(data){ //正在加载
				this.loadings = data;
			}, 
			queryData(data){ //查询的数据
				this.total = data.total;
				this.tableList = data;
			},
			sortListChange(value){ //排序顺序改变
				this.sortList = value;
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

<style scoped="scoped">
</style>
