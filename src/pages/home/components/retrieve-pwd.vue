<template>
  <div class="forgot-pwd-box">
    <h3>找回密码</h3>
    <p>通过您的手机号重置密码，或
      <el-tooltip placement="top" effect="light">
        <div slot="content">
          <p style="color: #3B4860; font-size: 12px;">
            请发邮件给管理员邮箱，请求密码重置<br/>sysadmin@huatu.com</p>
          <p style="color: #9196A0; font-size: 10px; margin-top: 5px;">
            注：邮件标题，密码重置+姓名<br/>
            邮件内容，请注明手机号/邮箱，真实姓名</p>
        </div>
        <span class="contact-admin">联系管理员重置</span>
      </el-tooltip>
    </p>
    <code-verificat ref="nextStep"></code-verificat>
    <el-button type="primary" class="btn-login" @click="nextClick"
      >下一步</el-button
    >
    <div class="tel_login" @click="handleBackLogin">
      返回登录
    </div>
  </div>
</template>

<script>
import CodeVerificat from "./code-verificat"
import LoginCommon from "./login-common"
import { forgetPwd} from "@/api/auth";
export default {
  components: {
    CodeVerificat,
    LoginCommon,
  },
  data() {
    return {};
  },
  methods: {
    handleBackLogin() {
       this.$emit("setStatus", "1");
    },
    nextClick() {
     this.$refs.nextStep.checkValidate().then(res=>{
       if(res){
          return forgetPwd({
            mobile:res.tel,
            captcha:res.code
          })
       }
     }).then(response=>{
       if(response.code == 1000000){
        this.$emit("setStatus", "4");
        localStorage.setItem('userId', response.data.id)
       }else{
        this.$message.error(response.message);
       }
     }).catch(error=>{
        this.$message.error(error.message);
     })
    },
  },
};
</script>

<style lang="less" scoped>
.forgot-pwd-box {
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #3b4860;
    line-height: 25px;
  }

  p {
    font-size: 14px;
    color: #9196a0;
    line-height: 20px;

    .contact-admin {
      color: #1856ff;
      text-decoration: underline;
      cursor: pointer;
    }
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
