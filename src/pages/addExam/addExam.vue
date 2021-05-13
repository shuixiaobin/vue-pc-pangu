<template>
  <div>
    <div class="container-title">
      <h2>科目</h2>
    </div>
    <div class="container">
      <div class="container-searchLine">
        <el-select
          v-model="subject"
          style="width: 350px;"
          size="small"
        >
          <el-option
            v-for="item in subjectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          @click="search"
          size="small"
        >查询</el-button>
      </div>
      <el-tabs
        v-model="activeName"
        type="card"
      >
        <el-tab-pane
          label="选择模考"
          name="first"
        >
          <ActiveListTable
            :disabled="selectedData.length >= 2"
            :tableData="tableData"
            :subject="subject"
            @confirm="handleAddExam"
            @removeExam="removeExam"
          />
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
        </el-tab-pane>
        <el-tab-pane
          :label="`已选模考(${selectedData.length})`"
          name="second"
        >
          <SelectedList
            v-if="activeName === 'second'"
            ref="selectList"
            :selected="selectedData"
            @removeExam="removeExam"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  /**
   * 华图第三区委提醒您
   * 代码千万行, 注释第一行,
   * 编码不规范, 同事两行泪.
   */
  import { getSubjectList, getActiveList, addExam, getExam } from '@/api/addExam'
  import { page } from '@/common/mixins.js'
  import ActiveListTable from './components/activeListTable'
  import SelectedList from './components/selectedList'
  import { userId, userName } from '@/common/global.js'
  import Util from '@/common/util.js'
  const shenLunIds = [14]

  export default {
    mixins: [page],
    computed: {
      typeId() {
        return shenLunIds.indexOf(this.subject) > -1 ? 1 : 0
      },
      selectedMap() {
        return Util.makeMap(this.selectedData, 'paperId')
      }
    },
    data() {
      this.courseId = ''
      return {
        subjectList: [],
        subject: '',
        activeName: 'first',
        selectedData: [],
        tableData: []
      }
    },
    created() {
      const defaultCourse = process.env.NODE_ENV === 'development' ? 125906 : ''
      this.courseId = this.$route.query.courseId || defaultCourse
      if (!this.courseId) {
        this.$message.error('无课程信息')
        return
      }
      this.getCourseDetail().then(() => {
        this.getSubjectList()
      })
    },
    methods: {
      handleAddExam(data) {
        let d = this.selectedData
        if (data) {
          d = [
            ...this.selectedData,
            {
              paperId: data.id,
              areaId: data.areaId,
              subject: this.subject
            }
          ]
        }
        return addExam({
          courseId: this.courseId,
          mockExam: JSON.stringify(d),
          userId,
          userName
        })
          .then(res => {
            if (res.code !== 10000) {
              throw new Error(res.msg)
            }
            this.$message.success('操作成功')
            this.selectedData = d
            this.getList()
          })
          .catch(e => {
            this.$message.error(e.message)
            throw e
          })
      },
      getCourseDetail() {
        return getExam({ courseId: this.courseId })
          .then(res => {
            this.selectedData = res.data
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },
      getSubjectList() {
        getSubjectList()
          .then(res => {
            if (res.code !== 1000000) {
              throw res
            }
            const subjectList = []
            res.data.forEach(item => {
              item.children.forEach(subject => {
                subjectList.push({
                  label: `${item.name}_${subject.name}`,
                  value: subject.id
                })
              })
            })
            this.subjectList = subjectList
            this.subject = subjectList[0].value
            this.getList()
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },
      getList() {
        getActiveList(this.typeId, {
          page: this.page,
          pageSize: this.pageSize,
          subjectId: this.subject
        }).then(data => {
          const selectedMap = this.selectedMap
          this.tableData = data.list.map(item => {
            return {
              ...item,
              selected: item.id in selectedMap
            }
          })
          this.total = data.total
        })
      },
      search() {
        this.activeName = 'first'
        this.page = 1
        this.getList()
      },
      removeExam(data) {
        const cacheSelected = this.selectedData
        this.selectedData = this.selectedData.filter(
          item => item.paperId !== data.id
        )
        this.handleAddExam().catch(e => {
          this.selectedData = cacheSelected
        })
      }
    },
    components: {
      ActiveListTable,
      SelectedList
    }
  }
</script>

