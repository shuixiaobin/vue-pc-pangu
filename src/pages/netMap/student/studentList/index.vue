<template>
  <div class="student-list">
    <MenuTitle />
    <div class="container">
      <div class="inline-wrapper">
        <el-select
          style="width:100px"
          v-model="selectType"
          size="small"
          placeholder="请选择"
          @change="handleChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-if="selectType===1"
          size="small"
          style="width:240px"
          v-model="phoneNum"
          type="number"
          placeholder="请输入手机号"
        ></el-input>
        <el-input
          v-if="selectType===2"
          size="small"
          style="width:240px"
          v-model="username"
          placeholder="请输入用户名"
        ></el-input>
        <el-button
          size="small"
          style="margin-left:18px"
          type="primary"
          v-auth="'SL_DETAIL'"
          @click="handleSearch"
        >查询</el-button>
        <el-button
          size="small"
          style="margin-left:18px"
          @click="handleReset"
        >重置</el-button>
      </div>
      <div class="search-content">
        <no-data v-if="isfirst || !hasData">
          <template #icon>
            <i
              :class="[isfirst ? 'icontheme-nonepage-1' : 'icontheme-nonepage-2']"
              class="iconfont "
            ></i>
          </template>
          <template #desc>
            <p class="desc">{{isfirst ? '请输入学员手机号或用户名开始查找吧' : '未找到该学员'}}</p>
          </template>
        </no-data>
        <StudentListTable
          v-if="listData.length > 0"
          :list-data="listData"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { getStudentList } from '@/api/netMap'
  import NoData from '../components/NoData'
  import StudentListTable from './components/StudentListTable'
  export default {
    components: {
      NoData,
      StudentListTable,
    },
    data() {
      return {
        isfirst: true, //是否是第一次进入
        selectType: 1,
        hasData: true,
        listData: [],
        options: [
          {
            label: '手机号',
            value: 1,
          },
          {
            label: '用户名',
            value: 2,
          },
        ],
        phoneNum: '',
        username: '',
      }
    },

    methods: {
      async getStudentList() {
        try {
          const { data = [] } = await getStudentList({
            userName: this.username,
            mobile: this.phoneNum,
          })
          if (data.length > 0) {
            this.hasData = true
            this.listData = data
          } else {
            this.hasData = false
            this.listData = data
          }
        } catch (error) {
          console.log(error)
        }
      },
      handleChange(val) {
        switch (val) {
          case 1:
            this.username = ''
            break
          case 2:
            this.phoneNum = ''
            break
        }
      },
      handleReset() {
        this.username = ''
        this.phoneNum = ''
      },

      handleSearch() {
        if (!this.username && !this.phoneNum) {
          this.$message.warning('请输入手机号或用户名查询')
          return
        }
        this.getStudentList()
        if (this.isfirst) {
          this.isfirst = false
        }
      },
    },
  }
</script>
<style lang='less' scoped>
  .student-list {
    .netmap-container {
      background: #fff;
      box-sizing: border-box;
    }
  }
</style>