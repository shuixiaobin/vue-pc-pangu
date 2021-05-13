<template>
  <div>
    <div class="container-title">
      <div class="title-wrapper">
        <h2> {{$route.meta.title}}</h2>
      </div>
    </div>
    <StepView
      ref="stepView"
      :stepComponents="stepComponents"
      :submitName="submitName"
      v-loading="loading"
      @submit="submit"
    />
  </div>
</template>
<script>
import StepView from '../components/StepView';
import StepBaseInfo from './components/StepBaseInfo';
import StepSelectClass from './components/StepSelectClass';
import StepSetPrice from './components/StepSetPrice';
import StepComplete from './components/StepComplete';
import {
  postPriceOffActivity,
  setPriceOffActivityUpdate,
  getPriceOffActivityDetail,
} from '@/api/activityManage';
import { activityAddMixin } from '../mixins';
import PriceOffActivity from './priceOffActivity';

const XhrFunMap = {
  create: postPriceOffActivity,
  update: setPriceOffActivityUpdate,
  detail: getPriceOffActivityDetail,
};

export default {
  components: {
    StepView,
    StepBaseInfo,
    StepSelectClass,
    StepSetPrice,
    StepComplete,
  },
  mixins: [activityAddMixin],
  data() {
    return {
      loading: false,
      activityModule: 'priceOffActivity',
      ActivityClass: PriceOffActivity,
      stepComponents: [
        {
          title: '基础信息',
          component: StepBaseInfo,
          props: { type: this.type },
          status: () => {
            if (
              this.activity &&
              this.activity.activityName &&
              this.activity.startTime &&
              this.activity.endTime
            ) {
              return 'success';
            }
          },
        },
        {
          title: '选择课程',
          component: StepSelectClass,
          props: { type: this.type },
          status: () => {
            if (
              this.activity &&
              Array.isArray(this.activity.netClassArr) &&
              this.activity.netClassArr.length
            ) {
              return 'success';
            }
          },
        },
        {
          title: '设置优惠',
          component: StepSetPrice,
          props: { type: this.type },
          status: () => {
            if (
              this.activity &&
              Array.isArray(this.activity.netClassArr) &&
              this.activity.netClassArr.length
            ) {
              if (this.activity.netClassArr.find((item) => !item.activityPrice)) {
                // 存在未填写活动价格的条目，则为未完成状态
                return '';
              }
              return 'success';
            }
          },
        },
        {
          title: '完成',
          component: StepComplete,
          status: () => {
            if (
              this.activity &&
              this.stepComponents.every(
                (item) => item.title == '完成' || item.status() == 'success'
              )
            ) {
              return 'success';
            }
          },
        },
      ],
    };
  },
  methods: {
    getXhrFun(type) {
      if (XhrFunMap[type]) {
        return XhrFunMap[type];
      } else {
        throw Error('缺少请求方法');
      }
    },
  },
};
</script>

<style>
.step-box {
  padding: 16px;
}
</style>