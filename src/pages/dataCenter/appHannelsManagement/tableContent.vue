<template>
	<!-- APP推广渠道管理-表格 -->

	<div>
		
		<p 
			style="margin:50px 0 30px 0;font-size: 13px;"
		>
			<!-- 页面访问次数总计：null次 页面访问人数总计：null人&nbsp;&nbsp; -->
			注册用户总计：<span>{{this.registerTotalCount}}</span>人&nbsp;&nbsp;下载APP总计：<span>{{this.downloadTotalCount}}</span>人
		</p>
		
		<el-table :data="tableData" border style="width: 100%; margin-top: px;">
			<el-table-column prop="categoryName" label="分类名称" align="center"></el-table-column>
			<el-table-column prop="name" label="渠道名称"  width="180" align="center"></el-table-column>
			<el-table-column prop="url" label="链接地址"  width="180"  align="center"></el-table-column>
			<el-table-column prop="qrCode" label="二维码"  align="center" min-width="120px">
				<template slot-scope="scope">
					<img :src="scope.row.qrCode" style="width: 100px;height: 100px;">
					<!-- {{scope.row.qrCode}} -->
				</template>
			</el-table-column>
			<el-table-column prop="gmtCreate" label="渠道添加时间"  align="center"></el-table-column>
			<!-- <el-table-column prop="" label="页面访问次数（PV）"  align="center"></el-table-column>
			<el-table-column prop="" label="页面访问人数（UV）"  align="center"></el-table-column> -->
			<el-table-column prop="registerCount" label="注册用户数"  align="center"></el-table-column>
			<el-table-column prop="downloadCount" label="下载APP用户数"  align="center"></el-table-column>
		</el-table>

	</div>


</template>

<script>
	export default {
		props:{
			listData: Object
		},
		data() {
			return {
				tableData: [],
				downloadTotalCount: '0', //下载总量
				registerTotalCount: '0', //注册总量
				registerCount: '0', //注册量
				downloadCount: '0', //下载量
			}
		},
		watch: {
			listData(newVal){
				// console.log(newVal);
				if(newVal.code == 1000000){
					this.downloadTotalCount = newVal.data.downloadTotalCount;
					this.registerTotalCount = newVal.data.registerTotalCount;
					// this.tableData = newVal.data.list;
					this.tableData = newVal.data.pageInfo.list
					// console.log(this.tableData, newVal, newVal.list);
				}
			}
		}
	}
</script>

<style scoped="scoped">
</style>
