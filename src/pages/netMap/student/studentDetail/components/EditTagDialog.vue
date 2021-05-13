<template>
  <el-dialog
    title="编辑标签"
    :visible="visibleDialog"
    width="50%"
    :before-close="handleClose"
  >
    <div class="edit-wrap">
      <Tab
        :tagCategory="tagCategory"
        :activeKey="activeKey"
        @toggleHandle="toggleHandle"
      />
      <Transform
        v-show="activeKey === 'origin'"
        ref="originTransform"
        :treeData="originData"
        :defaultTag="defaultTag"
      />
      <Transform
        v-show="activeKey === 'event'"
        ref="eventTransform"
        :treeData="eventData"
        :lableType="'event'"
        :defaultEventTag="defaultEventTag"
      />
    </div>
    <div class="dialog-footer">
      <el-button size="small" @click="handleClose()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleOk()"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Tab from "./Tab";
import Transform from "./Transform";
import { getLabelList, getEventTag, saveUserTag } from "@/api/netMap";
export default {
  name: "EditTagDialog",
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: Array,
      default: () => [],
    },
    eventTag: {
      type: Array,
      default: () => [],
    },
    userMobile: {
      type: String,
      default: ''
    }
  },
  components: { Tab, Transform },
  data() {
    return {
      tagCategory: [
        { key: "origin", value: "来源标签" },
        { key: "event", value: "事件标签" },
      ],
      activeKey: "origin",
      originData: [],
      eventData: [],
    };
  },
  computed: {
    defaultTag() {
      return this.tag.map((item) => item.id);
    },
    defaultEventTag() {
      return this.eventTag.map(item =>item.id)
    }
  },
  mounted() {
    this.getLabelList();
    this.getEventTag();
  },
  methods: {
    async getLabelList() {
      try {
        const res = await getLabelList({ type: 1 });
        this.originData = res.data.map((item) => {
          if (item.childList && item.childList.length) {
            item.disabled = true;
          }
          return item;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getEventTag() {
      try {
        const res = await getEventTag({});
        this.eventData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    toggleHandle(item) {
      this.activeKey = item.key;
    },
    async handleOk() {
      const params = {
        userMobile: this.userMobile,
        tagId:this.$refs.originTransform.selectDataComputed.map(item => item.id),
        tagName: this.$refs.eventTransform.selectKeys[0] || ''
      }
      try {
        const res = await saveUserTag(params);
        this.handleClose()
        this.$emit('updateStudentInfo')
      } catch (error) {
        console.log(error);
      }
    },
    handleClose() {
      this.$emit("update:visibleDialog", false);
    },
  },
};
</script>
<style lang="less" scoped>
.dialog-footer {
  text-align: right;
}
</style>
