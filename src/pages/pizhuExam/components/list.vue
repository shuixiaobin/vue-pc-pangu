<template>
  <div>
    <el-badge :value="selectNum"
      class="badgeItem"></el-badge>
    <el-tabs v-model="activeName"
      @tab-click="handleClick"
      type="border-card">
      <div class="side">
        <!-- <el-button type="success"
          @click="backStep">上一步</el-button> -->
        <el-button type="success"
          @click="leave">保存并返回列表</el-button>
      </div>
      <el-tab-pane label="未选题目"
        name="first">
        <div>
          <search-com @putSearch="putSearch"
            @clearNum="clearNum"
            :shenlunType="formData.type"
            class="searchHeader" />
          <el-table :data="tableData"
           tooltip-effect="dark"
            border @expand-change="setExpand"
            style="width: 100%">
            <el-table-column label="套题ID"
              prop="paperId"
              width="90">
            </el-table-column>
            <el-table-column label="试题ID"
              prop="questionId"
              width="90">
            </el-table-column>
            <el-table-column label="题干"
              prop="stem"
              width="400">
            </el-table-column>
            <el-table-column label="训练量"
              prop="answerCount"
              width="100">
            </el-table-column>
            <el-table-column label="来源"
              prop="source">
            </el-table-column>
            <el-table-column type="expand"
              label="展开/收起"
              prop="name"
              width="90">
              <template slot-scope="scope" >
                <div style="max-height:200px;overflow:auto">
                  <el-row class="expand">
                    <el-col :span="2">
                      <span>材料：</span>
                    </el-col>
                    <el-col :span="22">
                      <div v-for="(material,num) in scope.row.materials"
                        :key="num">
                        <p v-html="material"
                          class="content"> </p>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="expand">
                    <el-col :span="2">
                      <span>作答要求：</span>
                    </el-col>
                    <el-col :span="22">
                      <div v-for="(answer,num) in scope.row.answerRequire"
                        :key="num">
                        <p v-html="answer"
                          class="content"> </p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作"
              header-align="center"
              align="center">
              <template slot-scope="scope">
                <el-button size="small"
                  type="primary"
                  @click="beforeJoin(scope.row)"
                  class="serchLeft">加入</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination_box">
            <el-pagination @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="pageData.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageData.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageData.total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="已选题目"
        name="second">
        <i class="el-icon-question QuIcon"
          style="margin:5px;display:block;width:52px;height:18px;float:right;font-size:20px"
          v-popover:popover4></i>
        <el-table :data="selectedData"
          border @expand-change="setExpand"
          style="width: 100%">
          <el-table-column label="序号"
            prop="sort"
            width="90">
          </el-table-column>
          <el-table-column label="套题ID"
            prop="paperId"
            width="90">
          </el-table-column>
          <el-table-column label="试题ID"
            prop="questionId"
            width="90">
          </el-table-column>
          <el-table-column label="题干"
            prop="stem">
          </el-table-column>
          <el-table-column label="训练量"
            prop="answerCount"
            width="100">
          </el-table-column>
          <el-table-column label="来源"
            prop="source"
            width="200">
          </el-table-column>
          <el-table-column type="expand"
            label="展开/收起"
            prop="name"
            width="90"
            style="max-height:50px;">
            <template slot-scope="scope">
              <div style="max-height:200px;overflow:auto">
                <el-row class="expand">
                  <el-col :span="2">
                    <span>材料：</span>
                  </el-col>
                  <el-col :span="22">
                    <div v-for="(material,num) in scope.row.materials"
                      :key="num">
                      <span>{{num+1}}、</span>
                      <p v-html="material"
                        class="content"> </p>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="expand">
                  <el-col :span="2">
                    <span>作答要求：</span>
                  </el-col>
                  <el-col :span="22">
                    <div v-for="(answer,num) in scope.row.answerRequire"
                      :key="num">
                      <span>{{num+1}}、</span>
                      <p v-html="answer"
                        class="content"> </p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单次批改费用（元/次）"
            prop="correctPrice"
            width="180">
            <!-- <template slot-scope="scope">
              <el-input v-model="selectedData[scope.$index].correctPrice"
                @blur="editItem(scope.row,scope.$index)"
                placeholder="请输入内容"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column label="操作"
            header-align="center"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button size="small"
                type="primary"
                style="width:50px"
                @click="deleteRow(scope.row)"
                class="serchLeft">撤销</el-button>
              <el-button size="small"
                v-if="!fullFlag && scope.$index >0"
                type="primary"
                style="width:50px"
                @click="moveRow('up',scope)"
                class="serchLeft">上移</el-button>
              <el-button size="small"
                v-if="!fullFlag && scope.$index != (selectNum-1)"
                type="primary"
                style="width:50px"
                @click="moveRow('down',scope)"
                class="serchLeft">下移</el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-popover style="float:right"
          placement="bottom"
          width="400"
          trigger="hover"
          ref="popover4">
          <div>
            <p>单次批改费用：批改此题一次需要付费的内容，用于退转班扣除费用合算。</p>
            <p>修改批注价格，需撤销题目重新加入时修改。</p>
          </div>
        </el-popover>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="设置价格" width="40%"
      :visible.sync="dialogFormVisible">
      <el-form :model="formInline"
        class="demo-form-inline">
        <el-form-item label="批注类型:">
          <el-radio-group v-model="setPriceType" style="margin-right:20px;">
            <el-radio :label="1" disabled>智能批注</el-radio>
            <el-radio :label="2" disabled>人工批注</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单次批注费用(元/次):" >
          <el-input v-model="setPrice" style="width:200px"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary"
          @click="joinItem">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

//根据已选题目的类型，同步到未选题目列表查询的是单题还是套题
//套题只允许加入一套。
<script>
  import searchCom from './serch.vue'
  import { unSelectedList, choosedList, join, editList, deleteItem } from '../servers/index.js'
  import { getParams,parseQueryString } from '@/config/utils'
  export default {
    data() {
      return {
        activeName: 'first',
        dialogFormVisible: false,
        formInline:{},
        setPrice:'',
        setPriceType:2,
        formData: {
          type: 0, //行测或者申论啊。
          year: '',
          areaId: '',
          searchType: '',
          questionType: '',
          searchContent: '',
          page: 1
        },
        pageData: {
          page: 1,
          size: 10,
          total: 0
        },
        tableData: [
          {
            //未选
            id: '12987122',
            name: '好滋好味鸡蛋仔',
            category: '江浙小吃、小吃零食',
            desc: '荷兰优质淡奶，奶香浓而不腻',
            address: '上海市普陀区真北路',
            shop: '王小虎夫妻店',
            shopId: '10333'
          }
        ],
        selectedData: [
          {
            //未选
            id: '12987122',
            name: 'jdd的地方',
            category: 'jdd的地方',
            desc: '112',
            address: '反反复复烦烦烦',
            shop: 'i哦解决方法',
            shopId: '10333'
          }
        ],
        fullFlag: false,
        selectNum: 0,
        editRow:{},
      }
    },
    props: {
      pizhu: {
        type: Number,
        default () {
          return 2
        }
      }
    },
    components: {
      searchCom
    },
    created() {
      this.setPriceType = this.pizhu;
      this.initList() //根据已选题目的类型，同步到未选题目列表查询的是单题还是套题
    },
    //单题0
    //套题1
    methods: {
      putSearch(data) {
        console.log(data)
        Object.assign(this.formData, data)
        this.formData.type = Number(this.formData.type)
        this.formData.questionType = [].concat(this.formData.questionType).pop()
        this.formData.page = 1
        if(data.searchContent && (data.searchType ==1 || data.searchType ==3) && !/^\d+$/.test(data.searchContent) ){
          this.$message({
            type: 'error ',
            message: '查询题目id非法!'
          })
          return;
        }
        this.getList()
      },
      // 改变显示数目
      sizeChange(val) {
        this.formData.size = this.pageData.size = val
        this.formData.page = this.pageData.page = 1
        this.getList()
      },
      pageChange(val) {
        this.formData.page = val
        this.getList()
      },
      initList() {
        choosedList({
          courseWareId: getParams('lessionId'),
          courseType: getParams('rouse')
        }).then(res => {
            this.formData.type = res.data && res.data.length > 0 ? res.data[0].exerciseType : 0
            this.fullFlag = res.data && res.data.length > 0 ? !!res.data[0].exerciseType : false
            this.selectNum = res.data.length
            return unSelectedList(this.formData)
          })
          .then(response => {
            this.tableData = response.data.result
            this.pageData.total = response.data.total
          })
          .catch(err => {})
      },
      getList() {
        unSelectedList(this.formData)
          .then(res => {
            this.tableData = res.data.result
            this.pageData.total = res.data.total
          })
          .catch(err => {})
      },
      getSelected() {
        //已选列表
        choosedList({
          courseWareId: getParams('lessionId'),
          courseType: getParams('rouse')
        })
          .then(res => {
            if (res.data && res.data.length > 0 && res.data[0].exerciseType) {
              //套题只允许加入一套
              this.fullFlag = true
            } else {
              this.fullFlag = false
            }
            this.selectNum = res.data.length
            this.selectedData = res.data.map(item => {
              return { correctPrice: '', ...item }
            })
          })
          .catch(err => {
            this.fullFlag = false
          })
      },
      handleClick(tab, event) {
        this.getSelected()
      },
      beforeJoin(row){    
        if (this.fullFlag) {//加入
          this.$message({
            type: 'error ',
            message: '课后作业套题只允许添加一套，如需更改请先移除已选套题!'
          })
          return
        }
        this.dialogFormVisible=true;
        this.editRow =row;
      },
      joinItem() {
          const reg =/^[0-9]\d*\.?\d{0,1}$/
          if(!reg.test(this.setPrice)) {
              this.$message.error('金额不合法！')
              this.setPrice='';
              return;
          };
        join({
          correctPrice:this.setPrice,
          correctMode: this.setPriceType,
          courseType: getParams('rouse'),
          courseWareId: getParams('lessionId'),
          paperOrQuestionId: this.editRow.exerciseType > 0 ? this.editRow.paperId : this.editRow.questionId,
          type: this.editRow.exerciseType
        })
          .then(res => {
            if (res.code == 1000000) {
              this.$message({
                type: 'success',
                message: '加入成功!'
              })
              this.dialogFormVisible = false;
              this.getSelected();
              this.activeName ='second';
              this.setPrice='';
            } else {
              this.$message({
                type: 'warnig',
                message: res.message
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'warnig',
              message: err.message
            })
          })
      },
      cancelDialog(){
        this.dialogFormVisible = false;
        this.setPrice='';
      },
      // editItem(row, index) {//编辑价格
      //   const reg =/^[0-9]\d*\.?\d{0,2}$/
      //     if(!reg.test(this.selectedData[index].correctPrice)) {
      //         this.$message.error('金额不合法！')
      //         return
      //     };
      //   editList({
      //     correctPrice: this.selectedData[index].correctPrice,
      //     id: row.id,
      //     sort: row.sort
      //   }).then(res => {
      //     if (res.code == 1000000) {
      //       this.$message({
      //         type: 'success',
      //         message: '修改成功!'
      //       })
      //       this.getSelected()
      //     } else {
      //       this.$message({
      //         type: 'warnig',
      //         message: res.message
      //       })
      //     }
      //   })
      // },
      deleteRow(row) {
        //撤销
        deleteItem(row.id).then(res => {
          if (res.code == 1000000) {
            this.$message({
              type: 'success',
              message: '撤销成功!'
            })
            this.getSelected()
          } else {
            this.$message({
              type: 'warnig',
              message: res.message
            })
          }
        })
      },
      moveRow(flag, obj) {
        //上移、下移动
        let ohter
        if (flag == 'up') {
          ohter = this.selectedData[obj.$index - 1]
        } else {
          ohter = this.selectedData[obj.$index + 1]
        }
        Promise.all([
          editList({
            // correctPrice: obj.row.correctPrice,
            id: obj.row.id,
            sort: flag == 'up' ? obj.row.sort - 1 : obj.row.sort + 1
          }),
          editList({
            // correctPrice: ohter.correctPrice,
            id: ohter.id,
            sort: obj.row.sort
          })
        ]).then(res => {
          if (res[0].code == 1000000 && res[1].code == 1000000) {
            this.getSelected()
          }
        })
      },
      clearNum() {
        this.selectNum = 0;
        this.fullFlag =false;
      },
      leave() {
        window.history.go(-1);
      },
      // backStep(){
      //   this.$emit('backStep')
      // },
      setExpand(v,ed){
        if(ed.length>1){ed.shift()}
      }
    }
  }
</script>


<style scoped lang='less'>
  .content {
    display: inline-block;
  }
  .expand {
    margin-bottom: 20px;
    span {
      font-weight: bold;
      font-family: PingFangSC-Medium, Microsoft YaHei;
      font-size: 16px;
    }
    p {
      color: #4a4a4a;
      font-family: PingFangSC-Medium, Microsoft YaHei;
      font-size: 16px;
      line-height: 20px;
    }
  }
</style>

<style>
  .badgeItem {
    position: absolute;
    left: 210px;
    z-index: 99999;
  }
  .el-tabs__item {
    height: 50px;
    line-height: 60px;
    font-size: 20px;
  }
  .side {
    position: absolute;
    right: 30px;
    top: -40px;
    z-index: 9999;
  }
  .el-tabs__content {
    overflow: visible;
  }
  .el-table__expanded-cell{
    max-height: 50px;
  }
  
  .el-radio__input.is-checked .el-radio__inner::after{
    transform: translate(-50%,-50%) scale(2);
  }

</style>
