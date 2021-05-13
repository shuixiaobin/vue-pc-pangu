<template>
  <div class="code-verificat">
    <el-form :model="telForm" ref="login" :rules="rules">
      <el-form-item prop="tel">
        <el-input
          placeholder="请输入手机号"
          v-model.number="telForm.tel"
          prefix-icon="el-icon-user-solid"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="pwd-input">
        <el-input
          placeholder="请输入短信验证码"
          v-model="telForm.code"
          prefix-icon="el-icon-lock"
        >
        </el-input>
        <span v-if="codeStatu ==1"
          class="forget-pwd">
          获取短信验证码
        </span>
        <span v-if="codeStatu ==2"  :class="[sendStatus ? 'forget-pwd' : 'ok-pwd']" @click="sendCode">
           {{ sendStatus?`已发送,${codeNum}s后重新获取`:'获取短信验证码'}}
        </span>

        <p class="err-pwd">{{ msg }}</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPhoneCode ,codeIn} from "@/api/auth";
import { mapMutations } from "vuex";
export default {
  name: "TelLogin",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          this.codeStatu =2;
          callback();
        } else {
          this.codeStatu =1;
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      } else {
        const reg = /^\d{6}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的验证码"));
        }
      }
    };
    return {
      telForm: {
        tel: "",
        code: "",
      },
      codeStatu:1,
      sendStatus:false,
      msg: "",
      codeNum: 60,
      rules: {
        tel: [{ validator: checkPhone, trigger: 'blur' }],
        code:[{ validator: checkCode, trigger: 'blur' }],
      },
    };
  },


  methods: {
    sendCode() {
      if(this.sendStatus) return;
      this.sendStatus= true;
      getPhoneCode(this.telForm.tel).then(res=>{
        if(res.code == 1000000){
          this.$message.success("验证码发送成功！");
        }
      })
      this.setTime();
    },
    setTime() {
      this.codeNum =60;
      clearInterval(interId);
      var interId = setInterval(() => {
        this.codeNum--;
        if(this.codeNum ==0){
          clearInterval(interId);
          this.sendStatus= false;
        }
      }, 1000);
    },
     submitForm() {
       
      this.$refs.login.validate((valid) => {
        if (valid) {
          codeIn({
            account: this.telForm.tel,
            captcha: this.telForm.code,
          }).then(res=>{
            if (res.code === 1000000) {
              //this.$emit("setStatus", "4");
              if(res.data.firstLogin){
                this.$emit("setStatus", "5");
              }else{
                 this.setUserInfo(res.data);
                 this.$router.push({ path: '/homePage' })
              }
            }else{
                 this.$message.error(res.message)
            }
          }).catch(eror=>{
              this.$message.error(eror.message)
          })
       
        } else {
          return false;
        }
      });
    },
    checkValidate(){
      return new Promise((resolve, reject)=>{
        this.$refs.login.validate((valid) => {
          if (valid) {
            resolve(this.telForm);
          } else {
            resolve('');
          }
        });
      })
    },
    ...mapMutations(["setUserInfo"]),
  },
};
</script>
<style lang="less">
.code-verificat {
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
      width: 125px;
      height: 24px;
      // background: rgba(46, 191, 102, 0.85);
      background-color: #d4d6dd;
      border-radius: 16px;

      font-size: 12px;
      color: #ffffff;
      line-height: 24px;
      text-align: center;

      position: absolute;
      top: 7%;
      right: 5%;
      cursor: pointer;
    }

    .ok-pwd {
      width: 106px;
      height: 24px;
      background: rgba(46, 191, 102, 0.85);
      border-radius: 16px;

      font-size: 12px;
      color: #ffffff;
      line-height: 24px;
      text-align: center;

      position: absolute;
      top: 7%;
      right: 5%;
      cursor: pointer;
    }

    .err-pwd {
      position: absolute;
      height: 20px;
      color: #f56c6c;
      font-size: 12px;
    }
  }
}
</style>