<template>
  <el-card class="totla">
    <el-card>
      <h1 slot="header" class="title">直播间数据看板</h1>
      <el-form :inline="true"
        :model="formInline"
        class="demo-form-inline"
        style="margin-left:20px">
        <el-form-item label="直播间id:">
          <el-input v-model="zhiboId"
            width="100px"
            size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="initData"
            size="mini">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;">
      <h1 slot="header" class="title">直播间信息</h1>
      <div class="box-card roomInfo">
        <div class="part">
          <p>课程ID：{{liveInfo.NetClassId}}</p>
          <p>授课老师：{{liveInfo.TeacherName}}</p>
          <p>直播开始时间：{{liveInfo.BeginTime}}</p>
          <p>百家云房间号：{{liveInfo.bjyRoomId}}</p>
        </div>
        <div class="part">
          <p>课程标题：{{liveInfo.classTitle}}</p>
          <p>助教：{{liveInfo.assistantName}}</p>
          <p>直播结束时间：{{liveInfo.EndTime}}</p>
          <p>是否直播带货课：{{liveInfo.isBringGoods >0?"是":"否"}}</p>
        </div>
        <div class="part">
          <p>本节内容：{{liveInfo.title}}</p>
        </div>
      </div>
    </el-card>

    <div class="echartPart">
      <el-card style="position: relative">
        <template slot="header">
          <el-button type="primary"
            style="float: right"
            size="mini"
            class="btn"
            @click="clickUser">导出明细》</el-button>
          <h1 class="title">直播间用户信息</h1>
        </template>
        <div class="userReport">
          <p>报名人数：{{liveInfo.totalOrder}}</p>
          <p>观看人数：{{liveInfo.totalUserCount}}</p>
          <p>峰值人数：{{liveInfo.peakUser}}</p>
          <p>到课率：{{liveInfo.attendanceRate}}%</p>
        </div>
        <line-chart class="lineChart"
          :form="bjyRoomInfo" />
      </el-card>
      <el-card style="margin-top: 20px; position: relative">
        <template slot="header">
          <el-button type="primary"
            style="float: right"
            size="mini"
            class="btn"
            @click="clickAll">查看全部》</el-button>
          <h1 class="title">直播间订单信息</h1>
        </template>
        <div class="userReport" style="bottom:50px">
          <p>总计：{{orderInfo.orderCount}}单--{{orderInfo.orderSum}}元</p>
        </div>
        <bing-chart class="bing"
          :form="orderInfo" />
      </el-card>
    </div>

    <el-dialog :visible.sync="useDialog"
      width="45%">
      <el-tabs v-model="activeName"
        type="card">
        <el-tab-pane label="直播间用户信息"
          name="first">
          <el-button type="primary"
            style="margin-left:40%;margin-top:20px"
            @click="exportUser">导出</el-button>
        </el-tab-pane>
        <el-tab-pane label="直播间聊天记录"
          name="second">
          <el-date-picker v-model="talkTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
             style="width: 400px"
            @blur="dealtalkTime">
          </el-date-picker>
          <el-button type="primary"
            style="margin-left:40px"
            @click="exportLiaotian">导出</el-button>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer"
        class="dialog-footer">
        <el-button @click="useDialog=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="orderDialog"
      width="60%">
      <el-form :inline="true"
        :model="formInline"
        class="demo-form-inline">
        <el-form-item label="订单状态">
          <el-select v-model="orderStatus"
            size="small">
            <el-option label="已支付"
              value="1"></el-option>
            <el-option label="未支付"
              value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-select v-model="orderTimeType"
            size="small">
            <el-option label="下单时间"
              value="1"></el-option>
            <el-option label="支付时间"
              value="0"></el-option>
          </el-select>
          <el-date-picker v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
             style="width: 400px"
            @blur="dataTime">
          </el-date-picker>
          <el-button type="primary"
            style="margin-left:40px"
            @click="exportOrder">导出</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-table :data="tableData"
            border
            style="width: 100%">
            <el-table-column prop="Title"
              label="课程名称"
              width="300">
            </el-table-column>
            <el-table-column prop="count"
              label="销量"
              width="180">
            </el-table-column>
            <el-table-column prop="moneySum"
              label="金额"
              width="180">
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer"
        class="dialog-footer">
        <el-button @click="orderDialog=false">取 消</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
  import api from '@/api/courseApi.js'
  import lineChart from './line.vue'
  import bingChart from './bing.vue'
  import { Message, Loading } from 'element-ui'
  export default {
    components: {
      lineChart,
      bingChart
    },
    data() {
      return {
        chartPie: null,
        zhiboId: '',
        liveInfo: '',
        orderInfo: '',
        bjyRoomInfo: {},
        formInline: {},
        useDialog: false,
        orderDialog: false,
        liaotianTime: '',
        activeName: 'first',
        orderStatus: '1',
        orderTimeType: '1',
        time: null,
        talkTime:'',
        startTime: '',
        endTime: '',
        tableData: [],
        startTalk:'',
        endTalk:''
      }
    },
    mounted() {
      //this.initData()
    },
    methods: {
      async initData() {
        if(!this.zhiboId){
          Message("请输入直播ID")
          return
        }

        var list = await api.getZhiboList({ id: this.zhiboId });
        if(list.code != 10000){
          Message(list.msg)
          return
        }
        this.liveInfo = list.data.liveInfo;
        this.orderInfo = list.data.orderInfo;
        this.bjyRoomInfo = list.data.bjyRoomPeakUser;
        this.time = [this.liveInfo.BeginTime,this.liveInfo.EndTime];
        this.startTime = this.liveInfo.BeginTime;
        this.endTime = this.liveInfo.EndTime;
      },
      clickUser() {
        this.useDialog = true
      },
     async clickAll() {
        var list = await api.getZhiboOrder({ id: this.zhiboId });
        this.tableData = list.data.order;
        this.orderDialog = true
      },
      exportUser() {
        window.open(`${PHP_URL}/v5/blue/lesson/live_class_watch_user?id=${this.zhiboId}`)
      },
      exportLiaotian() {
        window.open(`${PHP_URL}/v5/blue/lesson/bjy_export_chat_msg?id=${this.zhiboId}&startDate=${this.startTalk}&endDate=${this.endTalk}`)
      },
      exportOrder() {
        window.open(`${PHP_URL}/v5/blue/lesson/live_user_order?id=${this.zhiboId}&orderStatus=${this.orderStatus}&payStatus=${this.orderTimeType}&beginDate=${this.startTime}&endDate=${this.endTime}`)
      },
      getDate(date) {
          let year = date.getFullYear(); //获取当前年份
          let mon = date.getMonth() + 1; //获取当前月份
          let da = date.getDate(); //获取当前日
          let h = date.getHours(); //获取小时
          let m = date.getMinutes(); //获取分钟
          let s = date.getSeconds(); //获取秒
          return year + "-" + mon + "-" + da  + " " + h + ":" + m + ":" + s;
      },
      dataTime() {
        let time1 = this.time[0]
        let time2 = this.time[1]
        let dateStr1 = this.getDate(time1)
        let dateStr2 = this.getDate(time2)
        this.startTime = dateStr1
        this.endTime = dateStr2
      },
      dealtalkTime(){
        let time1 = this.talkTime[0]
        let time2 = this.talkTime[1]
        let dateStr1 = this.getDate(time1)
        let dateStr2 = this.getDate(time2)
        this.startTalk = dateStr1
        this.endTalk = dateStr2
      }
    }
  }
</script>

<style lang='less' scope>
  .totla {
    padding: 20px;
    .title {
      font-size: 22px;
      font-weight: 400;
      color: #1f2f3d;
      margin-bottom: 10px;
    }
    .roomInfo {
      height: 250px;
      overflow: hidden;
      .part {
        float: left;
        width: 30%;
        font-size: 18px;
        font-weight: 400;
        line-height: 40px;
      }
    }
    .echartPart {
      margin-top: 20px;
      overflow: hidden;
      .userReport {
        font-size: 20px;
        line-height: 40px;
        position: absolute;
        bottom: 100px;
        right: 50px;
      }
      .lineBox {
        position: relative;
        lineChart {
          position: absolute;
          left: 200px;
          top: 10px;
        }
        .btn {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        .userReport {
          position: absolute;
          right: 15%;
          top: 100px;
          font-size: 20px;
          font-weight: 600;
          span {
            margin-right: 10px;
          }
        }

        h1 {
          position: absolute;
          top: 0px;
          left: 10px;
        }
      }

      .bingBox {
        position: relative;
        .btn {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        .userReport{
          position: absolute;
          bottom: 50px;
          right: 10px;
        }
        h1 {
          position: absolute;
          top: 10px;
          left: 10px;
        }
      }
    }
  }
</style>
