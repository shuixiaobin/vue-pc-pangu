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
      v-model="form.promoterInfoIdList"
      placeholder="推广员"
      type="推广员"
      multiple
    />
    <el-date-picker
      size="small"
      v-model="form.date"
      type="datetimerange"
      range-separator="-"
      start-placeholder="起始时间"
      end-placeholder="截止时间">
    </el-date-picker>
    <el-button size="small" type="primary" @click="search">查询</el-button>
    <el-button size="small" @click="reset">重置</el-button>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getDepartmentList, getPromoterUserList } from '@/api/dataCenter.js'
import RSelect from './RSelect'
import Util from '@/common/util'
function initform () {
  return {
    provinceSchoolId: null,
    citySchoolId: null,
    studyCentreId: null,
    promoterInfoIdList: [],
    date: null,
  }
}
export default {
  data () {
    return {
      provinceSchool: [],
      citySchool: [],
      studyCentre: [],
      promoterUserList: [],
      form: initform(),
    }
  },
  created () {
    this.getDepartmentList()
    this.getPromoterUserList()
  },
  methods: {
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
      const { provinceSchoolId, citySchoolId, studyCentreId, promoterInfoIdList, date} = this.form
      const searchData = {
        provinceSchoolId,
        citySchoolId,
        studyCentreId,
        promoterInfoIdList
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
