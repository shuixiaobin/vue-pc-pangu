<template>
  <div class="no-data">
    <span class="icon-wrapper">
      <slot name="icon"></slot>
    </span>
    <p class="desc">
      <slot name="desc"></slot>
    </p>
  </div>
</template>
<style lang='less' scoped>
  .no-data {
    padding: 200px 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .desc {
      text-align: center;
      width: 173px;
      height: 44px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #c0c4cc;
      line-height: 22px;
      margin-top: 16px;
    }
    .icon-wrapper {
      i {
        font-size: 88px;
      }
      color: #F5F8FC;
    }
  }
</style>
