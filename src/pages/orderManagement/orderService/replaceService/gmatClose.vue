<template>
	<!-- 代报名关闭 -->
	<div>
		
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
			
			<el-form-item label="操作:" prop="operation">
				<el-select v-model="ruleForm.operation" placeholder="请选择赠课原因">
					<el-option label="退班" value="2"></el-option>
				</el-select>
			</el-form-item>
			
			<el-form-item label="用户名:" prop="userName">
				<el-col :span="12">
					<el-input 
						type="textarea"
						v-model="ruleForm.userName" 
						placeholder="请输入"
						rows="3"
						resize="none"
					></el-input>
				</el-col>
			</el-form-item>
			<div class="parentText">
				<p class="text">1、每一个用户用回车分隔</p>
				<p class="text">2、如果是从EXECL里直接粘贴出来，请先粘贴到text文本里去除格式</p>
				<p class="text">3、请注意，必须去掉最后的一行空格</p>
			</div>
			
			<el-form-item label="扣除积分: " prop="reduceIntegral">
				<el-radio-group v-model="ruleForm.reduceIntegral">
					<el-radio label="1">是</el-radio>
					<el-radio label="2">否</el-radio>
				</el-radio-group>
			</el-form-item>
			
			<el-form-item label="关闭原因:" prop="reason">
				<el-select v-model="ruleForm.reason" placeholder="请选择赠课原因">
					<el-option label="学员不在需要" value="学员不在需要"></el-option>
					<el-option label="代报操作失误" value="代报操作失误"></el-option>
					<el-option label="其他" value="其他"></el-option>
				</el-select>
			</el-form-item>
			
			<el-form-item label="备注: " prop="note">
				<el-col :span="8">
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
			
			<el-form-item>
				<el-button 
					type="primary" 
					size="small" 
					@click="submitForm('ruleForm')"
					:disabled="ruleForm.userInfoCheck"
				>提交</el-button>
				<el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
				
			
		</el-form>	
		
		<!-- 关联课程组件 -->
		<relatedCourse
			ref="course"
			@submitCourse="submitCourse"
		/>
		
		<!-- 代报名关闭结果 -->
		<gmatPopout 
			ref="popout"
			:GmatClosed="GmatClosed"
			title="代报名关闭结果"
		/>
		
	</div>
</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	import relatedCourse from './relatedCourses.vue'
	import gmatPopout from './gmatPopout.vue'
	import { mapState } from 'vuex'
	export default{
		data(){
			return {
				ruleForm: {
					isRelatedCourse: '', //是否有关联课程
					operation: '2', //操作
					userName: '', //用户名
					reduceIntegral: '1', //扣除积分
					reason: '学员不在需要', //原因
					note: '', //备注
				},
				GmatClosed: [], //代报名关闭列表
				relatedCourses: [], //关联课程列表
				rules: {
					isRelatedCourse: [{ //是否有关联课程
						required: true,
						message: '请选择关联',
					}],
					operation: [{ //操作
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					userName: [{ //用户名
						required: true,
						message: '请选择',
						trigger: 'blur'
					}],
					reduceIntegral:[{ //扣除积分
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					reason: [{ //原因
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					note: [{ //备注
						required: true,
						message: '请选择',
						trigger: 'change'
					}]
				}
			}
		},
		components: {
			relatedCourse,
			gmatPopout
		},
		computed:{
			...mapState(['username']),
		},
		methods:{
			submitCourse(val){ //子组件的关联过来的课程
				this.relatedCourses = val;
				this.ruleForm.isRelatedCourse = true;
				this.$refs['ruleForm'].clearValidate(['isRelatedCourse']); //清除关联课程的校验
			},
			keyCourse(formName) { //关联课程
				this.$refs.course.dialogTableVisible = true;
			},
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
			submitForm(formName) { //提交
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let setNetclassIdarr = '';//课程id
						this.relatedCourses.forEach(item => {
							setNetclassIdarr += item.courseId + ','
						})
						setNetclassIdarr = setNetclassIdarr.substring(0, setNetclassIdarr.length - 1)
						
						const obj = {
							setNetclassIdarr: setNetclassIdarr, //课程id
							userName: this.ruleForm.userName.trim(), //要关闭的用户名
							status: this.ruleForm.operation, //操作
							remark: this.ruleForm.note, //备注
							minus: this.ruleForm.reduceIntegral, //是否扣除积分
							closeReason: this.ruleForm.reason, //关闭原因
							operUser: this.$store.state.username, //操作人
						}
						
						orderManage.postGmatClosed(obj)
							.then(res => {
								this.GmatClosed = res.data; 
								this.$refs.popout.dialogTableVisible = true; //点击提交时,调用子组件.
							})
							.catch(err => {
								console.log('err: ', err);
								this.$message.error(err)
							})
						
					} else {
						this.$message.error('error submit!')
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
	.parentText{
		overflow: hidden;
	}
	.text{
		color:#AAAAAA;
		font-family: 'ArialMT', 'Arial';
		font-weight: 400;
		font-style: normal;
		font-size: 13px;
		margin: 0;
		padding: 0;
		position: relative;
		left: 170px;
		white-space: nowrap;
	}
</style>
