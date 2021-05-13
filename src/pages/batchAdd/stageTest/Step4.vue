<template>
  <div>
    <div>
      <h2 class="desc">选择的试卷:</h2>
      <PaperTable :select="false" :tableData="step3Data">
        <el-table-column
          prop="sort"
          align="center"
          width="100"
          label="排序">
        </el-table-column>
      </PaperTable>
    </div>
    <div>
      <h2 class="desc">选择的课程:</h2>
      <CourseTable :select="false" :tableData="step1Data"/>
    </div>
    <div>
      <h2 class="desc">试卷位置:</h2>
      <PositionData v-if="step2Data.type!==2" :disabled="true" :formData="step2Data" :type="step2Data.type"/>
      <div v-else>放在试卷末尾</div>
    </div>
    <div class="batch-align-center">
      <el-button @click="$emit('prev')">上一步</el-button>
      <template v-if="state === 0">
        <el-button @click="giveup">放弃批量操作</el-button>
        <el-button type="primary" @click="complete">完成批量操作</el-button>
      </template>
      <el-button v-else type="primary" @click="giveup">完成</el-button>
    </div>

    <el-dialog width="900px" title="试卷在某些课中已存在：" :visible.sync="dialogTableVisible">
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
          label="已存在试卷">
          <template slot-scope="scope">
            <ul>
              <li v-for="(item, i) in scope.row.paper" :key="i">{{item.id}}: {{item.name}}</li>
            </ul>
          </template>
        </el-table-column>

      </el-table>
      <div style="margin-top: 30px;">继续操作 以上课程将不会添加试卷，是否继续</div>
      <div slot="footer" @close="cancel">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm">继续添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import CourseTable from './components/stageCourseTabel'
import PaperTable from './components/stagePaperTable'
import PositionData from './components/CoursePositionForm'
import batchOperation from '@/api/batchOperation'
import { makeMap } from '../util'
export default {
  props: ['cacheData'],
  computed: {
    step1Data () {
      return this.cacheData.step1.data
    },
    step3Data () {
      return this.cacheData.step3.data
    },
    step2Data () {
      return this.cacheData.step2.data
    },
    courseMap () {
      return makeMap(this.step1Data, 'id')
    },
    stageTestMap () {
      return makeMap(this.step3Data, 'id')
    }
  },
  data () {
    return {
      noExistList: [],
      dialogTableVisible: false,
      state: 0
    }
  },
  methods: {
    giveup () {
      this.$emit('giveup')
    },
    cancel () {
      // 关闭dialog
      this.dialogTableVisible = false
      this.noExistList = []
    },
    confirm () {
      // 确定添加
      const d = this.cacheData
      const params = {}

      const step2 = this.step2Data
      params.type = step2.type
      switch (step2.type) {
        case 1:
          params.beforeOrAfter = step2.beforeOrAfter
          params.coursewareType = step2.coursewareType
          params.coursewareId = step2.coursewareId
          params.coursewareName = step2.coursewareName
          break
        case 3:
          params.positionClassId = step2.positionClassId
          params.positionClassName = step2.positionClassName
          break
      }
      params.notExistArr = this.notExistArr
      // 课程id
      params.netClassIds = this.step1Data.map(item => item.id).join(',')
      // 试卷id
      params.stageTestData = JSON.stringify({ list: this.step3Data.map(item => item.initialData)})

      batchOperation
        .insertStageTestBatch(params)
        .then(res => this.handleSuccess())
        .then(() => this.cancel())
        .catch(e => this.$alert(e.message))
    },
    validTest () {
      const params = {
        classIds: this.step1Data.map(item => item.id).join(','),
        stageTestIds: this.step3Data.map(item => item.id).join(',')
      }
      batchOperation.verifyStageTestInSyllabus(params).then(res => {
        const noExistList = Array.isArray(res.existArr) ? {} : res.existArr
        const courseMap = this.courseMap
        const testMap = this.stageTestMap

        const existArr = Array.isArray(res.notExistArr) ? {} : res.notExistArr

        // 可以添加的列表
        const existIds = Object.keys(existArr).map(key => existArr[key]).flat()
        if (!existIds.length) {
          this.handleSuccess()
          return
        }

        // 缓存不存在数据
        this.notExistArr = JSON.stringify(res.notExistArr)

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
      // 开始批量添加
      // 1 检查课程里是否有试卷 validTest
      // 2 有试卷则提示 noExistList + dialog
      // 3 用户点击继续则提交 confirm
      this.validTest()
    },
    handleSuccess () {
      this.$emit('complete')
      this.$alert('添加成功')
      this.state = 1
    }
  },
  components: {
    CourseTable,
    PaperTable,
    PositionData,
  }
}
</script>

<style scoped lang="less">
  .desc {
    font-size: 20px;
    margin: 30px 0 20px;
  }
</style>
