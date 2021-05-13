<template>
  <div>
    <div>
      <h2 class="desc">选择的试卷</h2>
      <PaperTable :select="false" :tableData="step2Data"></PaperTable>
    </div>
    <div>
      <h2 class="desc">选择的课程</h2>
      <CourseTable :select="false"  :tableData="step1Data"/>
    </div>
    <div class="batch-align-center">
      <el-button @click="$emit('prev')">上一步</el-button>
      <template v-if="state === 0">
        <el-button @click="giveup">放弃批量删除</el-button>
        <el-button @click="complete" type="primary">完成批量删除</el-button>
      </template>
      <el-button v-else type="primary" @click="giveup">完成</el-button>
    </div>

    <el-dialog width="900px" title="试卷在某些课中不存在：" :visible.sync="dialogTableVisible">
      <el-table
        :data="noExistList"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="课程ID"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="title"
          align="center"
          width="300"
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="title"
          label="不存在试卷">
          <template slot-scope="scope">
            <ul>
              <li v-for="(item, i) in scope.row.paper" :key="i">{{item.id}}: {{item.name}}</li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 30px;">继续操作 以上课程将不会删除试卷，是否继续</div>
      <div slot="footer" @close="cancel">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm">继续删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import CourseTable from '../stageTest/components/stageCourseTabel'
import PaperTable from '../stageTest/components/stagePaperTable'
import batchOperation from '@/api/batchOperation'
import { makeMap } from '../util'

export default {
  props: ['cacheData'],
  computed: {
    step1Data () {
      return this.cacheData.step1.data
    },
    step2Data () {
      return this.cacheData.step2.data
    },
    courseMap () {
      return makeMap(this.step1Data, 'id')
    },
    stageTestMap () {
      return makeMap(this.step2Data, 'id')
    }
  },
  data () {
    return {
      dialogTableVisible: false,
      noExistList: [],
      state: 0
    }
  },
  created () {
    console.log(this.cacheData)
  },
  methods: {
    giveup () {
      this.$emit('giveup')
    },
    confirm () {
      const params = {
        classIds: this.step1Data.map(item => item.id).join(','),
        stageTestIds: this.step2Data.map(item => item.id).join(',')
      }
      batchOperation
        .stageTestBatchDel(params)
        .then(res => {
          this.state = 1
          this.$alert('操作成功')
          this.$emit('complete')
        })
        .then(() => this.cancel())
        .catch(e => this.$alert(e.message))
    },
    cancel () {
      this.dialogTableVisible = false
      this.noExistList = []
    },
    validTest () {
      const params = {
        classIds: this.step1Data.map(item => item.id).join(','),
        stageTestIds: this.step2Data.map(item => item.id).join(',')
      }


      batchOperation.verifyStageTestInSyllabus(params).then(res => {
        const noExistList = Array.isArray(res.notExistArr) ? {} : res.notExistArr
        const courseMap = this.courseMap
        const testMap = this.stageTestMap

        this.noExistList = Object.keys(noExistList).map(classId => {
          const testIds = noExistList[classId]
          if (!testIds.length) return false
          return {
            id: classId,
            title: courseMap[classId].title,
            paper: testIds.map(id => {
              return {
                id,
                name: testMap[id].name
              }
            })
          }
        }).filter(i => !!i)

        // 有存在的试卷就提示
        // 没有直接提交
        if (this.noExistList.length) {
          this.dialogTableVisible = true
        } else {
          this.confirm()
        }
      })
    },
    complete () {
      this.validTest()
    }
  },
  components: {
    CourseTable,
    PaperTable,
  }
}
</script>

<style scoped>
  .desc {
    font-size: 20px;
    margin: 30px 0 20px;
  }
  .batch-align-center {
    margin: 30px 0;
  }
</style>
