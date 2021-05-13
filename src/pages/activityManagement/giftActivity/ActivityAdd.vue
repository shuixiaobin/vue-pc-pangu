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
import StepSelectMainClass from './components/StepSelectMainClass';
import StepSelectGiftClass from './components/StepSelectGiftClass';
import StepComplete from './components/StepComplete';
import {
  postGiftActivity,
  setGiftActivityUpdate,
  getGiftActivityDetail,
} from '@/api/activityManage';
import { activityAddMixin } from '../mixins';
import GiftActivity from './giftActivity';

const XhrFunMap = {
  create: postGiftActivity,
  update: setGiftActivityUpdate,
  detail: getGiftActivityDetail,
};

export default {
  components: {
    StepView,
    StepBaseInfo,
    StepSelectMainClass,
    StepSelectGiftClass,
    StepComplete,
  },
  mixins: [activityAddMixin],
  data() {
    return {
      loading: false,
      activityModule: 'giftActivity',
      ActivityClass: GiftActivity,
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
          title: '选择主课程',
          component: StepSelectMainClass,
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
          title: '选择赠课',
          component: StepSelectGiftClass,
          props: { type: this.type },
          status: () => {
            if (
              this.activity &&
              Array.isArray(this.activity.giftClassArr) &&
              this.activity.giftClassArr.length
            ) {
              if (
                this.activity.validPeriodType == 'num' &&
                this.activity.validPeriodNum
              ) {
                return 'success';
              } else if (
                this.activity.validPeriodType == 'time' &&
                new Date(this.activity.endTime).getTime() <=
                  new Date(this.activity.validPeriodTime).getTime()
              ) {
                // 检查赠课到期时间是否大于 活动结束时间
                return 'success';
              }
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