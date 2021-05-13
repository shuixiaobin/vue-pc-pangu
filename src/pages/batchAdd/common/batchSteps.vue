<template>
  <div class="steps">
    <el-steps :active="active" align-center>
      <el-step
        v-for="(item, index) in steps"
        :key="item.id"
        :title="item.title"
        :description="item.desc || ''"
        :status="computedStatus(item, index)"
      ></el-step>
    </el-steps>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
export default {
  props: {
    steps: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    },
    completed: Boolean
  },
  methods: {
    computedStatus (d, i) {
      // 收集依赖
      this.d = this.completed
      const a = this.active
      if (i < a) {
        return 'success'
      } else if (i === a) {
        if (i === this.steps.length - 1 && this.completed) {
          return 'success'
        }
        return 'process'
      } else {
        return 'wait'
      }
    }
  }
}
</script>

<style scoped>
.steps {
  padding: 50px 0 80px 0;
}
</style>
