<template>
  <div class="adPlan">
    <MenuTitle></MenuTitle>
    <AdSearchFrom
      @handleSearch="search"
      @handleReset="handleReset"
      @handleExport="handleExport"
    />
    <div
      class="container"
      v-if="tableData.length > 0"
    >
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="广告计划"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="passiveRobotCount"
          label="被动机器人数量"
        >
        </el-table-column>
        <el-table-column
          prop="passiveLeadLimit"
          label="被动承接线索上线"
        >
        </el-table-column> -->
         <el-table-column
          prop="planType"
          label="最新计划类型"
        >
        </el-table-column>
        <el-table-column
          prop="gmtModify"
          label="最新预设时间"
        >
        </el-table-column>
        <el-table-column
          prop="operatorName"
          label="预设人"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="280"
        >
          <template slot-scope="scope">
             <el-button
              size="mini"
              v-auth="'ACP_KCJH'"
              type="text"
              @click="handleLessonPlan(scope.row)"
            >课程计划</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.passivityStatus === 1"
              @click="handleEdit(scope.row)"
              v-auth="'ACP_EDIT'"
            >修改被动</el-button>
            <el-button
              size="mini"
              type="text"
              v-else
              v-auth="'ACP_PZBD'"
              @click="handleSetPassive(scope.row)"
            >被动计划</el-button>
            <el-button
              size="mini"
              v-auth="'ACP_ZDPG'"
              type="text"
              :disabled="!scope.row.batchStatus"
              @click="handleActiveBatch(scope.row)"
            >主动批次</el-button>
            <el-button
              size="mini"
              v-auth="'ACP_SJZD'"
              type="text"
              @click="handleDataActive(scope.row)"
            >数据看板</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <NoData v-if="isfirst || !hasData">
      <template #icon>
        <i
          :class="[isfirst ? 'icontheme-nonepage-1' : 'icontheme-nonepage-2']"
          class="iconfont"
        ></i>
      </template>
      <template #desc>
        <p class="desc">{{isfirst ? '请筛选查找吧' : '暂无数据'}}</p>
      </template>
    </NoData>
    <!-- 设置被动/主动 机器人计划 -->
    <AdPresetPlanDialog
      v-if="dialogVisible"
      :is-active.sync="isActive"
      :is-edit.sync="isEdit"
      :is-disabled.sync="isDisabled"
      :campaign-id="campaignId"
      :batch-id="batchId"
      :count="count"
      :dialog-visible.sync="dialogVisible"
    />
    <!-- 数据-主动 -->
    <AdDataTableDialog
      v-if="dataTableVisible"
      :campaign-id="campaignId"
      :campaign-name="campaignName"
      :data-table-visible.sync="dataTableVisible"
      @handleSetPresetPlan="handleSetPresetPlan"
    />
    <!-- 主动计划批次 -->
    <AdActiveplanDialog
      v-if="activePlanVisible"
      :campaign-id="campaignId"
      :active-plan-visible.sync="activePlanVisible"
      @handleLookActivePlan="handleLookActivePlan"
    />
    <!-- 主动计划批次 -->
    <LessonPlanDialog
      v-if="lessonPlanVisible"
      :campaign-id="campaignId"
      :is-edit.sync="isEdit"
      :lesson-plan-visible.sync="lessonPlanVisible"
    />
  </div>
</template>

<script>
  import { getAdPlanList, PlanExport } from '@/api/netMap'
  import AdPresetPlanDialog from './components/AdPresetPlanDialog'
  import AdDataTableDialog from './components/AdDataTableDialog'
  import AdActiveplanDialog from './components/AdActiveplanDialog'
  import AdSearchFrom from './components/AdSearchFrom'
  import NoData from '../student/components/NoData'
  import LessonPlanDialog from './components/LessonPlanDialog'
  import { page } from '@/common/mixins'
  import { mapState } from 'vuex'
  export default {
    mixins: [page],
    components: {
      NoData,
      AdSearchFrom,
      AdPresetPlanDialog,
      AdDataTableDialog,
      AdActiveplanDialog,
      LessonPlanDialog
    },
    data() {
      return {
        tableData: [],
        isfirst: true,
        hasData: false,
        isActive: false,
        isEdit: false, //是否修改
        isDisabled: false, //是否只读
        dialogVisible: false, //修改被动弹窗
        dataTableVisible: false, //主动批次弹窗
        activePlanVisible: false, //数据-主动弹窗
        campaignId: null, //广告计划id
        batchId: null, //主动广告计划批次id
        campaignName: '', //广告计划名称
        count: 0,
        lessonPlanVisible: false
      }
    },

    computed: {
      ...mapState(['starMapNum']),
    },

    methods: {
      handleReset() {
        this.page = 1
        this.tableData = []
      },
      search(params) {
        this.isfirst = false
        this.searchParams = Object.freeze(params.searchVal)
        if (params.resetFlag) {
          this.page = 1
        }
        this.getList()
      },
      // 获取广告线索分配计划列表
      async getList() {
        try {
          const params = { name:this.searchParams.name, promoteAccountId:this.searchParams.promoteAccountId, page: this.page, pageSize: this.pageSize, operatorCode: this.starMapNum }
          const { data } = await getAdPlanList(params)
          if (data && data.list.length > 0) {
            this.hasData = true
            this.tableData = data.list
            this.total = data.total
          } else {
            this.tableData = []
            this.total = 0
            this.hasData = false
          }
        } catch (err) {
          console.log(err)
        }
      },
      //修改被动
      handleEdit(row) {
        this.campaignId = row.id
        this.isEdit = true
        this.dialogVisible = true
      },
      // 配置被动
      handleSetPassive(row) {
        this.dialogVisible = true
        this.campaignId = row.id
      },
      //主动批次
      handleActiveBatch(row) {
        this.campaignId = row.id
        this.activePlanVisible = true
      },
      // 查看主动计划批次
      handleLookActivePlan(id) {
        this.batchId = id
        this.isActive = true
        this.isDisabled = true
        this.dialogVisible = true
      },
      //数据-主动弹窗
      handleDataActive(row) {
        this.campaignId = row.id
        this.campaignName = row.name
        this.dataTableVisible = true
      },
      handleSetPresetPlan(obj) {
        this.count = obj.count
        this.isActive = true
        this.dialogVisible = true
      },
      async handleExport(searchData) {
        const params = {
          promoteAccountId: searchData.promoteAccountId,
          name: searchData.name,
          startTime: searchData.planDate ? searchData.planDate[0] : '' ,
          endTime: searchData.planDate ? searchData.planDate[1] : '',
          operatorCode: this.starMapNum
        }
        const res = await PlanExport(params)
        if (res && res.code && res.code == 1000012) {
          this.$message.error(res.message)
          return
        }
        window.open(`${CRM_URL}/crm/excel/list/download?promoteAccountId=${params.promoteAccountId}&name=${params.name}&operatorCode=${params.operatorCode}&startTime=${params.startTime}&endTime=${params.endTime}`)
      },
      handleLessonPlan(row) {
        this.campaignId = row.id
        this.campaignName = row.name
        this.lessonPlanVisible = true
        if (row.isPlanType) {
          this.isEdit = true
        }
      }
    },
  }
</script>
<style lang='less' scoped>
  .adPlan {
    background: #fff;
    .container {
      padding: 16px;
      border-top: 16px solid #f3f4f7;
    }
  }
</style>