<template>
  <el-dialog
    title="提示"
    :visible="true"
    width="30%"
    :show-close="false"
  >
    <el-row>
      <el-col :span="12">
        <h4>省考:</h4>
        <br />
        <el-upload
          class="upload"
          ref="upload"
          action=""
          :file-list="fileList"
          :http-request="upload(uploadUrls[0])"
          :on-error="handleError"
          :on-success="handleSuccess"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >上传文件</el-button>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <h4>国考:</h4>
        <br />
        <el-upload
          class="upload"
          ref="upload"
          action=""
          :file-list="fileList2"
          :http-request="upload(uploadUrls[1])"
          :on-error="handleError"
          :on-success="handleSuccess"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >上传文件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="12">
        <h4>教师招聘:</h4>
        <br />
        <el-upload
          class="upload"
          ref="upload"
          action=""
          :file-list="fileList3"
          :http-request="upload(uploadUrls[2])"
          :on-error="handleError"
          :on-success="handleSuccess"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >上传文件</el-button>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <h4>军队文职:</h4>
        <br />
        <el-upload
          class="upload"
          ref="upload"
          action=""
          :file-list="fileList4"
          :http-request="upload(uploadUrls[3])"
          :on-error="handleError"
          :on-success="handleSuccess"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >上传文件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="12">
        <h4>事业单位:</h4>
        <br />
        <el-upload
          class="upload"
          ref="upload"
          action=""
          :file-list="fileList5"
          :http-request="upload(uploadUrls[4])"
          :on-error="handleError"
          :on-success="handleSuccess"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >上传文件</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <!-- <el-button
        style="margin-left: 10px;"
        size="small"
        type="primary"
        @click="handleClick(true)"
      >确定</el-button> -->
      <el-button @click="handleClick(false)">取 消</el-button>
    </span>

  </el-dialog>
</template>

<script>
  import axios from 'axios'
  export default {
    props: ['dialogVisible'],
    data() {
      return {
        // actionUrl: `${ZWK_URL}/admin/position/import`,
        fileList: [],
        fileList2: [],
        fileList3: [],
        fileList4: [],
        fileList5: [],
        uploadUrls: [
          `${ZWK_URL}/admin/position/import`,
          `${ZWK_URL}/admin/position/importNationPosition`,
          `${ZWK_URL}/admin/position/importPositionTeacher`, //教师招聘
          `${ZWK_URL}/admin/position/importPositionMilitarycivilian`, //军队文职
          `${ZWK_URL}/admin/position/importPositionGovernment` //事业单位
        ],
        loading: null
      }
    },
    methods: {
      handleClick(flag) {
        if (flag) {
          this.$refs.upload.submit()
        }
        this.$emit('update:dialogVisible', false)
      },
      upload(url) {
        return (fileObj) => {
          const formData = new FormData()
          formData.append('file', fileObj.file)
          formData.append('type', fileObj.file.type)
          this.loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          return axios
            .request({
              url,
              method: 'post',
              data: formData,
              timeout: 10 * 60 * 1000
            })
            .then(this.handleSuccess, this.handleError)
        }
      },
      handleSuccess(res) {
        this.loading.close()
        if (res) {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
        }
      },
      handleError(err) {
        if (err.message.includes('timeout')) {
          this.$message.error('请求超时，请重新上传')
        } else {
          this.$message.error(err.message)
        }
        this.loading.close()
      }
    }
  }
</script>
<style lang='less' scoped>
</style>
