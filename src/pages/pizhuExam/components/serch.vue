<template>
  <div class='serch-total'>

    <el-row :gutter="20">
      <el-col :span="8">
        <label for="status"
          class="serchLabel">类型:</label>
        <el-radio-group v-model="form.type"
          style="margin-right:20px;"
          @change="check_clear">
          <el-radio :label="false">单题</el-radio>
          <el-radio :label="true">套题</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="8">
        <label for="status"
          class="serchLabel">年份:</label>
        <el-select v-model="form.year"
          placeholder=""
          filterable
          id="status"
          class="serchSel serchRight"
          style="width:120px">
          <el-option label="不限"
            value=""></el-option>
          <el-option label="2019"
            value="2019"></el-option>
          <el-option label="2018"
            value="2018"></el-option>
          <el-option label="2017"
            value="2017"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <label for="status"
          class="serchLabel">地区:</label>
        <el-select v-model="form.areaId"
          placeholder=""
          filterable
          id="status"
          class="serchSel serchRight"
          style="width:120px">
          <el-option label="不限"
            value=""></el-option>
          <el-option v-for="item in areaAry"
            :label="item.name"
            :value="item.id"
            :key="item.id"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <el-col :span="8">
        <label for="status"
          class="serchLabel">题目类型:</label>
        <!-- <el-select v-model="form.questionType"
          placeholder=""
          filterable
          id="status"
          class="serchSel serchRight"
          style="width:120px">
          <el-option label="不限"
            value=""></el-option>
          <el-option v-for="item in examList"
            :label="item.text"
            :value="item.value"
            :key="item.text"></el-option>
        </el-select> -->
      <el-cascader :disabled="questionAble" expand-trigger='hover' separator="-" :options="examList" :props="txlistProps" v-model="form.questionType" :show-all-levels="false"></el-cascader>
      </el-col>
      <el-col :span="12">
        <el-select v-model="form.searchType"
          placeholder=""
          filterable
          class="serchSel"
          style="width:100px">
          <el-option v-for="item in searchAry"
            :label="item.text"
            :value="item.value"
            :key="item.text"></el-option>
        </el-select>
        <el-input class='option-input'
          v-model="form.searchContent"
          style="width:200px;"
          placeholder="请输入题目ID/标题">
        </el-input>
        <el-button @click="queryBtn"
          class="serchLeft"
          type="primary">查询</el-button>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import {
    examTypeList,
    searchList,
    areaList,
    clearItem,
    choosedList
  } from '../servers/index.js'
  import { getParams } from '@/config/utils'
  export default {
    data() {
      return {
        examList: [],
        areaAry: [],
        searchAry: [],
        form: {
          type: false,
          year: '',
          areaId: '',
          searchType: '',
          questionType: [],
          searchContent: ''
        },
        txlistProps: {
            value: "id",
            label: "name",
            children: "subList"
        },
        questionAble:false
      }
    },

    created() {
      this.init()
    },
    methods: {
      init() {
        examTypeList().then(res => {
          if(res.code==1000000&&res.data){
              const a=[];
              res.data.forEach(el => {
                  if(el.pid==0){
                      a.push(el);
                  }else{
                      const item=res.data.find(iel=>{
                          return iel.id==el.pid
                      })
                      item.subList=item.subList||[];
                      item.subList[el.sort-1]=el;
                  }
              });
              res.data=a;
          }
         this.examList = res.data
        })

        searchList({ type: Number(this.form.type) }).then(res => {
          this.searchAry = res.data
          console.log(res)
        })

        areaList().then(res => {
          this.areaAry = res.data
          console.log(res)
        })

        choosedList({
          courseWareId: getParams('lessionId'),
          courseType: getParams('rouse')
        }).then(res => {
          this.form.type = res.data && res.data.length > 0 ? !!res.data[0].exerciseType : false
          this.form.searchType =  this.form.type ? 3:1
        })
      },
      queryBtn() {
        this.$emit('putSearch', this.form)
      },
      changeType() {
        let that = this
        this.$confirm('由于您切换了类型，您已选择的题目将会被清空, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(res => {
            return Promise.all([
              searchList({ type: Number(that.form.type) }),
              clearItem({
                courseWareId: getParams('lessionId'),
                courseType: getParams('rouse')
              })
            ])
          })
          .catch(err => {
            //取消
            console.log(err)
            that.form.type = !that.form.type
          })
          .then(res => {
            that.form.searchType='';
            that.form.searchContent ='';
            that.searchAry = res[0].data
            that.form.searchType =  that.form.type ? 3:1;
            if (res[1].code == 1000000) {
              this.$message({
                type: 'success',
                message: '数据删除成功!'
              })
              that.$emit('putSearch', this.form)
              that.$emit('clearNum')
            }

          })
          .catch(err => {
            console.log(err)
          })
      },
      check_clear() {
        choosedList({
          courseWareId: getParams('lessionId'),
          courseType: getParams('rouse')
        }).then(res => {
          if (res.data && res.data.length > 0) {
            this.changeType()
          }else{
            searchList({ type: Number(this.form.type) }).then(res=>{
              this.form.searchType='';
              this.form.searchContent ='';
              this.searchAry = res.data
              this.$emit('putSearch', this.form)
            })
          }
        })

        if(this.form.type){
            this.form.questionType =[];
            this.questionAble=true;
        }else{
            this.questionAble=false;
        }
      }
    }
  }
</script>


<style scoped lang='less'>
  .serch-total {
    margin: 20px 100px;
  }
  .serchSel {
    width: 150px;
  }
  .serchRight {
    margin-right: 20px;
  }
  .serchLeft {
    margin-left: 20px;
  }
  .serchLabel {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(74, 74, 74, 1);
    line-height: 30px;
  }
</style>