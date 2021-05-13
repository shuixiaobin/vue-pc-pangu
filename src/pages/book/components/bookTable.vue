<template>
  <div>
    <el-table
      :data="tableData"
      border
      class="table"
    >
      <el-table-column
        prop="id"
        label="图书Id"
      >
      </el-table-column>
      <el-table-column
        label="基本信息"
        width="400"
      >
        <template slot-scope="scope">
          <div class="bookInfo">
            <img
              :src="scope.row.bookCover[0]"
              v-if="scope.row.bookCover&&scope.row.bookCover.length>0"
            >
            <h2>{{scope.row.bookName}}</h2>
            <div class="bookNO">书号：{{scope.row.bookNo}}</div>
            <div class="bookPage"><span class="fr">页数：{{scope.row.totalPage}}</span>{{scope.row.press}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.status|filterStauts}}
        </template>
      </el-table-column>
      <el-table-column
        prop="examCategory"
        label="适用考试"
      >
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          <span class="red">&yen;{{scope.row.actualPrice}}</span>
          <del>&yen;{{scope.row.price}}</del>
        </template>
      </el-table-column>
      <el-table-column label="单本成本">
        <template slot-scope="scope">
          &yen;{{scope.row.singleCost}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.status!=1"
            @click="onLine(scope.row)"
          >上线</el-button>
          <el-button
            type="text"
            v-if="scope.row.status==1"
            @click="offLine(scope.row)"
          >下线</el-button>
          <el-button
            type="text"
            @click="edit(scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            @click="look(scope.row)"
          >查看</el-button>
          <el-button
            type="text"
            v-if="scope.row.status!=1"
            @click="del(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { bookUpdate, updateSure } from '@/api/bookApi'
  export default {
    data() {
      return {}
    },
    props: {
      tableData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    filters: {
      filterStauts(v) {
        switch (v) {
          case 0:
            return '未上线'
            break
          case 1:
            return '已上线'
            break
          case 2:
            return '已下线'
        }
      }
    },
    computed: {
      userName() {
        // return localStorage.getItem('userName');
        return 'app_ztk2058930230'
      }
    },
    methods: {
      edit(row) {
        this.$router.push({
          path: '/home/addBook',
          query: { id: row.id, username: this.userName }
        })
      },
      look(row) {
        this.$router.push({
          path: '/home/bookDetail',
          query: { id: row.id }
        })
      },
      bookUpdate(row, status) {
        bookUpdate({
          bookId: row.id, //图书Id	number
          status //图书状态
        })
          .then(res => {
            if (res.code == 10000) {
              let message = ''
              if (status == 1) {
                message = '上线成功!'
              } else if (status == 2) {
                message = '下线成功!'
              }else{
                message = '删除成功!'
              }
              this.$message.success(message)
              this.$emit('refush')
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      onLine(row) {
        updateSure({ bookId: row.id })
          .then(res => {
            if (res.code == 10000) {
              this.$alert('<p>上线检查通过</p>', '上线检查提示', {
                dangerouslyUseHTMLString: true,
                center: true
              })
                .then(action => {
                  if (action === 'confirm') {
                    this.bookUpdate(row, 1)
                  }
                })
                .catch(() => {})
            } else {
              let html = '<ul>'
              res.data.forEach((item, index) => {
                html += '<li>' + (index + 1) + '.' + item + '</li>'
              })
              html += '</ul><p>请检查完善后再提交上线！！！</p>'
              this.$alert(html, '上线检查提示', {
                dangerouslyUseHTMLString: true,
                center: true
              }).catch(() => {})
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      offLine(row) {
        this.$confirm('确定下线', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.bookUpdate(row, 2)
          })
          .catch(() => {
            this.$message.info('已取消')
          })
      },
      del(row) {
        this.$confirm('确定删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.bookUpdate(row, 3)
          })
          .catch(() => {
            this.$message.info('已取消')
          })
      }
    }
  }
</script>
<style lang='less' scoped>
  .table {
    width: 100%;
    margin: 20px 0;
    .red {
      display: block;
      color: red;
    }
    del {
      display: block;
      color: gray;
    }
    .bookInfo {
      clear: both;
      overflow: hidden;
      img {
        width: 160px;
        float: left;
        margin-right: 20px;
      }
      h2 {
        font-weight: normal;
        width: 100%;
        padding-bottom: 5px;
        font-size: 14px;
        color: #000;
      }
      .bookNO {
        width: 100%;
        line-height: 23px;
        font-size: 12px;
        color: #000;
      }
      .bookPage {
        width: 100%;
        line-height: 23px;
        font-size: 12px;
        color: gray;
        .fr {
          float: right;
        }
      }
    }
  }
</style>