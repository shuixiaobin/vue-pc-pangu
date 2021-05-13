<template>
  <div class='serch-total'>
    <el-select v-model="form.type" placeholder="" filterable class="serchSel" style="width:120px">
      <el-option label="课程ID" value="2"></el-option>
      <el-option label="课程标题" value="1"></el-option>
    </el-select>
    <el-input class='option-input'
      v-model="form.keyword"
      placeholder="标题"
      style="width:200px;margin-right:30px"></el-input>
    <label for="status" class="serchLabel">课程状态:</label>
    <el-select v-model="form.status" placeholder="" filterable  id="status" class="serchSel serchRight" style="width:120px">
        <el-option label="未上线" value="0"></el-option>
        <el-option label="上线" value="1"></el-option>
        <el-option label="下线" value="2"></el-option>
    </el-select>
    <el-button @click="queryBtn" class="serchLeft" type="primary">查询</el-button>
    <el-button @click="batchAddHomework" class="serchLeft" type="primary">批量添加作业</el-button>
		<!-- <el-button @click="homeworkTemplate" class="serchLeft" type="primary">作业模板</el-button> -->
    <el-button @click="goTempalte" class="serchLeft" style="margin-left:2px" type="primary">作业模板</el-button>
     <el-button @click="goPigai" class="serchLeft" style="margin-left:3px" type="primary">作业批改</el-button>
  </div>
</template>




<script>
  import * as omoApi from '@/api/omoApi.js'
  export default {
    data() {
      return {
        statusList:[],
        form: {
          type: "1",
          status: '1',
          keyword: ''
        },
      }
    },

    created() {
        this.$emit('putSearch',this.form)
    },
    methods: {
      queryBtn(){
        this.$emit('putSearch',this.form)
      },
      batchAddHomework () {
        this.$emit('batchAddHomework')
      },
			// homeworkTemplate(){
			// 	this.$router.push({name: 'OMOHomework'})
			// },
      goTempalte(){
        this.$router.push({path: "/home/tempalteList"});
      },
      goPigai(){
        this.$router.push({path: "/home/homeWorkListTotal"});
      }

      
    }
  }
</script>


<style scoped lang='less'>
.serch-total{
  margin: 20px 100px;
}
.serchSel{
  width:150px;
}
.serchRight{
  margin-right: 20px;
}
.serchLeft{
margin-left: 20px;
}
.serchLabel{
font-size:16px;
font-family:PingFangSC-Regular;
color:rgba(74,74,74,1);
line-height:30px;
}
</style>
