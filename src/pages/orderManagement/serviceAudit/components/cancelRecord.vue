<template>
  <el-dialog
    title="撤销申请"
    :visible.sync="isShowCancelRecord"
    :close-on-click-modal="false"
    width="40%"
    @close="isShowCancelRecord = false"
  >
    <el-form
      :model="form"
      label-width="100px"
      label-position="right"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="订单编号：">
        HTKC_Oi_2020312310301230104301030
      </el-form-item>
      <el-form-item label="课程标题：">
        【常识判断】团史快板口诀歌
      </el-form-item>
      <el-form-item
        label="操作类型："
        prop="region"
      >
        <el-select
          v-model="form.region"
          placeholder="请选择"
        >
          <el-option
            label="区域一"
            value="shanghai"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="备注："
        prop="desc"
      >
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="form.desc"
          resize="none"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="isShowCancelRecord = false"
      >取 消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="submitForm('ruleForm')"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        isShowCancelRecord: false,
        form: {},
        rules: {
          region: [
            { required: true, message: '请选择操作类型', trigger: 'change' }
          ],
          desc: [{ required: true, message: '请填写备注', trigger: 'blur' }]
        }
      }
    },
    methods: {
      open() {
        this.isShowCancelRecord = true
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>