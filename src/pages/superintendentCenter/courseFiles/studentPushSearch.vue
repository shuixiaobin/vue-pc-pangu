<template>
	<!-- push推送查询 -->
	<div>
		<div>
			<p class="font14">发送时间</p>
			<div style="margin-top: 10px;">
				<el-radio v-model="pushType" label="1">立即推送</el-radio>
				<el-radio v-model="pushType" label="2">定时推送</el-radio>
				<el-tooltip 
					class="item" 
					effect="dark" 
					content="定时时间: 发送时间只能设置当前时间3分钟以后的时间,并且定时任务不能超过一年。" 
					placement="right"
				>
					<span class="prompt">?</span>
				</el-tooltip>
			</div>
			<el-date-picker 
				class="mt16" 
				size="small" 
				v-show="pushType == 2" 
				v-model="pushTime" 
				type="datetime" 
				placeholder="选择日期时间"
			>
			</el-date-picker>
		</div>
		
		<div class="mt30">
			<p class="font14">通知标题</p>
			<el-input 
				size="small" 
				style="margin-top: 10px;width: 700px;" 
				v-model="title" 
				placeholder="不得超过50字" 
				maxlength="50"
			></el-input>
		</div>
		
		<div class="mt30">
			<p class="font14">通知内容</p>
			<el-input 
				size="small" 
				type="textarea" 
				style="margin-top: 10px;width: 700px;" 
				:rows="3" 
				placeholder="不得超过100字"
				v-model="content" maxlength="100"
			>
			</el-input>
		</div>
		
		<div class="mt30" style="text-align: center;">
			<el-button size="small">取消</el-button>
			<el-button size="small" type="primary" @click="handleClick" v-auth="'CF_PUSH_SUBMIT'">提交</el-button>
		</div>
		
	</div>
</template>

<script>
	import Util from '@/common/util'
	export default{
		data(){
			return {
				pushType: '1',
				pushTime: '',
				title: '',
				content: '',
			}
		},
		methods:{
			handleClick(){
				if(!this.title || !this.content){
					this.$message.error('请填写完整的内容')
					return;
				}
				if(this.pushType == 2 && !this.pushTime){
					this.$message.error('请填写完整的内容')
					return;
				}
				
				const obj = {
					pushType: this.pushType,
					title: this.title,
					content: this.content
				}
				if(this.pushType == 2){ // 定时推动
					const timestamp = this.pushTime.getTime();
					const nowDateTime = new Date().getTime();
					if(timestamp <= nowDateTime){
						// 定时推送的时间小于当前时间，则不能推送
						this.$message.error('推送时间不能早于当前时间')
						return;
					}
					
					obj.pushTime = Util.formatTime2(this.pushTime);
					this.$emit('search', obj)
				}else if(this.pushType == 1){ // 立即推送
					this.$emit('search', obj)
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.font14 {
		font-size: 14px;
	}
	
	.mt30 {
		margin-top: 30px;
	}
	
	.prompt {
		width: 13px;
		height: 13px;
		font-size: 12px;
		line-height: 13px;
		text-align: center;
		border: 1px solid #ccc;
		display: inline-block;
		cursor: pointer;
	}
</style>
