<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="1200px"
    class="choose_online"
  >
    <template slot="title">
      <span class="title">选择线上课程</span>
    </template>
    <div class="search_box">
      课程id：<el-input class="input" v-model="form.rid"/>
      课程标题：<el-input class="input" v-model="form.title"/>
      考试类型：
      <el-select v-model="form.cateId" placeholder="请选择">
        <el-option
          v-for="item in examTypeList"
          :key="item.CategoryId"
          :label="item.CategoryName"
          :value="item.CategoryId">
        </el-option>
      </el-select>
      <el-button type="primary" @click="search()">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
    <el-table
      :data="courseList"
      border
      @current-change="handleCurrentChange"
      style="width: 100%;margin-bottom: 20px;">
      <el-table-column
        width="100"
        label="单选">
        <template slot-scope="scope">
          <el-radio v-model="course" @change="handleCurrentChange" :label="scope.row"><span></span></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="rid"
        label="课程id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="课程标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格">
        <template slot-scope="scope">¥{{scope.row.price}}</template>
      </el-table-column>
      <el-table-column
        prop="cateName"
        label="考试类型">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="startDate"
        label="上线时间">
      </el-table-column>
      <el-table-column
        prop="creater"
        label="创建人">
      </el-table-column>
      <el-table-column
        label="课程状态">
        <template slot-scope="scope">{{scope.row.status | status}}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :page-count="pageDto.pageSize"
      :current-page.sync="pageDto.page"
      @current-change="search"
      :total="pageDto.count">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确定选择</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import api from '@/api/courseApi.js'
  import Util from '@/common/util.js'
  export default {
    name: "chooseOnline",
    data(){
      return {
        dialogVisible: false,
        form: {
          rid: '',
          title: '',
          cateId: '',
        },
        examTypeList: [],
        pageDto: {
          page: 1,
          pageSize: 20,
          count: 0
        },
        courseList: [],
        course: ''
      }
    },
    filters: {
      formateTime(val){
        if(val)return Util.formatDate(new Date(val));
        return ''
      },
      status(val){
        let arr = ['未上线','已上线','已下线','关闭','删除']
        if(val!==null){
          return arr[val]
        }
        return ''
      }
    },
    methods: {
      confirm(){
        if(!this.course){
          this.$message.warning('请选择课程')
          return
        }
        this.$emit('chooseOnline',this.course)
        this.dialogVisible = false;
      },
      async search(page){
        if(!page)this.pageDto.page = 1;
        let param = {
          ...this.form,
          ...this.pageDto,
          videoTypes:9,
          status: 0,
        }
        let data = await api.getOnlineCourse(param)
        if(data){
          this.courseList = data.data;
          this.pageDto.count = data.total;
        }
      },
      reset(){
        Object.assign(this.form, this.$options.data().form)
      },
      async getExamType(){
        let data = await api.getOnlineExamType()
        if(data){
          this.examTypeList = data;
        }
      },
      show(){
        this.dialogVisible = true
      },
      handleCurrentChange(val){
        this.course = val
      }
    },
    created(){
      this.getExamType()
      this.search();
    }
  }
</script>

<style lang="less">
  .choose_online{
    .title{
      font-size: 24px;
    }
    .des{
      color: #999;
    }
    .search_box{
      margin-bottom: 20px;
      .input{
        width: 200px;
      }
    }
    .el-table .cell, .el-table th div{
      text-overflow:initial
    }
  }
</style>
