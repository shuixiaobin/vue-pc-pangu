<template>
    <div class="create">
      <span class="title">创建O2O课程</span>
      <span class="des">创建成功后在<router-link class="link" to="/home/o2o">【O2O课程管理】</router-link>中上线课程</span>
      <div class="container">
        <div class="form">
          <span class="form_title">·必填项</span>
          <el-form ref="form" :model="form" style="margin-left: 40px">
            <el-form-item label="课程标题">
              <el-input v-model="form.title" maxlength="20"
                        style="width:400px"></el-input> {{form.title.length}}/20
            </el-form-item>
            <el-form-item label="售卖渠道">
              <el-checkbox-group v-model="form.pay_limit">
                <el-checkbox label="hhr">合伙人</el-checkbox>
                <el-checkbox label="htjy">华图教育+</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="course">
          <span class="course_title">选择在线课程</span>
          <el-button type="primary" class="choose" @click="showOnline">选择课程</el-button>
          <el-table
            :data="onlineCourse"
            border
            style="width: 100%;margin-bottom: 20px;">
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
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="remove('onlineCourse')">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span class="course_title">选择线下课程</span><span class="course_des">（神农架1号）</span>
          <el-button type="primary" class="choose" @click="showOffline">选择课程</el-button>
          <el-table
            :data="offlineCourse"
            border
            style="width: 100%;margin-bottom: 20px;">
            <el-table-column
              prop="code"
              label="课程编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="课程名称"
              width="120">
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
              prop="address"
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
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="showGood(scope.row.id)">选择商品</el-button>
                <el-button type="text" @click="remove('offlineCourse')">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="btn_box">
          <el-button @click="cancel">取消创建</el-button>
          <el-button type="primary" @click="create" v-if="id">保存商品</el-button>
          <el-button type="primary" @click="create" v-else>创建商品</el-button>
        </div>
      </div>
      <choose-offline ref="offline" @chooseOffline="chooseOffline"></choose-offline>
      <choose-online ref="online" @chooseOnline="chooseOnline" ></choose-online>
      <choose-good @chooseGood="chooseGood" :list="goodList" ref="chooseGood"></choose-good>
    </div>
</template>

<script>
  import chooseOffline  from './chooseOffline'
  import chooseOnline  from './chooseOnline'
  import chooseGood from './chooseGood'
  import Util from '@/common/util.js'
  import api from '@/api/courseApi.js'
  export default {
		name: "create",
    components: {
		  chooseOffline,
      chooseGood,
      chooseOnline
    },
    data(){
		  return {
		    form: {
          title: '',
          pay_limit: ['hhr']
        },
        options: [],
        onlineCourse: [],
        offlineCourse: [],
        goodList: [],
        id: ''
      }
    },
    filters: {
      formateTime(val){
        if(val)return Util.formatDate(new Date(Number(val)));
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
    computed: {
		  offlineCourseId(){
		    return this.offlineCourse.length>0?this.offlineCourse[0].id:''
      }
    },
    watch:{
      offlineCourseId(val,oldVal){
        if(oldVal)this.goodList = [] //更改课程需清除已绑定课程
      }
    },
    methods: {
		  //选择线下课
      showOffline(){
        this.$refs.offline.show()
      },
      //选择线上课
      showOnline(){
        this.$refs.online.show();
      },
      chooseOffline(course){
        this.offlineCourse = [course]
      },
      chooseOnline(course){
        this.onlineCourse = [course]
      },
      remove(list){
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this[list] = [];
        })
      },
      showGood(id){
        this.$refs.chooseGood.show(id)
      },
      chooseGood(list){
        this.goodList = list
      },
      cancel(){
        this.$router.go(-1)
      },
      async create(){
        if(!this.form.title){
          this.$message.warning('请输入课程标题！')
          return;
        }
        if(this.onlineCourse.length===0||this.offlineCourse.length===0){
          this.$message.warning('请选择课程！')
          return;
        }
        if(this.goodList.length===0){
          this.$message.warning('请选择商品！')
          return;
        }else{
          let flag = this.goodList.every(item => item.startTime === this.goodList[0].startTime)
          if(!flag){
            this.$message.warning('请选择开课日期一致的商品！')
            return
          }
        }
        this.goodList.forEach(item => item.courseId = this.offlineCourse[0].id);
        let param = {
          title: this.form.title,
          pay_limit: this.form.pay_limit.join(','),
          zx_id: this.onlineCourse[0].rid,
          ss_course: JSON.stringify(this.offlineCourse[0]),
          ss_goods: JSON.stringify(this.goodList),
          id: this.id
        }
        let data = await api.createO2O(param)
        if(data){
          if(this.id){
            this.$message.success('保存成功')
            this.$router.go(-1);
          }else{
            this.$message.success('创建成功')
            Object.assign(this.$data, this.$options.data())
          }
        }
      },
      async getData(){
        this.id = this.$route.query.id;
        let param = {
          id: this.id
        }
        let data = await api.getO2OData(param)
        if(data){
          this.form.title = data.title;
          this.form.pay_limit = data.pay_limit.split(',');
          //处理课程参数对应
          let zx_course = data.zx_course;
          zx_course.rid = zx_course.id;
          zx_course.price = zx_course.actualPrice;
          zx_course.cateName = zx_course.categoryName;
          zx_course.creater = zx_course.userName;
          this.onlineCourse = [zx_course];

          let ss_course = data.ss_course;
          ss_course.productRespDto = {
            code: ss_course.productRespDtoCode,
            name: ss_course.productRespDtoName,
            examTypeName: ss_course.examTypeName,
            examTypeId: ss_course.examTypeId
          }
          ss_course.branchSchoolName = ss_course.branchDepartmentName;
          ss_course.branchSchoolId = ss_course.branchDepartmentId;
          ss_course.id = ss_course.courseId;
          this.offlineCourse = [ss_course]
          //商品回显
          this.goodList = data.ss_goods;
        }
      }
    },
    created(){
		  if(this.$route.query.id){
		    this.getData();
      }
    }
	}
</script>

<style scoped lang="less">
  .create{
    padding: 20px;
    .title{
      font-size: 32px;
      font-weight: 600;
    }
    .des{
      display: inline-block;
      margin-left: 30px;
      color: #666666;
      .link{
        color: #409EFF;
      }
    }
    .container{
      padding: 20px;
      background: #eef0f3;
      .form{
        .form_title{
          color: #ff4d51;
          display: inline-block;
        }
      }
      .course{
        border-top: 1px solid #ddd;
        padding-top: 20px;
        .choose{
          float: right;
        }
        .course_title{
          line-height: 40px;
        }
        .course_des{
          color: #999;
        }
      }
      .btn_box{
        text-align: center;
      }
    }

  }
</style>
