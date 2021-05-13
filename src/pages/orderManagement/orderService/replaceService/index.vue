<template>
	<div class="module">
		<MenuTitle>
		</MenuTitle>

		<div class="container">
			<div style="display: flex;">
				<ul class="ulTitle">
					<li 
						v-for="(item, index) in content"
						:key="index"
						:class="{target: activeIndex === index && index < 2}"
						@click="handleClick(index)"
						v-auth="permissions(item)"
					>
						{{item.label}}
					</li>
				</ul>
				
				<el-dropdown trigger="click" @command="handleCommand" v-auth="'RS_SUBMIT'">
					<span class="el-dropdown-link">
						<span 
							:class="{target: subMenuIndex == '1' || subMenuIndex == '2'}"
							class="text"
						>批量代报名</span>
						<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="1">在线</el-dropdown-item>
						<el-dropdown-item command="2">分校</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				
				<el-dropdown trigger="click" @command="handleCommand" v-auth="'RS_SUBMIT'">
					<span class="el-dropdown-link">
						<span
							:class="{target: subMenuIndex == '3' || subMenuIndex == '4'}"
							class="text"
						>代报名关闭</span>
						<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="3">代报名关闭</el-dropdown-item>
						<el-dropdown-item command="4">批量代报名关闭</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			
			<!-- 0元赠送 -->
			<zeroGiving
				v-show="activeIndex === 0"
			/>
			
			<!-- 代报名 -->
			<gmat
				v-show="activeIndex === 1"
			/>
			
			<!-- 批量代报名 在线 -->
			<batchGmatOnline 
				v-show="subMenuIndex === '1'"
			/>
			
			<!-- 批量代报名 分校 -->
			<batchGmatFX
				v-show="subMenuIndex === '2'"
			/>
			
			<!-- 代报名关闭 -->
			<gmatClose
				v-show="subMenuIndex === '3'"
			/>
			
			<!-- 批量代报名关闭 -->
			<batchGmatClose 
				v-show="subMenuIndex === '4'"
			/>
			
		</div>

	</div>
</template>

<script>
	import gmat from './gmat.vue'
	import zeroGiving from './zeroGiving.vue'
	import batchGmatOnline from './batchGmatOnline.vue'
	import batchGmatFX from './batchGmatFX.vue'
	import gmatClose from './gmatClose.vue'
	import batchGmatClose from './batchGmatClose.vue'
	export default {
		data() {
			return {
				activeIndex: 0,  //切换一级菜单
				subMenuIndex: "", //切换二级菜单
				content: [
					{label: '0元赠课'},
					{label: '代报名'},
				],
				selectShow: false,
			};
		},
		components: {
			gmat,
			zeroGiving,
			batchGmatOnline,
			batchGmatFX,
			gmatClose,
			batchGmatClose
		},
		computed:{
			permissions(){
				return function (item){
					if(item.label == "0元赠课"){
						return 'RS_ZERO';
					}else if(item.label == "代报名"){
						return 'RS_SUBMIT';
					}
				}
			}
		},
		methods: {
			handleClick(index) { //点击非下拉菜单时
				//根据这两个属性决定哪个按钮展示被选中状态
				this.activeIndex = index;
				this.subMenuIndex = "";
			},
			handleCommand(index){ //点击下拉菜单时
				this.activeIndex = '';
				this.subMenuIndex = index;
			}
		}
	}
</script>

<style scoped="scoped">
	.ulTitle{
		display: flex;
	}
	.ulTitle li{
		margin-right: 40px;
		cursor: pointer;
	}
	.target{
		color: #1856FF !important;
		padding-bottom: 5px;
		border-bottom: 3px solid #1856FF !important;
	}
	.secondLabel{
		display: flex;
		flex-direction: column;
		position: absolute;
		background-color: #1856FF;
		margin-top: 15px;
		padding: 15px 35px;
		justify-content: center;
		align-items: center;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.secondLabel span{
		color: #000;
		padding-bottom: 10px;
	}
	.secondLabel span:hover{
		color: #1856FF;
	}
	.el-dropdown-link {
		cursor: pointer;
		color: #1856FF;
		margin-right: 40px;
	}
	.el-icon-arrow-down {
		font-size: 12px;
	}
	.demonstration {
		display: block;
		color: #8492a6;
		font-size: 14px;
		margin-bottom: 20px;
	}
	.text{
		color: #000000; 
		font-size: 15px; 
		line-height: 25px;
	}
</style>
