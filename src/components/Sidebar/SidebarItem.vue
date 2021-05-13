<template>
  <div v-if="!item.hidden">
    <template v-if="!item.children">
      <el-menu-item
        :index="item.name"
        :key="item.name"
         v-if="item.show"
      >
        <i class="iconfont" :class="item.meta.icon"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
    <el-submenu
      v-else-if="item.show"
      :index="item.name"
    >
      <template slot="title">
        <i class="iconfont" :class="item.meta.icon"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.name"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      // route object
      item: {
        type: Object,
        required: true
      }
    },
    mounted(){
			
		}
  }
</script>
<style lang="less">
  .el-menu--collapse {
    .el-submenu {
      & > .el-submenu__title {
        & > span {
          height: 0;
          width: 0;
          overflow: hidden;
          visibility: hidden;
          display: inline-block;
        }
        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }
  }
</style>
