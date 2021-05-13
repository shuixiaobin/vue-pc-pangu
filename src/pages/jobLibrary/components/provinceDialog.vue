<template>
  <el-dialog
    :visible="true"
    width="40%"
    :before-close="handleClose"
    center
  >
    <div class="title">
      省份排序
      <el-select
        v-model="year"
        placeholder="请选择"
        size="mini"
        class="select"
        @change="getProvince"
      >
        <el-option
          v-for="item in years"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <draggable
      v-model="areas"
      group="people"
      @start="drag=true"
      @end="handleEnd"
      class="draggable"
    >
      <div
        v-for="item in areas"
        :key="item.id"
        class="area"
      >{{item.name}}</div>
    </draggable>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        type="primary"
        @click="sureProvinceSort"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import draggable from 'vuedraggable'
  import { getYears, getProvince, provinceSort } from '../api.js'
  export default {
    props: ['dialogVisible'],
    data() {
      return {
        years: [],
        year: '',
        areas: []
      }
    },
    components: {
      draggable
    },
    created() {
      this.getYears() //查询可用年份
    },
    methods: {
      getYears() {
        getYears()
          .then(res => {
            if (res.code === 200) {
              this.years = res.data
              let curFullYear = new Date().getFullYear()
              this.year = this.years.filter(item => item === curFullYear)[0]
              this.getProvince(this.year)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getProvince(val) {
        getProvince({ year: val })
          .then(res => {
            if (res.code === 200) {
              this.areas = res.data
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      handleClose() {
        this.$emit('update:dialogVisible', false)
      },
      handleEnd() {
        this.drag = false
      },
      sureProvinceSort() {
        this.$confirm('排序已调整，是否确定？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        })
          .then(() => {
            let sortList = this.areas.map((item, index) => {
              return {
                id: item.id,
                sort: index + 1
              }
            })
            provinceSort({ sortList })
              .then(res => {
                if (res.code === 200) {
                  this.$message.success('移动成功')
                }
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消排序'
            })
          })
      }
    }
  }
</script>
<style lang='less' scoped>
  .title {
    padding-bottom: 20px;
    text-align: center;
    font-size: 16px;
    .select {
      width: 100px;
      margin-left: 20px;
    }
  }
  .area {
    border: 1px solid #999;
    border-bottom: none;
    text-align: center;
    padding: 10px 0;
    &:last-child {
      border-bottom: 1px solid #666;
    }
  }
  .draggable {
    cursor: pointer;
  }
</style>