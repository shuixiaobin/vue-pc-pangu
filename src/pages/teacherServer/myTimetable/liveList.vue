<template>
	<!-- 直播列表 -->
	<div class="module">
		<div class="container-title">
			<h2>直播列表详情</h2>
		</div>
	
		<div class="container-Box">
			
			<!-- 搜索栏 -->
			<searchBar 
				@queryData="queryData"
				:page="currentChange"
				:pageSize="pageSize"
			/>
		
		</div>
		
		<div class="container" style="margin-top: 20px;">
			<!-- 表单区 -->
			<tableContent 
				:tableList="tableList"
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
	import searchBar from './liveList/searchBar.vue'
	import tableContent from './liveList/tableContent.vue'
	import pagination from '../components/pagination.vue'
	export default{
		components:{
			searchBar,
			tableContent,
			pagination
		},
		data(){
			return {
				total: 0,
				tableList: {},
				currentChange: '1', //当前页数
				pageSize: '10' ,//每页条数
			}
		},
		methods:{
			queryData(data){ //查询的数据
				this.total = data.total;
				this.tableList = data;
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
