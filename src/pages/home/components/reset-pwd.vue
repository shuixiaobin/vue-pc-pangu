<template>
  <div class="reset-pwd">
    <h3>找回密码</h3>
    <login-form ref="newPwd" @goMain="setStatus"></login-form>
    <el-button type="primary" class="btn-login" @click="handleResetPwd">重置</el-button>
  </div>
</template>

<script>
import LoginForm from './login-form.vue'
export default {
  components: {
    LoginForm,
  },
  methods: {
    handleResetPwd() {
      this.$refs.newPwd.handleResetPwd()
    },
    setStatus(status) {
        this.$emit("setStatus", "1");
    }
  }
}
</script>

<style lang="less" scoped>
  .reset-pwd {
    h3{
      font-size: 18px;
      font-weight: 600;
      color: #3B4860;
      line-height: 25px;
    }
    .btn-login {
      width: 320px;
      height: 34px;
      background: #1856ff;
      border-radius: 4px;
      margin-top: 40px;
    }
  }
</style>