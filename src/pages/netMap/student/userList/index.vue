<template>
  <div class="zxq-user_list">
    <div
      class="user-item"
      :class="{selected : i === currentIndex}"
      v-for="(item, i) in userList"
      :key="item.userId"
      @click="goStudentInfo(item, i)"
    >
      用户名：{{item.userName}}<br>
      手机号：{{item.userMobile}}
    </div>
  </div>
</template>

<script>
  import { getStudentList, bindUser } from '@/api/netMap'
  export default {
    data() {
      return {
        userList: [],
        currentIndex: null,
        zxqMobile: this.$route.query.zxqMobile,
        oaId: this.$route.query.oaId,
      }
    },
    created() {
      this.getStudentList()
    },
    methods: {
      async getStudentList() {
        try {
          const { data  } = await getStudentList({
            mobile: this.zxqMobile,
          })
          const res = data || []
          if (res.length === 1) {
            this.$router.push({
              path: '/userDetail',
              query: {
                userName: res[0].userName,
                userMobile: res[0].userMobile,
                ...this.$route.query,
              },
            })
            return
          }
          // 查看是否已绑定
          const bindUser = res.filter(item => item.isBind === true)
          if (bindUser.length > 0) {
            this.$router.push({
              path: '/userDetail',
              query: {
                userName: bindUser[0].userName,
                userMobile: bindUser[0].userMobile,
                ...this.$route.query,
              },
            })
          }
          this.userList = res
        } catch (error) {
          console.log(error);
        }
      },

      async bindUser(userName, userMobile) {
        try {
          const data = await bindUser({
            mobile: userMobile,
            oaId: this.oaId,
            userName,
          })
          if (data.code === 10000) {
            this.$router.push({
              path: '/userDetail',
              query: {
                userName,
                userMobile,
                ...this.$route.query,
              },
            })
          } else {
            this.$message.error(data.msg)
          }
          console.log(data)
        } catch (err) {
          console.log(err)
        }
      },

      goStudentInfo({ userName, userMobile }, i) {
        this.currentIndex = i
        this.bindUser(userName, userMobile)
      },
    },
  }
</script>
<style lang='less' scoped>
  .zxq-user_list {
    padding: 16px 24px 0 24px;
    display: flex;
    flex-wrap: wrap;
    .user-item {
      width: 200px;
      height: 72px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #f0f1f5;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333333;
      margin-top: 8px;
      margin-right: 8px;
      &:hover {
        background: rgba(54, 189, 100, 0.1);
        border: 1px solid #36bd64;
      }
      &.selected {
        background: #36bd64;
        color: #fff;
      }
    }
  }
</style>