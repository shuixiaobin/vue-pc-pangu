<template>
  <div>
    <el-table
      v-loading="loading"
      :data="activityListData"
      border
      style="width: 100%"
      @selection-change="$emit('selection-change', $event)"
      @sort-change="$emit('sort-change', $event)"
      ref="table"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        fixed
        prop="activityId"
        label="活动ID"
        align="center"
        width="100"
      >
      </el-table-column>
      <slot name="column">
        <el-table-column
          prop="activityName"
          label="活动名称"
          width="300"
        >
        </el-table-column>
      </slot>
      <el-table-column
        prop="startTime"
        label="起始时间"
        sortable="custom"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        sortable="custom"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable="custom"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="activityStatus"
        label="状态"
        align="center"
        width="120"
      >
        <template #default="{row}">
          {{ getActivityStatus(row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createUser"
        label="创建人"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
      >
        <template #default="{row}">
          <slot name="handle" :row="row">
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    propMap: Object
  },
  computed: {
    // 根据 活动属性map 适配活动列表对象
    activityListData () {
      return this.tableData.map(item => {
        let activity = { ...item };
        for (let key in this.propMap || {}) {
          activity[key] = item[this.getPropName(this.propMap[key])]
        }
        return activity;
      })
    }
  },
  methods: {
    clearSelection () {
      this.$refs.table.clearSelection();
    },
    getPropName (prop) {
      if (this.propMap && this.propMap[prop]) {
        return this.propMap[prop]
      } else {
        return prop
      }
    },
    getActivityStatus (activity) {
      let activityStatus = activity.activityStatus
      return ['未上线', '已上线', '已下线', '', '已删除'][activityStatus]
    }

  }
};

</script>

<style>

</style>