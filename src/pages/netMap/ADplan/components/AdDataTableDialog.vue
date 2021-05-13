<template>
  <el-dialog
    width="60%"
    :visible="dataTableVisible"
    :before-close="handleClose"
  >
    <div slot="title">
      <el-form inline size="mini">
        <el-form-item label="数据看板">
          <el-select v-model="planType" placeholder="请选择看板" @change="planTypeChange">
            <el-option label="课程计划看板" value="1"></el-option>
            <el-option label="被动计划看板" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:10px">
      <el-form inline size="mini">
        <el-form-item label="线索日期">
          <el-date-picker
            v-model="planDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            @click="handleExport"
          >线索导出</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="totalData.passiveUnArriveCount===0"
            @click="handlePresetPlan"
          >发起主动计划</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lesson-kanban" v-if="planType == 1">
      <div class="lesson-kanban-title">
        <span>推广ROI</span>
        <span>消费</span>
        <span>展现量</span>
        <span>点击量</span>
        <span>星图线索量</span>
      </div>
      <div class="lesson-kanban-num">
        <span>{{wangtuReportData.promoteRoi || '-'}}</span>
        <span>{{wangtuReportData.cost || '-'}}</span>
        <span>{{wangtuReportData.impression || '-'}}</span>
        <span>{{wangtuReportData.click || '-'}}</span>
        <span>{{wangtuReportData.leadsNum || '-'}}</span>
      </div>
      <div class="lesson-kanban-title">
        <span>实际线索量</span>
        <span>机会量</span>
        <span>报名量</span>
        <span>加群量</span>
        <span>加个人量</span>
        <span>到课量</span>
        <span>成单量</span>
        <span>流水</span>
      </div>
      <div class="lesson-kanban-num">
        <span>{{wangtuReportData.realLeadsNum || '-'}}</span>
        <span>{{wangtuReportData.opporNum || '-'}}</span>
        <span>{{wangtuReportData.enrollNum || '-'}}</span>
        <span>{{wangtuReportData.addGroupNum || '-'}}</span>
        <span>{{wangtuReportData.addFriendNum || '-'}}</span>
        <span>{{wangtuReportData.courseSignNum || '-'}}</span>
        <span>{{wangtuReportData.crmOppOrder || '-'}}</span>
        <span>{{wangtuReportData.crmOppPayoff || '-'}}</span>
      </div>
      <div class="lesson-kanban-title">
        <span>线索转化率</span>
        <span>线索成本</span>
        <span>报名成本</span>
        <span>报名加群率</span>
        <span>群转个人率</span>
        <span>到课率</span>
        <span>成单率</span>
        <span>加群成本</span>
      </div>
      <div class="lesson-kanban-num lesson-kanban-num-end">
        <span>{{wangtuReportData.bizCardLead || '-'}}</span>
        <span>{{wangtuReportData.leadCost || '-'}}</span>
        <span>{{wangtuReportData.enrollCost || '-'}}</span>
        <span>{{wangtuReportData.addGroupPercent || '-'}}</span>
        <span>{{wangtuReportData.convertGroupPercent || '-'}}</span>
        <span>{{wangtuReportData.courseSignPercent || '-'}}</span>
        <span>{{wangtuReportData.orderPercent || '-'}}</span>
        <span>{{wangtuReportData.addGroupCost || '-'}}</span>
      </div>
    </div>
    <div class="passive-kanban" v-else>
      <ul class="table-header">
        <li>{{totalData.name}}</li>
        <li><b>{{totalData.totalLeadCount}}</b><span>总线索</span></li>
        <li><b>{{totalData.passiveArriveCount}}</b><span>被动触达</span></li>
        <li><b class="red">{{totalData.passiveUnArriveCount}}</b><span>被动未触达</span></li>
        <li><b>{{totalData.activeTotalCount}}</b><span>总主动</span></li>
        <li><b>{{totalData.activeArriveCount}}</b><span>主动触达</span></li>
        <li><b class="red">{{totalData.activeUnArriveCount}}</b><span>主动未触达</span></li>
      </ul>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          width="120"
          label="机器人"
        >
        </el-table-column>
        <el-table-column
          prop="totalLeadCount"
          label="总线索"
        >
        </el-table-column>
        <el-table-column
          prop="passiveArriveCount"
          label="被动触达"
        >
        </el-table-column>
        <el-table-column label="被动未触达">
          <template slot-scope="scope">
            <span class="red">{{scope.row.passiveUnArriveCount}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="activeTotalCount"
          label="总主动"
        >
        </el-table-column>
        <el-table-column
          prop="activeArriveCount"
          label="主动触达"
        >
        </el-table-column>
        <el-table-column label="主动未触达">
          <template slot-scope="scope">
            <span class="red">{{scope.row.activeUnArriveCount}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        class="container-pagination"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
  import { getDataActive, getDataActiveTotal, wangtuReport } from '@/api/netMap'
  import { page } from '@/common/mixins'
  export default {
    mixins: [page],
    props: {
      dataTableVisible: {
        type: Boolean,
        default: false,
      },
      campaignName: {
        type: String,
        default: '',
      },
      campaignId: {
        type: Number,
      },
    },
    data() {
      return {
        totalData: {},
        tableData: [],
        planDate: '',
        planType: '1',
        wangtuReportData: {}
      }
    },
    mounted() {
      this.wangtuReport()
    },
    methods: {
      handleClose() {
        this.$emit('update:dataTableVisible', false)
      },
      async getDataActive() {
        try {
          const { data } = await getDataActive(this.campaignId)
          this.tableData = data.list
          this.total = data.total
        } catch (err) {
          console.log(err)
        }
      },
      async getDataActiveTotal() {
        try {
          const data = await getDataActiveTotal(this.campaignId)
          this.totalData = data.data
        } catch (err) {
          console.log(err)
        }
      },
      async wangtuReport() {
        try {
          const data = await wangtuReport({campaignId:this.campaignId})
          if (data.code == 1000000) {
            this.wangtuReportData = data.data
          } else {
            this.$message.error(data.message)
          }
        } catch (err) {
          console.log(err)
        }
      },
      planTypeChange(val){
        if (val) {
          if (val == 1) {
            this.wangtuReport()
          } else {
            this.getDataActive()
            this.getDataActiveTotal()
          }
        }
      },
      handlePresetPlan() {
        this.$emit('update:dataTableVisible', false)
        this.$emit('handleSetPresetPlan', { count: this.totalData.passiveUnArriveCount })
      },
      handleExport() {
        const planDate = this.planDate
        const startTime = planDate ? planDate[0] : ''
        const endTime = planDate ? planDate[1] : ''
        window.open(`${CRM_URL}/crm/excel/download?campaignId=${this.campaignId}&promoteCampaignName=${this.campaignName}&startTime=${startTime}&endTime=${endTime}`)
      },
    },
  }
</script>
<style lang='less' scoped>
  .table-header {
    display: flex;
    justify-content: space-between;
    text-align: center;
    height: 70px;
    background: rgba(24, 86, 255, 0.1);
    border-radius: 4px;
    margin-bottom: 24px;
    box-sizing: border-box;
    padding: 14px 16px;
    li {
      &:first-child {
        width: 100px;
        font-size: 16px;
        line-height: 22px;
        text-align: left;
        font-weight: 500;
      }
    }
    b,
    span {
      display: block;
      color: #333333;
    }
    b {
      font-size: 14px;
      margin-bottom: 9px;
      &.red {
        color: #f01416;
      }
    }
    span {
      font-size: 12px;
    }
  }
  .red {
    color: #f01416;
  }
  .lesson-kanban {
    &-title,&-num {
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 20px;
      span {
        width: 100px;
      }
    }
    &-title {
      background: #fafafa;
      border: 1px solid #e8e8e8;
      border-radius: 5px;
      span {
        color: #000000d8;
      }
    }
    &-num-end {
      border-bottom: 1px solid #e8e8e8;
    }
  }
</style>