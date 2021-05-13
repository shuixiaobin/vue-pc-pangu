<template>
  <div>
    <h4 class="desc">请选择要修改的套餐大纲结构：</h4>
    <div class="btn-box">
      <el-button @click="navToName('twoLevels')">二层结构</el-button>
      <el-button @click="navToName('threeLevels')">三层结构</el-button>
    </div>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
export default {
  data () {
    return {

    }
  },
  methods: {
    navToName (name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style scoped>
.desc {
  text-align: center;
  margin: 50px 0;
}
.btn-box {
  text-align: center;
}
</style>
