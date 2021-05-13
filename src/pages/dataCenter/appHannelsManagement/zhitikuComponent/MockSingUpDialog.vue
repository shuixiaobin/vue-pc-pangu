<template>
  <el-dialog
    title="请选择"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="handleClose">
    <MockSignUpSearch @search="search" />
    <div style="margin: 20px 0;">
      <MockSignUpTable :tableData="tableData" />
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-dialog>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import MockSignUpSearch from './MockSignUpSearch'
import MockSignUpTable from './MockSignUpTable'
import { page } from '@/common/mixins'
import { getMockEnrollList } from '@/api/dataCenter'
export default {
  mixins: [ page ],
  data () {
    return {
      dialogVisible: false,
      tableData: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    search (params) {
      this.page = 1
      this.searchPararms = params
      this.getList()
    },
    getList () {
      const params = {
        ...this.searchPararms,
        page: this.page,
        pageSize: this.pageSize,
      }
      getMockEnrollList(params).then(res => {
        this.total = res.data.total
        this.tableData = Object.freeze(res.data.list)
      })
    },
    show () {
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
    },
  },
  components: {
    MockSignUpTable,
    MockSignUpSearch,
  }
}
</script>

<style scoped>

</style>
