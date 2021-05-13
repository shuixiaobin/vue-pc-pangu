<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="选择试卷" name="first">
        <PaperForm @search="search" hideSubject/>
        <div class="content">
          <PaperTable :tableData="searchData" @checkedChange="listCheckedChange"/>
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
      <el-tab-pane :label="`已选试卷(${selectedData.length})`" name="second">
        <div class="content">
          <PaperTable :tableData="selectedData" @checkedChange="selectedChange"></PaperTable>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="batch-align-center">
      <el-button @click="$emit('prev', 2)">上一步</el-button>
      <el-button :disabled="!selectedData.length" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import PaperForm from '../stageTest/components/stagePaperForm'
import PaperTable from '../stageTest/components/stagePaperTable'
import batchOperation from '@/api/batchOperation'
import { page, tableData } from '../common/mixins'
import { deepCopy } from '../util'
import { paperStatusMap } from '../common/options'
export default {
  mixins: [ page, tableData ],
  props: ['cacheData'],
  name: 'step2',
  data () {
    return {
      activeName: 'first',
      input: '',
      pageSizes: Object.freeze([10, 20, 30, 40, 50])
    }
  },
  computed: {
    netClassIds () {
      return this.cacheData.step1.data.map(item => item.id).join(',')
    }
  },
  created () {
    this.uid = 0
  },
  methods: {
    getList () {
      const searchParams = this.searchParams
      const searchKey = searchParams.searchType === 1 ? 'stageTestName' : 'stageTestId'
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        netClassIds: this.netClassIds,
        startTime: searchParams.startTime,
        endTime: searchParams.endTime
      }
      params[searchKey] = searchParams.name

      batchOperation.searchPaperByCourseIds(params).then(res => {

        if (!res.list || res.list.length === 0) {
          this.$message({
            message: '暂无数据',
            type: 'warning'
          })
          this.total = 0
          this.searchData = []
          return
        }
        const map = this.selectedMap
        const d = res.list
        this.total = d.total
        this.searchData = d.data.map(item => {
          const state = paperStatusMap[item.status]
          return {
            id: item.id,
            name: item.name,
            status: state && state.label || '',
            examTime: `${item.startTime}-${item.endTime}`,
            selected: item.id in map,
            initialData: Object.freeze(item),
          }
        })
      })
    },
    next () {
      this.$emit('next', {
        key: this.$options.name,
        data: deepCopy(this.selectedData)
      })
    },
  },
  components: {
    PaperForm,
    PaperTable,
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
