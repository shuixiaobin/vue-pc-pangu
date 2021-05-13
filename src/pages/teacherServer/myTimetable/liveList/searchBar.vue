<template>
	<!-- 直播列表详情-搜索栏 -->

	<div>

		<el-form :inline="true" :model="formData" class="demo-form-inline">
			<el-form-item label="评分:" prop="score">
				<div style="display: inline-block;">
					<el-input style="width: 100px;" v-model="formData.minScore" placeholder="0" size="small"></el-input> ~
					<el-input style="width: 100px;" v-model="formData.maxScore" placeholder="5" size="small"></el-input>
				</div>
			</el-form-item>
			<el-form-item label="评价时间:">
				<el-date-picker
					v-model="formData.date"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					style="margin-right: 16px;margin-top: 6px;"
					size="small"
				>
				</el-date-picker>
			</el-form-item>
			
			<el-form-item>
				<el-button type="primary" @click="onSubmit" size="small">查询</el-button>
				<el-button @click="onReset('formData')" size="small">重置</el-button>
			</el-form-item>
			
		</el-form>


	</div>
</template>

<script>
	import * as teacher from '@/api/teacher.js'
	const endTime = new Date();
	const startTime = new Date();
	startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 365);
	export default {
		props:{
			page: String,
			pageSize: String,
		},
		data() {
			return {
				formData: {
					minScore: '', //最低分
					maxScore: '', //最高分
					date: [startTime, endTime],
				},
				tableCatch: {},//第一次请求缓存的数据
				appraisal: [], //评价id
			}
		},
		watch: {
			page(newVal){
				this.tableCatch.page = newVal;
				this.requestData(this.tableCatch)
			},
			pageSize(newVal){
				this.tableCatch.pageSize = newVal;
				this.requestData(this.tableCatch)
			},
		},
		mounted(){
			this.onSubmit()
		},
		methods: {
			onSubmit() { //查询
				const obj = {
					rid: this.$route.query.rid, //课件id
					page: 1, 
					pageSize: 10,
				}
				if(this.formData.date[0] && this.formData.date[1]){
					let startDate = new Date(this.formData.date[0].toLocaleDateString())
					let endDate = new Date(new Date(this.formData.date[1].toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1 )
					obj.startDate = this.getDateString(startDate); //开始日期
					obj.endDate = this.getDateString(endDate); //结束日期
				}
				if(this.formData.minScore && this.formData.maxScore){
					obj.minScore = this.formData.minScore; //评分最低值
					obj.maxScore = this.formData.maxScore; //评分最高值
				}
				this.tableCatch = obj;
				this.requestData(obj)
			},
			requestData(obj){
				teacher.getLiveEvaluateList(obj)
					.then(res => {
						if(res.code >= 0){
							this.$emit('queryData', res.data)
						}else{
							this.$message.error(res.msg)
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			onReset(){
				this.formData.minScore = '';
				this.formData.maxScore = '';
				this.formData.date = '';
			},
			getDateString(date){ //返回 yyyy-mm-dd 格式的日期
				const year = date.getFullYear().toString().padStart(4, "0")
				const month = (date.getMonth() + 1).toString().padStart(2, "0")
				const day = date.getDate().toString().padStart(2, "0")
				
				const hour = date.getHours().toString().padStart(2, "0")
				const minute = date.getMinutes().toString().padStart(2, "0")
				const second = date.getSeconds().toString().padStart(2, "0")
				
				return `${year}-${month}-${day} ${hour}:${minute}:${second}`
			},
		}
	}
</script>

<style scoped="scoped" lang="less">
</style>
