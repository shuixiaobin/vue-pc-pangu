<template>
  <div class="examDialog">
    <el-dialog
      title="关联阶段测试"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div class="searchBox">
        <div>
          状态
          <el-select
            v-model="searchData.status"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
          考试类型
          <el-select
            v-model="searchData.category"
            size="mini"
            placeholder="请选择"
            @change="getSubject()"
          >
            <el-option
              v-for="item in examTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
          科目
          <el-select
            v-model="searchData.subjectId"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in subjectList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select
            v-model="searchData.searchType"
            size="mini"
            placeholder="请选择"
            style="width:100px"
          >
            <el-option
              v-for="item in searchList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            v-model="searchData.inputVal"
            placeholder="请输入名称/id"
            style="width:200px"
          ></el-input>
          开始时间
          <el-date-picker
            size="mini"
            v-model="searchData.startTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd hh:mm:ss"
          >
          </el-date-picker>
          <el-button
            size="mini"
            type="primary"
            class="searchBtn"
            @click="handleSearch"
          >搜索</el-button>
        </div>
      </div>
      <el-table
        border
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%;margin-top: 20px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :selectable='selectable'
          width="55"
        >
        </el-table-column>
        <el-table-column
          label="试卷ID"
          prop="id"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="activityStatus"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            {{scope.row.activityStatus.value}}
          </template>
        </el-table-column>
        <el-table-column
          prop="activityTime"
          label="考试时间"
          width="350px "
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="size"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false"
          size="mini"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="saveExam"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getParams } from '@/config/utils'
  import Axios from 'axios'

  export default {
    data() {
      return {
        dialogVisible: false,
        statusList: [],
        page: 1,
        size: 20,
        total: null,
        tableData3: [],
        activityType: 18, //18 代表阶段测试
        netClassId: getParams('netClassId'), //课程id
        classNodeId: null, //课程节点id
        searchData: {
          status: '', //状态
          category: '',
          subjectId: '',
          searchType: 2,
          startTime: '', //开始时间
          inputVal: '', //输入框
          multipleSelection: [] //多选值
        },
        searchList: [{ key: 1, value: '试卷名' }, { key: 2, value: '试卷ID' }],
        examTypeList: [],
        subjectList: []
      }
    },

    created() {
      this.getStatusType()
      this.getExamType()
    },
    methods: {
      // 已发布可以勾选，其他不可以
      selectable(row, index) {
        if (row.activityStatus.key === 2) {
          return true
        } else {
          return false
        }
      },
      isShow(id) {
        this.classNodeId = id
        this.dialogVisible = true
      },
      // 搜索
      handleSearch() {
        this.myGet('/pand/formativeTestPaper/list', {
          bizStatus: this.searchData.status,
          startTime: this.searchData.startTime[0],
          endTime: this.searchData.startTime[1],
          searchType: this.searchData.searchType,
          name: this.searchData.inputVal,
          page: this.page,
          size: this.size,
          category: this.searchData.category,
          subjectId: this.searchData.subjectId
        })
          .then(res => {
            if (res.code === 1000000) {
              this.total = res.data.total
              this.tableData3 = res.data.list
            }
          })
          .catch(err => {})
      },
      // 获取状态分类
      getStatusType() {
        this.myGet('/pand/formativeTestPaper/activityState', {
          activityType: this.activityType
        })
          .then(res => {
            if (res.code === 1000000) {
              this.statusList = res.data
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      //获取考试类型
      getExamType() {
        this.myGet('/pand/formativeTestPaper/categoryInfo', {})
          .then(res => {
            //console.log(res.code)
            if (res.code === 1000000) {
              this.examTypeList = res.data
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      // 获取科目列表
      getSubject() {
        this.subjectList = []
        this.searchData.subjectId = ''
        this.myGet('/pand/formativeTestPaper/subjectInfo', {
          categoryId: this.searchData.category
        })
          .then(res => {
            if (res.code === 1000000) {
              this.subjectList = res.data
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      handleSelectionChange(val) {
        this.searchData.multipleSelection = val
      },
      // 触发分页
      currentChange(e) {
        this.page = e
        this.handleSearch()
      },
      // 保存试题
      saveExam() {
        if (this.tableData3.length === 0) {
          this.$message.warning('请选择试题')
          return
        }
        this.myPost(`${PHP_URL}/v5/pc/syllabus/save_stage_test`, {
          classNodeId: this.classNodeId,
          data: JSON.stringify({ list: this.searchData.multipleSelection }),
          netClassId: this.netClassId
        })
          .then(res => {
            if (res.code === 10000) {
              this.dialogVisible = false
              this.tableData3 = []
              this.searchData.status = '' //状态
              this.searchData.startTime = '' //开始时间
              this.searchData.inputVal = '' //输入框
              this.searchData.multipleSelection = [] //多选值
              // eventBus.$emit('updata')
              this.$emit('update2')
            } else {
              this.$message.error(res.message)
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }
    }
  }
</script>
<style lang='less' scoped>
  .searchBox {
    .el-select {
      margin-right: 20px;
    }
    .el-input {
      width: 300px;
      margin-top: 20px;
    }
    .searchBtn {
      margin-top: 20px;
    }
  }
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
