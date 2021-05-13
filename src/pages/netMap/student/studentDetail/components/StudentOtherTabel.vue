<template>
  <div class="sutdent-other_table">
    <el-table
      :data="listData"
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="name"
        width="200"
        :label="tableName[answerCardType]"
      >
      </el-table-column>
      <el-table-column
        label="考试类型/科目"
        width="120"
      >
        <template slot-scope="scope">
          {{scope.row.categoryName}}/{{scope.row.subjectName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="提交状态"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        width="200"
        label="交卷/生成答题卡时间"
      >
      </el-table-column>
      <el-table-column
        prop="score"
        label="得分"
        v-if="answerCardType==='12'||answerCardType==='13'"
      >
      </el-table-column>
      <el-table-column
        prop="rcount"
        label="答对题数"
      >
      </el-table-column>
      <el-table-column
        prop="qcount"
        label="总题数"
      >
      </el-table-column>
      <el-table-column
        prop="spendTime"
        label="总计用时"
      >
      </el-table-column>
      <el-table-column
        v-if="answerCardType==='12'"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="lookReport(scope.row)"
          >查看报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-button
        size="small"
        icon="el-icon-arrow-left"
        :disabled="prev"
        @click="getPrevData"
      ></el-button>
      <el-button
        size="small"
        icon="el-icon-arrow-right"
        :disabled="next"
        @click="getNextData"
      >
      </el-button>
    </div>
  </div>
</template>

<script>
  import { getExamData, getToken } from '@/api/netMap'
  export default {
    props: {
      answerCardType: {
        type: String,
        default: '2',
      },
    },
    data() {
      return {
        userName: this.$route.query.userName,
        cursor: 0,
        pageSize: 5,
        i: 0,
        pageMap: new Map(),
        listData: [],
        prev: false,
        next: false,
        tableName: {
          2: '专项练习名称',
          3: '真题演练名称',
          12: '模考名称',
          13: '估分名称',
        },
      }
    },
    watch: {
      answerCardType(val) {
        this.cursor = 0
        this.pageMap = new Map()
        this.listData = []
        this.getListData(this.cursor)
      },
    },
    mounted() {
      this.getListData(this.cursor)
    },
    methods: {
      async getListData(cursor, type) {
        const { data = {} } = await getExamData({
          answerCardType: this.answerCardType,
          userName: this.userName,
          cursor,
          pageSize: this.pageSize,
        })
        if (!this.pageMap.has(this.i)) {
          this.pageMap.set(this.i, this.cursor)
        }
        this.prev = false
        this.next = false
        this.cursor = data.cursorStr
        if (!this.cursor) {
          this[type] = true
        }
        this.listData = data.resutls
      },

      async lookReport({ paperId, userId, provinceMockFlag }) {
        try {
          const res = await getToken(userId)
          if (res.code === 1000000) {
            window.open(`${PC_URL}mock/report/#/report?paperid=${paperId}&ht_token=${res.message}${provinceMockFlag ? '&splitProvince=true' : ''}`)
          }
        } catch (err) {
          console.log(err)
        }
      },

      getPrevData() {
        if (this.i === 0) {
          this.prev = true
          return
        }
        this.i--
        this.getListData(this.pageMap.get(this.i), 'prev')
      },

      getNextData() {
        this.i++
        this.getListData(this.cursor, 'next')
      },
    },
  }
</script>
<style lang="less" scoped>
  .sutdent-other_table {
    .pagination {
      display: flex;
      justify-content: center;
      .el-button {
        border: none;
      }
      .el-icon-arrow-left {
        margin-right: 10px;
      }
      .el-icon-arrow-right {
        margin-left: 10px;
      }
    }
  }
</style>