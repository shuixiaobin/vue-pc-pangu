<template>
  <div class="setSheet">
    <div class="title">图书设置</div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="每印张成本"
        prop="price"
        :rules="[
          { required: true, message: '请输入每印张成本'},
          { type: 'number', message: '成本必须为数字值'}
        ]"
      >
        <div class="container">
          <el-input v-model.number="ruleForm.price"></el-input>元
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { setCostPerSheet, getCostPerSheet } from '@/api/bookApi'
  export default {
    data() {
      return {
        ruleForm: {
          price: ''
        }
      }
    },
    created () {
      getCostPerSheet()
        .then(res => {
          this.ruleForm.price = Number(res.data.costPerSheet)
        })
        .catch(err => {
          console.log(err)
        })
    },
    computed: {
      userName() {
        return localStorage.getItem('userName')
        // return 'app_ztk2058930230'
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            setCostPerSheet({
              costPerSheet: this.ruleForm.price,
              userName: this.userName
            })
              .then(res => {
                if (res.code === 10000) {
                  this.$message.success('设置成功')
                } else {
                  this.$message.error(res.msg)
                }
              })
              .catch(err => {
                this.$message.error('设置失败')
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .title {
    border-left: 3px solid #3c8dbc;
    line-height: 2;
    text-indent: 24px;
  }
  .el-form {
    margin: 30px auto 0;
    width: 1000px;
  }
  .container {
    display: flex;
    .el-input {
      margin-right: 20px;
    }
  }
</style>