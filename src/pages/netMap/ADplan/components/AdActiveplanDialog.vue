<template>
  <el-dialog
    title="主动计划批次"
    :visible="activePlanVisible"
    width="60%"
    :before-close="handleClose"
  >
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        width="230"
        label="主动计划批次"
      >
        <template slot-scope="scope">
          <span
            style="color:#1A57FF;font-size:12px;cursor:pointer"
            @click="handleLook(scope.row)"
          >
            {{scope.row.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalCount"
        label="总主动量"
      >
      </el-table-column>
      <el-table-column
        prop="arriveCount"
        label="主动触达"
      >
      </el-table-column>
      <el-table-column label="主动未触达">
        <template slot-scope="scope">
          <span class="red">{{scope.row.noArriveCount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="predictFinishTime"
        label="预估完成时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="140"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleLook(scope.row)"
            type="text"
            size="mini"
          >查看</el-button>
          <el-button
            @click="handleExport(scope.row)"
            type="text"
            size="mini"
          >未触达导出</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      class="container-pagination"
    >
    </el-pagination>
  </el-dialog>
</template>

<script>
  import { getActivePlanList } from '@/api/netMap'
  import { page } from '@/common/mixins'
  export default {
    mixins: [page],
    props: {
      activePlanVisible: {
        type: Boolean,
        default: false,
      },
      campaignId: {
        type: Number,
      },
    },
    data() {
      return {
        tableData: [],
      }
    },

    mounted() {
      this.getActivePlanList()
    },

    methods: {
      async getActivePlanList() {
        try {
          const { data } = await getActivePlanList(this.campaignId)
          this.total = data.total
          this.tableData = data.list
        } catch (err) {
          console.log(err)
        }
      },
      handleClose() {
        this.$emit('update:activePlanVisible', false)
      },
      handleLook(row) {
        this.$emit('handleLookActivePlan', row.id)
      },
      handleExport(row) {
        window.open(`${CRM_URL}/crm/excel/batchDownload?campaignId=${this.campaignId}&promoteCampaignName=${row.name}&batchId=${row.id}`)
      },
    },
  }
</script>
<style lang='less' scoped>
  .red {
    color: #f01416;
  }
</style>