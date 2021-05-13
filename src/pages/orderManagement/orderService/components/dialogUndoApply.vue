<template>
		<el-dialog title="撤销申请" :visible.sync="dialogFormVisible">
			<el-form :model="form" :rules="rules">
				<el-form-item label="订单编号" :label-width="formLabelWidth">
					<span>{{form.order_no}}</span>
				</el-form-item>
				<el-form-item label="课程标题" :label-width="formLabelWidth">
					<span>{{form.netclass_titles}}</span>
				</el-form-item>
				
				<el-form-item label="操作类型" :label-width="formLabelWidth" prop="region">
					<el-select v-model="form.region" placeholder="请选择操作类型">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="备注" :label-width="formLabelWidth" prop="note">
					<template slot-scope="scope">
						<el-input
						  type="textarea"
						  :rows="3"
						  placeholder="请输入"
						  v-model="form.note">
						</el-input>
					</template>
				</el-form-item>
				
			</el-form>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
		
</template>

<script>
	export default{
		data(){
			return {
				dialogFormVisible: false,
				form: {
					order_no: '',
					netclass_titles: '',
					region: '',
					note: '',
				},
				formLabelWidth: '120px',
				rules: {
					region: [{ //操作类型验证
						required: true,
						message: '请选择',
						trigger: ['change', 'blur']
					}],
					note: [{ //备注验证
						required: true,
						message: '请输入备注',
						trigger: 'blur',
						max: 256
					}]
				}
			}
		},
		
		methods: {
			open(){
				this.dialogFormVisible = true
			}
		}
	}
</script>

<style scoped="scoped">
	.font-red{
		color: #FF0000;
	}
</style>
