<template>
  <div>
    <div class="container-title">
      <h2>创建课程卡</h2>
    </div>
    <div class="container">
      <span class="star">*</span>课程卡名称：
      <el-input
        type="text"
        v-model="name"
        style="width: 350px;"
      ></el-input>
      <div class="send">
        <el-button
          type="primary"
          @click="show"
        >添加赠送课程</el-button>
        <el-table
          :data="list"
          border
          style="margin: 20px 0;"
        >
          <el-table-column
            prop="id"
            label="ID"
            width="90"
          >
          </el-table-column>
          <el-table-column
            prop="title"
            label="课程名称"
            width="350"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
          >
          </el-table-column>
          <el-table-column
            prop="isPhysical"
            label="实物"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="deleteCourse(scope)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn_box">
          <el-button @click="goBack">返回</el-button>
          <el-button
            type="primary"
            @click="create"
          >创建</el-button>
        </div>
      </div>
    </div>
    <add-course
      ref="add"
      @addCourse="addCourse"
    ></add-course>
  </div>
</template>

<script>
  import AddCourse from './components/addCourse'
  import Course from '@/api/courseApi.js'
  export default {
    name: 'createCourseCard',
    components: {
      AddCourse
    },
    data() {
      return {
        name: '',
        time: '',
        list: []
      }
    },
    methods: {
      show() {
        this.$refs.add.show()
      },
      //合并添加的课程
      addCourse(arr) {
        arr.forEach(item => {
          let flag = this.list.some(i => {
            return i.id === item.id
          })
          if (flag) return false
          this.list.push(item)
        })
      },
      // 删除课程
      deleteCourse(val) {
        let i = val.$index
        this.$confirm('确定删除课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.list.splice(i, 1)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      goBack() {
        this.$router.go(-1)
      },
      async create() {
        if (this.name.trim() === '') {
          this.$message.error('请填写课程卡名称')
          return
        }
        if (this.list.length === 0) {
          this.$message.error('请添加赠送课程')
          return
        }
        const arr = this.list.map(item => item.id)
        let param = {
          courseTitle: this.name,
          givingCourses: arr.join(',')
        }
        let data = await Course.createCourseCard(param)
        if (data) {
          this.$message.success('创建成功')
          // Object.assign(this.$data, this.$options.data())
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import url(./common);
  .container {
    padding: 30px 80px;
    .star {
      color: crimson;
    }
    .send {
      margin-top: 30px;
      .btn_box {
        text-align: center;
      }
    }
  }
</style>
