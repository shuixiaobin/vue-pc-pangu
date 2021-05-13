<template>
    <div id="listTable">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="活动ID" width="80px">
            </el-table-column>
            <el-table-column prop="classId" label="课程ID" width="80px">
            </el-table-column>
            <el-table-column prop="classTitle" label="课程名称">
            </el-table-column>
            <el-table-column prop="price" label="原价" width="80px">
            </el-table-column>
            <el-table-column prop="discountPrice" label="优惠价" width="80px">
            </el-table-column>
            <el-table-column prop="collagePrice" label="拼团价" width="80px">
            </el-table-column>
            <el-table-column prop="beginAt" label="活动开始时间">
            </el-table-column>
            <el-table-column prop="endAt" label="活动结束时间">
            </el-table-column>
            <el-table-column prop="activityLength" label="成团有效时间">
            </el-table-column>
            <el-table-column prop="collagePeople" label="成团人数">
            </el-table-column>
            <el-table-column prop="allowCollage" label="直接参团">
                <template slot-scope="scope">
                    {{ scope.row.allowCollage =='0'?"不允许":"允许" }}
                </template>
            </el-table-column>
            <el-table-column property="status" label="活动状态" width="80">
                <template slot-scope="scope">
                    {{ scope.row.status | statusFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope" style="over-flow:hidden">
                    <el-button size="mini" style="float:left" type="primary" v-if="scope.row.status !=2 && scope.row.status !=3 " @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" style="float:left" type="success" v-if="scope.row.status == 0" @click="handleSuccess(scope.$index, scope.row)">上线</el-button>
                    <el-button size="mini" style="float:left" type="danger" v-if="scope.row.status == 1" @click="handleDelete(scope.$index, scope.row)">下线</el-button>
                    <el-button size="mini" style="float:left" @click="handleShow(scope.$index, scope.row)">效果</el-button>
                    <el-button size="mini" style="float:left" v-if="scope.row.status == 1" @click="qRCodeShow(scope.row)" v-loading.fullscreen.lock="fullscreenLoading">二维码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="classTitle" :visible.sync="dialogTableVisible" width="70%">
            <div class="block">
                <span class="demonstration">默认</span>
                <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @blur="dataTime">
                </el-date-picker>
            </div>
            <el-button size="mini" type="primary" @click="search">查询</el-button>
            <el-table :data="dialagTable">
                <el-table-column prop="all" label="总订单量（单位：个）" width="180"></el-table-column>
                <el-table-column prop="paySuccess" label="已支付订单量（单位：个）" width="200"></el-table-column>
                <el-table-column prop="refundSuccess" label="已退款订单量（单位：个）"></el-table-column>
                <el-table-column prop="rate" label="订单支付转换率（单位：%）"></el-table-column>
                <el-table-column prop="total" label="订单总金额（单位：元）"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="微信小程序二维码" :visible.sync="QRCodeVisible" width="30%" height="30%">
            <div>
                <img v-if="QRCodeUrl" :src="QRCodeUrl">
            </div>
            <p style="10px auto 5px">扫一扫预览活动，右键可复制二维码图</p>
        </el-dialog>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
      name: "listTable",
      data: function() {
        return {
          findData: {
            activityId: null,
            status: null
          },
          showData: {
            //    时间
            startTime: null,
            endTime: null,
            activityId: null
          },
          dialogTableVisible: false,
          classTitle: null,
          dialagTable: [],
          time: null,
          QRCodeVisible: false,
          QRCodeUrl: "",
          fullscreenLoading: false
        };
      },
      props: ["tableData"],
      methods: {
        // 编辑
        handleEdit(index, row) {
          var today = new Date();
          var time = new Date(row.endAt);
          // if (time.getTime() < today.getTime()) {

          if (row.status == "2" || row.status == "3") {
            alert("该课程无法修改");
          } else {
            this.$router.push({
              path: "home/spellGroup",
              name: "spellGroup",
              params: { page: row }
            });
          }
        },
        // 上线
        handleSuccess(index, row) {
          this.findData.activityId = row.id;
          this.findData.status = 1;
          console.log(this.findData);
          this.toFindList();
        },
        // 失效
        handleDelete(index, row) {
          this.findData.activityId = row.id;
          this.findData.status = 2;
          this.toFindList();
        },
        // 效果展示
        handleShow(index, row) {
          console.log(index);
          console.log(row);
          // 是否显示
          this.dialogTableVisible = true;
          // 名字
          this.classTitle = row.classTitle;
          // 数据ID
          this.showData.activityId = row.id;
          // 时间
          let beginAt = row.beginAt;
          let endAt = row.endAt;
          this.time = [new Date(beginAt), new Date(endAt)];
          this.toFindTable();
        },
        // 获取时间
        dataTime() {
          let time1 = this.time[0];
          let time2 = this.time[1];
          console.log(time1, time2);
          let dateStr1 = this.getDate(time1);
          let dateStr2 = this.getDate(time2);
          console.log(dateStr1);
          console.log(dateStr2);
          this.showData.startTime = dateStr1;
          this.showData.endTime = dateStr2;
          console.log(this.showData.activityId);
        },
        // 时间转换数据
        getDate(date) {
          console.log(date);
          let year = date.getFullYear(); //获取当前年份
          let mon = date.getMonth() + 1; //获取当前月份
          let da = date.getDate(); //获取当前日
          let h = date.getHours(); //获取小时
          let m = date.getMinutes(); //获取分钟
          let s = date.getSeconds(); //获取秒
          return year + "-" + mon + "-" + da + "-" + " " + h + ":" + m + ":" + s;
        },
        // 时间查询数据
        search() {
          this.toFindTable();
        },
        toFindList() {
          this.myPut(`${PHP_URL}/v4/blue/blueCollage/collage_update`, this.findData)
            .then(res => {
              if (res.code == 10000) {
                this.$message.success(res.msg);
                // window.location.reload();
                this.$emit("searchInformation", "");
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        },
        toFindTable() {
          this.myGet(`${PHP_URL}/v4/blue/blueCollage/effect_query`, this.showData)
            .then(res => {
              if (res.code == 10000) {
                console.log(res.data);
                this.dialagTable = [];
                this.dialagTable.push(res.data);
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        },
        qRCodeShow(row) {
          this.QRCodeUrl = "";
          this.fullscreenLoading = true;
          axios({
            method: "post",
            url: "http://api.huatu.com/lumenapi/v4/wechat/mini_app/share_code",
            data: {
              scene: `${row.id}_${row.classId}_${row.videoType}`,
              page: "pages/activityInfo/components/activityDetail",
              width: 250,
              auto_color: false,
              line_color: { r: "236", g: "66", b: "76" },
              is_hyaline: true
            }
          })
            .then(res => {
              this.fullscreenLoading = false;
              if (res.data.code == 10000) {
                this.QRCodeVisible = true;
                this.QRCodeUrl = res.data.data.src;
              }
            })
            .catch(err => {
              this.fullscreenLoading = false;
              this.$message.error(err.message);
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

<style scope lang="less">
    #listTable {
      text-align: center;
    }
    .el-button {
      margin: 2px;
    }
</style>
