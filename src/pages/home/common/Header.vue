<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div
      class="collapse-btn"
      @click="collapseChage"
    >
      <i
        class="el-icon-s-fold "
        :class="{'ani-rotate': collapse }"
      ></i>
    </div>
    <div class="logo"></div>
    <div class="header-right">
      <div class="header-search">
        <el-select
          v-model="value"
          filterable
          size="small"
          remote
          reserve-keyword
          placeholder="请输入盘古菜单关键字"
          :remote-method="findMenuMethod"
          :loading="loading">
          <el-option
            v-for="item in menuOptions"
            :key="item.frontToolName"
            :label="item.menuName"
            :value="item.frontToolName"
            @click.native="goMenu(item.frontToolName)">
          </el-option>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-select>
      </div>
				<div @click="notice">
					<el-badge :value="tzNum" class="header-badge"  v-if="tzNum" @click="goTz">
					  <i class="iconfont iconxitongxiaoxi"></i>
					</el-badge>
					<div class="header-badge" v-else>
					  <i class="iconfont iconxitongxiaoxi"></i>
					</div>
				</div>

      <div class="header-user-con">
        <div class="user-avator">
         <i class="iconfont iconmy" v-if="!userImg"></i>
          <img :src="userImg" alt="" v-else>
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown
          class="user-name"
          trigger="click"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="logout"
            >退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

		<!-- 右侧抽屉 -->
		<el-drawer
		  title="通知列表"
		  :visible.sync="noticeDrawer"
		  direction="rtl"
		  size="80%"
		>
			<div style="padding: 0 16px;">
				<notice-all></notice-all>	
			</div>
		</el-drawer>

  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { getFindMenu, getTzNum } from "@/api/auth";
import util from "@/common/util.js";
import NoticeAll from "../components/homePage-left/notice-all";
import { routes } from "@/router/routes";
export default {
  data() {
    return {
      collapse: false,
      name: "linxin",
      message: 2,
      value: "",
      menuOptions: [],
      loading: false,
      tzNum: 0,
			noticeDrawer: false
    };
  },
	components:{NoticeAll},
  computed: {
    selectedData() {
      return Object.values(this.selectedMap).sort((a, b) => b.id - a.id);
    },
    username() {
      return localStorage.getItem("userName");
    },
    userImg() {
      return decodeURIComponent(localStorage.getItem("userImg"));
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
    this.getNum();
  },

  methods: {
    ...mapMutations(["logout"]),
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "logout") {
        localStorage.removeItem("username");
        this.logout();
        this.$router.replace("/login");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      eventBus.$emit("collapse", this.collapse);
    },

    findMenuMethod(query) {
      // console.log(query);
      if (query !== "") {
        this.loading = true;
        getFindMenu({
          systemId: 3,
          keyWord: query
        }).then(res => {
          if (res.code == 1000000) {
            this.loading = false;
            this.menuOptions = res.data;
          }
        });
      } else {
        this.menuOptions = [];
      }
    },
    goMenu(key) {
      var path = util.getPathByAcess(routes, key);
      // console.log(path);
      if (path) {
        this.$router.push(path);
        this.value = "";
      }
    },
    getNum() {
      getTzNum(localStorage.getItem("userName")).then(res => {
        if (res.code > 0) {
          this.tzNum = res.data.unReadTotal;
        }
      });
    },
    goTz() {
      this.$router.push({ path: "/homePage" });
    },
		notice(){
			this.noticeDrawer = true;
		}
  }
};
</script>
<style lang="less" scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  font-size: 22px;
  color: #fff;
  background-color: #fff;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
}

.el-icon-s-fold {
  transform: rotate(0);
  transition: all 0.5s ease;
}
.ani-rotate {
  transform: rotate(180deg);
}

.collapse-btn {
  float: left;
  width: 48px;
  cursor: pointer;
  line-height: 56px;
  text-align: center;
  color: #c0c4cc;
}

.collapse-btn:focus,
.collapse-btn:hover {
  background: none !important;
}

.header .logo {
  float: left;
  background: url(../../../assets/img/logo.png) no-repeat left center;
  background-size: 113px 32px;
  width: 113px;
  height: 56px;
  color: #000;
}

.header-right {
  float: right;
  display: flex;
  padding-right: 30px;
}

.header-search {
  display: flex;
  height: 56px;
  line-height: 56px;
}

.header-badge {
	cursor: pointer;
  margin: 19px 24px;
  width: 18px;
  height: 18px;
  .iconxitongxiaoxi {
    color: #c0c4cc;
    font-size: 18px;
    vertical-align: top;
  }
}

.header-user-con {
  display: flex;
  height: 56px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  color: #666666;
  margin-left: 10px;
}

.user-avator {
  color: #666666;
  margin-left: 20px;
}

.user-avator img,
.iconmy {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 24px;
  color: #909399;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
<style lang="less">
  .header-search{
    .el-input__inner{
      background:#f5f7fa;
    }
  }
</style>