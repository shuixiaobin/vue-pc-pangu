<template>
	<div>
		<!-- 订单详情-图书信息模块 -->
		<el-col :span="12">
			<div class="grid-content bg-purple-dark">图书名称: 
				<span>{{numberBooks(Goods)}}</span>
				<span class="fontCls" :style="showStyle" @click="handleClick()">{{isShowAll ? '收起' : '更多'}}</span>
			</div>
			<div class="grid-content bg-purple-dark">物流单号: <span>{{ExpressNo}}</span></div>
		</el-col>
		<el-col :span="12">
			<div class="grid-content bg-purple-dark">发货状态: <span>{{Status}}</span></div>
			<div class="grid-content bg-purple-dark">发货时间: <span>{{deliveryTime}}</span></div>
		</el-col>
	</div>
</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	export default{
		props:{
			express_info: {
				type: Object
			},
			tableData: {
				type: Object
			}
		},
		data(){
			return {
				Goods: [], //图书名称
				Status: '', //发货状态
				ExpressNo: '', //物流单号
				deliveryTime: '', //发货时间
				isShowAll: false, //更多按钮的显示
			}
		},
		watch: {
			express_info(newVal){
				if(newVal.Goods){
					this.Goods = newVal.Goods; //图书名称
					
					if(newVal.status == 0){//发货状态
						this.Status = '已发货'
					}else if(newVal.status == 1){this.Status = '已收货'};
					
					this.ExpressNo = newVal.ExpressNo; //物流单号
					this.deliveryTime = newVal.deliveryTime; //发货时间
				}
			},
		},
		computed: {
			showStyle(){
				if(this.Goods.length >= 4){
					return "display:block;"
				}else{
					return "display: none;"
				}
			},
		},
		methods: {
			//根据图书的数量，决定如何显示
			numberBooks(req){
				if(!req)return "-";
				const len = req.length;
				const arr = [];
				if(len < 4){
					//当图书数量小于 4本 时，展示全部
					return req.map(item => '《' + item + '》').join(' ')
				}else if(len >= 4 && !this.isShowAll){
					//当图书数量大于等于 4 本时，并且显示全部按钮为收起状态时，取出前三本书展示
					for (let i = 0; i < 3; i++) {
						arr.push(req[i])
					}
					return arr.map(item => '《' + item + '》').join(' ')
				}else if(len >= 4 && this.isShowAll){
					//当图书数量大于等于 4 本时，并且显示全部按钮为展开状态时，展示全部书籍
					return req.map(item => '《' + item + '》').join(' ')
				}
			},
			handleClick(){
				//切换`更多`按钮的显示
				this.isShowAll = !this.isShowAll;
			}
		},
	}
</script>

<style scoped>
	.el-col {
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.847058823529412);
	}
	.el-col span{
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.647058823529412);
	}
	span.fontCls{
		color: #1856FF;
		font-size: 14px;
		cursor: pointer;
	}
</style>
