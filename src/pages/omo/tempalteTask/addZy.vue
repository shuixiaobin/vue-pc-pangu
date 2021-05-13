<template>
  <el-dialog :title="title"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="handleClose">
    <el-form ref="form"
      :model="form"
      label-width="100px">
      <el-form-item label="作业标题">
        <el-input placeholder="请输入作业标题"
          :maxlength="20" style="width:70%"
          v-model="form.title" />
      </el-form-item>
      <el-form-item label="作业日期">
        <p>{{typeId==1?'线下开课后第':'报名后第'}}
          <el-input style="width:50px;height:20px"
            :maxlength="3"
            v-model="form.dayTimes" />天（报名当天为第1天）
        </p>
      </el-form-item>
      <el-form-item label="作业内容">
        <Um ref="um"
          :setValue="setValue" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.pushStatus">作业日期当日7:00推送提醒学员</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="saveData">确 定</el-button>
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
  import { getCourseDetail, saveWork } from '@/api/omoApi'
  import Util, { assert } from '@/common/util'
  function formInitVal() {
    return {
      pushStatus: true,
      title: '',
      content: '',
      dayTimes: '',
    }
  }
  export default {
    props: ['tempId','typeId'],
    computed: {
      title() {
        if (this.id) {
          return '作业编辑'
        } else {
          return '添加作业'
        }
      },
    },
    data() {
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
      saveData() {
        try {
          const content = this.$refs.um.getEditorContent()
          const form = this.form
          debugger
          assert(form.title.trim(), '作业标题必填')
          assert(form.dayTimes, '日期必填')
          assert(content, '作业内容必填')
          const params = {
            pushStatus: form.pushStatus ? 1 : 0,
            content,
            dayTimes: form.dayTimes,
            title: form.title,
            id: this.id,
            templateWorkId: this.tempId,
          }

          saveWork(params)
            .then((res) => {
              if (res.code === 1000000) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.$emit('refresh')
              } else {
                throw res
              }
            })
            .catch((e) => this.$message.error(e.message))
        } catch (e) {
          this.$message.error(e.message)
        }
      },
      show() {
        this.form = formInitVal()
        this.id = ''
        this.dialogVisible = true
        this.setVal('')
      },
      setVal(val = '') {
        this.$nextTick(() => {
          this.setValue = val
          this.$refs.um.setUmContent(val)
        })
      },
      showData(d) {
        this.id = d.id
        this.form = {
          pushStatus: d.pushStatus > 0,
          title: d.title,
          content: d.title,
          dayTimes: d.dayTimes,
        }
        this.setVal(d.content)
        this.dialogVisible = true
      },
      handleClose() {
        this.dialogVisible = false
      },
    },
    components: {
      Um,
    },
  }
</script>

<style scoped>
</style>
