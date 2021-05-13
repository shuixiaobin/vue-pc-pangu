<template>
  <div class="edit-tab">
    <div
      class="edit-tab-item"
      :class="{ 'edit-tab-item-active': item.key === activeKey }"
      v-for="item in tagCategory"
      :key="item.key"
      @click="toggleTab(item)"
    >
      {{ item.value }}
    </div>
  </div>
</template>
<script>
export default {
  name: "Tab",
  props: {
    tagCategory: {
      type: Array,
      default: () => [],
    },
    activeKey: {
      type: String,
      default: "",
    },
  },
  methods: {
    toggleTab(item) {
      this.$emit("toggleHandle", item);
    },
  },
};
</script>
<style lang="less" scoped>
.edit-tab {
  display: flex;
  justify-content: center;
  align-items: center;
  &-item {
    padding: 5px 8px;
    border: 1px solid #e4e7ed;
    cursor: pointer;
    &:nth-child(1) {
      border-radius: 20px 0 0 20px;
    }
    &:nth-last-child(1) {
      border-radius: 0 20px 20px 0;
    }
    &-active {
      border: 1px solid #1856FF;
    }
  }
}
</style>