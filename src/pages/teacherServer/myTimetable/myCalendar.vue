<template>
	<!-- 我的课表-课表日历 -->
	
	<div>
		
		<div class="header">
			
			<div class="block" style="display: inline-block;">
				<el-date-picker 
					style=" width: 100px;"
					size="small"
					v-model="yearValue"
					type="year"
				>
				</el-date-picker>
			</div>
			
			<el-select v-model="monthValue" class="choose" size="small">
				<el-option
					v-for="item in monthOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			
			<el-button class="button-btn" type="primary" size="small" @click="handleClick">查询</el-button>
			
		</div>
		
		<div class="calendar">
			
			<ul class="title-ul clearfix">
				<li
					v-for="item in weekTitle"
					:key="item"
					class="title-li"
					:class="{'gray': item == '星期日' || item == '星期六'}"
				>{{item}}</li>
			</ul>
			<ul class="body-ul clearfix" v-if="dateObject">
				<li
					v-for="item in dateObject"
					:key="item.index"
					class="body-li"
					:class="{'not-month': item.type == 'prevMonth' || item.type == 'nextMonth', 
					'out-of-date': overdue(item)}"
					:style="getCalendarDate(item, 'bg')"
				>
					
					<div
						class="wrap"
					>
						<p class="first-row">
							<span class="live" v-if="item.categoryName">{{item.categoryName}}</span>
							
							<span class="notice" v-if="item.arr.length > 0">{{item.arr.length}}</span>
							
							<span class="index" :style="getCalendarDate(item, 'font')">{{item.data}}</span>
						</p>
						
						<div v-if="item.arr.length >= 1">
							<span class="date-time">{{courseTime(item.arr)}}</span>
							<p class="course-name">{{showCourse(item.arr)}}</p>
						</div>
						
					</div>
					
					<div 
						class="popover" 
						:style="borderStyle(item.ind)"
						v-if="promptInformation(item)"
					>
						<div class="border">
							<p>
								<span class="span1">
									{{monthValues + 1}}月{{item.data}}日
								</span>
								<span class="span2">课程安排</span>
							</p>
							
							<el-table :data="item.arr" border style="width: 95%; margin: 0 auto;">
								
								<el-table-column prop="categoryName" label="类型" width="80px"></el-table-column>
								<el-table-column label="时间" width="100px">
									<template slot-scope="scope">
										<span>{{scope.row.timeBegin}}-{{scope.row.timeEnd}}</span>
									</template>
								</el-table-column>
								<el-table-column prop="courseLiveName" label="授课内容"></el-table-column>
								<el-table-column prop="courseName" label="所属课程"></el-table-column>
								<el-table-column label="考试类型及科目">
									<template slot-scope="scope">
										<span>{{scope.row.examType}}-{{scope.row.subject}}</span>
									</template>
								</el-table-column>
								<el-table-column prop="teacherNames" label="讲师" width="80px"></el-table-column>
								
							</el-table>
						</div>
					</div>
					
				</li>
				
			</ul>
			
		</div>
		
	</div>
	
</template>

<script>
	import * as teacher from '@/api/teacher.js'
	import { mapState } from 'vuex'
	export default{
		data(){
			return {
				weekTitle: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ], //表头
				promptTitle: ['类型', '时间', '授课内容', '所属课程', '考试类型及科目', '讲师'], //提示标题
				form: {
					title: '直播', //标题
					news: '4', //消息条数
				},
				id: null, // 助教id
				pid: null, //教师id 1868
				dateObject: [], //日期对象
				todayData: 1, //今天的日期
				todayMonth: null, //今天的月份
				todayYear: null, //今天的年份
				yearValue: new Date(), //日历上的年份对象
				yearValues: new Date().getFullYear(), //对应日历的年份
				monthValues: new Date().getMonth(), //点击查询之后的日期
				monthValue: new Date().getMonth(), //查询的月份，刚开始默认为当月
				realDate: null, //真实的日期
				courseInfo: [], //课程信息
				monthOptions: [
					{value: 11,label: 12},
					{value: 10,label: 11},
					{value: 9,label: 10},
					{value: 8,label: 9},
					{value: 7,label: 8},
					{value: 6,label: 7},
					{value: 5,label: 6},
					{value: 4,label: 5},
					{value: 3,label: 4},
					{value: 2,label: 3},
					{value: 1,label: 2},
					{value: 0,label: 1},
				],
			}
		},
		mounted() {
			const d = new Date();
			this.todayMonth = d.getMonth(); //得到今天的月份
			this.todayYear = d.getFullYear(); //得到今天的年份
			
			this.getMonthData(this.yearValues, this.monthValue);//得到某一个月份的日期
			this.getDate(); //得到今天的日期
			
			const userName = this.$store.state.username;
			teacher.getMyClassTeacherId({userName: userName}) //得到 pid
				.then(res => {
					if(res.code <= 0){
						// this.$message.error(res.msg)
					}else if(res.code > 0){
						this.pid = res.data.teacherId;
					}
					if(this.$route.params.id !== 5){ // 判断如果不是从 首页-云端课堂 跳转过来的才自动调用一次查询
						this.handleClick()
					}
				})
				.catch(err => {
					this.$message.error(err)
				})
			
		},
		computed:{
			...mapState(['username', 'userTypeName']),
			overdue(){ //判断目前查询的日期 是否在当前日期之前
				return function (item){
					if(this.todayYear > this.yearValues){ //如果今天的年份大于查询的年份, 返回 true 颜色为灰色
						return true;
					}
					if(this.todayMonth > this.monthValues){ //如果今天的月份大于查询的年份
						return true;
					}
					if(item.type == 'prevMonth' || item.type == "nextMonth"){ //如果当前月的日期是上个月末,或下个月初
						return true;
					}
					if(item.data < this.todayData){ //在今天之前的日期
						return true;
					}
				}
			},
			promptInformation(){ //判断有没有要提示的弹出框
				return function (item){
					if(item.arr.length > 0){
						return true
					}
				}
			},
			borderStyle(){ //hover 弹出框位置
				return function (ind){
					if(ind == 0 || ind == 1){
						return "left: 0px"
					}else if(ind == 5 || ind == 6){
						return "right: 0px;"
					}else{
						return "left: 50%;transform: translate(-50%);"
					}
				}
			},
			getCalendarDate(){
				return function (item, ele){
					if(item.type == "current" && item.data == this.todayData &&
					this.todayMonth == this.monthValues && this.todayYear == this.yearValues){
						if(ele == 'bg'){
							return "background-color: #FFEBC3;"
						}else if(ele == 'font'){
							return 'color: #FAAD14';
						}
						
					}
				}
			}
		}, 
		methods:{
			handleClick(){ //查询按钮
					this.monthValues = this.monthValue; //得到当前查询的日期
					this.yearValues = this.yearValue.getFullYear(); //当前查询的年份
					this.realDate = this.monthValues + 1;
					this.getMonthData(this.yearValues, this.monthValues) //调用方法，得到日期对象
					
					const obj = {};
					
					let dateBegin = this.yearValues + "-" + (this.monthValues + 1) + "-" + "01";
					let d = new Date(this.yearValues, this.monthValues) //得到当前日期对象
					d.setMonth(d.getMonth() + 1) //将日期对象设置为下月 1 日
					d.setDate(0) //将日期对象设置为当月最后一日
					let day = d.getDate() //得到当前是多少号
					let dateEnd = this.yearValues + "-" + (this.monthValues + 1) + "-" + day;
					obj.dateBegin = dateBegin;
					obj.dateEnd = dateEnd;
					
					if(this.pid){
						obj.pid = this.pid;
						obj.id = "";
						this.$message.success('当前的身份为 教师')
						this.sendRequest(obj)
					}else{
						teacher.getFindByUsername({userName: this.$store.state.username}) // 得到助教id
							.then(res => {
								if(res.data.id){
									this.id = res.data.id; // 助教id	
									obj.id = this.id;
									obj.pid = "";
									this.$message.success('当前的身份为 助教')
									this.sendRequest(obj);
								}else{
									this.$message.error('教师|助教不存在，请联系管理员操作！')
								}
							})
							.catch(err => {
								this.$message.error(err)
							})
					}
					
			},
			sendRequest(obj){ // 发送请求
				teacher.getMySchedule(obj)
					.then(res => {
						let arr = [];
						if(res.data){
							res.data.forEach(item => {
								if(item){
									arr.push(...item)
								}
							})
							if(arr.length == 0){
								this.$message.info('本月没有您的课表信息！')
							}
						}else{
							this.$message.error(res.message)
						}
						this.courseInfo = arr; //保存展开之后的值
						arr = [];
						this.dateObject.forEach((item) => {
							if(item.type == "current"){ //如果是当前月
								let str = "";
								if(item.data.length == 1){ //索引只有一位长度
									str = "0" + item.data;
								}else{
									str = item.data;  
								}
								if(this.courseInfo){
									for (let i = 0; i < this.courseInfo.length; i++) {
										if(this.courseInfo[i].date.slice(-2) == str){
											this.$set(item, 'categoryName', this.courseInfo[i].categoryName); //课程类型
											this.$set(item, 'timeBegin', this.courseInfo[i].timeBegin); //开始时间
											this.$set(item, 'timeEnd', this.courseInfo[i].timeEnd); //结束时间
											this.$set(item, 'courseName', this.courseInfo[i].courseName); //课程名称
											this.$set(item, 'date', this.courseInfo[i].date); //日期
											item.arr.push(this.courseInfo[i])
										}
									}
								}
							}
						})
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			showCourse(arr){ // 课程列表当前显示课程
				const d = new Date().getHours();
				for (let i = 0; i < arr.length; i++) {
					if(Number(arr[i].timeEnd.slice(0, 2)) >= Number(d)){
						return arr[i].courseName;
					}
				}
				return arr[0].courseName;
			},
			courseTime(arr){ // 当前展示的课程时间
				const d = new Date().getHours();
				for (let i = 0; i < arr.length; i++) {
					if(Number(arr[i].timeEnd.slice(0, 2)) >= Number(d)){
						return arr[i].timeBegin + "-" + arr[i].timeEnd;
					}
				}
				return arr[0].timeBegin + "-" + arr[0].timeEnd;
			},
			getDate(){ //得到今天的日期
				const d = new Date();
				this.todayData = d.getDate();
			},
			getMonthData(year, month){ //得到某一个月份的日期
				const d = new Date(year, month, 1) //得到当前的日期对象
				const firstDay = d.getDay() //得到当前月份的 1 号是从 周几开始的
				const res = [];
				
				const lastMonth = new Date(d.getTime()) //得到当前月1号的时间戳
				lastMonth.setDate(0) //得到上个月最后一天的时间戳
				const lastMonthDays = lastMonth.getDate() //得到上一个月一共有多少天
				
				d.setMonth(d.getMonth() + 1)
				d.setDate(0) //得到当前月的最后一天
				
				const days = d.getDate() //当前月的天数
				
				for (var i = 0; i < 6; i++) {
					const arr = [];
					let ind = 0;
					for (var j = 0; j < 7; j++) {
						const cur = i * 7 + j; //得到数组的连续索引
						if (cur < firstDay) {
							arr.push({
								type: 'prevMonth',
								index: cur,
								ind: ind,
								arr: [],
								data: lastMonthDays - firstDay + cur + 1,
							})
						} else if (cur > days + firstDay - 1) {
							arr.push({
								type: 'nextMonth',
								index: cur,
								ind: ind,
								arr: [],
								data: cur - (days + firstDay - 1)
							})
						} else {
							arr.push({
								type: 'current',
								index: cur,
								ind: ind,
								arr: [],
								data: cur - firstDay + 1
							})
						}
						ind += 1;
						if(j == 6){
							ind = 0;
						}
					}
					res.push(...arr)
				}
				this.dateObject = res;
			},
			
		}
	}
</script>

<style scoped="scoped" lang="less">
	.header{
		margin-bottom: 16px;
		.choose{
			height: 32px;
			width: 90px;
		}
		
		.button-btn{
			margin-left: 16px;
		}
	}
	
	.calendar{
		width: 100%;
		border: 1px solid #DCDFE6;
		text-align: center;
		margin-bottom: 200px;
		
		.title-ul{
			width: 100%;
			.title-li{
				float: left;
				width: 14.284%;
				height: 40px;
				line-height: 40px;
				background: #F5F7FA;
			}
			.gray{
				background: #EBEEF5;
			}
		}
		
		.body-ul{
			width: 100%;
			color: rgba(144, 147, 153, 1);
			.body-li{
				position: relative;
				float: left;
				width: 14.284%;
				height: 90px;
				background: #FFFFFF;
				border: 1px solid #DCDFE6;
				border-left: 0;
				border-bottom: 0;
				cursor: pointer;
				color: #303133;
				
				&.not-month{
					background-color: #F5F7FA !important;
				}
				&.out-of-date{
					color: rgba(144, 147, 153, .5);
				}
				&.out-of-date .wrap .date-time, &.out-of-date .wrap .course-name{
					color: rgba(144, 147, 153, .5);
				}
				&:hover{
					border: 1px solid #1856FF;
					p{
						color: #303133;
					}
					.wrap .date-time, .wrap .course-name{
						color: rgba(144, 147, 153, 1) ;
					}
					.popover{
						display: block;
					}
				}
				
				div.wrap{
					padding: 8px;
					height: 90px;
					
					p.first-row{
						height: 14px;
						line-height: 14px;
						text-align: left;
						
						span.live{
							display: inline;
							font-weight: bold;
							font-size: 12px;
						}
						
						span.notice{
							display: inline-block;
							background: #FAAD14;
							border-radius: 4px 4px 4px 0px;
							font-size: 10px;
							font-weight: 500;
							color: #FFFFFF;
							width: 20px;
							height: 14px;
							line-height: 14px;
							text-align: center;
						}
						
						span.index{
							font-size: 14px;
							font-weight: 600;
							line-height: 14px;
							float: right;
						}
						
					}
					
					span.date-time{
						display: block;
						height: 17px;
						line-height: 17px;
						font-size: 12px;
						font-weight: 500;
						color: rgba(144, 147, 153, 1);
						text-align: left;
						margin-top: 9px;
					}
					
					p.course-name{
						font-size: 12px;
						font-weight: 500;
						color: rgba(144, 147, 153, 1);
						text-align: left;
						overflow: hidden;
						max-width: 155px;
						max-height: 32px;
					}
				}
				
			}
			
		}
		
	}
	
	.popover{
		width: 660px;
		background-color: #fff;
		margin: 0 auto;
		display: none;
		position: absolute;
		z-index: 1;
		.border{
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
			border-radius: 4px;
			padding-bottom: 15px;
			text-align: left;
			
			>p{
				height: 43px;
				line-height: 43px;
				font-size: 18px;
				font-weight: 500;
				padding-left: 15px;
				.span1{
					color: #303133;
				}
				
				.span2{
					color: #C0C4CC;
				}
			}
			
		}
	}
	
	
	.clearfix::after{
		display: block;
		content: "";
		clear: both;
	}


</style>
