<template>
  <login-common>
    <login-main v-if="lookNum === '1'" @setStatus="setStatus"></login-main>
    <tel-login v-if="lookNum === '2'" @setStatus="setStatus" :telOnly="telOnly"></tel-login>
    <retrieve-pwd v-if="lookNum === '3'" @setStatus="setStatus"></retrieve-pwd>
    <reset-pwd v-if="lookNum === '4'" @setStatus="setStatus"></reset-pwd>
    <first-login v-if="lookNum === '5'" @setStatus="setStatus"></first-login>
  </login-common>

</template>

<script>
import LoginCommon from './components/login-common.vue'
import LoginMain from './components/login-main.vue'
import TelLogin from './components/tel-login.vue'
import RetrievePwd from './components/retrieve-pwd.vue'
import ResetPwd from './components/reset-pwd.vue'
import FirstLogin from './components/first-login.vue'
import {getIsOuterNet} from "@/api/auth";
export default {
  components: {LoginCommon, LoginMain, TelLogin, RetrievePwd, ResetPwd, FirstLogin},
  data() {
      return {
        lookNum:'1',
        telOnly:true
      }
  },
  created(){
    getIsOuterNet().then(data=>{
      if(data.data && data.data.intranetLogin < 1){//外网登录的
          this.lookNum= '2';
          this.telOnly= false;
      }
    })
  },
  methods: {
      setStatus(status) {
        this.lookNum = status;
      }
  }
}
</script>

<style lang="less" scoped>
</style>