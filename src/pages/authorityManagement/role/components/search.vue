<template>
  <el-form
    :inline="true"
    :model="formInline"
    ref="formInline"
    class="demo-form-inline"
  >
    <el-form-item label="角色：">
      <el-input
        v-model.trim="formInline.roleName"
        size="mini"
        placeholder="输入角色名称"
        clearable
        style="width:300px;"
      ></el-input>
    </el-form-item>
        
    <el-form-item label="所属系统：">
        <el-select
          v-model="formInline.systemId"
          size="mini"
          placeholder="请选择"
          style="width:100%;"
          prop="roleName"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in systemList"
            :key="index"
          ></el-option>
        </el-select>
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
</template>
<script>
  export default {
    data() {
      return {
        formInline: {
          roleName: '',
          bizStatus: '',
          systemId:3,
        },
        bizStatusList: [
          { label: '未发布', value: 0 },
          { label: '已发布', value: 1 }
        ],
         systemList: [{name:"潘多拉",id:1},{name:"申论 ",id:2},{name:"盘古",id:3}],
      };
    },
    methods: {
      onSubmit() {
        this.$emit('search', this.formInline);
      },
      resetForm() {
        Object.assign(this.$data.formInline, this.$options.data().formInline);
        this.$emit('search', this.formInline);
      }
    }
  };
</script>