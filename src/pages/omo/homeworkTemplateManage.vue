<template>
	<div class="homework-container">
		<div class="title">
			<h2>作业模板管理</h2>
			<el-button type="primary" size="small" @click="dialogFormVisible = true">添加模板</el-button>
		</div>

		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="templateTitle" label="模板标题" >
			</el-table-column>
			<el-table-column prop="region" label="适用地区">
				<template slot-scope="{row}">
					{{row.region.join('、')}}
				</template>
			</el-table-column>
			<el-table-column prop="createDate" label="创建时间">
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="dialogFormVisible = true">编辑</el-button>
					<el-button type="text" size="small" @click="setHomework(scope.row)">设置作业</el-button>
					<el-button type="text" size="small" style="color: red;" @click="dialogVisible = true">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<editTemplate :visible.sync="dialogFormVisible" />
		
		<el-dialog
		  title="信息"
		  :visible.sync="dialogVisible"
		  width="40%"
		  :before-close="handleClose">
		  <span style="font-size: 15px;">确定要删除该模板及模板内所有作业吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="handleClose" size="small">取 消</el-button>
		    <el-button type="primary" @click="handleClick" size="small">确 定</el-button>
		  </span>
		</el-dialog>
		
	</div>
</template>

<script>
	import editTemplate from './components/editTemplate.vue'
	export default {
		components:{editTemplate},
		data() {
			return {
				tableData: [{
					templateTitle: '模板1',
					region: ['上海', '北京'],
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
			setHomework(row){ // 设置作业
				this.$router.push({
					path: '/home/OMO/OMOHomework/OMOhomeworkList', 
					query: {title: row.templateTitle},
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.homework-container {
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
