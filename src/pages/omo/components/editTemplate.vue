<template>
	<el-dialog title="编辑模板" width="60%" :visible.sync="visible" :before-close="handleCencel">
		<el-form :model="form">
			<el-form-item label="模板标题:" label-width="120px">
				<el-input 
					v-model="form.templateTitle" 
					autocomplete="off" 
					size="small" 
					style="width: 400px;" 
					placeholder="请输入模板标题"
				></el-input>
			</el-form-item>
			<el-form-item label="适用地区:" label-width="120px">
				<el-checkbox-group v-model="form.checked">
					<el-checkbox 
						v-for="item in form.checkList" 
						:key="item.id" 
						:label="item.id"
					>{{item.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCencel">取 消</el-button>
			<el-button type="primary" @click="handleClick">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
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
					templateTitle: '',
					checkList: [{
						name: '深圳',
						id: 1
					}, {
						name: '上海',
						id: 2
					}],
					checked: []
				},
			}
		},
		methods: {
			handleCencel() {
				this.$emit('update:visible', false)
			},
			handleClick(){
				if(!this.form.templateTitle || this.form.checked.length === 0){
					this.$message.error('请填写信息在提交')
					return;
				}
				this.$emit('update:visible', false);
			},
		}
	}
</script>

<style>
</style>
