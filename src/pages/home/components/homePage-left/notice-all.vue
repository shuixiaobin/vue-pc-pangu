<template>
  <div class="notice-all-wrap">
    <el-button 
      class="btn-du" 
      size="mini" 
      @click="handleSetRead" 
      v-if="tabIndex"
      :disabled="!ids">一键全部已读</el-button>
    <el-tabs v-model="activeName" @tab-click="handleSelTab">
      <el-tab-pane label="未读消息" name="first">
        <unread-notice @sendTable="sendTable" ref="unread"></unread-notice>
      </el-tab-pane>
      <el-tab-pane label="全部消息" name="second">
        <read-notice ref="read"></read-notice>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ReadNotice from './read-notice.vue';
import UnreadNotice from './unread-notice.vue';
import { setRead } from "@/api/auth";
export default {
  components: { UnreadNotice, ReadNotice },
  data() {
   return {
      activeName: "first",
      tabIndex: true,
      ids: '',
      idArr: []
    };
  },
  methods: {
    sendTable(val) {
      val.forEach(item => {
       this.idArr.push(item._id)
      })
      this.ids = this.idArr.join(',')
    },
    handleSetRead() {
      let userName = localStorage.getItem('userName')
      let params = {
        userName,
        ids: this.ids
      }
      setRead(params).then(res => {
        if(res.code === 10000) {
          this.$message.success('全部已读')
          this.$refs.unread.getNoticeList()
        }
      })
    },
    handleSelTab(tab) {
      if(tab.index === '1') {
        this.tabIndex = false
        this.$refs.read.getNoticeList()
      }else if(tab.index === '0') {
        this.tabIndex = true
        this.$refs.unread.getNoticeList()
      }
    }
  },
};
</script>

<style lang='less' scoped>
.notice-all-wrap {
  .btn-du {
    position: absolute;
    top: 80px;
    right: 70px;
    z-index: 99;
  }
}
</style>