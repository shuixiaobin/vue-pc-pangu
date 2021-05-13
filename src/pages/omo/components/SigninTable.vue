<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
  >
    <el-table-column
      prop="userName"
      label="用户名"
    >
    </el-table-column>
    <el-table-column
      prop="realName"
      label="真实姓名"
    >
    </el-table-column>
    <el-table-column
      prop="phoneNum"
      label="手机号"
    >
    </el-table-column>
    <el-table-column
      width="80"
      prop="lateCount"
      label="迟到次数"
    >
    </el-table-column>
    <el-table-column
      width="80"
      prop="absentCount"
      label="缺勤次数"
    >
    </el-table-column>
    <el-table-column label="签到记录">
      <template slot-scope="scope">
        <div
          class="btn-wrapper"
          v-for="(item, index) in scope.row.signSimpleInfo"
          :key="index"
        >
          <el-popover
            placement="right"
            width="200"
            v-if="item.status===1"
            trigger="hover"
            :content="item.position"
          >
            <el-button
              size="mini"
              type="success"
              slot="reference"
            >{{item.time | formatTime}}</el-button>
          </el-popover>
          <el-popover
            placement="right"
            width="200"
            v-if="item.status===2"
            trigger="hover"
            :content="item.position"
          >
            <el-button
              size="mini"
              type="warning"
              slot="reference"
            >{{item.time | formatTime}}</el-button>
          </el-popover>
          <el-button
            size="mini"
            v-if="item.status===0"
            slot="reference"
          >{{item.statusName}}</el-button>
          <el-button
            size="mini"
            type="danger"
            slot="reference"
            v-if="item.status===3"
          >{{item.statusName}}</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      tableData: Array,
    },
    filters: {
      formatTime(val) {
        let date = new Date(val)
        let h = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`
        let m = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
        let s = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`
        return `${h}:${m}:${s}`
      },
    },
  }
</script>
<style lang='less' scoped>
  .btn-wrapper {
    display: inline-block;
    margin-right: 5px;
  }
</style>