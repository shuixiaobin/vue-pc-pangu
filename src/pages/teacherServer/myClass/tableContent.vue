<template>
	<!-- 我的课时-表格-->
	
	<div>
		
		<h3>总课时数：<a @click="dialogTableVisible = true">{{count}}</a> 小时</h3>
		
		<div class="body">
			
			<ul class="title-ul clearfix">
				<li
					class="title-li"
					v-for="(item, index) in title"
					:key="index"
					:style="titleStyle(item)"
				>{{item}}</li>
			</ul>
			
			<ul class="body-ul clearfix">
				<li 
					class="body-li"
					v-for="(item, index) in arr"
					:key="index"
				>
					<p v-if="item.countDay">{{item.countDay}}</p>
					<div v-else>
						<span>{{item.date || "-"}}</span>
						<span>{{item.time || "-"}}</span>
						<span style="width: 30%;">{{item.liveName || "-"}}</span>
						<span>{{item.coefficient || "-"}}</span>
						<span>{{item.categoryName || "-"}}</span>
						<span style="width: 30%;border-right: 1px solid #DCDFE6;">{{item.courseName || "-"}}</span>
					</div>
				</li>
			</ul>
			
		</div>
		
		<!-- 弹出框 -->
		<el-dialog title="课时统计" :visible.sync="dialogTableVisible" width="850px">
			<h3 style="color: #000;">总课时数：
				<a style="color: #000;" @click="dialogTableVisible = true">{{count}}</a> 小时
			</h3>
		  <el-table :data="gridData">
		    <el-table-column property="type" label="类型" width="100"></el-table-column>
				
		    <el-table-column property="classSubtotal" label="课时小计(小时)" width="150">
					<template slot-scope="scope">
						<span style="color: rgba(255, 0, 0, .6);">{{scope.row.classSubtotal}}</span>
					</template>
				</el-table-column>
				
		    <el-table-column property="teaching" label="授课"></el-table-column>
		    <el-table-column property="practice" label="练习"></el-table-column>
		    <el-table-column property="assistant" label="助教"></el-table-column>
		    <el-table-column property="specialResolution" label="专题解析"></el-table-column>
		    <el-table-column property="simulation" label="模拟"></el-table-column>
		    <el-table-column property="researchArticles" label="教研文章"></el-table-column>
		    <el-table-column property="audioRecording" label="音频录制"></el-table-column>
		  </el-table>
		</el-dialog>
		
		
	</div>
	
</template>

<script>
	export default {
		props: ['content'],
		data() {
			return {
				count: '0', //总课时
				title: ['日期', '授课时间', '授课内容', '比例系数', '课程类型', '所属课程'],
				arr: [],
				gridData: [],
				dialogTableVisible: false,
				formLabelWidth: '150px',
			}
		},
		computed:{
			titleStyle(){
				return function (item){
					if(item == "授课内容" || item == "所属课程"){
						return "width: 30%;"
					}
				}
			}
		},
		methods: {
		},
		watch: {
			content(newVal){
				let arr = [];
				let obj = {};
				
				this.count = newVal.count;
				if(!newVal.body){
					this.$message.error('当前没有您的课时信息！')
				}else{
					this.arr = newVal.body;
				}
				
				obj.type = "直播课"; //类型
				obj.teaching = Number(newVal.countLiveSK); //直播授课
				obj.practice = Number(newVal.countLiveLX); //直播练习
				obj.assistant = Number(newVal.countLiveZJ); //直播助教
				obj.specialResolution = 0; //专题解析
				obj.simulation = 0; //模拟
				obj.researchArticles = 0; //直播教研文章
				obj.audioRecording = 0; //音频录制
				obj.classSubtotal = obj.teaching + obj.practice + obj.assistant + obj.specialResolution + obj.simulation + obj.researchArticles + obj.audioRecording; //课时小计(小时)
				arr.push(obj);
				obj = {};
				
				obj.type = "线下课"; //类型
				obj.teaching = Number(newVal.countXXKSK); //授课
				obj.practice = Number(newVal.countXXKLX); //练习
				obj.assistant = Number(newVal.countXXKZJ); //助教
				obj.specialResolution = 0; //专题解析
				obj.simulation = 0; //模拟
				obj.researchArticles = 0; //直播教研文章
				obj.audioRecording = 0; //音频录制
				obj.classSubtotal = obj.teaching + obj.practice + obj.assistant + obj.specialResolution + obj.simulation + obj.researchArticles + obj.audioRecording ; //课时小计(小时)
				arr.push(obj);
				obj = {};
				
				obj.type = "双师课"; //类型
				obj.teaching = Number(newVal.countSSKSK); //授课
				obj.practice = Number(newVal.countSSKLX); //练习
				obj.assistant = Number(newVal.countSSKZJ); //助教
				obj.specialResolution = 0; //专题解析
				obj.simulation = 0; //模拟
				obj.researchArticles = 0; //直播教研文章
				obj.audioRecording = 0; //音频录制
				obj.classSubtotal = obj.teaching + obj.practice + obj.assistant + obj.specialResolution + obj.simulation + obj.researchArticles + obj.audioRecording; //课时小计(小时)
				arr.push(obj);
				obj = {};
				
				obj.type = "录播课"; //类型
				obj.teaching = 0; //授课
				obj.practice = 0; //练习
				obj.assistant = 0; //助教
				obj.specialResolution = 0; //专题解析
				obj.simulation = 0; //模拟
				obj.researchArticles = 0; //直播教研文章
				obj.audioRecording = 0; //音频录制
				obj.classSubtotal = obj.teaching + obj.practice + obj.assistant + obj.specialResolution + obj.simulation + obj.researchArticles + obj.audioRecording; //课时小计(小时)
				arr.push(obj);
				obj = {};
				
				obj.type = "教研"; //类型
				obj.teaching = 0; //授课
				obj.practice = 0; //练习
				obj.assistant = 0; //助教
				obj.specialResolution = Number(newVal.countReally); //专题解析
				obj.simulation = Number(newVal.countSimulation); //模拟
				obj.researchArticles = Number(newVal.countArticle); //直播教研文章
				obj.audioRecording = Number(newVal.countAudio); //音频录制
				obj.classSubtotal = obj.teaching + obj.practice + obj.assistant + obj.specialResolution + obj.simulation + obj.researchArticles + obj.audioRecording; //课时小计(小时)
				arr.push(obj);
				obj = {};
				
				this.gridData = arr;
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	h3 {
		font-weight: 650;
		font-size: 18px;
		margin-bottom: 10px;
	}

	h3>a {
		color: rgb(16, 142, 233);
		font-size: 32px;
		vertical-align: sub;
		cursor: pointer;
	}
	.clearfix::after{
		clear: both;
		display: block;
		content: "";
	}
	.body{
		width: 100%;
		min-width: 800px;
		
		.title-ul{
			background-color: #F5F7FA;
			height: 40px;
			line-height: 40px;
			.title-li{
				float: left;
				width: 10%;
				padding-left: 10px;
			}
		}
		
		.body-ul{
			
			.body-li{
				height: 40px;
				line-height: 40px;
				font-size: 0;
				
				p{
					color: #727374;
					font-size: 14px;
					font-weight: 600;
					text-align: right;
					margin-top: 15px;
				}
				
				div{
					span{
						display: inline-block;
						font-size: 12px;
						font-weight: 400;
						color: #303133;
						border: 1px solid #DCDFE6;
						border-right: none;
						width: 10%;
						height: 40px;
						padding-left: 10px;
					}
				}
				
			}
		}
		
		
	}
	
</style>
