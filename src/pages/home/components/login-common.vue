<template>
  <div class="login-box">
    <div class="login-content">
      <div class="login-left-con">
      </div>
      <div class="login-right-con">
        <div class="right-con-input">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="login-state-info">
      <h5>北京华图宏阳网络科技有限公司 版权所有</h5>
      <p>Copyright©2006-2020 v.huatu.com Inc. All Rights Reserved</p>
      <p>京ICP备11028696号-11 京ICP证130150号 京公网安备11010802021470号</p>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="less" scoped>

  .login-box {
    width: 100%;
    height: 100%;
    min-width: 600px;
    min-height: 600px;
    background: #E9F1FA;
    position: relative;

    .login-content {
      width: 1120px;
      height: 72%;
      background: #FFFFFF;
      box-shadow: 0px 16px 98px 0px rgba(88, 102, 116, 0.85);
      border-radius: 20px;
      position: absolute;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -50%);

      .login-left-con {
        float: left;
        width: 530px;
        height: 100%;
        background-color: #0099ff;
        border-radius: 20px 0 0  20px;
        background: url("../common/images/pangu.jpg") no-repeat;
        background-size: 100% 100%;
        position: relative;

        .moufang {
          width: 63px;
          height: 61px;
          background: #4AA1F8;
          position: absolute;
          right: 29px;
          bottom: 67px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 32px;
            height: 36px;
          }
      }
        
      }

      .login-right-con {
        /*float: right;*/
        height: 100%;
        display:flex;
        justify-content:center;
        align-items:center;

        .right-con-input {
          width: 320px;
          height: 320px;
          
          .tel_login {
            margin-top: 32px;
            font-size: 14px;
            color: #1856FF;
            line-height: 20px;
            text-decoration: underline;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }
    
    .login-state-info {
      position: fixed;
      bottom: 8px;
      width: 1023px;
      font-size: 12px;
      color: #333333;
      line-height: 20px;
      text-align: center;
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

</style>
