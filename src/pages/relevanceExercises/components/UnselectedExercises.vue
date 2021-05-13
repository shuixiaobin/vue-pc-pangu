<template>
  <div class="unselected"
    v-loading="loading">
    <el-table :data="newTableData"
      style="width: 100%"
      border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="testDetail"
            v-if="props.row.type === 105">
            <div class="testItem">
              <b>材料：</b>
              <div v-html="props.row.stem"></div>
            </div>

          </div>
          <div class="testDetail"
            v-else>
            <div class="testItem">
              <b>题干：</b>
              <div v-html="props.row.stem"></div>
            </div>
            <div class="testItem1 clearfix">
              <b class="fl">选项：</b>
              <div class="fl">
                <div class="choice"
                  v-for="(item, index) in props.row.choices"
                  :key="index"
                  v-html="fitlteChoice(item,index)"></div>
              </div>
            </div>
            <div class="testItem">
              <b>难度：</b>
              <span class="difficult"
                :class="{
          'color1':props.row.difficult===2,
          'color2':props.row.difficult===4,
          'color3':props.row.difficult===6,
          'color4':props.row.difficult===8,
          'color5':props.row.difficult===10}">{{props.row.difficult | formatDifficult}}</span>
            </div>
            <div class="testItem">
              <b>题源：</b>
              <span class="analysis"
                v-html="props.row.from"></span>
            </div>
            <div class="testItem">
              <b>解析：</b>
              <span class="analysis"
                v-html="props.row.analysis"></span>
            </div>
            <div class="testItem">
              <b>答案：</b>
              <span>{{props.row.answer | filterAnswer}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="index"
        width="50"
        label="序号">
      </el-table-column>
      <el-table-column prop="stem"
        label="题干"
        width="400">
        <template slot-scope="scope">
          <div v-html="scope.row.stem"></div>
        </template>
      </el-table-column>
      <el-table-column prop="type"
        label="题型">
        <template slot-scope="scope">
          <div class="type">{{scope.row.type | formatQuestionType}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="difficult"
        label="难度">
        <template slot-scope="scope">
          <div class="difficult"
            :class="{
          'color1':scope.row.difficult===2,
          'color2':scope.row.difficult===4,
          'color3':scope.row.difficult===6,
          'color4':scope.row.difficult===8,
          'color5':scope.row.difficult===10}">{{scope.row.difficult | formatDifficult}}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="pointsName"
        label="知识点"
        :formatter="formatPoints">
      </el-table-column>
      <!-- <el-table-column prop="from"
        width="400"
        label="题源"> -->
      </el-table-column>
      <el-table-column prop="meta"
        label="准确率"
        :formatter="formatPercents">
      </el-table-column>
      <el-table-column prop="meta.count"
        label="训练量">
      </el-table-column>
      <el-table-column prop="id"
        label="ID">
      </el-table-column>
      <el-table-column prop="handleJoin"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
            @click="join(scope.row.id)"
            :disabled="!flag"
            v-if="scope.row.handleJoin"
            plain
            size="mini">{{scope.row.handleJoin}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-contianer">
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pageSizeArr"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getParams, debounce } from '@/config/utils'
  export default {
    props: {
      lastSort: {
        type: Number,
        default: 0
      },
      // 用作判断是课后习题还是节点组件，以调取不同接口
      isFlag: {
        type: Boolean,
        default: true
      },
      //节点ID
      breakpointId: {
        type: Number
      },
      //
      addList: {
        type: Array
      }
    },
    data() {
      return {
        tableData: {
          result: []
        },
        pageSizeArr: [10, 20, 40, 50],
        pageSize: 20,
        loading: false,
        courseType: getParams('rouse'), //1：录播，2：直播
        courseId: getParams('lessionId'), //课件id
        isPractice: getParams('isPractice'), //0: 课后作业，1：随堂练习 getParams("isPractice")
        flag: true //限制加入多次点击
      }
    },
    created() {
      eventBus.$on('loading', res => {
        this.loading = true
      })
      eventBus.$on('tableData', data => {
        this.loading = false
        this.tableData = data
      })
    },
    computed: {
      // 将复合题二维数组转化成一维数组，并把复合题的资料字段material赋值给题干字段stem
      newTableData() {
        let newArr = []
        if (this.tableData) {
          this.tableData.result.forEach(function(item, i) {
            item.index = i + 1
            newArr.push(item)
            if (item.childrens) {
              item.childrens.forEach(function(every, j) {
                every.index = `${i + 1}-${j + 1}`
                newArr.push(every)
              })
            }
          })
          newArr.forEach(function(item) {
            if (item.type === 105) {
              item.stem = item.material
            } else {
              item.handleJoin = '加入'
            }
          })
          return newArr
        }
      },
      userId() {
        return localStorage.getItem('userId') //localStorage.getItem("userId") 842;
      }
    },
    filters: {
      // 格式化题型
      formatQuestionType(val) {
        let str = ''
        switch (val) {
          case 99:
            str = '单选题'
            break
          case 101:
            str = '不定项选择'
            break
          case 100:
            str = '多选题'
            break
          case 109:
            str = '对错题'
            break
          case 105:
            str = '复合题'
            break
          case 106:
            str = '单一题'
            break
          default:
            str = '未知题型'
            break
        }
        return str
      },
      // 格式化难度
      formatDifficult(val) {
        let str = ''
        switch (val) {
          case 2:
            str = '容易'
            break
          case 4:
            str = '较易'
            break
          case 6:
            str = '一般'
            break
          case 8:
            str = '较难'
            break
          case 10:
            str = '困难'
            break
          default:
            break
        }
        return str
      },
      // 格式化答案
      filterAnswer(val) {
        let str = ''
        switch (val) {
          case 1:
            str = 'A'
            break
          case 2:
            str = 'B'
            break
          case 3:
            str = 'C'
            break
          case 4:
            str = 'D'
            break
          default:
            str = '暂无'
            break
        }
        return str
      }
    },
    methods: {
      join(id) {
        if (this.isFlag) {
          if (this.isPractice == 1) {
            this.joinSelect(id, '/pand/backend/live/edit')
          } else {
            this.joinSelect(id, '/pand/backend/courseExercises/edit')
          }
        } else {
          if (this.addList.length > 0 && this.breakpointId > 0) {
            this.joinSelect(id, '/pand/backend/courseBreakpointQuestion/edit')
          } else {
            this.$message.error('请添加节点在添加试题')
          }
        }
        // if (this.flag) {
        //   this.flag = false;
        //   let url;
        //   this.isFlag
        //     ? (url = "/pand/backend/courseExercises/edit")
        //     : (url = "/pand/backend/courseBreakpointQuestion/edit");
        //   this.$message.error('请添加节点在添加试题');
        //   this.joinSelect(id, url);
        // } else {
        //   return false;
        // }
      },
      // 加入已选习题
      joinSelect(id, url) {
        this.myPost2(
          url,
          {
            courseId: this.courseId || null,
            courseType: this.courseType || null,
            questionId: id,
            sort: this.lastSort + 1,
            breakpointId: this.breakpointId || null //断点id
          },
          {
            userId: this.userId
          }
        )
          .then(res => {
            this.$emit('joinUpdate')
            // 因为在加入到已选习题中，未选习题接口数据还没更新，所以延迟100ms，确保已更新再请求未选习题接口
            setTimeout(() => {
              eventBus.$emit('joinUpdate')
              this.flag = true
            }, 100)
          })
          .catch(err => {
            console.log(err)
            this.flag = true
            this.$message.error(err.message)
          })
      },
      // 格式化选项
      fitlteChoice(item, index) {
        let choice = ''
        switch (index) {
          case 0:
            choice = 'A、' + item
            break
          case 1:
            choice = 'B、' + item
            break
          case 2:
            choice = 'C、' + item
            break
          case 3:
            choice = 'D、' + item
            break
          default:
            break
        }
        return choice
      },
      // 格式化知识点
      formatPoints(row, column) {
        return row.pointsName ? row.pointsName.join(',') : ''
      },
      // 格式化准确率
      formatPercents(row, column) {
        return row.meta ? row.meta.percents[row.meta.rindex] + '%' : ''
      },
      handleSizeChange(val) {
        eventBus.$emit('size', val)
      },
      handleCurrentChange(page) {
        eventBus.$emit('currentPage', page)
      }
    }
  }
</script>
<style  scoped lang="less">
  .unselected {
    margin: 20px;
    padding-bottom: 20px;
    .pagination-contianer {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .type {
      color: #65c99c;
    }
    .difficult {
      width: 50px;
      color: #fff;
      text-align: center;
      border-radius: 4px;
      &.color1 {
        background: #66c99c;
      }
      &.color2 {
        background: #63cafa;
      }
      &.color3 {
        background: #f8cd46;
      }
      &.color4 {
        background: #ee6f2d;
      }
      &.color5 {
        background: #bc261a;
      }
    }
    .testDetail {
      .choices {
        display: block;
      }
      .testItem {
        display: flex;
        margin-top: 10px;
        .analysis {
          flex: 1;
        }
        b {
          display: inline-block;
          width: 90px;
          text-align: right;
          color: #99a9bf;
          line-height: 2;
        }
        span {
          //color: #606266;
          line-height: 2;
        }
      }
      .testItem1 {
        margin-top: 10px;
        b {
          display: inline-block;
          width: 90px;
          text-align: right;
          color: #99a9bf;
        }
        .choice {
          display: flex;
        }
      }
    }
    .el-table {
      .el-table__expand-icon::after {
        content: '展开';
        color: #409eff;
        cursor: pointer;
      }
      .el-table__expand-icon > i {
        display: none !important;
      }
      .el-table__expand-icon--expanded {
        transform: rotate(0deg) !important;
        &::after {
          content: '收起';
        }
      }
    }
  }
</style>