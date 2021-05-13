<template>
  <div class="condition-operate">
    <div v-if="showCondition" class="condition-item-left">
      <div class="condition-line"></div>
      <div class="condition-value" @click="switchValue">
        {{ value === 'and' ? '且' : '或 '}}
      </div>
      <div class="condition-line"></div>
    </div>
    <div class="condition-item-right" :class="{'show-condition': showCondition}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  props: {
    showCondition: Boolean,
    value:  String
  },
  data () {
    return {

    }
  },
  methods: {
    switchValue () {
      this.$emit('input', this.value == 'and' ? 'or' : 'and')
    }
  }
}
</script>

<style scoped lang="less">
@import url('~@/assets/css/theme-color.less');
.condition-operate {
  height: 100%;
  position: relative;
}
.condition-item-left {
  position: absolute;
  left: 0;
  width: 60px;
  top: 0;
  bottom: 0;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.condition-line {
  flex: 1;
  background: @primary;
  width: 2px;
}
.condition-item-right {
  position: relative;
  height: 100%;
  overflow: auto;
  padding-left: 24px;
  &.show-condition {
    margin-left: 60px;
    padding-left: 0;
  }
}
.condition-value {
  width: 28px;
  height: 28px;
  background: @primary;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  line-height: 28px;
  text-align: center;
  margin: 4px 0;
  user-select: none;
  cursor: pointer;
}
</style>
