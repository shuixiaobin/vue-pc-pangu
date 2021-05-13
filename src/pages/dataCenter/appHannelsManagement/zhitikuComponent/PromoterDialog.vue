<template>
  <el-dialog
    title="查看用户数据"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="handleClose">
    <PromoterSearch @search="search" />
    <div style="margin: 20px 0;">
      <PromoterTable :tableData="tableData" />
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
import { page } from '@/common/mixins'
import PromoterSearch from './PromoterSearch'
import PromoterTable from './PromoterTable'
import { getPromoterNumeberList } from '@/api/dataCenter'
export default {
  mixins: [ page ],
  data () {
    return {
      dialogVisible: false,
      searchDefaultParams: {},
      searchParams: {},
      tableData: [],
    }
  },
  methods: {
    search (searchParams) {
      this.page = 1
      this.searchParams = searchParams
      this.getList()
    },
    getList () {
      const params = {
        ...this.searchDefaultParams,
        ...this.searchParams,
        page: this.page,
        pageSize:this.pageSize,
      }
      getPromoterNumeberList(params).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
    show (params) {
      this.searchDefaultParams = params
      this.dialogVisible = true
      this.getList()
    },
  },
  components: {
    PromoterSearch,
    PromoterTable,
  },
}
</script>

<style scoped>

</style>
