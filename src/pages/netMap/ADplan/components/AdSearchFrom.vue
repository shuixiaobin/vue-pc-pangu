<template>
  <el-form
    :inline="true"
    :model="formInline"
    size="mini"
    ref="formInline"
    class="form-inline"
  >
    <el-form-item
      label="广告账号"
      prop="promoteAccountId"
    >
      <el-select
        v-model="formInline.promoteAccountId"
        placeholder="请选择"
      >
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="item.accountAlias"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="广告计划"
      prop="name"
    >
      <el-input
        v-model="formInline.name"
        placeholder="请输入计划名称"
      ></el-input>
    </el-form-item>
    <el-form-item  style="margin-right:80px">
      <el-button
        type="primary"
        @click="onSubmit"
      >查询</el-button>
      <el-button @click="resetForm('formInline')">重置</el-button>
    </el-form-item>

    <el-form-item label="线索日期">
      <el-date-picker
        v-model="formInline.planDate"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
     <el-form-item>
      <el-button type="primary" @click="exportPlan">线索导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { mapState } from 'vuex'
  import { getUserList } from '@/api/netMap'
  export default {
    data() {
      return {
        userList: [],
        resetFlag: false,
        formInline: {
          promoteAccountId: '',
          name: '',
          planDate: ''
        },
      }
    },
    watch: {
      formInline: {
        deep: true,
        handler() {
          this.resetFlag = true
        },
      },
    },
    computed: {
      ...mapState(['starMapNum']),
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        try {
          const { data } = await getUserList({ operatorCode: this.starMapNum })
          this.userList = data
        } catch (e) {
          console.log(e)
        }
      },
      onSubmit() {
        this.$emit('handleSearch', { searchVal: this.formInline, resetFlag: this.resetFlag })
      },
      resetForm(formName) {
        this.$emit('handleReset')
        this.$refs[formName].resetFields()
      },
      exportPlan() {
        this.$emit('handleExport', this.formInline)
      }
    },
  }
</script>
<style lang='less' scoped>
  .form-inline {
    padding: 16px;
  }
</style>