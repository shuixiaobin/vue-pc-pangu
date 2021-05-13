<template>
  <div>
    <div class="container-title">
      <h2>基础信息</h2>
    </div>
    <div class="container-Box">
      <el-form
        :model="form"
        size="small"
        label-position="top"
        :rules="rules"
        inline
        ref="form"
        class="form-flex"
      >
        <el-form-item label="选择日期" prop="dateRange">
          <el-date-picker
            v-model="form.dateRange"
            type="datetimerange"
            range-separator="~"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 360px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动类型" prop="abActivityType">
          <el-select v-model="form.abActivityType" placeholder="请选择">
            <el-option :value="1" label="打折"></el-option>
            <el-option :value="2" label="直降"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  data() {
    let dateRangeValidator = (rule, value, callback) => {
      if (!value[0] || !value[1]) {
        callback(new Error('请选择日期'));
      } else if (new Date(value[1]).getTime() < new Date().getTime()) {
        callback(new Error('活动结束时间不能小于当前时间'));
      } else {
        callback();
      }
    };
    return {
      form: {
        abActivityType: '',
        dateRange: [],
      },
      rules: {
        abActivityType: [
          { required: true, message: '请选择活动类型', trigger: 'blur' },
        ],
        dateRange: [
          { required: true, validator: dateRangeValidator, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('activity', {
      activity: 'getActivity',
    }),
  },
  watch: {
    activity() {
      this.initFormData();
    },
  },
  created() {
    this.initFormData();
  },
  activated() {
    this.initFormData();
  },
  methods: {
    initFormData() {
      if (this.activity) {
        this.form.abActivityType = this.activity.abActivityType;
        this.form.dateRange = [
          this.activity.startTime || '',
          this.activity.endTime || '',
        ];
      }
    },
    save() {
      let propObj = {
        abActivityType: this.form.abActivityType,
        startTime: this.form.dateRange[0] || '',
        endTime: this.form.dateRange[1] || '',
      };
      if (propObj.abActivityType !== this.activity.abActivityType) {
        propObj.sale = 0;
        propObj.activityPrice = '';
      }
      this.saveActivityProps(propObj);
    },
    onForward() {
      return this.$refs.form.validate();
    },
    ...mapMutations('activity', ['saveActivityProps']),
  },
};
</script>

<style lang="less" scoped>
.form-flex {
  display: flex;
  .el-form-item {
    flex: 1 0 50%;
  }
}
</style>