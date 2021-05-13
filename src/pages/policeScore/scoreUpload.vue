<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>招警成绩管理</span>
      <el-button style="float: right;" @click="downloadTemplate" type="default">下载模板</el-button>
    </div>
    <el-form>
      <el-form-item label="选择文件" required>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="baseUrl + '/pand/grade/upload'"
          accept=".xls,.xlsx"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="fileList"
          :on-error="handleError"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-auth="'PS_UPLOAD'">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">(上传格式为.xls,xlsx)</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
export default {
  data() {
    return {
      fileList: [],
      baseUrl: BASEURL,
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess (res, f, flist) {
      console.log(f, flist)
      if (res.code !== 1000000) {
        this.$message.error(res.message)
        f.status = 'error'
      }
    },
    handleError (e) {
      console.log(e)
      this.$message.error(e.message)
    },
    downloadTemplate () {
      window.open(`${this.baseUrl}/pand/grade/downloadModel`)
    },
  }
}
</script>

<style scoped>

</style>