<template>
  <el-form
    inline
    size="small"
    :model="form"
    ref="ruleForm"
    class="form-inline"
  >
    <el-form-item
      label="评价日期"
      prop="date"
    >
      <el-date-picker
        v-model="form.date"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        @change="handleDateChange"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item prop="keyword">
      <el-input
        placeholder="请输入课程名称或课程ID"
        v-model="form.keyword"
        clearable
      >
        <el-select
          v-model="form.select"
          slot="prepend"
          placeholder="课程名称"
          style="width:100px;"
        >
          <el-option
            v-for="(item,index) in selectList"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-input>
    </el-form-item>
    <!-- 这期暂不做 <el-form-item label="评均分">
      <el-col :span="11">
        <el-form-item
          prop="minScore"
          style="margin-bottom:0"
        >
          <el-input
            v-model="form.minScore"
            placeholder="请输入最低分"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col
        class="line"
        :span="2"
      >-</el-col>
      <el-col :span="11">
        <el-form-item
          prop="maxScore"
          style="margin-bottom:0"
        >
          <el-input
            v-model="form.maxScore"
            placeholder="请输入最高分"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
    </el-form-item> -->
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm"
      >查询</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import Util from '@/common/util';
  const endTime = new Date();
  const startTime = new Date();
  startTime.setMonth(startTime.getMonth() - 1);
  export default {
    props: {
      form: {
        type: Object,
        default: {
          date: [],
          select: 'courseName',
          keyword: '',
          minScore: '',
          maxScore: ''
        }
      }
    },
    data() {
      return {
        selectList: [
          { label: '课程名称', value: 'courseName' },
          { label: '课程ID', value: 'courseId' }
        ] //筛选下拉
      };
    },
    methods: {
      handleDateChange(val) {
        if(val){
          const end = new Date(val[1]).getTime();
          const start = new Date(val[0]).getTime();
          const yearValue = 3600 * 1000 * 24 * 366;
          console.log(start,end,yearValue)
          if (end - start > yearValue) {
            this.$message.warning(
              '查询区间请不要大于1年哦，若需查询多年数据建议分别查哦！'
            );
            this.form.date = [Util.formatDate(startTime), Util.formatDate(endTime)];
          }
        }
      },
      submitForm() {
        this.$emit('search');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$emit('search');
      }
    }
  };
</script>
<style lang='less' scoped>
  .form-inline {
    padding: 0 16px;
  }
  .line {
    text-align: center;
  }
</style>