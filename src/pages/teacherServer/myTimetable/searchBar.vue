<template>
	<!-- 我的课表-直播列表-搜索栏 -->

	<el-form :inline="true" ref="ruleForm" :model="ruleForm" class="demo-form-inline">
		
		<el-form-item>
			<span class="teaching-date">授课日期</span>
			<el-date-picker
				v-model="ruleForm.date"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				style="margin-right: 16px;"
				size="small"
			>
			</el-date-picker>
		</el-form-item>
		
		<el-form-item>
			<el-select 
				v-model="ruleForm.course" 
				placeholder="课程名称" 
				style="width: 120px;" 
				size="small"
			>
				<el-option label="直播状态" value="status"></el-option>
				<el-option label="课程ID" value="classId"></el-option>
				<el-option label="授课内容" value="coursewareTitle"></el-option>
				<el-option label="课程名称" value="classTitle"></el-option>
			</el-select>
			<el-input style="width: 200px;" v-model="ruleForm.text" placeholder="不限" size="small"></el-input>
		</el-form-item>
		
		<el-form-item>
			<el-button type="primary" @click="onSubmit" size="small">查询</el-button>
			<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
		</el-form-item>
		
		<el-form-item style="float: right;">
			<el-button
				class="export" 
				@click="handleExport" 
				size="small"
			>导出</el-button>
		</el-form-item>
		
	</el-form>

</template>

<script>
	import * as teacher from '@/api/teacher.js'
	import { mapState } from 'vuex'
	export default {
		props:['page', 'pageSize'], 
		data() {
			return {
				ruleForm: {
					course: '',
					text: '',
					date: [],
					page: 1, //页数
					pageSize: 10, //每页条数
					tableCatch: {}, //翻页时使用的缓存数据
				}
			}
		},
		mounted() {
			
			let date1 = new Date( new Date().setDate(1) ); //当月一日
			
			let date2 = new Date();
			date2.setMonth(date2.getMonth() + 1) //将日期对象设置为下月 1 日
			date2.setDate(0) //将日期对象设置为当月最后一日
			
			this.ruleForm.date = [date1, date2]; //设置默认查询一个月的信息
			this.onSubmit();
		},
		computed:{
			...mapState(['username']),
			tableCatch(){
				return this.ruleForm.tableCatch;
			}
		},
		watch:{
			page(newVal){
				this.ruleForm.page = newVal;
				this.ruleForm.tableCatch.page = this.ruleForm.page; //将上次查询的页数替换为改变之后的页数
				this.requestData(this.ruleForm.tableCatch) //使用之前搜索保存的数据
			},
			pageSize(newVal){
				this.ruleForm.pageSize = newVal;
				this.ruleForm.tableCatch.pageSize = this.ruleForm.pageSize;
				this.requestData(this.ruleForm.tableCatch)
			}
		},
		methods: {
			onSubmit() { //查询
				const obj = {
					userName: this.$store.state.username, //用户名
					// userName: "htwx_7723984", 
					page: this.ruleForm.page, //页数
					pageSize: this.ruleForm.pageSize, //每页条数
				}
				if(this.ruleForm.date[0] && this.ruleForm.date[1]){
					let startDate = new Date(this.ruleForm.date[0].toLocaleDateString())
					let endDate = new Date(new Date(this.ruleForm.date[1].toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1 )
					obj.startDate = this.getDateString(startDate); //开始日期
					obj.endDate = this.getDateString(endDate); //结束日期
				}
				if(this.ruleForm.course == 'status'){
					if(this.ruleForm.text.trim() == '未开始'){
						obj.status = 1;
					}else if(this.ruleForm.text.trim() == '进行中'){
						obj.status = 2;
					}else if(this.ruleForm.text.trim() == '已结束'){
						obj.status = 3;
					}else{
						this.$message.error('直播状态查询请传递：未开始、进行中、已结束 其中一种！')
					}
				}else if(this.ruleForm.course == 'classId'){ // 课程id为数字类型(不为 NaN)
					if(typeof Number.parseInt(this.ruleForm.text) == "number" && !Number.isNaN(Number.parseInt(this.ruleForm.text))){
						obj.classId = this.ruleForm.text;
					}else{
						this.$message.error('课程ID请输入数字！')
						return;
					}
				}else if(this.ruleForm.course == 'coursewareTitle'){
					obj.coursewareTitle = this.ruleForm.text;
				}else if(this.ruleForm.course == 'classTitle'){
					obj.classTitle = this.ruleForm.text;
				}
				this.ruleForm.tableCatch = obj;
				this.requestData(obj)
			},
			requestData(obj){ //请求数据
				teacher.getScheduleList(obj)
					.then(res => {
						if(res.code >= 0){
							if(res.data.data.length > 0){
								this.$emit('queryData', res.data)
							}else{
								this.$message.error('当前没有您的直播信息！');
								this.$emit('queryData', [])
							}
						}else{
							this.$message.error(res.msg)
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			handleExport(){ // 导出
				if(Object.keys(this.tableCatch).length == 0){
					this.$message.error('请先进行查询！')
				}else{
					var params = `userName=${this.$store.state.username}`;
					
					for (let prop in this.tableCatch) {
						if(prop !== "userName"){
							params += `&${prop}=${this.tableCatch[prop]}`
						}
					}
					window.open(`${PANGU_URL}/v1/c/schedule/schedule_export?${params}`, '_parent')
				}
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
				this.ruleForm.date = '';
			},
		}
	}
</script>

<style scoped="scoped">
	.teaching-date{
		font-size: 14px;
		color: #606266;
	}
	
	.export{
		color: #303133;
		
	}
	.export:hover{
		background-color: #1856FF;
		color: #fff;
	}
</style>
