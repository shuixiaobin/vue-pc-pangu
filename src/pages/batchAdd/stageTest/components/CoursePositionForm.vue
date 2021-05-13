<template>
  <el-form ref="form" v-if="type === 1" :show-message="false" :status-icon="true" :disabled="disabled" :model="form" label-width="160px">
    <el-form-item label="定位课件类型" prop="coursewareType">
      <el-radio-group v-model="form.coursewareType" @change="typeChange">
        <el-radio :label="1">直播</el-radio>
        <el-radio :label="2">录播</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="定位课件ID" required prop="coursewareId">
      <el-input @keyup.enter="queryCourseName" @change="queryCourseName" v-model="form.coursewareId"></el-input>
    </el-form-item>
    <el-form-item label="定位课件名称" required prop="coursewareName">
      <el-tooltip :disabled="!!form.coursewareName" class="item" effect="dark" content="请先填写课件ID" placement="top-start">
        <el-input disabled v-model="form.coursewareName"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="试卷所在课件位置" prop="beforeOrAfter">
      <el-radio-group v-model="form.beforeOrAfter">
        <el-radio :label="1">课件前</el-radio>
        <el-radio :label="2">课件后</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <el-form ref="form" v-else-if="type === 3" :disabled="disabled" :model="form" label-width="160px">
    <el-form-item label="定位课课程ID" required prop="positionClassId">
      <el-input @keyup.enter="queryCourseName" @change="queryCourseName" v-model="form.positionClassId"></el-input>
    </el-form-item>
    <el-form-item label="定位课程名称" required prop="positionClassName">
      <el-tooltip :disabled="!!form.positionClassName" class="item" effect="dark" content="请先填写课程ID" placement="top-start">
        <el-input disabled v-model="form.positionClassName"></el-input>
      </el-tooltip>
    </el-form-item>
  </el-form>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import batchOperation from '@/api/batchOperation'
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number
    },
    formData: {
      type: Object
    }
  },
  data () {
    return {
      form: {
        coursewareType: 1,
        beforeOrAfter: 1,
        coursewareName: '',
        positionClassName: ''
      },
      currentId: ''
    }
  },
  created () {
    // 有缓存数据
    if (this.formData) {
      this.form = { ...this.formData }
    } else {
      this.form.type = this.type
    }
    switch (this.form.type) {
      case 1:
        this.idKey = 'coursewareId'
        this.nameKey = 'coursewareName'
        break
      case 3:
        this.idKey = 'positionClassId'
        this.nameKey = 'positionClassName'
        break
    }
  },
  methods: {
    typeChange () {
      this.currentId = this.form[this.idKey] = this.form[this.nameKey] = ''
    },
    getData() {
      return this.form
    },
    validate () {
      return new Promise((resolve) => {
        this.$refs.form.validate((v) => {
          if (v && this.currentId !== this.form[this.idKey]) {
            this.$message({
              message: '正在查询课件/课程名称, 请稍后重试',
              type: 'warning'
            })
            this.queryCourseName()
            resolve(false)
          }
          resolve(v)
        })
      })
    },
    queryCourseName () {
      this.form[this.nameKey] = ''
      const params = {}
      let id
      switch (this.form.type) {
        case 1:
          id = params.coursewareId = this.form.coursewareId
          params.coursewareType = this.form.coursewareType
          params.type = 1
          break
        case 3:
          id = params.classId = this.form.positionClassId
          params.type = 2
          break
      }

      if (id === this.currentId) return
      batchOperation.coursewareTitle(params).then(res => {
        if (!res) {
          return
        }
        if (res.id === this.form[this.idKey]) {
          this.form[this.nameKey] = res.title
          this.currentId = res.id
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
