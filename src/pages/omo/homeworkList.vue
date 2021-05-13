<template>
	<div class="homework-list-container">
		<div class="title">
			<h2>{{$route.query.title}}</h2>
			<el-button type="primary" size="small" @click="dialogFormVisible = true">添加作业</el-button>
		</div>
		
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="homeworkDate" label="作业日期" >
			</el-table-column>
			<el-table-column prop="title" label="作业标题">
			</el-table-column>
			<el-table-column prop="createDate" label="创建时间">
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button type="text" size="small">编辑</el-button>
					<el-button type="text" size="small" style="color: red;" @click="dialogVisible = true">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<editHomework :visible.sync="dialogFormVisible" />
		
		<el-dialog
		  title="信息"
		  :visible.sync="dialogVisible"
		  width="40%"
		  :before-close="handleClose">
		  <span style="font-size: 15px;">确定要删除该作业吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="handleClose" size="small">取 消</el-button>
		    <el-button type="primary" @click="handleClick" size="small">确 定</el-button>
		  </span>
		</el-dialog>
		
		
	</div>
</template>

<script>
	import editHomework from './components/editHomework.vue'
	export default{
		components: {editHomework},
		data() {
			return {
				tableData: [{
					homeworkDate: '第一天',
					title: "模板1",
					createDate: '2020-11-10 18:30:24',
				}],
				dialogFormVisible: false,
				dialogVisible: false
			}
		},
		methods: {
			handleClose(){
				this.dialogVisible = false;
			},
			handleClick(){
				this.dialogVisible = false;
			},
		}
	}
</script>

<style scoped="scoped" lang="less">
	.homework-list-container{
		margin: 30px;
		
		.title {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20px;
			
			h2 {
				font-weight: bold;
				font-size: 20px;
			}
		}
	}
</style>
