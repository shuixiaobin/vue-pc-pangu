<template>
  <div>
    <div class="container-title">
      <div class="container-title-name">
        <h2 style="display:inline-block">激活码</h2>
        <el-button
          type="text"
          class="link"
          @click="showDialog"
        >生成激活码</el-button>
      </div>
      <el-button
        type="primary"
        @click="goBack"
      >返回</el-button>
    </div>
    <div class="container">
      <div class="container-searchLine">
        <span class="item">
          <el-select
            v-model="type"
            style="width: 150px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            type="text"
            style="width: 250px"
            v-model="keyWord"
          />
        </span>
        是否激活:
        <el-select
          clearable
          v-model="status"
          style="width: 150px"
          placeholder="请选择"
        >
          <el-option
            label="是"
            :value="1"
          />
          <el-option
            label="否"
            :value="0"
          />
        </el-select>
        <span class="item">
          适用范围:
          <el-select
            v-model="scopeId"
            style="width: 150px"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in scopeList"
              :key="item.scopeId"
              :label="item.scopeName"
              :value="item.scopeId"
            >
            </el-option>
          </el-select>
        </span>
        <span class="item">
          创建时间:
          <el-date-picker
            v-model="time"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </span>
        <span class="item">
          激活时间:
          <el-date-picker
            v-model="activeTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </span>
        <span class="item">
          <el-button
            type="primary"
            @click="getList()"
          >搜索</el-button>
          <el-button
            type="primary"
            @click="exportCode"
          >导出激活码</el-button>
          <el-button
            type="primary"
            @click="exportUser"
          >导出激活用户表</el-button>
        </span>
      </div>
      <el-table
        :data="list"
        border
        style="max-width: 100%;overflow-x: scroll;"
      >
        <el-table-column
          prop="codeId"
          label="ID"
          width="90"
        >
        </el-table-column>
        <el-table-column
          prop="cardNum"
          width="120"
          label="卡号"
        >
        </el-table-column>
        <el-table-column
          prop="cardPass"
          width="120"
          label="激活码"
        >
        </el-table-column>
        <el-table-column
          prop="validityTime"
          width="150"
          label="有效期"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="120"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          prop="scopeName"
          label="适用范围"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="激活时间"
        >
        </el-table-column>
        <el-table-column
          prop="userName"
          label="激活人"
        >
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="联系电话"
        >
        </el-table-column>
        <el-table-column
          prop="isNew"
          label="类型"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="confirm(scope.row)"
            >失效</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="container-pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="size"
        :page-sizes="[10,30,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <create-code
      @created="handleCreated"
      :scopeList="scopeList"
      ref="create"
    ></create-code>
  </div>
</template>

<script>
  import Course from '@/api/courseApi.js'
  import createCode from './components/createActivationCode'
  export default {
    name: 'activationCode',
    components: {
      createCode
    },
    data() {
      return {
        options: [
          {
            label: '卡号',
            value: 1
          },
          {
            label: '激活码',
            value: 2
          },
          {
            label: '用户名',
            value: 3
          },
          {
            label: '联系方式',
            value: 4
          }
        ],
        type: 1,
        keyWord: '',
        status: '',
        time: null,
        list: [],
        currentPage: 1,
        size: 30,
        total: 0,
        activeTime: null,
        scopeId: '',
        scopeList: [],
        cardId: this.$route.params.id
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.getList(val)
      },
      handleSizeChange(val) {
        this.size = val
        this.getList()
      },
      //失效
      async invalid(row) {
        let param = {
          codeId: row.codeId,
          status: 2
        }
        let data = await Course.invalidCode(param)
        if (data) {
          this.$message.success(`卡号：${row.cardNum}，失效成功`)
          this.getList(this.currentPage)
        }
      },
      async getList(page = 1) {
        this.currentPage = page
        let param = {
          beginTime: this.activeTime ? this.activeTime[0] : '',
          outTime: this.activeTime ? this.activeTime[1] : '',
          startTime: this.time ? this.time[0] : '',
          endTime: this.time ? this.time[1] : '',
          keyWord: this.keyWord,
          page: this.currentPage,
          pageSize: this.size,
          scopeId: this.scopeId,
          status: this.status,
          type: this.type,
          cardId: this.cardId
        }
        let data = await Course.getActivationList(param)
        if (data) {
          this.list = data.data
          this.currentPage = data.current_page
          this.total = data.total
        }
      },
      confirm(val) {
        this.$confirm('失效后该卡将不能使用，确定失效?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.invalid(val)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      async getScopeList() {
        let data = await Course.getScopeList()
        if (data) {
          this.scopeList = data
        }
      },
      showDialog() {
        this.$refs.create.show()
      },
      //导出激活码
      exportCode() {
        if (this.scopeId === '') {
          this.$message.warning('请选择适用范围')
          return
        }
        if (!this.time) {
          this.$message.warning('请选择创建时间')
          return
        }
        const t1 = new Date(this.time[0]).getTime()
        const t2 = new Date(this.time[1]).getTime()
        const day = Math.ceil((t2 - t1) / (60 * 60 * 24 * 1000))
        if (day > 60) {
          this.$message.warning('导出激活码创建时间间隔最大为60天')
          return
        }

        let param = {
          startTime: this.time ? this.time[0] : '',
          endTime: this.time ? this.time[1] : '',
          scopeId: this.scopeId,
          cardId: this.cardId
        }
        Course.exportCode(param)
      },
      //导出激活码
      exportUser() {
        let param = {
          beginTime: this.activeTime ? this.activeTime[0] : '',
          outTime: this.activeTime ? this.activeTime[1] : '',
          startTime: this.time ? this.time[0] : '',
          endTime: this.time ? this.time[1] : '',
          keyWord: this.keyWord,
          scopeId: this.scopeId,
          status: this.status,
          type: this.type,
          cardId: this.cardId
        }
        Course.exportUser(param)
      },
      //生成激活码之后  重置所有搜索条件加载数据
      handleCreated() {
        let obj = {
          type: 1,
          keyWord: '',
          status: '',
          time: null,
          currentPage: 1,
          size: 30,
          total: 0,
          activeTime: null,
          scopeId: ''
        }
        Object.assign(this.$data, obj)
        this.getList()
      },
      goBack() {
        this.$router.go(-1)
      }
    },
    created() {
      this.getScopeList()
      this.getList()
    }
  }
</script>

<style scoped lang="less">
  @import url(./common);
  .container-searchLine {
    .item {
      display: inline-block;
      margin-bottom: 15px;
    }
  }
</style>
