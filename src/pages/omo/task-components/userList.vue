<template>
  <div>
    <div style="margin: 10px 0 30px;">{{ title }}</div>
    <el-table :data="tableData">
      <el-table-column prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column prop="realName"
        label="真实姓名"
        align="center">
      </el-table-column>
      <el-table-column prop="phoneNum"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column prop="submitTime"
        v-if="type !== 0"
        label="提交时间"
        align="center">
      </el-table-column>
      <el-table-column prop="cardStatus"
        align="center"
        label="批改状态">
        <template slot-scope="{row}">
          <div>
            {{statusName(row.cardStatus)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        v-if="type !== 0"
        align="center">
        <template slot-scope="{row}">
          <el-button size="small" v-if="row.cardStatus === 1" type="text" @click="correct(row)" class="serchLeft">批改</el-button>
          <el-button size="small" v-if="row.cardStatus === 2" type="text" @click="correct(row)" class="serchLeft">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 30px; text-align: center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { page } from '@/common/mixins'
import { getAnswerList } from '@/api/omoApi'
export default {
  props: ['type', 'title', 'id', 'courseId'],
  mixins: [ page ],
  data () {
    return {
      tableData: [],
    }
  },
  created () {
    this.pageSize = 20
    this.getList()
  },
  methods: {
    correct (d) {
      this.$emit('correct', d)
    },
    getList () {
      getAnswerList(this.id, {
        courseId: this.courseId,
        type: this.type,
        page: this.page,
        pageSize: this.pageSize,
      }).then(res => {
        if (res.code === 1000000) {
          this.tableData = res.data.result
          this.total = res.data.total
        } else {
          throw res
        }
      }).catch(e => this.$message.error(e.message))
    },
    statusName (status) {
      switch (status) {
        case 0: return '未完成'
        case 1: return '未批改'
        case 2: return '已批改'
      }
      return '未知'
    }
  }
}
</script>

<style scoped>

</style>
