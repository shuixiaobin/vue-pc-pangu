<template>
  <div class="user-group-setting">
    <div class="container-title">
      <h2>用户分群管理</h2>
    </div>
    <el-form
      label-width="120px"
      class="formBox"
    >
      <el-form-item
        label="用户分群名称"
        required
      >
        <el-input
          maxlength="20"
          size="small"
          show-word-limit
          v-model.trim="groupName"
          style="width: 380px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="分群描述"
        required
      >
        <el-input
          type="textarea"
          size="small"
          maxlength="100"
          show-word-limit
          resize="none"
          rows="4"
          v-model.trim="groupDesc"
          style="width: 500px;"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="user-group-setting-main clearfix">
      <div class="user-group-setting-left">
        <div class="setting-content-title">标签预览</div>
        <el-input
          v-model="searchStr"
          style="margin-top: 16px;"
          size="small"
          suffix-icon="el-icon-search"
        ></el-input>
        <LabelGroup
          v-for="item in sourceLabelFilter"
          :key="item.id"
          :label-data="item"
          readOnly
        />
      </div>
      <div class="user-group-setting-right">
        <div class="setting-group-wrap">
          <div class="setting-content-title">筛选条件</div>
        </div>
        <FilterConditions :conditionStr.sync="conditionStr" :conditionData='conditionData'/>
      </div>
    </div>
    <div class="user-group-setting-footer">
      <el-tooltip
        class="item"
        effect="dark"
        :content="conditionStr"
        placement="top-end"
      >
        <div class="condition-str">筛选条件计算公式: {{ conditionStr }}</div>
      </el-tooltip>
      <span style="float: right">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" :disabled="isPending&&isPending!=3?true:false" @click="editCreat">{{id?isPending!=3?'查询中 不可更新':'更新':'创建用户分群'}}</el-button>
      </span>
    </div>
  </div>
</template>

<script>
  /**
   * 华图第三区委提醒您
   * 代码千万行, 注释第一行,
   * 编码不规范, 同事两行泪.
   */
  import { mapState } from 'vuex'
  import Util from '@/common/util.js'
  import { getLabelList , saveUserGroup , getUserGroupDetail } from '@/api/netMap';
  import LabelGroup from '../LabelManagement/components/LabelGroup';
  import FilterConditions from './components/filterConditions';

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
    computed: {
      ...mapState(['username']),
      sourceLabelFilter() {
        if (!this.searchStr) return this.sourceLabel;
        const searchStr = this.searchStr;
        return this.sourceLabel
          .map(item => {
            return {
              ...item,
              childList: item.childList.filter(t => t.name.search(searchStr) > -1)
            };
          })
          .filter(item => item.childList && item.childList.length > 0);
      }
    },
    data() {
      return {
        groupName:'',
        groupDesc:'',
        sourceLabel: [],
        searchStr: '',
        conditionStr: '',
        conditionData: [{
          relation: 'and',
          childConditions: {
            relation : 'and',
            conditionForms:[
              initConditionForm()
            ]
          }
        }],
        id:this.$route.query.id, //编辑回显id
        isPending:this.$route.query.isPending, //是否是查询中 true 是 false 否
        isOk:true, //判断筛选条件是否为空
        isLock:true,//防止重复点击
      };
    },
    created() {
      getLabelList({ type: 1 }).then(res => {
        this.sourceLabel = Object.freeze(res.data);
        //console.log(this.sourceLabel);
      });
      //id 存在为数据回显
      if(this.id){
        this.getDetail()
      }
      // this.$nextTick(() => {
      // this.$refs.filterConditions.setConditions({
      //   condition: 0,
      //   childConditions: []
      // })
      // })
    },
    methods: {
      goBack(){
        this.$router.push({name:'userGroupManagement'})
      },
      async editCreat(){
        try{        
          const params={
            id : this.id ? this.id:null, //id存在是创建，否则是更新
            editor:this.username,
            groupName : this.groupName,
            groupDesc : this.groupDesc,
            options:this.conditionData
          }
          //为空判断
          this.isOk = this.conditionData.every(item=>{
            return item.childConditions.conditionForms.every(item => item.keyWords)
          })

          if(this.isLock){
            if(!this.groupName || !this.groupDesc){
              this.$message.error('分群名称和分群描述不能为空')
            }else if(params.options.length==0 || !this.isOk){
              this.$message.error('筛选条件和输入选项不能为空')
            }else{
              //禁止连续点击
              this.isLock = false
              //console.log(params)
              const data = await saveUserGroup(params)
              if (data.code === 10000) {
                this.$message.success('创建成功！')
                this.goBack() //返回列表
                this.isLock = true //打开按钮点击事件
              } else {
                this.$message.error(data.msg)
              }            
            }            
          }   

        }catch(err){
          console.log(err)
        }
      },
      async getDetail(id){
        try{
          const data = await getUserGroupDetail({id:this.id,editor:this.username,})
          if(data.code==10000){
            this.groupName = data.data.groupName
            this.groupDesc = data.data.groupDesc
            this.conditionData = data.data.options
          }else{
            this.$message.error(data.msg)
          }
        }catch(err){
          console.log(err)
        }
      }
    },
    components: {
      LabelGroup,
      FilterConditions
    }
  };
</script>

<style scoped lang="less">
  .user-group-setting {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    min-width: 1000px;
    background: #fff;
    .formBox {
      padding: 16px 0;
    }
    .setting-group-wrap {
      padding: 13px 16px;
      margin-bottom:10px;
      border-bottom: 1px solid #e4e7ed;
    }
    .user-group-setting-main {
      position: absolute;
      top: 220px;
      left: 17px;
      right: 17px;
      bottom: 76px;
      .setting-content-title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        line-height: 20px;
      }
      .user-group-setting-left {
        float: left;
        width: 240px;
        height: 100%;
        overflow: auto;
        border: 1px solid #e4e7ed;
        padding: 13px 16px;
      }
      .user-group-setting-right {
        margin-left: 240px;
        padding-bottom:10px;
        height: 100%;
        overflow: auto;
        border: 1px solid #e4e7ed;
        border-left: none;
        .add-contdtion {
          margin: 16px;
          margin-bottom: 0;
        }
      }
    }
    .user-group-setting-footer {
      position: absolute;
      bottom: 0;
      left: -24px;
      right: -24px;
      height: 56px;
      line-height: 56px;
      padding:0 24px;
      background:#fff;
      .condition-str {
        max-width: 50%;
        display: inline-block;
        white-space: nowrap; /* 规定文本是否折行 */
        overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
        text-overflow: ellipsis;
      }
    }
  }
</style>