<template>
  <div class="lineStyle">
    <el-date-picker
      v-model="conditionForm.date"
      type="daterange"
      align="right"
      size="small"
      unlink-panels
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions"
      class="date-box">
    </el-date-picker>

    <el-select size="small" v-model="conditionForm.behavior" placeholder="请选择" @change="changeEvent">
      <el-option-group v-for="group in dimensions" :key="group.label" :label="group.label">
        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-option-group>
    </el-select>

    <el-select  v-model="conditionForm.event" placeholder="请选择" size="small">
      <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>

    <el-select style="width: 80px;" v-model="conditionForm.relation" placeholder="请选择" size="small">
      <el-option v-for="item in relationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>

    <el-select v-if="conditionForm.behavior=='wd_userEqual' || conditionForm.behavior=='wd_userNeq'" size="small" placeholder="请输入关键词" multiple collapse-tags filterable remote :remote-method="remoteMethod" @focus="focusSelectOptions" @change="changeSelectOptions($event,conditionForm)" v-model="conditionForm.keyWords" class="keyword-box">
      <el-option v-for="(item,index) in getkeyWordsOptions(conditionForm)" :key="index" :label="item.label" :value="item.value"></el-option>
    </el-select>

    <el-input v-if="conditionForm.behavior=='zb_userDid' || conditionForm.behavior=='zb_userUndo'" type="number" class="keyword-box" size="small" v-model="conditionForm.keyWords" :placeholder="conditionForm.event|keywordFilter"></el-input>
  </div>
</template>
<script>
import {  dimensions, formula } from './options'
import { remoteSearch } from '@/api/netMap';

function deteleObject(obj) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
            return (Number(a) - Number(b));
        });
        var str = '';
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    uniques = uniques;
    return uniques;
}

export default {
  data(){
    return{
      pickerOptions: {
        shortcuts: [{
          text: '今年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setDate(1);
            start.setMonth(0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      id:this.$route.query.id, //编辑回显id
      loading: false,
      dimensions:[],
      eventOptions:[],
      relationOptions:[],
      keyWordsOptions:[],
      CSOptions:[]
    }
  },
  props:['conditionForm'],
  watch:{
    'conditionForm.behavior'(nv,ov){
      this.getEvent(nv)
    }
  },
  async created(){
    this.dimensions = await dimensions()
    this.getEvent(this.conditionForm.behavior)
    this.relationOptions = await formula({column:'relation'})
  },
  methods:{
    async getEvent(line){
      this.eventOptions = await formula({column:'event',line})
    },
    changeEvent(val){
      if(val=='wd_userEqual' || val=='wd_userNeq'){
        this.$set(this.conditionForm,'event','wtTag')
        this.$set(this.conditionForm,'keyWords',[])
      }else{
        this.$set(this.conditionForm,'event','classId')
        this.$set(this.conditionForm,'keyWords','')
      }
    },
    getkeyWordsOptions(target){
      let selectedKeywordOptions = target.selectedKeywordOptions
      if(selectedKeywordOptions && selectedKeywordOptions.length>0 && this.id){
        return deteleObject(selectedKeywordOptions.concat(this.keyWordsOptions))
      }else {
        return this.keyWordsOptions
      }
    },
    async remoteMethod(query){
      if (query !== '') {
        this.loading = true;
        const data = await remoteSearch({
          behavior:this.conditionForm.behavior,	//行为
          event:this.conditionForm.event,	//	事件
          relation:this.conditionForm.relation,	//逻辑关系
          keyWords:query	//	关键字
        })
        if(data.code==10000){
          this.loading = false;
          this.keyWordsOptions = data.data           
        }else{
          this.loading = false;
          this.keyWordsOptions = [];
        }
      } else {
        this.keyWordsOptions = [];
      }
    },
    focusSelectOptions(){
      this.keyWordsOptions = deteleObject(this.keyWordsOptions.concat(this.CSOptions))
    },
    changeSelectOptions(val,target){
      let filterData = this.keyWordsOptions.filter(item =>{
        return val.indexOf(item.value) > -1
      })
      //判断数据回显与创建
      if(this.id){
        this.CSOptions = deteleObject(target.selectedKeywordOptions.concat(filterData))
      }else{
        this.CSOptions = deteleObject(this.CSOptions.concat(filterData))
      }
      this.$set(target,'selectedKeywordOptions',this.CSOptions)
    }
  },
  filters:{
    keywordFilter(val){
      switch(val){
        case 'exam':
          return '请输入模考ID'
          break;
        case 'estimatePoint':
          return '请输入估分ID'
          break;
        default:
          return '请输入课程ID'
      }
    }
  }
}
</script>
<style lang="less" scoped>
 .lineStyle{
   display: flex;
   padding:0 5px;
   & > div {
     margin-right: 8px;
   }
 }
 .date-box{
   width:300px;
 }
 .keyword-box{
  width:300px;
 }
</style>