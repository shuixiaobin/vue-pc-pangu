<template>
  <div class="student-address">
    <div class="container-title">
      <h2>收货地址
        <span
          class="no-data"
          v-if="listData.length === 0"
        >暂无数据</span>
      </h2>
    </div>
    <div
      class="container"
      v-if="listData.length > 0"
    >
      <div
        class="address-item"
        v-for="(item, index) in listData"
        :key="index"
      >
        <span class="label-key">收货人：<b>{{item.consignee}}</b></span>
        <span
          class="label-key"
          style="margin-left:33px"
        >收货手机号：<b>{{item.phone}}</b></span>
        <div class="label-key_block">
          <span class="label-key">收货地址：</span>
          <p class="address">{{item.provinceName}}{{item.cityName}}{{item.areaName}}{{item.address}}<i
              v-if="index===0"
              class="default"
            >默认地址</i></p>
        </div>
      </div>
      <!-- <el-pagination
        style="display:flex;justify-content: center;margin-top: 20px;"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @current-change="currentChange"
      >
      </el-pagination> -->
      <el-pagination
        style="display:flex;justify-content: center;margin-top: 20px;"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getAddressList } from '@/api/netMap'
  import { pageMixin } from '../pageMixins'
  export default {
    mixins: [pageMixin],
    data() {
      return {
        userName: this.$route.query.userName,
        pageSize: 3
      }
    },
    methods: {
      async getListData() {
        try {
          const { data } = await getAddressList({
            page: this.page,
            pageSize: this.pageSize,
            userName: this.userName,
          })
          this.listData = Object.freeze(data.data)
          this.total = data.total
        } catch (err) {
          console.log(err)
        }
      },
    },
  }
</script>
<style lang='less' scoped>
  @import url('../../../../../assets/css/theme-color.less');
  .student-address {
    margin-top: 16px;
    background: #fff;
    .no-data {
      margin-left: 24px;
      height: 14px;
      font-size: 14px;
      font-weight: 500;
      color: #c0c4cc;
      line-height: 14px;
    }
    .address-item {
      margin-top: 8px;
      background: #f5f7fa;
      border-radius: 8px;
      padding: 10px 16px;
      box-sizing: border-box;
      &:first-child {
        margin-top: 0;
      }
      .label-key {
        font-size: 14px;
        color: #606266;
        line-height: 32px;
        b {
          color: #303133;
        }
      }
      .label-key_block {
        display: flex;
        .address {
          flex: 1;
          font-size: 14px;
          font-weight: 400;
          color: #303133;
          line-height: 32px;
          .default {
            font-style: normal;
            margin-left: 10px;
            color: @primary;
          }
        }
      }
    }
  }
</style>