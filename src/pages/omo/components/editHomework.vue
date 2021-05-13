<template>
	<el-dialog title="编辑作业" width="60%" :visible.sync="visible" :before-close="handleCencel" @open="richText">
		<el-form :model="form">
			<el-form-item label="作业标题:" label-width="120px">
				<el-input 
					v-model="form.homeworkTitle" 
					autocomplete="off" 
					size="small" 
					style="width: 400px;" 
					placeholder="请输入作业标题"
				></el-input>
			</el-form-item>
			<el-form-item label="作业日期:" label-width="120px">
				报名后第 
				<el-input v-model="form.homeworkDate" size="small" style="width: 60px;"></el-input>
				天（报名当天为第1天）
			</el-form-item>
			<el-form-item label="作业内容:" label-width="120px">
				<div id="editor" ref="editor"></div>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-radio-group v-model="radio">
				<el-radio :label="1" @click.native.prevent="clickitem(1)">作业日期当日7:00推送提醒学员</el-radio>
			</el-radio-group>
			<el-button @click="handleCencel" size="small">取 消</el-button>
			<el-button type="primary" @click="handleClick" size="small">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import E from 'wangeditor'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				form: {
					homeworkTitle: '',
					homeworkDate: ''
				},
				editor: null,
				radio: ''
			}
		},
		methods: {
			clickitem(val){
				val === +this.radio ? this.radio = "" : this.radio = val;
			},
			handleCencel() {
				this.$emit('update:visible', false)
			},
			handleClick(){
				// if(!this.form.templateTitle || this.form.checked.length === 0){
				// 	this.$message.error('请填写信息在提交')
				// 	return;
				// }
				
				const editorValue = this.editor.txt.text(); // 富文本的内容
				this.$emit('update:visible', false);
			},
			richText(){
				if(this.editor){
					return;
				}
				this.$nextTick(() => {
					this.editor = new E('#editor')
					this.editor.create()
				})
			}
		},
	}
</script>

<style>
</style>
