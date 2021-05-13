<template>
  <div class="student-info">
    <div class="container-title">
      <h3>基础信息</h3>
    </div>
    <div class="student-info_wrapper">
      <div class="info-header">
        <img
          class="avatar"
          :src="studentInfo.userFace"
        >
        <div class="info-header_right">
          <div class="info-header-top">
            <span class="name">{{studentInfo.userRename}}</span>
            <!-- <i class="iconfont iconmale-outline"></i> -->
            <span
              class="vip"
              v-if="studentInfo.level > 0"
            >VIP{{studentInfo.level}}</span>
            <!-- <span class="yearsold">30岁（1990.04.01）</span> -->
          </div>
          <div class="info-header-bottom">
            <span class="realname">真实姓名：<b>{{studentInfo.trueName || '--'}}</b></span>
            <span class="realname">任务图币：<b>¥{{studentInfo.taskcharge}}</b></span>
            <span class="realname">充值图币：<b>¥{{studentInfo.recharge}}</b></span>
          </div>
        </div>
      </div>
      <el-row style="margin-top:10px">
        <el-col :span="8">
          <div class="label-wrapper">
            <span class="label-key">用户ID：</span>
            <div class="label"><b>{{studentInfo.userName || '--'}}</b></div>
          </div>
          <div class="label-wrapper">
            <span class="label-key">微信：</span>
            <div class="label"><b>{{studentInfo.wechatNumber || '--'}}</b></div>
          </div>
          <div class="label-wrapper">
            <span class="label-key">手机号区域：</span>
            <div class="label"><b>{{studentInfo.phoneGeo || '--'}}</b></div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="label-wrapper">
            <span class="label-key">手机：</span>
            <div class="label">
              <b v-if="phoneShow">{{studentInfo.userMobile || '--'}}</b>
              <b v-else>{{phone || '--'}}</b>
              <i
                class="iconfont "
                :class="[phoneShow?'iconeye-outline':'iconyincang']"
                @click="togglePhone"
              ></i>
            </div>
          </div>
          <div class="label-wrapper">
            <span class="label-key">QQ：</span>
            <div class="label"><b>{{studentInfo.qqNumber || '--'}}</b></div>
          </div>
          <div class="label-wrapper">
            <span class="label-key">用户真实区域：</span>
            <div class="label"><b>{{`${studentInfo.trueProvince || '--'}/${studentInfo.trueCity || '--'}/${studentInfo.trueArea || '--'}`}}</b></div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="label-wrapper">
            <span class="label-key">注册时间：</span>
            <div class="label"><b>{{studentInfo.regTime || '--'}}</b></div>
          </div>
          <div class="label-wrapper">
            <span class="label-key">身份：</span>
            <div class="label"><b>{{studentInfo.profession || '--'}}</b></div>
          </div>
          <div class="label-wrapper">
            <span class="label-key">备考时间：</span>
            <div class="label"><b>{{studentInfo.planTime || '--'}}</b></div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="label-key">当前版本：<b>{{studentInfo.terminal | filterTerminal}} {{studentInfo.cv || '--'}}</b></span>
        </el-col>
        <el-col :span="12">
          <span class="label-key">常用设备：<b>{{studentInfo.device || '--'}}</b></span>
        </el-col>
      </el-row>
      <div class="label-wrapper">
        <span class="label-key">标签
          <span class="label-key label-icon" @click="editTag"><i class="el-icon-edit"></i></span>
        </span>
        <div
          class="label"
          v-if="(studentInfo.tag && studentInfo.tag.length > 0) || (studentInfo.eventTag && studentInfo.eventTag.length > 0)"
        >
          <el-tag
            class="label-tag"
            size="small"
            v-for="item in studentInfo.tag"
            :key="item.id"
          >{{item.name}}</el-tag>
          <el-tag
            class="label-tag"
            size="small"
            v-for="item in studentInfo.eventTag"
            :key="item.id"
          >{{item.name}}</el-tag>
        </div>
        <div
          class="label"
          v-else
        >--</div>
      </div>
      <div class="userSource">
        <span class="label-key">用户来源：</span>
        <div
          class="source-wrapper"
          v-if="studentInfo.source && studentInfo.source.length > 0"
        >
          <p
            class="source-item"
            v-for="(item, index) in studentInfo.source"
            :key="index"
          ><b>{{item.time}}</b><b style="margin-left:20px">{{item.type}}</b></p>
        </div>
        <div
          class="source-wrapper"
          v-else
        >--</div>
      </div>
    </div>
    <edit-tag-dialog
      v-if="visibleDialog"
      :visibleDialog.sync="visibleDialog"
      :tag="studentInfo.tag"
      :eventTag="studentInfo.eventTag"
      :userMobile="studentInfo.userMobile"
      @updateStudentInfo="updateStudentInfo"
    />
  </div>
</template>

<script>
  import EditTagDialog from './EditTagDialog'
  import { getStudentInfo } from '@/api/netMap'
  export default {
    data() {
      return {
        userName: this.$route.query.userName,
        userMobile: this.$route.query.userMobile,
        phoneShow: false,
        studentInfo: {},
        visibleDialog: false
      }
    },
    components:{ EditTagDialog },
    mounted() {
      this.getStudentInfo()
    },

    computed: {
      phone() {
        if (this.studentInfo.userMobile) {
          return this.studentInfo.userMobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
        }
      },
    },

    filters: {
      filterTerminal(val) {
        const obj = {
          1: 'android',
          2: 'ios',
          3: 'pc',
          4: 'android_ipad',
          5: 'ios_ipad',
          6: '微信',
          7: 'M站',
          21: '微信小程序',
        }
        return obj[val]
      },
    },

    methods: {
      togglePhone() {
        this.phoneShow = !this.phoneShow
      },
      async getStudentInfo() {
        try {
          const { data } = await getStudentInfo({
            userName: this.userName,
            mobile: this.userMobile,
          })
          this.studentInfo = data || {}
        } catch (error) {
          console.log(error)
        }
      },
      editTag() {
        this.visibleDialog = true
      },
      updateStudentInfo(){
        this.getStudentInfo()
      }
    },
  }
</script>
<style lang='less' scoped>
  .student-info {
    background: #fff;
    .title {
      height: 48px;
      box-shadow: 0px -1px 0px 0px #e4e7ed;
      height: 18px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #303133;
      line-height: 48px;
      text-indent: 16px;
    }
    .student-info_wrapper {
      padding: 16px;
      .info-header {
        background: #f1f5ff;
        padding: 16px;
        display: flex;
        align-items: center;
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 17px;
        }
        .info-header_right {
          .name {
            height: 22px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #303133;
            line-height: 22px;
          }
          .iconmale-outline {
            color: #fa9191;
            font-size: 14px;
          }
          .vip {
            display: inline-block;
            width: 39px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid #f9b001;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #f9b001;
            line-height: 24px;
            text-align: center;
          }
          .yearsold {
            height: 17px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #606266;
            line-height: 17px;
          }
        }
        .info-header-bottom {
          margin-top: 10px;
          span {
            font-size: 14px;
            color: #606266;
            margin-left: 10px;
            &:first-child {
              margin-left: 0;
            }
            b {
              color: #303133;
            }
          }
        }
      }
      .label-key {
        color: #606266;
        font-size: 14px;
        line-height: 32px;
        b {
          color: #303133;
          word-break: break-all;
        }
      }
      .label-icon {
        font-size: 20px;
        margin: 0 10px 0 5px;
        cursor: pointer;
      }
      .label-wrapper,
      .userSource {
        display: flex;
        margin-top: 2px;
        .label-key {
          line-height: 32px;
        }
        .source-wrapper,
        label {
          flex: 1;
          b {
            display: inline-block;
          }
        }
        .el-tag {
          margin:0 10px 10px 0;
        }
      }
      .label {
        padding-top: 4px;
        flex: 1;
        line-height: 24px;
        b {
          word-break: break-all;
          font-size: 14px;
        }
      }
      .iconfont {
        margin-left: 5px;
      }
      .source-item {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #303133;
        line-height: 32px;
      }
    }
  }
</style>
