<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="actionUrl"
      name="image"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
    >
      <div
        class="qrcode-wrapper"
        @mouseover="shadeShow=true"
        @mouseout="shadeShow=false"
        v-if="imageUrl"
      >
        <img
          :src="imageUrl"
          class="qrcode"
        >
        <div
          class="shade"
          @click.stop.prevent=""
          v-show="shadeShow&&$route.query.roleType"
        >
          <i
            class="el-icon-zoom-in"
            @click="previewVisible=true"
          ></i>
          <i
            class="el-icon-delete"
            @click="handleDel"
          ></i>
        </div>
      </div>
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"
      ></i>
    </el-upload>
		<p v-if="format.width2" class="format">
			{{`图片尺寸（${format.width1}px*${format.height1}px或${format.width2}px*${format.height2}px) ，上传格式(.jpg,jpeg,gif,bmp)，不大于${format.kb}k`}}
		</p>
    <p v-else class="format">
			{{`图片尺寸（${format.width}px*${format.height}px) ，上传格式(.jpg,jpeg,gif,bmp)，不大于${format.kb}k`}}
		</p>
    <el-dialog
      :visible.sync="previewVisible"
      append-to-body
    >
      <img
        width="100%"
        :src="imageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      format: {
        type: Object,
        default: () => ({}),
      },
      imageUrl: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        actionUrl: `${PHP_URL}/v4/blue/class/upload`,
        shadeShow: false,
        previewVisible: false,
      }
    },
    methods: {
      // 上传图片
      handleBeforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif'
        const isLtKb = file.size > this.format.kb
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
        }
        if (!isLtKb) {
          this.$message.error(`上传头像图片大小不能超过${this.format.kb}!`)
        }
        return isJPG && isLtKb
      },
      handleDel() {
        this.$emit('update:imageUrl', '')
        this.shadeShow=false
      },
      handleSuccess(response) {
        this.$emit('update:imageUrl', response.data.src)
      },
    },
  }
</script>
<style lang="less">
  .avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }
</style>
<style lang='less' scoped>
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .format {
    font-size: 12px;
  }
  .qrcode-wrapper {
    width: 100px;
    height: 100px;
    position: relative;
    .shade {
      border: 1px dashed rgba(0, 0, 0, 0.7);
      background: rgba(0, 0, 0, 0.7);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 1;
      i {
        color: #fff;
        font-size: 20px;
      }
    }
  }
  .qrcode {
    width: 100px;
    height: 100px;
    display: block;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
</style>