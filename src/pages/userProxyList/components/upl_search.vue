<template>
  <div class="searchBox">
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-select
          v-model="formInline.searchKey"
          placeholder="请选择"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in searchKeyData"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入内容"
          v-model="formInline.searchValue"
          style="width:400px;"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.orderSearchKey"
          placeholder="请选择"
        >
          <el-option
            label="下单时间"
            value="1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="formInline.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="search"
        >搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formInline: {
          searchKey: '1',
          searchValue: '',
          orderSearchKey: '1',
          time: ''
        },
        searchKeyData: [
          { value: '1', label: '代报用户名' },
          { value: '2', label: '被代报用户名' },
          { value: '3', label: '课程ID' },
          { value: '4', label: '课程名称' },
          { value: '5', label: '订单编号' }
        ]
      }
    },
    methods: {
      search() {
        this.$emit('search', {
          searchKey: this.formInline.searchKey,
          searchValue: this.formInline.searchValue,
          startTime: this.formInline.time?this.formInline.time[0]:null,
          endTime: this.formInline.time?this.formInline.time[1]:null
        })
      }
    }
  }
</script>