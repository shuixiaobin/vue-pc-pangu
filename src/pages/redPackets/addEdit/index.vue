<template>
    <div>
      <div class="container-title">
         <h2>创建</h2>
         <el-button type="primary" size="mini" plain @click="goBack">返回</el-button>
      </div>
      <div class="container">
        <ul class="step">
            <li v-for="(items,index) in msg" :key="index" :class="{'on':items.bool}" @click="goTab(items.step)">
                <span>{{items.step+1}}</span>{{items.title}}
            </li>
        </ul>
        <activityInformation v-show="getStep==0"></activityInformation>
        <chooseCourse v-show="getStep==1"></chooseCourse>
        <settings v-show="getStep==2"></settings>
        <complete v-if="getStep==3"></complete>
      </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from "vuex";
    import activityInformation from "@/pages/redPackets/addEdit/components/activityInformation1";
    import chooseCourse from "@/pages/redPackets/addEdit/components/chooseCourse1";
    import settings from "@/pages/redPackets/addEdit/components/settings1";
    import complete from "@/pages/redPackets/addEdit/components/complete1";

    export default {
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
              title: "设置红包",
              step: 2,
              bool: false
            },
            {
              title: "完成",
              step: 3,
              bool: false
            }
          ]
        };
      },
      created() {
        //创建、编辑
        this.$store.commit("changeStep", 0);
        //console.log(this.$route.params);
      },
      computed: {
        ...mapGetters(["getStep"])
      },
      watch: {
        getStep() {
          this.msg.forEach((item, index) => {
            if (item.step == this.getStep) {
              item.bool = true;
            } else {
              item.bool = false;
            }
          });
        }
      },
      methods: {
        goBack: function() {
          this.$router.push({ name: "redlist" });
        },
        goTab: function(flag) {
          if (this.getStep > flag) {
            this.$store.commit("changeStep", flag);
          }
        }
      }
    };
</script>
<style lang='less' scoped>
    .container {
      .step {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        line-height: 60px;
        li {
          flex: 1;
          text-align: center;
          span {
            display: inline-block;
            box-sizing: border-box;
            width: 25px;
            height: 25px;
            line-height: 25px;
            margin-right: 10px;
            background: #cdd7e5;
          }
        }
      }
      .on {
        color: #007acd;
      }
    }
</style> 
