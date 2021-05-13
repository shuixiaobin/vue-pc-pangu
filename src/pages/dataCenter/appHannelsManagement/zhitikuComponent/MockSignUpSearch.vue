<template>
  <div>
    <RSelect
      :options="provinceSchool"
      @input="handleProvinceSchoolIdChange"
      v-model="form.provinceSchoolId"
      placeholder="省级分校"
      type="省级分校"
    />
    <RSelect
      :options="citySchool"
      @input="handleCitySchoolIdChange"
      v-model="form.citySchoolId"
      placeholder="地市分校"
      type="地市分校"
    />
    <RSelect
      :options="studyCentre"
      @input="handlesStudyCentreIdChange"
      v-model="form.studyCentreId"
      placeholder="学习中心"
      type="学习中心"
    />
    <RSelect
      :options="promoterUserList"
      v-model="form.promoterInfoId"
      placeholder="推广员"
      type="推广员"
    />
    <el-select size="small" inline v-model="form.categoryId" @change="handleCategoryChange" placeholder="请选择考试类型">
      <el-option v-for="item in catgories" :label="item.name" :value="item.id" :key="item.id"></el-option>
    </el-select>
    <el-select size="small" inline v-model="form.subjectId" placeholder="请选择科目">
      <el-option v-for="item in subjects" :label="item.name" :value="item.id" :key="item.id"></el-option>
    </el-select>
    <el-input size="small" style="width: 200px;" v-model="form.mockName" placeholder="模考名称"></el-input>
    <el-button size="small" type="primary" @click="search">搜索</el-button>
    <el-button size="small" @click="reset">重置</el-button>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getDepartmentList, getPromoterUserList, getTypeSubjectTree } from '@/api/dataCenter.js'
import RSelect from './RSelect'
import Util from '@/common/util'
function initform () {
  return {
    provinceSchoolId: null,
    citySchoolId: null,
    studyCentreId: null,
    promoterInfoId: null,
    categoryId: null,
    subjectId: null,
    mockName: ''
  }
}
export default {
  data () {
    return {
      provinceSchool: [],
      citySchool: [],
      studyCentre: [],
      promoterUserList: [],
      catgories: [],
      subjects: [],
      form: initform(),
    }
  },
  created () {
    this.getDepartmentList()
    getTypeSubjectTree().then(res => {
      this.catgories = res.data
    })
  },
  methods: {
    handleCategoryChange () {
      const id = this.form.categoryId
      const d = this.catgories.find(item => item.id === id)
      this.form.subjectId = null
      if (d) {
        this.subjects = d.children
      }
    },
    handleProvinceSchoolIdChange () {
      this.form.citySchoolId = null
      this.citySchool = []
      this.handleCitySchoolIdChange()
    },
    handleCitySchoolIdChange () {
      this.form.studyCentreId = null
      this.studyCentre = []
      this.handlesStudyCentreIdChange()
      this.getDepartmentList()
    },
    handlesStudyCentreIdChange () {
      this.promoterUserList = []
      this.form.promoterInfoIdList = []
      this.getPromoterUserList()
    },
    getPromoterUserList () {
      const { provinceSchoolId, citySchoolId, studyCentreId } = this.form
      if (provinceSchoolId === null) return
      getPromoterUserList({ provinceSchoolId, citySchoolId, studyCentreId }).then(res => {
        this.promoterUserList = res.data.map(item => ({label: item.promoterName, value: item.id}))
      })
    },
    getDepartmentList () {
      const { provinceSchoolId, citySchoolId } = this.form
      getDepartmentList({ parentId: citySchoolId || provinceSchoolId || undefined }).then(res => {
        const data = res.data.map(item => ({label: item.name, value: item.id}))
        if (provinceSchoolId === null)
          this.provinceSchool = data
        else if (citySchoolId === null)
          this.citySchool = data
        else
          this.studyCentre = data
      })
    },
    search () {
      const { provinceSchoolId, citySchoolId, studyCentreId, promoterInfoId, date, mockName, subjectId, categoryId} = this.form
      const searchData = {
        provinceSchoolId,
        citySchoolId,
        studyCentreId,
        promoterInfoIdList: promoterInfoId ? [promoterInfoId] : [],
        mockName,
        subjectId,
        categoryId,
      }
      if (date && date.length === 2) {
        searchData.startTime = Util.formatTime2(date[0])
        searchData.endTime = Util.formatTime2(date[1])
      }

      this.$emit('search', Object.freeze(searchData))
    },
    reset () {
      this.form = initform()
      this.handleProvinceSchoolIdChange()
      this.search()
    },
  },
  components: {
    RSelect,
  },
}
</script>

<style scoped>

</style>
