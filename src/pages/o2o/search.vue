<template>
	<div class="container-searchLine">
		<el-form :model="form" label-width="80px" inline>
		  <el-form-item label="考试类型">
		    <el-select v-model="form.categoryId" style="width:150px">
		      <el-option :label="item.CategoryName" :value="item.CategoryId" v-for="(item,index) in examList" :key="index"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="分校" >
		    <el-select v-model="form.branchDepartmentId" style="width:150px">
		      <el-option :label="item.name" :value="item.id" v-for="(item,index) in schoolList" :key="index"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="状态">
		    <el-select v-model="form.status" style="width:150px">
		      <el-option :label="item.key" :value="item.value" v-for="(item,index) in statuList" :key="index"></el-option>
		    </el-select>
		  </el-form-item>
			<el-form-item label="">
		    <el-select v-model="form.type" style="width:120px">
		      <el-option :label="item.key" :value="item.value" v-for="(item,index) in selectList" :key="index"></el-option>
		    </el-select>
				<el-input placeholder="请输入活动名称" @keyup.enter.native="formSearch"  style="width:200px" v-model="form.value">		</el-input>
		  </el-form-item>
			<el-form-item label="">
        <el-button type="primary" icon="el-icon-search" @click="formSearch">搜索</el-button>
        <el-button @click="reset">重置</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>
<script>

import api from '@/api/courseApi.js'
export default{
	data(){
		return{
			examList:[],
			schoolList:[],
			statuList:[
				{
					key:"未上线",
					value:0
				},
				{
					key:"已上线",
					value:1
				},
				{
					key:"已下线",
					value:2
				}
			],
			selectList:[
				{
					key:"课程id",
					value:"id"
				},
				{
					key:"课程标题",
					value:"title"
				},
				{
					key:"线下课程名称",
					value:"ss_title"
				},
				{
					key:"线上课程名称",
					value:"zx_title"
				}
			],
			form:{
				categoryId:'',
				branchDepartmentId:'',
				status:'',
				type:'title',
				value:''
			}
		}
	},
	components:{
	},
	computed: {
	},
	methods:{
		async getExam(){
			var examData = await api.getExamList();
			this.examList =examData.data;
		},
		async getSchool(){
			var schoolList = await api.getSchool()
			this.schoolList =schoolList.data;
		},
		//搜索
		formSearch(){
			this.$emit("search", this.form);
		},
    reset(){
      Object.assign(this.$data.form, this.$options.data().form)
    }
	},
	created(){
		this.getExam();
		this.getSchool();
		this.formSearch();
	}
}
</script>
