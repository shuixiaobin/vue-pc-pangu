<template>
  <div class="container-Box">
    <el-form
      size="small"
      :model="form"
      inline
      label-width="100px"
      class="demo-form-inline"
    >
      <div class="search-area-flex">
        <el-form-item label="活动id">
          <el-input
            v-model="form.activityId"
            placeholder="请输入活动id"
            v-input-filter:number
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select
            v-model="form.activityStatus"
            placeholder="请选择活动状态"
            clearable
            size="small"
            style="width: 250px"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in statusOptions"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 20px">
          <el-button type="primary" @click="onSubmit" size="small"
            >查询</el-button
          >
          <el-button @click="reset" size="small">重置</el-button>
        </el-form-item>
      </div>
      <div v-show="!isCollapse" class="search-area-flex">
        <el-form-item label="创建人">
          <el-input
            v-model="form.createUser"
            placeholder="请输入创建人"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程id">
          <el-input
            v-model="form.classId"
            v-input-filter:number
            placeholder="请输入课程id"
            size="small"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select
            v-model="form.activityType"
            placeholder="请选择"
            clearable
            style="width: 250px">
            <el-option :value="1" label="打折"></el-option>
            <el-option :value="2" label="直降"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            :value="[form.createTimeStart, form.createTimeEnd]"
            @input="[form.createTimeStart, form.createTimeEnd] = $event || ['', '']"
            type="daterange"
            range-separator="~"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 250px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动生效时间">
          <el-date-picker
            :value="[form.startTime, form.endTime]"
            @input="[form.startTime, form.endTime] = $event || ['', '']"
            type="daterange"
            range-separator="~"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 250px"
          >
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <span
      :class="[isCollapse ? 'toggle-btn open' : 'toggle-btn close']"
      @click="isCollapse = !isCollapse"
    >
      {{ isCollapse ? '展开' : '收起' }}
      <i
        class="iconfont"
        :class="[isCollapse ? 'iconzhankai' : 'iconshouqi']"
      ></i>
    </span>
  </div>
</template>
<script>
import ActivitySearch from '../../components/ActivitySearch';

function SearchForm() {
  Object.assign(this, {

    activityStatus: '',
    activityId: '',
    activityType: '',
    startTime: '',
    endTime: '',
    createTimeStart: '',
    createTimeEnd: '',
    createUser: '',
    classId: '',
  });
}
export default {
  extends: ActivitySearch,
  data() {
    return {
      form: new SearchForm(),
      statusOptions: [
        { label: '全部', value:''},
        { label: '未上线', value:'1'},
        { label: '已上线', value:'2'},
        { label: '已下线', value:'3'},
      ],
    };
  },

  methods: {
    getSearchData() {
      let data = {
        activityId: this.form.activityId,
        activityStatus: this.form.activityStatus
      }
      if (!this.isCollapse) {
        let createDate = this.form.createTimeStart && this.form.createTimeEnd
          ? this.form.createTimeStart + ' - ' + this.form.createTimeEnd
          : '';
        let activityDate = this.form.startTime && this.form.endTime
          ? this.form.startTime + ' - ' + this.form.endTime
          : '';
        data = {
          activityId: this.form.activityId, // 活动id
          creator: this.form.createUser, // 创建人
          createDate: createDate, // 活动创建日期(区间)
          activityDate: activityDate, // 活动时间(区间)
          singleSelect: this.form.classId ? 2 : '', // 课程查询(1-课程标题,2-课程id)
          singleValue: this.form.classId, // 课程条件对应值
          abActivityType: this.form.activityType, // 活动类型（1-打折,2-直降）
          activityStatus: this.form.activityStatus, // 活动状态(1未上线,2-已上线,3-下线)
        }
      }
      for (let key of Object.keys(data)) {
        if (!data[key] && data[key] !== 0) {
          delete data[key]
        }
      }
      return data
    },
    reset () {
      this.form = new SearchForm();
    }
  }
};
</script>