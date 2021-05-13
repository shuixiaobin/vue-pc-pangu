<template>
	<div>
		<!-- 失败的弹框 -->
		<el-dialog :title="title" :visible.sync="dialogTableVisible">
		  <el-table :data="gridData">
		    <el-table-column property="result" :label="value1" width="200"></el-table-column>
		    <el-table-column property="message" :label="value2" width="150">
					<template slot-scope="scope">
						<span style="color: red;">{{scope.row.message}}</span>
					</template>
				</el-table-column>
				<el-table-column property="orderStatus" :label="value3" width="200"></el-table-column>
				<el-table-column property="classStatus" :label="value4" width="200"></el-table-column>
		  </el-table>
		</el-dialog>
		
	</div>
</template>

<script>
	export default{
		props: {
			failList: { //0元赠课
				type: Array
			},
			title: {
				type: String
			},
			messageList: [Object, Array], //批量代报名分校
			onLine: [Object, Array], //批量代报名在线
			batchClosed: { //批量代报名关闭
				type: Array
			},
		},
		data() {
			return {
				gridData: [],
				value1: '',
				value2: '',
				value3: '', //订单状态
				value4: '', //课程状态
				dialogTableVisible: false,
				formLabelWidth: '120px'
			};
		},
		watch: {
			onLine(newVal){ //批量代报名在线
				console.log('newVal: ', newVal);
				this.value1 = '序号'
				this.value2 = '处理结果'
				this.gridData = newVal
			},
			batchClosed(newVal){ //批量代报名关闭
				this.value1 = '序号';
				this.value2 = '处理结果'
				this.gridData = newVal;
			},
			messageList(newVal){ //批量代报名分校
				if(newVal){
					this.value1 = '序号';
					this.value2 = '处理结果';
					this.value3 = '订单状态'
					this.value4 = '课程状态'
					const arr = [];
					
					for (let prop in newVal) {
						this.gridData.push(newVal[prop])
					}
					
					this.gridData.forEach(item => {
						if(item.result < 0){
							if(item.classStatus == null){ //如果课程状态为 null 展示空， 否则展示返回值
								item.classStatus = "";
							}
							if(item.orderStatus == null){
								item.orderStatus = "";
							}else{
								if(item.orderStatus == 0){item.orderStatus = '未处理'}
								else if(item.orderStatus == 1){item.orderStatus = '已查看'}
								else if(item.orderStatus == 2){item.orderStatus = '已支付'}
								else if(item.orderStatus == 4){item.orderStatus = '已隐藏'}
								else if(item.orderStatus == 6){item.orderStatus = '已取消'}
								else if(item.orderStatus == 7){item.orderStatus = '重复订单'}
								else if(item.orderStatus == 8){item.orderStatus = '保过以通过'}
								else if(item.orderStatus == 9){item.orderStatus = '保过未通过'}
								else if(item.orderStatus == 10){item.orderStatus = '待用户确认'}
								else if(item.orderStatus == 11){item.orderStatus = '需要确认'}
								else if(item.orderStatus == 12){item.orderStatus = '不需要确认'}
								else if(item.orderStatus == 13){item.orderStatus = '需要审核'}
							}
						}else{
							item.orderStatus = '';
							item.classStatus = '';
						}
					})
					
					
				}
			},
			failList(newVal){
				this.value1 = '用户名';
				this.value2 = '处理结果';
				this.gridData = [];
				let obj = {}
				newVal.forEach(item => {
					obj.result = item;
					obj.message = "0元赠课失败";
					this.gridData.push(obj);
				})
			},
		}
	}
</script>

<style>
</style>
