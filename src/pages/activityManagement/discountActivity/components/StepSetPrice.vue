<template>
  <div>
    <div class="container-title">
      <h2>设置优惠</h2>
    </div>
    <div class="container">
      <el-form size="small" inline label-position="left">
        <el-form-item label="活动价格（元）">
          <el-input
            v-model="batchActivityPrice"
            v-input-filter:float="2"
            placeholder="请输入活动价格"
            @blur="setPriceBatch"
          />
        </el-form-item>
        <el-form-item label="限购（个）">
          <el-input
            v-model="batchMaxNum"
            v-input-filter:number
            placeholder="请输入限购数量"
            @blur="setMaxNumBatch"
          />
        </el-form-item>
      </el-form>
      <el-table :data="netClassArr">
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
            <span>￥{{ scope.row.actualPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column property="activityPrice" label="活动价格" width="130">
          <template #default="{ row }">
            ￥<el-input
              :value="row.activityPrice"
              size="small"
              v-input-filter:float="2"
              style="width: 80px"
              @input="$set(row, 'activityPrice', $event)"
              @blur="onPriceBlur(row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column property="ratio" label="折扣" width="130">
          <template #default="{ row }">
            <span>{{ row.ratio }}折</span>
          </template>
        </el-table-column>
        <el-table-column property="maxNum" label="限购数量" width="130">
          <template #default="{ row }">
            <el-input
              :value="row.maxNum"
              size="small"
              v-input-filter:number
              style="width: 80px"
              @input="$set(row, 'maxNum', $event)"
            ></el-input>
          </template>
          <!-- <template v-else #default="{ row }">
            {{row.maxNum}}
          </template> -->
        </el-table-column>
        <el-table-column property="point" label="赠送积分" width="130">
          <template #default="scope">
            <span>{{ scope.row.point }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container-title">
      <h2>已购人数显示设置</h2>
    </div>
    <div class="container">
      <el-radio-group v-model="showType" :disabled="showTypeDisable">
        <el-radio :label="0" class="radio-item">
          显示实际购买人数(含默认基数或课程自定义基数)
        </el-radio>
        <el-radio :label="1" class="radio-item">
          在实际购买人数的基础上，每小时增加
          <el-input
            v-model="addstep1"
            v-input-filter:number
            :disabled="showTypeDisable"
            size="small"
            style="width: 80px"
          />
          人
        </el-radio>
        <el-radio :label="2" class="radio-item">
          每增加一人购买课程，则增加
          <el-input
            v-model="addstep2"
            v-input-filter:number
            :disabled="showTypeDisable"
            size="small"
            style="width: 80px"
          />
          人作为购买人数
        </el-radio>
      </el-radio-group>
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
      netClassArr: [],
      batchActivityPrice: '',
      batchMaxNum: '',
      showType: 0,
      addstep1: 0,
      addstep2: 0,
    };
  },

  computed: {
    ...mapGetters('activity', { activity: 'getActivity' }),
    showTypeDisable() {
      // 若存在限购人数不为空 的课程，则禁用已购人数设置
      return (
        this.netClassArr.findIndex(item => item.maxNum || item.maxNum === 0) !== -1
      );
    },
  },

  created() {
    // 从vuex获取变量
    ({
      showType: this.showType,
      addstep1: this.addstep1,
      addstep2: this.addstep2,
    } = this.activity);
    this.netClassArr = JSON.parse(JSON.stringify(this.activity.netClassArr));
  },
  activated() {
    // 从vuex获取变量
    ({
      showType: this.showType,
      addstep1: this.addstep1,
      addstep2: this.addstep2,
    } = this.activity);
    this.netClassArr = JSON.parse(JSON.stringify(this.activity.netClassArr));
  },

  methods: {
    ...mapMutations('activity', ['saveActivityProps']),
    rowDataSet(row, prop, index) {
      this.$set(row, prop, index);
    },
    setPriceBatch() {
      // 批量设置活动价格
      let activityPrice = parseFloat(this.batchActivityPrice);
      this.batchActivityPrice = activityPrice || '';
      if (this.batchActivityPrice) {
        this.netClassArr.forEach(item => {
          let ratio = (activityPrice / item.price * 10).toFixed(1);
          this.$set(item, 'activityPrice', activityPrice);
          this.$set(item, 'ratio', ratio);
          this.$set(item, 'point', Math.floor(item.activityPrice / 10));
        });
      }
    },
    setMaxNumBatch() {
      // 批量设置 限购人数
      if (this.batchMaxNum) {
        this.netClassArr.forEach(item => {
          this.$set(item, 'maxNum', parseInt(this.batchMaxNum));
        });
      }
    },
    onPriceBlur(item) {
      if (!item.activityPrice) return;
      this.$set(item, 'activityPrice', parseFloat(item.activityPrice));
      // 计算折扣
      let ratio = (item.activityPrice / item.price * 10).toFixed(1);
      this.$set(item, 'ratio', ratio);
      // 计算积分
      this.$set(item, 'point', Math.floor(item.activityPrice / 10));
    },
    validate() {},
    save() {
      this.saveActivityProps({
        showType: this.showType,
        netClassArr: this.netClassArr,
        addstep1: this.addstep1,
        addstep2: this.addstep2,
      });
    },
    onForward() {
      return new Promise((resovle, reject) => {
        // 所有课程活动价格不能为空
        if (
          this.netClassArr.find(
            item =>
              (typeof item.activityPrice === 'string' ||
                typeof item.activityPrice === 'number') &&
              parseFloat(item.activityPrice) === 0
          )
        ) {
          this.$message.error('课程活动价格不能为0');
          reject();
        } else if (this.netClassArr.find(item => !item.activityPrice)) {
          this.$message.error('课程活动价格不能为空');
          reject();
        } else if (
          this.netClassArr.find(item => item.ratio < 1 || item.ratio >= 10)
        ) {
          this.$message.error('折扣应为 1 - 10 间的数值');
          reject();
        } else if (
          this.netClassArr.find(
            item =>
              (typeof item.maxNum === 'string' ||
                typeof item.maxNum === 'number') &&
              parseInt(item.maxNum) === 0
          )
        ) {
          this.$message.error('课程限购人数不能为0');
          reject();
        } else if (
          this.netClassArr.find(
            item =>
              parseFloat(item.activityPrice) >= parseFloat(item.actualPrice)
          )
        ) {
          this.$message.error('课程活动价格不能大于或等于实际价格');
          reject();
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