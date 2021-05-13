<template>
    <div class="con" style="overflow:hidden">
        <el-row type="flex" justify="space-between">
            <el-col :span="3">
                <span style="color:red">*</span>活动名称：  
            </el-col>
            <el-col :span="10">
                <el-input v-model="activityName" @blur="check" :disabled="isEdit" class="ion"></el-input>
            </el-col>
            <el-col :span="10">
               <span style="color:#afa5a5">(2-20个字)</span>
            </el-col>            
        </el-row>
        <el-row type="flex" justify="space-between">
            <el-col :span="3">
                <span style="color:red">*</span>生效时间：
            </el-col>
            <el-col :span="10">
               <el-date-picker v-model="setDateAry" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-col>
             <el-col :span="10"></el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
            <el-col :span="3">
                <span style="color:red">*</span>活动标签：  
            </el-col>
            <el-col :span="10">
              <el-input v-model="activityTag" @blur="checkTagName" :disabled="isEdit" class="ion"></el-input>
            </el-col>
            <el-col :span="10">
              <span style="color:#afa5a5">(2-5个字符)</span>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between"> 
            <el-col :span="3">标签描述：</el-col>
            <el-col :span="10">
              <el-input v-model="tagDescribe" @blur="checkDescribe" :disabled="isEdit" class="ion"></el-input>
            </el-col>
            <el-col :span="10">
              <span style="color:#afa5a5">(5-10个字符)</span>
            </el-col>
        </el-row>
        <!-- <div>{{values}}</div> -->
        <div>
            <el-button type="primary" :disabled="!isReadOnly ||isEdit" @click="next" plain>下一步</el-button>
            <el-button type="primary" v-if="isEdit" @click="edit" plain>确认编辑</el-button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from "vuex";
    export default {
      name: "one",
      data() {
        return {
          activityName: "",
          setDateAry: [],
          activityTag: "",
          tagDescribe: "",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7;
            }
          },
          isEdit: false
        };
      },
      created() {
        this.isEdit = this.$route.params.status == 1 ? true : false; //已上线
      },
      computed: {
        ...mapGetters(["getFirst", "getChooseId"]),
        isReadOnly() {
          return (
            this.setDateAry.length > 0 && this.activityName && this.activityTag && this.tagDescribe
          );
        }
      },
      watch: {
        getFirst: {
          handler() {
            if (this.$route.params.id) {
              this.activityName = this.getFirst.activityName;
              this.activityTag = this.getFirst.activityTag;
              this.tagDescribe = this.getFirst.tagDescribe;
              this.setDateAry = [this.getFirst.startTime, this.getFirst.endTime];
            }
          },
          immediate: true
        }
      },
      methods: {
        next() {
          this.$store.commit("saveFirst", {
            activityName: this.activityName,
            startTime: this.setDateAry[0],
            endTime: this.setDateAry[1],
            activityTag: this.activityTag,
            tagDescribe: this.tagDescribe
          });
          this.$store.commit("changeStep", 1);
        },

        edit() {
          this.axios({
            method: "put",
            url: `${PHP_URL}/v4/blue/redEnvelope/activity_details_update`,
            data: {
              activityId: this.$route.params.id,
              beginTime: this.setDateAry[0],
              endTime: this.setDateAry[1]
              //   classId: this.getChooseId.toString()
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
        check() {
          if (this.activityName.length < 2 || this.activityName.length > 20) {
            this.$message.error("名字长度错误！");
            this.activityName = "";
          }
        },
        checkTagName() {
          if (this.activityTag.length < 2 || this.activityTag.length > 5) {
            this.$message.error("名字长度错误！");
            this.activityTag = "";
          }
        },
        checkDescribe() {
          if (this.tagDescribe.length < 5 || this.tagDescribe.length > 10) {
            this.$message.error("名字长度错误！");
            this.tagDescribe = "";
          }
        }
        // handleClose() {
        //   this.dialogVisible = false;
        // }
      }
    };
</script>

<style scoped lang="less">
    .con {
      width:60%;
      margin:30px auto 0;
      text-align:center;
      .el-row:nth-child(1) {
        height: 60px;
      }
      .el-row {
        text-align:left;
        line-height: 60px;
      }
      .btn {
        margin-left: 550px;
      }
    }
</style>
