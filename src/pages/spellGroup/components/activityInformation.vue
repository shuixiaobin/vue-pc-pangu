<template>
    <div class="con">

        <el-row type="flex" justify="space-between">
            <el-col :span="15">

                <span>
                    <span style="color:red">*</span>拼团活动时间：</span>
                <!-- <el-date-picker v-model="beginAt" type="date" :picker-options="pickerOptions" placeholder="选择日期"></el-date-picker> -->
                <el-date-picker v-model="setDateAry" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" size="mini" end-placeholder="结束日期 ">
                </el-date-picker>
            </el-col>

            <el-col :span="9">
                <span>
                    <span style="color:red">*</span>成团有效时间：</span>
                <el-input v-model="activityLength" @change="okbull" :disabled="resetbool" placeholder="请输入内容" class="ion"></el-input>
                <span>小时</span>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
            <el-col :span="12" class="s" style="margin-left:30px">
                <span>
                    <span style="color:red">*</span>成团人数：</span>
                <el-input v-model="collagePeople" @change="okbull" :disabled="resetbool" placeholder="请输入内容" style="width:200px" class="ion"></el-input>
                <span>人
                    <span class="color">(至少2人)</span>
                </span>
            </el-col>
            <el-col :span="4">
                <p>直接参团
                    <span class="color">(如有他人发起拼团直接参与)</span>： </p>
            </el-col>
            <el-col :span="8">
                <el-radio v-model="allowCollage" :disabled="resetbool" label="1">允许</el-radio>
                <el-radio v-model="allowCollage" :disabled="resetbool" label="0">不允许</el-radio>
            </el-col>

        </el-row>
        <el-row>
            <el-col :span="2">
                <span>拼团限制</span>
            </el-col>
            <el-col :span="22">
                <el-radio v-model="radio1" label="1" :disabled="resetbool">仅限新人参加</el-radio>
                <span class="color lag">(未购买过非0元课)</span>
                <el-radio v-model="radio1" label="2" style="margin-left:50px" :disabled="resetbool">仅限老学员参加</el-radio>
                <span class="color">(购买过非0元课)</span>
                <el-radio v-model="radio1" label="0" style="margin-left:50px" :disabled="resetbool">不限</el-radio>
            </el-col>

        </el-row>
        <!-- <div>{{values}}</div> -->
        <div class="btn">
            <el-button type="primary" :disabled="resetbool ||!isReadOnly" @click="btn" plain>下一步</el-button>
            <el-button type="primary" v-if="resetbool" @click="reset" plain>确认编辑</el-button>
            <el-button type="primary" v-if="returnbool" @click="goHome" plain>返回主页</el-button>
        </div>

    </div>
</template>

<script>
    export default {
      name: "one",
      props: ["values"],
      data() {
        return {
          msg: "",
          setDateAry: "",
          beginAt: "",
          activityLength: "",
          collagePeople: "",
          allowCollage: "0",
          radio1: "0",
          d: 1,
          echobool: false,
          information: {},
          checkbool: true,
          resetbool: false,
          returnbool: false,
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            }
          },
          endAt: ""
        };
      },
      created() {
        if (this.values == null) {
          this.checkbool = false;
          this.beginAt = this.beginAt;

          this.activityLength = this.activityLength;
          this.collagePeople == this.collagePeople;
          if (this.collagePeople < 2) {
            this.collagePeople = 2;
          }
        } else {
          //  this.beginAt = new Date(this.values.beginAt);

          this.setDateAry = [
            new Date(this.values.beginAt),
            new Date(this.values.endAt)
          ];
          this.activityLength = this.values.activityLength;
          this.collagePeople = this.values.collagePeople;
          if (this.collagePeople < 2) {
            this.collagePeople = 2;
          }
          this.allowCollage = this.values.allowCollage + "";
          if (this.values.status == 1) {
            this.resetbool = true;
            this.checkbool = true;
            this.echobool = true;
          } else if (this.values.status == 2) {
            alert("课程已失效无法修改");
            this.returnbool = true;
          } else if (this.values.status == 3) {
            alert("课程已结束无法修改");
            this.returnbool = true;
          } else {
            this.resetbool = false;
            this.checkbool = false;
            this.echobool = false;
          }
        }
      },
      computed: {
        isReadOnly() {
          return (
            this.setDateAry && this.activityLength > 0 && this.collagePeople > 1
          );
        }
      },
      methods: {
        okbull() {
          if (this.collagePeople < 2) {
            this.$message.warning("拼团人数不能小于2人呦");
            this.collagePeople = 2;
          }

          if (this.activityLength > 0 && this.activityLength.indexOf(".") > 0) {
            this.$message.warning("拼团时间为整数");
            this.activityLength = "";
          }

          //   if (
          //     this.setDateAry == "" ||
          //     this.activityLength == "" ||
          //     this.collagePeople == ""
          //   ) {
          //     this.checkbool = true;
          //     console.log(this.checkbool);
          //   } else {
          //     this.checkbool = false;
          //     console.log(this.checkbool);
          //   }
        },
        btn() {
          this.$emit("ds", this.d);

          this.information = {
            beginAt: this.setDateAry[0],
            endAt: this.setDateAry[1],
            activityLength: this.activityLength,
            collagePeople: this.collagePeople,
            allowCollage: this.allowCollage,
            radio1: this.radio1
          };
          this.$emit("sendInformation", this.information);
        },
        // getDate(date) {
        //   let year = date.getFullYear(); //获取当前年份
        //   let mon = date.getMonth() + 1; //获取当前月份
        //   if (mon < 10) {
        //     mon = "0" + mon;
        //   }
        //   let da = date.getDate(); //获取当前日
        //   if (da < 10) {
        //     da = "0" + da;
        //   }
        //   let h = date.getHours(); //获取小时
        //   if (h < 10) {
        //     h = "0" + h;
        //   }
        //   let m = date.getMinutes(); //获取分钟
        //   if (m < 10) {
        //     m = "0" + m;
        //   }
        //   let s = date.getSeconds(); //获取秒
        //   if (s < 10) {
        //     s = "0" + s;
        //   }
        //   return year + "-" + mon + "-" + da + " " + h + ":" + m + ":" + s;
        // },
        reset() {
          //   this.endAt = new Date(
          //     Date.parse(this.beginAt) + this.activityLength * 60 * 60 * 1000
          //   );
          //   this.endAt = this.getDate(this.endAt);
          this.axios({
            method: "put",
            url: `${PHP_URL}/v4/blue/blueCollage/collage_details_update`,
            data: {
              activityId: this.values.id,
              beginAt: this.setDateAry[0],
              endAt: this.setDateAry[1]
            }
          }).then(res => {
            if (res.data.code == 10000) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push({
                path: "/home/list",
                name: "list"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        },
        goHome() {
          this.$router.push({ name: "list" });
        }
      }
    };
</script>

<style scoped lang="less">
    .con {
      width: 98%;
      height: 100%;
      margin-left: 1%;
      background: #ecf1f7;
      border-top: 2px solid #d1d6dc;
      padding-left: 93px;
      padding-top: 44px;
      .el-row:nth-child(1) {
        height: 60px;
      }
      .el-row {
        line-height: 60px;
      }
      .btn {
        margin-left: 550px;
      }
    }
</style>
