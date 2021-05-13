<template>
  <div class="dataCleanDialog">
    <el-dialog
      title="创建任务"
      :visible="isOpenDialog"
      center
      width="40%"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="清洗时间"
          required
        >
          <el-col :span="11">
            <el-form-item prop="start">
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model="ruleForm.start"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="startDatePicker"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col
            class="txt-center"
            :span="2"
          >-</el-col>
          <el-col :span="11">
            <el-form-item prop="end">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model="ruleForm.end"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="endDatePicker"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="任务名称"
          prop="taskName"
        >
          <el-input
            type="text"
            v-model="ruleForm.taskName"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号模板"
          prop="uploadFileName"
          required
        >
          <el-upload
            class="upload"
            ref="upload"
            :action="imgUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            accept='.xls,.xlsx'
            name="uploadFile"
          >
            <el-button
              slot="trigger"
              type="primary"
            >上传文件</el-button>
            <span class="ml20">文件名：{{ruleForm.uploadFileName}}</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div　slot="footer" class="txt-center">
        <el-button @click="close">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >开始任务</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { createTask } from '@/api/dataClean'
  export default {
    data() {
      return {
        ruleForm: {
          taskName: '',
          start: '2019-01-01',
          end: '',
          uploadFileName: ''
        },
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        imgUpload: '//192.168.199.161:8019/lumenapi/v5/blue/outbound/upload_execl', //文件上传服务器地址
        rules: {
          taskName: [
            { required: true, message: '请填写任务名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          start: [
            {
              type: 'string',
              required: true,
              message: '请选择时间范围',
              trigger: 'change'
            }
          ],
          end: [
            {
              type: 'string',
              required: true,
              message: '请选择时间范围',
              trigger: 'change'
            }
          ],
          uploadFileName: [
            { required: true, message: '请上传手机号模板', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      getUserName() {
        if (process.env.NODE_ENV === 'development') {
          return 'htwx_3855101'
        } else {
          return localStorage.getItem('userName')
        }
      }
    },
    props: {
      isOpenDialog: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      beginDate() {
        return {
          disabledDate: time => {
            if (this.ruleForm.end) {
              return time.getTime() > new Date(this.ruleForm.end).getTime()
            }
          }
        }
      },
      processDate() {
        return {
          disabledDate: time => {
            if (this.ruleForm.start) {
              return (
                time.getTime() <
                new Date(this.ruleForm.start).getTime() - 86400000
              )
            }
          }
        }
      },
      handleAvatarSuccess(res) {
        if (res.code == 10000) {
          this.$message.success('上传成功')
          this.ruleForm.uploadFileName = res.data.fileName
        } else {
          this.$message.error(res.msg)
        }
      },
      handleAvatarError(err) {
        this.$message.error('请选择正确的文件模板')
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            createTask({ ...this.ruleForm, userName: this.getUserName })
              .then(res => {
                if (res.code == 10000) {
                  this.$message.success('创建成功')
                  this.close()
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch(err => {
                console.log(err)
                this.$message.error('请求失败')
              })
          } else {
            return false
          }
        })
      },
      close() {
        Object.assign(this.$data.ruleForm, this.$options.data.call(this))
        this.$emit('closeDialog')
      }
    }
  }
</script>
<style scoped>
  .txt-center {
    text-align: center;
  }
  .ml20 {
    margin-left: 20px;
  }
</style>