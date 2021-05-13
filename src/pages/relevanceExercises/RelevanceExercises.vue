<template>
  <div class="relevanceExercises">
    <div class="main-contianer">
      <div class="box-header with-border">
        <h3 class="box-title">筛选条件</h3>
        <el-button type="success" @click="goBack" size="small" style="float:right;margin-right:20px;">返回列表</el-button>
      </div>
      <search :ids="ids"></search>
    </div>
    <div class="main-contianer">
      <div class="box-header with-border">
        <h3 class="box-title">已选习题</h3>
      </div>
      <selected-exercises :isFlag="true"
        :selectData="selectData"
        :selectList="selectList"
        @update="update"></selected-exercises>
    </div>
    <div class="main-contianer">
      <div class="box-header with-border">
        <h3 class="box-title">未选习题</h3>
      </div>
      <unselected-exercises :isFlag="true"
        v-if="selectData.length>0"
        :lastSort="selectData[selectData.length-1].sort"
        @joinUpdate="joinUpdate"></unselected-exercises>
      <unselected-exercises :isFlag="true"
        v-else
        @joinUpdate="joinUpdate"></unselected-exercises>
    </div>
  </div>
</template>

<script>
  import search from '@/pages/relevanceExercises/components/Search'
  import selectedExercises from '@/pages/relevanceExercises/components/SelectedExercises'
  import unselectedExercises from '@/pages/relevanceExercises/components/UnselectedExercises'
  import { getParams } from '@/config/utils'
  export default {
    data() {
      return {
        selectData: [], //已选试题
        ids: '',
        selectList: [],
        courseType: getParams('rouse'), //1：录播，2：直播 getParams("rouse")
        courseId: getParams('lessionId'), //课件id
        isPractice: getParams('isPractice') //0: 课后作业，1：随堂练习 getParams("isPractice")
      }
    },
    components: {
      search,
      selectedExercises,
      unselectedExercises
    },
    created() {
      this.getSelectData()
    },
    computed: {},

    methods: {
      // 切换题目监听事件
      update() {
        this.getSelectData()
      },
      // 加入题目监听事件
      joinUpdate() {
        this.getSelectData()
      },
      // 获取已选习题数据
      getSelectData() {
        let url =
          this.courseType == 2 && this.isPractice == 1
            ? `/pand/backend/live/${this.courseType}/${this.courseId}`
            : `/pand/backend/courseExercises/${this.courseType}/${this.courseId}`
        this.myGet(url)
          //this.myGet("/pand/backend/courseExercises/1/938110")
          .then(result => {
            this.selectList = result.data
            let questionIdArr = []
            result.data.forEach(item => {
              questionIdArr.push(item.questionId)
            })
            this.ids = questionIdArr.length !== 0 ? questionIdArr.join(',') : ''
            return this.myGet('/q/v3/questions/batch', { ids: this.ids })
          })
          .then(result => {
            //将selectList中的sort遍历赋值给selectData
            this.selectList.forEach((item, index) => {
              result.data[index].sort = item.sort
            })
            this.selectData = result.data

            if (this.isPractice == 1 && this.courseType == 2) {
              //直播随堂练习给selectData添加新字段pptIndex
              this.selectData.forEach((item, index) => {
                if (item.id === this.selectList[index].questionId) {
                  item.pptIndex = this.selectList[index].pptIndex
                }
              })
              //根据pptIndex优化操作按钮
              let arr = this.sortArr(this.selectData, 'pptIndex')
              arr.forEach((item, index) => {
                //console.log(item)
                if (item.length == 1) {
                  item[0].handleArr = [
                    {
                      text: '撤销',
                      value: 3
                    }
                  ]
                } else {
                  this.operationScreening(item)
                }
              })
            } else {
              this.operationScreening(this.selectData)
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      sortArr(arr, str) {
        var _arr = [],
          _t = [], // 临时的变量
          _tmp
        // 按照特定的参数将数组排序将具有相同值得排在一起
        // arr = arr.sort(function(a, b) {
        //   var s = a[str],
        //     t = b[str]

        //   return s < t ? -1 : 1
        // })
        if (arr.length) {
          _tmp = arr[0][str]
        }
        // 将相同类别的对象添加到统一个数组
        for (var item of arr) {
          if (item[str] === _tmp) {
            _t.push(item)
          } else {
            _tmp = item[str]
            _arr.push(_t)
            _t = [item]
          }
        }
        // 将最后的内容推出新数组
        _arr.push(_t)
        return _arr
      },
      operationScreening(data) {
        data.forEach((item, index) => {
          if (index === 0) {
            item.handleArr = [
              {
                text: '下降',
                value: 2
              },
              {
                text: '撤销',
                value: 3
              }
            ]
          } else if (index === data.length - 1) {
            item.handleArr = [
              {
                text: '上移',
                value: 1
              },
              {
                text: '撤销',
                value: 3
              }
            ]
          } else {
            item.handleArr = [
              {
                text: '上移',
                value: 1
              },
              {
                text: '下降',
                value: 2
              },
              {
                text: '撤销',
                value: 3
              }
            ]
          }
        })
      },
      goBack(){
        window.history.go(-1);
      }
    }
  }
</script>
<style lang='less' scoped>
  .relevanceExercises {
    .main-contianer {
      background: #ecf0f5;
      position: relative;
      border-radius: 3px;
      border-top: 3px solid #d2d6de;
      margin-bottom: 20px;
      width: 100%;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      font-size: 14px;
      .box-header {
        border-bottom: 1px solid #e2e2e2;
        padding: 10px;
        .box-title {
          text-indent: 10px;
          display: inline-block;
          font-size: 18px;
          margin: 0;
          line-height: 1;
        }
      }
    }
  }
</style>