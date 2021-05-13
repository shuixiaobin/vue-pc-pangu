<template>
	<!-- 我的评价-表格-->
	
	<div>
		
		<div class="clearfix" style="margin: 8px 0;">
			<el-button
				class="export fr" 
				@click="handleExport" 
				size="small"
				v-auth="'MCL_ROOM'"
			>导出</el-button>
		</div>
		
		<div class="bg" v-if="this.evaluation">
			<i class="el-icon-info"></i>
			<div>您的评价均分为
				<span class="yellow">{{evaluation.totalAvg}}</span>
				;共收到
				<span class="green">{{evaluation.liveAmout}}</span>
				条直播评价，平均直播评分
				<span class="green">{{evaluation.liveAvg}}</span>，
				<span class="green">{{evaluation.recordAmout}}</span>
				条录播评价，平均录播评分
				<span class="green">{{evaluation.recordAvg}}</span>
			</div>
		</div>
		
		<el-table 
			:data="tableData" 
			style="width: 100%" 
			border
			:default-sort = "{prop: 'rateDate', order: 'descending'}"
			v-loading="loading"
			@sort-change="sortChange"
		>
			<el-table-column prop="netClasstitle" label="课程标题"></el-table-column>
			<el-table-column prop="type" label="类型" width="80"></el-table-column>
			<el-table-column prop="lessionTitle" label="课件标题"></el-table-column>
			<el-table-column prop="userName" label="评价用户名"></el-table-column>
			<el-table-column prop="courseScore" label="评分" width="80" sortable="custom"></el-table-column>
			<el-table-column prop="courseRemark" label="评分内容"></el-table-column>
			<el-table-column prop="rateDate" label="评价时间" sortable="custom"></el-table-column>
			<el-table-column prop="isHidden" label="前端是否可见" width="110"></el-table-column>
		</el-table>
		
	</div>
	


</template>


<script>
	export default {
		props: ['tableList', 'loadings', 'tableCatch'],
		data() {
			return {
				loading: false,
				evaluation: null, //评价
				tableData: [],
			}
		},
		watch:{
			tableList(newVal){
				this.tableData = newVal.lists;
				this.evaluation = newVal.count;
				this.loading = false;
			},
			loadings(newVal){
				this.loading = newVal;
			}
		},
		methods:{
			handleExport(){ //导出
				if(Object.keys(this.tableCatch).length == 0){
					this.$message.error('请先进行查询！')
				}else{
					var params = `userName=${this.$store.state.username}&export=1`;
					
					for (let prop in this.tableCatch) {
						if(prop !== "userName" && prop !== 'export'){
							params += `&${prop}=${this.tableCatch[prop]}`
						}
					}
					window.open(`${PANGU_URL}/v1/c/evaluate/my_evaluate_list?${params}`, '_parent')
				}
			},
			sortChange(eleName){ //排序
				this.loading = true;
				this.$emit('sortListChange', eleName)
			}
		}
	}
</script>

<style scoped="scoped">
	.scoreClass{
		color: #1856FF;
		cursor: pointer;
	}
	.bg{
		height: 40px;
		background-color: rgba(215, 237, 246, 1);
		line-height: 40px;
		margin: 8px 0;
	}
	.bg i{
		 color: #1856FF;
		 margin:0 15px;
	}
	.bg div{
		display: inline-block;
		color: #303133;
		font-size: 14px;
	}
	.bg .yellow{
		color: #FAAD14;
	}
	.bg .green{
		color: #24B366;
	}
	.export{
		color: #303133;
		/* float: right; */
	}
	.export:hover{
		background-color: #1856FF;
		color: #fff;
	}
	.clearfix::after{
		content: "";
		display: block;
		clear: both;
	}
</style>
