<template>
  <el-dialog
    title="提示"
    :visible="true"
    width="50%"
    :show-close="false"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="活动时间"
        required
      >
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="ruleForm.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col
          class="line"
          :span="2"
        >-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-date-picker
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="ruleForm.date2"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item prop="examType" label="考试类型" required>
        <el-select v-model="ruleForm.examType">
          <el-option label="国考" :value="1"></el-option>
          <el-option label="省考" :value="2"></el-option>
        </el-select>
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
          date1: '',
          date2: '',
          examType: '',
        },
        rules: {
          date1: [{ required: true, message: '请选择日期', trigger: 'change' }],
          date2: [{ required: true, message: '请选择日期', trigger: 'change' }],
          examType: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
        }
      }
    },
    methods: {
      handleClick(flag) {
        if (!flag) {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              window.location.href =  `${ZWK_URL}/admin/user/export?dateBegin=${this.ruleForm.date1}&dateEnd=${this.ruleForm.date2}&examType=${this.ruleForm.examType}`
              this.$emit('update:dialogVisible', false)
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          this.$emit('update:dialogVisible', false)
        }
      }
    }
  }
</script>
<style lang='less' scoped>
  .line {
    text-align: center;
  }
</style>
