<template>
  <el-dialog
    title="编辑职位"
    :visible="true"
    width="50%"
    :show-close="false"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="mini"
      ref="ruleForm"
      label-width="140px"
      class="ruleForm"
    >
      <el-form-item
        label="职位名称"
        prop="jobName"
      >
        <el-input v-model="ruleForm.jobName"></el-input>
      </el-form-item>
      <el-form-item
        label="部门名称"
        prop="departmentName"
      >
        <el-input v-model="ruleForm.departmentName"></el-input>
      </el-form-item>
      <el-form-item
        label="招生人数"
        prop="peopleNum"
      >
        <el-input v-model="ruleForm.peopleNum"></el-input>
      </el-form-item>
      <h6 class="infoTitle">考试信息：</h6>
      <el-form-item
        label="年份"
        prop="year"
        required
      >
        <el-input
          disabled
          v-model="ruleForm.year"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="省份"
        prop="province"
        required
      >
        <el-input
          disabled
          v-model="ruleForm.province"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="地市"
        prop="city"
      >
        <el-input v-model="ruleForm.city"></el-input>
      </el-form-item>
      <el-form-item
        label="考试分类"
        prop="examSort"
        required
      >
        <el-input
          disabled
          v-model="ruleForm.examSort"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="考试类型"
        prop="examType"
        required
      >
        <el-input
          disabled
          v-model="ruleForm.examType1"
        ></el-input>
      </el-form-item>
      <h6 class="infoTitle">职位信息：</h6>
      <el-form-item
        label="部门代码"
        prop="departmentCode"
      >
        <el-input v-model="ruleForm.departmentCode"></el-input>
      </el-form-item>
      <el-form-item
        label="用人单位"
        prop="employer"
      >
        <el-input v-model="ruleForm.employer"></el-input>
      </el-form-item>
      <el-form-item
        label="职位代码"
        prop="jobCode"
      >
        <el-input v-model="ruleForm.jobCode"></el-input>
      </el-form-item>
      <el-form-item
        label="职位简介"
        prop="desc"
      >
        <el-input
          type="textarea"
          v-model="ruleForm.desc"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="机构层级"
        prop="level"
      >
        <el-input v-model="ruleForm.level"></el-input>
      </el-form-item>
      <el-form-item
        label="系统分布"
        prop="xtfb"
      >
        <el-input v-model="ruleForm.xtfb"></el-input>
      </el-form-item>
      <el-form-item
        label="职位类型"
        prop="jobType"
      >
        <el-input v-model="ruleForm.jobType"></el-input>
      </el-form-item>
      <h6 class="infoTitle">报考信息：</h6>
      <el-form-item
        label="考试类别"
        prop="category"
      >
        <el-input v-model="ruleForm.category"></el-input>
      </el-form-item>
      <el-form-item
        label="是否为公安机关人民警察职位"
        prop="isPoliceJob"
      >
        <el-input v-model="ruleForm.isPoliceJob"></el-input>
      </el-form-item>
      <el-form-item
        label="是否组织专业考试"
        prop="isProfessionalExam"
      >
        <el-input v-model="ruleForm.isProfessionalExam"></el-input>
      </el-form-item>
      <el-form-item
        label="开考比例"
        prop="scale"
      >
        <el-input v-model="ruleForm.scale"></el-input>
      </el-form-item>
      <el-form-item
        label="招考对象"
        prop="enrollmentTarget"
      >
        <el-input v-model="ruleForm.enrollmentTarget"></el-input>
      </el-form-item>
      <el-form-item
        label="学历"
        prop="education"
      >
        <el-input v-model="ruleForm.education"></el-input>
      </el-form-item>
      <el-form-item
        label="是否全日制"
        prop="isFullTime"
      >
        <el-input v-model="ruleForm.isFullTime"></el-input>
      </el-form-item>
      <el-form-item
        label="学位"
        prop="degree"
      >
        <el-input v-model="ruleForm.degree"></el-input>
      </el-form-item>
      <el-form-item
        label="专业"
        prop="subject"
      >
        <el-input v-model="ruleForm.subject"></el-input>
      </el-form-item>
      <el-form-item
        label="政治面貌"
        prop="politicalStatus"
      >
        <el-input v-model="ruleForm.politicalStatus"></el-input>
      </el-form-item>
      <el-form-item
        label="性别要求"
        prop="gender"
      >
        <el-input v-model="ruleForm.gender"></el-input>
      </el-form-item>
      <el-form-item
        label="年龄要求"
        prop="age"
      >
        <el-input v-model="ruleForm.age"></el-input>
      </el-form-item>
      <el-form-item
        label="户籍/生源要求"
        prop="hjyq"
      >
        <el-input v-model="ruleForm.hjyq"></el-input>
      </el-form-item>
      <el-form-item
        label="基层工作最低年限"
        prop="workingYears"
      >
        <el-input v-model="ruleForm.workingYears"></el-input>
      </el-form-item>
      <el-form-item
        label="基层服务经历"
        prop="jcfwjl"
      >
        <el-input v-model="ruleForm.jcfwjl"></el-input>
      </el-form-item>
      <el-form-item
        label="最低服务年限"
        prop="serviceYears"
      >
        <el-input v-model="ruleForm.serviceYears"></el-input>
      </el-form-item>
      <el-form-item
        label="入面分数线"
        prop="rmfsx"
      >
        <el-input v-model="ruleForm.rmfsx"></el-input>
      </el-form-item>
      <el-form-item
        label="咨询电话"
        prop="phoneNum"
      >
        <el-input v-model="ruleForm.phoneNum"></el-input>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="other"
      >
        <el-input
          type="textare"
          v-model="ruleForm.other"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="其他条件"
        prop="other"
      >
        <el-input
          type="textarea"
          v-model="ruleForm.other"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="工作地点"
        prop="workPlace"
      >
        <el-input v-model="ruleForm.workPlace"></el-input>
      </el-form-item>
      <el-form-item
        label="落户地区"
        prop="settlementPlace"
      >
        <el-input v-model="ruleForm.settlementPlace"></el-input>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClick(true)">取 消</el-button>
      <el-button
        type="primary"
        @click="handleClick(false)"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: ['dialogVisible'],
    data() {
      return {
        ruleForm: {
          jobName: '', //职位名称
          departmentName: '', //部门名称
          peopleNum: '', //招生人数
          year: '', //年份
          province: '', //省份
          city: '', //地市
          examSort: '', //考试分类
          departmentCode: '', //部门代码
          employer: '', //用人单位
          jobCode: '', //职位代码
          examType: '', //考试类型
          examArea: '', //报考地区
          desc: '', //职位简介
          level: '', //机构层级
          xtfb: '', //系统分布
          jobType: '', //职位类型
          category: '', //考试类别
          isPoliceJob: '', //是否为公安机关人民警察职位
          isProfessionalExam: '', //是否组织专业考试
          scale: '', //开考比例
          enrollmentTarget: '', //招考对象
          education: '', //学历
          isFullTime: '', //是否全日制
          degree: '', //学位
          subject: '', //专业
          politicalStatus: '', //政治面貌
          gender: '', //性别要求
          age: '', //年龄要求
          hjyq: '', //户籍/生源要求
          workingYears: '', //基层工作最低年限
          jcfwjl: '', //基层服务经历
          serviceYears: '', //最低服务年限
          rmfsx: '', //入面分数线
          phoneNum: '', //咨询电话
          workPlace: '', //工作地点
          settlementPlace: '' //落户地区
        },
        rules: {
          employer: [{ required: true, message: '请输入用人单位', trigger: 'blur' }],
          education: [{ required: true, message: '请输入学历', trigger: 'blur' }],
          subject: [{ required: true, message: '请输入专业', trigger: 'blur' }]
        }
      }
    },

    components: {},

    computed: {},

    methods: {
      handleClose() {},
      handleClick(flag) {
        if (!flag) {
          // 请求接口
        }
        this.$emit('update:dialogVisible', false)
      }
    }
  }
</script>
<style lang='less' scoped>
  .ml20 {
    margin-left: 20px;
  }
  .ruleForm {
    .header {
      .labelName {
        margin-bottom: 5px;
        &::before {
          content: '*';
          color: #f56c6c;
          margin-right: 4px;
        }
      }
    }
    .infoTitle {
      color: #999;
      line-height: 3;
    }
  }
</style>