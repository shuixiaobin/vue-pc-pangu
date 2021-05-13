<template>
	<!-- 我的课时-搜索栏 -->

	<el-form 
		:inline="true" 
		ref="ruleForm" 
		:model="ruleForm" 
		class="demo-form-inline"
	>
		
		<el-form-item class="search-wrap">
			<p class="notice" v-show="isShow">
				<span>默认统计近一个月课时</span>
				<span></span>
			</p>
			<span class="teaching-date">日期: 
				<i 
					style="cursor: pointer;" 
					class="el-icon-info" 
					@mouseenter="prompt"
					@mouseleave="cancelPrompt"
				></i>
			</span>
			
			<el-date-picker
				v-model="ruleForm.date"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				style="margin-right: 16px;margin-top: 6px;"
				size="small"
			>
			</el-date-picker>
		</el-form-item>
		
		<el-form-item style="margin-top: 2px; margin-left: 20px;">
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
	startTime.setMonth(startTime.getMonth() - 1);
	export default {
		props:['pages', 'sizes'],
		data() {
			return {
				ruleForm: {
					date: [startTime, endTime]
				},
				id: null, // 助教id
				pid: null,//教师id 
				isShow: false, //是否显示日期提示信息
				page: 1,  //页数
				size: 20, //条数
				tableCatch: {}, //查询时缓存的数据
			}
		},
		watch:{
			pages(newVal){
				this.tableCatch.page = newVal;
				this.sendRequest(obj)
			},
			sizes(newVal){
				this.tableCatch.size = newVal;
				this.sendRequest(obj)
			}
		},
		computed: {
			...mapState(['username']),
		},
		mounted() {
			
				const userName = this.$store.state.username;
				teacher.getMyClassTeacherId({userName: userName})
					.then(res => {
						if(res.code <= 0){
							// this.$message.error(res.msg)
						}else if(res.code > 0){
							this.pid = res.data.teacherId;
						}
						this.onSubmit()
					})
					.catch(err => {
						this.$message.error(err)
					})
					
		},
		methods: {
			onSubmit() { //查询
					
				const obj = {
					dateBegin: this.getDateString(this.ruleForm.date[0]),
					dateEnd: this.getDateString(this.ruleForm.date[1]),
					page: 1, //页数
					size: 20,  //条数
				}
				
				if(this.pid){
					obj.pid = this.pid, //蓝色后台教师ID
					obj.id = "";
					this.tableCatch = obj;
					this.$message.success('当前的身份为 教师')
					this.sendRequest(obj)
				}else{
					teacher.getFindByUsername({userName: this.$store.state.username})
						.then(res => {
							if(res.data.id){
								this.id = res.data.id; // 助教id	
								obj.id = this.id;
								obj.pid = ""; 
								this.tableCatch = obj;
								this.$message.success('当前的身份为 助教')
								this.sendRequest(obj)
							}else{
								this.$message.error('教师|助教不存在，请联系管理员操作！')
							}
						})
						.catch(err => {
							this.$message.error(err)
						})
						
				}
				
			},
			sendRequest(obj){ //发送请求
				teacher.getMyClassTime(obj)
					.then(res => {
						if(res.data.length == 0){
							this.$message.info('当前没有课时信息！')
						}else{
							if(!res.data && res.message){
								this.$message.error(res.message)
							}else {
								this.$emit('tableData', res)
							}
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			getDateString(date){
				const year = date.getFullYear().toString().padStart(4, "0")
				const month = (date.getMonth() + 1).toString().padStart(2, "0")
				const day = date.getDate().toString().padStart(2, "0")
				return `${year}-${month}-${day}`
			},
			resetForm(formName) { //重置
				this.ruleForm.date = '';
				this.value1 = [];
			},
			prompt(){ //鼠标移动到日期上显示提示信息
				this.isShow = true;
			},
			cancelPrompt(){ //鼠标移出日期隐藏提示信息
				this.isShow = false;
			}
		},
	}
</script>

<style scoped="scoped">
	.teaching-date{
		font-size: 14px;
		color: #606266;
	}
	.notice{
		position: absolute;
		top: -32px;
		width: 160px;
		height: 35px;
		line-height: 35px;
		background: #000000;
		opacity: 0.75;
		color: #9c9c9c;
		border-radius: 4px;
		padding: 0 10px;
	}
	.notice span:last-child{
		position: relative;
		top: 29px;
		right: 113px;
		border: 5px solid transparent;
		border-top:5px solid #000;
		
	}
	
	
	/* .export{
		position: absolute;
		right: 0;
		top: 8px;
		color: #303133;
	}
	.export:hover{
		background-color: #1856FF;
		color: #fff;
	} */
</style>
