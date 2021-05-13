
<template>
  <div class="homePage">
    <div class="top">
      <div class="title">
        <h2>{{ name }}，欢迎来到盘古中心</h2>
      </div>
      <div class="line"></div>
      <div class="header">
        <img :src="userImg" alt="头像" />
        <span
          >{{ roleNames }} <span class="shu-line">|</span
          >{{ departmentName == null ? "暂无部门信息":departmentName}}</span
        >
      </div>
    </div>
    <div class="left">
      <left-home></left-home>
    </div>
    <div class="right">
      <h2>盘古收藏菜单</h2>
      <draggable
        tag="el-tag"
        @end="onEnd"
        class="draggable"
        :list="collectionList"
      >
        <el-tag
          color="#fff"
          closable
          type="info"
          v-for="item in collectionList"
          :key="item.id"
          @click="goMenu(item.frontToolName)"
          @close="cancelItem(item.id)"
        >
          {{ item.menuName }}
        </el-tag>
      </draggable>
    </div>
  </div>
</template>

<script>
import leftHome from "./components/homePage-left/left-home";
import util from "@/common/util.js";
import { getCollection, cancelCollet, setSort } from "@/api/auth";
import { routes } from "@/router/routes";
import { mapGetters ,mapActions} from "vuex";
import draggable from "vuedraggable";
export default {
  components: { leftHome, draggable },
  data() {
    return {
      dataList: [],
    };
  },
  mounted(){
      this.getCollectAuth();
  },
  computed: {
    name() {
      return localStorage.getItem("name");
    },
    userImg() {
      return decodeURIComponent(localStorage.getItem("userImg"));
    },
    departmentName() {
      return localStorage.getItem("departmentName");
    },
    roleNames() {
      return localStorage.getItem("roleNames");
    },
    ...mapGetters("auth", ["collectionList"]),
  },
  methods: {
    goMenu(key) {
      var path = util.getPathByAcess(routes, key);
      console.log(path);
      if (path) this.$router.push(path);
    },
    cancelItem(id) {
      cancelCollet(id).then((res) => {
        this.getCollectAuth();
      });
    },
    onEnd() {
      var ids = this.collectionList.map((item) => item.id).join();
      console.log(ids);
      setSort(ids)
        .then()
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    ...mapActions('auth',["getCollectAuth"])
  },
};
</script>

<style lang='less' scoped>
.homePage {
  .top {
    height: 124px;
    background: #ffffff;
    border-radius: 2px;

    .title {
      padding: 16px;
      height: 48px;
      // box-shadow: 0px -1px 0px 0px #e4e7ed;

      h2 {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        line-height: 18px;
      }
    }
    .line {
      width: 100%;
      height: 1px;
      background-color: #f0f1f6;
    }
    .header {
      height: 76px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 16px;
      font-size: 0;
      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
      }
      span {
        margin-left: 16px;
        font-size: 14px;
        color: #606266;

        .shu-line {
          font-size: 16px;
          margin: 5px;
          color: #606266;
        }
      }
    }
  }

  .left {
    margin-top: 16px;
    float: left;
    width: 69%;
  }

  .right {
    float: right;
    margin-top: 16px;
    margin-bottom: 50px;
    width: 30%;
    height: 628px;
    border-radius: 2px;

    h2 {
      background-color: #fff;
      height: 48px;
      padding-left: 16px;

      font-size: 18px;
      font-weight: 600;
      color: #303133;
      line-height: 48px;
    }

    .draggable {
      padding: 0;
      width: 100%;
      margin-top: 1px;
      height: 580px;
      background: #ffffff;
      border-radius: 2px;
      border: none;
      // display: grid;
      // grid-template-columns: repeat(auto-fill, 28%);
      // grid-template-rows: repeat(auto-fill, 50px);
      // grid-column-gap: 10px;
      padding: 10px;
      cursor: pointer;

      .el-tag {
        float: left;
        margin-left: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style> 