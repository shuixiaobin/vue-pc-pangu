<template>
  <div class="step2">
    <PositionForm ref="form" :type="type" :formData="formData"/>
    <div class="batch-align-center">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
    <el-dialog title="定位课件在如下课程中未找到：" :visible.sync="dialogTableVisible">
      <el-table
        :data="noExistList"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="课程ID"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          align="center"
          label="课程名称">
        </el-table-column>
      </el-table>
      <div style="margin-top: 30px;">继续操作 以上课程将不会添加试卷，是否继续</div>
      <div slot="footer" @close="cancel">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm">继续添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import PositionForm from './components/CoursePositionForm'
import batchOperation from '@/api/batchOperation'
import { deepCopy, makeMap } from '../util'
export default {
  props: ['cacheData'],
  name: 'step2',
  created () {
    try {
      const type = this.cacheData.step1.type
      this.type = type
      if (type === 2) {
        this.next(false)
        return
      }
      const d = this.cacheData[this.$options.name]
      if (d && d.data) {
        this.formData = deepCopy(d.data)
      }
    } catch (e) {
      throw new Error('数据有误, 请刷新重试')
    }
  },
  data () {
    return {
      type: undefined,
      formData: null,
      noExistList: [],
      dialogTableVisible: false
    }
  },
  methods: {
    next (f) {
      if (f === false) {
        // 放到末尾
        this.$emit('next', {
          key: 'step2',
          step: 2,
          data: { type: 2 }
        })
      } else {
        this.$refs.form.validate().then(res => {
          if (!res) return
          const data = deepCopy(this.$refs.form.getData())
          this.validCourse(data).then(res => {
            if (res) {
              this.$emit('next', {
                key: 'step2',
                data
              })
            }
          })
        })
      }
    },
    validCourse (data) {
      return batchOperation.verifyCourseware({
        // type: 1课件 2课程
        // data.type: 1课件 2放在结尾 3课程
        type: data.type === 3 ? 2 : data.type,
        classIds: this.cacheData['step1'].data.map(item => item.id).toString(),
        coursewareId: data.coursewareId,
        positionClassId: data.positionClassId,
        coursewareType: data.coursewareType
      }).then(res => {
        const d = res.noExistIds
        if (d && d.length > 0) {
          this.showNoExistIds(d)
          return false
        }
        return true
      })
    },
    showNoExistIds (ids) {
      const idMap = makeMap(ids)
      this.noExistList = this.cacheData['step1'].data
        .filter(item => item.id in idMap)
        .map(item => ({id: item.id, title: item.title}))
      this.dialogTableVisible = true
    },
    cancel () {
      this.dialogTableVisible = false
      this.noExistList = []
    },
    confirm () {
      const data = deepCopy(this.$refs.form.getData())
      this.$emit('next', {
        key: 'step2',
        data
      })
    }
  },
  components: {
    PositionForm
  }
}
</script>

<style scoped>
.step2 {
  width: 500px;
  margin: 0 auto;
}
</style>
