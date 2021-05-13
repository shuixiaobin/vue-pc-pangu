<template>
  <div>
    <el-form ref="form" :model="form" :inline="true" size="small">
      <el-form-item label="">
        <el-input placeholder="输入需要查找的阶段" style="width: 400px" v-model.trim="form.val">
          <el-select v-model="form.select" style="width: 100px;" slot="prepend" placeholder="请选择">
            <el-option label="阶段名称" value="stageName"></el-option>
            <el-option label="阶段id" value="id"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
export default {
  data () {
    return {
      form: {
        select: 'stageName',
        val: ''
      }
    }
  },
  methods: {
    search () {
      if (!this.form.val) {
        this.$emit('reset')
      } else {
        this.$emit('filter', {
          key: this.form.select,
          val: this.form.val
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
