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
        <el-form-item label="活动名称">
          <el-input
            v-model="form.activityName"
            placeholder="请输入活动名称"
            size="small"
            style="width:250px"
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
          <el-button
            type="primary"
            @click="onSubmit"
            size="small"
          >查询</el-button>
          <el-button
            @click="reset"
            size="small"
          >重置</el-button>
        </el-form-item>
      </div>
      <div v-show="!isCollapse" class="search-area-flex">
        <el-form-item label="活动id">
          <el-input
            v-model="form.activityId"
            v-input-filter:number
            placeholder="请输入活动id"
            size="small"
            style="width:250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            v-model="form.createUser"
            placeholder="请输入创建人"
            size="small"
            style="width:250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程id">
          <el-input
            v-model="form.classId"
            placeholder="请输入课程id"
            v-input-filter:number
            size="small"
            style="width:250px"
          ></el-input>
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
            style="width: 250px">
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
            style="width: 250px">
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
      <span
        :class="[isCollapse?'toggle-btn open':'toggle-btn close']"
        @click="isCollapse=!isCollapse"
        >
        {{isCollapse?'展开':'收起'}}
        <i
          class="iconfont"
          :class="[isCollapse?'iconzhankai':'iconshouqi']"
        ></i>
      </span>
  </div>
</template>
<script>
  function SearchForm () {
    Object.assign(this, {
      activityName:'',
      activityStatus:'',
      activityId:'',
      startTime: '',
      endTime: '',
      createTimeStart: '',
      createTimeEnd: '',
      createUser: '',
      classId: '',
    })
  }
  export default {
    data() {
      return {
        form: new SearchForm(),
        statusOptions: [
          { label: '全部', value:''},
          { label: '未上线', value:'0'},
          { label: '已上线', value:'1'},
          { label: '已下线', value:'2'},
        ],
        isCollapse: true
      };
    },
    methods: {
      onSubmit() {
        this.$emit('search',
          this.isCollapse ? 
          {
            activityName: this.form.activityName,
            activityStatus: this.form.activityStatus
          }
          : {...this.form});
      },
      getSearchData() {
        let data = this.isCollapse ? 
          {
            activityName: this.form.activityName,
            activityStatus: this.form.activityStatus
          }
          : {...this.form};
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
<style lang="less" scoped>
.search-area-flex {
  display: flex;
  flex-wrap: wrap;
  /deep/ .el-form-item {
    min-width: 350px;
    flex: 0 0 30%;
  }
}
</style>