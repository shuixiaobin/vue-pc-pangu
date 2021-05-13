<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      size="small"
    >
      <el-form-item>
        <el-select
          v-model="form.DateField"
          placeholder="下单日期"
          size="small"
          class="mr10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.DateField"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="form.time01"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="small"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单来源">
        <el-checkbox-group v-model="form.webType">
          <el-checkbox
            :label="item.value"
            v-for="item in SelectOptions.webType"
            :key="item.value"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="授课类型">
        <el-checkbox-group v-model="form.videoType">
          <el-checkbox
            :label="item.value"
            v-for="item in SelectOptions.VideoType"
            :key="item.value"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="课程包含">
        <el-checkbox-group v-model="form.videoTypes">
          <el-checkbox label="4">包含实物</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择订单">
        <el-select
          v-model="form.SearchType"
          placeholder="所有订单"
          size="small"
          class="mr10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.SearchType"
          ></el-option>
        </el-select>
        <el-select
          v-model="form.Ordertype"
          placeholder="全部渠道"
          size="small"
          class="mr10"
        >
          <el-option
            label="全部渠道"
            value="-1"
          ></el-option>
          <el-option
            :label="name"
            :value="key"
            :key="key"
            v-for="(name,key) in SelectOptions.OrderType"
          ></el-option>
        </el-select>
        <el-select
          v-model="form.PaymentType"
          placeholder="全部支付方式"
          size="small"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.PaymentType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格区间">
        <el-select
          v-model="form.price"
          placeholder="不限"
          size="small"
          class="mr10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.price"
          ></el-option>
        </el-select>
        <el-input
          v-model="form.minPrice"
          size="small"
          class="inputWidth"
        ></el-input>
        <span class="labelWidth50">≤价格&lt;</span>
        <el-input
          v-model="form.maxPrice"
          size="small"
          class="inputWidth"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择课程">
        <el-select
          v-model="form.singleselect"
          placeholder="课程标题"
          size="small"
          class="mr10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.singleselect"
          ></el-option>
        </el-select>
        <el-input
          v-model="form.singleValue"
          size="small"
          class="inputWidth"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择筛选项">
        <el-select
          v-model="form.Field"
          placeholder="订单编号"
          size="small"
          class="mr10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.Field"
          ></el-option>
        </el-select>
        <el-input
          v-model="form.Keyword"
          size="small"
          class="inputWidth"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <span class="labelWidth">选择课程状态</span>
        <el-select
          v-model="form.orderStatus"
          placeholder="不限"
          size="small"
          class="mr10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.orderStatus"
          ></el-option>
        </el-select>
        <span class="labelWidth">所属分校</span>
        <el-select
          v-model="form.fenxiao1"
          placeholder="不限"
          size="small"
          class="mr10"
        >
          <el-option
            label="不限"
            value="-1"
          ></el-option>
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.fenxiao1"
          ></el-option>
        </el-select>
        <span class="labelWidth">分校课程类型</span>
        <el-select
          v-model="form.fenXiaoType"
          placeholder="不限"
          size="small"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in SelectOptions.fenXiaoType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!--  label="分校(业绩统计)" <el-col :span="3">
          <el-select
            v-model="form.province"
            placeholder="不限"
            size="small"
            @change="getBranchCityList"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in SelectOptions.province"
            ></el-option>
          </el-select>
        </el-col> -->
        <!-- <el-col :span="3">
          <el-select
            v-model="form.city"
            placeholder="请选择"
            size="small"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in cityList"
            ></el-option>
          </el-select>
        </el-col> -->
        <el-col :span="10">
          <el-checkbox
            v-model="form.ShowzeroPrice"
            style="margin-right:20px;"
            true-label="on"
            false-label=""
          >显示0元订单</el-checkbox>
          <el-button
            type="primary"
            size="small"
            @click="onSubmit"
          >查询</el-button>
          <el-button
            size="small"
            @click="reset"
          >重置</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import util from '@/common/util';
  import { getBranchCityList } from '@/api/orderManage';
  export default {
    data() {
      return {
        cityList: [],
        form: {
          DateField: 'addtime', //搜索时间类型
          time01: [
            util.timeStampDate(new Date(new Date().setHours(0, 0, 0, 0))),
            util.timeStampDate(new Date(new Date().setHours(23, 59, 59, 59)))
          ], //搜索时间的值
          webType: [], //订单来源
          videoType: [], //授课类型
          videoTypes: [], //课程包含
          SearchType: '', //查询条件所有订单
          Ordertype: '', //全部渠道
          PaymentType: '', //支付方式
          price: '', //价格选项
          minPrice: '', //最小价
          maxPrice: '', //最高价
          singleselect: '', //课程搜索类型
          singleValue: '', //课程搜索的值
          Field: '', //选择筛选项
          Keyword: '', //选择筛选项搜索值
          orderStatus: '', //课程状态
          fenxiao1: '', //所属分校
          fenXiaoType: '', //分校课程类型
          province: '', //分校省份
          city: '', //分校城市
          ShowzeroPrice: '', //是否显示0元
          type: 2, //多条件搜索
          includeClass: 0 //包含套餐内课程的销售数据
        }
      };
    },
    props: ['SelectOptions'],
    methods: {
      getBranchCityList(provinceId) {
        getBranchCityList({
          provinceId
        })
          .then(res => {
            if (res.code == 10000) {
              this.cityList = res.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      reset() {
        Object.assign(this.$data.form, this.$options.data().form);
      },
      onSubmit() {
        this.$emit('search', this.form);
      }
    }
  };
</script>
<style lang="less">
  .inputWidth {
    width: 250px;
    margin-right: 10px;
  }
  .labelWidth50 {
    display: inline-block;
    width: 50px;
    margin-right: 10px;
    color:#606266;
  }
  .labelWidth {
    display: inline-block;
    margin-right: 5px;
    color:#606266;
  }
</style>