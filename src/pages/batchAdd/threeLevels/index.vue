
<template>
  <div>
    <BatchSteps :steps="steps" :active="active" :completed="completed"/>
    <Step1 :cacheData="cacheData" @next="next" v-if="activeStep.id === 0" />
    <Step2 :cacheData="cacheData" @next="next" @prev="prev" v-else-if="activeStep.id === 1" />
    <Step3 :cacheData="cacheData" @next="next" @prev="prev" v-else-if="activeStep.id === 2" />
    <Step4 :cacheData="cacheData" @prev="prev" v-else-if="activeStep.id === 3" @navToStep2="navToStep2"/>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import BatchSteps from '../common/batchSteps'
import { threeLevelSteps } from '../common/steps'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
export default {
  computed: {
    activeStep () {
      return this.steps[this.active]
    }
  },
  data () {
    return {
      steps: threeLevelSteps,
      active: 0,
      cacheData: {},
      completed: false,
    }
  },
  methods: {
    next (data) {
      if (data && data.key) {
        this.cacheData[data.key] = Object.freeze(data)
      }
      if (++this.active === this.steps.length - 1) {
        this.completed = true
      }
    },
    prev () {
      const d = this.cacheData['step' + this.active]
      this.completed = false
      if (d && d.step) {
        this.active -= d.step
      } else {
        this.active--
      }
    },
    navToStep2 () {
      this.cacheData = {step1: this.cacheData.step1}
      this.active = 1
    }
  },
  components: {
    BatchSteps,
    Step1,
    Step2,
    Step3,
    Step4,
  }
}
</script>

<style>
</style>
