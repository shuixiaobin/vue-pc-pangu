<template>
  <div class="selected-wrapper clearfix dragTable">
    <td-draggable element="el-table"
      :list="newSelectData"
      :data="newSelectData"
      :options="dragOptions"
      dragSelector="tbody"
      @end='endDrag'
      border>
      <!-- <el-table :data="newSelectData" style="width: 100%" border> -->
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
              <div class="stem"
                v-html="props.row.stem"></div>
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
            <div class="testItem1 clearfix">
              <b>难度：</b>
              <span class="difficult"
                :class="{
          'color1':props.row.difficult===2,
          'color2':props.row.difficult===4,
          'color3':props.row.difficult===6,
          'color4':props.row.difficult===8,
          'color5':props.row.difficult===10}">{{props.row.difficult | formatDifficult}}</span>
            </div>
            <div class="testItem1 clearfix">
              <b class="fl">题源：</b>
              <div class="fl">
                <div class="stem"
                  v-html="props.row.from"></div>
              </div>
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
      <el-table-column type="index"
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
        label="题源">
      </el-table-column> -->
      <el-table-column prop="meta"
        label="错误率"
        :formatter="formatPercents">
      </el-table-column>
      <el-table-column prop="meta.count"
        label="训练量">
      </el-table-column>
      <el-table-column prop="id"
        label="ID">
      </el-table-column>
      <el-table-column prop="pptIndex"
        label="PPT页数"
        width="130"
        v-if="isPractice==1&&courseType==2">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pptIndex"
            placeholder="请输入页数"
            @change="changePPTPage(scope.row.id,scope.row.pptIndex)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="handleJoin"
        label="操作"
        class-name="handleBtn">
        <template slot-scope="scope">
          <el-button-group v-for="(item, index) in scope.row.handleArr"
            :key="index">
            <el-button type="primary"
              plain
              size="mini"
              @click="cancel(scope,item.value)">
              {{item.text}}
              <i class="el-icon-caret-top"
                v-if="item.value === 1"></i>
              <i class="el-icon-caret-bottom"
                v-else-if="item.value === 2"></i>
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <!-- </el-table> -->
    </td-draggable>
  </div>
</template>

<script>
  import { getParams } from '@/config/utils'
  export default {
    props: {
      selectData: {
        type: Array,
        default: null
      },
      selectList: {
        type: Array,
        default() {
          return []
        }
      },
      // 用作判断是课后习题还是节点组件，以调取不同接口
      isFlag: {
        type: Boolean,
        default: true
      },
      //节点ID
      breakpointId: {
        type: Number
      }
    },
    data() {
      return {
        dragOptions: {
          draggable: '.el-table__row'
        },
        courseType: getParams('rouse'), //1：录播，2：直播 getParams("rouse")
        courseId: getParams('lessionId'), //课件id
        isPractice: getParams('isPractice'), //0: 课后作业，1：随堂练习 getParams("isPractice")
        url: '', //接口url
        newSelectData: []
      }
    },
    watch: {
      selectData(n, o) {
        this.newSelectData = n
      }
    },
    computed: {
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
      endDrag(data) {
        let arr = []
        let breakpointId = this.breakpointId
        // 当拖拽的索引相等时，直接返回
        if (data.newIndex === data.oldIndex) {
          return
        } else if (Math.abs(data.newIndex - data.oldIndex) === 1) {
          // 当拖拽的索引值为1时，互相交换sort值
          let newObj = {}
          let oldObj = {}
          newObj.questionId = this.newSelectData[data.newIndex].id
          newObj.sort = this.newSelectData[data.oldIndex].sort
          arr.push(newObj)
          oldObj.questionId = this.newSelectData[data.oldIndex].id
          oldObj.sort = this.newSelectData[data.newIndex].sort
          arr.push(oldObj)
        } else {
          this.selectData.forEach((item, index) => {
            let obj = {}
            obj.questionId = item.id
            obj.sort = index + 1
            arr.push(obj)
          })
        }
        // this.isFlag
        //   ? (this.url = `/pand/backend/courseExercises/changeSort/${this.courseType}/${this.courseId}`)
        //   : (this.url = `/pand/backend/courseBreakpointQuestion/changeSort/${breakpointId}`);

        if (this.isFlag) {
          if (this.isPractice == 1) {
            this.url = `/pand/backend/live/changeSort/${this.courseType}/${
              this.courseId
            }`
          } else {
            this.url = `/pand/backend/courseExercises/changeSort/${
              this.courseType
            }/${this.courseId}`
          }
        } else {
          this.url = `/pand/backend/courseBreakpointQuestion/changeSort/${breakpointId}`
        }
        this.modifyData(arr)
      },
      cancel(scope, index) {
        let data = [{}]
        data[0].questionId = scope.row.id
        let breakpointId = this.breakpointId
        switch (index) {
          // 上移题目
          case 1:
            let obj = {}
            data[0].sort = this.selectData[scope.$index - 1].sort
            obj.questionId = this.selectData[scope.$index - 1].id
            obj.sort = scope.row.sort
            data.push(obj)
            // this.isFlag? (this.url = `/pand/backend/courseExercises/changeSort/${this.courseType}/${this.courseId}`): (this.url = `/pand/backend/courseBreakpointQuestion/changeSort/${breakpointId}`);

            if (this.isFlag) {
              if (this.isPractice == 1) {
                this.url = `/pand/backend/live/changeSort/${this.courseType}/${
                  this.courseId
                }`
              } else {
                this.url = `/pand/backend/courseExercises/changeSort/${
                  this.courseType
                }/${this.courseId}`
              }
            } else {
              this.url = `/pand/backend/courseBreakpointQuestion/changeSort/${breakpointId}`
            }
            this.modifyData(data)
            break
          // 下降题目
          case 2:
            let obj2 = {}
            data[0].sort = this.selectData[scope.$index + 1].sort
            obj2.questionId = this.selectData[scope.$index + 1].id
            obj2.sort = scope.row.sort
            data.push(obj2)
            // this.isFlag? (this.url = `/pand/backend/courseExercises/changeSort/${this.courseType}/${this.courseId}`): (this.url = `/pand/backend/courseBreakpointQuestion/changeSort/${breakpointId}`);

            if (this.isFlag) {
              if (this.isPractice == 1) {
                this.url = `/pand/backend/live/changeSort/${this.courseType}/${
                  this.courseId
                }`
              } else {
                this.url = `/pand/backend/courseExercises/changeSort/${
                  this.courseType
                }/${this.courseId}`
              }
            } else {
              this.url = `/pand/backend/courseBreakpointQuestion/changeSort/${breakpointId}`
            }
            this.modifyData(data)
            break
          // 撤销题目
          case 3:
            // this.isFlag? (this.url = `/pand/backend/courseExercises/${this.courseType}/${this.courseId}`): (this.url = `/pand/backend/courseBreakpointQuestion/${breakpointId}`);

            if (this.isFlag) {
              if (this.isPractice == 1) {
                this.url = `/pand/backend/live/${this.courseType}/${
                  this.courseId
                }`
              } else {
                this.url = `/pand/backend/courseExercises/${this.courseType}/${
                  this.courseId
                }`
              }
            } else {
              this.url = `/pand/backend/courseBreakpointQuestion/${breakpointId}`
            }
            this.deleteSelect(scope.row.id)
          default:
            break
        }
      },
      // 切换习题顺序
      modifyData(data) {
        // this.myPost(`pand/backend/courseBreakpointQuestion/${this.courseType}/${this.courseId}`, {
        //   data
        // })
        this.myPost3(
          this.url,
          {
            data
          },
          {
            userId: this.userId
          }
        )
          .then(res => {
            this.$emit('update')
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      // 撤销已选习题
      deleteSelect(id) {
        // this.myDelete("/pand/backend/courseExercises/${this.courseType}/${this.courseId}", {
        this.myDelete1(
          this.url,
          {
            questionId: id
          },
          {
            userId: this.userId
          }
        )
          .then(res => {
            this.$emit('update')
            setTimeout(() => {
              eventBus.$emit('joinUpdate')
            }, 100)
          })
          .catch(err => {
            this.$message.error(err.msg)
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
      //更改ppt页数
      changePPTPage(id, page) {
        let pptid = ''
        this.selectList.forEach(item => {
          if (id == item.questionId) {
            pptid = item.id
          }
        })
        this.myPost2(
          `/pand/backend/live/${pptid}/editPPTIndex?pptIndex=${page}`,
          {},
          {
            userId: this.userId
          }
        )
          .then(result => {
            if (result.code == 1000000) {
              this.$message.success(result.message)
              this.$emit('update') //刷新列表
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
  .selected-wrapper {
    margin: 20px;
    padding-bottom: 20px;
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
        .stem {
          display: flex;
          align-items: center;
        }
        b {
          display: inline-block;
          width: 90px;
          text-align: right;
          color: #99a9bf;
          line-height: 2;
        }
        span {
          color: #606266;
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
    .handleBtn {
      .cell {
        display: flex;
        justify-content: space-between;
      }
      .el-button-group {
        button {
          padding: 5px;
        }
      }
    }
  }
</style>