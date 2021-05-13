<template>
  <el-dialog
    title="提示"
    :visible="visibleDialog"
    width="70%"
    :before-close="handleClose"
  >
    <div class="demo-drawer__content">
      <el-form
        :model="form"
        :rules="rules"
        label-width="130px"
        size="small"
        ref="ruleForm"
        class="rule-from"
      >
        <el-form-item
          label="咨询途径："
          prop="consultingWay"
        >
          <el-select
            v-model="form.consultingWay"
            placeholder="请选择"
          >
            <el-option
              v-for="item in consultingWayData"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="考试类型："
          prop="category"
        >
          <el-select
            v-model="form.category"
            placeholder="请选择"
          >
            <el-option
              v-for="item in categoryData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="考试阶段："
          prop="testStage"
        >
          <el-select
            v-model="form.testStage"
            placeholder="请选择"
          >
            <el-option
              v-for="item in testStageData"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属省份："
          prop="province"
        >
          <el-select
            v-model="form.province"
            placeholder="请选择"
          >
            <el-option
              v-for="item in provinceData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="跟进状态："
          prop="followStatus"
        >
          <el-select
            v-model="form.followStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in followStatusData"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计回访时间：">
          <el-input
            v-model="playbackTime"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item
          label="咨询课程："
          prop="referClass"
        >
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.referClass"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="remark"
        >
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button
          size="small"
          @click="cancelForm('ruleForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitForm('ruleForm')"
        > 确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import Util from '@/common/util'
  import { getFollowRecordOptionList, addFollowRecord } from '@/api/netMap'
  export default {
    props: {
      visibleDialog: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        zxqOaId: this.$route.query.oaId,
        userMobile: this.$route.query.userMobile,
        userName: this.$route.query.userName,
        consultingWayData: [], //咨询途径数据
        categoryData: [], //考试类型
        testStageData: [], //考试阶段
        provinceData: [], //所属省份
        followStatusData: [], //跟进状态
        playbackTime: Util.timeStampDate(new Date().getTime() + 7 * 24 * 3600 * 1000), //预计回访时间
        form: {
          consultingWay: '',
          category: '',
          testStage: '',
          province: '',
          followStatus: '',
          referClass: '',
          remark: '',
        },
        rules: {
          consultingWay: [{ required: true, message: '请选择咨询途径', trigger: 'change' }],
          category: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
          testStage: [{ required: true, message: '请选择考试阶段', trigger: 'change' }],
          province: [{ required: true, message: '请选择所属省份', trigger: 'change' }],
          followStatus: [{ required: true, message: '请选择跟进状态', trigger: 'change' }],
          referClass: [{ required: true, message: '请输入咨询课程', trigger: 'blur' }],
        },
      }
    },
    computed: {
      ...mapState(['username']),
    },
    mounted() {
      this.getOptionList()
    },

    methods: {
      cancelForm(formName) {
        this.$refs[formName].resetFields()
        this.$emit('update:visibleDialog', false)
      },
      handleClose() {
        this.$emit('update:visibleDialog', false)
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.addFollowRecord()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async addFollowRecord() {
        try {
          const data = await addFollowRecord({
            allowExam: this.form.category,
            biShiOrMianShi: this.form.testStage,
            classInfo: this.form.referClass,
            consulPass: this.form.consultingWay,
            consultationCont: this.form.remark,
            followupStat: this.form.followStatus,
            operator: this.zxqOaId ? this.zxqOaId : this.username,
            theProvince: this.form.province,
            type: this.zxqOaId ? 2 : 1,
            userMobile: this.userMobile,
            userName: this.userName,
          })
          if (data.code === 10000) {
            this.$emit('update:visibleDialog', false)
            this.$emit('updateList')
          } else {
            this.$message.error(data.msg)
          }

        } catch (err) {
          console.log(err);
        }
      },
      async getOptionList() {
        try {
          const data = await Promise.all([
            getFollowRecordOptionList({ type: 1 }),
            getFollowRecordOptionList({ type: 2 }),
            getFollowRecordOptionList({ type: 3 }),
            getFollowRecordOptionList({ type: 4 }),
            getFollowRecordOptionList({ type: 5 }),
          ])
          console.log(data)
          this.consultingWayData = data[0].data || []
          this.categoryData = data[1].data || []
          this.provinceData = data[2].data || []
          this.testStageData = data[3].data || []
          this.followStatusData = data[4].data || []
        } catch (err) {
          console.log(err)
        }
      },
    },
  }
</script>
<style lang='less' scoped>
  .rule-from {
    padding: 0 24px 24px 24px;
  }
  .dialog-footer {
    text-align: center;
  }
</style>