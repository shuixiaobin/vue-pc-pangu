<template>
  <el-form ref="form" :model="form" :inline="true" size="small">
    <template v-if="!hideSubject">
      <el-form-item label="考试类型">
        <el-select v-model="form.category" @change="subjectChange" placeholder="请选择">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试科目">
        <el-select v-model="form.subjectId" placeholder="请选择">
          <el-option
            v-for="item in subjectInfo"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </template>
    <el-form-item label="状态">
      <el-select v-model="form.bizStatus" placeholder="请选择">
        <el-option
          v-for="item in states"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="考试时间">
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="">
      <el-form-item>
        <el-input placeholder="输入需要查找的测试" style="width: 400px" v-model="form.name">
        <el-select v-model="form.searchType" style="width: 100px;" slot="prepend" placeholder="请选择">
            <el-option label="测试名称" :value="1"></el-option>
            <el-option label="测试id" :value="2"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
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

import { getBizStatus, getSubjectIds } from '../../common/options'
import batchOperation from '@/api/batchOperation'
import { makeMap } from '../../util'
export default {
  props: {
    hideSubject: Boolean
  },
  computed: {
    times () {
      const t = this.time
      if (Array.isArray(t)) {
        return {
          startTime: t[0],
          endTime: t[1]
        }
      }
      return {}
    }
  },
  data () {
    return {
      form: {
        category: 1,
        searchType: 1,
        name: '',
        subjectId: -1,
        bizStatus: ''
      },
      types: [],
      states: [],
      time: [],
      subjectInfo: []
    }
  },
  async created () {
    this.types = await getSubjectIds()
    this.form.category = this.types[0].value
    this.cateMap = makeMap(this.types, 'value')
    this.states = await getBizStatus()
    this.form.bizStatus = Math.min(...this.states.map(item => item.value))
    await this.subjectChange()
  },
  methods: {
    search () {
      const category = this.form.category && this.cateMap[this.form.category].key
      this.$emit('search', { ...this.form, ...this.times, category })
    },
    subjectChange () {
      this.form.subjectId = null
      this.subjectInfo = []
      const category = this.form.category && this.cateMap[this.form.category].key
      return batchOperation.getSubjectInfo({ categoryId: category }).then(res => {
        this.subjectInfo = res.data.map(item => ({ label: item.value, value: item.key }))
        this.form.subjectId = this.subjectInfo[0].value
      })
    }
  }
}
</script>

<style scoped>

</style>
