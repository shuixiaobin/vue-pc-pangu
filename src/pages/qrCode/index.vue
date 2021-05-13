<template>
  <div>
    <div class="container-title">
      <h2>二维码配置</h2>
      <el-button @click="createQrcode" type="primary" size="mini">新建二维码</el-button>
    </div>
    <div class="container">
      <SearchForm inline @search="handleSearch" />
      <TableContent :tableData="qrCodeList" @edit="editQrcode" @remove="removeQrcode"/>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        class="container-pagination"
        :total="total">
      </el-pagination>
      <QrcodeDialog @confirm="getList" ref="qrDialog" />
    </div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import SearchForm from './components/searchForm'
import TableContent from './components/tableContent'
import QrcodeDialog from './components/qrcodeDialog'
import { page } from '@/common/mixins.js'
import { servideNumInfo } from '@/api/qrCode.js'
export default {
  mixins: [ page ],
  data () {
    this.cacheSearchData = {}
    return {
      qrCodeList: [],
    }
  },
  methods: {
    createQrcode () {
      this.$refs.qrDialog.createQrcode()
    },
    editQrcode (data) {
      this.$refs.qrDialog.editQrcode(data)
    },
    removeQrcode (data) {
      this.$refs.qrDialog.removeQrcode(data)
    },
    handleSearch (data) {
      this.cacheSearchData = data
      this.page = 1
      this.getList()
    },
    getList () {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.cacheSearchData
      }
      servideNumInfo(params).then(res => {
        if (res.code === 10000) {
          this.qrCodeList = res.data.data
          this.total = res.data.total
          this.page = res.data.current_page
        } else {
          throw new Error(res.msg)
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
  },
  components: {
    SearchForm,
    TableContent,
    QrcodeDialog,
  }
}
</script>
