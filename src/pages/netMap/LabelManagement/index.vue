<template>
  <div class="label-management">
    <MenuTitle />
    <div class="netmap-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="来源标签"
          name="1"
        >
          <el-row>
            <el-col :span="8">
              <div class="container">
                <el-button
                  style="width:100%"
                  size="small"
                  type="primary"
                  a-auth="'TM_ADDSOURCE'"
                  @click="addLabelGroup"
                >新增来源标签组</el-button>
                <LabelGroup
                  v-for="item in sourceLabel"
                  v-model="choosedLabel"
                  :key="item.id"
                  :label-data="item"
                  @showDialog="showDialog"
                  @update="update"
                />
                <div
                  class="label-type label-group"
                  v-if="isLabelGroup"
                >
                  <div class="label-header">
                    <div class="input-wrapper">
                      <el-input
                        size="small"
                        maxlength="15"
                        ref="inputRef"
                        v-model="newLabelGroup"
                        placeholder="请输入内容"
                      ></el-input>
                      <el-button
                        size="small"
                        type="text"
                        @click="handleSaveLabelGroup"
                      >保存</el-button>
                      <el-button
                        size="small"
                        type="text"
                        @click="handleCancelLabelGroup"
                      >取消</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="16">
              <LabelContent
                :label-detail="choosedLabel"
                @showDialog="showDialog"
              />
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          label="事件标签"
          name="5"
        >
          <el-row>
            <el-col :span="8">
              <div class="container">
                <LabelGroup
                  v-for="item in eventLabel"
                  :readOnly="true"
                  :key="item.id"
                  :label-data="item"
                />
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <LabelDialog
      :dialog-visible.sync="dialogVisible"
      :title="dialogTitle"
      :labelDetail="labelType === 'add' ? addLabel : choosedLabel"
      @update="update"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getLabelList, setLabel } from '@/api/netMap'
  import LabelGroup from './components/LabelGroup'
  import LabelDialog from './components/LabelDialog'
  import LabelContent from './components/LabelContent'
  export default {
    components: {
      LabelGroup,
      LabelContent,
      LabelDialog,
    },
    data() {
      return {
        activeTab: '1',
        sourceLabel: [],
        eventLabel: [],
        labelType: 'add',
        isLabelGroup: false,
        newLabelGroup: '', // 新增标签组
        choosedLabel: {}, //当前选中标签
        addLabel: {},
        dialogVisible: false,
      }
    },
    computed: {
      ...mapState(['username']),
      dialogTitle() {
        return this.labelType === 'add' ? '新增标签' : '编辑标签'
      },
    },
    watch: {
      activeTab: {
        handler(val) {
          this.getLabelList()
        },
        immediate: true,
      },
    },
    methods: {
      async getLabelList() {
        try {
          const { data } = await getLabelList({ type: this.activeTab })
          if (this.activeTab === '1') {
            if (this.choosedLabel.id) {
              let updateLabel
              for (let i = 0; i < data.length; i++) {
                const item = data[i]
                updateLabel = item.childList.find(each => each.id === this.choosedLabel.id)
                if (updateLabel) break
              }
              this.choosedLabel = updateLabel
            }
            this.sourceLabel = Object.freeze(data)
          } else {
            this.eventLabel = Object.freeze(data)
          }
        } catch (err) {
          console.log(err)
        }
      },
      async setLabel(params) {
        try {
          const data = await setLabel(params)
          if (data.code === 10000) {
            this.$message.success('操作成功')
            this.getLabelList()
          }
        } catch (error) {
          console.log(error)
        }
      },
      // 更新标签列表
      update() {
        this.dialogVisible = false
        this.getLabelList()
      },
      // 打开标签弹窗
      showDialog({ type, id }) {
        this.labelType = type
        this.addLabel = { parent_id: id }
        this.dialogVisible = true
      },
      // 新增标签组
      addLabelGroup() {
        this.isLabelGroup = true
        this.$nextTick(() => {
          this.$refs.inputRef.focus()
        })
      },
      // 保存标签组
      handleSaveLabelGroup() {
        if (this.sourceLabel.some(item => item.name === this.newLabelGroup)) {
          this.$message.warning('此标签名称已存在！')
          return
        }
        this.isLabelGroup = false
        this.setLabel({
          name: this.newLabelGroup,
          parentId: 0,
          userName: this.username,
        })
        this.newLabelGroup = ''
      },
      // 取消保存标签组
      handleCancelLabelGroup() {
        this.newLabelGroup = ''
        this.isLabelGroup = false
      },
    },
  }
</script>
<style lang="less" scoped>
  .label-management {
    .container-title {
      border-bottom: none;
    }
  }
</style>
<style lang="less">
  .netmap-container {
    background: #fff;
    box-sizing: border-box;
  }
  .label-type {
    margin-top: 8px;
    &:first-child {
      margin-top: 0;
    }
  }
  .label-group {
    .label-header {
      .input-wrapper {
        .el-input--mini {
          margin-right: 16px;
        }
        .el-input__inner {
          flex: 1;
        }
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .label-management {
    .el-tabs__header {
      margin-left: 16px;
      margin-bottom: 0 !important;
    }
    .el-tabs__item {
      height: 48px;
      line-height: 48px;
    }
  }
</style>