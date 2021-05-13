<template>
  <el-dialog
    title="新增协议参数"
    :visible.sync="dialogVisible"
    width="40%"
    @close="close"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <div class="left">
        <el-form-item
          label="协议参数名称"
          prop="paramName"
          style="width: 250px"
        >
          <el-input
            v-model="ruleForm.paramName"
            maxlength="50"
            show-word-limit
            placeholder="请输入协议参数名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="考试类型" prop="categoryId" style="width: 250px">
          <el-select 
            v-model="ruleForm.categoryId" 
            placeholder="请选择考试类型" 
            style="width: 100%">
            <el-option
              v-for="item in examTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="班型名称（不填则采用课程名称）"
          prop="className"
          style="width: 250px"
        >
          <el-input
            v-model="ruleForm.className"
            maxlength="50"
            show-word-limit
            placeholder="请输入班级名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程成本" prop="classCost" style="width: 250px">
          <el-input
            v-model="ruleForm.classCost"
            maxlength="50"
            show-word-limit
            placeholder="请输入课程成本"
          ></el-input>
        </el-form-item>
        <el-form-item label="预支付培训费（小写）">
          <el-input v-model="ruleForm.advancePriceSmall" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="补交培训费原价（小写）">
          <el-input v-model="ruleForm.backPriceSmall" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="补交培训费优惠价（小写）">
          <el-input v-model="ruleForm.backDiscountSmall" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="线上课时费">
          <el-input v-model="ruleForm.hourPrice" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="学习要求（500字以内）">
          <el-input 
            v-model="ruleForm.studyNeeds" 
            maxlength="500" 
            placeholder="请输入值" 
            type="textarea" 
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="自定义02">
          <el-input v-model="ruleForm.remark2" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="自定义04">
          <el-input v-model="ruleForm.remark4" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="自定义06">
          <el-input v-model="ruleForm.remark6" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
      </div>
      <div class="rigth">
        <el-form-item label="协议模板" prop="templateType" style="width: 250px">
          <el-select v-model="ruleForm.templateType" placeholder="请选择协议模板" style="width: 100%">
            <el-option
              v-for="item in tempTypeList"
              :key="item.id"
              :label="item.protocolName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试名称" prop="examName" style="width: 250px">
          <el-input
            v-model="ruleForm.examName"
            maxlength="50"
            show-word-limit
            placeholder="请输入考试名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="协议类别" prop="protocolType" style="width: 250px">
          <el-select v-model="ruleForm.protocolType" placeholder="请选择协议类别" style="width: 100%">
            <el-option
              v-for="item in protocolTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付费模式" prop="payType" style="width: 250px">
          <el-select v-model="ruleForm.payType" placeholder="请选择付费模式" style="width: 100%">
            <el-option
              v-for="item in payTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预支付培训费（大写）">
          <el-input v-model="ruleForm.advancePriceBig" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="补交培训费原价（大写）">
          <el-input v-model="ruleForm.backPriceBig" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="补交培训费优惠价（大写）">
          <el-input v-model="ruleForm.backDiscountBig" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="每日课单价金额">
          <el-input v-model="ruleForm.unitPrice" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="自定义01">
          <el-input v-model="ruleForm.remark1" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="自定义03">
          <el-input v-model="ruleForm.remark3" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="自定义05">
          <el-input v-model="ruleForm.remark5" maxlength="50" placeholder="请输入值" show-word-limit></el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDefine">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {editParamView, addEditParam} from '@/api/learnCenter.js'
export default {
  data() {
    const checkClassCost = (rule, value, callback) => {
      if (!/^\d+(?=\.{0,1}\d+$|$)/.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      ruleForm: {
        paramName: "",
        categoryId: "",
        examName: "",
        className: "",
        classCost: "",
        templateType: "",
        protocolType: "",
        payType: "",
        paramId: "",
        operName: localStorage.getItem("name"),
        advancePriceSmall: '',
        advancePriceBig: '',
        backPriceSmall: '',
        backPriceBig: '',
        backDiscountSmall: '',
        backDiscountBig: '',
        hourPrice: '',
        unitPrice: '',
        studyNeeds: '',
        remark1: '',
        remark2: '',
        remark3: '',
        remark4: '',
        remark5: '',
        remark6: ''
      },
      rules: {
        paramName: [{ required: true, message: "必填", trigger: "blur" }],
        categoryId: [{ required: true, message: "必填", trigger: "change" }],
        className: [{ required: true, message: "必填", trigger: "blur" }],
        classCost: [{ required: true, message: "必填", validator: checkClassCost, trigger: "blur" }],
        templateType: [{ required: true, message: "必填", trigger: "change" }],
        examName: [{ required: true, message: "必填", trigger: "blur" }],
        protocolType: [{ required: true, message: "必填", trigger: "change" }],
        payType: [{ required: true, message: "必填", trigger: "change" }],
      },

      examTypeList: [],
      tempTypeList: [],
      payTypeList: [
        {id: 1, name: '全款'},
        {id: 2, name: '预收'}
      ],
      protocolTypeList: [
        {id: 1, name: '笔试'},
        {id: 2, name: '面试'}
      ]
    };
  },

  created() {
    eventBus.$on("examTypeListBus", (val) => {
      this.examTypeList = val;
    });
    eventBus.$on("tempTypeList", (val) => {
      this.tempTypeList = val;
    });
  },

  methods: {
    openDialog(id) {
      if(id) {
        this.ruleForm.paramId = id
        editParamView(id).then(res => {
          Object.assign(this.ruleForm, res.data)
          this.ruleForm.examName = res.data.examnName
        })
      }
      this.dialogVisible = true;
    },

    close() {
      this.ruleForm = {
        paramName: "",
        categoryId: "",
        examName: "",
        className: "",
        classCost: "",
        templateType: "",
        protocolType: "",
        payType: "",
        paramId: "",
        operName: localStorage.getItem("name"),
        advancePriceSmall: '',
        advancePriceBig: '',
        backPriceSmall: '',
        backPriceBig: '',
        backDiscountSmall: '',
        backDiscountBig: '',
        hourPrice: '',
        unitPrice: '',
        studyNeeds: '',
        remark1: '',
        remark2: '',
        remark3: '',
        remark4: '',
        remark5: '',
        remark6: ''
      },
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },

    handleDefine() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            await addEditParam(this.ruleForm)
            this.dialogVisible = false
            this.$emit('refresh')
            this.$message.success('操作成功')
          } catch (err) {
            this.$message.error('操作失败')
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-form {
  height: 450px;
  overflow-y: scroll;
  display: flex;
  justify-content: space-around;
}
</style>