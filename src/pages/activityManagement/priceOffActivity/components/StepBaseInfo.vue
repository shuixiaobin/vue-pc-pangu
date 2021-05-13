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
        <el-form-item label="活动标题" prop="activityName">
          <el-input
            v-model="form.activityName"
            maxlength="50"
            placeholder="请输入活动标题"
            style="width: 300px"
          />
        </el-form-item>
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
        activityName: '',
        dateRange: [],
      },
      rules: {
        activityName: [
          { required: true, message: '请输入标题', trigger: 'blur' },
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
        this.form.activityName = this.activity.activityName;
        this.form.dateRange = [
          this.activity.startTime || '',
          this.activity.endTime || '',
        ];
      }
    },
    save() {
      this.saveActivityProps({
        activityName: this.form.activityName,
        startTime: this.form.dateRange[0] || '',
        endTime: this.form.dateRange[1] || '',
      });
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