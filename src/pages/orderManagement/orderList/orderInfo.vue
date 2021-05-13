<template>
  <div>
    <div class="container-title">
      <ul class="tabList">
        <li>订单详情</li>
      </ul>
      <el-button
        size="small"
        type="primary"
        @click="GoToList"
      >返回</el-button>
    </div>
    <div class="container">
      <el-row :gutter="17">
        <el-col
          :lg="16"
          :sm="24"
        >
          <div class="detailLayout mb16">
            <div class="detailLayout-title">
              <h2>基础信息</h2>
              <span>{{order.OrderNum}}</span>
            </div>
            <div class="detailLayout-container">
              <el-row>
                <el-col :span="12">
                  <label>渠道来源：</label>{{order.DomainName}}
                </el-col>
                <el-col :span="12">
                  <label>平台来源：</label>{{order.originName}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>支付渠道：</label>{{order.payName}}
                </el-col>
                <el-col :span="12">
                  <label>支付状态：</label><span v-if="Object.keys(order).length>0">{{order.statusName}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>下单时间：</label>{{order.AddTime}}
                </el-col>
                <el-col :span="12">
                  <label> 支付时间：</label>{{order.PayDate}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label> 实收金额：</label>{{order.MoneyReceipt}}元
                </el-col>
                <el-col :span="12">
                  <label> 发票状态：</label>{{order.invoicedStatus}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label> 物流状态：</label><span v-if="Object.keys(express_info).length>0">{{express_info.Status?'已收货':'已发货'}}</span>
                </el-col>
								<!-- <el-col :span="12">
									<span class="info-agreement" @click="infoDialogVisible = true">个人信息</span>
									<span class="info-agreement" @click="supplementVisible = true">补充信息</span>
								</el-col> -->
              </el-row>
							<!-- <el-row>
								<el-col :span="12">
									<label>协议：</label>
									<span class="info-agreement">
											:href=""
										<a 
											target="_blank"
										>
											{{treatyType == 1 ? '笔试' : (treatyType == 2 ? '面试' : '不存在')}}协议
											笔试协议
										</a>
									</span>
								</el-col>
								<el-col :span="12">
									<span @click="handleDownload" class="info-agreement">下载协议</span>
									<span class="info-agreement" @click="handleUpload">
										{{protocolUploadType == 2 ? '协议已签，无需上传' : '上传协议'}}
										上传协议
									</span>
									<div style="display: inline-block;"> 
										<el-upload
											style="display: inline-block;" 
											class="avatar-uploader"
											:action="actionUrl" 
											name="files" 
											:show-file-list="false" 
											:on-success="handleSuccess"
											:on-remove="handleRemove"
											:on-progress="handleProgress"
											:limit="1"
											ref="upload"
										>
											<el-button size="small">选择文件</el-button>
										</el-upload>
										<span v-if="selectFileName == '未选择任何文件'" class="info-selectFile">{{selectFileName}}</span>
										<div class="file-class" v-else>
											<span>上传图片</span><span>{{selectFileName}}</span>
											<i class="el-icon-circle-close" @click.stop="clearSelectFile"></i>
										</div>
									</div>
								</el-col>
							</el-row> -->
            </div>
          </div>
          <div class="detailLayout mb16">
            <div class="detailLayout-title">
              <h2>用户信息</h2>
            </div>
            <div class="detailLayout-container">
              <el-row>
                <el-col :span="12">
                  <label>用户id：</label>{{order.UserID}}
                </el-col>
                <el-col :span="12">
                  <label>用户名：</label>{{order.UserName}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>手机号：</label>
                  <telSHowHid
                    :tel="order.UserMobile"
                    v-if="order.UserMobile"
                  />
                </el-col>
                <el-col :span="12">
                  <label>邮箱：</label>{{order.Email}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label> 收件人：</label>{{order.ConSignee}}
                </el-col>
                <el-col :span="12">
                  <label> 收件电话：</label>
                  <telSHowHid
                    :tel="order.Phone"
                    v-if="order.Phone"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>地址：</label>{{consigneeAddress}}
                </el-col>
                <el-col :span="12">
                  <label>是否开票：</label>{{order.invoiceNeedDisplay}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>发票类型：</label>{{order.invoice_name}}
                </el-col>
                <el-col :span="12">
                  <label>发票抬头：</label>{{order.invoiceHeadDisplay}}
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="detailLayout mb16">
            <div class="detailLayout-title">
              <h2>班级信息</h2>
            </div>
            <div class="detailLayout-container">
              <el-table
                :data="class_info"
                border
                row-key="rid"
                default-expand-all
                :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
                style="width: 100%"
              >
                <el-table-column
                  label="课程标题"
                  prop="Title"
                  fixed="left"
                  width="300"
                >
                </el-table-column>
                <el-table-column label="课件进度">
                  <template slot-scope="scope">
                    {{scope.row.lesstion_count}}/{{scope.row.lessionCount}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="上线日期"
                  prop="StartDate"
                  width="200"
                >
                </el-table-column>
                <el-table-column
                  label="授课教师"
                  prop="TeacherDesc"
                >
                </el-table-column>
                <el-table-column label="原价">
                  <template slot-scope="scope">
                    &yen;{{scope.row.Price.toFixed(2)}}
                  </template>
                </el-table-column>
                <el-table-column label="优惠价">
                  <template slot-scope="scope">
                    &yen;{{scope.row.ActualPrice.toFixed(2)}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态"
                  prop="statusName"
                >
                </el-table-column>
                <el-table-column label="图书成本">
                  <template slot-scope="scope">
                    {{scope.row.book_cost/100}}
                  </template>
                </el-table-column>
                <el-table-column label="邮费成本">
                  <template slot-scope="scope">
                    {{scope.row.postage_cost/100}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="备注"
                  prop="remark"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="detailLayout mb16">
            <div class="detailLayout-title">
              <h2>图书信息</h2>
            </div>
            <div class="detailLayout-container">
              <el-row>
                <el-col :span="12">
                  <label>图书名称：</label><span v-if="Object.keys(express_info).length>0">{{express_info.Goods}}</span>
                </el-col>
                <el-col :span="12">
                  <label>发货状态：</label><span v-if="Object.keys(express_info).length>0">{{express_info.Status?'已收货':'已发货'}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>物流单号：</label><span v-if="Object.keys(express_info).length>0">{{express_info.ExpressNo}}</span>
                </el-col>
                <el-col :span="12">
                  <label>物流公司：</label>{{order.ExpressCorp}}
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="detailLayout mb16">
            <div class="detailLayout-title">
              <h2>支付信息</h2>
            </div>
            <div class="detailLayout-container">
              <el-row>
                <el-col :span="12">
                  <label>订单总金额：</label>{{order.MoneyTotal}}元
                </el-col>
                <el-col :span="12">
                  <label>图币支付：</label>{{order.MoneyStudyCard}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>现金支付：</label>{{order.MoneyReceipt}}元
                </el-col>
                <el-col :span="12">
                  <label>代金券：</label>{{order.MoneyFree}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>会员优惠：</label>{{order.Discount}}
                </el-col>
                <el-col :span="12">
                  <label>优惠券：</label>--
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <label>其他优惠：</label>{{order.otherDiscount}}
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col
          :lg="8"
          :sm="24"
        >
          <div class="detailLayout mb16">
            <div class="detailLayout-title">
              <h2>操作记录</h2>
            </div>
            <div class="detailLayout-container">
              <el-collapse
                v-model="activeName"
                accordion
                v-if="operate_log.length>0"
              >
                <el-collapse-item
                  :name="index"
                  v-for="(item,index) in operate_log"
                  :key="index"
                >
                  <template slot="title">
                    [{{item.operateDate}}] {{item.operateUserName?item.operateUserName:'--'}} {{item.remark}}
                  </template>
                  <div class="operateInfoBox">
                    <p>操作课程:{{item.operateClass}}</p>
                    <p>转入班级:{{item.transerClass}}</p>
                    <p>转退班金额:{{item.turnBackMoney}}</p>
                    <p>用户名:{{item.userName}}</p>
                    <p>上次订单状态:{{item.statusName}}</p>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <span v-else>暂无记录</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import telSHowHid from '../components/telShowHide';
  import { getOrderDetails } from '@/api/orderManage';
  export default {
    data() {
      return {
        OrderID: this.$route.query.OrderID,
        tabActiveName: 'ORDERINFO',
        order: {}, //订单信息
        express_info: {}, //物流信息
        class_info: [], //班级信息
        operate_log: [], // 操作记录
        activeName: 0 ,//操作记录
				order_ext: ''
      };
    },
    components: {
      telSHowHid
    },
    created() {
      this.getOrderDetails();
    },
		computed: {
			consigneeAddress(){
				const {DzProvince, DzCity, DzArea} = this.order_ext;
				return DzProvince + " " + DzCity + " " + DzArea + " " + this.order.Address
			}
		},
    methods: {
      getOrderDetails() {
        getOrderDetails({
          order_id: this.OrderID
        })
          .then(res => {
            if (res.code == 10000) {
              this.order = res.data.order;
              this.express_info = res.data.express_info;
              for (let key in res.data.class_info) {
                this.class_info.push(res.data.class_info[key]);
              }
              this.operate_log = res.data.operate_log;
							this.order_ext = res.data.order_ext;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      GoToList(){
        this.$router.push({ path: 'orderList'});
      }
    }
  };
</script>
<style lang="less" scoped>
  .container-title {
    height: 48px;
    border-bottom: 2px solid #e4e7ed;
    text-align:right;
  }
  .tabList {
    line-height: 48px;
    text-align:center;
    li {
      font-size: 14px;
      color: #1856ff;
      border-bottom: 2px solid #1856ff;
    }
  }
  .detailLayout-title {
    h2 {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
    span {
      font-size: 12px;
      font-weight: 400;
      color: #606266;
    }
  }
  .detailLayout-container {
    label {
      color: #606266;
    }
    .operateInfoBox {
      padding:5px;
      line-height:25px;
      background: #f6f6f6;
    }
  }
	.info-agreement{
		font-size: 14px;
		color: #00f;
		margin-right: 20px;
		cursor: pointer;
		white-space: nowrap;
	}
	.info-agreement:hover{
		text-decoration: underline;
	}
</style>
<style>
.detailLayout-container .el-collapse-item__header{
  padding:10px 0;
  height: auto;
  line-height:20px;
}
</style>