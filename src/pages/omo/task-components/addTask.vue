<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="作业标题">
        <el-input placeholder="请输入作业标题" :maxlength="20" v-model="form.title" />
      </el-form-item>
      <el-form-item label="作业日期">
        <el-date-picker v-model="form.workDate" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="作业内容">
        <Um ref="um" :setValue="setValue" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.selected">
            <span v-if="useDefaultPushTime">&nbsp;作业日期当日7:00推送提醒学员 <el-button @click="editPushTime">修改时间</el-button></span>
            <template v-else>
              <el-date-picker v-model="form.pushTime" type="datetime" placeholder="选择日期时间" />&nbsp;推送提醒学员
              &nbsp;<el-button @click="editPushTime">使用默认时间</el-button>
            </template>
          </el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveData">确 定</el-button>
    </span>
  </el-dialog>
</template>


<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import Um from '@/components/um'
import { getCourseDetail, taskOperate } from '@/api/omoApi'
import Util, { assert } from '@/common/util'
function formInitVal () {
  return {
    selected: true,
    title: '',
    workDate: '',
    pushTime: '',
  }
}
export default {
  props: ['courseId'],
  computed: {
    title () {
      if (this.id) {
        return '作业内容编辑'
      } else {
        return '添加新作业'
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: formInitVal(),
      id: undefined,
      init: false,
      setValue: '',
      useDefaultPushTime: true,
    }
  },
  methods: {
    editPushTime () {
      this.useDefaultPushTime = !this.useDefaultPushTime
    },
    saveData () {
      try {
        const content = this.$refs.um.getEditorContent()
        const form = this.form
        assert(form.title.trim(), '作业标题必填')
        assert(form.workDate, '作业日期必填')
        assert(content, '作业内容必填')
        if (!this.useDefaultPushTime)
          assert(form.pushTime, '请选择推送时间')
        const params = {
          pushStatus: form.selected ? 1 : 0,
          content,
          workDate: Util.formatDate(form.workDate) + ' 23:59:59',
          title: form.title,
          id: this.id
        }
        if (form.selected && !this.useDefaultPushTime) {
          params.pushTime = Util.formatTime2(form.pushTime)
        }
        taskOperate(this.courseId, params).then(res => {
          if (res.code === 1000000) {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$emit('refresh')
          } else {
            throw res
          }
        }).catch(e => this.$message.error(e.message))
      } catch(e) {
        this.$message.error(e.message)
      }
    },
    show () {
      this.form = formInitVal()
      this.id = ''
      this.useDefaultPushTime = true
      this.dialogVisible = true
      this.setVal('')
    },
    setVal (val = '') {
      this.$nextTick(() => {
        this.setValue = val
        this.$refs.um.setUmContent(val)
      })
    },
    showData (d) {
      this.id = d.id
      const form = formInitVal()
      form.title = d.title
      form.selected = d.pushStatus === 0 ? false : true
      form.workDate = new Date(d.workDate)
      this.form = form
      if (d.pushTime) {
        form.pushTime = new Date(d.pushTime.replace(/-/g, '/'))
        this.useDefaultPushTime = false
      } else {
        this.useDefaultPushTime = true
      }
      this.dialogVisible = true
      this.setVal(d.content)
    },
    handleClose () {
      this.dialogVisible = false
    },
  },
  components: {
    Um,
  }
}
</script>

<style scoped>

</style>
