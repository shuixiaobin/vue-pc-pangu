<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div v-for="(item, index) in comment" :key="index">
          <el-checkbox
            :disabled="disabled"
            @input="handleClick(item.examCommentDetailId)"
            :value="radioVal === item.examCommentDetailId"
            :label="item.examCommentDetailId"
          >{{item.content}}</el-checkbox>
        </div>
      </el-col>
      <el-col :span="12">
        <el-input
          @input="handleInputChange"
          :disabled="!radioVal"
          type="textarea"
          :rows="5"
          resize="none"
          v-model="curContent"
        ></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  props: ['comment', 'id', 'disabled'],
  // computed: {
  //   curContent () {
  //     const val = this.radioVal
  //     const v = this.comment.find(item => item.examCommentDetailId === val)
  //     return v ? v.proposal : ''
  //   }
  // },
  data () {
    return {
      radioVal: '',
      curContent: ''
    }
  },
  methods: {
    handleInputChange () {
      this.$emit('add', {
        id: this.radioVal,
        text: this.curContent
      })
    },
    setData (map) {
      const d = map[this.id]
      if (!d || Number(d.id) === this.radioVal)
        return this.handleInputChange()
      this.curContent = d.text
      this.radioVal = Number(d.id)
      this.handleInputChange()
    },
    handleClick (v) {
      if (v === this.radioVal) {
        this.$emit('remove', this.radioVal)
        this.radioVal = ''
      } else {
        if (this.radioVal) {
          this.$emit('remove', this.radioVal)
        }
        this.curContent = this.comment.find(item => item.examCommentDetailId === v).proposal
        this.radioVal = v
        this.handleInputChange()
      }
    }
  },
}
</script>

<style scoped>

</style>
