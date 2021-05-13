<template>
  <el-card>
    <div slot="header" class="clearfix head">
      <span>作业批改</span>
			<el-button size="small" @click="handleFallback">返回</el-button>
    </div>
    <div style="margin: 20px 0;">
      <span style="display: inline-block;">作业标题: {{ $route.query.title }} </span>
      <span style="display: inline-block; margin-left: 30px;"> 作业日期: {{ $route.query.workDate }}</span>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="已提交学员" name="first">
        <UserList ref="userList1" :type="1" title="已提交学员列表" :id="id" :courseId="courseId" @correct="correct" />
      </el-tab-pane>
      <el-tab-pane label="未提交学员" name="second">
        <UserList :type="0" title="未提交学员列表" :id="id" :courseId="courseId" />
      </el-tab-pane>
    </el-tabs>
    <CourseWorkDetail ref="dialog" @submitSuccess="submitSuccess" />
  </el-card>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import UserList from './task-components/userList'
import CourseWorkDetail from './task-components/courseWorkDetail'
export default {
  data () {
    return {
      activeName: 'first',
      id: this.$route.query.id,
      courseId: this.$route.query.courseId,
    }
  },
  methods: {
    correct (d) {
      this.$refs.dialog.showData(d)
    },
    submitSuccess () {
      this.$refs.userList1.getList()
    },
		handleFallback(){
			this.$router.push({
				name: 'OMODetail',
				query: {
					...this.$route.query.query
				}
			})
		}
  },
  components: {
    UserList,
    CourseWorkDetail,
  }
}
</script>

<style scoped lang="less">
	.head{
		button{
			float: right;
		}
	}
</style>
