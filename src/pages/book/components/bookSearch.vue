<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="ruleForm"
    >
      <el-form-item
        label="适用考试类型："
        prop="examCategory"
      >
        <el-select
          v-model="ruleForm.examCategory"
          placeholder="请选择"
          clearable
        >
          <el-option
            :label="item.CategoryName"
            :value="item.CategoryId"
            v-for="(item,index) in categoryData"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="适用考试科目："
        prop="writtenOrInterview"
      >
        <el-select
          v-model="ruleForm.writtenOrInterview"
          placeholder="请选择"
          clearable
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in subjectData"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="状态："
        v-if="isShowHighlevel"
        prop="status"
      >
        <el-select
          v-model="ruleForm.status"
          placeholder="请选择"
          clearable
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in statusData"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="创建日期范围："
        v-if="isShowHighlevel"
      >
        <el-col :span="4">
          <el-form-item prop="startDate">
            <el-date-picker
              v-model="ruleForm.startDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%"
              type="datetime"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col
          class="line"
          :span="1"
        >-</el-col>
        <el-col :span="4">
          <el-form-item prop="endDate">
            <el-date-picker
              v-model="ruleForm.endDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%"
              type="datetime"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item v-if="isShowHighlevel">
        <el-col :span="4">
          <el-form-item prop="minPrice">
            <el-input
              v-model.number="ruleForm.minPrice"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          class="line"
          :span="2"
        >≤ 原价 ≤</el-col>
        <el-col :span="4">
          <el-form-item prop="maxPrice">
            <el-input
              v-model.number="ruleForm.maxPrice"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item v-if="isShowHighlevel">
        <el-col :span="4">
          <el-form-item prop="minActualPrice">
            <el-input
              v-model.number="ruleForm.minActualPrice"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          class="line"
          :span="2"
        >≤ 售价 ≤</el-col>
        <el-col :span="4">
          <el-form-item prop="maxActualPrice">
            <el-input
              v-model.number="ruleForm.maxActualPrice"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item v-if="isShowHighlevel">
        <el-col :span="4">
          <el-form-item prop="minSingleCost">
            <el-input
              v-model.number="ruleForm.minSingleCost"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          class="line"
          :span="2"
        >≤ 单本书成本 ≤</el-col>
        <el-col :span="4">
          <el-form-item prop="maxSingleCost">
            <el-input
              v-model.number="ruleForm.maxSingleCost"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="输入关键字：">
        <el-col :span="3">
          <el-form-item prop="keyword">
            <el-select
              v-model="ruleForm.keyword"
              placeholder="请选择"
              clearable
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in keywordData"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="content">
            <el-input
              v-model="ruleForm.content"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm()"
        >查询结果</el-button>
        <el-button
          type="text"
          @click="highLevel"
        >{{isShowHighlevel?'隐藏高级选项搜索':'高级选项搜索'}}</el-button>
        <el-button
          type="text"
          @click="resetForm('ruleForm')"
        >重置搜索选项</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { getCategroy } from '@/api/bookApi'
  export default {
    data() {
      var checkPrice = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('价格不能为空'))
        }
        if (!Number.isInteger(value)) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          examCategory: null, //考试类型
          writtenOrInterview: null, //科目
          status: null, //状态
          startDate: null, //创建日期范围
          endDate: null, //创建日期范围
          minPrice: null, //最小原价
          maxPrice: null, //最大原价
          minActualPrice: null, //最小售价
          maxActualPrice: null, //最大售价
          minSingleCost: null, //最小单书成本
          maxSingleCost: null, //最大单书成本
          bookId: null, //图书id
          bookName: null, //图书名称
          bookNo: null, //书号或自编码
          creatorName: null, //创建人用户名
          keyword: null, //自定义
          content: null //自定义
        },
        isShowHighlevel: false,
        categoryData: [],
        subjectData: [
          {
            value: 1,
            label: '笔试'
          },
          {
            value: 2,
            label: '面试'
          },
          {
            value: 3,
            label: '纯图书'
          },
          {
            value: 4,
            label: '综合'
          }
        ],
        statusData: [
          {
            value: 20,
            label: '全部'
          },
          {
            value: 0,
            label: '未上线'
          },
          {
            value: 1,
            label: '已上线'
          },
          {
            value: 2,
            label: '已下线'
          }
        ],
        keywordData: [
          {
            value: 'bookName',
            label: '图书名称'
          },
          {
            value: 'bookId',
            label: '图书ID'
          },
          {
            value: 'bookNo',
            label: '书号（或自编号）'
          },
          {
            value: 'creatorName',
            label: '创建人'
          }
        ],
        rules: {
          minPrice: [{ validator: checkPrice, trigger: 'blur' }],
          maxPrice: [{ validator: checkPrice, trigger: 'blur' }],
          minActualPrice: [{ validator: checkPrice, trigger: 'blur' }],
          maxActualPrice: [{ validator: checkPrice, trigger: 'blur' }],
          minSingleCost: [{ validator: checkPrice, trigger: 'blur' }],
          maxSingleCost: [{ validator: checkPrice, trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getCategroy()
    },
    methods: {
      highLevel() {
        this.isShowHighlevel = !this.isShowHighlevel
      },
      getCategroy() {
        getCategroy()
          .then(res => {
            this.categoryData = res
          })
          .catch(err => {
            console.log(err)
          })
      },
      submitForm() {
        this.$emit('searchFn', this.ruleForm)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang='less' scoped>
  .ruleForm {
    text-align: left;
    margin: 20px 0;
    .line {
      text-align: center;
    }
  }
</style>