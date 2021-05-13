<template>
  <el-dialog
    title="新增合作方"
    :visible="true"
    :close-on-click-modal="false"
    width="60%"
    @close="offDialog"
  >

    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
      :disabled="disabledFlag"
    >
      <el-form-item
        label="合作方名称"
        prop="name"
      >
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="订单编号头部"
        prop="orderNum"
      >
        <el-input v-model="ruleForm.orderNum"></el-input>
      </el-form-item>
      <el-form-item
        label="是否记录业绩员"
        prop="isRecord"
      >
        <el-select
          v-model="ruleForm.isRecord"
          placeholder="请选择"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in recordData"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          maxlength="300"
          :autosize="{minRows: 6 }"
          :placeholder="placeholderStr"
          v-model="ruleForm.desc"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import { addPartner, lookPartner } from '@/api/thirdParty'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      userName: {
        type: String,
        default: ''
      },
      partnerId: {
        type: String,
        default: null
      },
      lookConfig: {
        type: Boolean,
        default: false
      }
    },
    data() {
      var validateOrderNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('订单编号头部不能为空'))
        }
        if (value.length > 6 || !/^[A-Z]+$/.test(value)) {
          return callback(new Error('只能填写大写英文字母，最多6个字符'))
        }
        callback()
      }
      return {
        placeholderStr:'备注最多300字',
        disabledFlag: false,
        recordData: [
          { label: '是', value: 0 },
          { label: '否', value: 1 }
        ],
        ruleForm: {
          name: '',
          orderNum: '',
          isRecord: '',
          desc: ''
        },
        rules: {
          name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
          orderNum: [{ required: true, validator: validateOrderNum, trigger: 'blur' }],
          isRecord: [{ required: true, message: '请选择是否记录业绩员', trigger: 'change' }]
        }
      }
    },
    watch: {
      disabledFlag(val) {
        if (val) {
          this.placeholderStr = ''
        }
      }
    },
    async mounted() {
      if (this.lookConfig) {
        this.lookPartnerFn()
      }
    },
    methods: {
      async lookPartnerFn() {
        this.disabledFlag = true
        const res = await lookPartner({ id: this.partnerId }).catch(err => {
          this.$message.error(err.message)
        })
        this.ruleForm.name = res.data.parnter_name
        this.ruleForm.orderNum = res.data.order_number
        this.ruleForm.isRecord = res.data.record
        this.ruleForm.desc = res.data.remark
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$confirm('保存后不能再修改了，确认保存吗？', '提示', {
              cancelButtonText: '再检查一下',
              confirmButtonText: '保存'
            })
              .then(_ => {
                addPartner({
                  parnterName: this.ruleForm.name, //合作方名称
                  orderNum: this.ruleForm.orderNum, //订单编号
                  record: this.ruleForm.isRecord, //业绩
                  creater: this.userName, //添加人(蓝色后台用户名)
                  remark: this.ruleForm.desc //备注
                })
                  .then(res => {
                    if (res.code < 0) {
                      this.$Toast(res.msg)
                      return
                    }
                    this.$message.success('添加成功')
                    this.$emit('updateFn')
                  })
                  .catch(err => {
                    this.$message.error(err.message)
                  })
              })
              .catch(_ => {
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      offDialog() {
        this.$emit('update:dialogVisible', false)
        if (this.lookConfig) {
          this.$emit('update:lookConfig', false)
        }
      }
    }
  }
</script>
<style lang='less' scoped>
</style>