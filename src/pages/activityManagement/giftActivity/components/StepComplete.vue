<template>
  <div>
    <div class="container-title">
      <h2>活动信息</h2>
    </div>
    <div class="container">
      <el-form
        size="small"
        label-position="top"
        inline
        ref="form"
        class="form-flex"
      >
        <el-form-item label="活动标题">
          {{ activity.activityName }}
        </el-form-item>
        <el-form-item label="活动时间">
          {{ activity.startTime + ' - ' + activity.endTime }}
        </el-form-item>
        <el-form-item
          label="赠课有效期"
          style="margin-right: 0; width: 100%"
        >
          {{ validPeriod }}
        </el-form-item>
      </el-form>
    </div>
    <div class="container-title">
      <h2>活动课程</h2>
    </div>
    <div class="container">
      <el-table :data="netClassArr">
        <el-table-column
          property="classId"
          label="课程ID"
          width="100"
        ></el-table-column>
        <el-table-column
          property="classNo"
          label="课程编号"
          width="220"
        ></el-table-column>
        <el-table-column
          property="title"
          label="课程名称"
          min-width="250"
        ></el-table-column>
        <el-table-column property="price" label="课程原价" width="120">
          <template #default="{ row }"> ￥{{ row.price }} </template>
        </el-table-column>
        <el-table-column property="status" label="状态" width="100">
          <template #default="{ row }">
            <span>{{ getStatus(row.status) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container-title">
      <h2>赠送课程</h2>
    </div>
    <div class="container">
      <el-table :data="giftClassArr">
        <el-table-column
          property="classId"
          label="课程ID"
          width="100"
        ></el-table-column>
        <el-table-column
          property="classNo"
          label="课程编号"
          width="220"
        ></el-table-column>
        <el-table-column
          property="title"
          label="课程名称"
          min-width="250"
        ></el-table-column>
        <el-table-column property="price" label="课程原价" width="120">
          <template #default="{ row }"> ￥{{ row.price }} </template>
        </el-table-column>
        <el-table-column property="status" label="状态" width="100">
          <template #default="{ row }">
            <span>{{ getStatus(row.status) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('activity', {
      activity: 'getActivity',
    }),
    netClassArr() {
      return this.activity ? this.activity.netClassArr : [];
    },
    giftClassArr() {
      return this.activity ? this.activity.giftClassArr : [];
    },
    validPeriod() {
      return this.activity.validPeriodType === 'num'
        ? `有效周期为 ${this.activity.validPeriodNum} 天`
        : `活动有效期至 ${this.activity.validPeriodTime}`
    },
  },
  methods: {
    getStatus(val) {
      //状态
      if (val == 0) {
        return '未上线';
      } else if (val == 1) {
        return '已上线';
      } else if (val == 2) {
        return '已下线';
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="less" scoped>
.form-flex {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    min-width: 250px;
    flex: 1 0 30%;
  }
}
.container {
  margin-bottom: 16px;
}
</style>