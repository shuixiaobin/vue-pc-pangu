<template>
  <div class='serch-total'>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/OMO' }">列表</el-breadcrumb-item>
      <el-breadcrumb-item>学员详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 20px;">
      <h1 slot="header" class="title">{{detail.title}}</h1>
      <div class="box-card roomInfo">
        <div class="part">
          <p>课程ID：{{detail.rid}}</p>
          <p>创建日期：{{detail.createDate}}</p>
          <p>价格：{{detail.actualPrice}}</p>
        </div>
        <div class="part">
          <p>状态：{{detail.status |statusFilters}}</p>
          <p>上线日期：{{detail.startDate}}</p>
        </div>
      </div>
    </el-card>

    <div class="homeMenu">
       <router-link :to="{ path: '/home/OMODetail/student',query: $route.query }"
            class="menu" active-class="active">学员</router-link>
       <router-link :to="{ path: '/home/OMODetail/task',query: $route.query  }"
            class="menu" active-class="active">作业</router-link>
			<!-- <router-link :to="{ path: '/OMODetail/tempHomework',query: $route.query  }"
			      class="menu" active-class="active">模板作业</router-link> -->
       <router-link :to="{ path: '/home/OMODetail/templateTask',query: $route.query  }"
            class="menu" active-class="active">模板作业</router-link> 
       <router-link :to="{ path: '/home/OMODetail/report',query: $route.query  }"
            class="menu" active-class="active">报到信息</router-link>
       <router-link :to="{ path: '/home/OMODetail/signIn',query: $route.query  }"
            class="menu" active-class="active">签到</router-link>
    </div>

    <div class="router-view">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
  import * as omoApi from '@/api/omoApi.js'
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
        },
        liveInfo:{},
        activeName:"first"
      }
    },

    created() {
      this.detail= this.$route.query;
    },
    methods: {
      handleClick(){

      },

    },
    filters: {
      statusFilters(val) {
        let item
        switch (Number(val)) {
          case 0:
            item = '未上线'
            break
          case 1:
            item = '已上线'
            break
          case 2:
            item = '已下线'
            break
        }
        return item
      }
    }
  }
</script>


<style scoped lang='less'>
  .roomInfo {
      height: 120px;
      overflow: hidden;
      .title,.part {
        float: left;
        width: 30%;
        font-size: 18px;
        font-weight: 400;
        line-height: 40px;
      }
  }
  .title{
    font-size: 18px;
    font-weight: 400;
    line-height: 40px;
  }

.serch-total{
  padding: 10px; 
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

   .homeMenu {
      height: 40px;
      padding: 10px 27px 0px;
      width: 100%;
      text-align: left;
      position: relative;
      z-index: 10;
      .menu {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(48, 48, 48, 1);
        line-height: 22px;
        margin-right: 50px;
        display: inline-block;
        height: 35px;
      }
      .active {
        background: linear-gradient(#00D1B2, #00D1B2) no-repeat;
        background-size: 100% 4px;
        background-position: 0 1.5em;
        color:#00D1B2;
      }
    }
  .router-view{
    padding: 10px 2px;
    min-height: 300px;
  } 
</style>