<template>
	<!-- 协议退费申请表 -->

	<el-dialog title="协议退费申请表" :visible="visible" @update:visible="$emit('update:visible', $event)" width="70%">
		<applyTable v-if="returnType == 1" :info="info" />
		<div v-else-if="returnType == 2">
			<h2 class="header">华图在线{{info.treatyType == 1 ? '笔试' : '面试'}}协议退费申请表</h2>
			<div class="kefu-tips">
				客服后台上传，打包下载即可
			</div>
		</div>
		<div v-else>
			<div class="kefu-tips">
				暂无数据
			</div>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCancel" size="small">取 消</el-button>
			<el-button type="primary" v-auth="'XYB_DOWNLOAD_APPLI_FORM'" @click="packToDownload" size="small" :disabled="returnType == 0">打包下载</el-button>
		</div>

	</el-dialog>


</template>

<script>
import applyTable from '../components/applyTable'
import { getRefundTable, getTableDownload } from "@/api/orderManage"
	export default {
		components: {applyTable},
		props:{
			visible: Boolean,
			type: String,
			orderId: [String, Number],
		},
		data() {
			return {
				date: {
					year: '2020',
					month: '06',
					day: '18'
				},
				returnType: 0,
				info: null,
			}
		},
		watch: {
			visible (value) {
				if (value && this.orderId) {
					getRefundTable({order_id: this.orderId}).then(res => {
						if (res.code == 10000) {
							if (res.data.returnType == 1) {
								// 学生
								this.info = res.data
								this.returnType = 1
							} else if (res.data.res.data.returnType == 2) {
								// 客服
								this.info = res.data
								this.returnType = 2
								this.packToDownload();
							} else {
								// 不存在
								this.returnType = 0
							}
						}
					})
				}
			}
		},
		methods: {
			handleCancel(){
				this.$emit('update:visible', false)
			},
			packToDownload(){
				getTableDownload({
					order_id: this.orderId
				}).then(res => {
					if (res.code === 10000) {
						let link = document.createElement("a");
						link.href = res.data.zip_path;
						link.click();
					} else {
						this.$message.error(res.msg);
					}
				}).catch(e => {
					console.log(e)
				})
				// this.$emit('update:visible', false)
			},
		}
	}
</script>

<style scoped="scoped" lang="less">
	.header {
		text-align: center;
		font-size: 20px;
		font-weight: bold;
	}

	.kefu-tips {
		padding: 60px;
		font-size: 22px;
		text-align: center;
		line-height: 60px;
	}

</style>
