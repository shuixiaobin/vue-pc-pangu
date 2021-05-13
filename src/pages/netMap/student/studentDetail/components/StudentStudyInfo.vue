<template>
  <div class="study-info">
    <div class="container-title">
      <h2>学习情况</h2>
      <el-cascader
        size="small"
        :options="categoryData"
        :props="optionProps"
        v-model="category"
      >
      </el-cascader>
    </div>
    <div class="score-info_wrapper">
      <div class="score-info">
        <div class="prediction-score">
          预测分
          <b>{{studyInfo.aserAbilityVO && studyInfo.aserAbilityVO.predictedScore || '--'}}</b>
        </div>
        <div class="question-num">
          刷题情况：<span><b>{{studyInfo.aserAbilityVO && studyInfo.aserAbilityVO.doExerciseNum || '--'}}</b>/{{studyInfo.questionTotal || '--'}}</span>
        </div>
      </div>
      <div class="category-info">
        <div class="job-info">
          <div class="label-key">职位信息：</div>
          <template v-if="studyInfo.positionList && studyInfo.positionList.length > 0">
            <div
              class="label-value"
              v-for="(item, index) in studyInfo.positionList"
              :key="index"
            >
              <p>{{item.examType}}</p>
              <p
                v-for="(each, j) in item.positions"
                :key="j"
              >{{each.zwkZwdm}}-{{each.zwkBumen}}-{{each.zwkZw}}</p>
            </div>
          </template>
          <template v-else>
            --
          </template>
        </div>
        <div class="job-info">
          <div class="label-key">模考情况：</div>
          <div class="label-value">
            <p v-if="studyInfo.mockEnrollCount">报名过{{studyInfo.mockEnrollCount}}次模考</p>
            <p>参加过{{studyInfo.mockCardCount}}次模考</p>
          </div>
        </div>
        <div class="job-info">
          <div class="label-key">模考成绩：</div>
          <div class="label-value">
            <template v-if="studyInfo.mockCardVoList&&studyInfo.mockCardVoList.length > 0">
              <b
                v-for="(item, index) in studyInfo.mockCardVoList"
                :key="index"
                style="margin-right:0"
              >{{item.score}}<em v-if="studyInfo.mockCardVoList.length - 1 !== index">/</em></b>
            </template>
            <b v-else>--</b>
          </div>
        </div>
        <div class="label-key" v-if="category[1]!==14">估分情况：<b>参加过{{studyInfo.estimateCardCount}}次估分</b></div>
        <div class="job-info" v-if="category[1]!==14">
          <div class="label-key">估分成绩：</div>
          <div class="label-value">
            <template v-if="studyInfo.estimateCardVoList&&studyInfo.estimateCardVoList.length > 0">
              <b
                v-for="(item, index) in studyInfo.estimateCardVoList"
                :key="index"
              >{{item.score}}/{{item.paperScore}}</b>
            </template>
            <b v-else>--</b>
          </div>
        </div>
      </div>
    </div>
    <div
      id="myChart"
      v-if="studyInfo.aserAbilityVO&&studyInfo.aserAbilityVO.pointRate"
      ref="myChart"
    ></div>
  </div>
</template>

<script>
  function dfs(tree) {
    for (let i = 0; i < tree.length; i++) {
      const item = tree[i]
      if (item.children.length === 0) {
        item.children = null
      } else {
        dfs(item.children)
      }
    }
    return tree
  }
  import { getSubjectList } from '@/api/addExam'
  import { getStudentStudyInfo } from '@/api/netMap'
  import { radarChart } from './radarOption'
  export default {
    data() {
      return {
        optionProps: {
          value: 'id',
          label: 'name',
        },
        userName: this.$route.query.userName,
        category: [],
        categoryData: [],
        studyInfo: {},
        indicator: [], //雷达图数据
        value: [], //雷达图数据
      }
    },
    mounted() {
      this.getSubjectList()
    },

    watch: {
      category(val) {
        this.getStudyInfo()
      },
    },

    methods: {
      async getSubjectList() {
        const { data } = await getSubjectList()
        this.categoryData = dfs(data)
        this.category = [data[0].id, data[0].children[0].id]
      },
      async getStudyInfo() {
        const data = await getStudentStudyInfo({
          subject: this.category[1],
          userName: this.userName,
        })
        if (data.code === 1000000) {
          this.studyInfo = data.data
          if (data.data.aserAbilityVO && data.data.aserAbilityVO.pointRate) {
            const arr = data.data.aserAbilityVO.pointRate.split('、')
            this.indicator = arr.map(item => ({
              name: item.match(/[\u4e00-\u9fa5]/g).join(''),
              max: 100,
            }))
            this.value = arr.map(item => item.substring(item.indexOf('(') + 1, item.indexOf(')') - 1))
            this.$nextTick(() => {
              this.draw()
            })
          }
        } else {
          this.$message.error(data.message)
        }
      },
      draw() {
        radarChart({
          chart: this.$echarts,
          el: this.$refs.myChart,
          indicator: this.indicator,
          value: this.value,
        })
      },
    },
  }
</script>
<style lang='less' scoped>
  .study-info {
    background: #fff;
    .score-info_wrapper {
      padding: 16px;
      .score-info {
        height: 80px;
        background: #f5f7fa;
        border-radius: 4px;
        display: flex;
        align-items: center;
        .prediction-score {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #909399;
          line-height: 20px;
          text-align: center;
          width: 50%;
          b {
            display: block;
            height: 40px;
            font-size: 32px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #1856ff;
            line-height: 40px;
          }
        }
        .question-num {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #303133;
          display: flex;
          align-items: center;
          span {
            font-size: 18px;
            color: #606266;
            b {
              color: #303133;
            }
          }
        }
      }
      .category-info {
        font-size: 14px;
        color: #606266;
        line-height: 32px;
        margin-top: 10px;
        .job-info {
          display: flex;
          .label-value {
            flex: 1;
            p {
              line-height: 32px;
              color: #303133;
            }
            b {
              color: #303133;
              margin-right: 10px;
              display: inline-block;
            }
          }
        }
        .label-key {
          b {
            color: #303133;
            margin-right: 10px;
          }
        }
      }
    }
    #myChart {
      margin-top: 10px;
      height: 230px;
      display: flex;
      justify-content: center;
    }
  }
</style>