<template>
  <div class="signIn">
    <el-header
      class="clearfix"
      style="height:40px;padding:0"
    >
      <span class="fl">签到信息</span>
      <el-date-picker
        class="fr"
        v-model="date"
        value-format="yyyy-MM-dd"
        size="mini"
        type="date"
        placeholder="选择日期"
        @change="getList"
      >
      </el-date-picker>
      <el-button
        type="primary"
        size="mini"
        class="fr mr10"
        @click="exportFn"
      >导出</el-button>
    </el-header>
    <signin-table :table-data="tableData" />
    <el-dialog
      title="导出签到记录"
      width="30%"
      :visible.sync="dialogVisible"
    >
      <p class="desc">选择时间段：</p>
      <el-date-picker
        v-model="dateValue"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleExport"
        >导 出</el-button>
      </span>
    </el-dialog>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
  import SigninTable from './components/SigninTable'
  import { getSignInList, exportReport } from '@/api/omoApi'
  import { page } from '@/common/mixins'
  function date() {
    let year = new Date().getFullYear()
    let m = new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1
    let d = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
    return `${year}-${m}-${d}`
  }

  export default {
    mixins: [page],

    components: {
      SigninTable,
    },

    data() {
      return {
        tableData: [],
        date: date(),
        dateValue: '',
        courseId: this.$route.query.rid, //15684,
        startDate: this.$route.query.startDate.split(' ')[0], 
        dialogVisible: false,
      }
    },

    mounted() {
      this.getList()
    },

    methods: {
      getList() {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          courseId: this.courseId,
          date: this.date,
        }
        if (new Date(this.startDate.replace(/-/g, '/')).getTime() <= new Date(this.date.replace(/-/g, '/')).getTime()) {
          getSignInList(params)
            .then(res => {
              if (res.code === 1000000) {
                this.tableData = res.data.result
                this.total = res.data.total
              } else {
                throw new Error(res.msg)
              }
            })
            .catch(e => {
              this.$message.error(e.message)
            })
        } else {
          this.$Toast('请选择大于开始时间！')
        }
      },
      exportFn() {
        this.dialogVisible = true
      },
      handleExport() {
        if (!this.dateValue) {
          this.$message.warning('请选择导出日期！')
          return
        }
        window.open(`${BASEURL}/interview/end/sign/download?courseId=${this.courseId}&startTime=${this.dateValue[0]}&endTime=${this.dateValue[1]}`)
      },
    },
  }
</script>

<style scoped lang='less'>
  .mr10 {
    margin-right: 10px;
  }
  .signIn {
    background: #fff;
    padding: 20px;
    .el-pagination {
      text-align: center;
      margin-top: 10px;
    }
    .desc {
      line-height: 4;
    }
  }
</style>
