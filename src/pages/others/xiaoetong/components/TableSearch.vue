<template>
  <div class="container-Box">
    <el-form
      size="small"
      :model="form"
      inline
      label-width="100px"
      class="demo-form-inline"
    >
      <div class="search-area-flex">
        <el-form-item label="课程名称">
          <el-input
            v-model="form.title"
            placeholder="请输入课程名称"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="停售状态">
          <el-select
            v-model="form.is_stop_sell"
            clearable
            size="small"
            style="width: 150px"
          >
            <el-option label="全部" value=""/>
            <el-option label="未停售" :value="0"/>
            <el-option label="已停售" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="form.state"
            clearable
            size="small"
            style="width: 150px"
          >
            <el-option label="全部" value=""/>
            <el-option label="有效" :value="0"/>
            <el-option label="隐藏" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="form.resource_type"
            clearable
            size="small"
            style="width: 150px"
          >
            <el-option label="全部" value=""/>
            <el-option
              v-for="(label, value) in ResourceTypes"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上架时间" >
          <el-date-picker
            :value="[form.publish_time_start, form.publish_time_end]"
            @input="[form.publish_time_start, form.publish_time_end] = $event || ['', '',]"
            type="datetimerange"
            range-separator="~"
            value-format="yyyy-MM-dd hh:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 350px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            :value="[form.created_time_start, form.created_time_end]"
            @input="[form.created_time_start, form.created_time_end] = $event || [ '', '' ]"
            type="datetimerange"
            range-separator="~"
            value-format="yyyy-MM-dd hh:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 350px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="search-form-btns">
          <el-button type="primary" @click="onSubmit" size="small"
            >查询</el-button
          >
          <el-button @click="reset" size="small">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
function SearchForm() {
  Object.assign(this, {
    title: '',
    publish_time_start: '',
    publish_time_end: '',
    created_time_start: '',
    created_time_end: '',
    is_stop_sell: '',
    state: '',
    resource_type: ''
  });
}
import { ResourceTypes } from '../xiaoetong'
export default {
  data() {
    return {
      form: new SearchForm(),
      ResourceTypes,
    };
  },
  methods: {
    onSubmit() {
      this.$emit(
        'search',
        { ...this.form }
      );
    },
    getSearchData() {
      let data = { ...this.form };
      for (let key of Object.keys(data)) {
        if (!data[key] && data[key] !== 0) {
          delete data[key];
        }
      }
      return data;
    },
    reset() {
      this.form = new SearchForm();
    },
  },
};
</script>
<style lang="less" scoped>
.search-area-flex {
  display: flex;
  flex-wrap: wrap;
  /deep/ .el-form-item {
    flex: 0 0 auto;
  }
  .search-form-btns {
    width: 200px;
    margin-left: 20px;
  }
}
</style>