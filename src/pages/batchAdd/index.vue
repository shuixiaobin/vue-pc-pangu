<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
export default {
  data () {
    return {
      title: '',
      breadCrumbs: []
    }
  },
  methods: {

  },
  watch: {
    '$route': {
      handler (val) {
        this.title = val.matched[val.matched.length - 1].meta.title
        // this.breadCrumbs = val.matched.map(item => {
        //   if (!item.meta || !item.meta.breadcrumb) return false
        //   return {
        //     val: item.meta.breadcrumb,
        //     to: {
        //       name: item.name
        //     }
        //   }
        // }).filter(i => !!i)
        // console.log(this.breadCrumbs)
      },
      immediate: true
    }
  }
}
</script>

<style>
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .batch-align-center {
    text-align: center;
    margin: 30px auto;
  }
  .batch-mt-20 {
    margin-top: 20px;
  }
</style>
