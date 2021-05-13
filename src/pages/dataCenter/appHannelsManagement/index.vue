<template>
	<!-- 数据中心-APP推广渠道管理 -->

	<div class="module">
		<MenuTitle>
		</MenuTitle>
		
		<div class="container">

			<!-- 搜索 -->
			<searchBar
				@tableData="tableData"
				:page="pagers.pages"
				:pageSize="pagers.sizes"
			/>

			<!-- 表格 -->
			<tableContent
				:listData="listData"
			/>

			<pagination
				@handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
				:total="pagers.total"
			/>

		</div>

	</div>

</template>

<script>
	import searchBar from './searchBar.vue'
	import tableContent from './tableContent.vue'
	import pagination from './pagination.vue'
	export default{
		data(){
			return {
				listData: {}, //列表查询
				pagers: {
					total: 0,
					sizes: 10, //条数
					pages: 1, //页数
				}
			}
		},
		components:{
			searchBar,
			tableContent,
			pagination
		},
		methods:{
			tableData(res){
				this.pagers.total = res.data.pageInfo.total;
				this.listData = res;
			},
			handleSizeChange(val){
				this.pagers.sizes = val;
			},
			handleCurrentChange(val){
				this.pagers.pages = val;
			}
		}
	}
</script>

<style scoped="scoped">
</style>
