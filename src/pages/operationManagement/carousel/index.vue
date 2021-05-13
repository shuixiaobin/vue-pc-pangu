<template>
  <div class="carousel">
    <menu-title>
      <template #btn>
        <el-button @click="addCarousel(0)" v-auth="'ADM_ADD'" size="small" type="primary">增加一个轮播广告</el-button>
      </template>
    </menu-title>
    <div class="category">
      <span
        class="category-item"
        :class="{ 'category-item-active': activeCategory === item.id }"
        v-for="item in categoryList"
        :key="item.id"
        @click="changeCategory(item.id)"
      >
        {{ item.name }}
      </span>
    </div>
    <div class="container">
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        class="tableFixedBug"
      >
        <el-table-column label="排序" width="60">
          <template slot-scope="scope">
            <el-input type="number" :min="1" v-model.number="scope.row.sort" @blur="changeSort(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="activeUrl" label="活动链接"></el-table-column>
        <el-table-column prop="ImgUrl" label="图片链接"></el-table-column>
        <el-table-column prop="decribe" label="文字描述(title属性)"></el-table-column>
        <el-table-column label="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <el-button type="text" v-auth="'ADM_EDIT'" size="small" @click="addCarousel(1,scope.row)">修改</el-button>
            <!-- 0下线1上线 -->
            <el-button
              type="text"
              size="small"
              v-auth="'ADM_CHECK'"
              @click="changeStatus(scope.row)"
              v-if="scope.row.status == 0"
              >审核</el-button>
              <el-button
              type="text"
              size="small"
              v-auth="'ADM_OFFLINE'"
              @click="changeStatus(scope.row)"
              v-else
              >下线</el-button>
            <el-button type="text" size="small" v-auth="'ADM_DELETE'" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="clear-cache" v-if="tableData.length > 0">
        <el-button type="primary" v-auth="'ADM_CLEAR'" @click="clearCache">清除缓存</el-button>
        <span>后首页轮播图即时更新</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as operationManagement from '../../../api/operationManagement'
import axios from 'axios'
export default {
  name: "carousel",
  data() {
    return {
      categoryObj: {},
      categoryList: [],
      activeCategory: '',
      tableData:[]
    };
  },
  activated(){
    this.getCategoryList()
  },
  methods: {
    async getCategoryList() {
      try {
        const { data } = await operationManagement.getCategoryList()
        this.categoryObj = data
        let res =[]
        for (const key in data) {
          res.push({
            id:key,
            name: data[key]
          })
        } 
        this.categoryList = res
        this.refresh()
      } catch (error) {
        console.log(error);
      }
    },
    async getlistData(cateId) {
      try {
        const res = await operationManagement.getTableList({cateId})
        this.tableData = res.data
      } catch (error) {
        console.log(error);
      }
    },
    changeCategory(id) {
      this.activeCategory = id
      this.getlistData(id)
    },
    addCarousel(addFlag,row = {}) {
      const { id } = row
      let queryObj = {}
      if (addFlag) {
        // 修改
        queryObj = {
          id,
          addFlag,
          cateId: this.activeCategory
        }
      } else {
        queryObj = {
          addFlag, 
          cateName: this.categoryObj[this.activeCategory],
          cateId: this.activeCategory 
        }
      }
      this.$router.push({ 
        path: '/operationManagement/carouselAdd',
        query: queryObj 
      })
    },
    refresh () {
      this.activeCategory = this.activeCategory ? this.activeCategory : this.categoryList[0].id 
      this.getlistData(this.activeCategory)
    },
    changeSort(row) {
      this.updateStatusOrDelCarousel(row,'sort')
    },
    changeStatus(row) {
      if (this.tableData.length === 1) {
        this.$message.error('仅剩一张在线广告，不可下线或删除')
        return false
      }
      this.updateStatusOrDelCarousel(row,'status')
    },
    del(row) {
      if (this.tableData.length === 1) {
        this.$message.error('仅剩一张在线广告，不可下线或删除')
        return false
      }
      this.$confirm('确定要删除该轮播广告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateStatusOrDelCarousel(row,'del')
        })
        .catch(err => {})
    },
    updateStatusOrDelCarousel(row,type) {
      const params = {
        id: row.id
      }
      let text = ''
      if (type === 'del') {
        params.del = 1
        text = '删除成功'
      } else if (type === 'status') {
        params.status = row.status == 0 ? 1 : 0
        text = row.status == 0 ? '审核成功' : '下线成功'
      } else {
        params.sort = row.sort
        text = '排序修改成功'
      }
      operationManagement.updateStatusOrDelCarousel({...params}).then(res => {
        if (res.code === 10000) {
          this.$message.success(text)
          setTimeout(() => {
            this.refresh()
          }, 1000);
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    clearCache() {
      const statusArr = this.tableData.map(item => item.status + '')
      let filterStatus = []
      statusArr.forEach(item => {
        if (!filterStatus.includes(item)) {
          filterStatus.push(item)
        }
      })
      // 去重后只有一种状态且为0，说明全部是下线状态，不能清除缓存
      if (filterStatus.length === 1 && filterStatus[0] == '0') {
        this.$message.warning('当前分类下轮播广告全部为下线状态，请审核上线后再操作')
        return false
      }
      // 反之只要存在状态为1的就可以清除缓存
      axios.get(`${CLEAR_CACHE}pack/indexHome.php`,{params: {
        action: 'getBanner',
        cateId: this.activeCategory
      }}).then(res=>{
        if (res.data == 1) {
          this.$message.success('清除缓存成功')
        } else {
          this.$message.error('清除缓存失败')
        }
      })
    }
  },
};
</script>

<style scoped lang="less">
.carousel {
  .category {
    margin: 10px 0;
    &-item {
      cursor: pointer;
      display: inline-block;
      min-width: 80px;
      padding: 0 5px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #000;
      border-right: 0;
      text-align: center;
      &:nth-last-child(1) {
        border-right: 1px solid #000;
      }
      &-active {
        background: #1856ff;
        color: #fff;
      }
    }
  }
  /deep/.el-table__row .el-input__inner {
    text-align: center;
    padding: 5px;
  }
  .clear-cache {
    margin-top: 10px;
    text-align: center
  }
}
</style>