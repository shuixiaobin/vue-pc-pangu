<template>
  <el-form :inline="inline" :model="searchData" ref="ruleForm">
    <el-form-item prop="classId" label="课程id">
      <el-input style="max-width: 200px;" v-model="searchData.classId"></el-input>
    </el-form-item>
    <el-form-item prop="title" label="课程名称">
      <el-input style="max-width: 200px;" :maxlength="50" v-model="searchData.title" type="text" />
    </el-form-item>
    <el-form-item prop="status" label="活动状态">
      <el-select v-model="searchData.status">
        <el-option v-for="(item, index) in statusOptions" :label="item.label" :value="item.value" :key="index" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="!hideSearch">
      <el-button @click="search" type="primary" size="small">查询</el-button>
      <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */

function getInitData () {
  return {
    classId: '',
    title: '',
    status: '',
  }
}
export default {
  props: {
    inline: {
      type: Boolean,
    },
    hideSearch: {
      type: Boolean,
    }
  },
  data () {
    return {
      searchData: getInitData(),
      statusOptions: [
        { value: '', label: '全部' },
        { value: 0, label: '未上线' },
        { value: 1, label: '已上线' },
        { value: 2, label: '已失效' },
        { value: 3, label: '已结束' },
      ]
    }
  },
  created () {
    this.search()
  },
  methods: {
    search () {
      this.$emit('search', { ...this.searchData })
    },
		resetForm(formName){
			this.$refs[formName].resetFields();
		}
  }
}
</script>

<style scoped>

</style>
