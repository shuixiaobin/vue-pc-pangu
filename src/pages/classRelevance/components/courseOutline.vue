<template>
  <div class="table-content">
    <td-draggable element="el-table"
      :list="TableDate"
      :data="TableDate"
      :options="dragOptions"
      dragSelector="tbody"
      border>
      <!-- <el-table :data="TableDate" border> -->
      <el-table-column label="课程 ID/课件 ID/直播 ID"
        width="100">
        <template slot-scope="scope">
          <span v-if="(scope.row.type==1||scope.row.type==0)&&scope.row.class_id!=0">
            {{ scope.row.class_id }}
          </span>
          <span v-if="scope.row.courseware_id!=0&&scope.row.video_type!=2">
            {{ scope.row.courseware_id }}
          </span>
          <span v-if="scope.row.video_type==2">
            {{ scope.row.courseware_id }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label=""
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.courseware_id!=0&&scope.row.video_type!=2">
            {{ scope.row.courseware_id }}
          </span>
        </template>
      </el-table-column>-->
      <el-table-column label="课件类型"
        width="100">
        <template slot-scope="scope">
          {{ scope.row.type_name }}
        </template>
      </el-table-column>
      <el-table-column label="课程大纲">
        <template slot-scope="scope">
          <div>
            <span v-for="(space, levelIndex) in scope.row._level"
              :key="levelIndex"
              class="ms-tree-space"></span>
            <span class="button is-outlined is-primary is-small"
              v-if="toggleIconShow(scope.row)"
              @click="toggle(scope.row)">
              <i v-if="!scope.row._expanded"
                class="el-icon-arrow-right"
                aria-hidden="true"></i>
              <i v-if="scope.row._expanded"
                class="el-icon-arrow-down"
                aria-hidden="true"></i>
            </span>
            <span v-else
              class="ms-tree-space"></span>
            <span :title="scope.row.name">
              {{ scope.row.name }}
            </span>
            <div v-if="scope.row.type==1"
              style="margin-left:40px;margin-top:10px">
              <el-button type="success"
                size="mini">{{ scope.row.course_status }}</el-button>
              <span style="margin-left:20px">课件进度：{{ scope.row.lesson_num }} / {{ scope.row.lesson_count }}</span>
              <span style="margin-left:20px">分校：{{ scope.row.fen_xiao }}</span>
              <span style="margin-left:20px">原价/实际价格：{{ scope.row.price }}/{{scope.row.actual_price}}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="课时"
        width="80"
        prop="class_hour">
      </el-table-column>
      <el-table-column label="服务配置"
        width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.has_switch===1">
            学习报告
            <el-switch v-model="scope.row.switch_status"
              active-color="#13ce66"
              inactive-color="#f0f0f0"
              @change="switchChang(scope.row)">
            </el-switch>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="是否显示试听"
        width="60"
        v-if="isFlag!==2">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.trial_switch===1"
            v-model="scope.row.trial_display"
            active-color="#13ce66"
            inactive-color="#f0f0f0"
            @change="trialChang(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"
        width="500"
        type="sex">
        <template slot-scope="scope">
          <div>
            {{scope.row.path |readPath}}
            <span v-show="false"> {{scope.row.pathWrite =writePath(scope.row.path)}}</span>
            <input v-model="scope.row.pathWrite"
              @blur="changeSort(scope.row)"
              type="text"
              placeholder="课件序号"
              style="width:50px;height: 28px; vertical-align: middle;text-align: center;margin-right:5px">
            <el-button type="primary"
              size="mini"
              @click="handleMove(scope.row,1)"
              v-if="scope.row.move===2||scope.row.move===3"
              icon="el-icon-arrow-up"
              plain>上移</el-button>
            <el-button type="primary"
              size="mini"
              @click="handleMove(scope.row,2)"
              v-if="scope.row.move===2||scope.row.move===1"
              icon="el-icon-arrow-down"
              plain>下移</el-button>
            <el-button type="primary"
              size="mini"
              v-if="(isFlag===0||isFlag===1)&&scope.row.type===1"
              @click="handleExamDialogShow(scope.row.id)"
              plain>关联测试</el-button>
            <el-button type="primary"
              size="mini"
              v-if="scope.row.isGL"
              @click="relevance(scope.row.id)"
              plain>关联课程</el-button>
            <el-button type="primary"
              size="mini"
              v-if="scope.row.video_type!=4"
              @click="handleAmend(scope.row.id, scope.row.name, scope.row)"
              plain>修改</el-button>
            <el-button type="primary"
              size="mini"
              @click="handleDelete(scope.row)"
              plain>删除</el-button>
          </div>
        </template>
      </el-table-column>
      <!-- </el-table> -->
    </td-draggable>
    <relevance-dialog ref="handleChange" @update2="emitUpdate2"></relevance-dialog>
    <exam-dialog ref="examDialogShow" @update2="emitUpdate2"></exam-dialog>
  </div>
</template>

<script>
  import { removeByValue, getParams } from '@/config/utils'
  const ERR_OK = 10000
  import relevanceDialog from '@/pages/classRelevance/components/relevanceDialog'
  import examDialog from './examDialog'

  export default {
    props: {
      dataSource: {
        type: [Object, Array],
        default: null
      },
      isFlag: {
        type: Number,
        default: null
      }
    },
    name: 'TreeGrid',
    components: {
      relevanceDialog,
      examDialog
    },
    data() {
      return {
        //表格拖拽
        dragOptions: {
          draggable: '.el-table__row',
          disabled: true
        },
        TableDate: [],
        isShow: false, //控制dialog关联课程框
        netClassId: getParams('netClassId'), //大纲所属的课程id
        nodeId: '', //节点id
        oldNum: '', //当前阶段顺序号
        newNum: '', //新顺序号
        parentId: '', //父节点
        isSuit: getParams('isSuit') //是否是套餐课
      }
    },
    computed: {
      allData() {
        let newData = JSON.parse(JSON.stringify(this.dataSource))
        this.TableDate = newData
        //console.log(newData);
        return newData
      },
      userName() {
        // return 'htwx_3855101'
        return localStorage.getItem('userName') //localStorage.getItem("userName") 'htwx_3855101';
      },
      userId() {
        // return 842
        return localStorage.getItem('userId') //localStorage.getItem("userId") 842;
      }
    },
    watch: {
      allData(val) {
        //this.TableDate = JSON.parse(JSON.stringify(val));
      }
    },
    methods: {
      emitUpdate2 () {
        this.$emit('update2', this.getSpreadState())
      },
      // 关联测试
      handleExamDialogShow(id) {
        this.$refs.examDialogShow.isShow(id)
      },
      // switch切换
      switchChang(row) {
        let status
        if (row.switch_status) {
          status = 1
        } else {
          status = 0
        }
        this.myPost(`${PHP_URL}/v5/pc/syllabus/study_report_switch`, {
          status: status,
          syllabusId: row.id
        })
          .then(res => {
            if (res.code === 10000) {
              // this.$emit('updata', row)
              this.emitUpdate2()
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      trialChang(row) {
        let status
        if (row.trial_display) {
          status = 1
        } else {
          status = 0
        }
        this.myPost(`${PHP_URL}/v5/pc/syllabus/trial_switch`, {
          status: status,
          syllabusId: row.id,
          netClassId: this.netClassId
        })
          .then(res => {
            if (res.code === 10000) {
              // this.$emit('updata', row)
              this.emitUpdate2()
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },

      // 上移
      handleMove(row, type) {
        this.nodeId = row.id
        this.oldNum = row.serial_number
        this.parentId = row.parent_id
        this._moveMethod(type, row)
      },
      // 移动方法
      _moveMethod(type, row) {
        this.myPost(`${PHP_URL}/v4/pc/syllabus/update_syllabus_sort`, {
          netClassId: this.netClassId,
          nodeId: this.nodeId,
          oldNum: this.oldNum,
          parentId: this.parentId,
          type: type,
          userName: this.userName, //'htwx_3855101'
          userId: Number(this.userId) //842
        })
          .then(result => {
            if (result.code === ERR_OK) {
              // this.$emit('updata', row)
              this.emitUpdate2()
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      // 关联课程
      relevance(id) {
        console.log(id)
        this.$refs.handleChange.$emit('isShow', id, 1)
      },
      //课件按序号排序
      changeSort(obj) {
        console.log(obj)
        this.myPost(`${PHP_URL}/v4/pc/syllabus/move_sort`, {
          id: obj.id,
          netClassId: this.netClassId,
          newNum: obj.pathWrite,
          userName: this.userName, //'htwx_3855101'
          userId: Number(this.userId) //842
        })
          .then(res => {
            if (res.code === 10000) {
              // this.$emit('updata', obj)
              this.emitUpdate2()
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      // 修改
      handleAmend(id, name) {
        this.$prompt('请输入名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: name
        })
          .then(({ value }) => {
            this.amendMethods(value, id)
          })
          .catch(err => {
            console.log(err)
          })
      },
      // 修改节点名称
      amendMethods(name, id) {
        this.myPost(`${PHP_URL}/v4/pc/syllabus/update_syllabus_name`, {
          name: name,
          syllabusId: id,
          userName: this.userName, //'htwx_3855101'
          userId: Number(this.userId) //842
        })
          .then(result => {
            if (result.code === ERR_OK) {
              // this.$emit('update')
              this.emitUpdate2()
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      getSpreadState () {
        return this.TableDate.filter(item => item._expanded).map(item => item.id)
      },
      //删除操作
      handleDelete(row) {
        this.$confirm('此操作将永久不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.myPost(`${PHP_URL}/v4/pc/syllabus/del_syllabus`, {
              syllabusId: row.id,
              userName: this.userName, //'htwx_3855101'
              userId: Number(this.userId) //842
            })
              .then(result => {
                if (result.code === ERR_OK) {
                  // this.$emit('updata')
                  this.emitUpdate2()
                }
              })
              .catch(err => {
                this.$message.error(err.message)
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      },
      toggleIconShow(record) {
        /**
         * 点击展开和关闭的时候，图标的切换
         */
        if (record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      toggle(rowData) {
        //console.log(rowData)
        let childLen = rowData.children.length
        if (rowData._expanded) {
          /**
           * 1.将当前数据放在dataArr中，
           * 2.获取当前数据的children元素的唯一标识
           * 3.把展开时修改后的数据遍历对比，删除需要删除的元素
           */
          let dataArr = []
          dataArr.push(rowData)
          let arr = this.getChildFlowId(dataArr, [])
          for (let i = 0; i < childLen; i++) {
            if (rowData.children[i].children) {
              for (
                let index = 0;
                index < rowData.children[i].children.length;
                index++
              ) {
                this.TableDate.map(value => {
                  if (arr.indexOf(value.parent_id) > -1) {
                    removeByValue(this.TableDate, value)
                  }
                })
              }
            }

            this.TableDate.map(value => {
              if (arr.indexOf(value.parent_id) > -1) {
                removeByValue(this.TableDate, value)
              }
            })
          }
        } else {
          /**
           * index为获取当前数据在tableData中的索引。
           * pre为当前点击元素之前的数据。
           * last为当前点击元素之后的数据。
           * concatChildren是把pre和当前数据的子数据组合成一个数据，最后再和last合并成一个数组
           */
          rowData.children = this.setSpaceIcon(rowData.children, rowData._level)
          let index = this.TableDate.indexOf(rowData)
          let pre = this.TableDate.slice(0, index + 1)
          let last = this.TableDate.slice(index + 1)
          let concatChildren = pre.concat(rowData.children)
          this.TableDate = concatChildren.concat(last)
        }
        rowData._expanded = !rowData._expanded
      },
      getChildFlowId(data, emptyArr) {
        // 获取子级的flowId
        Array.from(data).forEach(record => {
          emptyArr.push(record.id)
          if (record.children && record.children.length > 0) {
            let childFlowIdArr = this.getChildFlowId(record.children, emptyArr)
            emptyArr.concat(childFlowIdArr)
          }
        })
        return emptyArr
      },
      setSpaceIcon(data, level) {
        // 设置第一列的空格和方向按钮
        let _level = 0
        data.forEach(value => {
          value._expanded = false
          if (level !== undefined && level !== null) {
            _level = level + 1
          } else {
            _level = 1
          }
          value._level = _level
          if (value.children && value.children.length > 0) {
            this.setSpaceIcon(value.children, _level)
          }
        })
        return data
      },
      writePath: function(value) {
        if (!value) return ''
        var result = []
        result = value.toString().split(',')
        return result[result.length - 1]
      }
    },
    filters: {
      readPath: function(value) {
        if (!value) return ''
        var d,
          result = []
        result = value.toString().split(',')
        if (result.length == 1) {
          d = ''
        } else if (result.length == 2) {
          d = result[0] + '—'
        } else if (result.length == 3) {
          d = result[0] + '—' + result[1] + '—'
        }
        return d
      }
    }
  }
</script>
<style lang="less" scoped>
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: '';
  }
</style>
