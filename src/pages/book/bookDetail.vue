<template>
  <div>
    <div class="container-title">
      <h2>图书详情</h2>
    </div>
    <div class="container">
      <div class="item">
        <span class="label">图书类型：</span>
        <div class="desc"> {{detail.bookType | filterBookType}}</div>
      </div>
      <div class="item">
        <span class="label">图书名称：</span>
        <div class="desc"> {{detail.bookName}}</div>
      </div>
      <div class="item">
        <span class="label">是否为图书套装：</span>
        <div class="desc">{{detail.isSuit | filterSuit}}</div>
      </div>
      <div class="item" v-show="detail.isSuit">
        <span class="label">关联图书：</span>
        <div class="desc">
          <img
            class="suitImg"
            v-for="(item, index) in detail.related"
            :key="index"
            :src="item.bookCover[0]"
            alt=""
          >
        </div>
      </div>
      <div class="item">
        <span class="label">适用考试类型及科目：</span>
        <div
          class="desc"
          v-for="(item, index) in detail.categoryAndSubjects"
          :key="index"
        > {{item}}</div>
      </div>
      <div class="item">
        <span class="label">图书封面：</span>
        <div class="desc">
          <div
            class="imgItem"
            v-for="(item, index) in detail.bookCover"
            :key="index"
          >
            <img
              :src="item"
              class="bookCover"
            ><span
              class="download"
              @click="downloadImg(item)"
            >下载原图</span></div>
        </div>
      </div>
      <div class="item">
        <span class="label">图书参数：</span>
        <div class="desc">
          <div class="descItem">
            图书售价：{{detail.actualPrice}} 元
          </div>
          <div class="descItem">
            图书原价：{{detail.price}} 元
          </div>
          <div class="descItem">
            出 版 社：{{detail.press}}
          </div>
          <div class="descItem">
            书号或自编码：{{detail.bookNum}}
          </div>
          <div class="descItem">
            总页数：{{detail.totalPage}} 页
          </div>
          <div class="descItem">
            重量：{{detail.weight}} kg
          </div>
          <div class="descItem">
            图书印张：{{detail.bookPrint}} 张
          </div>
          <div class="descItem">
            单本书成本：{{detail.singleCost}} 元
          </div>
        </div>
      </div>
      <div class="item">
        <span class="label">内容简介：</span>
        <div
          class="desc"
          v-html="detail.summary"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { bookDetail } from '@/api/bookApi'
  export default {
    data() {
      return {
        detail: {}
      }
    },
    filters: {
      filterBookType(val) {
        if (val === 0) {
          return '实物图书'
        }
      },
      filterSuit(val) {
        let str = ''
        switch (val) {
          case 0:
            str = '否'
            break
          case 1:
            str = '是'
            break
          default:
            str = ''
            break
        }
        return str
      }
    },
    mounted() {
      bookDetail({
        bookId: this.$route.query.id
      })
        .then(res => {
          this.detail = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    methods: {
      downloadImg(url) {
        window.open(url)
      }
    }
  }
</script>
<style lang='less' scoped>
  .title {
    border-left: 3px solid #3c8dbc;
    line-height: 2;
    text-indent: 24px;
  }
  .container {
    box-sizing: border-box;
    font-size: 14px;
    .item {
      display: flex;
      line-height: 4;
      .label {
        color: #000;
        width: 200px;
        text-align: right;
        flex-shrink: 0;
      }
      .desc {
        color: #666;
        margin-left: 20px;
        display: flex;
        flex-wrap: wrap;
        .descItem {
          width: 32%;
        }
        .suitImg {
          width: 128px;
          height: 128px;
        }
        .download {
          line-height: 2;
          text-align: center;
          display: block;
          width: 100%;
          color: #3399ff;
        }
        .bookCover {
          width: 128px;
          height: 128px;
          display: block;
        }
      }
    }
  }
</style>