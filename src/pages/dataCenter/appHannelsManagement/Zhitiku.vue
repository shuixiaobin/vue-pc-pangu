<template>
  <div style="min-height: 800px;">
    <Search @search="search" />
    <div style="margin: 20px 0;">
      <el-tooltip effect="dark" content="选择省级分校查询后使用" placement="top-start">
        <el-button v-auth="'BATCH_DOWNLOAD_QR'"  @click="batchDownloadQRcode">批量下载二维码</el-button>
      </el-tooltip>
      <el-button v-auth="'MOCK_REPORT'" @click="showBatchSignUp">模考报名查询</el-button>
    </div>
    <div>用户总计{{registerTotalCount}}人</div>
    <div style="margin: 20px 0;">
      <PersonTable :tableData="tableData" @download="download" @numClick="numClick" />
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
    <BatchDownloadQRCodeDialog ref="batchDownload" />
    <MockSingUpDialog ref="batchSignUp" />
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
import BatchDownloadQRCodeDialog from './zhitikuComponent/BatchDownloadQRCodeDialog'
import MockSingUpDialog from './zhitikuComponent/MockSingUpDialog'
import { page } from '@/common/mixins'
import { getPromoterChannelManageList, getWechatQRCode, batchDownloadQRCode } from '@/api/dataCenter'
const source = 2
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
    download ({areaId, id}) {
       this.$refs.batchDownload.show({
        handleConfirm: ({categoryId, subjectId}) => {
          getWechatQRCode({categoryId, subjectId, areaId, id}).then(res => {
            window.open(res.data.qrcode)
          })
        }
      })
    },
    numClick ({row, type}) {
      const id = row.id
      this.$refs.promoterDialog.show(Object.freeze({
        id, type, source,
      }))
    },
    batchDownloadQRcode () {
      if (!this.searchData.provinceSchoolId) {
        this.$message.warning('选择省级分校查询后使用')
        return
      }
      this.$refs.batchDownload.show({
        handleConfirm: ({categoryId, subjectId}) => {
          const searchData = {
            ...this.searchData,
            promoterInfoIdList: this.searchData.promoterInfoIdList.join(',')
          }
          const params = {
            ...searchData,
            categoryId,
            subjectId,
          }

          window.open(`${CRM_URL}/crm/v1/promoter/info/batchDownloadQRCode?${Object.entries(params).filter(item => item[1] != null).map(item => `${item[0]}=${item[1]}`).join('&')}`)

          // batchDownloadQRCode(params).then(res => {
          //   if (res.code === 1000000) {
          //     window.open(res.data)
          //     setTimeout(() => URL.revokeObjectURL(res.data), 5000)
          //   } else {
          //     throw res
          //   }
          // })
        }
      })
    },
    showBatchSignUp () {
      this.$refs.batchSignUp.show()
    },
  },
  components: {
    Search,
    PersonTable,
    PromoterDialog,
    BatchDownloadQRCodeDialog,
    MockSingUpDialog,
  }
}
</script>

<style scoped>

</style>
