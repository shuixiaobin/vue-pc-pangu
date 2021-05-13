<template>
    <div class="main">
        <div class="step">
            <ul class="steps" style="float:left">
                <li v-for="(items,index) in msg" :key="index" :class="{'on':items.bool}" @click="goTab(items.step)">
                    <span>{{items.step+1}}</span>{{items.title}}</li>
            </ul>
            <el-button style="float:right;margin-top:10px;margin-right:100px" type="primary" plain @click="goBack">返回</el-button>
        </div>
        <activityInformation v-show="d==0" v-on:ds="ds" v-on:sendInformation="sendInformation" :values="mes"></activityInformation>
        <chooseCourse v-if="d==1" v-on:ds="ds" v-on:dds="dds" v-on:sendId="sendId" :values="mes"></chooseCourse>
        <settings v-show="d==2" v-on:ds="ds" v-on:dds="dds" v-on:sendsetInfo="sendsetInfo" :values="mes" :getId="classId"></settings>
        <complete v-if="d==3" v-on:dds="dds" :getInformation="information" :getsetInfo="setInfo" :values="mes" :getId="classId"></complete>
    </div>
</template>

<script>
    import activityInformation from "@/pages/spellGroup/components/activityInformation";
    import chooseCourse from "@/pages/spellGroup/components/chooseCourse";
    import settings from "@/pages/spellGroup/components/settings";
    import complete from "@/pages/spellGroup/components/complete";
    import {mapGetters} from "vuex";

    export default {
      name: "spellGroup",
      components: {
        activityInformation,
        chooseCourse,
        settings,
        complete
      },
      //创建拼团活动
      data() {
        return {
          msg: [
            {
              title: "活动信息",
              step: 0,
              bool: true
            },
            {
              title: "选择课程",
              step: 1,
              bool: false
            },
            {
              title: "拼团设置",
              step: 2,
              bool: false
            },
            {
              title: "完成",
              step: 3,
              bool: false
            }
          ],
          validTime: "",
          clusters: "",
          activityTime: "",
          radio: "2",
          radio1: "3",
          d: 0,
          information: "",
          classId: "",
          mes: {},
          setInfo: []
        };
      },
      created() {
        this.mes = this.$route.params.page;
        console.log(this.$route.params)
        console.log(this.mes)
      },
      computed:{
            ...mapGetters(['getChooseRid'])
        },
      methods: {
        ds(e) {
          this.d = e;
          this.msg.forEach((item, index) => {
            if (item.step == this.d) {
              item.bool = true;
            } else {
              item.bool = false;
            }
          });
        },
        dds(e) {
          this.d = e;
          this.msg.forEach((item, index) => {
            if (item.step == this.d) {
              item.bool = true;
            } else {
              item.bool = false;
            }
          });
        },
        //接收活动信息组件传值
        sendInformation: function(information) {
          this.information = information;
        },
        //接收选择课程组件传值
        sendId: function(dataId) {
          // console.log(dataId)
          this.classId = this.getChooseRid;
          console.log(this.classId)
        },
        //接收拼团设置组件传值
        sendsetInfo: function(setInfo) {
          this.setInfo = setInfo;
          // this.classInfo = dateInfo;
          console.log(setInfo);
        },
        goBack: function() {
          this.$router.push({ name: "list" });
        },
        goTab: function(flag) {
          console.log(333333);
          if (this.d > flag) {
            this.d = flag;
            this.dds(this.d);
          }
        }
      }
    };
</script>
<style lang='less' scoped>
    .main {
      width: 100%;
      height: 100%;
      .step {
        width: 100%;
        height: 60px;
        background: #fafafa;
        .steps {
          width: 50%;
          display: flex;
          line-height: 60px;
          li {
            flex: 1;
            text-align: center;
            span {
              display: inline-block;
              box-sizing: border-box;
              margin-top: 20px;
              width: 15px;
              height: 25px;
              line-height: 30px;
              margin-right: 10px;
              background: #cdd7e5;
            }
          }
        }
      }

      .color {
        margin-left: 10px;
        color: #cccccf;
      }
      .right {
        margin-left: 330px;
      }
      .choice {
        color: #ff6650;
      }
      .notice {
        margin-left: 700px;
      }
      .on {
        background: #007acd;
      }
      .s {
        display: flex;
      }
    }
    .btn {
      margin-top: 30px;
      text-align: center;
    }
</style> 
<style lang="less">
    .main {
      .ion {
        width: 40%;
      }
    }
</style>
