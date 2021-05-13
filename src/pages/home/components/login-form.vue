<template>
  <div class="login-form-warp">
    <el-form :model="param" :rules="rules" ref="login" label-width="100px">
      <el-form-item prop="newPwd" label="请输入新密码">
        <el-input 
          placeholder="密码由数字和字母组合" 
          v-model="param.newPwd" 
          show-password
          type="password">
        </el-input>
      </el-form-item>
      <el-form-item prop="newPwd2" class="pwd-input" label="再次确认密码">
        <el-input
          placeholder="请输入密码"
          type="password"
          v-model="param.newPwd2"
          show-password
          style="margin-top: 5px"
        >
        </el-input>
        <p class="err-pwd">{{ msg }}</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {resetPwd} from "@/api/auth";
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    const checkNewPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        let reg =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
        if(!reg.test(value)) {
          return callback(new Error("密码不少于8位，包含字母和数字，字母要有大小写"))
        }else {
          callback()
        }
      }
    };
    const checkNewPwd2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        if (value !== this.param.newPwd) {
          return callback(new Error("两次密码不一样"));
        } else {
          callback();
        }
      }
    };
    return {
      param: {
        newPwd: "",
        newPwd2: "",
      },
      msg: "",
      rules: {
        newPwd: [{ validator: checkNewPwd, trigger: "blur" }],
        newPwd2: [{ validator: checkNewPwd2, trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(['userid']),
  },
  methods: {
    handleResetPwd() {
      this.$refs.login.validate((valid) => {
        if (valid) {
           resetPwd({
             userId:localStorage.getItem('userId'),
             newPwd:this.param.newPwd
           }).then(response=>{
              console.log(response)
              if(response.code == 1000000){
                this.$message.success(response.message);
                this.$emit("goMain");
              }else{
                this.$message.error(response.message);
              }
            }).catch(error=>{
                this.$message.error(error.message);
            })
        } else {
          return false
        }
      })
    },
    
    handleSetNewPwd() { //首次
      this.handleResetPwd()
    },
  },
}
</script>

<style lang="less">
.login-form-warp {
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