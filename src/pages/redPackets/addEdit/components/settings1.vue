<template>
    <div class="con">

        <p>红包设置：</p>
        <div>
            单独购买好友助学现金红包
            <el-row type="flex" justify="space-between" style="margin-top:15px">
                <el-col :span="8">
                    <span>
                        <span style="color:red">*</span>红包金额：</span>
                    <el-input v-model="aloneMoney" @blur="checkAlone(1)" class="ion"></el-input>
                    <span>元</span>
                </el-col>
                <el-col :span="8">
                    <span>
                        <span style="color:red">*</span>红包个数：</span>
                    <el-input v-model="aloneAmout" @blur="checkAlone(2)" class="ion"></el-input>
                    <span>个</span>
                </el-col>
                <el-col :span="8">
                    <span>
                        <span style="color:red">*</span>红包最少：</span>
                    <el-input v-model="aloneLimit" @blur="checkAlone(3)" class="ion"></el-input>
                    <span>元</span>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:50px">
            拼团购买好友助学现金红包
            <el-row type="flex" justify="space-between" style="margin-top:15px">
                <el-col :span="8">
                    <span>
                        <span style="color:red">*</span>红包金额：</span>
                    <el-input v-model="groupMoney" @blur="checkGroup(1)" class="ion"></el-input>
                    <span>元</span>
                </el-col>
                <el-col :span="8">
                    <span>
                        <span style="color:red">*</span>红包个数：</span>
                    <el-input v-model="groupAmout" @blur="checkGroup(2)" class="ion"></el-input>
                    <span>个</span>
                </el-col>
                <el-col :span="8">
                    <span>
                        <span style="color:red">*</span>红包最少：</span>
                    <el-input v-model="groupLimit" @blur="checkGroup(3)" class="ion"></el-input>
                    <span>元</span>
                </el-col>
            </el-row>
        </div>

        <div class="btn" style="margin-bottom:20px">
            <el-button type="info" plain @click="goBack">上一步</el-button>
            <el-button type="primary" plain :disabled="!onlyRead" @click="goNext">下一步</el-button>
        </div>

    </div>
</template>

<script>
    import { mapGetters, mapActions } from "vuex";
    export default {
      data() {
        return {
          aloneMoney: "",
          aloneAmout: "",
          aloneLimit: "",
          groupMoney: "",
          groupAmout: "",
          groupLimit: ""
        };
      },
      created() {},
      watch: {
        getThird: {
          handler() {
            if (this.$route.params.id) {
              this.aloneMoney = this.getThird.aloneMoney;
              this.aloneAmout = this.getThird.aloneAmout;
              this.aloneLimit = this.getThird.aloneLimit;
              this.groupMoney = this.getThird.groupMoney;
              this.groupAmout = this.getThird.groupAmout;
              this.groupLimit = this.getThird.groupLimit;
            }
          },
          immediate: true
        }
      },
      computed: {
        ...mapGetters(["getThird"]),
        onlyRead() {
          return (
            (this.aloneMoney && this.aloneAmout && this.aloneLimit) ||
            (this.groupMoney && this.groupAmout && this.groupLimit)
          );
        }
      },
      methods: {
        goBack() {
          this.$store.commit("changeStep", 1);
        },
        goNext() {
          if (
            (Number(this.aloneMoney) > 0 &&
              Number(this.aloneAmout) > 0 &&
              Number(this.aloneLimit)) > 0 ||
            (Number(this.groupMoney) > 0 &&
              Number(this.groupAmout) > 0 &&
              Number(this.groupLimit) > 0)
          ) {
            this.$store.commit("saveThird", {
              aloneMoney: this.aloneMoney,
              aloneAmout: this.aloneAmout,
              aloneLimit: this.aloneLimit,
              groupMoney: this.groupMoney,
              groupAmout: this.groupAmout,
              groupLimit: this.groupLimit
            });
            this.$store.commit("changeStep", 3);
          } else {
            this.$message.error("输入应为大于0的数字！");
          }
        },
        checkAlone(num) {
          if (
            isNaN(Number(this.aloneMoney)) ||
            Number(this.aloneMoney) < 0 ||
            this.aloneMoney > 500 ||
            this.aloneMoney > sessionStorage.getItem("leastPrice") * 0.3
          ) {
            this.$message.error("输入金额应该不大于课程价格的30%！");
            this.aloneMoney = "";
            return;
          }
          if (num < 2) return;
          if (this.aloneAmout <= 0) {
            this.$message.error("红包个数应该大于0！");
            this.aloneAmout = "";
            return;
          }
          if (num < 3) return;
          if (this.aloneLimit > Number(this.aloneMoney / this.aloneAmout)) {
            this.$message.error("红包最小金额错误！");
            this.aloneLimit = "";
            return;
          }
        },

        checkGroup(num) {
          if (
            isNaN(Number(this.groupMoney)) ||
            Number(this.groupMoney) < 0 ||
            this.groupMoney > 300 ||
            this.groupMoney > sessionStorage.getItem("leastPrice") * 0.3
          ) {
            this.$message.error("输入金额应该不大于课程价格的30%！");
            this.groupMoney = "";
            return;
          }
          if (num < 2) return;
          if (this.groupAmout <= 0) {
            this.$message.error("红包个数应该大于0！");
            this.groupAmout = "";
            return;
          }
          if (num < 3) return;
          if (this.groupLimit > Number(this.groupMoney / this.groupAmout)) {
            this.$message.error("红包最小金额错误！");
            this.groupLimit = "";
            return;
          }
        }
      }
    };
</script>

<style scoped lang="less">
    .con {
      width:60%;
      margin:30px auto 0;
      p {
        color: #007ace;
        font-size: 24px;
        margin-bottom: 10px;
      }
      .already {
        width: 100%;
        padding: 20px 30px;
        box-sizing: border-box;
        background: #ffffff;
        clear: both;

        .input {
          width: 60px;
          height: 10px;
        }

        .radios {
          .radio {
            margin-bottom: 20px;
            display: block;
            margin-left: 0px;
          }
        }
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