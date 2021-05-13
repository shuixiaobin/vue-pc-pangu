<template>
  <div v-loading="loading">
    <div class="container-title">
      <div class="title-wrapper">
        <h2> {{$route.meta.title}}</h2>
      </div>
    </div>
    <StepComplete style="margin-top: 16px"/>
    <div class="step-handle-box">
      <el-button @click="$router.go(-1)"> 返回 </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { getAbSaleActivityDetail } from '@/api/activityManage';
import StepComplete from './components/StepComplete';
import AbSaleActivity from './abSaleActivity';

export default {
  components: {
    StepComplete,
  },
  props: {
    activityId: [String, Number],
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      activity: 'activity/getActivity',
    }),
  },
  created () {
    this.init();
  },
  methods: {
    ...mapMutations('activity', ['clearActivity']),
    ...mapActions('activity', ['loadActivity']),
    init() {
      this.loading = true;
      this.clearActivity();
      this.loadActivity({
        loadFun: () => getAbSaleActivityDetail({ activityId: this.activityId }),
        makeUp: AbSaleActivity.makeupActivity,
      })
        .then(() => {
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.message);
          this.$router.push({ name: 'abSaleActivity' });
        });
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.init();
    next();
  },
};
</script>

<style scoped>
  .step-handle-box {
    margin-top: 20px;
    text-align: center;
  }
</style>