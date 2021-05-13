<template>
  <div class="search">
    <div class="search-container">
      <el-row>
        <el-col :span="4">
          <el-select v-model="questionType"
            placeholder="请选择类型"
            size="mini">
            <el-option v-for="item in questionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="difficulty"
            placeholder="请选择难度"
            size="mini">
            <el-option v-for="item in difficultyData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="props"
            placeholder="请选择属性"
            size="mini">
            <el-option v-for="item in propsData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6"
          class="knowledge-wrapper">
          <span class="title">知识点：</span>
          <el-cascader :options="knowledgeData"
            :props="knowledgeprops"
            v-model="knowledgePointId"
            size="mini"
            filterable
            change-on-select
            :show-all-levels="false"></el-cascader>
          <!-- <el-input v-model="knowledgePoint"
            size="mini"
            :disabled="knowledgePoint?true:false"></el-input> -->
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col :span="8">
          <el-input v-model="searchWord"
            placeholder="请输入题干、ID搜索"
            size="mini"></el-input>
        </el-col>
      </el-row>
      <el-button size="mini"
        type="primary"
        class="mt20"
        @click="search">搜索</el-button>
    </div>
  </div>
</template>

<script>
  import { getParams } from '@/config/utils'
  export default {
    props: {
      ids: {
        type: String,
        default: ''
      },
      // 用作判断是课后习题还是节点组件，以调取不同接口
      isFlag: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        questionType: '', //题型
        questionTypes: [
          {
            value: 1,
            label: '客观题'
          },
          {
            value: 2,
            label: '复合题'
          }
        ], //题型数据
        difficulty: '', //难度
        difficultyData: [
          {
            value: 2,
            label: '容易'
          },
          {
            value: 4,
            label: '较易'
          },
          {
            value: 6,
            label: '一般'
          },
          {
            value: 8,
            label: '较难'
          },
          {
            value: 10,
            label: '困难'
          }
        ], //难度数据
        knowledgePoint: decodeURI(getParams('kPointName')), //知识点
        knowledgePointId: [], //知识点id  getParams('kPointId')
        knowledgeData: [], //知识点数据
        knowledgeprops: {
          value: 'id',
          label: 'name'
        },
        subjectid: getParams('subjectid'), //科目id
        SUREsubjectid: '', //转换后的科目ID
        searchWord: '', //题干、ID搜索
        props: '', //题目属性
        propsData: [
          {
            value: 1,
            label: '真题'
          },
          {
            value: 2,
            label: '模拟题'
          }
        ], //属性数据
        page: 1, //页数
        pageSize: 20, //每页个数
        tableData: null //查询数据
      }
    },
    created() {
      //接收当前页改变
      eventBus.$on('currentPage', val => {
        this.page = val
      })
      //接收每页个数改变
      eventBus.$on('size', val => {
        this.pageSize = val
      })
      // 点击加入触发事件
      eventBus.$on('joinUpdate', () => {
        if (this.tableData != null) {
          this.getUnselected()
        }
      })
      //获取科目id
      this.getSubjectId()
      //获取知识点树
      this.getknowledgeData()
    },
    watch: {
      page() {
        this.search()
      },
      pageSize() {
        this.search()
      }
    },
    components: {},

    computed: {},

    methods: {
      getknowledgeData() {
        this.myGet(`/k/v2/points/${this.subjectid}`)
          .then(res => {
            if (res.code == 1000000) {
              this.knowledgeData = this.getknowledgeTreeData(res.data)
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      getknowledgeTreeData(data) {
        // 循环遍历json数据
        for (var i = 0; i < data.length; i++) {
          if (data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getknowledgeTreeData(data[i].children)
          }
        }
        return data
      },
      getSubjectId() {
        this.myGet('pand/backend/course/question/subject')
          .then(res => {
            if (res.code == 1000000) {
              for (var key in res.data) {
                if (this.subjectid === key) {
                  this.SUREsubjectid = res.data[key]
                }
              }
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      search() {
        this.getUnselected()
      },
      getUnselected() {
        eventBus.$emit('loading', true)
        this.myGet('/q/v3/questions', {
          content: this.searchWord,
          difficult: this.difficulty,
          subject: this.SUREsubjectid,
          mode: this.props,
          page: this.page,
          pageSize: this.pageSize,
          points: this.knowledgePointId[this.knowledgePointId.length - 1],
          type: this.questionType,
          ids: this.ids
        })
          .then(res => {
            this.tableData = res.data
            eventBus.$emit('tableData', this.tableData)
            console.log(this.tableData)
          })
          .catch(err => {
            eventBus.$emit('tableData')
            this.$message.error(err.message)
          })
      }
    }
  }
</script>
<style lang='less' scoped>
  .search {
    .search-container {
      padding: 20px 30px;
      .searchItem {
        display: flex;
        align-items: center;
        .word {
          display: block;
          width: 60px;
        }
        .el-row {
          flex: 1;
        }
        .line-wrapper {
          display: flex;
          justify-content: center;
        }
      }
    }
    .knowledge-wrapper {
      display: flex;
      align-items: center;
      .title {
        display: block;
        width: 60px;
      }
      .el-input {
        flex: 1;
      }
    }
    .mt20 {
      margin-top: 20px;
    }
  }
</style>