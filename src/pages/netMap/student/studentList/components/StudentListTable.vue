<template>
  <div class="student-list_table">
    <el-table
      :data="listData"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="userName"
        label="用户名"
      >
      </el-table-column>
      <el-table-column
        prop="userMobile"
        label="手机号"
      >
      </el-table-column>
      <el-table-column
        prop="followStatus"
        label="客户意向"
      >
      </el-table-column>
      <el-table-column
        prop="thisCallDate"
        label="最新跟进记录"
      >
      </el-table-column>
      <el-table-column
        prop="joinDate"
        label="注册时间"
      >
      </el-table-column>
      <el-table-column label="跟进次数">
        <template slot-scope="scope">
          {{scope.row.followCount}}次
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleLook(scope.row)"
            type="text"
            size="small"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      listData: {
        type: Array,
        defautl: () => [],
      },
    },

    data() {
      return {
        phoneShow: false,
      }
    },

    filters: {
      filterPhone(val) {
        return val.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
      },
    },

    methods: {
      togglePhone() {
        this.phoneShow = !this.phoneShow
      },
      handleLook({ userName, userMobile }) {
        this.$router.push({ name: 'studentDetail', query: { userName, userMobile } })
      },
    },
  }
</script>
<style lang='less' scoped>
  .student-list_table {
    margin-top: 16px;
    b {
      font-weight: normal;
    }
  }
</style>