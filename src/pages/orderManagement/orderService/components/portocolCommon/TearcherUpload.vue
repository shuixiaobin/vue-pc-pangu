<template>
	<div>
		<el-upload 
			class="avatar-uploader" 
			:action="actionUrl" 
			name="image"
			:show-file-list="false" 
			:on-success="handleSuccess"
			:on-progress="uploadPictureProcess"
		>
			<div class="qrcode-wrapper" @mouseover="shadeShow=true" @mouseout="shadeShow=false" v-if="imageUrl">
				<img ref="upLoadImg" v-show="videoFlag == false" :src="imageUrl" class="qrcode">
				<div ref="shade" class="shade" @click.stop.prevent="" v-show="shadeShow">
					<i class="el-icon-zoom-in" @click="previewVisible=true"></i>
					<i class="el-icon-delete" @click="handleDel"></i>
				</div>
			</div>
			<i v-else ref="uploadI" class="el-icon-plus avatar-uploader-icon" :class="[videoFlag == true ? 'display' : '']"></i>
			<el-progress class="progress" v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent"  />
		</el-upload>
		
		<el-dialog :visible.sync="previewVisible" append-to-body>
			<img width="100%" :src="imageUrl" alt="">
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: {
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
				videoFlag: false,
				videoUploadPercent: 0,
			}
		},
		methods: {
			handleDel() {
				this.$emit('update:imageUrl', '')
				this.shadeShow = false
			},
			handleSuccess(response) { // 文件上传成功运行
				this.videoFlag = false;
				if(response.code < 0){
					this.$message.error(response.msg)
				}else{
					this.$emit('update:imageUrl', response.data.src)
				}
			},
			uploadPictureProcess(event, file, fileList){ // 上传图片时的加载效果
				this.videoFlag = true;
				this.videoUploadPercent = parseInt( fileList[0].percentage.toFixed(0) );
			}
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
		width: 300px;
		height: 300px;
		line-height: 300px;
		text-align: center;
	}

	.format {
		font-size: 12px;
	}

	.qrcode-wrapper {
		width: 300px;
		height: 300px;
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
		width: 300px;
		height: 300px;
		display: block;
	}
	.avatar-uploader{
		position: relative;
		width: 300px;
		height: 300px;
		margin: 0 auto;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.progress{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.display::before{
		display: none;
	}
</style>
