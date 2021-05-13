<template>
	<div>
		<!-- 关联赠送课程 -->
		<el-dialog 
			title="关联增送课程" 
			:visible.sync="dialogTableVisible"
			width="70%"
		>
			<el-form 
				:model="courseInfo" 
				align="left" 
				ref="course"
				style="margin-bottom: 20px;"
			>
				<div style="display: flex;">
					<el-col :span="4">
						<el-select
							v-model="courseInfo.seacheType" 
							placeholder="请选择"
						>
							<el-option label="课程标题" value="2"></el-option>
							<el-option label="课程ID" value="1"></el-option>
							<el-option label="课程编号" value="3"></el-option>
						</el-select>
					</el-col>
					
					<el-col :span="6">
						<el-input
							v-model="courseInfo.seacheValue" 
							autocomplete="off"
						></el-input>
					</el-col>
					
					<el-button 
						type="primary" 
						size="small" 
						@click="handleClick()"
						style="margin-left: 20px;"
					>搜索</el-button>
					<el-button 
						size="small"
						@click="resetForm()"
					>重置</el-button>
				</div>
			</el-form>
		
		  <el-table 
				class="relatedCourses"
				:data="gridData" 
				@select="onRowClick"
				:row-key="getRowKey"
				ref="multipleTable"
			>
				<el-table-column
					type="selection"
					show-overflow-tooltip
					:reserve-selection="true"
					:selectable="checkSelectable"
				>
				</el-table-column>
		    <el-table-column property="courseId" label="课程ID" width="100" fixed="left"></el-table-column>
		    <el-table-column property="classNo" label="课程编号" width="150"></el-table-column>
		    <el-table-column property="title" label="课程名称" width="200"></el-table-column>
				<el-table-column label="双师上课地点" width="180" v-if="courseType !== 1">
					<template slot-scope="scope">
						<span v-if="scope.row.o2oType == 1">----</span>
						<el-cascader
							v-else
							:show-all-levels='false'
							v-model="scope.row.goodsId"
							:options="scope.row.options"
							@focus="handleFocus(scope.row, $event)"
							:emitPath="false"
							ref="cascader"
						>
						</el-cascader>
					</template>
				</el-table-column>
				<el-table-column property="createDate" label="发布日期" width="160"></el-table-column>
				<el-table-column property="status" label="状态">
					<template slot-scope="scope">
						<span>{{getStatus( scope.row.status )}}</span>
					</template>
				</el-table-column>
				<el-table-column property="startDate" label="上线日期" width="160"></el-table-column>
				<el-table-column property="actualPrice" label="实际价格"> 
					<template slot-scope="scope">
						<span>￥{{scope.row.actualPrice}}</span>
					</template>
				</el-table-column>
		  </el-table>
			
			<div class="block" style="margin-top: 10px;">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-sizes="[10, 15]"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
				</el-pagination>
			</div>
			
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="syncHandleClick">确 定</el-button>
			</div>
			
		</el-dialog>
		
	</div>
	
</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	export default{
		props: ['courseType'],
		data() {
			return {
				gridData: [],
				displayData: [], //关联之后展示的数据与 gridData 同字段
				dialogTableVisible: false,
				courseInfo: {
					seacheType: '2', //课程类型
					seacheValue: '',
				},
				relatedCourses: [], //关联的课程
				doubleCourse: [], //双师课
				normalCourse: [], // 普通课
				total: 0, //总页数
				currentPage: 1, //当前页
				pageSize: 10, //每页显示条数
			}
		},
		mounted() {
			this.handleClick()
		},
		methods: {
			async handleClick(){ //搜索
				const obj = {}
				if(this.courseInfo.seacheValue){	
					obj.seacheType = this.courseInfo.seacheType;
					obj.seacheValue = this.courseInfo.seacheValue;
				}
				obj.page = this.currentPage;
				obj.pageSize = this.pageSize;
				
				await orderManage.getClassList(obj)
					.then(res => {
						this.total = res.data.total;
						this.gridData = res.data.data;
						this.gridData.forEach(item => {
							if(item.o2oType == 1){ // 普通课
								this.$set(item, "goodsId", "")
							}else if(item.o2oType == 2){ // 双师课
								this.$set(item, "goodsId", null)
							}
						})
					})
					.catch(err => {
						this.$message.error(err)
					})
				if(this.courseType == 1){ // 代表 0 元赠课, 0员赠课 需要过滤出双师课程
					this.gridData = this.gridData.map(item => item.o2oType == 1 ? item : null).filter(it => it)
				}
			},
			async handleFocus(row, e){
				if(!row.options){
					const response = orderManage.getBranchSchoolList({courseId: row.courseId})
					await response.then(res => {
						if(res.data.length > 0){
							this.$set(row, 'options', res.data.map(item => {
								return {
									value: item.province_name,
									label: item.province_name,
									children: item.schools.map(it => {
										return {
											value: it.goods_id + "$$" + it.branch_school_name,
											label: it.branch_school_name
										}
									})
								}
							}))
						}
						e.target.click();
					})
					.catch(err => {
						this.$message.error(err)
					})
					e.target.click();
				}
				e.target.click();
			},
			resetForm() { //重置
				this.courseInfo = {
					seacheType: '', 
					seacheValue: '',
				}
			},
			getStatus(val){ //状态
				const arr = ['未上线', '已上线', '已下线', '关闭', '删除', '待提交']
				if(val)return arr[val];
			},
			checkSelectable(row) { //判断刚开始没请求数据之前能不能使用选取按钮
				return row ? true : false 
			},
			getRowKey(row){// 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
				return row.courseId
			},
			onRowClick(selection, row) { //根据选择的行数，获取关联的课程
				this.relatedCourses = selection;
				// let num = 0;
				// this.relatedCourses.forEach((item, index, arr) => {
				// 	if(item.o2oType == 2){
				// 		num++;
				// 		console.log("row: ",row);
				// 	}
				// 	if(num > 1){
				// 		this.$message.error('双师课程只能选择一个')
				// 		this.$refs.multipleTable.toggleRowSelection(row, false)
				// 		arr.splice(index, 1);
				// 		num--;
				// 	}
				// })
			},
			syncHandleClick(){ //确定
				const state = this.relatedCourses.every(item => {
					if(item.o2oType == 2 && item.goodsId == null){ 
						this.$message.error('双师课程需要选择上课地点！')
						return false
					}
					return true
				})
				if(state){
					this.dialogTableVisible = false;
					this.$emit('submitCourse', this.relatedCourses)
				}
			},
			handleSizeChange(val) { //切换每页多少条时
				this.pageSize = val;
				this.handleClick()
			},
			handleCurrentChange(val) { //点击页码数切换时
				this.currentPage = val;
				this.handleClick()
			},
		}
	}
</script>

<style>
	.relatedCourses .el-table__header th:first-child .cell .el-checkbox{
		display: none;
	}
	
</style>