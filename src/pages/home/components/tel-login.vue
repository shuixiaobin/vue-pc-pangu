<template>
  <div class="tel-login-warp">
    <p>欢迎登录</p>
    <h3>盘古中心</h3>
    <code-verificat ref="telLogin"></code-verificat>
    <el-button type="primary" class="btn-login" @click="submitForm">登录</el-button>
    <div class="tel_login" @click="handleLook" v-if="telOnly">
      账号密码登录
    </div>
  </div>
</template>

<script>
import CodeVerificat from "./code-verificat.vue"
import loginCommon from "./login-common.vue"

export default {
  components: { loginCommon, CodeVerificat },
  name: "TelLogin",
  props:{
    telOnly: {
        type: Boolean,
        default: true
    },
  },
  methods: {
    handleLook() {
       this.$emit("setStatus", "1");
    },
    submitForm() {
      this.$refs.telLogin.submitForm()
    }
  }
}
</script>

<style lang="less" scoped>
.tel-login-warp {
  p {
    font-size: 14px;
    color: #9196a0;
    line-height: 20px;
  }

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #3b4860;
    line-height: 33px;
  }

  .btn-login {
    width: 320px;
    height: 34px;
    background: #1856ff;
    border-radius: 4px;
    margin-top: 40px;
  }

  .tel_login {
    margin-top: 32px;
    font-size: 14px;
    color: #1856ff;
    line-height: 20px;
    text-decoration: underline;
    text-align: center;
    cursor: pointer;
  }
}
</style>
