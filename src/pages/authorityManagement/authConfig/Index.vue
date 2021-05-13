<template>
  <div>
    <MenuTitle />
    <div class="container-Box" style="height: calc(100% - 82px);">
      <el-tree
        class="tree"
        id="authTree"
        ref="authTree"
        :data="authData"
        :default-expanded-keys="expandedNodeKeys"
        node-key="id"
        :props="defaultProps"
      >
        <template #default="{ node, data }">
          <div class="auth-tree-node">
            <span class="auth-tree-node__label">{{ node.label }}</span>
            <el-button
              v-if="data.id != 0"
              v-auth="auth.ADD"
              type="text"
              icon="el-icon-edit"
              size="small"
              class="auth-btn auth-btn__primary"
              @click.stop="authEdit(node, data)"
            />
            <el-button
              v-if="data.menuType === 1"
              v-auth="auth.ADD"
              type="text"
              icon="el-icon-circle-plus"
              size="small"
              class="auth-btn auth-btn__success"
              @click.stop="authAdd(node, data)"
            />
            <el-button
              v-if="data.id != 0"
              v-auth="auth.DELETE"
              type="text"
              icon="el-icon-delete-solid"
              size="small"
              class="auth-btn auth-btn__error"
              @click.stop="authDelete(node, data)"
            />
          </div>
        </template>
      </el-tree>
    </div>
    <AuthAddDialog
      :visible.sync="authAddVisible"
      :menuId="authIdToEdit"
      :parent="parentOfNewAuth"
      @saveAuth="onAuthSave"
    />
  </div>
</template>

<script>
import { getAuthTree, deleteAuth } from '@/api/authority.js';
import AuthAddDialog from './AuthAddDialog.vue';
export default {
  components: { AuthAddDialog },
  data() {
    return {
      auth: {
        ADD: 'AC_ADD',
        DELETE: 'AC_DELETE',
      },
      authData: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
        disabled: function (a, b) {
          return a.sign == 1;
        },
        isLeaf: 'leaf',
      },
      expandedNodeKeys: [0],
      authAddVisible: false,
      authIdToEdit: null,
      parentOfNewAuth: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      return getAuthTree().then(res => {
        if (res.code === 1000000) {
          this.authData = [res.data];
          return res;
        } else {
          this.$message.error(res.message)
          return false;
        }
      });
    },
    authAdd(node, data) {
      this.authIdToEdit = null;
      this.parentOfNewAuth = data;
      this.authAddVisible = true;
    },
    authEdit(node, data) {
      this.authIdToEdit = data.id;
      this.parentOfNewAuth = null;
      this.authAddVisible = true;
    },
    authDelete(node, data) {
      this.$confirm(`确定要删除权限 ${data.menuName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAuth(data.id)
            .then(res => {
              if (res.code === 1000000) {
                // this.$refs.authTree.remove(node);
                this.$message.success('权限删除成功');
                let expandedNodeKeys = this.getExpandedNodeKeys();
                // 请求完节点树后 还原展开状态
                this.getList().then(() => {
                  this.expandedNodeKeys = expandedNodeKeys;
                });
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
        });
    },
    onAuthSave(authData) {
      // 收集展开的节点id
      let expandedNodeKeys = this.getExpandedNodeKeys();
      // 将被新增的节点的父节点id 加进数组
      if (authData.parentId != -1 && !expandedNodeKeys.includes(authData.parentId)) {
        expandedNodeKeys.push(authData.parentId);
      }
      // 请求完节点树后 还原展开状态
      this.getList().then(() => {
        this.expandedNodeKeys = expandedNodeKeys;
      });
    },
    getExpandedNodeKeys () {
      // 获取树节点map
      const authTree = this.$refs.authTree;
      const nodesMap = authTree.store.nodesMap;
      // 收集展开的节点id
      let expandedNodeKeys = [];
      for (let key in nodesMap) {
        nodesMap[key].expanded && expandedNodeKeys.push(key);
      }
      return expandedNodeKeys;
    }
  },
};
</script>

<style lang="less" scoped>
@import '../../../assets/css/theme-color.less';
.auth-tree-node__label {
  margin-right: 10px;
}
.auth-btn(@type: primary) {
  &.auth-btn__@{type} {
      // color: mix(white, @@type, 30%);
      color: @primary2;
    &:hover, &:focus {
      color: @@type;
    }
    &:active {
      color: mix(black, @@type, 10%);
    }
  }
}
.auth-btn {
  margin-left: 5px;
  padding: 5px 0;
  font-size: 16px;
  .auth-btn();
  .auth-btn(success);
  .auth-btn(error);
}
</style>