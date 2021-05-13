<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="1200px"
    class="choose_offline"
  >
    <template slot="title">
      <span class="title">选择线下课程</span>
      <span class="des">（神农架1号）</span>
    </template>
    <div class="search_box">
      课程编号：<el-input class="input" v-model="form.courseCode"/>
      课程名称：<el-input class="input" v-model="form.courseName"/>
      所属产品：<el-input class="input" v-model="form.productName"/>
      所属产品编号：<el-input class="input" v-model="form.productCode"/>
      <br/>
      <br/>
      考试类型：
      <el-cascader
        :options="examTypeList"
        v-model="form.examTypeId"
        :props="key"
      >
      </el-cascader>
      分校分部：
      <el-cascader
        :options="schoolList"
        v-model="form.id"
        :props="key2"
      >
      </el-cascader>
      <el-button type="primary" @click="search">查询</el-button>
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
        prop="code"
        label="课程编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="课程名称"
        width="180">
      </el-table-column>
      <el-table-column
        label="所属产品">
        <template slot-scope="scope" v-if="scope.row.productRespDto">{{scope.row.productRespDto.name}}</template>
      </el-table-column>
      <el-table-column
        label="所属产品编号">
        <template slot-scope="scope" v-if="scope.row.productRespDto">{{scope.row.productRespDto.code}}</template>
      </el-table-column>
      <el-table-column
        label="考试类型">
        <template slot-scope="scope" v-if="scope.row.productRespDto">{{scope.row.productRespDto.examTypeName}}</template>
      </el-table-column>
      <el-table-column
        prop="branchSchoolName"
        label="分校分部">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | formateTime}}</template>
      </el-table-column>
      <el-table-column
        label="有效期">
        <template slot-scope="scope">{{scope.row.validityDateStart | formateTime}}至{{scope.row.validityDateEnd | formateTime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="maxPeopleNumber"
        label="库存上限">
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :page-count="pageDto.pageSize"
      :current-page.sync="pageDto.pageNum"
      @current-change="handlePageChange"
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
		name: "chooseOffline",
    data(){
		  return {
		    dialogVisible: false,
        form: {
          courseId: '',
          courseName: '',
          courseCode: '',
          examTypeId: [],
          id: [],
          productCode: '',
          productName: ''
        },
        examTypeList: [],
        key: {
          value: "id",
          label: "name",
          children: "examTypeDtoList"
        },
        key2: {
          value: "id",
          label: "name",
        },
        schoolList: [],
        pageDto: {
		      pageNum: 1,
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
      }
    },
    methods: {
      confirm(){
        if(!this.course){
          this.$message.warning('请选择课程')
          return
        }
        this.$emit('chooseOffline',this.course)
        this.dialogVisible = false;
      },
      async search(){
          let param = {
            id: this.form.id[1],
            teachWay: 4, //4 双师
            businessUnitId: this.form.examTypeId[0],
            examTypeId: this.form.examTypeId[1],
            productCode: this.form.productCode,
            productName: this.form.productName,
            courseName: this.form.courseName,
            courseCode: this.form.courseCode,
            pageDto: this.pageDto,
            isPositionProtected: false,  //是否职位保护
          }
          let data = await api.getCourse(param)
          if(data.code===0){
            this.courseList = data.data;
            let dto = data.pageDto;
            if(dto){
              this.pageDto.count = dto.count;
            }else{
              this.pageDto.count = 0;
            }
          }else{
            this.$message.error(data.msg);
          }
      },
      reset(){
        Object.assign(this.form, this.$options.data().form)
      },
      async getExamType(){
        let data = await api.getExamType()
        console.log(data)
        if(data.data&&Array.isArray(data.data)){
          data.data.forEach(item => {
            item.id = item.businessUnitId;
            item.name = item.businessUnitName;
          })
          this.examTypeList = data.data;
        }
      },
      getSchool(){
        let sc =  Promise.resolve(api.getSchool());
        let fb = Promise.resolve(api.getFB());
        Promise.all([sc,fb]).then(values=>{
          if(Array.isArray(values)&&values.length===2){
            let arr = []
            arr.push({
              id: 1,
              name: '分校',
              children: values[0].data
            })
            arr.push({
              id: 2,
              name: '分部',
              children: values[1].data
            })
            this.schoolList = arr;
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      show(){
        this.dialogVisible = true
      },
      handleCurrentChange(val){
        this.course = val
      },
      handlePageChange(val){
        this.pageDto.pageNum = val;
        this.search()
      }
    },
    created(){
		  this.getExamType()
      this.getSchool();
    }
	}
</script>

<style lang="less">
  .choose_offline{
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
  }
</style>
