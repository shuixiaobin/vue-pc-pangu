<template>
	<div>
		<!-- 订单详情-班级信息模块 -->
		<el-table :data="tableData" stripe max-height="350" border >

			<el-table-column fixed="left" prop="Title" label="课程标题"></el-table-column>

			<el-table-column width="80">
				<template slot="header">
					<div class="headerTitile">
						<span>课件进度</span>
						<span>状态</span>
					</div>
				</template>
				<template slot-scope="scope">
					<div class="borderTitile">
						<span>{{scope.row.lesstion_count}}/{{scope.row.lessionCount}}</span>
						<span>{{scope.row.statusName}}</span>
					</div>
				</template>
			</el-table-column>

			<el-table-column>
				<template slot="header">
					<div class="headerTitile">
						<span>上线日期</span>
						<span>授课教师</span>
					</div>
				</template>
				<template slot-scope="scope">
					<div class="borderTitile">
						<span>{{scope.row.StartDate}}</span>
						<span>{{scope.row.TeacherDesc}}</span>
					</div>
				</template>
			</el-table-column>
			
			<el-table-column>
				<template slot="header">
					<div class="headerTitile">
						<span>图书成本</span>
						<span>邮费成本</span>
					</div>
				</template>
				<template slot-scope="scope">
					<div class="borderTitile">
						<span v-if="scope.row.book_cost">￥{{moneyFormat(scope.row.book_cost)}}</span>
						<span v-if="scope.row.postage_cost">￥{{moneyFormat(scope.row.postage_cost)}}</span>
					</div>
				</template>
			</el-table-column>
			
			<el-table-column label="备注" >
				<template slot-scope="scope">
					<textarea 
						cols="21" 
						rows="2" 
						style="resize: none; border: 1px solid #ccc;"
						readonly
						v-model="scope.row.Remark"
					></textarea>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import Util from '@/common/util.js'
	export default {
		props: {
			allTableData: {
				type: Object
			}
		},
		data() {
			return {
				tableData: []
			}
		},
		watch: {
			allTableData(newVal){
				let obj = {};
				const {class_info, order_item, order} = newVal;
				const classids = []; //班级id
				for (let prop in class_info) {
					classids.push(class_info[prop].rid)
					obj.Title = class_info[prop].Title; //课件标题
					obj.lesstion_count = class_info[prop].lesstion_count; //课件进度
					obj.lessionCount = class_info[prop].lessionCount; //课件进度
					obj.statusName = class_info[prop].statusName; //课程状态
					obj.StartDate = class_info[prop].StartDate; //上线时间
					obj.TeacherDesc = class_info[prop].TeacherDesc; //授课教师
					obj.book_cost = class_info[prop].book_cost; //图书成本
					obj.postage_cost = class_info[prop].postage_cost; //邮费成本
					obj.Remark = class_info[prop].remark; //备注
					this.tableData.push(obj)
					obj = {};
					
					//如果主课程里 有子课程,则继续向后添加
					if(class_info[prop].child.length !== 0){
						for (let i = 0; i < class_info[prop].child.length; i++) {
							obj.Title = "|→" + class_info[prop].child[i].Title;
							obj.lesstion_count = class_info[prop].child[i].lesstion_count; //课件进度
							obj.lessionCount = class_info[prop].child[i].lessionCount; //课件进度
							obj.statusName = class_info[prop].child[i].statusName; //课程状态
							obj.StartDate = class_info[prop].child[i].StartDate; //上线时间
							obj.TeacherDesc = class_info[prop].child[i].TeacherDesc; //授课教师
							obj.book_cost = class_info[prop].child[i].book_cost; //图书成本
							obj.postage_cost = class_info[prop].child[i].postage_cost; //邮费成本
							obj.Remark = class_info[prop].child[i].Remark; //备注
							this.tableData.push(obj);
							obj = {};
						}
						
					}
					
				}
				
			}
		},
		methods:{
			moneyFormat(number){
				if(number || number === 0 || number === '0'){
					let resp = null;
					resp = number / 100;
					
					let result = Util.moneyFormat(resp);
					if(result || result === 0 || result === '0'){
						return result
					}
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.headerTitile, .borderTitile{
		width: 100%;
		padding: 0;
	}
	.headerTitile span, .borderTitile span{
		display: block;
		text-align: left;
	}
	
	.headerTitile span:last-child,.borderTitile span:last-child{
		border-top: 1px solid #ccc; 
	}
</style>
