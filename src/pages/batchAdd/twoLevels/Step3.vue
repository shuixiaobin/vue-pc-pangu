<template>
  <div>
    <Success />
    <div>
      <CourseTable :tableData="tableData"/>
    </div>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import Success from './components/success'
import CourseTable from './components/courseTable'
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

  },
  components: {
    CourseTable,
    Success
  }
}
</script>

<style scoped lang="less">
</style>
