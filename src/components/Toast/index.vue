<template>
  <!-- <transition class="fade"> -->
    <div
      class="toast"
      v-show="visible"
    >
      <slot>{{message}}</slot>
    </div>
  <!-- </transition> -->
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        message: ''
      }
    },
  }
</script>
<style lang='less' scoped>
  .toast {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 10px;
    font-size: 16px;
    border-radius: 8px;
    z-index: 9999;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity, 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>