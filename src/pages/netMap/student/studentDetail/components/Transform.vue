<template>
  <div class="transform">
    <div class="transform-left transform-item">
      <div class="transform-item-title">可选</div>
      <div class="transform-item-wrap">
        <template v-if="lableType=='origin'">
          <div class="searchInput">
            <el-input
              v-model="filterText"
              placeholder="请输入标签名称"
            ></el-input>
          </div>
          <div class="left-tree">
            <el-tree
              class="filter-tree"
              :data="leftData"
              node-key="id"
              :props="defaultProps"
              :filter-node-method="filterNode"
              :default-checked-keys="defaultKeys"
              ref="tree"
              show-checkbox
              @check="handleCheck"
              check-on-click-node
            >
            </el-tree>
          </div>
        </template>
        <template v-else-if="lableType=='event'">
          <div class="left-tree">
            <el-tree
              class="filter-tree"
              :data="leftData"
              node-key="name"
              :props="defaultProps"
              :default-checked-keys="defaultKeys"
              ref="tree"
              show-checkbox
              @check="handleCheck"
              check-on-click-node
            >
            </el-tree>
          </div>
        </template>
      </div>
    </div>
    <div class="transform-empty"></div>
    <div class="transform-right transform-item">
      <div class="transform-item-title">已选</div>
      <div class="transform-item-wrap transform-right-wrap">
        <div class="right-content">
          <div class="right-item" v-for="item in selectDataComputed" :key="item.id">
            <span>{{ item.name }}</span>
            <span @click="delTag(item)"
              ><i class="el-icon-error del-tag"></i
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Transform",
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    defaultTag: {
      type: Array,
      default: () => [],
    },
    defaultEventTag: {
      type: Array,
      default: () => [],
    },
    lableType: {
      type:String,
      default: 'origin'
    }
  },
  data() {
    return {
      defaultProps: {
        children: "childList",
        label: "name",
      },
      filterText: "",
      selectData: [],
      selectKeys: [],
      leftData: [],
      defaultKeys: [],
    };
  },
  computed:{
    selectDataComputed(){
      return this.selectData.filter(item => !item.childList)
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    treeData(val) {
      const defaultTag = this.defaultTag;
      const defaultEventTag = this.defaultEventTag;
      let select = [];
      if (val && val.length > 0) {
        this.leftData = val;
        // 对比树结构数据和需要回显到右侧的数据
        val.forEach((item) => {
          if (this.lableType == 'event') {//事件标签
            if (defaultEventTag == item.name) {
              select.push(item)
            }
          } else {
            if (!item.childList) {
              return;
            } else {
              item.childList.forEach((cItem) => {
                defaultTag.forEach((dItem) => {
                  if (cItem.id == dItem) {
                    select.push(cItem);
                  }
                });
              });
            }
          }
        });
        this.selectData = select;
        this.defaultKeys = this.selectKeys = this.selectData.map(
          (item) => item.id || item.name
        );
      }
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      if (data.parent_id === 1) {
        return data.name.indexOf(value) !== -1;
      }
    },
    handleCheck(data, checked, indeterminate) {
      const { checkedNodes, checkedKeys } = checked;
      this.selectData = checkedNodes;
      this.defaultKeys = this.selectKeys = checkedKeys;
    },
    delTag(item) {
      this.selectData.forEach((sItem, index) => {
        if (sItem.id === item.id || sItem.name === item.name) {
          this.selectData.splice(index, 1);
          this.selectKeys.splice(index, 1);
        }
      });
      this.$refs.tree.setCheckedKeys(this.selectKeys);
    },
  },
};
</script>
<style lang="less" scoped>
.transform {
  height: 400px;
  margin: 10px 0;
  display: flex;
  &-empty {
    width: 20px;
  }
  &-item {
    flex: 1;
    border: 1px solid #e4e7ed;
    border-radius: 5px;
    &-title {
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      font-weight: 500;
      border-bottom: 1px solid #e4e7ed;
    }
    &-wrap {
      padding: 20px;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }
  &-left {
    display: flex;
    flex: 1;
    flex-direction: column;
    .left-tree {
      margin-top: 20px;
      flex: 1;
      overflow: hidden;
      .filter-tree {
        height: 100%;
        overflow-y: auto;
      }
    }
  }
  &-right {
    display: flex;
    flex-direction: column;
    &-wrap {
      flex: 1;
      overflow: hidden;
      .right-content {
        height: 100%;
        overflow-y: auto;
        .right-item {
          display: inline-block;
          padding: 5px;
          font-weight: 100;
          background: #f6f6f6;
          margin: 0 0 5px 5px;
          border-radius: 20px;
          .del-tag {
            color: #ccc;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>