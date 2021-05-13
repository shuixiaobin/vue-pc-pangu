<template>
	<div class="module">
		<div class="container-title">
			<h2>退班服务</h2>
		</div>
		
		<div class="container-Box">
			<!-- 查询输入框 -->
			<services-list 
				:page="currentChange"
				:page_size="pageSize"
				@contentList="contentList"
				@isloading="isloading"
			/>
		</div>	
			<!-- 课程信息列表 -->
		<div 
			v-loading="loading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(f, f, f, 0.1)"
			class="container-Box mt16 minHeight"
		>
			<course-info 
				title="returnClass"
				:fontColor="color"
				:tableDate="tableDate"
			>	
				<template v-slot:left>退班</template>
			</course-info>	
			<!-- 分页 -->
			<pagination 
				@handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
				:total="total"
				ref="page"
			/>
		</div>
		
	</div>
</template>

<script>
import ServicesList from '../../components/servicesList.vue'
import CourseInfo from '../../components/courseInfo.vue'
import Pagination from '../../components/pagination.vue'
export default{
	components: {
		ServicesList,
		CourseInfo,
		Pagination
	},
	data(){
		return {
			color: 'blue',
			currentChange: '1', //当前页数
			pageSize: '10' ,//每页条数
			total: '0', //总数量
			tableDate: [], //请求的订单列表
			loading: false, //每次请求加载动画
		}
	},
	methods:{
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
		//请求的订单列表内容
		contentList(response){
			this.total = response.data.total;
			this.tableDate = response.data.data;
		},
		//加载中
		isloading(bool){
			this.loading = bool;
		}
	}
}
</script>

<style scoped>
</style>
