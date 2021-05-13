<template>
  <div class="teacher-info">
    <MenuTitle>
      <template v-slot:btn>
        <div>
          <!-- 总部新增 -->
          <el-button
            size="small"
            v-auth="'TI_HEAD_ADD'"
            @click="goTeatcherAdd(1)"
          >新增</el-button>
          <!-- 分校新增 -->
          <el-button
            size="small"
            v-auth="'TI_BRANCH_ADD'"
            @click="goTeatcherAdd(2)"
          >新增</el-button>
        </div>
      </template>
    </MenuTitle>
    <div class="container">
      <TeacherListSearch @search="search" />
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px"
        sortable="custom"
        @sort-change="handleSortChange"
      >
        <el-table-column
          prop="TeacherId"
          label="教师ID"
        >
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <router-link :to='`/teacher/teacherAdd?id=${scope.row.TeacherId}`'>
              <el-button type="text">{{scope.row.TeacherName}}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="NetClassCategoryIdName"
          label="专长考试"
        >
        </el-table-column>
        <el-table-column
          prop="SubjectTypeName"
          label="专长科目"
        >
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-button
                  type="text"
                  size="mini"
                >{{scope.row.statusName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleToggleLine(scope.row, 1)"
                    v-if="scope.row.statusName==='待审核'||scope.row.statusName==='下线'"
                    v-auth="'TI_HEAD_ONLINE'"
                  >正常</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleToggleLine(scope.row, 1)"
                    v-if="scope.row.statusName==='待审核'||scope.row.statusName==='下线'"
                    v-auth="'TI_BRANCH_ONLINE'"
                  >正常</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="text"
                    v-if="scope.row.statusName==='待审核'||scope.row.statusName==='正常'"
                    @click="handleToggleLine(scope.row, 3)"
                    v-auth="'TI_BRANCH_OFFLINE'"
                  >下线</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="text"
                    v-if="scope.row.statusName==='待审核'||scope.row.statusName==='正常'"
                    @click="handleToggleLine(scope.row, 3)"
                    v-auth="'TI_HEAD_OFFLINE'"
                  >下线</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateDate"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          label="课程评分"
          sortable
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="openCourseDrawer(scope.row)"
            >{{scope.row.CourseScore}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row,1)"
              v-auth="'TI_HEAD_EDIT'"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row,2)"
              v-auth="'TI_BRANCH_EDIT'"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              v-auth="'TI_DETELE'"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="container-pagination"
      >
      </el-pagination>
    </div>
    <TeacherCourseEvaluationTable
      v-if="searchParams"
      :score-drawer-flag.sync="scoreDrawerFlag"
      :teacherId="teacherId"
      :date="[searchParams.startTime, searchParams.endTime]"
      source="teacherAdd"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getTeacherList, delTeacherInfo, updateTeacherInfo } from '@/api/teacher'
  import { page } from '@/common/mixins'
  import TeacherCourseEvaluationTable from '../evaluation/components/teacherCourseEvaluationTable'
  import TeacherListSearch from './components/TeacherListSearch'
  export default {
    mixins: [page],
    components: {
      TeacherListSearch,
      TeacherCourseEvaluationTable,
    },

    data() {
      return {
        tableData: [],
        scoreDrawerFlag: false,
        teacherId: null,
        searchParams: null,
        sortByScore: ''
      }
    },
    computed: {
      ...mapState(['userid', 'username', 'userid']),
    },

    methods: {
      openCourseDrawer({ TeacherId }) {
        this.teacherId = TeacherId
        this.scoreDrawerFlag = true
      },
      handleSortChange({ order }) {
        this.page = 1
        if (order === "ascending") {
          this.sortByScore = 'asc'
        } else if(order === "descending") {
          this.sortByScore = 'desc'
        }     
        this.getList()  
      },
      async handleToggleLine(row, lineType) {
        try {
          const params = {
            teacherId: row.TeacherId,
            status: lineType,
            updateUserId: this.userid,
            updateUserName: this.username,
          }
          const res = await updateTeacherInfo(params)
          if (res.code === 10000) {
            this.$message.success('操作成功！')
            this.getList()
          }
        } catch (err) {
          console.log(err)
        }
      },
      goTeatcherAdd(roleType) {
        this.$router.push({ name: 'teacherAdd', query: { roleType } })
      },
      search(params) {
        this.searchParams = Object.freeze(params)
        this.page = 1
        this.getList()
      },
      async getList() {
        try {
          const params = { ...this.searchParams, page: this.page, pageSize: this.pageSize, sortByScore: this.sortByScore }
          const res = await getTeacherList(params)
          this.tableData = res.data.data
          this.total = res.data.total
        } catch (err) {
          console.log(err)
        }
      },
      handleEdit({ TeacherId }, roleType) {
        this.$router.push({ name: 'teacherAdd', query: { id: TeacherId, roleType } })
      },
      handleDelete({ TeacherId }) {
        try {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(async () => {
              const params = {
                teacherId: TeacherId,
                updateUserId: this.userid,
                updateUserName: this.username,
              }
              const res = await delTeacherInfo(params)
              if (res.code === 10000) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
                this.getList()
              } else {
                this.$message.warning('删除失败！')
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除',
              })
            })
        } catch (err) {
          console.log(err)
        }
      },
    },
  }
</script>
<style lang='less' scoped>
  .teacher-info {
    background: #fff;
  }
</style>