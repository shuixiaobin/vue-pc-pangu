<template>
	<div class="search">
		<el-select 
			v-model="searchType" 
			placeholder="请输入内容" 
			size="small" 
			style="width: 120px;"
		>
			<el-option label="课程标题" value="1"></el-option>
			<el-option label="课程id" value="2"></el-option>
		</el-select>
	
		<el-input
			v-model="inputValue" 
			:placeholder="searchType == '2' ? '多个课程id英文逗号相隔' : '请输入内容'"  
			size="small" 
			class="courseInput"
		></el-input>
	
		<el-button type="primary" size="small" class="courseButton" @click="query" v-auth="'PS_CLASS_FIND'">查询</el-button>
		<el-button size="small" @click="reset">重置</el-button>
	
		<!-- <el-button type="primary" size="small" class="courseButton">导出结算名单</el-button> -->
	</div>
</template>

<script>
	export default {
		data(){
			return {
				searchType: '1',
				inputValue: '',
			}
		},
		mounted() {
			this.query()
		},
		methods: {
			query(){
				this.$emit('search', this.searchType, this.inputValue)
			},
			reset(){
				this.inputValue = ""
			}
		}
	}
</script>

<style scoped="scoped">
	.courseInput {
		width: 200px;
	}
	.courseButton {
		margin-left: 80px;
	}
</style>

