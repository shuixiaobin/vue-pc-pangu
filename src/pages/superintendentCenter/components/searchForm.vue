<template>
  <div class="search-form">
    <el-form :model="form" inline>
      <el-form-item :label="searchType === '0' ? '协议模板' : '协议参数'">
        <el-input
          v-model="form.name"
          :placeholder="
            searchType === '0' ? '请输入协议模板名称或编号' : '请输入协议参数名称或编号'"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否启用" v-if="searchType === '0'">
        <el-select v-model="form.status">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="协议模板" v-if="searchType === '1'">
        <el-select v-model="form.templateType" placeholder="请选择协议模板">
          <el-option
            v-for="item in tempTypeList"
            :key="item.id"
            :label="item.protocolName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试类型" v-if="searchType === '1'">
        <el-select v-model="form.categoryId" placeholder="请选择考试类型">
          <el-option
            v-for="item in examTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" v-auth="'TEMP_PARAM_SEARCH'">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getExamTypeDec} from '@/api/learnCenter.js'
export default {
  props: {
    searchType: {
      tyep: String,
      default() {
        return '0'
      }
    }
  },

  data() {
    return {
      form: {
        name: "",
        status: '',
        templateType: '',
        categoryId: ''
      },
      statusList: [
        { label: "全部", value: '' },
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      tempTypeList: [],
      examTypeList: []
    }
  },

  created() {
    eventBus.$on('tempTypeList', (val) => {
      this.tempTypeList = val
    })
    this.getExamTypeDec()
  },

  methods: {
    getExamTypeDec() {
      getExamTypeDec().then(res => {
        this.examTypeList = res.data
        eventBus.$emit('examTypeListBus', this.examTypeList)
      })
    },

    search() {
      this.$emit('search', this.form)
    },

    reset() {
      this.form = {
        name: '',
        status: '',
        templateType: '',
        categoryId: ''
      }
      this.$emit('search', this.form)
    }
  }
};
</script>

<style lang="less" scoped>
.el-form {
  display: inline;
}
</style>