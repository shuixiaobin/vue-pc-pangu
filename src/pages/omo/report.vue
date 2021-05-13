<template>
  <div class="report">
    <header>
      报到信息
      <el-button
        size="mini"
        @click="goEdit"
        type="primary"
      >编辑</el-button>
    </header>
    <div
      class="content"
      v-html="content"
    ></div>
  </div>
</template>
<script>
  import { getReport } from '@/api/omoApi'
  export default {
    data() {
      return {
        content: '',
        rid: this.$route.query.rid,
      }
    },

    mounted() {
      getReport(this.rid)
        .then(res => {
          if (res.code === 1000000) {
            this.content = res.data && res.data.content
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },

    methods: {
      goEdit() {
        this.$router.push({ path: '/OMOeditReport', query: { rid: this.$route.query.rid } })
      },
    },
  }
</script>

<style scoped lang='less'>
  .report {
    background: #fff;
    padding: 20px;
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
