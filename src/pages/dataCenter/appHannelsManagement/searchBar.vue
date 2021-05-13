<template>
	<!-- APP推广渠道管理-搜索 -->
	
	<div class="block">
		<span class="demonstration" style="margin-right: 15px;">时间</span>
		<el-date-picker
			v-model="value1"
			type="datetimerange"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			value-format="yyyy-MM-dd HH:mm:ss"
			style="margin-right: 100px;"
			size="small"
		>
		</el-date-picker>
		
		<el-button type="primary" size="small" @click="query">查询</el-button>
		<el-button size="small" @click="reset">重置</el-button>
		
		<div class="float-right">
			<el-button size="small" @click="Export">导出</el-button>
			<el-button size="small" @click="addChannelBtn" auth="'OL_ADDQD'">添加渠道</el-button>
			<el-button size="small" @click="dialogChannelSort = true" auth="'OL_ADDTYPE'">添加渠道分类</el-button>
		</div>
		
		<el-dialog title="添加渠道" :visible.sync="dialogFormVisible" width="600px">
		  <el-form :model="form">
				
				<el-form-item 
					label="选择渠道分类" 
					:label-width="formLabelWidth" 
				>
					<el-select 
						v-model="form.value" 
						placeholder="请选择渠道分类" 
						style="width: 200px;"
						@focus="focusList"
					>
						<el-option
							v-for="item in form.channelList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
						</el-option>
					</el-select>
					<span class="notice-class">{{channelListMsg}}</span> <!-- 提示信息 -->
				</el-form-item>
				
		    <el-form-item label="渠道名称: " :label-width="formLabelWidth">
		   
					<el-input 
						v-model="form.name" 
						placeholder="请输入渠道名称"
						autocomplete="off" 
						style="width:200px;" 
						@focus="focusEvents"
						@blur="blurEvents"
					></el-input>
					<span class="notice-class">{{Notice}}</span>	<!-- 渠道名称提示信息 -->
		   
				</el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addChannel">添 加</el-button>
		  </div>
		</el-dialog>
		
		<el-dialog title="添加渠道分类" :visible.sync="dialogChannelSort" width="600px">
		  <el-form :model="channelForm">
				
		    <el-form-item label="分类名称: " :label-width="formLabelWidth">
		   
					<el-input 
						v-model="channelForm.name" 
						placeholder="请输入分类名称"
						autocomplete="off" 
						style="width:200px;" 
						@focus="focusCname"
						@blur="blurCname"
					></el-input>
					<span class="notice-class">{{cNameNotice}}</span>	<!-- 分类名称 -->
		   
				</el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogChannelSort = false">取 消</el-button>
		    <el-button type="primary" @click="addChannelSort">添 加</el-button>
		  </div>
		</el-dialog>
		
		
		
	</div>
	
</template>

<script>
	import * as dataCenter from '@/api/dataCenter.js'
	export default{
		props:['page', 'pageSize'],
		data(){
			return {
				value1: [], //日期时间组件的值
				value2: [], //当前显示数据的日期
				dialogFormVisible: false, //添加渠道
				dialogChannelSort: false, //添加渠道分类
				form: { //添加渠道
					channelList: [], //渠道列表
					value: '', //渠道列表值
					name: '', //渠道名称
				},
				channelForm: { //添加渠道分类
					name: '' //分类名称
				}, 
				formLabelWidth: '120px',
				Notice: '' ,//渠道名称提示信息
				channelListMsg: '', //选择渠道列表提示信息
				cNameNotice: '', //分类名称
			}
		},
		watch:{
			page(){
				this.query()
			},
			pageSize(){
				this.query()
			}
		},
		mounted() {
			this.query()
		},
		methods: {
			query(){ //查询
				
				this.value2 = this.value1;
				
				const obj = {
					startTime: this.value2[0],
					endTime: this.value2[1],
					page: this.page,
					pageSize: this.pageSize
				}
				
				dataCenter.getListQuery(obj)
					.then(res => {
						this.$emit("tableData", res);
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			reset(){ //重置
				this.value1 = [];
			},
			Export(){ //导出
			
				if(this.value2[0] && this.value2[1]){
					var params = `startTime=${this.value2[0]}&endTime=${this.value2[1]}`;
					window.open(`${CRM_URL}/crm/v1/channel/download?${params}`, '_parent')
				}else{
					window.open(`${CRM_URL}/crm/v1/channel/download`, '_parent')
				}
				
			},
			addChannelBtn(){ //点击添加渠道按钮
				this.dialogFormVisible = true;
				dataCenter.getChannelList()
					.then(res => {
						this.form.channelList = res.data;
					})
					.catch(err => {
						this.$message.error(err);
					})	
			},
			addChannel(){ //添加渠道确定按钮
				
				//文本框校验
				if(this.form.name.replace(/(^\s*)|(\s*$)/g, "").length == 0){this.Notice = '请输入渠道名称'};
				//选择框校验
				if(this.form.value == ""){this.channelListMsg = '请选择渠道分类'};

				if(this.Notice == "" && this.channelListMsg == ""){
					const obj = {
						name: this.form.name,
						categoryId: this.form.value
					}
					dataCenter.postAddChannel(obj)
						.then(res => {
							if(res.code == 1000000){
								this.$message.success('添加成功')
								this.dialogFormVisible = false;
								
								//添加渠道之后再次重新请求列表
								dataCenter.getListQuery({
									page: this.page,
									pageSize: this.pageSize
								})
									.then(res => {
										this.$emit("tableData", res);
									})
									.catch(err => {
										this.$message.error(err)
									})
									
							}else{
								this.Notice = res.message;
							}
						})
						.catch(err => {
							this.$message.error(err)
						})
				}
				
			},
			addChannelSort(){ //添加渠道分类确认按钮
				if(this.channelForm.name.replace(/(^\s*)|(\s*$)/g, "").length == 0){this.Notice = '请输入分类名称'};
				
				dataCenter.postAddChannelSort(this.channelForm)
					.then(res => {
						if(res.code == 1000000){
							this.$message.success('添加成功！')
							this.dialogChannelSort = false;
						}
					})
					.catch(err => {
						console.log(err);
					})
			},
			focusCname(){ //添加渠道分类文本框聚焦事件
				this.cNameNotice = '';
			},
			blurCname(){ //添加渠道分类文本框失焦事件
				if(this.channelForm.name.replace(/(^s*)|(s*$)/g, "").length == 0){
					this.cNameNotice = '请输入分类名称';
				}
			},
			focusEvents(){ //添加渠道文本框聚焦事件
				this.Notice = '';
			},
			blurEvents(){ //添加渠道文本框失焦事件
				if(this.form.name.replace(/(^s*)|(s*$)/g, "").length == 0){
					this.Notice = '请输入渠道名称';
				}
			},
			focusList(){
				this.channelListMsg = '';
			}
		}
	}
</script>

<style scoped="scoped">
	.float-right{
		float: right;
		display: inline-block;
	}
	.notice-class{
		display: block;
		font-size: 13px;
		color: #FF3638;
		height: 20px;
		line-height: 20px;
	}	
	
</style>
