<template>
    <div class="con">
        <div class="message">
            <h3>活动信息：</h3>
            <div class="show">
                <h5>活动名称：{{getFirst.activityName}}小时</h5>
                <h5>活动时间：{{getFirst.startTime}}-----{{getFirst.endTime}}</h5>
                <h5>活动类型：发红包</h5>
                <h5>活动标签：{{getFirst.activityTag}}</h5>
                <h5>标签描述：{{getFirst.tagDescribe}}</h5>
            </div>
        </div>
        <div class="active">
            <h3>活动课程：</h3>
            <el-table :data="chooseList" border class="two">
                <el-table-column prop="classId" label="课程ID" width="100">
                </el-table-column>
                <el-table-column prop="classTitle" label="课程名称">
                </el-table-column>
                <el-table-column prop="classPrice" label="课程价格" width="100">
                </el-table-column>
                <el-table-column prop='status' label="课程状态" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.status | statusFormat }}
                    </template>
                </el-table-column>
                <el-table-column prop='createDate' label="创建日期" width="200">
                </el-table-column>
            </el-table>
        </div>
        <h3>红包信息：</h3>
        <div class="show hong">
            <h2>单独购买红包</h2>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="好友助学红包:">
                    <span>红包金额{{getThird.aloneMoney}}</span>
                </el-form-item>
                <el-form-item label="红包个数">
                    <span>{{getThird.aloneAmout}}个</span>
                </el-form-item>
                <el-form-item label="红包最少">
                    <span>{{getThird.aloneLimit}}元</span>
                </el-form-item>
            </el-form>
            <h2>拼团购买红包</h2>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="好友助学红包:">
                    <span>红包金额{{getThird.groupMoney}}</span>
                </el-form-item>
                <el-form-item label="红包个数">
                    <span>{{getThird.groupAmout}}个</span>
                </el-form-item>
                <el-form-item label="红包最少">
                    <span>{{getThird.groupLimit}}元</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="btn" v-if="!onlineShow">
            <el-button type="info" plain @click="goBack">上一步</el-button>
            <el-button type="primary" plain @click="add" v-if="isEdit">创建活动</el-button>
            <el-button type="primary" v-if="!isEdit" plain @click="update">更新活动</el-button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from "vuex";
    export default {
      props: ["onlineShow"],
      data() {
        return {
          chooseList: []
        };
      },
      computed: {
        ...mapGetters(["getFirst", "getChooseId", "getThird"]),
        isEdit() {
          return !this.$route.params.id;
        }
      },
      created() {
        this.getChooseList();
      },
      watch: {
        getChooseId(newVal, oldVal) {
          this.getChooseList();
        }
      },
      methods: {
        getChooseList() {
          this.axios({
            method: "get",
            url:
              PHP_URL +
              "/v4/blue/redEnvelope/get_old_class?rid=" +
              this.getChooseId.toString(),
            data: {}
          }).then(res => {
            if (res.data.code == 10000) {
              this.chooseList = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        },
        getDate(date) {
          if (!date || !date.getFullYear) return date;
          let year = date.getFullYear(); //获取当前年份
          let mon = date.getMonth() + 1; //获取当前月份
          if (mon < 10) {
            mon = "0" + mon;
          }
          let da = date.getDate(); //获取当前日
          if (da < 10) {
            da = "0" + da;
          }
          let h = date.getHours(); //获取小时
          if (h < 10) {
            h = "0" + h;
          }
          let m = date.getMinutes(); //获取分钟
          if (m < 10) {
            m = "0" + m;
          }
          let s = date.getSeconds(); //获取秒
          if (s < 10) {
            s = "0" + s;
          }
          return year + "-" + mon + "-" + da + " " + h + ":" + m + ":" + s;
        },
        update() {
          this.axios({
            method: "put",
            url: ` ${PHP_URL}/v4/blue/redEnvelope/activity_details_update`,
            data: {
              activityId: this.$route.params.id,
              classIds: this.getChooseId.toString(),
              activeName: this.getFirst.activityName,
              activeLabel: this.getFirst.activityTag,
              lableDesc: this.getFirst.tagDescribe,
              beginTime: this.getFirst.startTime,
              endTime: this.getFirst.endTime,
              aloneByPrice: this.getThird.aloneMoney,
              aloneNum: this.getThird.aloneAmout,
              aloneMiniPrice: this.getThird.aloneLimit,
              collageByPrice: this.getThird.groupMoney,
              collageNum: this.getThird.groupAmout,
              collageMiniPrice: this.getThird.groupLimit
            }
          }).then(res => {
            console.log(res);
            if (res.data.code == 10000) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push({ name: "redlist" });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        },
        add() {
          this.axios({
            method: "POST",
            url: ` ${PHP_URL}/v4/blue/redEnvelope/set_red_envelope`,
            data: {
              rid: this.getChooseId.toString(),
              activeName: this.getFirst.activityName,
              activeLabel: this.getFirst.activityTag,
              lableDesc: this.getFirst.tagDescribe,
              createTime: this.getDate(new Date().getTime()),
              beginTime: this.getFirst.startTime,
              endTime: this.getFirst.endTime,
              aloneByPrice: this.getThird.aloneMoney,
              aloneNum: this.getThird.aloneAmout,
              aloneMiniPrice: this.getThird.aloneLimit,
              collageByPrice: this.getThird.groupMoney,
              collageNum: this.getThird.groupAmout,
              collageMiniPrice: this.getThird.groupLimit
            }
          }).then(res => {
            if (res.data.code == 10000) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push({ name: "redlist" });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        },
        goBack() {
          this.$store.commit("changeStep", 2);
        }
      },
      filters: {
        statusFormat: t => {
          switch (Number(t)) {
            case 0:
              return "未上线";
            case 1:
              return "已上线";
            case 2:
              return "已失效";
            case 3:
              return "已结束";
            default:
              return t;
          }
        }
      }
    };
</script>

<style scoped lang="less">
    .con {
      width:100%;
      margin:30px auto 0;
      h3 {
        font-weight: normal;
        color: #007ace;
        font-size: 14px;
        margin: 30px 0 10px;
      }
      .show {
        padding-left:20px;
        h5 {
          line-height: 40px;
        }
      }
      .active {
        padding-top: 10px;
        width: 95%;
      }
    }
    .btn {
      margin-top: 30px;
      text-align: center;
    }
    .color {
      margin-left: 10px;
      color: #cccccf;
    }
    .on {
      background: #007acd;
    }
    .hong {
      padding-top:20px;
    }
</style>
