<template>
  <el-dialog
    title="请选择地区"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="hide">
    <el-select v-model="value">
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */

export default {
  data () {
    this.cacheData = {}
    return {
      options: [],
      value: '',
      dialogVisible: false,
    }
  },
  methods: {
    confirm () {
      if (this.value === '') {
        this.$message.warning('请选择地区')
        return
      }
      this.$emit('confirm', {
        ...this.cacheData,
        areaId: this.value
      })
      this.hide()
    },
    show (data, options) {
      this.dialogVisible = true
      this.cacheData = data
      this.options = options
    },
    hide () {
      this.dialogVisible = false
      this.cacheData = {}
      this.options = []
      this.value = ''
    },
  }
}
</script>

<style scoped>

</style>
