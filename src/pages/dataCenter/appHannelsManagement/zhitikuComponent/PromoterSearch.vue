<template>
  <div>
    <el-input style="width: 310px;" :type="computedType" size="small" placeholder="请输入内容" v-model.trim="searchVal" class="input-with-select">
      <el-select style="width: 110px" v-model="type" @change="handleTypeChange" slot="prepend" placeholder="请选择">
        <el-option label="用户名" value="name"></el-option>
        <el-option label="手机号" value="mobile"></el-option>
      </el-select>
    </el-input>
    <el-button size="small" type="primary" @click="search">搜索</el-button>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  data () {
    return {
      type: 'name',
      searchVal: '',
    }
  },
  computed: {
    computedType () {
      if (this.type === 'mobile') return 'tel'
      return 'text'
    }
  },
  methods: {
    search () {
      const params = {}
      params[this.type] = this.searchVal
      this.$emit('search', Object.freeze(params))
    },
    handleTypeChange () {
      this.searchVal = ''
    },
  }
}
</script>

<style scoped>

</style>
