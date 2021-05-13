<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="选择课程" name="first">
        <CourseForm :showTestType="false" @search="search"/>
        <div class="content">
          <StageTable hideOutline :tableData="searchData" @checkedChange="listCheckedChange"  />
        </div>
        <div class="batch-align-center page-box">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="`已选课程(${selectedData.length})`" name="second">
        <div class="content">
          <StageTable hideOutline :tableData="selectedData" @checkedChange="selectedChange" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="batch-align-center">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button type="primary" @click="relatedClasses">下一步</el-button>
    </div>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import StageTable from '../stageTest/components/stageCourseTabel'
import CourseForm from '../stageTest/components/stageCourseForm'
import batchOperation from '@/api/batchOperation'
import { page, tableData } from '../common/mixins'
import { deepCopy } from '../util'
export default {
  mixins: [ page, tableData ],
  name: 'step2',
  props: ['cacheData'],
  data () {
    return {
      activeName: 'first',
    }
  },
  methods: {
    getList () {
      const page = this.page
      batchOperation.searchClass({ ...this.searchParams, type: 1, page, pageSize: this.pageSize }).then(res => {
        if (this.page !== page) return
        if (!res || res.length === 0) {
          this.$message({
            message: '暂无数据',
            type: 'warning'
          })
          this.total = 0
          this.searchData = []
          return
        }
        this.total = res.total
        const map = this.selectedMap
        this.searchData = res.list.map(item => {
          return {
            ...item,
            selected: item.id in map
          }
        })
      })
    },
    relatedClasses () {
      const step1Data = this.cacheData.step1.data
      const params = {
        netClassData: JSON.stringify(step1Data.map(item => ({ netClassId: item.id }))),
        relateData: JSON.stringify(this.selectedData.map(item => item.id))
      }

      batchOperation.relatedClassesBatch(params).then(res => {
        if (res.status === true) {
          this.next()
        } else {
          this.$message({ message: '添加失败', type: 'error' })
        }
      }).catch(e => {
        this.$message({ messsage: e.message, type: 'error' })
      })
    },
    next () {
      this.$emit('next', {
        key: this.$options.name,
        data: deepCopy(this.selectedData)
      })
    }
  },
  components: {
    StageTable,
    CourseForm,
  }
}
</script>

<style scoped>
.page-box {
  margin: 20px 0;
}
.content {
  min-height: 300px;
}
</style>
