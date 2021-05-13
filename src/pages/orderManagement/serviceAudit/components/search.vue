<template>
  <div class="container-Box">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-width="130px"
    >
      <el-form-item
        :class="[serviceType!='behalf'?'wholeLineLayout':'wholeLineLayoutBehalf']"
        :label="serviceType!='behalf'?'':'订单开始时间：'"
      >
        <el-row type="flex">
          <el-col :span="22">
            <el-select
              v-model="dateType"
              placeholder="请选择"
              @change="handleChange"
              v-if="serviceType!='behalf'"
            >
              <el-option
                v-for="(item) in authDateType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-date-picker
              v-model="form.date"
              v-if="dateType===1"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <el-date-picker
              v-if="dateType===2"
              v-model="form.payTimeDate"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="订单编号：">
        <el-input
          v-model="form.orderNo"
          placeholder="请输入"
          style="width:250px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="考试类型："
        v-show="isDefaultShow&&serviceType!='behalf'"
      >
        <el-select
          v-model="form.catetype"
          placeholder="请选择"
          style="width:250px;"
        >
          <el-option
            v-for="(value,key) in cateInfo"
            :key="key"
            :label="value"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="是否协议班："
        v-show="isDefaultShow&&serviceType!='behalf'"
      >
        <el-select
          v-model="form.istreaty"
          placeholder="请选择"
          style="width:250px;"
        >
          <el-option
            v-for="item in treatyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="用户名："
        v-show="isDefaultShow"
      >
        <el-input
          v-model="form.userName"
          placeholder="请输入"
          style="width:250px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="手机号："
        v-show="isDefaultShow"
      >
        <el-input
          v-model="form.mobile"
          placeholder="请输入"
          style="width:250px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="收货人："
        v-show="isDefaultShow&&(!serviceType||serviceType==='behalf')"
      >
        <el-input
          v-model="form.consignee"
          placeholder="请输入"
          style="width:250px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="课程名称："
        v-show="isDefaultShow"
      >
        <el-input
          v-model="form.title"
          placeholder="请输入"
          style="width:250px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="课程ID："
        v-show="isDefaultShow"
      >
        <el-input
          v-model="form.classid"
          placeholder="请输入"
          style="width:250px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="操作员："
        v-show="isDefaultShow"
      >
        <el-input
          v-model="form.optUser"
          placeholder="请输入"
          style="width:250px;"
        ></el-input>
      </el-form-item>
      <el-form-item :label="isDefaultShow?' ':''">
        <el-button
          type="primary"
          @click="search"
        >查询</el-button>
        <el-button
          @click="reset"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <span
      :class="[isDefaultShow?'toggle-btn close':'toggle-btn open']"
      @click="isDefaultShow=!isDefaultShow"
    >{{isDefaultShow?'收起':'展开'}} <i
        class="iconfont"
        :class="[isDefaultShow?'iconshouqi':'iconzhankai']"
      ></i></span>
  </div>
</template>
<script>
  import util from '@/common/util'
  import { getDictionaries } from '@/api/orderManage'
  export default {
    data() {
      return {
        isDefaultShow: false,
        treatyOptions: [
          {
            label: '不选择',
            value: 1,
          },
          {
            label: '协议班',
            value: 2,
          },
          {
            label: '非协议班',
            value: 3,
          },
        ],
        authDateType: [
          {
            value: 1,
            label: '审核提交时间',
          },
          {
            value: 2,
            label: '付款时间',
          },
        ],
        cateInfo: {},
        dateType: 1,
        form: {
          date: [
            util.timeStampDate(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0)),
            util.timeStampDate(new Date().setHours(23, 59, 59, 59)),
          ],
          payTimeDate: '',
          orderNo: '', //订单号
          catetype: '', //考试类型id
          istreaty: 1, //是否是协议班:1代表默认不选择，2代表是,3代表否
          userName: '', //用户名
          mobile: '', //手机号
          title: '', //课程标题
          classid: '', //课程id
          optUser: '', //操作人
          consignee: '', //收货人
        },
      }
    },
    props: {
      serviceType: {
        type: String,
        default: null,
      },
    },
    created() {
      this.getenumType()
    },
    mounted() {
      if (this.$route.query.source === 'orderService') {
        this.search()
      }
    },
    methods: {
      getenumType() {
        getDictionaries({
          types: 'cateInfo',
        })
          .then(res => {
            if (res.code == 10000) {
              this.cateInfo = res.data.cateInfo
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      handleChange(val) {
        if (val === 2) {
          this.form.payTimeDate = [
            util.timeStampDate(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0)),
            util.timeStampDate(new Date().setHours(23, 59, 59, 59)),
          ]
        } else {
          this.form.payTimeDate = [
            util.timeStampDate(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0)),
            util.timeStampDate(new Date().setHours(23, 59, 59, 59)),
          ]
        }
      },
      openSearchItem() {
        this.isDefaultShow = !this.isDefaultShow
      },
      search() {
        //dateType === 1 审核提交时间 2 付款时间
        if (this.dateType === 1) {
          this.form.payTimeDate = ''
        } else {
          this.form.date = ''
        }
        let aTimeStart = this.form.date[0] ? this.form.date[0] : '';
        let aTimeEnd = this.form.date[1] ? this.form.date[1] : '';
        let payTimeStart = this.form.payTimeDate[0] ? this.form.payTimeDate[0] : '';
        let payTimeEnd = this.form.payTimeDate[1] ? this.form.payTimeDate[1] : '';
        let {date, payTimeDate , ...otherParams} = this.form
        const params = {...otherParams,aTimeStart,aTimeEnd,payTimeStart,payTimeEnd}
        this.$emit('search', params)
      },
      reset() {
        Object.assign(this.$data.form, this.$options.data().form)
      },
    },
  }
</script>
<style lang="less" >
  .wholeLineLayout {
    width: 100%;
    .el-form-item__content {
      width: 100%;
    }
    .fr {
      text-align: right;
    }
  }
  .wholeLineLayoutBehalf {
    width: 100%;
    .el-form-item__content {
      width: calc(100% - 130px);
    }
    .fr {
      text-align: right;
    }
  }
</style>