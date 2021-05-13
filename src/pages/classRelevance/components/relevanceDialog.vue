<template>
    <div class="dialog" v-loading="loading">
        <el-dialog title="关联课程" :visible.sync="dialogVisible" width="60%">
            <div class="search-wrapper">
                <div class="searchLeft">
                    <div class="lessonBox searchItem">
                        <span>选择课程：</span>
                        <div class="lessonInput">
                            <el-select size="mini" v-model="singletype" placeholder="请选择">
                                <el-option v-for="item in singletypeData" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-input size="mini" v-model="singleValue" placeholder="请输入内容"></el-input>
                        </div>
                    </div>
                    <div class="searchItem lessonStatus">
                        <span>课程状态：</span>
                        <el-select size="mini" v-model="status" placeholder="请选择">
                            <el-option v-for="item in statusData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <el-button class="searchBtn" size="mini" @click="handleSearch" type="primary" plain>搜索</el-button>
            </div>
            <div class="table-wrapper">
                <el-table ref="multipleTable" v-loading="show" border :data="tableData.list" @selection-change="handleSelectionChange" tooltip-effect="dark" style="width: 100%">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column label="课程 ID" type="name" width="150">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.id }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="课程名称">
                        <template slot-scope="scope">{{ scope.row.title }}</template>
                    </el-table-column>
                    <el-table-column prop="timeLength" label="课时" width="120">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrapper">
                <el-pagination layout="total, prev, pager, next" :total="tableData.total" @current-change="handleChange">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="affirm" size="mini">确认关联</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getParams} from '@/config/utils'
    const ERR_OK = 10000
    export default {
      data() {
        return {
          dialogVisible: false,
          loading: false,
          singleValue: '', //搜索的条件值
          singletypeData: [
            {
              value: '1',
              label: '课程标题'
            },
            {
              value: '2',
              label: '课程编号'
            },
            {
              value: '3',
              label: '课程ID'
            },
            {
              value: '4',
              label: '教师'
            },
            {
              value: '5',
              label: '创建人'
            },
            {
              value: '6',
              label: '课程短标题'
            }
          ],
          singletype: '1', //课程类型
          status: '', //课程状态
          statusData: [
            {
              value: '0',
              label: '待审核'
            },
            {
              value: '1',
              label: '已上线'
            },
            {
              value: '2',
              label: '下线'
            },
            {
              value: '3',
              label: '关闭'
            }
          ],
          page: 1,
          pageSize: 10,
          tableData: [],
          selectData: [], //table选中数据
          show: false,
          parentId: '', //父id
          type: 1, //关联类型:1有父id，三层关联 2无父id,两层结构 3无父id，选中课程，只添加课件
          classId: [], //课程id
          netClassId: getParams('netClassId') //大纲所属的课程id
        }
      },
      created() {
        eventBus.$on('dialogVisible', (val, type) => {
          this.dialogVisible = val
          this.type = type
        })
        this.$on('isShow', (id, type) => {
          this.isShow()
          this.parentId = id
          this.type = type
        })
      },
      watch: {
        page() {
          this.searchData()
        }
      },
      computed:{
          userName(){
              return localStorage.getItem("userName") //localStorage.getItem("userName") 'htwx_3855101';
          },
          userId(){
              return localStorage.getItem("userId") //localStorage.getItem("userId") 842;
          }
      },
      methods: {
        // 确认关联
        affirm() {
          this.loading = true
          this._affirmData()
        },
        isShow() {
          this.dialogVisible = !this.dialogVisible
        },
        // 搜索
        handleSearch() {
          this.show = true
          this.searchData()
        },
        // 分页改变
        handleChange(e) {
          this.page = e
        },
        // 勾选table
        handleSelectionChange(val) {
          this.classId = []
          val.forEach(item => {
            this.classId.push(item.id)
          })
        },
        _affirmData() {
          if (this.classId.length === 0) {
            this.$message.warning('请选择要关联得课程！')
            return
          }
          this.myPost(`${PHP_URL}/v4/pc/syllabus/create_syllabus`, {
              classId: this.classId,
              netClassId: this.netClassId,
              parentId: this.parentId,
              type: this.type,
              userName:this.userName,//'htwx_3855101'
              userId:Number(this.userId)//842
          })
            .then(result => {
              this.loading = false
              this.dialogVisible = false
              // 点击关联之后清空数据
              this.tableData = []
              this.singleValue = ''
              this.singletype = ''
              this.status = ''
              this.classId = []
              this.parentId = ''
              this.type = ''
              this.page = 1
              if(result.code!=10000){
                 this.$message.warning(result.msg)
              }else{
                eventBus.$emit('updata')
                // this.$emit('update2')
              }
            })
            .catch(err => {
              this.loading = false
              this.dialogVisible = false
              // 点击关联之后清空数据
              this.tableData = []
              this.singleValue = ''
              this.singletype = ''
              this.status = ''
              this.classId = []
              this.parentId = ''
              this.type = ''
              ;(this.page = 1), this.$message.error(err.message)
            })
        },
        searchData() {
          this.myGet(`${PHP_URL}/v4/pc/syllabus/search_class`, {
            page: this.page,
            pageSize: this.pageSize,
            singleType: this.singletype,
            singleValue: this.singleValue,
            status: this.status
          })
            .then(result => {
              this.show = false
              if (result.code === ERR_OK) {
                this.tableData = result.data
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
    .dialog {
      .search-wrapper {
        display: flex;
        align-items: flex-start;

        .searchLeft {
          width: 70%;

          .searchItem {
            display: flex;
            align-items: center;

            .lessonInput {
              flex: 1;
              display: flex;

              .el-input {
                margin-left: 20px;
              }
            }

            span {
              display: block;
              width: 70px;
            }
          }

          .lessonStatus {
            margin-top: 15px;
          }
        }

        .searchBtn {
          margin-left: 20px;
        }
      }

      .table-wrapper {
        margin-top: 15px;
      }

      .pagination-wrapper {
        margin-top: 15px;
        display: flex;
        justify-content: center;
      }
    }
</style>
