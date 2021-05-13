<template>
  <div class="edit-report">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="报道信息">
        <UM :setValue="form.content" ref="um"></UM>
      </el-form-item>
      <el-form-item label="是否展示给学员">
        <el-radio
          v-model="form.showStatus"
          label="1"
        >展示</el-radio>
        <el-radio
          v-model="form.showStatus"
          label="0"
        >不展示</el-radio>
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-checkbox v-model="form.pushStatus">保存时推送提醒学员</el-checkbox>
        <el-button
          @click="handlePreview"
          type="success"
        >预览</el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      width="415px"
    >
      <div
        class="content"
        v-html="form.content"
      ></div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getReport, saveReport } from '@/api/omoApi'
  import UM from '@/components/um'
  // import E from 'wangeditor'
  // let editor
  export default {
    components: {
      UM,
    },
    data() {
      // this.customConfig = {
      //   uploadImgServer: `${BASEURL}/pand/file/upload`,
      //   uploadFileName: 'file',
      //   uploadImgHooks: {
      //     customInsert: (insertImg, result) => {
      //       let url = result.data.url
      //       insertImg(url)
      //     },
      //   },
      // }
      return {
        form: {
          showStatus: '1',
          pushStatus: true,
          content: '',
          id: '',
        },
        dialogVisible: false,
        rid: this.$route.query.rid,
      }
    },

    mounted() {
      // editor = new E('#editor')
      // editor.customConfig = this.customConfig
      // editor.create()
      this.getReportFn()
    },

    methods: {
      handlePreview() {
        this.dialogVisible = true
        this.form.content = this.$refs.um.getEditorContent()
      },
      getReportFn() {
        getReport(this.rid)
          .then(res => {
            if (res.data) {
              this.form.showStatus = String(res.data.showStatus)
              this.form.pushStatus = !!res.data.pushStatus
              this.form.content = res.data.content
              this.form.id = res.data.id
              this.$refs.um.setUmContent(res.data.content)
              // editor.txt.html(res.data.content)
            }
            console.log(res)
          })
          .catch(err => {})
      },
      handleSave() {
        this.form.content = this.$refs.um.getEditorContent()
        const parmas = {
          content: this.form.content,
          courseId: this.rid,
          id: this.form.id,
          pushStatus: +this.form.pushStatus,
          showStatus: this.form.showStatus,
        }
        saveReport(parmas)
          .then(res => {
            if (res.code === 1000000) {
              this.$message({
                message: '添加/保存成功!',
                type: 'success',
                onClose: () => {
                  this.$router.go(-1)
                },
              })
            }
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
    },
  }
</script>
<style lang='less' scoped>
  .edit-report {
    height: 100%;
    background: #fff;
    padding: 20px;
  }
  .el-checkbox {
    margin-right: 20px;
  }
  .el-dialog__wrapper {
    z-index: 100001 !important;
  }
</style>