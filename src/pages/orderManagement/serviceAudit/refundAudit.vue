<template>
  <div>
    <MenuTitle></MenuTitle>
    <search @search="search" />
    <div class="container-Box minHeight">
      <div class="clearfix">
        <el-button
          class="fr"
          style="margin-left:10px"
          size="small"
          v-auth="'BTES_EXPORT'"
          @click="handleExport"
        >导出</el-button>
          <el-button
          size="small"
          @click="handleBatchReject"
          class="fr"
          v-auth="'BTES_MUCH_CANCEL'"
        >批量驳回</el-button>
        <el-button
          size="small"
          @click="handleBatchThrough"
          class="fr"
          v-auth="'BTES_MUCH_PASS'"
        >批量通过</el-button>
      </div>
      <refundTable
        :tableData="tableData"
        @refresh="handleRefresh"
        @selectedData="handleSelectedData"
      />
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="container-pagination"
      >
      </el-pagination>
    </div>
    <RefundAuditBatchDialog 
      :dialog-visible.sync="dialogVisible" 
      :batch-data="batchData" 
    />
		
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import RefundAuditBatchDialog from './components/RefundAuditBatchDialog'
  import search from './components/search'
  import refundTable from './components/refundTable'
  import { getAuditOrderList, setBatchReject, setOrderThrough } from '@/api/orderManage'
  import { page } from '@/common/mixins'
  export default {
    mixins: [page],
    data() {
      return {
        tableData: [],
        searchData: {},
        selectedData: [],
        dialogVisible: false,
        batchData:[],
				pageSizes: Object.freeze([5, 10, 20]),
      }
    },
    components: {
      search,
      refundTable,
      RefundAuditBatchDialog
    },
    computed: {
      ...mapState(['username'])  
    },

    methods: {
      handleRefresh() {
        this.getList()
      },
      search(data) {
        this.page = 1
        this.getList(data)
      },
      handleSelectedData(val) {
        if (val.length > 0) {
          this.selectedData = val
        }
      },
      // 批量通过
      handleBatchThrough() {
        if (this.selectedData.length > 0) {
          const itemId = this.selectedData.map(item => item.itemID).join(',')
          setOrderThrough({
            itemId,
            operUser: this.username
          }).then((res) => {
            const failData = res.data.filter(item => item.code === 0)
            if (failData.length > 0) {
              this.batchData = res.data;
							this.dialogVisible = true;
							this.getList()
            } else {
              this.$message.success('批量通过成功！')
              this.getList()
            }
          }).catch((err) => {
            console.log(err);
          });
        }
      },
      // 批量驳回
      handleBatchReject() {
        if (this.selectedData.length > 0) {
          const params = this.selectedData.map(item => ({
            itemid: item.itemID, //订单课程记录编号
            ordernum: item.OrderNum, //订单编号
            title: item.Title, //课程名称
            remark: item.remarkNote, //备注
            operUser: this.username, //操作人
          }))
          setBatchReject(params).then((res) => {
            if (res.data.fail.length > 0) {
              this.dialogVisible = true
              this.batchData = res.data.fail.map(item => ({
                orderNum: item.ordernum,
                message: item.message
              }))
              console.log('驳回',this.batchData);
            } else {
              this.$message.success('批量驳回成功！')
              this.getList()
            }
          }).catch((err) => {
            console.log(err);
          });
        }

      },
      handleExport() {
        const params = this.$qs.stringify(this.searchData)
        window.open(`${PANGU_URL}/v1/c/audit/export?list_type=compensate&${params}`)
      },
      getList(params) {
        this.searchData = params || this.searchData
        this.getAuditOrderList()
      },
      getAuditOrderList() {
        getAuditOrderList({
          ...this.searchData,
          list_type: 'compensate', //exit退班,turn转班,compensate补配额,signup代报名
          page: this.page,
          pageSize: this.pageSize,
        })
          .then(res => {
            if (res.code == 10000) {
              this.tableData = res.data.data
              this.total = res.data.total
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
    },
  }
</script>
