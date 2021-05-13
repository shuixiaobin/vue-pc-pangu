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
      </el-form>
    </div>
    <div class="container-title">
      <h2>活动课程</h2>
    </div>
    <div class="container">
      <el-table :data="activity.netClassArr">
        <el-table-column
          property="classId"
          label="课程ID"
          width="100"
          fixed="left"
        ></el-table-column>
        <el-table-column
          property="title"
          label="课程名称"
          min-width="240"
        ></el-table-column>
        <el-table-column property="price" label="课程原价" width="130">
          <template #default="scope">
            <span>￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column property="actualPrice" label="实际价格" width="130">
          <template #default="scope">
            ￥{{scope.row.actualPrice}}
          </template>
        </el-table-column>
        <el-table-column property="activityPrice" label="活动价格" width="130">
          <template #default="scope">
            ￥{{scope.row.activityPrice}}
          </template>
        </el-table-column>
        <el-table-column property="OffPrice" label="直降" width="130">
          <template #default="scope">
            <span>￥{{ scope.row.OffPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column property="maxNum" label="限购数量" width="130">
          <template #default="scope">
            {{scope.row.maxNum || '不限'}}
          </template>
        </el-table-column>
        <el-table-column property="point" label="赠送积分" width="130">
          <template #default="scope">
            <span>{{ scope.row.point }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container-title">
      <h2>已购人数显示</h2>
    </div>
    <div class="container">
      {{ showTypeText }}
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
    showTypeText () {
      let text = ''
      switch (this.activity.showType) {
        case 0:
          text = '显示实际购买人数(含默认基数或课程自定义基数)';
          break;
        case 1:
          text = `在实际购买人数的基础上，每小时增加${this.activity.addstep1}人`;
          break;
        case 2:
          text = `每增加一人购买课程，则增加${this.activity.addstep2}人作为购买人数`;
          break;
      }
      return text;
    }
  }
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