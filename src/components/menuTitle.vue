<template>
  <div class="container-title">
    <div class="title-wrapper">
      <slot name="content">
        <h2> {{$route.meta.title}}</h2>
      </slot>
      <i
        class="iconfont point"
        :class="[value?'iconshoucangbeifen':'iconshoucang']"
        @click="collect"
      ></i>
    </div>
    <slot name="btn"></slot>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'
  import { collectIn, cancelCollet } from '@/api/auth'
  export default {
    data() {
      return {
        access: this.$route.meta.access,
      }
    },
    computed: {
      ...mapGetters('auth', ['menuTitile','collectionList']),
      value () {
        return this.collectionList.some(item=>{
          return item.frontToolName == this.access
        })
      }
    },
    mounted(){
    },
    methods: {
      collect() {
        if (!this.value) {
          collectIn(this.menuTitile[this.access].id).then(res => {
            if (res.code == 1000000) {
              this.$message.success('收藏成功')
              this.getCollectAuth()
              this.value = true;
            }else{
              this.$message.error(res.message)
            }
          }).catch(err => {
              this.$message.error(err.message)
          })
        } else {
          cancelCollet(this.menuTitile[this.access].id).then(res => {
            if (res.code == 1000000) {
              this.value = false;
              this.$message.success('取消收藏成功')
              this.getCollectAuth()
            }else{
              this.$message.error(res.message)
            }
          }).catch(err => {
              this.$message.error(err.message)
          })
        }
      },
    ...mapActions('auth',["getCollectAuth"])
    },
  }
</script>
<style lang="less" scoped>
  .container-title {
    .title-wrapper {
      display: flex;
      align-items: center;
      .iconshoucangbeifen{
        color: #faad14;
      }
    }
  }
	.point::before{
		cursor: pointer;
	}
</style>