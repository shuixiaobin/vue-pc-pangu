<template>
  <div class="login-main-wrap">
    <p>欢迎登录</p>
    <h3>盘古中心</h3>
    <el-form :model="param" :rules="rules" ref="login">
      <el-form-item prop="username">
        <el-input
          placeholder="请输入手机号/邮箱/员工号"
          v-model="param.username"
          prefix-icon="el-icon-user-solid"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="pwd-input">
        <el-input
          placeholder="请输入密码"
          type="password"
          v-model="param.password"
          prefix-icon="el-icon-lock"
          show-password
          @keyup.enter.native="submitForm"
        >
        </el-input>
        <span
          class="forget-pwd"
          @click="handlePwd"
          >忘记密码</span
        >
        <p class="err-pwd">{{ msg }}</p>
      </el-form-item>
      <el-button type="primary" class="btn-login" @click="submitForm"
        >登录</el-button
      >
    </el-form>
    <div class="tel_login" @click="handleLook">手机验证码登录</div>
  </div>
</template>

<script>
import { mapMutations,mapActions} from "vuex";
import { loginIn } from "@/api/auth";

import loginCommon from "./login-common.vue";
export default {
  components: { loginCommon },
  data: function () {
    return {
      param: {
        username: "", //'app_ztk2058930230',
        password: "", //'htwx@123456',
      },
      msg: "",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleLook() {
      this.$emit("setStatus", "2");
    },
    handlePwd() {
      this.$emit("setStatus", "3");
    },
    submitForm() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.login();
        } else {
          return false;
        }
      });
    },
     login() {
          loginIn({
            account: this.param.username,
            password: this.param.password
          }).then(data=>{
              if (data.code === 1000000) {  
                    if(data.data.firstLogin){
                      this.$emit("setStatus", "5");
                      localStorage.setItem('userId', data.data.userId);
                    }else{
                      this.setUserInfo(data.data);
                      this.$router.push({ path: '/homePage' })
                      //return this.getAuths()
                    }
              } else {
                this.$message.error(data.message)
              }
          }).catch(error=>{
            this.$message.error(error.message)
          })
    },
    ...mapMutations(["setUserInfo"]),
    ...mapActions('auth',["getAuths"]),
  },
};
</script>

<style lang="less">
.login-main-wrap {
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
  .el-form {
    margin-top: 20px;
  }
  .el-input__inner {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    transition: border-bottom-color 0.3s;
  }

  .pwd-input {
    position: relative;

    .forget-pwd {
      font-size: 14px;
      color: #9196a0;
      position: absolute;
      right: 10%;
      cursor: pointer;
    }

    .err-pwd {
      position: absolute;
      height: 20px;
      color: #f56c6c;
      font-size: 12px;
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
