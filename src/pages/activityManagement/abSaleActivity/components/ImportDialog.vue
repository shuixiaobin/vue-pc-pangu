<template>
  <div>
    <el-dialog
      title="批量导入"
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      width="600px"
    >
      <template #default>
        <el-upload
          class="upload-demo clear"
          ref="upload"
          accept=".xls,.xlsx"
          action=""
          :with-credentials="true"
          :on-change="fileChange"
          :on-remove="handleRemove"
          :file-list="fileList"
          :http-request="httpRequest"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            size="small"
            type="text"
            style="margin-left: 20px"
            @click="downloadTemplate"
            >下载模板</el-button
          >
          <transition name="upload-tip">
            <div class="el-upload__tip" v-show="fileList.length == 0">
              未选择任何文件
            </div>
          </transition>
        </el-upload>
        <el-button
          size="small"
          type="success"
          @click="submitUpload"
          :disabled="fileList.length == 0"
          >上传</el-button
        >
        <span class="el-upload__tip">(上传格式为.xls,xlsx)</span>
      </template>
      <template #footer>
        <el-button type="primary" size="small" @click="importActivities">
          批量导入
        </el-button>
      </template>
    </el-dialog>
    <el-dialog title="导入结果" :visible.sync="resultVisible">
      <el-table :data="resultList" height="400px">
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="message" label="结果">
        </el-table-column>
      </el-table>
      <template #footer>
        <div>
          <el-button size="small" type="primary" @click="resultVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { postUploadFile, setAbSaleActivityImport } from '@/api/activityManage';
export default {
  props: {
    visible: Boolean,
  },

  data() {
    return {
      fileList: [],
      uploadFileUrl: '',
      resultVisible: false,
      resultList: [],
    };
  },

  methods: {
    downloadTemplate() {
      window.open(`${PANGU_URL}/v1/c/Ab/activity/download`);
    },
    httpRequest(param) {
      //自定义的上传实现
      // param是自带参数。 this.$refs.upload.submit() 会自动调用 httpRequest方法.在里面取得file
      let fileObj = param.file; // 相当于input里取得的files
      let fd = new FormData(); // FormData 对象
      fd.append('file', fileObj); //文件对象

      return postUploadFile(fd, { 'Content-Type': 'multipart/form-data' })
        .then((res) => {
          this.uploadFileUrl = res.data.file;
          this.$message.success('上传成功！');
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    submitUpload() {
      //上传文件
      this.$refs.upload.submit();
    },
    fileChange(file, fileList) {
      // fileList 是文件列表发生变化后，返回的修改后的列表对象
      this.fileList = [file];
    },
    handleRemove(file, fileList) {
      //移除文件时
      this.fileList = [];
    },
    importActivities() {
      if (this.fileList.length > 0 && this.uploadFileUrl) {
        let param = {
          optUsername: this.$store.state.username, //操作人姓名
          templatePath: this.uploadFileUrl, //上传文件名称
        };
        setAbSaleActivityImport(param).then((res) => {
          if (res.code === 10000) {
            this.$message.success('批量导入成功');
            this.$emit('update:visible', false);
            this.$emit('imported');
            this.fileList = [];
            this.uploadFileUrl = '';
            this.resultList = res.data;
            this.resultVisible = true;
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.warning('请上传要导入的文件');
        return;
      }
    },
  },
};
</script>

<style scoped="scoped">
.clear {
  margin-bottom: 15px;
  height: 70px;
}
.clear >>> .el-upload__tip {
  margin-top: 10px;
  height: 25px;
  line-height: 25px;
}
.clear >>> .el-upload--text {
  border: 0;
}
.clear >>> li {
  width: 400px;
}
.clear >>> li:hover {
  background-color: #e4e8ff;
}
.upload-tip-enter-active {
  height: 0;
  -webkit-transition: 1s;
  transition: 1s;
  transition-property: opacity,transform;
}
.upload-tip-enter {
  opacity: 0;
  height: 0;
  -webkit-transform: translateY(30px);
  transform: translateY(30px)
}
</style>