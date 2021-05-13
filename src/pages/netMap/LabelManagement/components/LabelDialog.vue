<template>
  <div class="label-dialog">
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      :show-close="false"
      width="30%"
    >
      <el-form
        size="small"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="ruleForm"
      >
        <el-form-item
          label="标签名称"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            maxlength="15"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="考试类型"
          prop="category"
        >
          <el-select
            style="width:100%"
            v-model="ruleForm.category"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in categoryData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="标签备注"
          prop="desc"
        >
          <el-input
            style="height:100px"
            type="textarea"
            resize="none"
            :maxlength="100"
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align:right;margin-bottom:0">
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { getCategory, setLabel } from '@/api/netMap'
  import { mapState } from 'vuex'
  export default {
    props: {
      title: {
        type: String,
        default: '新增标签',
      },
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      labelDetail: {
        type: Object,
        default: () => ({}),
      },
    },

    data() {
      return {
        categoryData: [],
        ruleForm: {
          name: this.labelDetail.name,
          category: [],
          desc: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入标签名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          ],
          category: [{ type: 'array', required: true, message: '请至少选择一个考试类型', trigger: 'change' }],
        },
      }
    },

    watch: {
      labelDetail(val) {
        this.ruleForm.name = val.name
        this.ruleForm.desc = val.remarks
        this.ruleForm.category = val.exam_type ? val.exam_type.split('/') : []
      },
    },

    computed: {
      ...mapState(['username']),
    },

    mounted() {
      this.getCategory()
    },

    methods: {
      async getCategory() {
        const { data } = await getCategory()
        this.categoryData = data
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.setLabel()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async setLabel() {
        try {
          const data = await setLabel({
            exam_type: this.ruleForm.category.join('/'),
            name: this.ruleForm.name,
            parentId: this.labelDetail.parent_id,
            remarks: this.ruleForm.desc,
            tagId: this.labelDetail.id,
            userName: this.username,
          })
          if (data.code === 10000) {
            this.$message.success('操作成功!')
            this.$emit('update')
          } else {
            this.$message.error(data.msg)
          }
        } catch (err) {
          console.log(err)
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.$emit('update:dialogVisible', false)
      },
    },
  }
</script>
<style lang="less">
  .label-dialog {
    .el-textarea__inner {
      height: 100px;
    }
  }
</style>