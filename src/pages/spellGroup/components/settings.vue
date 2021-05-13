<template>
    <div class="con">
        <el-alert title="优惠价不能高于原价" v-if="comparebull" type="warning" center show-icon></el-alert>
        <el-alert title="优惠价不能小于等于拼团价" v-if="comparesbull" type="warning" center show-icon></el-alert>

        <p>拼团设置：</p>
        <div class="settingprice">
            设置拼团价：<el-input class="input" v-model="collagePrice" @change="ifnull" placeholder="请输入拼团价" ></el-input>
        </div>
        <el-table v-if="getInfoList.length >0" :data="getInfoList" border style="width: 100%">
            <el-table-column prop="rid" label="课程ID" width="180">
            </el-table-column>
            <el-table-column prop="title" label="课程名称" width="250">
            </el-table-column>
            <el-table-column prop="price" label="原价" width="180">
            </el-table-column>
            <el-table-column prop="actualPrice" label="优惠价" width="180">
            </el-table-column>
            <!-- <el-table-column label="拼团价" width="180">
                <template slot-scope="scope">
                    <el-input v-model="collagePrice" @change="ifnull" placeholder="拼团价"></el-input>
                </template>
            </el-table-column> -->
        </el-table>
        <!-- <el-table v-if="dateInfo.length ==0" :data="[values]" border style="width: 100%">
            <el-table-column prop="classId" label="课程ID" width="180">
            </el-table-column>
            <el-table-column prop="classTitle" label="课程名称" width="250">
            </el-table-column>
            <el-table-column prop="price" label="原价" width="180">
            </el-table-column>
            <el-table-column label="优惠价" prop="discountPrice" width="180">
            </el-table-column>
            <el-table-column label="拼团价" width="180">
                <template slot-scope="scope">
                    <el-input v-model="collagePrice" @change="ifnull" placeholder="拼团价"></el-input>
                </template>
            </el-table-column>
        </el-table> -->
        <p>已购人数显示设置</p>

        <div class="already">
            <el-radio-group v-model="persons" class="radios">
                <el-radio :label="0" class="radio">显示实际购买人数（含默认基数或自定义基数）</el-radio>
                <el-radio :label="1" class="radio">在实际购买人数的基础上，每小时增加
                    <el-input v-model="addPerson" class="input"></el-input>
                </el-radio>
                <el-radio :label="2" class="radio">每增加一人参团，则增加
                    <el-input v-model="addsPerson" class="input"></el-input>人作为购买人数</el-radio>
            </el-radio-group>
        </div>
        <div class="btn">
            <el-button type="info" plain @click="btns">上一步</el-button>

            <el-button type="primary" plain :disabled="!onlyRead" @click="btn">下一步</el-button>
        </div>

    </div>
</template>

<script>
    import { mapGetters} from 'vuex';

    export default {
      name: "settings",
      props: ["getId", "values"],
      data() {
        return {
          msg: "",
          options: "",
          dateInfo: [],
          last_page: "",
          totals: "",
          currentPage: "",
          setInfo: {},
          discountPrice: "",
          collagePrice: "",
          classId: [],
          addPerson: "",
          addsPerson: "",
          persons: 0,
          d: 3,
          ds: 1,
          id: 0,
          checkbool: true,
          comparebull: false,
          comparesbull: false
        };
      },
      created() {
        console.log(this.getInfoList)
        // if (this.values != null) {
        //     console.log(this.classId);
        //     this.discountPrice = this.values.discountPrice;
        //     this.collagePrice = this.values.collagePrice;
        //     this.axios
        //         .get(
        //             `http://testapi.huatu.com/lumenapi/v4/blue/blueCollage/collage_classes?type=2&keyWord=${
        //     this.classId
        //   }`
        //         )
        //         .then(response => {
        //             this.dateInfo = response.data.data.data;
        //             this.checkbool = false;
        //         })
        //         .catch(function(error) {
        //             console.log(error);
        //         });
        // } else {
        //     this.discountPrice = this.discountPrice;
        //     this.collagePrice = this.discountPrice;
        //     this.axios
        //         .get(
        //             `http://testapi.huatu.com/lumenapi/v4/blue/blueCollage/collage_classes?type=2&keyWord=${
        //     this.classId
        //   }`
        //         )
        //         .then(response => {
        //             this.dateInfo = response.data.data.data;
        //         })
        //         .catch(function(error) {
        //             console.log(error);
        //         });
        // }
      },
      watch: {
        getId: {
          handler: function(id) {
            // alert(111);
            
            this.classId = this.getId;

            if (this.values != null) {
              this.discountPrice = this.values.discountPrice;
              this.collagePrice = this.values.collagePrice;
              if (!this.classId) return;
              this.axios
                .get(
                  `${PHP_URL}/v4/blue/blueCollage/collage_classes?type=2&keyWord=${
                    this.classId
                  }`
                )
                .then(response => {
                  this.dateInfo = response.data.data.data;
                })
                .catch(function(error) {
                  console.log(error);
                });
            } else {
             console.log(this.classId)
              //   this.discountPrice = this.discountPrice;
              //   this.collagePrice = this.discountPrice;
              this.axios
                .get(
                  `${PHP_URL}/v4/blue/blueCollage/collage_classes?type=2&keyWord=${
                    this.classId
                  }`
                )
                .then(response => {
                  this.dateInfo = response.data.data.data;
                  console.log(this.dateInfo);
                  // this.discountPrice = this.dateInfo[0].actualPrice;
                  // console.log(this.discountPrice)
                  // this.oldPrice = this.dateInfo[0].price;
                })
                .catch(function(error) {
                  console.log(error);
                });
            }
          },
          immediate: true
        },
        persons() {
          if (this.persons == 1) {
            this.addsPerson = "";
          } else if (this.persons == 2) {
            this.addPerson = "";
          }
        }
      },
      computed: {
        onlyRead() {
          return (
            this.collagePrice &&
            (this.persons == 0 ||
              (this.persons && (this.addPerson || this.addsPerson)))
          );
        },
        ...mapGetters(['getInfoList'])
      },
      methods: {
        ifnull() {
          let price = this.getInfoList.map(res=>{
            return parseInt(res.actualPrice)
          });
          let one = price[0]
          for(let i in price){
            if(one<price[i]){
              one = price[i];
            }
          }
          // console.log("输入价格"+this.collagePrice);
          // console.log("价格数组"+price)
          // console.log("最高价格"+one)
          if (this.collagePrice <= 0) {
            this.collagePrice = "";
            this.$message.error("拼团价格应该大于0");
          } else if (one * 1 < this.collagePrice * 1) {
            this.$message.error("不能高于优惠价");
            this.collagePrice = "";
            return;
          }
        },


        btn() {
          //   if (this.persons && !this.addPerson) {
          //     this.$message.error("增加人数不能为空");
          //     return;
          //   }
          // 展示那一页
          this.$emit("ds", this.d);
          var obj;
          if (this.getInfoList.length != 0) {
            console.log(this.getInfoList)
            obj = this.getInfoList
          }
          // } else {
          //   obj = this.dateInfo;
          //   console.log(this.dateInfo);
          //   if (this.values != null) {
          //     //在编辑状态重新选择课程
          //     this.values.price = this.dateInfo[0].price;
          //     this.discountPrice = this.dateInfo[0].actualPrice;
          //   }
          // }

          console.log(obj);
          this.setInfo = {
            dateInfo: obj,
            // discountPrice: this.discountPrice,
            collagePrice: this.collagePrice,
            persons: this.persons,
            addPerson:
              this.persons == 1
                ? this.addPerson
                : this.persons == 2 ? this.addsPerson : ""
          };
         
          // if (this.values != null) {
          //   this.setInfo.price = this.values.price;
          // } else {
          //   this.setInfo.price = this.dateInfo[0].price;
          // }
           console.log(this.setInfo)
          this.$emit("sendsetInfo", this.setInfo);
        },
        btns() {
          this.$emit("dds", this.ds);
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
    #price{
      display: inline-block;
    }
    .settingprice{
      margin:20px 0;
      width:50%;
      .input{
        width:20%;
        height:10px;
      }
    }
</style>