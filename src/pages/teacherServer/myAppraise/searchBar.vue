<template>
	<!-- 我的评价-搜索栏 -->

	<el-form :inline="true" ref="ruleForm" :model="ruleForm" class="demo-form-inline">
		
			
			<el-form-item style="margin-right: 24px;">
				<el-select 
					v-model="ruleForm.course" 
					placeholder="课程名称" 
					style="width: 120px;" 
					size="small"
				>
					<el-option label="课件名称" value="0"></el-option>
					<el-option label="课程名称" value="1"></el-option>
				</el-select>
				<el-input style="width: 200px;" v-model="ruleForm.text" placeholder="请输入" size="small"></el-input>
			</el-form-item>
			
			<el-form-item style="margin-right: 24px;">
				<span class="">课程类型: </span>
				<el-select 
					v-model="ruleForm.courseType" 
					placeholder="请选择" 
					style="width: 120px;" 
					size="small"
				>
					<el-option label="直播" value="1"></el-option>
					<el-option label="录播" value="2"></el-option>
				</el-select>
			</el-form-item>
			
			<el-form-item style="margin-right: 60px;">
				<span class="teaching-date">评价日期: </span>
				<el-date-picker
					v-model="ruleForm.date"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					style="margin-top: 6px;"
					size="small"
				>
				</el-date-picker>
			</el-form-item>
		
		<el-form-item style="margin-top: 1px;">
			<el-button type="primary" @click="onSubmit" size="small">查询</el-button>
			<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
		</el-form-item>
		
	</el-form>

</template>

<script>
	import * as teacher from '@/api/teacher.js'
	import Util from '@/common/util';
	import { mapState } from 'vuex'
	const endTime = new Date();
	const startTime = new Date();
	startTime.setFullYear(startTime.getFullYear() - 1);
	export default {
		props: {
			page: String,
			pageSize: String,
			sortList: Object
		},
		data() {
			return {
				ruleForm: {
					course: '', //课程名称
					text: '', 
					courseType: '', //课程类型
					// date: [Util.formatTime2(startTime), Util.formatTime2(endTime)], //日期
					date: [startTime, endTime],
					tableCatch: {}, //翻页、排序时使用的缓存数据
				},
				teacherId: null, //教师id
			}
		},
		computed:{
			...mapState(['username']),
			tableCatch(){
				return this.ruleForm.tableCatch
			}
		},
		mounted(){
			teacher.getMyClassTeacherId({userName: this.$store.state.username}) //得到 pid
				.then(res => {
					if(res.code <= 0){
						this.$message.error(res.msg + " 请联系管理员进行操作")
					}else if(res.code > 0){
						this.teacherId = res.data.teacherId;
						this.onSubmit(); // 刚进来 获取教师id，再直接调用接口
					}
				})
				.catch(err => {
					this.$message.error(err)
				})
		},
		watch:{
			tableCatch(newVal){ //当每次数据发生变化时，提交到父元素，为导出做准备
				this.$emit('tableCatchChange', newVal)
			},
			sortList(newVal){ //当用户点击排序时 添加排序字段，重新请求数据
				this.ruleForm.tableCatch.sortField = newVal.prop; //将排序字段名改为，当前更改的排序字段
				if(newVal.order == 'ascending'){ //排序的是 评价时间 列
					this.ruleForm.tableCatch.sortType = 'asc'; //升序，  默认降序
				}else{
					this.ruleForm.tableCatch.sortType = 'desc'; //降序 
				}
				this.requestData(this.ruleForm.tableCatch);
			},
			page(newVal){
				this.ruleForm.tableCatch.page = newVal;
				this.$emit('isLoading', true)
				this.requestData(this.ruleForm.tableCatch)
			},
			pageSize(newVal){
				this.ruleForm.tableCatch.pageSize = newVal;
				this.$emit('isLoading', true)
				this.requestData(this.ruleForm.tableCatch)
			}
		},
		methods: {
			onSubmit() { //查询
				this.$emit('isLoading', true)
				const obj = {
					teacherId: this.teacherId, //教师id
					page: 1, //页码
					pageSize: 10, //页容量
					export: 0, //不导出
				}
				if(this.ruleForm.date[0]){
					let startDate = new Date(this.ruleForm.date[0].toLocaleDateString())
					
					obj.startTime = this.getDateString(startDate); //开始时间
					obj.endTime = this.getDateString(this.ruleForm.date[1]); //结束时间
				}
				if(this.ruleForm.text){
					obj.searchType = this.ruleForm.course; //课程名称
					obj.searchValue = this.ruleForm.text; //搜索的值
				}
				if(this.ruleForm.courseType){
					obj.courseType = this.ruleForm.courseType; //课程类型
				}
				
				this.ruleForm.tableCatch = obj;
				this.requestData(obj);
			
			},
			requestData(obj){ //请求数据
				teacher.getMyEvaluateList(obj)
					.then(res => {
						this.$emit('isLoading', false)
						if(res.code > 0){
							if(res.data.lists.length == 0){
								this.$message.error('没有您的评价信息！')
								this.$emit('queryData', {total: 0})
							}else{
								this.$emit('queryData', res.data)
							}
						}else{
							this.$message.error(res.msg)
						}
					})
					.catch(err => {
						this.$message.error(err)
						this.$emit('isLoading', false)
					})
			},
			getDateString(date){
				const year = date.getFullYear().toString().padStart(4, "0")
				const month = (date.getMonth() + 1).toString().padStart(2, "0")
				const day = date.getDate().toString().padStart(2, "0")
				
				const hour = date.getHours().toString().padStart(2, "0")
				const second = date.getSeconds().toString().padStart(2, "0")
				const minute = date.getMinutes().toString().padStart(2, "0")
				
				return `${year}-${month}-${day} ${hour}:${minute}:${second}`
			},
			resetForm(formName) { //重置
				this.ruleForm.course = '';
				this.ruleForm.text = '';
				this.ruleForm.courseType = '';
				this.ruleForm.date = '';
			},
			handleExport(){ //导出
				
			}
		}
	}
</script>

<style scoped="scoped">
	.teaching-date{
		font-size: 14px;
		color: #606266;
	}
	.export{
		position: absolute;
		right: 0;
		top: 8px;
		color: #303133;
	}
	.export:hover{
		background-color: #1856FF;
		color: #fff;
	}
</style>
