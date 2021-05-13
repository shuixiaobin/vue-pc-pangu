<template>
  <div>
    <div class="container-title flexStart">
      <h2>课程卡管理</h2>
      <router-link
        to="/home/createCourseCard"
        class="link"
      >
        <el-button
          type="primary"
          size="mini"
        >创建课程卡</el-button>
      </router-link>
    </div>
    <div class="container">
      <div class="container-searchLine">
        课程卡名称：
        <el-input
          type="text"
          style="width: 250px"
          v-model="name"
        />
        创建时间：
        <el-date-picker
          v-model="time"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
        <el-button
          class="search"
          type="primary"
          @click="getList()"
        >搜索</el-button>
      </div>
      <el-table
        :data="list"
        border
      >
        <el-table-column
          prop="cardId"
          label="ID"
          width="90"
        >
        </el-table-column>
        <el-table-column
          prop="courseTitle"
          label="课程卡名称"
          width="350"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          prop="creator"
          label="创建人"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goCode(scope.row)"
            >激活码</el-button>
            <el-button
              type="text"
              @click="confirm(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="container-pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="size"
        :page-sizes="[10,30,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Course from '@/api/courseApi'
  export default {
    name: 'index',
    data() {
      return {
        name: '',
        time: null,
        list: [],
        currentPage: 1,
        total: 0,
        size: 30
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.getList(val)
      },
      handleSizeChange(val) {
        this.size = val
        this.getList()
      },
      async getList(page = 1) {
        this.currentPage = page
        let param = {
          courseTitle: this.name,
          startTime: this.time ? this.time[0] : '',
          endTime: this.time ? this.time[1] : '',
          page: this.currentPage,
          pageSize: this.size
        }
        let data = await Course.getCourseCard(param)
        if (data) {
          this.list = data.data
          this.currentPage = data.current_page
          this.total = data.total
        }
      },
      async deleteCard(val) {
        let param = {
          cardId: val.cardId,
          status: 2
        }
        let data = await Course.deleteCourseCard(param).catch(e => {
          alert('删除失败')
        })
        if (data) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        }
      },
      confirm(val) {
        this.$confirm('确定删除课程卡?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteCard(val)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      goCode(row) {
        this.$router.push(`/home/activationCode/${row.cardId}`)
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>

<style scoped lang="less">
  @import url(./common.less);
  .courseCardMan {
    padding: 20px;
  }
</style>
