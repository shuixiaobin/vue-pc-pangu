<template>
  <div>
    <div class="container-title">
      <h2>设置优惠</h2>
    </div>
    <div class="container">
      <h2>A课</h2>
      <el-table :data="[classA]">
        <el-table-column
          property="classId"
          label="课程ID"
          width="120"
          fixed="left"
        ></el-table-column>
        <el-table-column property="title" label="课程名称"></el-table-column>
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
      <el-table :data="[classB]">
        <el-table-column
          property="classId"
          label="课程ID"
          width="120"
          fixed="left"
        ></el-table-column>
        <el-table-column property="title" label="课程名称"></el-table-column>
        <el-table-column property="actualPrice" label="实际价格" width="160">
          <template #default="scope">
            <span>￥{{ scope.row.actualPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column property="activityPrice" label="活动价格" width="160">
          <template #default>
            ￥<el-input
              v-model="activityPrice"
              v-input-filter:float="2"
              size="small"
              style="width: 80px"
              @blur="onPriceBlur"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column v-if="abActivityType == 1" label="折扣" width="150">
          <template #default>
            <span>{{ sale }} 折</span>
          </template>
        </el-table-column>
        <el-table-column v-else label="直降" width="150">
          <template #default>
            <span>￥{{ sale }}</span>
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
import { mapGetters, mapMutations } from 'vuex';
export default {
  props: {
    type: [Number, String],
  },
  data() {
    return {
      classA: null,
      classB: null,
      activityPrice: '',
      abActivityType: 1,
      sale: 0,
    };
  },

  computed: {
    ...mapGetters('activity', { activity: 'getActivity' }),
  },

  created() {
    // 从vuex获取变量
    ({
      classA: this.classA,
      classB: this.classB,
      abActivityType: this.abActivityType,
      activityPrice: this.activityPrice,
      sale: this.sale,
    } = this.activity);
  },
  activated() {
    // 从vuex获取变量
    ({
      classA: this.classA,
      classB: this.classB,
      abActivityType: this.abActivityType,
      activityPrice: this.activityPrice,
      sale: this.sale,
    } = this.activity);
  },

  methods: {
    ...mapMutations('activity', ['saveActivityProps']),
    onPriceBlur() {
      if (!this.activityPrice) return;
      this.activityPrice = parseFloat(this.activityPrice);
      if (this.abActivityType == 1) {
        // 打折类型
        this.sale = (this.activityPrice / this.classB.actualPrice * 10).toFixed(1);
        // 反算活动价格;
        this.activityPrice = (this.sale / 10 * this.classB.actualPrice).toFixed(2);
      } else {
        // 直降类型
        this.sale = (this.classB.actualPrice - this.activityPrice).toFixed(2);
      }
    },
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
    save() {
      this.saveActivityProps({
        activityPrice: this.activityPrice,
        sale: this.sale,
      });
    },
    onForward() {
      return new Promise((resovle, reject) => {
        // 所有课程活动价格不能为空
        if (!this.activityPrice) {
          if (
            (typeof this.activityPrice === 'string' ||
              typeof this.activityPrice === 'number') &&
            parseFloat(this.activityPrice) === 0
          ) {
            this.$message.error('课程活动价格不能为0');
            reject();
            return;
          }
          this.$message.error('课程活动价格不能为空');
          reject();
        } else if (
          this.abActivityType == 1 &&
          (this.sale < 1 || this.sale >= 10)
        ) {
          this.$message.error('折扣应为1-10的数值');
          reject();
        } else if (this.abActivityType == 2) {
          if (this.sale < 0) {
            this.$message.error('课程活动价格不能大于课程实际价格');
            reject();
            return;
          } else if (parseFloat(this.activityPrice) < 0) {
            this.$message.error('课程直降价格不能大于课程实际价格');
            reject();
            return;
          }
          resovle();
        } else {
          resovle();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.radio-item {
  display: block;
  margin-bottom: 12px;
}
.container {
  margin-bottom: 16px;
}
</style>