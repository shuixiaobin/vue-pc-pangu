<template>
  <div class="container-Box">
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-input
          v-model.trim="formInline.content"
          size="mini"
          placeholder="输入手机号/用户名"
          clearable
          style="width:300px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select
          v-model="formInline.bizStatus"
          placeholder="请选择"
          size="mini"
          clearable
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in bizStatusList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色：">
        <el-select
          v-model="formInline.roleIds"
          placeholder="请选择"
          size="mini"
          clearable
        >
          <el-option
            :label="item.roleName"
            :value="item.id"
            v-for="(item,index) in roleList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="创建时间："
        v-if="isShowTimeSearch"
      >
        <el-date-picker
          v-model="formInline.startCreateTime"
          type="datetime"
          size="mini"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="开始时间"
        >
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="formInline.endCreateTime"
          type="datetime"
          size="mini"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="结束时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="onSubmit"
        >查询</el-button>
        <el-button
          size="mini"
          @click="resetForm"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <span
    :class="[isShowTimeSearch?'toggle-btn close':'toggle-btn open']"
    @click="isShowTimeSearch=!isShowTimeSearch"
  >{{isShowTimeSearch?'收起':'展开'}} <i
      class="iconfont"
      :class="[isShowTimeSearch?'iconshouqi':'iconzhankai']"
    ></i></span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        content: "",
        bizStatus: "",
        roleIds: "",
        startCreateTime: "",
        endCreateTime: ""
      },
      bizStatusList: [
        { label: "正常", value: 0 },
        { label: "封禁(离职)", value: 2 }
      ],
      isShowTimeSearch: false
    };
  },
  props: ["roleList"],
  methods: {
    onSubmit() {
      this.$emit("search", this.formInline);
    },
    resetForm() {
      Object.assign(this.$data.formInline, this.$options.data().formInline);
      this.$emit("search", this.formInline);
    }
  }
};
</script>
