<template>
	<div>
		<!-- 0元赠课 -->
		<el-form
			:model="ruleForm" 
			:rules="rules" 
			ref="ruleForm" 
			label-width="170px" 
			class="demo-ruleForm elForm"
			required
		>
			<el-form-item label="关联课程:" prop="isRelatedCourse">
				<el-button type="primary" @click="keyCourse" size="small">关联课程</el-button>
			</el-form-item>
		
			<el-table
				:data="relatedCourses" 
				style="width: 100%;" 
				show-summary
				sum-text="课程金额总计"
				:summary-method="summaryMethod"
				v-if="relatedCourses.length > 0"
			>
				<el-table-column property="courseId" label="课程ID" width="120"></el-table-column>
				<el-table-column property="classNo" label="课程编号" width="250"></el-table-column>
				<el-table-column property="title" label="课程名称" width="380"></el-table-column>
				<el-table-column property="actualPrice" label="价格" width="100">
					<template slot-scope="scope">
						<span>￥{{scope.row.actualPrice}}</span>
					</template>
				</el-table-column>
			</el-table>
		
			<el-form-item label="用户账号:" prop="userName">
				<el-col :span="12">
					<el-input 
						type="textarea"
						v-model="ruleForm.userName" 
						placeholder="请输入"
						rows="3"
						resize="none"
					></el-input>
					<span class="text">两个用户名要用回车分隔</span>
				</el-col>
			</el-form-item>
		
			<el-form-item label="0元赠课原因:" prop="reason">
				<el-select v-model="ruleForm.reason" placeholder="请选择赠课原因">
					<el-option label="教研部门原因" value="教研部门原因"></el-option>
					<el-option label="运营/产品部门原因" value="运营/产品部门原因"></el-option>
					<el-option label="质检部门原因" value="质检部门原因"></el-option>
					<el-option label="技术测试原因" value="技术测试原因"></el-option>
					<el-option label="其他" value="其他"></el-option>
				</el-select>
			</el-form-item>
		
			<el-form-item label="备注: " prop="note">
				<el-col :span="12">
					<el-input 
						type="textarea" 
						v-model="ruleForm.note" 
						placeholder="请输入" 
						cols="20" 
						rows="3"
					>
					</el-input>
				</el-col>
			</el-form-item>
		
			<el-form-item label="课程到期日期:">
				<el-col :span="8">
					<el-date-picker
						v-model="ruleForm.endTime"
						type="date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd"
					>
					</el-date-picker>		
				</el-col>
			</el-form-item>
			
			<el-form-item label="邮箱:" prop="UserEmail">
				<el-col :span="8">
					<el-input v-model="ruleForm.UserEmail" placeholder="请输入"></el-input>
				</el-col>
			</el-form-item>
		
			<el-form-item>
				<el-button 
					type="primary" 
					size="small" 
					@click="submitForm('ruleForm')"
					v-auth="'RS_ZERO'"
				>提交</el-button>
				<el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		
		</el-form>
		
		<!-- 关联课程组件 -->
		<relatedCourse
			ref="course"
			:courseType="1"
			@submitCourse="submitCourse"
		/>
		
		<!-- 失败的弹框 -->
		<failPopout 
			ref="popout"
			:failList="failList"
			title="0元赠课失败结果"
		/>
		
	</div>
</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	import relatedCourse from './relatedCourses.vue'
	import failPopout from './failPopout.vue'
	import { mapState } from 'vuex'
	export default{
		data(){
			return {
				ruleForm: {
					isRelatedCourse: '', //是否有关联课程
					userName: '', //用户名
					reason: '', //0元赠课原因
					note: '', //备注
					endTime: '', //课程到期日期
					UserEmail: '', //邮箱
				},
				failList: [], //报名失败的用户账户
				relatedCourses: [], //关联课程列表
				rules: {
					isRelatedCourse: [{ //是否有关联课程
						required: true,
						message: '请选择关联',
					}],
					userName: [{ //用户名
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					reason: [{//0元赠课原因
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					note: [{ //备注
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
					UserEmail: [{//邮箱校验
						pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
						message: '请输入正确的邮箱格式',
						trigger: 'blur'
					}]
				}
			}
		},
		components: {
			relatedCourse,
			failPopout
		},
		computed: {
			...mapState(['username']),
		},
		methods: {
			summaryMethod(){ //表尾合并行展示
				let str = 0;
				this.relatedCourses.forEach(item => {
					str += +item.actualPrice
				})
				//实收金额
				this.ruleForm.receipt_money = str;
				str = "￥" + str
				return ['课程金额总计: ', str]
			},
			keyCourse(formName) { //关联课程
				this.$refs.course.dialogTableVisible = true;
			},
			submitCourse(val){ //子组件的关联过来的课程
				this.relatedCourses = val;
				this.ruleForm.isRelatedCourse = true;
				this.$refs['ruleForm'].clearValidate(['isRelatedCourse']); //清除关联课程的校验
			},
			submitForm(formName) { //提交
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let str = "";
						this.relatedCourses.forEach(item => {
							str += +item.courseId + ','
						})
						str = str.substring(0, str.length - 1);
						const obj = {
							userName: this.ruleForm.userName, //用户名
							classId: str, //课程id
							reason: this.ruleForm.reason, //原因
							endTime: this.ruleForm.endTime, //结束时间
							email: this.ruleForm.UserEmail, //邮箱
							orderRemark: this.ruleForm.note, //备注
							operUser: this.$store.state.username, //操作人
						}
						orderManage.postZeroOrderDoplay(obj)
							.then(res => {
								if(res.code == 10000){
									if(Array.isArray(res.data) && res.data.length !== 0){
										this.failList = res.data;
										this.$refs.popout.dialogTableVisible = true; //点击提交时,如果发生了错误,调用子组件.
									}else{
										this.$message.success('操作成功')
									}
								}else{
									this.$message.error(res.msg)
								}
							})
							.catch(err => {
								this.$message.error('操作失败,请检查后重新查询')
								// console.log('err: ', err);
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) { //重置
				this.$refs[formName].resetFields();
			}
		}
		
		
		
		
	}
</script>

<style scoped="scoped">
	.elForm{
		margin-left: 100px;
		margin-bottom: 100px;
	}
	.elForm .el-form-item{
		margin: 20px 0px;
	}
	.text{
		color:#AAAAAA;
		font-family: 'ArialMT', 'Arial';
		font-weight: 400;
		font-style: normal;
		font-size: 13px;
		position: relative;
		top: -8px;
		white-space: nowrap;
	}
	.el-table::before {
		width: 0;
	}
</style>
