<template>
  <div>
     <div v-for="(item,index) in conditionData" :key="index" class="condition-operate">
        <div class="condition-item-left" v-if="conditionData.length > 1">
          <div class="condition-line"></div>
          <div class="condition-value" @click="switchValue(item)" v-if="index!=conditionData.length-1">
            {{ item.relation === 'and' ? '且' : '或 '}}
          </div>
        </div>
        <div class="condition-item-right" :class="{'show-condition': conditionData.length > 1}">
          <div class="condition-item">
            <ConditionOperate
              v-model="item.childConditions.relation"
              :showCondition="item.childConditions.conditionForms.length > 1"
            >
              <div class="condition-form" v-for="(conditionForm, idx) in item.childConditions.conditionForms" :key="idx">
                <div class="condition-form-item-key">{{conditionKey(index, idx, item.childConditions.conditionForms)}}</div>
                <eventSelect :conditionForm="conditionForm"/>
                <i class="el-icon-delete" @click="removeConditionItem(item.childConditions.conditionForms, idx, index)"></i>
              </div>
            </ConditionOperate>
            <el-button :disabled="item.childConditions.conditionForms.length >= 5" class="add-contdtion" @click="addConditionForm(item.childConditions.conditionForms)" size="small">添加条件</el-button>
          </div>
        </div> 
     </div>
     <el-button :disabled="conditionData.length >= 10" class="add-contdtion" size="small" @click="addCondition">添加条件组</el-button>    
  </div>
</template>
<script>
  import Util from '@/common/util.js'
  import ConditionOperate from './conditionOperate'
  import eventSelect from './eventSelect'

  function initConditionFormItem () {
    return {
      relation: 'and',
      childConditions: {
        relation : 'and',
        conditionForms:[
          initConditionForm()
        ]
      }
    }
  }

  function initConditionForm () {
    return{
      date:[Util.formatDate(new Date()) ,Util.formatDate(new Date())],
      behavior: 'zb_userDid',
      event: 'classId',
      relation: '=',
      keyWords: ''
    }
  }

  export default {
    data(){
      return{
      }
    },
    components: {
      ConditionOperate,
      eventSelect
    },
    props:['conditionData'],
    computed: {
      conditionStr () {
        const descs = ['且', '或']
        const d = this.conditionData
        let ret = ''
        if (d.length === 0) return ret
        ret += d.map((conditionItem, index) => {
          const target = conditionItem.childConditions.conditionForms
          let ans = ''
          if (target.length > 1 && d.length > 1) ans += '('
          ans += target.map((_, idx) => this.conditionKey(index, idx,target)).join(descs[conditionItem.childConditions.relation=='and'?0:1])
          if (target.length > 1 && d.length > 1) ans += ')'
          if (index!==d.length-1){
            ans += descs[this.conditionData[index].relation=='and'?0:1]
          }
          return ans
        }).join('')
        return ret
      }
    },
    watch: {
      conditionStr: {
        immediate: true,
        handler (val) {
          this.$emit('update:conditionStr', val)
        }
      }
    },    
    methods:{
      switchValue (target) {
        if(target.relation=='and'){
          this.$set(target,'relation','or')
        }else if(target.relation=='or'){
          this.$set(target,'relation','and')
        }
      },
      conditionKey (idx1, idx2, target) {
        const a = 'A'.charCodeAt(0)
        if(target&&target.length>1){
          if (idx2 === 0) {
            return String.fromCharCode(a + idx1)+ (idx2 + 1)
          }
        }
        if (idx2 === 0) {
          return String.fromCharCode(a + idx1)
        }
        return  String.fromCharCode(a + idx1) + (idx2 + 1)
      }, 
      addCondition () {
        this.conditionData.push(initConditionFormItem())
      },      
      addConditionForm (target) {
        target.push(initConditionForm())
      },
      removeConditionItem (target, idx, childConditionIndex) {
        target.splice(idx, 1)
        if (target.length === 0) {
          this.conditionData.splice(childConditionIndex, 1)
        }
      }           
    }
  };
</script>

<style scoped lang="less">
@import url('~@/assets/css/theme-color.less');
.condition-operate {
  height: 100%;
  position: relative;
}
.condition-item {
  background: #F5F7FA;
  margin-bottom: 16px;
  padding: 10px 17px 10px 0;
}
.condition-form {
  margin: 16px 0;
  display: flex;
  align-items: center;
}
.condition-form-item-key {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  color: @primary;
  border: 1px solid @primary;
  background: #fff;
  line-height: 32px;
  text-align: center;
  display: block;
  flex-shrink: 0
}
.add-contdtion {
  margin: 16px;
  margin-bottom: 0;
}
.condition-item-left {
  position: absolute;
  left: 0;
  width: 60px;
  top: 0;
  bottom: 0;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.condition-line {
  flex: 1;
  background: @primary;
  width: 2px;
}
.condition-item-right {
  position: relative;
  height: 100%;
  overflow: auto;
  padding-left: 24px;
  &.show-condition {
    margin-left: 60px;
    padding-left: 0;
  }
}
.condition-value {
  width: 28px;
  height: 28px;
  background: @primary;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  line-height: 28px;
  text-align: center;
  margin: 4px 0;
  user-select: none;
  cursor: pointer;
}
</style>