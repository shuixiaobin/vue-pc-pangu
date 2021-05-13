<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="活动 id" align="center" width="70"/>
      <el-table-column prop="classId" label="课程id" align="center" width="70"/>
      <el-table-column prop="classTitle" label="课程名称" align="center" />
      <el-table-column prop="price" width="80px" label="原价" align="center" />
      <el-table-column prop="collagePrice" label="拼团价" width="80px;" align="center" />
      <el-table-column prop="beginAt" label="活动开始时间" width="100px;" align="center" />
      <el-table-column prop="endAt" label="活动结束时间" width="100px;" align="center" />
      <el-table-column prop="activityLength" label="成团有效时间(小时)" width="90px;" align="center" />
      <el-table-column prop="collagePeople" label="成团人数" width="60px;" align="center" />
      <el-table-column prop="startLimitType" label="拼团限制开团人" width="80px;" align="center">
        <template slot-scope="{row}">
          <div>{{ row.startLimitType | peopleFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="limitType" label="拼团限制参团人" width="80px;" align="center">
        <template slot-scope="{row}">
          <div>{{ row.limitType | peopleFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" width="80px;" label="活动状态" align="center">
        <template slot-scope="{row}">
          <div>{{ row.status | statusFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="robotStatus" label="虚拟机器人" width="70px;" align="center">
        <template slot-scope="{row}">
          <div>{{ row.robotStatus == 0 ? '关' : '开' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="allowCollage" label="拼团展示" width="60px;" align="center">
        <template slot-scope="{row}">
          <div>{{ row.allowCollage == 0 ? '关' : '开' }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100px">
        <template slot-scope="{row}">
          <div>
            <template v-if="row.status === 0">
              <el-button type="text" @click="edit(row)" v-auth="'PH_EDIT'">编辑</el-button>
              <el-button type="text" @click="changeStatus(row, 1)"  v-auth="'PH_ONLIE'">上线</el-button>
            </template>
            <template v-else-if="row.status === 1">
              <el-button type="text" @click="edit(row, 1)" v-auth="'PH_EDIT'">编辑</el-button>
              <el-button type="text" @click="changeStatus(row, 2)" v-auth="'PH_INVALID'">使失效</el-button>
            </template>
            <el-button type="text" class="static-clipboard" :data-clipboard-text="computedMobileLink(row)"   v-auth="'PH_COPY'">复制链接</el-button>
            <el-button type="text" @click="showDetail(row)" v-auth="'PH_EFFECT'">效果查看</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <EffectDialog ref="effect" />
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import EffectDialog from './effectDialog'
const prefix = WEBPACK_BUILD_TARGET === 'production' ? '' : 'test'

export default {
  props: ['tableData'],
  methods: {
    computedMobileLink (row) {
      return `http://${prefix}m.v.huatu.com/wap/?#/class/groupClass?collageActiveId=${row.id}&classId=${row.classId}`
    },
    edit (data) {
      this.$emit('edit', {...data})
    },
    remove (data) {
      this.$emit('remove', { ...data })
    },
    showDetail (row) {
			console.log("this.$refs: ",this.$refs);
      this.$refs.effect.showData(row.id)
    },
    changeStatus (row, status) {
      this.$emit('changeStatus', {
        data: { ...row },
        status
      })
    },
  },
  filters: {
    statusFormat: t => {
      switch (Number(t)) {
        case 0:
          return "未上线";
        case 1:
          return "已上线";
        case 2:
          return "已失效";
        case 3:
          return "已结束";
        default:
          return t;
      }
    },
    peopleFormat (num) {
      switch (num) {
        case 0:
          return '不限'
        case 1:
          return '新用户'
        case 2:
          return '老用户'
      }
      return num
    }
  },
  components: {
    EffectDialog,
  }
}
</script>

<style scoped>

</style>
