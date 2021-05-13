<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="选择试卷" name="first">
        <PaperForm @search="search"/>
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
          <PaperTable :tableData="selectedData" @checkedChange="listCheckedChange">
            <el-table-column
              align="center"
              width="100"
              label="排序">
              <template slot-scope="scope">
                <input :value="scope.row.sort" @change="sortChange($event, scope.row)" @keydown.enter="sortChange($event ,scope.row)" type="number" style="width: 60px;text-align: center">
              </template>
            </el-table-column>
          </PaperTable>
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
import PaperForm from './components/stagePaperForm'
import PaperTable from './components/stagePaperTable'
import batchOperation from '@/api/batchOperation'
import { page, tableData } from '../common/mixins'
import { deepCopy } from '../util'

export default {
  mixins: [ page, tableData ],
  name: 'step3',
  computed: {
    selectedData () {
      // 从大到小排序
      return Object.values(this.selectedMap)
        .sort((a, b) => a.sort - b.sort)
    }
  },
  data () {
    return {
      activeName: 'first',
      input: ''
    }
  },
  created () {
    this.uid = 0
  },
  methods: {
    getList () {
      batchOperation.searchPaper({
        ...this.searchParams,
        page: this.page,
        size: this.size,
      }).then(res => {
        const map = this.selectedMap
        this.total = res.data.total
        this.searchData = res.data.list.map(item => {
          const key = item.activityStatus.key
          return {
            id: item.id,
            name: item.name,
            status: item.activityStatus.value,
            bizStatus: item.bizStatus,
            examTime: item.examTime,
            selected: item.id in map,
            sort: 0,
            key,
            initialData: Object.freeze(item),
            disabled: key !== 2
          }
        })
      })
    },
    listCheckedChange (data) {
      if (data.selected) {
        data.sort = ++this.uid
        this.$set(this.selectedMap, data.id, data)
      } else {
        this.$delete(this.selectedMap, data.id)
      }
      this.resetSort()
    },
    resetSort () {
      Object.values(this.selectedMap)
        .sort((a, b) => a.sort - b.sort)
        .forEach((item, i) => (item.sort = i + 1))
    },
    next () {
      this.$emit('next', {
        key: this.$options.name,
        data: deepCopy(this.selectedData)
      })
    },
    sortChange (e, data) {
      const n = Number(e.target.value)
      if (n < 1) {
        this.$message({
          message: '排序不能小于1',
          type: 'warning'
        })
        return
      } else if (n > this.selectedData.length) {
        this.$message({
          message: '排序不能大于试卷总数',
          type: 'warning'
        })
        return
      }
      data.sort = n
    }
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
