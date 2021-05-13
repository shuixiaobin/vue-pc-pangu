<template>
  <el-form
    :inline="true"
    :model="formInline"
    class="form-inline"
  >
    <el-form-item label="说明">
      <el-input v-model="formInline.keyword"></el-input>
    </el-form-item>
    <el-form-item label="渠道">
      <el-select v-model="formInline.channel">
        <el-option
          v-for="(item) in channelData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="formInline.status">
        <el-option
          v-for="(item) in statusData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit"
      >查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        formInline: {
          keyword: '',
          channel: '',
          status: ''
        },
        statusData: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '未上线',
            value: 0
          },
          {
            label: '已上线',
            value: 1
          },
          {
            label: '已下线',
            value: 2
          }
        ],
        channelData: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '公众号',
            value: 1
          },
          {
            label: '小程序',
            value: 2
          },
          {
            label: '专题页',
            value: 3
          },
          {
            label: '课程详情',
            value: 4
          },
          {
            label: '一键加群',
            value: 5
          },
          {
            label: '短信链接',
            value: 6
          }
        ]
      }
    },
    methods: {
      onSubmit() {
        this.$emit('handleSearch', { channelType: this.formInline.channel, description: this.formInline.keyword, status: this.formInline.status })
      }
    }
  }
</script>
<style lang='less' scoped>
</style>