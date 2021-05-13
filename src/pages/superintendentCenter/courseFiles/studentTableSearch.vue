<template>
	<div class="container-searchLine">
		<el-select 
			v-model="conditionSearch" 
			size="small" 
			style="width: 120px;"
			@change="handleChange"
		>
			<el-option label="收货手机号" value="1"></el-option>
			<el-option label="注册手机号" value="2"></el-option>
			<el-option label="用户名" value="3"></el-option>
			<el-option label="付款时间范围" value="4"></el-option>
		</el-select>
		
		<el-input 
			v-if="conditionSearch !== '4'" 
			v-model="input"
			placeholder="请输入内容" 
			size="small" 
			class="courseInput"
		></el-input>
		<el-date-picker
			v-else
			v-model="payDate"
			type="datetimerange"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			size="small"
		>
		</el-date-picker>
		
		<el-select v-model="groupSearch" placeholder="请选择" size="small" style="width: 120px;">
			<el-option label="全部" value="0"></el-option>
			<el-option label="已加群" value="1"></el-option>
			<el-option label="未加群" value="2"></el-option>
		</el-select>
		
		<el-button 
			type="primary" 
			size="small" 
			class="courseButton" 
			@click="query"
			v-auth="'CF_STUDENTS_TABLE_FIND'"
		>查询</el-button>
		<el-button size="small" @click="reset">重置</el-button>
		<el-button 
			type="primary" 
			size="small" 
			class="courseButton" 
			@click="exportExcel"
			v-auth="'CF_EXPORT_STUDENT_TABLE'"
		>导出学员表</el-button>
		
		<div class="teach">
			班主任名单：{{teacherLists}}
		</div>
		
	</div>
</template>

<script>
	import { getCourseTeacher } from '@/api/learnCenter'
	import { getStudentList } from '@/api/learnCenter'
	import Util from '@/common/util.js'
	export default{
		data(){
			return {
				conditionSearch: '1',
				groupSearch: '0',
				input: '',
				payDate: [],
				classTeacherList: '',
			}
		},
		computed:{
			teacherLists(){
				if(this.classTeacherList.length <= 24)return this.classTeacherList;
				return this.classTeacherList.slice(0, 24) + '...';
			}
		},
		async mounted() {
			const params = {classId: this.$route.query.courseId}
			const resp = await getCourseTeacher(params)
			if(resp.data.reportType == 1){
				this.classTeacherList = resp.data.headmaster.join(', ')
			}else{
				this.classTeacherList = '- -'
			}
		},
		methods:{
			query(){
				const searchObj = {
					conditionSearch: this.conditionSearch,
					groupSearch: this.groupSearch,
					input: this.input,
					payDate: '',
				}
				if(this.payDate.length > 0){
					const startTime = Util.formatTime(this.payDate[0]);
					const endTime = Util.formatTime(this.payDate[1]);
					searchObj.payDate = `${startTime},${endTime}`;
				}
				
				// 如果选择了收货手机号 或 注册手机号，并且手机号不为 11位，或 0位(0位表示搜索全部)则提示用户，搜索条件有问题
				if( (this.conditionSearch == '1' || this.conditionSearch == '2') 
						&& 
						this.input.length != 11 
						&& 
						this.input.length != 0
				){
					this.$message.error('请输入正确手机号码')
					return;
				}
				this.$emit('search', searchObj)
			},
			reset(){
				this.groupSearch = '0';
				this.input = "";
				this.payDate = [];
			},
			
			async exportExcel(){ // 导出

				const classId = this.$route.query.courseId
				let url = `${PANGU_URL}/v1/c/netchart/student_list?isExcel=1&classId=${classId}`
				if(this.payDate.length > 0){
					const startTime = Util.formatTime(this.payDate[0]);
					const endTime = Util.formatTime(this.payDate[1]);
					url += `&payDate=${startTime},${endTime}`;
				}
				window.open(url, '_parent')
			},
			handleChange(){
				this.conditionSearch == '4' ? this.input = '' : this.payDate = [];
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
	.teach{
		display: inline-block;
		width: 250px;
		margin-left: 20px;
		vertical-align: middle;
	}
</style>
