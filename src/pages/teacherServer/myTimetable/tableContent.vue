<template>
	<!-- 我的课表-直播列表-表格-->
	
	<div>
		<el-table :data="tableDate" style="width: 100%" border>
			<el-table-column prop="startDate" label="授课日期" width="110"></el-table-column>
			<el-table-column prop="hourSecond" label="授课时间" width="110"></el-table-column>
			<el-table-column prop="cateType" label="课程类型" width="80"></el-table-column>
			<el-table-column prop="cateName" label="考试科目" width="100"></el-table-column>
			<el-table-column prop="classTitle" label="课程名称" width=""></el-table-column>
			<el-table-column prop="title" label="授课内容" width=""></el-table-column>
			<el-table-column 
				prop="status" 
				label="状态" 
				width="100"
			>
				<template slot-scope="scope">
					<el-popover
					  placement="left"
					  width="260"
					  trigger="click"
						v-if="scope.row.status == '进入教室'"
						:ref="`popover-${scope.$index}`"
					>
					  <el-form ref="form" :model="form">
							<el-form-item label="身份: " style="margin-bottom: 10px;">
								<el-radio-group v-model="form.identity">
									<el-radio label="1">教师</el-radio>
									<el-radio label="2">助教</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="昵称: " style="margin-bottom: 10px;">
								<el-input 
									v-model="form.nickname" 
									style="width: 188px;height: 32px;" 
									placeholder="请输入显示的昵称"
								></el-input>
							</el-form-item>
							<el-form-item style="text-align: right;margin-bottom: 0;">
								<el-button size="small" @click="handleCancel(scope)" >取消</el-button>
								<el-button size="small" type="primary" @click="determine(scope, scope.row.rid)">确定</el-button>
							</el-form-item>
					  </el-form>
						
					  <span 
							:class="{'scoreClass': scope.row.status == '进入教室'}" 
							slot="reference"
							v-auth="'MCL_ROOM'"
						>	
							<i class="iconzhiboguanli iconfont" style="margin-right: 2px;"></i>
							{{scope.row.status}}
						</span>
					</el-popover>
					<span v-else>{{scope.row.status}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="TeacherName" label="教师" width="80"></el-table-column>
			<el-table-column 
				prop="assistantName" 
				label="助教" 
				width="80" 
				show-overflow-tooltip
			></el-table-column>
			<el-table-column prop="score" label="评分" width="80">
				<template slot-scope="scope">
					<span class="scoreClass" @click="handleClick(scope.row)">{{scope.row.score}}</span>
				</template>
			</el-table-column>
		</el-table>
		
	</div>

	

</template>


<script>
	import * as teacher from '@/api/teacher.js'
	export default {
		props:{
			tableDate: Array
		},
		data() {
			return {
				form: {
					identity: '1', //身份
					nickname: '', //昵称
				},
			}
		},
		methods:{
			handleClick(row){ //点击分数 跳转到评分详情页
				this.$router.push(
					{
						path: '/teacherServer/myTimetable/liveList',
						query: {rid: row.rid, courseTitle: row.classTitle, content: row.title},
					}
				)
			},
			determine(scope, rid){//确定
				const obj = {
					rid: rid,
					userRole: this.form.identity, //用户角色
				}
				if(this.form.nickname){
					obj.userNick = this.form.nickname; // 昵称
					teacher.getLivePlayUrl(obj) //进入直播间
						.then(res => {
							if(res.data.url.length == 0){
								this.$message.error('当前没有直播间地址，请联系管理员进行操作')
							}else{
								alert('云端课堂下载地址：http://www.baijiayun.com/classroomdown/，如已安装请忽略。')
								window.open(`baijiacloud://urlpath=${res.data.url}&token=token&ts=ts`, "_parent")
							}
						})
						.catch(err => {
							this.$message.error(err)
						})
					
					scope._self.$refs[`popover-${scope.$index}`].doClose()
				}else{
					this.$message.error('请输入昵称！')
				}
				
			},
			handleCancel(scope){ //取消
				scope._self.$refs[`popover-${scope.$index}`].doClose()
			},
		}
	}
</script>

<style scoped="scoped">
	.scoreClass{
		color: #1856FF;
		cursor: pointer;
	}
	.el-popover-popup{
		
	}
</style>
