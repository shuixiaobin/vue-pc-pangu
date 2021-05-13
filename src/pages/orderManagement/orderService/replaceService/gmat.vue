<template>
	<div>
		<!-- 代报名 -->
		<el-form 
			:model="ruleForm" 
			:rules="rules" 
			ref="ruleForm" 
			label-width="190px" 
			class="demo-ruleForm elForm"
			required
		>
		
			<el-form-item label="关联课程:" prop="isRelatedCourse">
				<el-button type="primary" @click="keyCourse" size="small">关联课程</el-button>
			</el-form-item>
			
			<el-table 
				:data="relatedCourses" 
				style="width: 100%" 
				show-summary
				sum-text="课程金额总计"
				:summary-method="summaryMethod"
				v-if="relatedCourses.length > 0"
			>
				<el-table-column property="courseId" label="课程ID" width="120"></el-table-column>
				<el-table-column property="classNo" label="课程编号" width="250"></el-table-column>
				<el-table-column property="title" label="课程名称" width="380" #default='{row}'>
					<div v-if="row.branchSchoolName">{{row.title}}-{{row.branchSchoolName}}</div>
					<div v-else>{{row.title}}</div>
				</el-table-column>
				<el-table-column property="actualPrice" label="价格" width="100" #default='{row}'>
					<span>￥{{row.actualPrice}}</span>
				</el-table-column>
			</el-table>
			
			<el-form-item label="选择所属网站:" prop="website">
				<el-select v-model="ruleForm.website" placeholder="请选择所属网站">
					<el-option label="华图网校" value="1"></el-option>
				</el-select>
			</el-form-item>
			
			<el-form-item label="是否需要用户确认付款: " prop="need_make_sure">
				<el-radio-group v-model="ruleForm.need_make_sure">
					<el-radio label="1">是</el-radio>
					<el-radio label="0">否</el-radio>
				</el-radio-group>
			</el-form-item>
			
			<el-form-item label="用户账号:" prop="userAccount">
				<el-col :span="8">
					<el-input 
						v-model="ruleForm.userAccount" 
						placeholder="请输入"
						@change="requestData"
					></el-input>
				</el-col>
				<span class="text-err" v-if="ruleForm.userInfoCheck">抱歉! 没有找到该用户的信息, 请检查</span>
		  </el-form-item>
		
			<el-form-item label="用户电话:" prop="userPhone">
				<el-col :span="8">
					<el-input v-model="ruleForm.userPhone" placeholder="请输入"></el-input>
					<p class="text">联系人电话及邮箱任选填写,为方便后期维护请尽量全部填写</p>
				</el-col>
			</el-form-item>
			
			<el-form-item label="实收金额:" prop="receipt_money">
				<el-col :span="8">
					<el-input v-model="ruleForm.receipt_money" placeholder="请输入"></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="所属地区:" prop="areaID">
				<el-select 
					v-model="ruleForm.provinceID" 
					placeholder="请选择所属省份" 
					@change="selectCity"
				>
					<el-option
						v-for="(item, key) in ruleForm.siteList.province"
						:key="item.id"
						:label="item.province"
						:value="item.provinceID"
					></el-option>
				</el-select>
				<el-select v-model="ruleForm.cityID" placeholder="请选择所属城市" @change="selectArea">
					<el-option
						v-for="(item, key) in ruleForm.siteList.city"
						:key="item.id"
						:label="item.city"
						:value="item.cityID"
					></el-option>
				</el-select>
				<el-select v-model="ruleForm.areaID" placeholder="请选择所属地区" @change="getAreaName">
					<el-option
						v-for="(item, key) in ruleForm.siteList.area"
						:key="item.id"
						:label="item.area"
						:value="item.areaID"
					></el-option>
				</el-select>
			</el-form-item>
		
			<el-form-item label="用户地址:" prop="address">
				<el-col :span="8">
					<el-input v-model="ruleForm.address" placeholder="请输入"></el-input>
				</el-col>
			</el-form-item>
		
			<el-form-item label="代报名原因: " prop="cause">
				<el-select v-model="ruleForm.cause" placeholder="请选择代报名原因">
					<el-option label="平台优惠活动原因" value="平台优惠活动原因"></el-option>
					<el-option label="直播优惠活动原因" value="直播优惠活动原因"></el-option>
					<el-option label="其他" value="其他"></el-option>
				</el-select>
			</el-form-item>
		
			<el-form-item label="备注: " prop="note">
				<el-col :span="8">
					<el-input 
						type="textarea" 
						v-model="ruleForm.note" 
						placeholder="请输入" 
						cols="20" 
						rows="3"
					>
					</el-input>
					<p class="text">请注明代报名原因</p>
				</el-col>
			</el-form-item>

			<el-form-item label="用户姓名:">
				<el-col :span="8">
					<el-input v-model="ruleForm.userReName" placeholder="请输入"></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="用户邮箱:" prop="UserEmail">
				<el-col :span="8">
					<el-input v-model="ruleForm.UserEmail" placeholder="请输入"></el-input>
				</el-col>
			</el-form-item>
		
			<el-form-item label="选择学习结束时间:">
				<el-col :span="8">
					<el-date-picker
						v-model="ruleForm.endTime"
						type="date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd"
					>
					</el-date-picker>		
					<p class="text">用于设定代报名用户听课的结束时间</p>
				</el-col>
			</el-form-item>
		
			<el-form-item label="发票:">
				<div style="display: flex;">
					<template>
					  <el-checkbox
							v-model="ruleForm.checked" 
							label="1" 
						>是否需要发票&#12288;&#12288;&#12288;</el-checkbox>
					</template>
					<el-col :span="8">
						<el-input 
							v-model="ruleForm.invoiceTitle" 
							placeholder="请输入发票抬头"
							:disabled="ruleForm.checked == false"
						></el-input>
					</el-col>
				</div>
			</el-form-item>
		
			<el-form-item label="付款方式">
				<el-select v-model="ruleForm.paymentMethod" placeholder="请选择" @change="payMethod">
					<el-option label="学员支付" value="1"></el-option>
					<el-option label="苹果支付" value="35"></el-option>
				</el-select>
			</el-form-item>
			
			<el-form-item label="管理员账户余额:">
				<el-col :span="4">
					<el-input disabled='disabled' v-model="ruleForm.userMoney"></el-input>
				</el-col>
				<span 
					class="refreshClass"
					@click="refresh"
				>刷新余额</span>
			</el-form-item>
			
			<!-- <div style="color: #606266;">电子协议信息</div>
			
			<el-form-item label="预支付培训费（小写）:">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.yzfpxfXX" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="预支付培训费（大写）:">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.yzfpxfDX" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="补交培训费原价（小写）:">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.bjpxfyjXX" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="补交培训费原价（大写）:">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.bjpxfyjDX" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="补交培训费优惠价（小写）:">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.bjpxfyhjXX" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="补交培训费优惠价（大写）:">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.bjpxfyhjDX" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="线上课时费:">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.onlineClassFees" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="每日客单价金额:">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.dailyGuestRate" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="学习要求">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.studyRequirement" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="自定义01">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.CustomOne" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="自定义02">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.CustomTwo" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="自定义03">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.CustomThree" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="自定义04">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.CustomFour" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="自定义05">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.CustomFive" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			
			<el-form-item label="自定义06">
				<el-col :span="8" class="position">
					<el-input maxlength="50" v-model="ruleForm.CustomSix" placeholder="请输入值" show-word-limit></el-input>
				</el-col>
			</el-form-item> -->
			
			<el-form-item>
				<el-button 
					type="primary" 
					size="small" 
					@click="submitForm('ruleForm')"
					:disabled="ruleForm.userInfoCheck"
					v-auth="'RS_SUBMIT'"
				>提交</el-button>
				<el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
	
		</el-form>
		
		<!-- 关联课程组件 -->
		<relatedCourse
			ref="course"
			@submitCourse="submitCourse"
		/>
	
	</div>
</template>

<script>
	import * as orderManage from '@/api/orderManage.js'
	import relatedCourse from './relatedCourses.vue'
	import { mapState } from 'vuex'
 	export default{
		data(){
			return {
				ruleForm: {
					comeUrl: '', //用户来源
					UserMoneyCard: '', //用户学习卡金额
					userId: '', //用户id
					website: '1', //所属网站
					need_make_sure: "1", //是否需要用户确认
					userAccount: '', //用户账号
					userPhone: '', //用户电话
					receipt_money: '', //实收金额
					siteList: {//地址列表
						province: []
					}, 
					provinceID: '',//省份id
					cityID: '', //城市id
					areaID: '', //地区id
					province: '',//省份
					city: '', //城市
					area: '', //地区
					address: '', //用户地址
					cause: '', //代报名原因
					note: '', //备注
					userReName: '', //用户性名
					UserEmail: '', //用户邮箱
					endTime: '', //用户学习结束时间
					checked: '', //是否需要发票
					invoiceTitle: '', //发票抬头
					paymentMethod: '1', //付款方式
					userMoney: '', //管理员账户余额
					isRelatedCourse: '', //是否有关联课程
					disabled: true, //管理员账户余额
					userInfoCheck: false, //用于判断用户账号是否正确
					yzfpxfXX: '', //预支付培训费（小写）
					yzfpxfDX: '', //预支付培训费（大写）
					bjpxfyjXX: '', //补交培训费原价（小写）
					bjpxfyjDX: '', //补交培训费原价（大写）
					bjpxfyhjXX: '', //补交培训费优惠价（小写）
					bjpxfyhjDX: '', //补交培训费优惠价（大写）
					onlineClassFees: '', //线上课时费
					dailyGuestRate: '', //每日客单价金额
					studyRequirement: '', //学习要求
					CustomOne: '', //自定义01 ~ 06
					CustomTwo: '', //自定义01 ~ 06
					CustomThree: '', //自定义01 ~ 06
					CustomFour: '', //自定义01 ~ 06
					CustomFive: '', //自定义01 ~ 06
					CustomSix: '', //自定义01 ~ 06
				},
				shortTimeUserMoney: '', //临时存储的学员金额变量
				shortTimeAdminMoney: '', //临时存储的管理员金额变量
				relatedCourses: [], //关联的课程列表
				rules: {
					isRelatedCourse: [{
						required: true,
						message: '请选择关联',
						// trigger: 'change'
					}],
					website: [{//选择所属网站
						required: true, 
						message: '请选择', 
						trigger: 'change',
					}], 
					need_make_sure: [{//选择所属网站
						required: true, 
						message: '请选择', 
						trigger: 'change',
					}], 
					userAccount: [{//用户账号
						required: true, 
						message: '请输入', 
						trigger: 'blur', 
						type: 'string',
					}], 
					userPhone: [{//用户电话
						required: true, 
						message: '请输入', 
						trigger: 'blur', 
						type: 'string',
					},{
						pattern: /^1\d{10}$/,
						message: '请输入正确格式的手机号',
						trigger: 'blur', 
					}], 
					receipt_money: [{//用户实收金额 
						required: true, 
						message: '请输入', 
						// trigger: 'blur', 
					}], 
					areaID: [{//所选地区
						required: true, 
						message: '请选择', 
						trigger: 'change',
					}], 
					address: [{ //用户地址
						required: true, 
						message: '请输入', 
						trigger: 'blur', 
						type: 'string',
					}],
					cause: [{//代报名原因
						required: true, 
						message: '请选择', 
						trigger: 'change',
					}], 
					note: [{//备注
						required: true, 
						message: '请输入', 
						trigger: 'blur', 
						type: 'string',
					}],
					UserEmail: [{ //邮箱校验
						pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
						message: '请输入正确的邮箱格式',
						trigger: 'blur'
					}]
				}
			}
		},
		components: {
			relatedCourse
		},
		computed: {
			...mapState(['username']),
		},
		mounted (){
			orderManage.getDictionaries({types: 'province'}) //请求省份
				.then(res => {
					this.ruleForm.siteList.province = res.data.province;
				})
				.catch(err => {
					this.$message.error(err)
				})
		},
		methods: {
			summaryMethod(){ //表尾合并行展示
				let str = 0;
				this.relatedCourses.forEach(item => {
					str += +item.actualPrice
				})
				//实收金额
				this.ruleForm.receipt_money = str;
				str = "￥" + str
				return ['课程金额总计: ', str]
			},
			submitCourse(val){ //子组件的关联过来的课程
				this.relatedCourses = val;
				this.relatedCourses.forEach(item => {
					if(item.goodsId.length > 1){
						const param = item.goodsId[1].split('$$')
						this.$set(item, 'branchSchoolName', param[1])
						this.$set(item, 'goodsId', param[0])
					}
				})
				
				this.ruleForm.isRelatedCourse = true;
				this.$refs['ruleForm'].clearValidate(['isRelatedCourse']); //清除关联课程的校验
			}, 
			keyCourse(formName) { //关联课程
				this.$refs.course.dialogTableVisible = true; 
			},
			selectCity(){ //选择城市
				let obj = {
					types: 'city', 
					ext_params: {
						"city":{"provinceId":this.ruleForm.provinceID},
					},
				}
				orderManage.getDictionaries(obj)
					.then(res => {
						this.$set(this.ruleForm.siteList, 'city', res.data.city)
					})
					.catch(err => {
						this.$message.error(err)
					})
					
				//得到省份的名字
				orderManage.getDictionaries({types: 'province'}) //请求省份
					.then(res => {
						res.data.province.forEach(item => {
							if(item.provinceID == this.ruleForm.provinceID){
								this.ruleForm.province = item.province;
							}
						})
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			selectArea(){ //选择地区
				let obj = {
					types: 'area', 
					ext_params: {
						"area":{"cityID":this.ruleForm.cityID},
					},
				}
				orderManage.getDictionaries(obj)
					.then(res => {
						this.$set(this.ruleForm.siteList, 'area', res.data.area)
					})
					.catch(err => {
						this.$message.error(err)
					})
					
				//得到城市的名字
				let req = {
					types: 'city', 
					ext_params: {
						"city":{"provinceId":this.ruleForm.provinceID},
					},
				}
				orderManage.getDictionaries(req)
					.then(res => {
						res.data.city.forEach(item => {
							if(item.cityID == this.ruleForm.cityID){
								this.ruleForm.city = item.city;
							}
						})
					})
					.catch(err => {
						this.$message.error(err)
					})	
			},
			getAreaName(){ //得到地区的名字
				let obj = {
					types: 'area', 
					ext_params: {
						"area":{"cityID":this.ruleForm.cityID},
					},
				}
				orderManage.getDictionaries(obj)
					.then(res => {
						res.data.area.forEach(item => {
							if(item.areaID == this.ruleForm.areaID){
								this.ruleForm.area = item.area;
							}
						})
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			requestData(){ //当用户账号文本框失去焦点时触发
				orderManage.getUserExit({userName: this.ruleForm.userAccount})
					.then(res => {
						if( !Array.isArray(res.data) ){
							this.ruleForm.comeUrl = res.data.comeUrl;//用户来源
							this.ruleForm.UserMoneyCard = res.data.UserMoneyCard; //用户学习卡金额
							this.ruleForm.userId = res.data.userId; //用户ID
							this.ruleForm.userPhone = res.data.userMobile; //用户电话
							this.ruleForm.userReName = res.data.userReName; //用户姓名
							this.ruleForm.UserEmail = res.data.UserEmail; //邮箱
							this.ruleForm.address = res.data.UserAddRess; //地址
							this.ruleForm.userMoney = res.data.userMoney; //管理员账户余额
							this.shortTimeUserMoney = res.data.userMoney; //临时存储变量
							this.ruleForm.userInfoCheck = false;//用于判断用户账号是否正确
						}else{
							this.ruleForm.userInfoCheck = true;
						}
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			payMethod(){ //付款余额
				// 如果是苹果支付,传入管理员账号
				if(this.ruleForm.paymentMethod == '35'){
					//请求过一次之后 缓存起来, 如果之前有结果,直接返回,不在重新请求
					if(this.shortTimeAdminMoney == ""){
						this.requestAdminBalance();
					}else{
						//再次切换,直接使用缓存的结果
						this.ruleForm.userMoney = this.shortTimeAdminMoney;
					}
				}else if(this.ruleForm.paymentMethod == '1'){
					this.ruleForm.userMoney = this.shortTimeUserMoney;
				}
			},
			refresh(){ //刷新余额
				if(this.ruleForm.paymentMethod == '35'){
					this.requestAdminBalance()
				}else if(this.ruleForm.paymentMethod == '1'){
					orderManage.getUserExit({userName: this.ruleForm.userAccount})
						.then(res => {
							this.ruleForm.userMoney = res.data.userMoney; //管理员账户余额
							this.shortTimeUserMoney = res.data.userMoney; //临时存储变量
						})
						.catch(err => {
							this.$message.error(err)
						})
				}
			},
			requestAdminBalance(){ //请求管理员余额
				orderManage.getAdminAccount({adminUser: this.$store.state.username})
					.then(res => {
						//请求回来数据,展示一份,缓存一份
						this.ruleForm.userMoney = res.data.adminMonye; 
						this.shortTimeAdminMoney = res.data.adminMonye;
					})
					.catch(err => {
						this.$message.error(err)
					})
			},
			resetForm(formName) { //重置
				this.$refs[formName].resetFields();
				const obj = {
					userReName: '',
					UserEmail: '',
					endTime: '',
					checked: '',
					invoiceTitle: '',
					paymentMethod: '0',
					userMoney: ''
				}
				for (let prop in obj) {
					this.$set(this.ruleForm, prop, obj[prop])
				}
			},
			submitForm(formName) {//提交
				this.$refs[formName].validate((valid) => {
					if (valid) {
						const ruleForm = this.ruleForm;
						let classId = '';
						let courseOrigin = "";
						let goodsId = {};
						this.relatedCourses.forEach(item => {
							classId += item.courseId + ',';
							courseOrigin += item.actualPrice;
							if(item.o2oType == 2 && item.goodsId){
								goodsId[item.courseId] = item.goodsId
							}
						})
						classId = classId.substring(0, classId.length - 1);
						const obj = {
							userName: ruleForm.userAccount, //代报名用户名
							classId: classId, //代报课程ID  多个用用逗号分隔
							siteFrom: ruleForm.website, //所属网站
							operUser: this.$store.state.username, //操作人
							actualPrice: ruleForm.receipt_money, //实收金额
							userMobile: ruleForm.userPhone, //用户手机号
							province: ruleForm.province, //省
							city: ruleForm.city, //市
							area: ruleForm.area, //区
							Address: ruleForm.address, //详细地址
							reason: ruleForm.cause, //代报名原因
							operRemark: ruleForm.note, //备注
							isConfirm: ruleForm.need_make_sure, //是否需要用户确认
							orderUserName: ruleForm.userReName, //代报人真实昵称
							paymentType: ruleForm.paymentMethod, //付款方式
							adminMoney: this.shortTimeAdminMoney, //管理员账户余额
							userId: ruleForm.userId, //用户id
							moneyTotal: courseOrigin, //所选课程原价金额和
							comeUrl: ruleForm.comeUrl, //用户来源
							UserMoney: this.shortTimeUserMoney, //用户账户金额
							UserMoneyCard: ruleForm.UserMoneyCard
						}
						if(ruleForm.endTime)obj.endTime = ruleForm.endTime;//用户学习结束时间
						if(ruleForm.UserEmail)obj.email = ruleForm.UserEmail;//邮箱
						if(ruleForm.checked){
							obj.needInvoice = 1; //是否需要发票
							obj.invoiceHead = ruleForm.invoiceTitle; //发票抬头
						}
						if(goodsId){
							obj.goodsId = JSON.stringify(goodsId);
						}
						orderManage.postRegistClassOrder(obj)
							.then(res => {
								if(res.code == 10000){
									this.$message.success('操作成功')
								}else{
									this.$message.error(res.data)
								}
							})
							.catch(err => {
								this.$message.error('操作失败,请检查后重新查询')
							})
						
					} else {
						return false;
					}
				});
			},
		}
	}
</script>

<style scoped="scoped">
	.elForm{
		margin-left: 100px;
		margin-bottom: 100px;
	}
	.elForm .el-form-item{
		margin: 20px 0px;
	}
	.refreshClass{
		color: rgb(24, 144, 255); 
		margin-left: 10px;
		cursor: pointer;
	}
	.text{
		color:#AAAAAA;
		font-family: 'ArialMT', 'Arial';
		font-weight: 400;
		font-style: normal;
		font-size: 13px;
		position: relative;
		top: -8px;
		white-space: nowrap;
	}
	.el-table::before {
		width: 0;
	}
	.text-err{
		position: relative;
		left: 20px;
		color: red;
		font-size: 13px;
	}
</style>