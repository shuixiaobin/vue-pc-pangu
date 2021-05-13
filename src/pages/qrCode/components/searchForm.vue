<template>
  <el-form :inline="inline" :model="searchData">
    <el-form-item prop="serviceNum" label="服务号">
      <el-select v-model="searchData.serviceNum">
        <el-option v-for="(item, index) in serviceList" :label="item.label" :value="item.value" :key="index" />
      </el-select>
    </el-form-item>
    <el-form-item prop="channelName" label="渠道名">
      <el-input style="max-width: 200px;" :maxlength="50" v-model="searchData.channelName" type="text" />
    </el-form-item>
    <el-form-item v-if="!hideSearch">
      <el-button @click="search" type="primary">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import {getServiceList} from '@/api/qrCode.js'
function getInitData () {
  return {
    channelName: '',
    serviceNum: 1
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
      serviceList: []
    }
  },
  created () {
    this.search()
    this.getServiceList()
  },
  methods: {
    search () {
      this.$emit('search', { ...this.searchData })
    },
    getServiceList () {
      getServiceList().then(res => {
        this.serviceList = res.data.map(item => {
          return {
            label: item.serviceName,
            value: item.serviceId
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
