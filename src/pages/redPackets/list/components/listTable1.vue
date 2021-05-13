<template>
    <div id="listTable">
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="activityId" label="活动ID" width="100px">
            </el-table-column>
            <el-table-column prop="activeName" label="活动名称" width="300px">
            </el-table-column>
            <el-table-column prop="collageByPrice" label="好友红包金额" width="200px">
                <template slot-scope="scope">
                    {{ scope.row.collageByPrice}}（拼团） <br>{{ !scope.row.aloneByPrice?"未设置":scope.row.aloneByPrice}}（单独购买）
                </template>
            </el-table-column>

            <el-table-column prop="beginTime" label="活动开始时间">
            </el-table-column>
            <el-table-column prop="endTime" label="活动结束时间">
            </el-table-column>

            <el-table-column property="status" label="活动状态" width="80">
                <template slot-scope="scope">
                    {{ scope.row.status | statusFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400">
                <template slot-scope="scope" style="over-flow:hidden">
                    <el-button size="mini" style="float:left" type="primary" v-if="scope.row.status !=2 && scope.row.status !=3 " @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" style="float:left" type="success" v-if="scope.row.status == 0" @click="handleSuccess(scope.$index, scope.row)">上线</el-button>
                    <el-button size="mini" style="float:left" type="danger" v-if="scope.row.status == 0" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button size="mini" style="float:left" type="danger" v-if="scope.row.status == 1" @click="downSuccess(scope.$index, scope.row)">下线</el-button>
                    <el-button size="mini" style="float:left" type="success" v-if=" '134'.indexOf(Number(scope.row.status)) >-1" @click="getDetail(scope.$index, scope.row)" plain>查看</el-button>
                    <el-button size="mini" style="float:left" type="success" v-if=" scope.row.status != 4" @click="handleShow(scope.$index, scope.row)">查看效果</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="详情" :visible.sync="dialogVisible" width="65%" height="70%">
            <complete onlineShow='true' style="margin-top:-40px;margin-left:1%"></complete>
        </el-dialog>
        <el-dialog title="查看效果" :visible.sync="dialogTableVisible" width="70%">
            <el-form :inline="true" style="margin-left:-35%;margin-bottom:20px">
                <span style="margin-right:20px;font-size:20px">活动时间:</span>
                <el-date-picker v-model="setDateAry" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form>

            <el-form :inline="true" class="dialogContent">
                <p>订单情况</p>
                <el-form-item>
                    <el-table :data="[resultData]" stripe border>
                        <el-table-column prop="OrderAllNum" label="总订单量(个)" width="150"  align="center">
                        </el-table-column>
                        <el-table-column prop="payNum" label="已支付订单量(个)" width="150" align="center">
                        </el-table-column>
                        <el-table-column prop="refundOrder" label="已退款订单量(个)" width="130" align="center">
                        </el-table-column>
                        <el-table-column prop="payConversion" label="订单支付转化率" width="120" align="center">
                        </el-table-column>
                        <el-table-column prop="turnbackMoney" label="退款总金额" width="150" align="center">
                        </el-table-column>
                        <el-table-column prop="moneySum" label="订单总金额" width="150" align="center">
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <p>正常购买红包发放情况</p>
                <el-form-item>
                    <el-table :data="[resultData]" stripe border>
                        <el-table-column prop="aloneRedNum" label="好友红包发放个数" width="185" align="center">
                        </el-table-column>
                        <el-table-column prop="aloneclaimNum" label="好友红包领取个数" width="185" align="center">
                        </el-table-column>
                        <el-table-column prop="alonePutForward" label="好友红包提现比例" width="150" align="center">
                        </el-table-column>
                        <el-table-column prop="alonebyClassNum" label="好友购买课程个数" width="185" align="center">
                        </el-table-column>
                        <el-table-column prop="alonefriendConversionRate" label="好友转化率" width="150" align="center">
                        </el-table-column>
                        <el-table-column prop="aloneMoney" label="好友红包提现金额" width="150 align="center"">
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <p>拼团红包发放情况</p>
                <el-form-item>
                    <el-table :data="[resultData]" stripe border>
                        <el-table-column prop="collageRed" label="好友红包发放个数" width="150" align="center">
                        </el-table-column>
                        <el-table-column prop="collageClaimNum" label="好友红包领取个数" width="150" align="center">
                        </el-table-column>
                        <el-table-column prop="collagePutForward" label="好友红包提现比例" width="150" align="center">
                        </el-table-column>
                        <el-table-column prop="collageByClassNum" label="好友购买课程个数" width="140" align="center">
                        </el-table-column>
                        <el-table-column prop="collagefriendConversionRate" label="好友转化率" width="110" align="center">
                        </el-table-column>
                        <el-table-column prop="collageMoney" label="好友红包提现金额" width="150" align="center">
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import complete from "@/pages/redPackets/addEdit/components/complete1";
    export default {
      name: "listTable",
      components: {
        complete
      },
      data: function() {
        return {
          findData: {
            activityId: null,
            classIds: "",
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
          dialogVisible: false,
          setDateAry: [],
          resultData: "",
          currentId: ""
        };
      },
      props: ["tableData"],
      methods: {
        // 编辑
        handleEdit(index, row) {
          if (row.status == "2" || row.status == "3" || row.status == "4") {
            alert("该课程无法修改");
          } else {
            this.getEditDetail(row);
          }
        },
        // 上线
        handleSuccess(index, row) {
          this.findData.activityId = row.activityId;
          this.findData.status = 1;
          this.getClassId(row.activityId);
        },
        // 下线
        downSuccess(index, row) {
          this.findData.activityId = row.activityId;
          this.findData.status = 2;
          this.getClassId(row.activityId);
        },
        // 删除
        handleDelete(index, row) {
          this.findData.activityId = row.activityId;
          this.findData.status = 4;
          this.getClassId(row.activityId);
        },
        getClassId(id) {
          this.myGet(
            `${PHP_URL}/v4/blue/redEnvelope/activity_details?activityId=${id}`
          )
            .then(res => {
              if (res.code == 10000) {
                var ary = [];
                [].concat(res.data.classList).map(item => {
                  ary.push(item.classId);
                  this.findData.classIds = ary.toString();
                });
              }
            })
            .then(() => {
              this.changeStatus();
            });
        },
        // 效果展示
        handleShow(index, row) {
          this.setDateAry = [];
          this.dialogTableVisible = true;
          this.currentId = row.activityId;
          this.getEffect(this.currentId);
        },
        getEditDetail(row) {
          this.myGet(
            `${PHP_URL}/v4/blue/redEnvelope/activity_details?activityId=${
              row.activityId
            }`
          )
            .then(res => {
              if (res.code == 10000) {
                //this.$store.commit("resetData");
                this.$store.commit("editData", res.data);
                this.$router.push({
                  name: "addred",
                  params: { id: row.activityId, status: row.status }
                });
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        },
        changeStatus() {
          this.myPut(`${PHP_URL}/v4/blue/redEnvelope/status_update`, this.findData)
            .then(res => {
              if (res.code == 10000) {
                this.$message.success(res.msg);
                this.$emit("searchInformation");
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        },
        getDetail(index, row) {
          this.myGet(
            `${PHP_URL}/v4/blue/redEnvelope/activity_details?activityId=${
              row.activityId
            }`
          )
            .then(res => {
              if (res.code == 10000) {
                this.$store.commit("editData", res.data);
                this.dialogVisible = true;
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        },

        getEffect(id, time) {
          var url = `${PHP_URL}/v4/blue/redEnvelope/red_packet_details?activityId=${id}`;
          if (time && [].concat(time).length > 0)
            url += `&startTime=${time[0]}&endTime=${time[1]}`;
          this.myGet(url)
            .then(res => {
              if (res.code == 10000) {
                this.resultData = res.data;
                console.log(this.resultData);
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      },
      watch: {
        setDateAry: function(newVal, oldVal) {
          this.getEffect(this.currentId, newVal);
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
            case 4:
              return "已删除";
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

    .dialogContent {
      background: #cdd7e5;
      overflow: hidden;
      padding-top: 50px;
      p {
        text-align: left;
        margin-left: 150px;
        margin-bottom: 10px;
        font-size: 20px;
      }
    }

    .el-button {
      margin: 2px;
    }
</style>