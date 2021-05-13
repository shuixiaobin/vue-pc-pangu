<template>
  <div>
    <div class="container-title">
      <h2>{{isLook?'查看':teacherId?'修改':'新增'}}</h2>
    </div>
    <div class="container-Box minHeight">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        size="small"
        class="demo-ruleForm"
        :disabled="isLook?true:false"
      >
        <el-form-item
          label="手机号"
          prop="phone"
        >
          <el-input
            v-model.number="ruleForm.phone"
            placeholder="请输入该助教在盘古中心的注册手机号"
            style="width:300px;"
            clearable
            :disabled="teacherId?true:false"
            @blur="handleBlur"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            style="width:300px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input
            v-model="ruleForm.username"
            style="width:300px;"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="微信"
          prop="wechat"
        >
          <el-input
            v-model="ruleForm.wechat"
            style="width:300px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="教师类型"
          prop="teacherType"
        >
          <el-select
            v-model="ruleForm.teacherType"
            placeholder="请选择"
          >
            <el-option
              :label="item.name"
              :value="item.value"
              v-for="(item,index) in teacherTypeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="专兼职"
          prop="isPartTime"
        >
          <el-radio-group v-model="ruleForm.isPartTime">
            <el-radio :label="0">专职</el-radio>
            <el-radio :label="1">兼职</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="教师级别"
          prop="teacherLevel"
          v-if="ruleForm.teacherType==1"
        >
          <el-select
            v-model="ruleForm.teacherLevel"
            placeholder="请选择"
          >
            <el-option
              :label="item.name"
              :value="item.value"
              v-for="(item,index) in teacherLevelOptions"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="组别"
          required
          v-if="ruleForm.teacherType==1"
        >
          <selectGroup
            :rules="rules"
            :items="ruleForm.teacherGroup"
            :index="null"
          />
        </el-form-item>
        <template v-if="ruleForm.teacherType==1">
          <el-form-item
            v-for='(item,index) in ruleForm.teacherSubjects'
            :label="'讲授科目'+(index+1)"
            :key="index"
            required
          >
            <selectGroup
              :rules="rules"
              :items="item"
              :index="index"
            />
            <i
              class="el-icon-minus"
              v-if="ruleForm.teacherSubjects.length>1"
              @click="delTeacherSubject(index)"
            ></i>
            <i
              class="el-icon-plus"
              v-if="index==ruleForm.teacherSubjects.length-1"
              @click="addTeacherSubject"
            ></i>
          </el-form-item>
        </template>
        <el-form-item v-if="!isLook">
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >{{teacherId?'修改':'添加'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import selectGroup from "./components/selectGroup";
import Util from "@/common/util";
import {
  getAccountInfo,
  checkAssistantPhone,
  getAssistantTeacherType,
  getTeacherLevel,
  addAssistantTeacher,
  getAssistantTeacherInfo
} from "@/api/teacher";
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (!Util.FORM.isLegalTel(value)) {
            callback(new Error("请输入正确的手机号"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      isLook: this.$route.query.isLook,
      teacherId: this.$route.query.teacherId,
      teacherTypeList: [],
      teacherLevelOptions: [],
      ruleForm: {
        username: null,
        name: "",
        phone: "",
        wechat: "",
        teacherType: "",
        isPartTime: 0,
        teacherLevel: "",
        teacherGroup: {
          examType: "",
          subjectId: ""
        },
        teacherSubjects: [
          { examType: "", subjectId: "", teacherCourseLevel: 0 }
        ]
      },
      rules: {
        name: [{ required: true, message: "请输入老师姓名", trigger: "blur" }],
        phone: [
          {
            required: true,
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        teacherType: [
          { required: true, message: "请选择教师类型", trigger: "change" }
        ],
        examType: [
          { required: true, message: "请选择考试类型", trigger: "change" }
        ],
        subjectId: [
          { required: true, message: "请选择科目", trigger: "change" }
        ]
      }
    };
  },
  components: {
    selectGroup
  },
  mounted() {
    this.getAssistantTeacherType();
    this.getTeacherLevel();
    if (this.teacherId) {
      this.getTeacherInfo();
    }
  },
  methods: {
    async handleBlur(e) {
      if (this.ruleForm.phone) {
        //if (this.teacherId && this.ruleForm.phone === e.target.value) return;
        try {
          const pkRes = await checkAssistantPhone({
            phone: this.ruleForm.phone
          });
          if (pkRes.code == 10000) {
            if (pkRes.data.exists) {
              this.$message.warning(
                "该手机号已绑定盘古中心助教账号，请核实手机号填写无误或联系管理员！"
              );
            } else {
              const pgRes = await getAccountInfo({
                phone: this.ruleForm.phone
              });
              if (pgRes.code == 10000) {
                this.ruleForm.username = pgRes.data.UserName;
                this.ruleForm.name = pgRes.data.UserReName;
              } else {
                this.$message.warning(pgRes.msg);
                this.ruleForm.username = null;
                this.ruleForm.name = "";
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    async getAssistantTeacherType() {
      try {
        const res = await getAssistantTeacherType();
        this.teacherTypeList = res.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getTeacherLevel() {
      try {
        const res = await getTeacherLevel();
        this.teacherLevelOptions = Object.freeze(res.data);
      } catch (err) {
        console.log(err);
      }
    },
    delTeacherSubject(index) {
      this.ruleForm.teacherSubjects.splice(index, 1);
    },
    addTeacherSubject() {
      let obj = { examType: "", subjectId: "", teacherCourseLevel: 0 };
      this.ruleForm.teacherSubjects.push(obj);
    },
    async getTeacherInfo() {
      try {
        const res = await getAssistantTeacherInfo({ id: this.teacherId });
        if (res.code == 10000) {
          this.ruleForm.name = res.data.name;
          this.ruleForm.phone = Number(res.data.phone);
          this.ruleForm.wechat = res.data.wechat;
          this.ruleForm.teacherType = res.data.teacherTypeValue;
          this.ruleForm.isPartTime = res.data.isPartTime ? 1 : 0;
          this.ruleForm.teacherLevel = res.data.teacherLevelValue;
          this.ruleForm.teacherGroup.examType = res.data.examTypeValue;
          this.ruleForm.teacherGroup.subjectId = res.data.subjectId;
          if (res.data.teacherSubjects) {
            this.ruleForm.teacherSubjects = res.data.teacherSubjects.map(
              item => {
                return {
                  examType: item.examTypeValue,
                  subjectId: item.subjectId,
                  teacherCourseLevel: 0
                };
              }
            );
          } else {
            this.ruleForm.teacherSubjects = this.ruleForm.teacherSubjects;
          }
          if (this.ruleForm.username!=null) {
            this.ruleForm.username = res.data.username;
          } else {
            const pgRes = await getAccountInfo({
              phone: this.ruleForm.phone
            });
            if (pgRes.code == 10000) {
              this.ruleForm.username = pgRes.data.UserName;
            }else{
              this.ruleForm.username = null;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let {
            teacherGroup,
            teacherSubjects,
            ...newSubmitFormData
          } = this.ruleForm;
          let params = {};
          if (this.ruleForm.teacherType == 1) {
            params = {
              ...newSubmitFormData,
              ...this.ruleForm.teacherGroup,
              teacherSubjects: JSON.stringify(this.ruleForm.teacherSubjects),
              id: this.teacherId && this.teacherId
            };
          } else {
            params = {
              ...newSubmitFormData,
              id: this.teacherId && this.teacherId
            };
          }
          addAssistantTeacher(params)
            .then(res => {
              if (res.code == 10000) {
                if (res.data.res) {
                  this.$message.success(
                    this.teacherId ? "修改成功" : "添加成功"
                  );
                  this.$router.push({ path: "./assistantInfo" });
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: "./assistantInfo" });
    }
  }
};
</script>
