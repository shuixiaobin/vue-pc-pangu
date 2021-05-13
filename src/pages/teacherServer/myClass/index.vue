<template>
	<!-- 我的课时 -->
	
	<div class="module">
		<MenuTitle>
			<template v-slot:btn>
				<!-- <el-button 
					class="export" 
					@click="handleExport" 
					size="small"
					v-auth="'MCT_EXPORT'"
				>导出</el-button> -->
			</template>
		</MenuTitle>
		
		
		<div class="container-Box">
			
			<!-- 搜索栏 -->
			<searchBar
				@tableData="tableData"
				:sizes="sizes"
				:pages="pages"
			/>
			
		</div>
		
		<div class="container" style="margin-top: 20px;">
			
			<!-- 表格 -->
			<tableContent
				:content="content"
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
	import pagination from '../components/pagination.vue'
	import tableContent from './tableContent.vue'
	export default{
		components: {
			searchBar,
			pagination,
			tableContent
		},
		data(){
			return {
				content: {},
				total: '', //总条数	
				sizes: 0, //条数
				pages: 0, //页数
			}
		},
		methods:{
			tableData(response){
				if(response.data){
					this.content = response.data.content;
					this.total = response.data.totalElements; //总条数	
				}else{
					this.$message.error('没有您的课时信息~~')
				}
			},
			handleExport(){ //导出
				
			},
			handleSizeChange(val){ //每页多少条
				this.sizes = val;
			}, 
			handleCurrentChange(val){//页码
				this.pages = val;
			}
		}
	}
</script>

<style scoped="scoped">
</style>
