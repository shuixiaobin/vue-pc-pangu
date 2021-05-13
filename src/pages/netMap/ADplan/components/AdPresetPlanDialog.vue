<template>
  <el-dialog
    width="60%"
    :close-on-click-modal="false"
    :visible="dialogVisible"
    :before-close="handleClose"
  >
    <div
      slot="title"
      class="dialog-title"
      @click="handleClose"
    ><i
        class="el-icon-arrow-left"
        v-if="isActive && isDisabled"
      ></i>{{dialogTitle}}</div>
    <el-form
      class="dialog-form"
      :inline="true"
      :disabled="isDisabled"
      size="mini"
    >
      <template v-if="!isActive">
        <el-form-item label="默认二维码">
          <el-upload
            class="avatar-uploader"
            :action="actionUrl"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
          >
            <div
              class="qrcode-wrapper"
              @mouseover="shadeShow=true"
              @mouseout="shadeShow=false"
              v-if="imageUrl"
            >
              <img
                :src="imageUrl"
                class="qrcode"
              >
              <div
                class="shade"
                @click.stop.prevent=""
                v-show="shadeShow"
              >
                <i
                  class="el-icon-zoom-in"
                  @click="previewVisible=true"
                ></i>
                <i
                  class="el-icon-delete"
                  @click="imageUrl='';shadeShow=false"
                ></i>
              </div>
            </div>
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
          <el-dialog
            :visible.sync="previewVisible"
            append-to-body
          >
            <img
              width="100%"
              :src="imageUrl"
              alt=""
            >
          </el-dialog>
        </el-form-item>
        <el-form-item
          label="默认微信号"
          class="ml40"
        >
          <el-input
            v-model="wechat"
            placeholder="仅短信使用"
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item
        label="验证消息"
        style="width:70%"
        class="verify-msg"
        v-else
      >
        <el-input
          v-model="verifyMsg"
          style="width:100%"
          placeholder="请输入验证消息"
        ></el-input>
      </el-form-item>
      <div class="robot">
        <div class="robot-left">
          <div class="title-wrapper">
            机器人列表
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
          </div>
          <div class="robot-list">
            <el-input
              placeholder="搜索机器人名称"
              suffix-icon="el-icon-search"
              size="mini"
              v-model="robotName"
              @change="handleSearchRobot"
            />
            <div
              class="robot-list_wrapper"
              v-infinite-scroll="loadMore"
              :infinite-scroll-immediate="false"
              :infinite-scroll-disabled="disabled"
            >
              <el-checkbox-group
                v-model="checkedRobotIds"
                @change="handleCheckedChange"
              >
                <el-checkbox
                  v-for="(robot,i) in robotList"
                  :label="robot.wechatId"
                  :key="i"
                >
                  <div class="robot-info">
                    <img
                      class="avatar"
                      :src="robot.avatar"
                    />
                    <span class="name">{{robot.wechatNickName	}}</span>
                  </div>
                  <span class="count">{{robot.robotType}}/{{isActive?robot.applyLimit:robot.beApplyLimit}}</span>
                </el-checkbox>
              </el-checkbox-group>
              <p
                class="load-text"
                v-if="loading"
              >加载中...</p>
              <p
                class="load-text"
                v-if="!hasMore"
              >-- 没有更多了 --</p>
            </div>
          </div>
        </div>
        <div class="robot-right">
          <div class="title-wrapper">
            已选机器人列表
            <i
              class="el-icon-delete"
              @click="handleEmpty"
            >清空</i>
          </div>
          <ul
            class="checked-robot"
            v-if="checkedRobot.length > 0"
          >
            <li
              v-for="(item, i) in checkedRobot"
              :key="i"
            >
              <div class="robot-info w50">
                <img
                  class="avatar"
                  :src="item.avatar"
                />
                <span class="name">{{item.wechatNickName}}</span>
              </div>
              <span class="count">{{item.robotType}}/{{isActive?item.applyLimit:item.beApplyLimit}}</span>
              <el-select
                v-if="!isActive"
                v-model="item.activity"
                value-key="activityId"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="n in item.drainageVos"
                  :key="n.activityId"
                  :label="n.activityName"
                  :value="n"
                >
                </el-option>
              </el-select>
              <i
                class="el-icon-circle-close"
                v-if="!isActive"
                @click="handleDelRobot(i)"
              ></i>
            </li>
          </ul>
          <div
            class="no-data"
            v-else
          >
            从左侧列表中选择机器人
          </div>
        </div>
      </div>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <p v-html="footerDesc"></p>
      <div
        class="footer-btn_wrapper"
        v-if="!isDisabled"
      >
        <el-button
          size="mini"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleClose('begin')"
        >{{isEdit?'更新':'开始'}}</el-button>
      </div>

    </div>
  </el-dialog>
</template>

<script>
  import { getFlowList, getRobotList, setPassiveBindRobot, setActiveBindRobot, setUpload, getPassiveBindRobot, getActivePlanDetail } from '@/api/netMap'
  import { mapState } from 'vuex'
  export default {
    props: {
      campaignId: {
        type: Number,
      },
      batchId: {
        type: Number,
      },
      dialogVisible: {
        type: Boolean,
        default: true,
      },
      // 是否修改
      isEdit: {
        type: Boolean,
        default: false,
      },
      // 是否是主动计划批次
      isActive: {
        type: Boolean,
        default: false,
      },
      // 被动未触达数量
      count: {
        type: Number,
        default: 0,
      },
      // 是否只读
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        actionUrl: `${CRM_URL}/crm/upload/image`,
        imageUrl: '',
        dialogTitle: '预设被动机器人计划',
        wechat: '',
        checkAll: false,
        isIndeterminate: false,
        hasMore: true,
        loading: false,
        page: 1,
        pageSize: 10,
        robotName: '', //搜索机器人名称
        verifyMsg: '', //验证消息
        robotList: [],
        checkedRobot: [], //选中的机器人
        checkedRobotIds: [], //选中的机器人id
        previewVisible: false, //预览图片
        shadeShow: false,
        footerDesc: '',
        finishTime: '',
      }
    },
    watch: {
      checkedRobotIds(val) {
        if (val.length === 0) {
          this.checkedRobot = []
        } else {
          val.forEach(item => {
            const findRobot = this.robotList.find(robot => robot.wechatId === item)
            if (findRobot && !this.checkedRobot.find(each => each.wechatId === findRobot.wechatId)) {
              this.checkedRobot.push(findRobot)
            }
          })
        }
      },
      checkedRobot: {
        deep: true,
        handler(val) {
          let clueNum = 0
          let oldNum = 0
          let newNum = 0
          if (val.length > 0) {
            clueNum = val.reduce((prev, current) => {
              if (this.isActive) {
                return (prev += current.applyLimit)
              } else {
                return (prev += current.beApplyLimit)
              }
            }, clueNum)
            val.forEach(item => {
              if (item.robotType === 'N') {
                newNum++
              } else if (item.robotType === 'O') {
                oldNum++
              }
            })
          }
          if (oldNum === 0 && newNum === 0) {
            this.footerDesc = `未预设机器人，${this.isActive ? '今日可发起主动线索申请' : '今日可承载被动线索上限'}<span style="color:#ffa23a;">0</span>个`
          } else {
            this.footerDesc = `已预设${oldNum > 0 ? `<span style="color:#ffa23a;">${oldNum}</span>个老号` : ''}${
              newNum > 0 ? ` + <span style="color:#ffa23a;">${newNum}</span>个新号` : ''
            }，${this.isActive ? '今日可发起主动线索申请' : '今日可承载被动线索上限'}<span style="color:#ffa23a;">${clueNum}</span>个${
              this.isDisabled && this.finishTime ? ',预估完成时间：' + this.finishTime : ''
            }${this.isDisabled || this.isEdit ? '，计划执行中' : ''}`
          }
        },
      },
    },
    computed: {
      ...mapState(['oaUserId']),
      disabled() {
        return this.loading || !this.hasMore
      },
      userId() {
        return localStorage.getItem('userId')
      }
    },

    mounted() {
      if (this.isActive && !this.isDisabled) {
        this.dialogTitle = `预设主动机器人计划--被动未触达${this.count}`
      }
      this.getRobotList().then(() => {
        // 修改被动需要获取回显数据
        if (this.isEdit) {
          this.getPassiveBindRobot()
        }
        if (this.isDisabled && this.isActive) {
          this.getActivePlanDetail()
        }
      })
    },

    methods: {
      loadMore() {
        if (!this.hasMore) {
          return
        } else {
          this.page++
          this.getRobotList()
        }
      },
      handleDelRobot(i) {
        this.checkedRobot.splice(i, 1)
        this.checkedRobotIds.splice(i, 1)
      },
      handleSearchRobot() {
        this.page = 1
        this.robotList = []
        this.getRobotList()
      },
      // 获取主动计划详情
      async getActivePlanDetail() {
        try {
          const { data } = await getActivePlanDetail(this.batchId)
          this.verifyMsg = data.verificationInfo
          this.dialogTitle = data.name
          this.finishTime = data.predictFinishTime
          this.checkedRobot = data.robotDetailList
          this.checkedRobotIds = data.robotWechatIds
        } catch (err) {
          console.log(err)
        }
      },
      async getPassiveBindRobot() {
        try {
          const { data } = await getPassiveBindRobot(this.campaignId)
          this.imageUrl = data.defaultCodeUrl
          this.wechat = data.defaultAliasOrPhone
          if (data.robotDetailList.length > 0) {
            this.checkedRobotIds = data.robotIds
            this.$nextTick(() => {
              data.robotDetailList.forEach(item => {
                data.robotList.forEach(every => {
                  if (item.wechatId === every.robotWechatId) {
                    item.activity = item.drainageVos.find(each => each.activityId === every.activityId) || {}
                  }
                })
              })
              this.checkedRobot = data.robotDetailList
            })
            console.log(this.checkedRobot)
          }
        } catch (err) {
          console.log(err)
        }
      },
      async getRobotList() {
        this.loading = true
        try {
          const params = {
            userId: this.oaUserId,
            search: this.robotName,
            page: this.page,
            pageSize: this.pageSize,
          }
          const { data } = await getRobotList(params)
          if (data) {
            this.total = data.total
            this.loading = false
            if (data.result.length === 0) {
              this.hasMore = false
            }
            if (data.result.length > 0) {
              const ret = data.result.map(item => ({
                ...item,
                activity: {},
              }))
              this.robotList = [...this.robotList, ...ret]
            }
          } else {
            this.hasMore = false
            this.loading = false
          }
        } catch (err) {
          console.log(err)
        }
      },
      // 设置主动计划
      async setActiveBindRobot() {
        try {
          const robotWechatIds = this.checkedRobot.map(item => item.wechatId)
          const params = { campaignId: this.campaignId, verificationInfo: this.verifyMsg, robotWechatIds }
          const data = await setActiveBindRobot(params)
          this.$message.success(data.message)
          this.$emit('update:dialogVisible', false)
          this.$parent.getList()
        } catch (err) {
          console.log(err)
        }
      },
      // 设置被动计划
      async setPassiveBindRobot() {
        const robotList = this.checkedRobot.map(item => ({
          ...item.activity,
          robotWechatId: item.wechatId,
          limitCount: this.isActive ? item.applyLimit : item.beApplyLimit,
        }))
        try {
          const params = {
            campaignId: this.campaignId,
            defaultCodeUrl: this.imageUrl,
            defaultAliasOrPhone: this.wechat,
            robotList,
            userId: this.userId
          }
          const data = await setPassiveBindRobot(params)
          this.$message.success(data.message)
          this.$emit('update:dialogVisible', false)
          if (this.isEdit) {
            this.$emit('update:isEdit', false)
          }
          this.$parent.getList()
        } catch (err) {
          console.log(err)
        }
      },
      // 上传图片
      handleBeforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      handleSuccess(response) {
        this.imageUrl = response.data.url
      },
      handlePictureCardPreview(file) {
        this.previewVisible = true
        this.imageUrl = file.url
      },
      handleClose(str) {
        if (str === 'begin') {
          // 点击开始按钮
          if (!this.isActive) {
            if (this.imageUrl === '' && this.wechat === '' && this.checkedRobot.length === 0) {
              this.$message.warning('请配置被动计划')
              return
            }
            if (
              this.imageUrl === '' &&
              this.wechat === '' &&
              this.checkedRobot.length > 0 &&
              !this.checkedRobot.every(item => JSON.stringify(item.activity) !== '{}')
            ) {
              this.$message.warning('请完善机器人信息')
              return
            }
            if ((this.imageUrl === '' || this.wechat === '') && this.checkedRobot.length === 0) {
              this.$message.warning('请完善默认值')
              return
            }
            this.setPassiveBindRobot()
          } else {
            if (this.verifyMsg === '' || this.checkedRobot.length === 0) {
              this.$message.warning('请配置主动计划')
            } else {
              this.setActiveBindRobot()
            }
          }
        } else {
          this.$emit('update:isDisabled', false)
          this.$emit('update:dialogVisible', false)
          if (this.isEdit) {
            this.$emit('update:isEdit', false)
          }
          if (this.isActive) {
            this.$emit('update:isActive', false)
          }
        }
      },
      handleCheckAllChange(val) {
        this.checkedRobotIds = val ? this.robotList.map(item => item.wechatId) : []
        this.isIndeterminate = false
      },
      handleCheckedChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.robotList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.robotList.length
      },
      handleEmpty() {
        if (!this.isDisabled) {
          this.isIndeterminate = false
          this.checkAll = false
          this.checkedRobotIds = []
        }
      },
    },
  }
</script>
<style lang='less' scoped>
  .dialog-title {
    display: flex;
    align-items: center;
    i{
      font-size: 18px;
      padding: 0 5px;
      cursor: pointer;
    }
  }
  .robot {
    display: block;
    border: 1px solid #e1e2e6;
    display: flex;
    margin-top: 15px;
    .robot-left {
      width: 40%;
      border-right: 1px solid #e1e2e6;
    }
    .robot-right {
      width: 60%;
      .el-icon-delete {
        cursor: pointer;
      }
    }
    .title-wrapper {
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 47px;
      font-size: 14px;
      color: #333;
      font-weight: 500;
      line-height: 20px;
      background: #f3f4f7;
    }
    .robot-list {
      padding: 10px 18px;
      .load-text {
        text-align: center;
        font-size: 12px;
        color: #999;
        padding: 10px 0;
      }
      .robot-list_wrapper {
        overflow: auto;
        max-height: 400px;
        margin-top: 16px;
        .el-checkbox {
          display: flex;
          align-items: center;
        }
      }
    }
    .robot-info {
      width: 80%;
      display: flex;
      align-items: center;
    }
    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .name {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      margin-left: 4px;
      width: 90%;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .count {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      display: inline-block;
      width: 45px;
    }
    .checked-robot {
      overflow: auto;
      max-height: 460px;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        .robot-info {
          &.w50 {
            width: 50%;
          }
        }
        .el-select {
          flex: 1;
          margin: 0 10px;
        }
        .el-icon-circle-close {
          font-size: 18px;
          color: #000;
        }
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 14px;
    }
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 14px;
    font-weight: 500;
    color: #c0c4cc;
    line-height: 22px;
  }
</style>
<style lang="less">
  .dialog-form {
    .avatar-uploader {
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 78px;
      height: 78px;
      line-height: 78px;
      text-align: center;
    }
    .qrcode-wrapper {
      width: 78px;
      height: 78px;
      position: relative;
      .shade {
        border: 1px dashed rgba(0, 0, 0, 0.7);
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        z-index: 1;
        i {
          color: #fff;
          font-size: 20px;
        }
      }
    }
    .qrcode {
      width: 78px;
      height: 78px;
      display: block;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .verify-msg {
      .el-form-item__label {
        &::before {
          content: '*';
          color: #f56c6c;
          margin-right: 4px;
        }
      }
      .el-form-item__content {
        width: 70%;
      }
    }
    .robot-list_wrapper {
      .el-checkbox {
        width: 100%;
        box-sizing: border-box;
        padding-left: 5px;
        &:hover {
          background: #f7f8fb;
        }
      }
      .el-checkbox__label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 95%;
        padding: 8px;
      }
    }
  }
</style>