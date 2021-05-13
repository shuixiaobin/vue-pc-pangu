<template>
	<div class="block">
		<el-pagination
			class="container-pagination"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage1"
			:page-sizes="pageSizes"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="+total">
		</el-pagination>
	</div>
</template>

<script>
export default{
	props: {
		total: {
			type: [String, Number]
		}
	},
	data() {
		return {
			currentPage1: 1, //当前页数
			pageSize: 10, //每页显示条目个数
			pageSizes: [10, 20], //每页显示个数选择器的选项设置
		};
	},
	methods: {
		handleSizeChange(val) { //每页多少条
			this.$emit('handleSizeChange', val)
		},
		handleCurrentChange(val) { //页码
			this.$emit('handleCurrentChange', val)
		}
	},
}
</script>

<style scoped>
</style>
