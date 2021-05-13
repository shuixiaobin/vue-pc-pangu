<template>
  <div>
    <div v-if="step == 1"
      class='type-total'>
      <el-row>
        <el-col :span="24"
          :offset="8">
          <label for="status"
            class="serchLabel">作业科目:</label>
          <el-radio-group v-model="form.type"
            @change="check_clear">
            <el-radio :label="false" v-if="isShow">行测</el-radio>
            <el-radio :label="true">申论</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row v-if="form.type">
        <el-col :span="24"
          :offset="8">
          <label for="status"
            class="serchLabel">作业批改方式:</label>
          <el-radio-group v-model="form.pgType">
            <!-- <el-radio :label="1"
              size="medium">智能批改</el-radio> -->
            <el-radio :label="2"
              size="medium">人工批改</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24"
          :offset="10">
          <el-button type="success"
            plain
            @click="next">下一步</el-button>
        </el-col>
      </el-row>
    </div>

    <div v-if="step == 2">
      <pz-list :pizhu="form.pgType"/>
    </div>

    <div v-if="step == 3">
      <xc-list/>
    </div>

  </div>
</template>

<script>
  import pzList from './components/list.vue' //申论练习题
  import xcList from '@/pages/relevanceExercises/RelevanceExercises' //行测练习题
  import { searchList, deleteItem, clearItem, deleteXc, choosedList } from './servers/index.js'
  import { getParams, parseQueryString } from '@/config/utils'
  export default {
    data() {
      return {
        step: 1,
        form: {
          type: false,
          pgType: 1
        },
        isShow: true
      }
    },
    components: {
      pzList,
      xcList
    },
    created() {
      this.init()
      if (getParams('bjyRoomId')) {
        this.isShow = false
      }
    },
    methods: {
      init() {
        this.form.type = getParams('subjectType') == 2 ? true : false
        this.form.type ? (this.form.pgType = 2) : (this.form.pgType = 1)
      },
      changeType() {
        let that = this
        this.form.type ? (this.form.pgType = 2) : (this.form.pgType = 1)
        this.$confirm('由于您切换了作业科目，您已选择的题目将会被清空, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            return Promise.all([
              clearItem({
                courseWareId: getParams('lessionId'),
                courseType: getParams('rouse')
              }),
              deleteXc(getParams('lessionId'), getParams('rouse'))
            ])
          })
          .catch(err => {
            //取消
            that.form.type = !that.form.type
            if (that.form.type) {
              that.form.pgType = 2
            } else {
              that.form.pgType = 1
            }
          })
          .then(res => {
            if (res[0].code == 1000000 && res[1].code == 1000000) {
              this.$message({
                type: 'success',
                message: '关联数据删除成功，请点击下一步继续关联题目!'
              })
            }
            if (this.form.type) {
              this.form.pgType = 2
            } else {
              this.form.pgType = 1
            }
          })
          .catch(err => {})
      },
      check_clear() {
        choosedList({
          courseWareId: getParams('lessionId'),
          courseType: getParams('rouse')
        }).then(res => {
          if (res.data && res.data.length > 0) {
            this.changeType()
          }else{
            if (this.form.type) {
              this.form.pgType = 2
            } else {
              this.form.pgType = 1
            }
          }
        })
      },
      next() {
        if (this.form.type) {

          this.step = 2
        } else {
          this.step = 3
        }
      }
    }
  }
</script>


<style scoped lang='less'>
  .type-total {
    padding: 50px;
  }
  .el-row {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  label {
    margin-right: 20px;
  }
  .serchLabel {
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(74, 74, 74, 1);
    line-height: 30px;
  }
</style>

<style>
  .type-total .el-radio__label {
    font-size: 20px;
  }
  .type-total .el-radio__inner {
    width: 20px;
    height: 20px;
  }
</style>
