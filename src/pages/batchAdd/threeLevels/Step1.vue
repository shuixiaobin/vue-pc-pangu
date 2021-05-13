<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="选择课程" name="first">
        <CourseForm :showTestType="false" @search="search"/>
        <div class="content">
          <StageTable
            :tableData="searchData"
            @checkedChange="listCheckedChange"
            useSelectKey="syllabusHierarchy"
            useSelectValue="二级"
          />
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
          <StageTable :tableData="selectedData" @checkedChange="selectedChange" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="batch-align-center">
      <el-button @click="$router.back()">上一步</el-button>
      <el-button :disabled="!selectedData.length" type="primary" @click="next">下一步</el-button>
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
  name: 'step1',
  data () {
    return {
      activeName: 'first',
    }
  },
  methods: {
    getList () {
      const page = this.page
      batchOperation.searchClass({ ...this.searchParams, type: 3, page, pageSize: this.pageSize }).then(res => {
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
            selected: item.id in map,
            disabled: item.syllabusHierarchy !== '三级' && item.syllabusHierarchy !== '空'
          }
        })
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
