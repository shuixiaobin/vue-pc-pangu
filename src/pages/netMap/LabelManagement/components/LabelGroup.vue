<template>
  <div class="label-wrapper">
    <div class="label-type">
      <div
        class="label-header"
        @click.stop="handleToggle()"
      >
        <div
          class="label-left"
          v-if="!isEdit"
        >
          <div
            class="label-edit "
            :class="[!readOnly?'label-edit_w75':'label-edit_w100']"
          >
            <p
              class="fl label-type_word"
              :title="labelData.name"
            >{{labelData.name}}</p>
            <i
              class="el-icon-edit"
              v-if="!readOnly"
              @click.stop="handleEdit()"
            ></i>
          </div>
          <span
            class="icon-wrapper"
            v-if="!readOnly"
          >
            <i
              class="el-icon-delete"
              v-if="labelData.childList&&labelData.childList.length === 0"
              @click.stop="handleDel()"
            ></i>
            <i
              class="el-icon-circle-plus-outline"
              @click.stop="handleAdd(labelData.id)"
            ></i>
          </span>
        </div>
        <div
          class="input-wrapper"
          v-else
        >
          <el-input
            size="small"
            @click.stop.native=""
            v-model="labelGroupName"
            maxlength="15"
            placeholder="请输入内容"
          ></el-input>
          <el-button
            size="small"
            type="text"
            style="margin-left:10px"
            @click.stop="handleSave()"
          >保存</el-button>
          <el-button
            size="small"
            type="text"
            @click.stop="handleCancel()"
          >取消</el-button>
        </div>
        <i
          class="el-icon-arrow-up"
          :class="{'deg360':isShow}"
          v-if="labelData.childList&&labelData.childList.length > 0"
        ></i>
      </div>
      <el-collapse-transition v-if="labelData.childList&&labelData.childList.length > 0">
        <div
          class="label-list"
          v-show="isShow"
        >
          <div
            class="label-name"
            v-for="(item) in labelData.childList"
            :class="{choosed : value === item}"
            :key="item.id"
            @click="handleChoose(item)"
          >{{item.name}}</div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
  import { setLabel, delLabel } from '@/api/netMap'
  import { mapState } from 'vuex'
  export default {
    props: {
      labelData: {
        type: Object,
        default: () => ({}),
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        isLabelGroup: false,
        isShow: false,
        isEdit: false,
        labelGroupName: this.labelData.name,
      }
    },
    computed: {
      ...mapState(['username']),
    },

    methods: {
      handleToggle() {
        this.isShow = !this.isShow
      },
      async setLabel() {
        try {
          const data = await setLabel({
            name: this.labelGroupName,
            parentId: 0,
            tagId: this.labelData.id,
            userName: this.username,
          })
          if (data.code === 10000) {
            this.$message.success('操作成功!')
            this.$emit('update')
          }
        } catch (error) {
          this.$message.error(error.msg)
        }
      },
      async delLabel() {
        try {
          const data = await delLabel({
            tagId: this.labelData.id,
          })
          if (data.code === 10000) {
            this.$message.success('删除成功!')
            this.$emit('update')
          }
        } catch (err) {
          this.$message.error(err.msg)
        }
      },
      // 保存标签
      handleSave() {
        if (this.labelGroupName === '') {
          this.$message.warning('标签组名称不能为空！')
          return
        }
        this.setLabel()
        this.isEdit = false
      },
      handleCancel() {
        if (this.labelGroupName === '') {
          this.labelGroupName = this.labelData.name
        }
        this.isEdit = false
      },
      // 标签编辑
      handleEdit() {
        this.isEdit = true
      },
      // 标签删除
      handleDel(i) {
        this.$confirm('是否要删除此标签类别', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.delLabel()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      // 标签添加
      handleAdd(id) {
        this.$emit('showDialog', { type: 'add', id })
      },

      // 标签选中
      handleChoose(item) {
        if (!this.readOnly) {
          this.$emit('input', item)
        }
      },
    },
  }
</script>
<style lang='less' scoped>
  .label-wrapper {
    margin-top: 4px;
    width: 100%;
    color: #303133;
    font-size: 15px;
    .label-header {
      height: 40px;
      background: #f5f7fa;
      border-radius: 2px;
      line-height: 40px;
      box-sizing: border-box;
      padding: 0 15px 0 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label-left {
        width: 86%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .label-edit {
          display: flex;
          align-items: center;
        }
        .label-edit_w75 {
          width: 80%;
        }
        .label-edit_w100 {
          width: 100%;
        }
        .icon-wrapper {
          display: flex;
        }
      }
      .label-type_word {
        height: 40px;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    i {
      padding: 0 5px;
    }
    .label-list {
      padding: 0 16px;
      box-sizing: border-box;
      margin-top: 4px;
      .label-name {
        height: 44px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 2px;
        line-height: 44px;
        text-indent: 8px;
        font-size: 14px;

        &:hover {
          background: #f5f7fa;
        }
        &.choosed {
          background: #f5f7fa;
        }
      }
    }
    .input-wrapper {
      display: flex;
      width: 100%;
      .el-input {
        flex: 1;
      }
    }
    .el-icon-edit {
      margin-left: 5px;
    }
    .el-icon-arrow-up {
      transform: rotateZ(180deg);
      transition: all 0.3s ease-in;
    }
    .deg360 {
      transform: rotateZ(0deg);
    }
  }
</style>