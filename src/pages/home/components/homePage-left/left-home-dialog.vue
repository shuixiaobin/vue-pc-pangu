<template>
  <div class="left-home-dialog">
    <el-dialog
      title="通知详情"
      :visible.sync="dialogTableVisible"
      @open="handleOpen"
      @close="handleClose"
      :modal="selModal"
    >
      <el-table :data="noticeDetail.courseList" border style="width: 100%">
        <el-table-column prop="name" width="200" align="center" label="标题">
        </el-table-column>
        <template v-for="item in noticeDetail.dateTitle">
          <el-table-column :label="item" :key="item">
            <template slot-scope="scope">
              <span>
                {{ scope.row.list[0] }}
              </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="btn-notice">
        <el-button size="mini" @click="handleLast" v-if="prev_id">上一条</el-button>
        <el-button size="mini" @click="handleNext" v-if="next_id">下一条</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getNoticeDetail, setRead} from '@/api/auth'
export default {
  data() {
    return {
      dialogTableVisible: false,
      selModal: true,
      userName: '',
      id: '',
      prev_id: '',
      next_id: '',
      noticeDetail: {
        dateTitle: ["时间"],
        courseList: [
          {
            id: 1,
            name: "排课课程",
            list: [],
          },
          {
            id: 2,
            name: "授课内容",
            list: [],
          },
          {
            id: 3,
            name: "操作人",
            list: [],
          },
          {
            id: 4,
            name: "操作内容",
            list: [],
          },
          {
            id: 5,
            name: "操作时间",
            list: [],
          },
        ],
      },
    };
  },
  methods: {
    // 详情列表请求
    getNoticeDetail(params) {
      getNoticeDetail(params).then(res => {
        if(res.code === 10000) {
          let data = res.data
          let courseList = this.noticeDetail.courseList
          courseList[0].list.push(data.courseTitle)
          courseList[1].list.push(data.courseContent)
          courseList[2].list.push(data.userName)
          courseList[3].list.push(data.contentDesc)
          courseList[4].list.push(data.addTime)
          this.prev_id = data.prev_id
          this.next_id = data.next_id
        }
      })
    },

    clearCourseList() {
      let courseList = this.noticeDetail.courseList
      courseList[0].list.length = 0
      courseList[1].list.length = 0
      courseList[2].list.length = 0
      courseList[3].list.length = 0
      courseList[4].list.length = 0
    },

    openDetail(data) {
      this.userName = data.userName
      this.id = data.id
      let sel = data.sel
      
      this.dialogTableVisible = true;

      sel === '2' ? this.selModal = false : this.selModal = true

      let params = {
        userName: this.userName,
        id: this.id,
        isRead: data.isRead
      }
      // 请求详情数据
      this.getNoticeDetail(params)
    },

    // 上一条
    handleLast() {
      this.clearCourseList()
      let params = {
        userName: this.userName,
        id: this.prev_id
      }
      this.getNoticeDetail(params)
    },
    // 下一条
    handleNext() {
      this.clearCourseList()
      let params = {
        userName: this.userName,
        id: this.next_id
      }
      this.getNoticeDetail(params)
    },
    async handleOpen() {
      let params = {
        userName: this.userName,
        ids: this.id
      }
      const res = await setRead(params)
      if(res.code === 10000) {
        console.log('查看')
        this.$emit('getList')
      }
    },
    handleClose() {
      this.clearCourseList()
    }
  },
};
</script>

<style lang="less" scoped>
.btn-notice {
  margin-top: 20px;
  text-align: center;
}
</style>