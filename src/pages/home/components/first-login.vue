<template>
  <div class="first-login">
    <h3>设置密码</h3>
    <p>首次登录请重新设置密码再登录哦~</p>
    <login-form ref="first" @goMain="setStatus"></login-form>
    <el-button type="primary" class="btn-login" @click="handleResetPwd">重置</el-button>
  </div>
</template>

<script>
import LoginForm from './login-form.vue'
export default {
  components: { LoginForm },
  methods: {
    handleResetPwd() {
      this.$refs.first.handleSetNewPwd()
    },
    setStatus(status) {
        this.$emit("setStatus", "1");
    }
  }
}
</script>

<style lang="less" scoped>
  .first-login {
    h3{
      font-size: 18px;
      font-weight: 600;
      color: #3B4860;
      line-height: 25px;
    }

    p{
      font-size: 14px;
      font-weight: 400;
      color: #9196A0;
      line-height: 20px;
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