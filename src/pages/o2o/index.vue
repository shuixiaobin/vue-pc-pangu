<template>
  <div>
    <div class="container-title">
      <h2>O2O课程管理</h2>
      <router-link
        :to="{ path: '/home/o2o/create' }"
        class="creat"
      >
        <el-button
          type="primary"
          size="small"
        >创建o2o课程</el-button>
      </router-link>
    </div>
    <div class="container">
      <search-form @search="search"></search-form>
      <el-table
        :data="tableData"
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
          prop="id"
          width="70"
          label="课程id"
        >
        </el-table-column>
        <el-table-column
          prop="title"
          label="课程标题"
        >
        </el-table-column>
        <el-table-column
          prop="ssTitle"
          label="线下课程名称"
        >
        </el-table-column>
        <el-table-column
          prop="zxTitle"
          width="150"
          label="在线课程名称"
        >
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="考试类型"
        >
        </el-table-column>
        <el-table-column
          prop="branchDepartmentName"
          width="150"
          label="分校"
        >
        </el-table-column>
        <el-table-column
          width="100"
          label="状态"
        >
          <template slot-scope="{row}">
            {{row.status | statusFilters}}
          </template>
        </el-table-column>
        <el-table-column
          width="170"
          label="创建时间/更新时间"
        >
          <template slot-scope="{row}">
            <div>
              <p>{{row.createTime}}/</p>
              <p>{{row.updateTime}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          width="100"
          label="操作人"
        >
        </el-table-column>
        <el-table-column
          prop="goodsNumber"
          label="已选商品数"
        >
        </el-table-column>
        <el-table-column
          width="100"
          fixed="right"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              size="small"
              v-if="row.status < 1"
              @click="edit(row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              v-if="row.status != 1"
              @click="setLine(row.id,1)"
            >上线</el-button>
            <el-button
              v-if="row.status == 1"
              type="text"
              size="small"
              @click="setLine(row.id,2)"
            >下线</el-button>
            <el-button
              v-if="row.status == 1 || row.status == 2"
              type="text"
              size="small"
              @click="goDetail(row.id)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin:10px">
        <span>将选定的课程:</span>
        <el-button
          type="primary"
          :disabled="listIds.length == 0"
          @click="setStatus(1)"
          size="small"
        >上线</el-button>
        <el-button
          type="success"
          :disabled="listIds.length == 0"
          @click="setStatus(2)"
          size="small"
        >下线</el-button>
      </div>
      <el-pagination
        :current-page="pageData.page"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="pageData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @size-change="sizeChange"
        @current-change="pageChange"
        class="container-pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import searchForm from './search.vue'
  import api from '@/api/courseApi.js'
  export default {
    name: 'index',
    components: {
      searchForm
    },
    data() {
      return {
        searchform: {}, //搜索项
        tableData: [], //表格数据
        listIds: [],
        pageData: {
          page: 1,
          size: 10,
          total: 0
        }
      }
    },
    created() {
      //setClassStatus
    },
    methods: {
      async search(val) {
        if (val) this.searchform = val
        var list = await api.getO2OList({
          ...this.searchform,
          page: this.pageData.page,
          pageSize: this.pageData.size
        })
        this.tableData = list.data.data
        this.pageData.total = list.data.total
      },
      async setStatus(flag) {
        this.setLine(this.listIds, flag)
      },
      handleSelectionChange(val) {
        this.listIds = val.map(item => {
          return item.id
        })
        this.listIds = this.listIds.join(',')
      },
      pageChange(val) {
        this.pageData.page = val
        this.search()
      },
      sizeChange(val) {
        this.pageData.size = val
        this.pageData.page = 1
        this.search()
      },
      async setLine(id, flag) {
        // this.$confirm('请确认上下线操作！', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //   }).catch(() => {
        //   });
        let param = {
          id: id,
          status: flag
        }
        var data = await api.setClassStatus(param)
        if (data.code == 10000) {
          this.$message.success('修改成功！')
          this.search()
        } else {
          this.$message.error(data.msg)
        }
      },
      edit(id) {
        this.$router.push({ name: 'o2o/create', query: { id: id } })
      },
      goDetail(id) {
        this.$router.push({ name: 'o2o/detail', query: { id: id } })
      }
    },
    filters: {
      statusFilters(val) {
        let item
        switch (Number(val)) {
          case 0:
            item = '未上线'
            break
          case 1:
            item = '已上线'
            break
          case 2:
            item = '已下线'
            break
          default:
            item = val
            break
        }
        return item
      }
    }
  }
</script>
