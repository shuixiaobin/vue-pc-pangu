<template>
  <div class='container-searchLine'>
    <label for="status">考试类型:</label>
    <el-select v-model="form.item_id" placeholder="" filterable  id="status" class="mr20" style="width:120px">
      <el-option label="不限" value="0"></el-option>
      <el-option v-for="(val,key) in examList" :label="val" :value="key" :key="val"></el-option>
    </el-select>
    <label for="status">审核状态:</label>
    <el-select v-model="form.status" placeholder="" filterable  id="status" style="width:120px">
        <el-option label="待审核" value="0"></el-option>
        <el-option label="推荐中" value="1"></el-option>
        <el-option label="退审" value="2"></el-option>
        <el-option label="取消推荐" value="3"></el-option>
        <el-option label="撤回" value="4"></el-option>
        <el-option label="已到期" value="5"></el-option>
    </el-select>

    <el-select v-model="form.inputType" placeholder="" filterable style="width:120px">
      <el-option label="课程ID" value="2"></el-option>
      <el-option label="课程名" value="1"></el-option>
    </el-select>
    <el-input class='option-input'
      v-model="form.inputVal"
      placeholder="标题"
      style="width:200px;"></el-input>
    <el-button @click="queryBtn" class="serchLeft" type="primary">查询</el-button>
  </div>
</template>

<script>
  import { getExam } from '../servers/index.js'
  export default {
    data() {
      return {
        statusList:[],
        examList:{
          1:"公务员",
          2:"教师",
        },
        form: {
          item_id:'',
          status:'',
          inputType:'1',
          inputVal:''
        }
      }
    },

    created() {
          this.$jsonp(jy_URL + '/fx/zx/get_item',{}).then(json => {
              this.examList=json.data;
          }).catch(err => {
         
          })
    },
    methods: {
      queryBtn(){
        this.$emit('putSearch',this.form) 
      }
    }
  }
</script>