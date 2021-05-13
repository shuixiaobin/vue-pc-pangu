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
        <el-form-item label="活动时间">
          {{ activity.startTime + ' - ' + activity.endTime }}
        </el-form-item>
        <el-form-item label="活动类型">
          {{ activity.abActivityType == 1 ? '打折' : '直降'}}
        </el-form-item>
      </el-form>
    </div>
    <div class="container-title">
      <h2>课程优惠</h2>
    </div>
    <div class="container">
      <h2>A课</h2>
      <el-table :data="classAList">
        <el-table-column
          property="classId"
          label="课程ID"
          width="120"
          fixed="left"
        ></el-table-column>
        <el-table-column
          property="title"
          label="课程名称"
        ></el-table-column>
        <el-table-column property="actualPrice" label="实际价格" width="160">
          <template #default="scope">
            <span>￥{{ scope.row.actualPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column property="status" label="状态" width="150">
          <template #default="scope">
            <span>{{ getStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="createDate"
          label="创建日期"
          width="180"
        ></el-table-column>
      </el-table>
      <h2 class="mt20">B课</h2>
      <el-table :data="classBList">
        <el-table-column
          property="classId"
          label="课程ID"
          width="120"
          fixed="left"
        ></el-table-column>
        <el-table-column
          property="title"
          label="课程名称"
        ></el-table-column>
        <el-table-column property="actualPrice" label="实际价格" width="160">
          <template #default="scope">
            <span>￥{{ scope.row.actualPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column property="activityPrice" label="活动价格" width="160">
          <template #default>
            ￥{{activity.activityPrice}}
          </template>
        </el-table-column>
        <el-table-column v-if="activity.abActivityType == 1" label="折扣" width="150">
          <template #default>
            <span>{{ activity.sale }} 折</span>
          </template>
        </el-table-column>
        <el-table-column v-else label="直降" width="150">
          <template #default>
            <span>￥{{ activity.sale }}</span>
          </template>
        </el-table-column>
        <el-table-column property="status" label="状态" width="150">
          <template #default="scope">
            <span>{{ getStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="createDate"
          label="创建日期"
          width="180"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('activity', {
      activity: 'getActivity'
    }),
    classAList () {
      return this.activity.classA ? [this.activity.classA] : [];
    },
    classBList () {
      return this.activity.classB ? [this.activity.classB] : [];
    }
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
}
</script>

<style lang="less" scoped>
.form-flex {
  display: flex;
  .el-form-item {
    flex: 1 0 50%;
  }
}
.container {
  margin-bottom: 16px;
}
</style>