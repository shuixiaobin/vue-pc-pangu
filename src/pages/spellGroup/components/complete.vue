<template>
    <div class="con">
        <div class="message">
            <p>活动信息：</p>
            <div class="show">
                <h5>拼团活动时间：{{information.beginAt}}-----{{information.endAt}}</h5>
                <h5>拼团有效时间：{{information.activityLength}}小时</h5>
                <h5>成团人数：{{information.collagePeople}}人</h5>
                <h5>直接参团：{{information.allowCollage ==0?"不允许":"允许"}}</h5>
                <h5>拼团限制：{{information.radio1 =='2'?"仅限老学员参加":(information.radio1 =='1'?'仅限新人参加':'不限')}}</h5>
            </div>
        </div>
        <div class="active">
            <p>活动课程：</p>
            <el-table :data="allInfo.dateInfo" border style="width: 95%">
                <el-table-column prop="rid" label="课程ID" width="180">
                </el-table-column>
                <el-table-column prop="title" label="课程名称" width="180">
                </el-table-column>
                <el-table-column prop="price" label="原价" width="180">
                </el-table-column>
                <el-table-column prop='actualPrice' label="优惠价" width="180">
                </el-table-column>
                <el-table-column prop='collagePrice' label="拼团价" width="180">
                </el-table-column>
                <el-table-column label="状态" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.status | statusFormat }}
                    </template>
                </el-table-column>

            </el-table>

        </div>
        <div class="btn">
            <el-button type="info" plain @click="btns">上一步</el-button>
            <el-button type="primary" plain @click="creat" v-if="creatbool">创建活动</el-button>
            <el-button type="primary" v-if="showbool" plain @click="update">更新活动</el-button>
        </div>
    </div>
</template>

<script>
    export default {
      name: "compelte",
      props: ["getInformation", "getId", "getsetInfo", "values"],
      data() {
        return {
          msg: "",
          options: "",
          dateInfo: [],
          dateInfo: [],
          dateInfos: [],
          last_page: "",
          totals: "",
          currentPage: "",
          classId: "",
          ds: 2,
          information: [],
          setInfo: [],
          classInfo: [],
          setPrice: [],
          allInfo: [],
          increasePeople: "",
          limitType: "",
          showType: "",
          showbool: false,
          creatbool: true,
          activityId: null
        };
      },
      computed: {
        currentTime: function() {
          return this.getDate(new Date());
        }
      },
      created() {
        this.classId = this.getId;
        this.information = this.getInformation;

        this.information.beginAt = this.getDate(this.getInformation.beginAt);
        this.information.endAt = this.getDate(this.getInformation.endAt);
        this.setInfo = this.getsetInfo;
        console.log(this.setInfo);
        console.log(this.classId)
        this.allInfo = Object.assign(this.setInfo, this.information, this.classId);
        console.log(this.allInfo);
        this.allInfo.dateInfo.map(item=>{
          item.beginAt = this.allInfo.beginAt,
          item.collagePrice = this.allInfo.collagePrice
        })
        // this.allInfo.dateInfo[0] = {
        //   ...this.allInfo.dateInfo[0],
        //   beginAt: this.allInfo.beginAt,
        //   discountPrice: this.allInfo.discountPrice,
        //   collagePrice: this.allInfo.collagePrice,
        //   price: this.allInfo.price
        // };
        console.log(this.allInfo.dateInfo)
        if (this.values != undefined) {
          this.activityId = this.values.id;
          console.log(111);
        }

        if (this.values == null) {
          this.showbool = false;
          this.creatbool = true;
        } else {
          this.showbool = true;
          this.creatbool = false;
        }
      },
      methods: {
        btns() {
          this.$emit("dds", this.ds);
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
        // 更新活动---------
        update() {
          this.axios({
            method: "put",
            url: `${PHP_URL}/v4/blue/blueCollage/collage_details_update`,
            data: {
              activityId: this.activityId,
              activityLength: this.allInfo.activityLength * 1,
              allowCollage: this.allInfo.allowCollage * 1,
              beginAt: this.allInfo.beginAt,
              classId: this.classId * 1,
              classTitle: this.allInfo.dateInfo[0].title,
              collagePeople: this.allInfo.collagePeople,
              collagePrice: this.allInfo.dateInfo[0].collagePrice * 1,
              discountPrice: this.allInfo.dateInfo[0].actualPrice * 1,
              endAt: this.allInfo.endAt,
              increasePeople: this.allInfo.addPerson * 1,
              limitType: this.allInfo.radio1 * 1,
              showType: this.allInfo.persons * 1
            }
          }).then(res => {
            console.log(res);
            if (res.data.code == 10000) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push({
                path: "home/list",
                name: "list"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        },
        // 创建活动--------------
        creat() {
          console.log(this.classId)
          this.axios({
            method: "POST",
            url: `${PHP_URL}/v4/blue/blueCollage/add_collage`,
            data: {
              activityLength: this.allInfo.activityLength * 1,
              allowCollage: this.allInfo.allowCollage * 1,
              beginAt: this.allInfo.beginAt,
              classId: this.classId,
              // classTitle: this.allInfo.dateInfo[0].title,
              collagePeople: this.allInfo.collagePeople * 1,
              collagePrice: this.allInfo.dateInfo[0].collagePrice * 1,
              discountPrice: this.allInfo.dateInfo[0].actualPrice * 1,
              endAt: this.allInfo.endAt,
              increasePeople: this.allInfo.addPerson * 1,
              limitType: this.allInfo.radio1 * 1,
              showType: this.allInfo.persons * 1
            }
          }).then(res => {
            console.log(res);
            if (res.data.code == 10000) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push({
                path: "/list",
                name: "list"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
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
      width: 98%;
      height: 100%;
      margin-left: 1%;
      background: #ecf1f7;
      border-top: 2px solid #d1d6dc;
      padding-left: 93px;
      padding-top: 44px;
      p {
        color: #007ace;
        font-size: 24px;
        margin-bottom: 10px;
      }
      .show {
        width: 95%;
        height: 200px;
        background: white;
        padding-left: 2%;
        h5 {
          height: 20%;
          line-height: 40px;
        }
      }
      .active {
        padding-top: 10px;
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
</style>
