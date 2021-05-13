<template>
  <div>
    <div v-for="(item, index) in examComments" :key="index">
      <div style="font-weight: bold;">{{item.dimension}}</div>
      <CorrectItem
        :disabled="disabled"
        ref="correct"
        :comment="item.commentDetails"
        :id="item.examCommentId"
        @add="correctAdd(item.examCommentId, $event)"
        @remove="correRemove(item.examCommentId, $event)"
      />
    </div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import CorrectItem from './correctItem'
export default {
  props: ['examComments', 'id', 'disabled'],
  data () {
    return {
      activeName: '0',
    }
  },
  methods: {
    setData (map) {
      const d = map[this.id]
      if (!d) return
      this.$refs.correct.forEach(item => item.setData(d))
    },
    correctAdd (id2, e) {
      const id3 = e.id
      const ids = [this.id, id2, id3].join(',')
      this.$emit('add', {
        id: ids,
        text: e.text
      })
    },
    correRemove (id2, id3) {
      const ids = [this.id, id2, id3].join(',')
      this.$emit('remove', ids)
    }
  },
  components: {
    CorrectItem,
  }
}
</script>

<style scoped>

</style>
