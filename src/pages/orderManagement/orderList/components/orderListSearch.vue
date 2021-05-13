<template>
  <div>
    <el-form
      size="small"
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
    >
      <!-- <el-form-item style="display: block;" label="订单类型">
				<el-select
				  v-model="formInline.orderType"
				  size="small"
					@change="handleChange"
				>
					<el-option label="会员订单" value="1"></el-option>
					<el-option label="课程订单" value="2"></el-option>
				</el-select>
			</el-form-item> -->
		
			<!-- 课程订单 -->
			<template v-if="formInline.orderType == '2'">
				<el-form-item>
				  <el-select
				    v-model="formInline.singleField"
				    placeholder="订单编号"
				    size="small"
				    @change="clearKeyword"
				  >
				    <el-option
				      :label="item.label"
				      :value="item.value"
				      :key="item.value"
				      v-for="item in SelectOptions.singleField"
				    ></el-option>
				  </el-select>
				</el-form-item>
				<el-form-item>
				  <el-input
				    v-model="formInline.Keyword"
				    size="small"
				    style="width:300px;"
				  ></el-input>
				</el-form-item>
			</template>
			
			<!-- 会员订单 -->
			<template v-if="formInline.orderType == '1'">
				<el-form-item>
				  <el-select
				    v-model="formInline.vipSingleField"
				    size="small"
				    @change="clearKeyword"
				  >
						<el-option label="联系电话" value="1"></el-option>
						<el-option label="订单编号" value="2"></el-option>
						<el-option label="用户名" value="3"></el-option>
						<el-option label="邮箱" value="4"></el-option>
				  </el-select>
				</el-form-item>
				<el-form-item>
				  <el-input
				    v-model="formInline.vipKeyword"
				    size="small"
				    style="width:300px;"
				  ></el-input>
				</el-form-item>
			</template>
      
			<el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          size="small"
          v-auth="'OL_FIND'"
        >查询</el-button>
      </el-form-item>
      <el-form-item v-if="formInline.orderType == '2'">
        <el-checkbox v-model="formInline.ShowzeroPrice1" true-label="on" false-label="">显示0元订单</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formInline: {
					orderType: '2',
          singleField:'OrderNum',
          Keyword:'',
					vipSingleField: '1',
					vipKeyword:'',
          ShowzeroPrice1:'',
          type: 1, //单条件搜索
          includeClass: 0 //包含套餐内课程的销售数据
        },
        isShowMultiSearch: false
      };
    },
    props: ['SelectOptions'],
		// mounted() {
		// 	this.handleChange()
		// },
    methods: {
      clearKeyword(){
        this.formInline.Keyword='';
        this.formInline.vipKeyword='';
      },
      onSubmit() {
        this.$emit('search', this.formInline);
      },
			handleChange(){
				this.$emit('selectChange', this.formInline.orderType);
			}
    }
  };
</script>