<template>
  <div class="left-home-wrap">
    <div class="left-nav">
      <h3>快速导航</h3>
      <el-row>
        <el-col :span="8" v-for="item in navList" :key="item.id">
          <div class="imgSrc1" :style="{ background: item.bgc }" @click="goItem(item.id)">
            <span
              class="iconfont iconCls"
              :class="item.icon"
              style="color: #fff; font-size: 20px"
            ></span>
          </div>
          <p>{{ item.title }}</p>
        </el-col>
        <el-col :span="8">
          <div class="imgSrc2">
            <div class="circle"><span>·</span><span>·</span><span>·</span></div>
          </div>
          <p>敬请期待</p>
        </el-col>
        <el-col :span="8">
          <div class="imgSrc2">
            <div class="circle"><span>·</span><span>·</span><span>·</span></div>
          </div>
          <p>敬请期待</p>
        </el-col>
      </el-row>
    </div>
    <div class="left-content">
      <div class="title">
        <h3>通知</h3>
        <span @click="handleAllNotice">全部通知</span>
      </div>
      <div class="tableList">
        <ul v-if="noticeList.length>0">
          <li 
            v-for="item in noticeList" 
            :key="item._id" 
            @click="handleLookDetail(item._id)">
            <h4>{{item.contentDesc}}</h4>
            <span>{{item.addTime}}</span>
          </li>
        </ul>
        <div class="notice" v-if="!noticeList.length">
          <p class="notice-bgc"></p>
          <p class="notice-text">暂无消息</p>
        </div>
      </div>
    </div>

    <!-- 弹框 -->
    <LeftHomeDialog ref="openDialog" @getList="getList" />

    <!-- 右侧抽屉 -->
    <el-drawer
      title="通知列表"
      :visible.sync="noticeDrawer"
      direction="rtl"
      size="80%"
    >
      <notice-all></notice-all>
    </el-drawer>
  </div>
</template>

<script>
import LeftHomeDialog from "./left-home-dialog.vue";
import { navContent } from "../../common/homeNav";
import NoticeAll from "./notice-all";
import {getOtherToken, getNoticeList} from "@/api/auth";
import util from "@/common/util.js";
export default {
  components: { LeftHomeDialog, NoticeAll },
  name: "LeftHome",
  data() {
    return {
      navList: navContent,
      noticeDrawer: false,
      noticeList: [],
      userName: '',
      timer:null
    };
  },
  created() {
    this.userName = localStorage.getItem('userName')
    this.getNoticeList()
  },
  methods: {
    handleAllNotice() {
      this.noticeDrawer = true;
    },
    goItem(id){
      clearTimeout(this.timer);
      this.timer=window.setTimeout(()=>{
        this.skipOut(id);
      },500);
    },

    skipOut(id){
      var tkUrl={
        '1':"http://tkproc.huatu.com/pandora/#/login",
        '2':"http://tkproc.huatu.com/shenlun-backend/#/home/index", 
        '4':"http://tkproc.huatu.com/schedule/#/login",
      }

      var lineUrl={ //线上
        '1':"http://pandora.htexam.com//#/login",
        '2':"http://ns.huatu.com/shenlun-backend/#/home/index",
        '4':"http://schedule.htexam.com/",
      }

      if(id ==4){
          util.setCookie("token",localStorage.getItem('pg_token'));
          window.open(WEBPACK_BUILD_TARGET === 'production' ? lineUrl[id] : tkUrl[id]);
          return;
      }

			if(id == '5'){ // 如果点击云端课堂 跳转到 我的课表-直播列表
				this.$router.push({
					name: 'myTimetable',
					params: {id: 5}
				})
			}
			
      getOtherToken(id).then(res=>{
        if(res.code==1000000){
          if(id==1){
            console.log("潘多拉")
            //util.setCookie("token",res.data.token);
            window.open(WEBPACK_BUILD_TARGET === 'production' 
                    ? `${lineUrl[id]}?token=${res.data.token}` : `${tkUrl[id]}?token=${res.data.token}`);
          }else if(id ==2){
            console.log("申论后台")
            window.open(WEBPACK_BUILD_TARGET === 'production' 
              ? `${lineUrl[id]}?token=${res.data.token}&admin=${res.data.username}` : 
              `${tkUrl[id]}?token=${res.data.token}&admin=${res.data.username}`);
          }
        }
      })  
    },
    getNoticeList() {
      let params = {
        userName: this.userName,
        isRead: 3,
        page: 1,
        pageSize: 5
      }
      getNoticeList(params).then(res => {
        if(res.code === 10000) {
          this.noticeList = res.data.data
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleLookDetail(id) {
      this.$refs.openDialog.openDetail({
        userName: this.userName,
        id,
        sel: '1',
        isRead: 3
      });
    },
    getList() {
      this.getNoticeList()
    }
  },
};
</script>

<style lang="less" scoped>
.left-home-wrap {
  width: 100%;

  .left-nav {
    width: 100%;
    height: 288px;

    h3 {
      height: 48px;
      background-color: #fff;

      padding-left: 16px;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      line-height: 48px;
    }

    .el-row {
      height: 240px;
      margin-top: 1px;

      .el-col {
        height: 120px;
        background: #ffffff;
        box-sizing: border-box;
        border: 2px solid #f4f5fb;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &:nth-child(-n + 6) {
          border-top: none;
          border-right: none;
        }

        &:nth-child(1) {
          border-left: none;
        }

        &:nth-child(4) {
          border-left: none;
        }

        .imgSrc1 {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .imgSrc2 {
          width: 50px;
          height: 50px;
          background: #f0f1f6;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;

          .circle {
            span {
              width: 4px;
              height: 4px;
              color: #d8d8d8;
            }
          }
        }

        p {
          margin-top: 10px;
          font-size: 14px;
          color: gray;
        }
      }
    }
  }

  .left-content {
    margin-top: 16px;
    margin-bottom: 50px;
    height: 324px;

    .title {
      height: 48px;
      background-color: #fff;

      h3 {
        float: left;
        padding-left: 16px;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        line-height: 48px;
      }

      span {
        float: right;
        padding-right: 16px;
        font-size: 12px;
        color: #1875ff;
        line-height: 48px;
        cursor: pointer;
      }
    }

    .tableList {
      margin-top: 1px;
      height: 276px;
      padding: 0 16px;
      background-color: #fff;
      overflow-y: auto;

      li {
        height: 46px;
        border-bottom: 1px solid #ebeef5;
        cursor: pointer;

        h4 {
          float: left;
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          line-height: 46px;
        }
        span {
          float: right;
          font-size: 14px;
          font-weight: 400;
          color: #606266;
          line-height: 46px;
        }
      }

      .notice {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .notice-bgc {
          width: 70px;
          height: 60px;
          background-image: url('../../common/images/notice.png');
          background-size: 100% 100%;
        }
        .notice-text {
          font-size: 14px;
          color: #A0A0A0;
          line-height: 18px;
        }
      }
    }
  }

  /deep/ .el-drawer__body {
    padding: 0 16px;
  }
}
</style>