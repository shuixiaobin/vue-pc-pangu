<template>
  <div style="margin-bottom: 30px;">
    <el-input style="width: 450px" placeholder="请输入内容" v-model="form.keyword" class="input-with-select">
      <el-select style="width: 150px" v-model="form.type" slot="prepend" placeholder="请选择">
        <el-option label="课程标题" value="1"></el-option>
        <el-option label="课程ID" value="2"></el-option>
      </el-select>
    </el-input>
    <el-select v-model="form.status">
      <el-option label="未上线" value="0"></el-option>
      <el-option label="上线" value="1"></el-option>
      <el-option label="下线" value="2"></el-option>
    </el-select>
    <el-button @click="search">搜索</el-button>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
function initForm () {
  return {
    keyword: '',
    type: '1',
    status: '1'
  }
}
export default {
  data () {
    return {
      form: initForm()
    }
  },
  methods: {
    search () {
      this.$emit('search', {...this.form})
    }
  }
}
</script>

<style scoped>

</style>
