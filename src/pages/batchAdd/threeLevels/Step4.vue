<template>
  <div>
    <Success />
    <div style="text-align: center; margin-bottom: 30px;">
      <el-button type="primary" @click="navToStep2">继续为已选套餐创建/修改阶段</el-button>
    </div>
    <div>
      <CourseTable :tableData="tableData"/>
    </div>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import Success from '../twoLevels/components/success'
import CourseTable from '../twoLevels/components/courseTable'
export default {
  props: ['cacheData'],
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.tableData = this.cacheData.step1.data.map(item => {
      return {
        id: item.id,
        name: item.title,
        isSuit: item.isSuit,
        isMianKu: item.isMianKu
      }
    })
  },
  methods: {
    navToStep2 () {
      this.$emit('navToStep2')
    }
  },
  components: {
    CourseTable,
    Success
  }
}
</script>

<style scoped lang="less">
</style>
