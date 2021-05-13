<template>
    <div class="relevance-search">
        <el-col :span="5" class="noMK">
            <el-col :span="8">
                <el-checkbox v-model="showClass" :disabled="isSuit==0">只显示课件名称</el-checkbox>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" size="mini" @click="relevance" icon="el-icon-plus">关联课程</el-button>
            </el-col>
        </el-col>
        <el-col :span="14">
            <div class="name-wrapper" v-show="isSuit!=0&&isMianKu!=4">
                <span class="title">阶段名称：</span>
                <el-input style="width:328px" v-model="stageName" size="mini" placeholder="请输入内容" :disabled="isFlag ==2"></el-input>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAddStage" plain :disabled="isFlag ==1||isFlag ==2">新增</el-button>
                <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click="handleRelevanceStage" plain :disabled="isFlag ==0||isFlag ==2||isFlag==null">关联阶段大纲</el-button>
                <el-button type="primary" size="mini" icon="el-icon-document" @click="handleBatchSort" :disabled="isFlag==2" plain>批量调整顺序</el-button>
            </div>
        </el-col>
        <el-col :span="2" style="text-align:right">
            <el-button type="primary" size="mini" @click="syncHandle">同步</el-button>
        </el-col>
        <el-col :span="2" style="text-align:right">
            <el-button type="primary" size="mini" @click="OperationLog('show')">操作日志</el-button>
        </el-col>
        <div class="newBtn">
            <el-col :span="12" style="text-align:right" v-show="isFlag===2">
                <el-button type="primary" size="mini" @click="handleExamDialog">关联阶段测试</el-button>
            </el-col>
            <el-col :span="12" style="text-align:right;margin-left:20px">
                <el-button type="primary" size="mini" v-if="allSwitch.all_switch_display===1" @click="changeSwitch(allSwitch.all_switch_status)">{{allSwitch.all_switch_status===0?'全部开启学习报告':'全部关闭学习报告'}}</el-button>
            </el-col>
        </div>
        <operationlog-dialog :dialogTableVisible="dialogTableVisible" @colseDialog="OperationLog('hide')" ref="operationLog"></operationlog-dialog>
        <exam-dialog ref="examDialogShow"></exam-dialog>
    </div>
</template>

<script>
    import { getParams } from "@/config/utils";
    const ERR_OK = 10000;
    import operationlogDialog from "@/pages/classRelevance/components/operationLogDialog";
    import examDialog from "./examDialog";
    export default {
      props: {
        isFlag: {
          type: Number,
          default: null
        },
        allSwitch: {
          type: Object,
          default: {}
        }
      },
      components: {
        operationlogDialog,
        examDialog
      },
      created() {
        console.log(this.isFlag);

        if (this.isSuit == 0) {
          this.showClass = true;
        } else if (this.isSuit == 1) {
          this.showClass = false;
        }
      },
      watch: {
        isFlag(val) {
          if (val == 2) {
            this.showClass = true;
          }
        }
      },
      data() {
        return {
          showClass: false,
          stageName: "", //阶段名称
          netClassId: getParams("netClassId"), //课程id
          /**
           * sSuit是否是套餐0否1是isMianKu
           * 4为面酷
           * 当isMianKu=4&&isSuit=1时只能创建二层结构
           * 当isMianKu=4&&isSuit=0时只能创建一层结构
           */
          isMianKu: getParams("isMianKu"), //是否是面库后台
          isSuit: getParams("isSuit"),
          dialogTableVisible: false, //大纲操作日志弹窗
          examDialogVisible: false //关联考试弹窗
        };
      },
      computed: {
        userName() {
          return localStorage.getItem("userName"); //localStorage.getItem("userName") 'htwx_3855101';
        },
        userId() {
          return localStorage.getItem("userId"); //localStorage.getItem("userId") 842;
        }
      },
      methods: {
        // 全部开启学习报告
        changeSwitch(status) {
          // this.$emit('openTestStatus')
          this.$confirm("是否全部开启?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.myPost(`${PHP_URL}/v5/pc/syllabus/study_report_switch_batch`, {
                netClassId: this.netClassId,
                status: status === 1 ? 0 : 1
              })
                .then(res => {
                  if (res.code === 10000) {
                    this.$emit("updata");
                  }
                })
                .catch(err => {
                  this.$message.error(err.message);
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        },
        handleExamDialog() {
          this.$refs.examDialogShow.isShow();
        },
        // 同步数据
        syncHandle() {
          this.$confirm("是否同步?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.myGet(`${PHP_URL}/v4/pc/syllabus/syllabus_sync`, {
                netClassId: this.netClassId,
                userName: this.userName, //'htwx_3855101'
                userId: Number(this.userId) //842
              }).then(result => {
                if (result.code === ERR_OK) {
                  this.$emit("updata");
                } else {
                  this.$message.error(result.msg);
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        },
        // 预览页面
        preview() {
          window.location.href = `http://v.huatu.com/cla/class_detail_${
            this.netClassId
          }.htm`;
        },
        // 关联课程
        relevance() {
          this.showClass
            ? eventBus.$emit("dialogVisible", true, 3)
            : eventBus.$emit("dialogVisible", true, 2);
        },
        handleAddStage() {
          this._addStage();
        },
        handleRelevanceStage() {
          this._relevanceStage();
        },
        handleBatchSort() {
          this._relevanceBatchSort();
        },
        // 新增课程大纲阶段
        _addStage() {
          this.myPost(`${PHP_URL}/v4/pc/syllabus/create_stage`, {
            netClassId: this.netClassId,
            stageName: this.stageName,
            userName: this.userName, //'htwx_3855101'
            userId: Number(this.userId) //842
          })
            .then(result => {
              if (result.code === ERR_OK) {
                this.$emit("updata");
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        },
        // 关联课程大纲阶段
        _relevanceStage() {
          this.myPost(`${PHP_URL}/v4/pc/syllabus/syllabus_hierarchy`, {
            netClassId: this.netClassId,
            stageName: this.stageName,
            userName: this.userName, //'htwx_3855101'
            userId: Number(this.userId) //842
          })
            .then(res => {
              if (res.code === ERR_OK) {
                this.$message.success("操作成功");
                this.$emit("updata");
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        },
        // 批量排序
        _relevanceBatchSort() {
          eventBus.$emit("relevanceBatchSort", { isBatchSort: true });
        },
        //操作日志
        examDialog() {
          this.examDialogVisible = true;
        },
        OperationLog(val) {
          if (val == "show") {
            this.dialogTableVisible = true;
            this.$refs.operationLog.getlogData();
          } else {
            this.dialogTableVisible = false;
          }
        }
      }
    };
</script>
<style lang='less' scoped>
    .relevance-search {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .noMK {
        display: flex;
        justify-content: space-between;
      }
      .newBtn {
        width: 250px;
        margin-top: 20px;
        display: flex;
      }
      .name-wrapper {
        display: flex;
        align-items: center;

        .title {
          font-size: 12px;
          width: 130px;
          display: block;
        }

        .el-button {
          margin-left: 15px;
        }
      }
    }
</style>