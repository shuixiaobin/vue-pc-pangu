<template>
  <div>
    <el-form-item
      label="组别"
      prop="group"
    >
      <el-row :gutter="24">
        <el-col
          :span="7"
          style="padding-left:0"
        >
          <el-select
            style="width:100%"
            v-model="pkGroup.pkExamType"
            placeholder="请选择"
            @change="handleCategoryChange"
          >
            <el-option
              v-for="(item) in pkCategoryOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-select
            style="width:100%"
            v-model="pkGroup.pkSubjectType"
            placeholder="请选择"
          >
            <el-option
              v-for="(item) in subjectOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-select
            style="width:100%"
            v-model="pkGroup.pkGroupType"
            placeholder="请选择"
          >
            <el-option
              v-for="(item) in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
  import { getExamTypeOne, getExamTypeTwo } from '@/api/teacher'
  export default {
    props: {
      pkGroup: {
        type: Object,
        default: {
          pkExamType: '',
          pkSubjectType: '',
          pkGroupType: '',
        },
      },
      pkCategoryOptions: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        subjectOptions: [],
        groupOptions: [
          {
            label: '组长',
            value: 1,
          },
          {
            label: '组员',
            value: 2,
          },
        ],
        form: {},
      }
    },
    // watch: {
    //   'pkGroup.pkExamType'(val) {
    //     console.log(val)
    //     this.getExamTypeTwo(val)
    //   },
    // },
    mounted() {
      if(this.pkGroup.pkExamType) {
        this.getExamTypeTwo(this.pkGroup.pkExamType)
      }
    },
    methods: {
      handleCategoryChange(val) {
        this.pkGroup.pkSubjectType = ''
        this.getExamTypeTwo(this.pkGroup.pkExamType)
      },
      async getExamTypeOne() {
        try {
          const res = await getExamTypeOne()
          this.categoryOptions = res.data
        } catch (err) {
          console.log(err)
        }
      },
      async getExamTypeTwo(ExamType) {
        try {
          const res = await getExamTypeTwo({ ExamType })
          this.subjectOptions = res.data
        } catch (err) {
          console.log(err)
        }
      },
    },
  }
</script>