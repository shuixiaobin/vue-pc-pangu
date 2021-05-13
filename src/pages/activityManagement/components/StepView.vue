<template>
  <div style="overflow: hidden">
    <div class="step-box">
      <el-steps :active="activeStep" class="pg-steps">
        <el-step
          v-for="(item, index) in stepComponents"
          :key="index"
          :title="item.title"
          :status="getStepStatus(item)"
          @click.native="onStepClick($event, index)"
          class="pg-step"
        >
        </el-step>
      </el-steps>
    </div>
    <div>
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <keep-alive>
        <component
          :is="stepComponents[activeStep - 1].component"
          v-bind="stepComponents[activeStep - 1].props"
          ref="stepComponent"
        />
      </keep-alive>
      <!-- </transition> -->
      <div class="step-handle-box">
        <slot :activeStep="activeStep">
          <el-button v-if="activeStep > 1" @click="backward">
            上一步
          </el-button>
          <el-button
            v-if="activeStep < stepComponents.length"
            type="primary"
            @click="forward"
          >
            下一步
          </el-button>
          <el-button v-else type="primary" @click="submit">
            {{ submitName || '提交' }}
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepView',
  props: {
    // 子步骤组件 数组 [{title: 步骤标题, component: 组件对象, props: 组件prop}]
    stepComponents: Array,
    // 提交按钮名称
    submitName: String,
  },
  data() {
    return {
      activeStep: 1,
    };
  },
  methods: {
    onStepClick(event, index) {
      const iconNode = event.currentTarget.querySelector('.el-step__icon');
      const mainNode = event.currentTarget.querySelector('.el-step__main');
      if (iconNode.contains(event.target) || mainNode.contains(event.target)) {
        // 确认是步骤图标或步骤名称被点击 而不是 步骤线被点击;
        this.goStep(index + 1);
      }
    },
    goStep(step) {
      // 步骤组件
      const stepComponent = this.$refs.stepComponent;
      // 根据 step 是向前还是向后 确定触发的钩子
      const hook =
        step > this.activeStep
          ? stepComponent.onForward
          : stepComponent.onBackward;
      if (hook && hook instanceof Function) {
        hook()
          .then(() => {
            // 调用 save() 保存步骤组件状态
            stepComponent.save && stepComponent.save();
            if (step - this.activeStep > 1) {
              // 向前跨步骤跳转时 需要校验中间步骤状态是否为已完成
              const betweenSteps = this.stepComponents.slice(
                this.activeStep,
                step - 1
              );
              if (
                betweenSteps.find(
                  item => this.getStepStatus(item) !== 'success'
                )
              ) {
                // 中间步骤存在 状态不为'success'步骤时 阻止跳转
                this.$message.error('请先完成中间步骤，再进行跳转');
                return false;
              }
            }
            this.activeStep = step;
          })
          .catch(err => console.log(err));
      } else {
        // 调用 save() 保存步骤组件状态
        stepComponent.save && stepComponent.save();
        this.activeStep = step;
      }
    },
    backward() {
      this.goStep(this.activeStep - 1);
    },
    forward() {
      this.goStep(this.activeStep + 1);
    },
    submit() {
      this.$emit('submit');
    },
    getStepStatus(step) {
      if (typeof step.status === 'string') {
        return step.status || '';
      } else if (step.status instanceof Function) {
        return step.status() || '';
      }
      return '';
    },
  },
};
</script>

<style scoped>
.step-box {
  padding: 16px;
}
.step-handle-box {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.pg-step >>> .el-step__head .el-step__icon {
  cursor: pointer;
}
.pg-step >>> .el-step__main {
  width: fit-content;
  cursor: pointer;
}
</style>