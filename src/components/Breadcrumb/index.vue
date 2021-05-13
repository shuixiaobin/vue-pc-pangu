<template>
  <el-breadcrumb
    class="crumbs"
    separator="/"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }" key="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(item) in breadcrumbData"
        :key="item.path"
      >
        <a :href="'#'+item.path">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script>
  export default {
    data() {
      return {
        breadcrumbData: null,
      }
    },
    watch: {
      $route:{
        handler() {
          this.getBreadcrumb()
        },
        immediate: true
      },
    },
    methods: {
      getBreadcrumb() {
        const matched = this.$route.matched.filter(item => item.meta && item.meta.title && item.meta.title !== '首页')
        this.breadcrumbData = matched
      }
    },
  }
</script>