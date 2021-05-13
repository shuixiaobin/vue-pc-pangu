<template>
  <el-form
    size="small"
    :inline="true"
    :model="formInline"
    ref="formInline"
    class="demo-form-inline"
  >
    <el-form-item prop="select">
      <el-select
        v-model="formInline.select"
        placeholder="教师姓名"
      >
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="(item,index) in selectList"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="keyWord">
      <el-input
        v-model="formInline.keyWord"
        placeholder="不限"
        clearable
        style="width:300px;"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="search"
      >查询</el-button>
      <el-button @click="resetForm('formInline')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        selectList: [
          { value: 'id', label: '助教ID' },
          { value: 'name', label: '助教姓名' }
        ],
        formInline: {
          id: '',
          name: '',
          select: 'name',
          keyWord: ''
        }
      };
    },
    methods: {
      search() {
        let filterData = {
          id: '',
          name: ''
        };
        if (this.formInline.select == 'id') {
          filterData.id = this.formInline.keyWord;
          filterData.name = '';
        } else {
          filterData.id = '';
          filterData.name = this.formInline.keyWord;
        }
        this.$emit('search', filterData);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.search()
      }
    }
  };
</script>