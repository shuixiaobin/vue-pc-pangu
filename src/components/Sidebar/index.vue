<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="defaultActive"
      :collapse="collapse"
      :background-color="collapse?'#1B264A':'#F8F9FB'"
      :text-color="collapse?'#fff':'#333'"
      active-text-color="#1856FF"
      unique-opened
      @select="selectMenu"
      mode="vertical"
    >
      <el-menu-item  index="homePage" class="ht-home">
        <i
          class="iconfont iconshouye"
          :style="{color:(collapse?'#8D92A4':'#333')}"
        ></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <sidebar-item
        v-for="route in routeList"
        :key="route.name"
        :item="route"
        :path="route.name"
      />
    </el-menu>
  </div>
</template>

<script>
  import { routes } from '@/router/routes'
  import SidebarItem from './SidebarItem'
  import {mapGetters,mapState,mapActions} from 'vuex'
  import store from '@/store/index'
  import {getButtonInfo} from '@/common/directive'

  export default {
    components: {
      SidebarItem
    },
    data() {
      return {
        collapse: false,
        routes: routes.filter(item => item.meta && item.meta.title)
      }
    },
    computed: {
      defaultActive() {
        const route = this.$route
        const { meta, name } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return name
      },
      ...mapGetters('auth', ['routeList']),
    },
    mounted(){
      this.getCollectAuth();
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      eventBus.$on('collapse', msg => {
        this.collapse = msg
        eventBus.$emit('collapse-content', msg)
      })
    },

    methods: {
      selectMenu(name, indexPath) {
        this.$router.push({ name })
      },
      getUserAuth(){
          this.getAuths().then(data=>{
            //getButtonInfo();
          }).catch(error=>{
            this.$message.error(error.message)
          });
      
      },
       ...mapActions('auth',["getCollectAuth"])
    }
  }
</script>
<style lang='less' scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 57px;
    bottom: 0;
    overflow-y: scroll;
  }
  .sidebar::-webkit-scrollbar {
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 236px;
  }
  .sidebar > ul {
    height: 100%;
  }
</style>
<style lang="less">
  .ht-home {
    &.is-active {
      .iconshouye {
        color: #1856ff !important;
      }
    }
  }
  .el-menu--collapse{
    .iconshouye{
      font-size: 18px;
    }
    .ht-home:hover {
      outline: 0;
      background: #1856ff !important;
      .iconshouye {
        color: #fff !important;
      }
    } 
    .is-active {
      .iconshouye {
        color: #8D92A4 !important;
      }
    }
  }
  
</style>