<template>
  <div style="min-height: 800px;">
    <Search @search="search" />
    <div style="margin: 20px 0;">
      <el-button v-auth="'DOWNLOAD_USER_INFO'" @click="exportStudentInfo">导出学员信息</el-button>
    </div>
    <div>用户总计{{registerTotalCount}}人</div>
    <div style="margin: 20px 0;">
      <PersonTable hideOperate :tableData="tableData" @numClick="numClick" />
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
    <PromoterDialog  ref="promoterDialog" />
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import Search from './zhitikuComponent/Search'
import PersonTable from './zhitikuComponent/PersonTable'
import PromoterDialog from './zhitikuComponent/PromoterDialog'
import { page } from '@/common/mixins'
import { getPromoterChannelManageList, downloadStudentInfo } from '@/api/dataCenter'
const source = 1
export default {
  mixins: [ page ],
  data () {
    return {
      searchData: {},
      registerTotalCount: 0,
      tableData: [],
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getPromoterChannelManageList({
        ...this.searchData,
        page: this.page,
        pageSize: this.pageSize,
        source,
      }).then(res => {
        const d = res.data
        this.registerTotalCount = d.registerTotalCount
        this.tableData = Object.freeze(d.pageInfo.list)
        this.total = d.pageInfo.total
      })
    },
    search (searchData) {
      this.page = 1
      this.searchData = searchData
      this.getList()
    },
    numClick ({row, type}) {
      const id = row.id
      this.$refs.promoterDialog.show(Object.freeze({
        id, type, source,
      }))
    },
    exportStudentInfo () {
      downloadStudentInfo(this.searchData).then(res => {
        if (res.code === 1000000) {
          window.open(res.data)

          setTimeout(() => URL.revokeObjectURL(res.data), 5000)
        } else {
          throw res
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
  },
  components: {
    Search,
    PersonTable,
    PromoterDialog,
  }
}
</script>

<style scoped>

</style>
