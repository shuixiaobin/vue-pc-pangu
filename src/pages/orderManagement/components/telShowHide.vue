<template>
  <span>{{hidePhone(tel)}}<i
      :class="[disable ? 'iconfont iconeye-outline':'iconfont iconyincang']"
      @click="disable = !disable"
    ></i></span>
</template>
<script>
  export default {
    data() {
      return {
        disable: false
      };
    },
    props: ['tel'],
    computed: {
      hidePhone(data) {
        return data => {
          return this.disable
            ? data
            : data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        };
      }
    }
  };
</script>
<style lang="less" scoped>
</style>