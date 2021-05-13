<template>
    <div class="create">
      <span class="title">创建O2O课程</span>
      <el-button style="float:right" @click="cancel">返回</el-button>
      <div class="container">
        <div class="form">
          <el-form ref="form" :model="form" style="margin-left: 40px">
            <el-form-item label="课程标题">
              <p>{{form.title}}</p>
            </el-form-item>
            <el-form-item label="售卖渠道">
              <el-checkbox-group disabled v-model="form.pay_limit">
                <el-checkbox label="hhr">合伙人</el-checkbox>
                <el-checkbox label="htjy">华图教育+</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="course">
          <span class="course_title">在线课程</span>
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
            </el-table-column>
          </el-table>
          <span class="course_title">线下课程</span><span class="course_des">（神农架1号）</span>
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
                <el-button type="text" @click="showGood(scope.row.id)">查看商品</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog :visible.sync="show" width="1000px">
          <el-table
            :data="goodList"
            border
            style="width: 100%;margin-bottom: 20px;">
            <el-table-column
              prop="goodsNo"
              label="商品编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="goodsName"
              label="商品名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="商品定价">
              <template slot-scope="scope">{{scope.row.goodsPrice/10000}}</template>
            </el-table-column>
            <el-table-column
              prop="subDepartmentName"
              label="分部">
            </el-table-column>
            <el-table-column
              prop="address"
              label="协议类型">
              <template slot-scope="scope">{{scope.row.goodsNo | agreement}}</template>
            </el-table-column>
            <el-table-column
              label="开课日期">
              <template slot-scope="scope">{{scope.row.startTime | formateTime}}</template>
            </el-table-column>
            <el-table-column
              prop="maxPeople"
              label="库存上限">
            </el-table-column>
            <el-table-column
              label="创建时间">
              <template slot-scope="scope">{{scope.row.createTime | formateTime}}
              </template>
            </el-table-column>
            <el-table-column
              label="在线售卖">
              <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.buyStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0">
                  </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import Util from '@/common/util.js'
  import api from '@/api/courseApi.js'
  export default {
		name: "detail",
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
        id: '',
        show: false    //商品弹窗
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
      },
      agreement(code){
        if(!code)return '未知'
        if(code[code.length-1]==='A')return '非协议'
        return '协议'
      }
    },
    methods: {
      showGood(){
        this.show = true;
      },
      cancel(){
        this.$router.go(-1)
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
