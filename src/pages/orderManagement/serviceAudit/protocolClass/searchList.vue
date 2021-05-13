<template>
	<!-- 协议班退费审核搜索列表 -->
	<div class="container-searchLine">
		<el-form
			:model="ruleForm" 
			ref="ruleForm" 
			label-width="100px"
			class="demo-ruleForm"
			inline="inline"
		>	
			
			<el-form-item size="small" style="display: block" prop="dateValue">
				
				<el-select
					v-model="ruleForm.dateType" 
					placeholder="请选择"
					size="small" 
					style="width: 130px;"
				>
					<el-option label="审核提交日期" value="auditDate"></el-option>
					<el-option label="付款日期" value="datePayment"></el-option>
				</el-select>
				
				<el-date-picker
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="ruleForm.dateValue"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="small"
				>
				</el-date-picker>
				
			</el-form-item>
			
			<el-form-item label="订单编号: " size="small" prop="orderNo">
				<el-input v-model="ruleForm.orderNo" placeholder="请输入"></el-input>
			</el-form-item>
			
			<el-form-item
				label="考试类型: " 
				size="small" 
				style="line-height: 33px;"
				v-show="visible"
				prop="cateId"
			>
				<el-select v-model="ruleForm.cateId	" placeholder="请选择" style="width: 188px;">
					<el-option label="请选择" value=""/>
					<el-option label="公务员" value="0" />
					<el-option label="事业单位" value="1" />
					<el-option label="军队文职" value="2" />
					<!-- <el-option
						v-for="(item, key) in ruleForm.cateInfo"
						:key="key"
						:label="item" 
						:value="key"
					></el-option> -->
				</el-select>
			</el-form-item>
					
			<el-form-item
				label="是否协议班: " 
				size="small" 
				style="line-height: 33px;"
				v-show="visible"
				prop="istreaty"
			>
				<el-select v-model="ruleForm.istreaty" placeholder="请选择" style="width: 188px;">
					<el-option label="请选择" :value="1"/>
					<el-option label="协议班" :value="2" />
					<el-option label="非协议班" :value="3" />
				</el-select>
			</el-form-item>
					
			<el-form-item label="用户名: " size="small" v-show="visible" prop="userName">
				<el-input v-model="ruleForm.userName" placeholder="请输入"></el-input>
			</el-form-item>
					
			<el-form-item label="手机号: " size="small" v-show="visible" prop="mobile">
				<el-input v-model="ruleForm.mobile" placeholder="请输入"></el-input>
			</el-form-item>
			
			<el-form-item label="操作员: " size="small" v-show="visible" prop="optUser">
				<el-input v-model="ruleForm.optUser" placeholder="请输入"></el-input>
			</el-form-item>
			
			<el-form-item label="课程名称: " size="small" v-show="visible" prop="courseName">
				<el-input v-model="ruleForm.courseName" placeholder="请输入"></el-input>
			</el-form-item>
			
			<el-form-item label="课程ID: " size="small" v-show="visible" prop="classId">
				<el-input v-model="ruleForm.classId" placeholder="请输入"></el-input>
			</el-form-item>
			
			<!-- 查询按钮 -->
			<el-form-item style="position: relative;bottom: 5px;margin: 0;" label=" ">
				<el-button 
					type="primary" 
					@click="submitForm" 
					size="small"
				>查询</el-button>
				<el-button 
					@click="resetForm('ruleForm')" 
					size="small"
				>重置</el-button>
			
			</el-form-item>
			
		</el-form>
		
		<span
		  :class="[visible ? 'toggle-btn close' : 'toggle-btn open']"
		  @click="handleClick"
		>{{visible ? '收起' : '展开'}} 
		<i
			class="iconfont"
			:class="[visible ? 'iconshouqi' : 'iconzhankai']"
		></i></span>
		
	</div>
</template>

<script>
	export default{
		data(){
			return {
				visible: false,
				ruleForm: {
					dateType: 'auditDate', // 选择的日期类型
					dateValue: [], // 选择的日期
					orderNo: '', //订单编号
					cateId: '',
					istreaty: 1,
					userName: '',
					mobile: '',
					optUser: '',
					courseName: '',
					classId: ''
				},
			}
		},
		methods:{
			submitForm(){
				this.$emit('search', JSON.parse(JSON.stringify(this.ruleForm)));
			},
			resetForm(ruleForm) { //重置 将需要重置的元素加上 prop
				this.$refs[ruleForm].resetFields();
			},
			//展开 收起按钮
			handleClick(){
				this.visible = !this.visible;
			},
		}
	}
</script>

<style>
</style>
