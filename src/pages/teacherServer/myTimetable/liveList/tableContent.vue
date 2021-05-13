<template>
	<!-- 直播列表详情-表单区域 -->
	<div>

		<div class="promptInfo" v-if="showData.total">
			<i class="el-icon-info"></i>
			<p>
				您在【{{this.$route.query.courseTitle}}】【{{this.$route.query.content}}】直播教室上 该时段 共有
				<span class="span1">{{showData.total}}</span> 条评价 ，均分<span class="span2"> {{showData.averageScore}} </span>分
			</p>
		</div>

		<el-table 
			ref="multipleTable" 
			:data="tableData" 
			highlight-current-row
			tooltip-effect="dark" 
			style="width: 100%" 
		>	
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column label="序号" type="index"></el-table-column>
			<el-table-column prop="username" label="评价用户名"></el-table-column>
			<el-table-column prop="coursescore" label="评分"></el-table-column>
			<el-table-column prop="courseRemark" label="评分内容"></el-table-column>
			<el-table-column prop="rateDate" label="评价时间"></el-table-column>
			<el-table-column prop="isHidden" label="前端是否可见">
				<template slot-scope="scope">
					{{scope.row.isHidden === 0 ? "可见" : "不可见"}}
				</template>
			</el-table-column>
		</el-table>


	</div>

</template>

<script>
	import * as teacher from '@/api/teacher.js'
	export default {
		props:{
			tableList: Object,
		},
		data() {
			return {
				tableData: [],//要展示的数据
				showData: {}, //提示信息
			}
		},
		watch:{
			tableList(newVal){ //查询的数据
				this.tableData = newVal.lists;
				
				this.showData.total = newVal.total;
				this.showData.averageScore = newVal.averageScore;
			},
		},
		methods: {
		}
	}
</script>

<style scoped="scoped" lang="less">
	.promptInfo {
		height: 32px;
		line-height: 32px;
		background-color: #c2edff;
		padding-left: 16px;
		margin: 30px 0 10px 0;

		i {
			color: #1856FF;
			vertical-align: middle;
		}

		p {
			display: inline-block;
			font-size: 12px;

			.span1 {
				color: #00f;
			}

			.span2 {
				color: #f00;
			}
		}

	}
	
	.operate-class{
		color: #108ee9;
		font-size: 14px;
		cursor: pointer;
	}
	
</style>
