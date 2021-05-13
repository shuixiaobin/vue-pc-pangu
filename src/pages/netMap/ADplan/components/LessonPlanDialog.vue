<template>
  <el-dialog
    width="60%"
    :close-on-click-modal="false"
    :visible="lessonPlanVisible"
    :before-close="handleClose"
    title="预设课程计划"
  >
    <el-form
      class="dialog-form"
      :inline="true"
      size="mini"
      :model="planForm"
      ref="planForm"
      :rules="formRules"
    >
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            label="课程id"
            prop="curriculumId"
          >
            <el-autocomplete
              v-model="planForm.curriculumId"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
              clearable
              :trigger-on-focus="false"
              placeholder="填写课程id"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item
            label="短信文案"
            prop="sms"
            class="sms"
          >
            <el-input
              v-model="planForm.sms"
              maxlength="100"
              placeholder="请填写自定义短信文案，不得超过100字"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item
            label="目标模式"
            prop="targetMode"
          >
            <el-select v-model="planForm.targetMode" placeholder="请选择目标模式">
              <el-option label="群" :value="1"></el-option>
              <el-option label="机器人" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-select size="mini" @change="planForm.url=''" v-model="planForm.targetType" placeholder="请选择目标类型">
                <el-option label="目标链接" :value="1"></el-option>
                <el-option label="目标图片" :value="2"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <template v-if="planForm.targetType == 1">
                 <el-input
                  size="mini"
                  v-model="planForm.url"
                  maxlength="500"
                  placeholder="请填写目标链接"
                ></el-input>
              </template>
              <template v-else>
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
                    v-if="planForm.url"
                  >
                    <img
                      :src="planForm.url"
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
                        @click="planForm.url='';shadeShow=false"
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
                    :src="planForm.url"
                    alt=""
                  >
                </el-dialog>
              </template>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="robot">
        <div class="robot-left">
          <div class="title-wrapper">
            机器人列表
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              :disabled="robotList.length == 0"
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
              <i
                class="el-icon-circle-close"
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
    <span
      slot="footer"
      class="dialog-footer"
    >
        <el-button
          size="mini"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleSave"
        >{{isEdit?'更新':'开始'}}</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import { getRobotList, planInfoDetail, planInfoSave, getCourseName } from '@/api/netMap'
  import { mapState } from 'vuex'
  export default {
    props: {
      campaignId: {
        type: Number,
      },
      lessonPlanVisible: {
        type: Boolean,
        default: true,
      },
      // 是否修改
      isEdit: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        actionUrl: `${CRM_URL}/crm/upload/image`,
        checkAll: false,
        isIndeterminate: false,
        hasMore: true,
        loading: false,
        page: 1,
        pageSize: 10,
        robotName: '', //搜索机器人名称
        robotList: [],
        checkedRobot: [], //选中的机器人
        checkedRobotIds: [], //选中的机器人id
        previewVisible: false, //预览图片
        shadeShow: false,
        planForm: {
          campaignId: '',
          curriculumId: '',
          targetMode: 1,
          targetType: 1,
          url: "",
          sms: ""
        },
        formRules:{
          curriculumId:[{required: true, message:'请填写课程id',trigger:'blur'}],
          targetMode:[{required: true, message:'请选择目标模式',trigger:'change'}]
        }
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
      }
    },
    computed: {
      ...mapState(['oaUserId','starMapNum']),
      disabled() {
        return this.loading || !this.hasMore
      },
      userId() {
        return localStorage.getItem('userId')
      }
    },

    mounted() {
      this.getRobotList().then(() => {
        // 修改被动需要获取回显数据
        if (this.isEdit) {
          this.planInfoDetail()
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
      async planInfoDetail() {
        try {
          const { data } = await planInfoDetail({campaignId: this.campaignId})
          const res = await getCourseName({courseId: data.curriculumId})
          const curriculumId = `${res.data.courseId}(${res.data.name})`
          this.planForm = {...data,curriculumId:curriculumId}
          this.checkedRobotIds = data.wechatIdList
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
        this.planForm.url = response.data.url
      },
      handlePictureCardPreview(file) {
        this.previewVisible = true
        this.planForm.url = file.url
      },
      handleClose() {
        this.$emit('update:lessonPlanVisible', false)
        if (this.isEdit) {
          this.$emit('update:isEdit', false)
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
        this.isIndeterminate = false
        this.checkAll = false
        this.checkedRobotIds = []
      },
      handleSave() {
        this.$refs['planForm'].validate(async valid => {
          if (valid) {
            const params = {...this.planForm,curriculumId:this.planForm.curriculumId.split('(')[0]}
            if (params.targetType == 1 && params.url == '') {
              this.$message.error('请填写目标链接')
              return
            }
            if (params.targetType == 2 && params.url == '') {
              this.$message.error('请填上传目标图片')
              return
            }
            params.campaignId = this.campaignId
            params.wechatIdList = this.checkedRobotIds
            params.userId = this.userId
           try {
              const data = await planInfoSave(params)
              if (data.code == 1000000) {
                this.$message.success(`${this.isEdit?'更新':'配置'}成功`)
                this.handleClose()
                this.$parent.getList()
              } else {
                this.$message.success(`${this.isEdit?'更新':'配置'}失败，请稍后重试`)
              }
           } catch (error) {
             console.log(error);
           }
          }
        })
      },
       async querySearch(queryString, cb) {
        try {
          const {data} = await getCourseName({courseId: queryString})
          if (data.name) {
            // 调用 callback 返回建议列表的数据
            cb([{value: `${data.courseId}(${data.name})`}])
          } else {
            cb([])
          }
        } catch (error) {
          console.log(error);
        }
      },
      handleSelect(item) {
        console.log(item);
      }
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
  .sms {
    width: 100%;
    /deep/.el-form-item__content {
      width: calc(100% - 80px);
    }
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