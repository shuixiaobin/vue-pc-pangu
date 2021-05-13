<template>
  <div class="container">
   <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item
      label="渠道"
      prop="channel"
    >
      <el-select v-model="ruleForm.channel" :disabled="$route.query.status == 2">
        <el-option
          v-for="(item) in channelData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="活动形式"
      prop="desc"
    >
      <el-input
        type="textarea"
        v-model="ruleForm.desc"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="客服码"
      prop="fileList"
    >
      <el-upload
        multiple
        class="upload-demo"
        :action="uploadUrl"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :file-list="ruleForm.fileList"
        name="image"
        list-type="picture"
      >
        <el-button
          size="small"
          type="primary"
        >点击上传</el-button>
        <div
          slot="tip"
          class="el-upload__tip"
        >只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
      >保存</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
  import { addActivityCode, getActivityCodeDetail, editActivityCode } from '@/api/scanCode'
  export default {
    data() {
      return {
        channelData: [
          {
            label: '公众号',
            value: 1
          },
          {
            label: '小程序',
            value: 2
          },
          {
            label: '专题页',
            value: 3
          },
          {
            label: '课程详情',
            value: 4
          },
          {
            label: '一键加群',
            value: 5
          },
          {
            label: '短信链接',
            value: 6
          }
        ],
        uploadUrl: `${PHP_URL}/v4/blue/class/upload`,
        ruleForm: {
          channel: '',
          desc: '',
          fileList: []
        },
        rules: {
          channel: [{ required: true, message: '请选择渠道', trigger: 'change' }],
          desc: [{ required: true, message: '请填写说明', trigger: 'blur' }],
          fileList: [{ required: true, message: '请选择上传客服码', trigger: 'change' }]
        }
      }
    },
    computed: {
      userName() {
        return localStorage.getItem('userName')
        // return 'app_ztk2058930230'
      }
    },
    created() {
      if (this.$route.query.id) {
        this.getCodeDetail(this.$route.query.id)
      }
    },
    methods: {
      getCodeDetail(id) {
        getActivityCodeDetail({ id })
          .then(res => {
            const data = res.data[0]
            this.ruleForm.channel = data.channelType
            this.ruleForm.desc = data.description
            data.serviceCode.forEach(item => {
              this.ruleForm.fileList.push({ url: item })
            })
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$confirm('确定保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                let serviceCode = []
                this.ruleForm.fileList.forEach(item => {
                  if (item.response && item.response.data.src) {
                    serviceCode.push(item.response.data.src)
                  } else {
                    serviceCode.push(item.url)
                  }
                })
                if (this.$route.query.id) {
                  editActivityCode({
                    codeId: this.$route.query.id,
                    channelType: this.ruleForm.channel,
                    creatorName: this.userName,
                    description: this.ruleForm.desc,
                    serviceCode: serviceCode.join(',')
                  })
                    .then(res => {
                      this.$router.go(-1)
                    })
                    .catch(err => {
                      this.$message.error(err.message)
                    })
                } else {
                  addActivityCode({
                    channelType: this.ruleForm.channel,
                    creatorName: this.userName,
                    description: this.ruleForm.desc,
                    serviceCode: serviceCode.join(',')
                  })
                    .then(res => {
                      this.$router.go(-1)
                    })
                    .catch(err => {
                      this.$message.error(err.message)
                    })
                }
              })
              .catch(err => {
                console.log(err)
             /*    this.$message({
                  type: 'info',
                  message: '已取消'
                }) */
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleRemove(file, fileList) {
        this.ruleForm.fileList = fileList
      },
      handleSuccess(res, file, fileList) {
        this.ruleForm.fileList = fileList
      }
    }
  }
</script>
<style lang='less' scoped>
</style>