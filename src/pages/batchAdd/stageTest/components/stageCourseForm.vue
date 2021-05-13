<template>
  <el-form ref="form" :model="form" :inline="true" size="small">
    <el-form-item label="考试类型" v-if="showTestType">
      <el-select v-model="form.cateType" placeholder="请选择">
        <el-option
          v-for="item in types"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.status" placeholder="请选择">
        <el-option
          v-for="item in states"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-input placeholder="输入需要查找的课程" style="width: 400px" v-model="form.singleValue">
        <el-select v-model="form.singleType" style="width: 100px;" slot="prepend" placeholder="请选择">
          <el-option label="课程名称" :value="1"></el-option>
          <el-option label="课程id" :value="3"></el-option>
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import { getPHPSubjectIds, paperStatus } from '../../common/options'
import { makeMap } from '../../util'
export default {
  props: {
    showTestType: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {
        singleType: 1,
        type: 2,
        status: undefined,
        singleValue: '',
        cateType: undefined
      },
      types: [],
      states: paperStatus,
    }
  },
  async created () {
    this.types = [{
      label: '全部',
      value: undefined
    }]
    this.types.push(...await getPHPSubjectIds())
    // this.types = await getPHPSubjectIds()
    // console.log(this.types)
    // this.cateType = this.types[0].value

    // this.search()
  },
  methods: {
    search () {
      this.$emit('search', { ...this.form })
    }
  }
}
</script>

<style scoped>

</style>
