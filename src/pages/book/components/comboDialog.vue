<template>
  <el-dialog
    title="选择图书"
    :visible.sync="visible"
  >
    <el-form
      :inline="true"
      :model="form"
    >
      <el-form-item>
        <el-select v-model="form.selectType">
          <el-option
            label="图书名称"
            value="1"
          ></el-option>
          <el-option
            label="图书id"
            value="2"
          ></el-option>
          <el-option
            label="书号（或自编码）"
            value="3"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-if="form.selectType==='1'"
          v-model="form.searchVal"
          placeholder="请输入"
        ></el-input>
        <el-input
          type="number"
          v-if="form.selectType==='2'"
          v-model.number="form.searchId"
          placeholder="请输入id"
        ></el-input>
        <el-input
          type="number"
          v-if="form.selectType==='3'"
          v-model.number="form.bookNum"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSearch"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <p
      class="selectedNum"
      v-if="multipleSelection.length > 0"
    >已选择{{multipleSelection.length}}本图书</p>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="图书id"
        prop="id"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="图书信息"
        prop="bookName"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="bookNo"
        label="书号(或自编码)"
      >
      </el-table-column>
      <el-table-column
        prop="totalPage"
        label="总页数"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="图书状态"
      >
        <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <el-button
      type="primary"
      @click="onSubmit"
    >确定</el-button>
    <el-button @click="handleReset">重置</el-button>
  </el-dialog>
</template>

<script>
  import { getBookList } from '@/api/bookApi'
  export default {
    props: ['status'],
    data() {
      return {
        visible: false,
        pageSizes: [10, 20, 30, 50],
        pageSize: 10,
        total: 0,
        page: 1,
        form: {
          selectType: '1',
          searchVal: '',
          searchId: '',
          bookNum: ''
        },
        tableData: [],
        multipleSelection: [],
        selectedData: []
      }
    },
    filters: {
      filterStatus(val) {
        let str = ''
        switch (val) {
          case 0:
            str = '未上线'
            break
          case 1:
            str = '上线'
            break
          case 2:
            str = '下线'
            break
          default:
            str = ''
            break
        }
        return str
      }
    },
    watch: {
      pageSize() {
        this.getBookListFn()
      },
      page() {
        this.getBookListFn()
      }
    },
    methods: {
      show() {
        this.visible = true
        if (this.tableData.length === 0) {
          this.getBookListFn()
        }
      },
      getBookListFn() {
        getBookList({
          bookId: this.form.searchId,
          bookName: this.form.searchVal,
          bookNo: this.form.bookNum,
          forRelated: 1,
          isOnline: this.status !== 1 ? 0 : 1,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            this.total = res.data.totalAllNum
            this.tableData = res.data.list
          })
          .catch(err => {
            console.log(err)
          })
      },
      onSearch() {
        this.getBookListFn()
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.page = val
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleReset() {
        this.$refs.multipleTable.clearSelection()
      },
      onSubmit() {
        this.visible = false
        this.$emit('selectTabel', this.multipleSelection)
      }
    }
  }
</script>
<style lang='less' scoped>
  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  .selectedNum {
    text-align: right;
    color: #3399ff;
    margin-bottom: 10px;
  }
</style>