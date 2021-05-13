<template>
	<div>
		<el-dialog title="操作日志" :visible="dialogTableVisible" @close="colseDialog" center  width="55%">
			<el-table :data="gridData">
				<el-table-column property="time" width="200" label="时间" header-align="center" align="center"></el-table-column>
				<el-table-column property="userName" width="150" label="操作人" header-align="center" align="center"></el-table-column>
				<el-table-column property="type" width="100" label="操作" header-align="center" align="center"></el-table-column>
				<el-table-column property="content" label="内容" header-align="center" align="center"></el-table-column>
			</el-table>
			<div class="pageBox">
				<div class="fl">
					第{{page}}页/共{{Math.ceil(total/10)}}页 共{{total}}条
				</div>
				<el-pagination
				  background
				  layout="prev, pager, next"
				  :total="total"
				  :current-page="page"
				  :page-size="pageSize"
				  class="fr"
				  @current-change="pageBtn">
				</el-pagination>					
			</div>		  
		</el-dialog>
	</div>
</template>
<script>
import { getParams} from "@/config/utils";
export default {
	data(){
		return{
			netClassId: getParams("netClassId"), //课程id
			gridData:[],//表格数据
			total:null,//总页数
			page:1,//当前页
			pageSize:10,//每页显示条数
		}
	},
	props: {
		dialogTableVisible: {
			type: Boolean,
			default:false
		}
	},
	created(){
		//this.getlogData();
	},
	methods:{
		getlogData(){
          this.myGet(`${PHP_URL}/v4/pc/syllabus/syllabus_log`, {
             netClassId:this.netClassId,
             page:this.page,
             pageSize:this.pageSize
          })
          .then(result => {
          	 this.gridData=result.data.list;
          	 this.total=result.data.total;
          })
          .catch(err => {
             console.log(err)
          }) 
		},
		pageBtn(val){
			this.page=val;
			this.getlogData();
		},
		colseDialog(){
			this.page=1;
			this.$emit('colseDialog')
		}
	}	
}	
</script>
<style lang='less' scoped>
.pageBox{
   padding-top:20px;
   height:54px;
   line-height:34px;
   clear:both;
   overflow:hidden;
}
</style>