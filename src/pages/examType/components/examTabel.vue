<template>
  <el-card class="box-card"
    style="margin-bottom:20px"
    shadow="always">
    <div class="tabel_item"
      :id="tabel.id"
      v-if="tabel">
      <!-- 操作按钮 slot -->
      <slot name="handle"
        :data="tabel"></slot>
      <!-- tabel -->
      <el-table empty-text="暂无课程"
        :data="tabel.data"
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
        v-if="tabel.flag">
        <el-table-column label="排序"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-input style="width:100%;text-align:center;"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
              size="mini"
              placeholder="请输入"
              v-model="scope.row.order"
              @blur="setClassOrder(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="rid"
          label="课程/合集ID"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column label="课程名称"
          align="center">
          <template slot-scope="scope">
            <span style=" cursor: pointer;color:#409EFF"
              @click="toDetail(scope.row)">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程/合集"
          align="center"
          width="100">
          <template slot-scope="scope">
            {{scope.row.type|typeFilter}}
          </template>
        </el-table-column>
        <el-table-column label="状态"
          align="center"
          width="100">
          <template slot-scope="scope">
            {{scope.row.status|statusFilter}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button type="text"
              size="small"
              @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span style="line-height:50px">共 {{tabel.total}} 条</span>
      <!-- 分页 -->
      <div style="float:right;overflow:hidden;position:relative">
        <i class="el-icon-d-arrow-left"
          style="position:absolute;top:8px;left:114px;"
          @click="tabelHandlePage(1)"></i>
        <el-pagination style="float:left;padding-bottom:10px"
          @size-change="tebelHandleSize"
          @current-change="tabelHandlePage"
          :current-page.sync="tabel.current_page"
          :page-sizes="[10,20,40,60,80,100]"
          :page-size="tabelSize"
          layout="sizes, prev, pager, next"
          :total="tabel.total"
          v-if="tabel.flag">
        </el-pagination>
        <i class="el-icon-d-arrow-right"
          style="float:right;margin-top:8px;margin-left:-11px"
          @click="tabelHandlePage(tabel.last_page)"></i>
      </div>
    </div>
  </el-card>
</template>
<script>
  import exam from '../../../api/exam'

  export default {
    name: 'tabel_item',
    props: {
      useTabel: {
        default: {},
        type: Array / Object
      },
      currentCateId: {
        default: '',
        type: String
      }
    },
    data() {
      return {
        tabelSize: 10,
        tabel: {}
      }
    },
    methods: {
      // tabel 前三行变色
      tableRowClassName({ row, rowIndex }) {
        if (row.isHighLight == 1) {
          return 'warning-row'
        }
        return ''
      },
      // tabelList 分页
      tebelHandleSize(val) {
        this.tabelSize = val
        this.$set(this.tabel, 'current_page', 1)
        this.search()
      },
      tabelHandlePage(val) {
        this.$set(this.tabel, 'current_page', val)
        this.search()
      },
      async search() {
        let param = {
          page: this.tabel.current_page,
          pageSize: this.tabelSize,
          typeId: this.tabel.id
        }
        let data = await exam.getSearchTabelList(param)
        // if (data) this.tabel.data = data.data
        if (data) {
          this.tabel = { ...this.tabel, data: data.data, total: data.total }
        }
      },
      // 课程排序
      async setClassOrder(item) {
        if (item.order) {
          let param = {
            id: item.id,
            classTitle: item.title,
            order: parseInt(item.order),
            typeId: this.tabel.id
          }

          if (parseInt(item.order) > 0) {
            let data = await exam.setClassOrder(param)
          } else {
            this.$message('请输入序号大于0')
          }
        } else {
          this.$message.error('请输入课程序号')
        }

        this.search()
      },
      // 删除课程
      deleteItem(item) {
        this.$confirm('此操作将永久不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(_ => {
            this.$nextTick(async _ => {
              let data = await exam.deleteClass({
                id: item.id,
                classTitle: item.title
              })
              if (data) {
                this.search()
              }
            })
          })
          .catch(_ => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      },
      // 跳转详情
      toDetail(item) {
        let classDetailMap = {
          '0': `${PHP_CLASS_DETAIL}NetClass/NetClass/editnetclass/${item.rid}`,
          '1': `${PHP_CLASS_DETAIL}NetClass/CollectionClasses/classList?collectRid=${
            item.rid
          }`,
          '2': (function() {
            let location_href

            switch (item.isShow) {
              case 0:
                location_href = `${PHP_CLASS_DETAIL}/NetClass/NetClassAutoOnlineOrOffline/getCollectionList?isType=1&rid=${
                  item.rid
                }`
                break
              case 1:
                location_href = `${PHP_CLASS_DETAIL}NetClass/NetClass/editnetclass/${
                  item.rid
                }`
                break
              default:
                location_href = ''
                break
            }

            return location_href
          })()
        }
        window.location.href = classDetailMap[item.type]
      }
    },
    watch: {
      // props userTabel copy
      useTabel: {
        handler: function(val) {
          this.tabel = val
        },
        deep: true,
        immediate: true
      }
    },
    filters: {
      typeFilter(val) {
        let examTypeMap = {
          '0': '课程',
          '1': '合集',
          '2': '自动上下线'
        }

        return examTypeMap[val]
      },
      statusFilter(val) {
        let statusTypeMap = {
          '0': '未上线',
          '1': '正常',
          '2': '下线',
          '4': '删除'
        }

        return statusTypeMap[val]
      }
    }
  }
</script>
<style lang="less" scoped>
  .tabel_item {
    overflow: hidden;
    border-bottom: 1px solid #ecf0f5;
    margin-bottom: 10px;

    &:last-child {
      border: none;
    }

    > div {
      margin: 10px 0;
    }
  }
</style>