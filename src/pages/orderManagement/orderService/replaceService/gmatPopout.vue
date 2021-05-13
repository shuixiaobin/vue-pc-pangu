<template>
	<div>
		<!-- 代报名关闭的弹框 -->
		<el-dialog :title="title" :visible.sync="dialogTableVisible">
		  <el-table :data="gridData">
		    <el-table-column property="user" label="用户名" width="200"></el-table-column>
		    <el-table-column property="netclassid" label="课程ID" width="150"></el-table-column>
				<el-table-column property="message" label="处理结果" width="200">
					<template slot-scope="scope">
						<span style="color: red;">{{scope.row.message}}</span>
					</template>
				</el-table-column>
		  </el-table>
		</el-dialog>
		
	</div>
</template>

<script>
	export default{
		props: {
			GmatClosed: { //代报名关闭
				type: Array
			},
			title: {
				type: String
			},
		},
		data() {
			return {
				gridData: [],
				dialogTableVisible: false,
				formLabelWidth: '120px'
			};
		},
		watch: {
			GmatClosed(newVal){
				this.gridData = newVal
			}
		}	
	}
</script>

<style>
</style>
