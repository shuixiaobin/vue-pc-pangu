<template>
	<!-- 搜索栏 -->
	<div class="container-searchLine">
		<el-form 
			:model="ruleForm" 
			:rules="rules" 
			ref="ruleForm" 
			label-width="100px"
			class="demo-ruleForm"
			inline="inline"
		>	
			
			<el-form-item size="small" style="display: block">
				
				<el-select
					v-model="ruleForm.date_type" 
					placeholder="请选择" 
					size="small" 
					@change="handleChange"
				>
					<el-option
						v-for="(item, key) in ruleForm.dataType"
						:key="key"
						:label="item"
						:value="key"
					></el-option>
				</el-select>
				
				<el-date-picker
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="ruleForm.dateValue"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="small"
					:disabled="disabled"
				>
				</el-date-picker>
				
			</el-form-item>
			
			<el-form-item label="订单编号: " prop="orderNum" size="small" >
				<el-input v-model="ruleForm.orderNum" placeholder="请输入"></el-input>
			</el-form-item>
		
			<el-form-item label="用户名: " prop="userName" size="small">
				<el-input v-model="ruleForm.userName" placeholder="请输入"></el-input>
			</el-form-item>
		
			<el-form-item label="手机号: " prop="mobile" size="small">
				<el-input v-model="ruleForm.mobile" placeholder="请输入"></el-input>
			</el-form-item>
			
			<el-form-item
				label="考试类型: " 
				size="small" 
				style="line-height: 33px;"
				v-show="this.isShow"
			>
				<el-select v-model="ruleForm.cateId	" placeholder="请选择" style="width: 188px;">
					<el-option
						v-for="(item, key) in ruleForm.cateInfo"
						:key="key"
						:label="item" 
						:value="key"
					></el-option>
				</el-select>
			</el-form-item>
				
				
			<el-form-item 
				v-show="this.isShow"
				style="line-height: 33px;"
				label="课程名称: "
				prop="className"
				size="small"
			>
				<el-input 
					v-model="ruleForm.className" 
					placeholder="请输入"
				></el-input>
			</el-form-item>
			
			<el-form-item
				v-show="this.isShow"
				style="line-height: 33px;"
				label="课程id: "
				prop="classId"
				size="small"
			>
				<el-input 
					v-model="ruleForm.classId" 
					placeholder="请输入"
				></el-input>
			</el-form-item>
			
			
			<!-- 查询按钮 -->
			<el-form-item style="position: relative;bottom: 5px;margin: 0;" label=" ">
				<el-button 
					type="primary" 
					@click="submitForm('ruleForm')" 
					size="small"
					v-auth="'BTES_FIND'"
				>查询</el-button>
				<el-button 
					@click="resetForm('ruleForm')" 
					size="small"
				>重置</el-button>
			
			</el-form-item>
		
		</el-form>
		
		<span
		  :class="[this.isShow?'toggle-btn close':'toggle-btn open']"
		  @click="handleClick"
		>{{this.isShow?'收起':'展开'}} <i
			class="iconfont"
			:class="[this.isShow?'iconshouqi':'iconzhankai']"
		></i></span>
		
	</div>
</template>

<script>
import * as orderManage from '@/api/orderManage.js'
export default{
	props:{
		page: {
			type: [String, Number]
		},
		page_size: {
			type: [String, Number]
		}
	},
	data(){
		//手机号验证
		let validatorPhone = function (rule, value, callback) {
			if (value === '') {
				callback()
			} else if (!/^1\d{10}$/.test(value)) {
				callback(new Error('手机号格式错误'))
			} else {
				callback()
			}
		}
		return {
			ruleForm: {
				orderNum: '', //订单编号
				userName: '', //用户名
				mobile: '', //手机号
				dataType: {}, //请求的下拉列表字段
				// date_type: 'order', //下单时间/付款时间
				// dateValue: [new Date( new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0) ), new Date()], //time
				date_type: '', //下单时间/付款时间
				dateValue: [], //time
				cateId	: '', //考试类型
				cateInfo: {}, //请求来的考试类型
				className: '',//课程名称
				classId: '',//课程id
			},
			isShow: false, //是否显示全部输入框
			disabled: true,
			// cateInfoLock: true, //列表是否请求过
			do_type: '', //当前的服务类型
			tableDate: [],
			catchData: {}, //翻页时用到的缓存数据
			rules: {
				mobile: [{ validator: validatorPhone, trigger: 'blur' }], //手机号验证
			},
		}
	},
	watch: {
		page(){
			if(this.catchData){
				this.$emit('isloading', true)
				this.$set(this.catchData, "page", this.page)
				orderManage.getOrderList(this.catchData)
					.then(res => {
						this.tableDate = res
						this.$emit("contentList", res)
						this.$emit('isloading', false)
					})
					.catch(err => {
						this.$message.error(err.message)
						this.$emit('isloading', false)
					})
			}
		},
		page_size(){
			if(this.catchData){
				this.$emit('isloading', true)
				this.$set(this.catchData, "page_size", this.page_size)
				orderManage.getOrderList(this.catchData)
					.then(res => {
						this.tableDate = res
						this.$emit("contentList", res)
						this.$emit('isloading', false)
					})
					.catch(err => {
						this.$message.error(err.message)
						this.$emit('isloading', false)	
					})
			}
		}
	},
	mounted() {
		//请求下拉列表的数据
		orderManage.getDictionaries({types: "cateInfo,serviceDateType"})
			.then(res => {
				this.ruleForm.dataType = res.data.serviceDateType
				this.ruleForm.cateInfo = res.data.cateInfo
			}).catch(err => {
				this.$message.error(err.message)
			})
	},
	methods: {
		handleChange(){
			this.disabled = false;
		},
		//展开 收起按钮
		handleClick(){
			this.isShow = !this.isShow;
		},
		submitForm(ruleForm) { //查询
			if(!this.ruleForm.userName && !this.ruleForm.mobile && !this.ruleForm.orderNum){
				this.$message.error('订单编号，用户名，手机号请至少填写一个查询')
			}else{
				this.$emit('isloading', true)
				let obj = {
					userName: this.ruleForm.userName, //用户名 
					orderNum: this.ruleForm.orderNum, //订单编号
					userMobile: this.ruleForm.mobile, //手机号
					classId: this.ruleForm.classId, //课程id
					className:this.ruleForm.className, //课程名称
					cateId: this.ruleForm.cateId, //考试类型
					page: this.page,
					page_size: this.page_size
				}
				if(this.ruleForm.dateValue){
					if(this.ruleForm.date_type == 'order'){
						obj.selectType = 1;
						obj.starDate = this.ruleForm.dateValue[0];
						obj.endDate = this.ruleForm.dateValue[1];
					}else if(this.ruleForm.date_type == 'payment'){
						obj.selectType = 2;
						obj.starDate = this.ruleForm.dateValue[0];
						obj.endDate = this.ruleForm.dateValue[1];
					}
				}
				
				let request = {} //过滤出空数据
				for(let key in obj){
					if(obj[key]){
						request[key] = obj[key]
					}
				}
				this.catchData = request;
				orderManage.getOrderList(request)
					.then(res => {
						if(res.data){
							this.tableDate = res
							this.$emit("contentList", res)
							if(res.data.data.length === 0){
								this.$message.info('暂无查询结果，请重新输入条件')
							}
						}else{ //手机号有误
							this.$message.info('您的查询条件有误，请核对后重新查询')
						}
						this.$emit('isloading', false)
					})
					.catch(err => {
						this.$message.error(err.message)
						this.$emit('isloading', false)
					})
			}
		},
		resetForm(ruleForm) { //重置
			this.$refs[ruleForm].resetFields();
		},
	}
}
</script>

<style scoped>
.show{
	font-size: 12px;
	margin-left: 20px;
	cursor: pointer;
	color: #1856FF;
}
</style>
