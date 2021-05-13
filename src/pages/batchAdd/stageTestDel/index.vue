<template>
  <div>
    <BatchSteps :steps="steps" :active="active" :completed="completed"/>
    <Step1 :cacheData="cacheData" @next="next" v-if="avtiveStep.id === 0" />
    <Step2 :cacheData="cacheData" @next="next" @prev="prev" v-else-if="avtiveStep.id === 1" />
    <Step3 :cacheData="cacheData" @giveup="giveup" @prev="prev" v-else-if="avtiveStep.id === 2" @complete="handleComplete"/>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import BatchSteps from '../common/batchSteps'
import { stageTestDelSteps } from '../common/steps'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
export default {
  computed: {
    avtiveStep () {
      return this.steps[this.active]
    }
  },
  data () {
    return {
      steps: stageTestDelSteps,
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
      this.active++
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
    giveup () {
      this.active = 0
      this.cacheData = {}
      this.completed = false
    },
    handleComplete () {
      this.completed = true
    }
  },
  components: {
    BatchSteps,
    Step1,
    Step2,
    Step3,
  }
}
</script>

<style scoped>

</style>
