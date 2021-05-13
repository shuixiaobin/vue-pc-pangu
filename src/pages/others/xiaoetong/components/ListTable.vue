<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    border
    style="width: 100%"
    ref="table"
  >
    <el-table-column
      prop="title"
      label="课程名称"
      align="center"
      min-width="300"
    >
      <template #default="{ row }">
        <div class="title-img">
          <img :src="row.img_url_compressed" />
        </div>
        <div class="title-name">
          {{ row.title }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="resource_type"
      label="类型"
      align="center"
      width="100"
    >
      <template #default="{ row }">
        {{ row.resource_type | resourceType }}
      </template>
    </el-table-column>
    <el-table-column
      prop="price"
      label="价格"
      width="120"
      header-align="center"
      align="right"
    >
      <template #default="{ row }"> ￥{{ row.price.toFixed(2) }} </template>
    </el-table-column>
    <el-table-column prop="state" label="状态" align="center" width="100">
      <template #default="{ row }">
        {{ row.state ? '隐藏' : '有效' }}
      </template>
    </el-table-column>
    <el-table-column
      prop="is_stop_sell"
      label="停售状态"
      align="center"
      width="100"
    >
      <template #default="{ row }">
        {{ row.is_stop_sell ? '已停售' : '未停售' }}
      </template>
    </el-table-column>
    <el-table-column
      prop="publish_time"
      label="上架时间"
      width="200"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="created_time"
      label="创建时间"
      width="200"
      align="center"
    >
    </el-table-column>
    <el-table-column label="操作" width="100" fixed="right" align="center">
      <template #default="{ row }">
        <slot name="handle" :row="row"> </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { ResourceTypes } from '../xiaoetong.js';

export default {
  props: {
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    resourceType(value) {
      return ResourceTypes[value] || '';
    },
  },
};
</script>

<style lang="less" scoped>
.title-img {
  height: 100%;
  float: left;
  > img {
    width: 90px;
    height: 70px;
  }
}
.title-name {
  padding-left: 10px;
  text-align: left;
  overflow: hidden;
  word-break: break-word;
}
</style>