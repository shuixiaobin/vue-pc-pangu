<template>
  <div class="createStage">
    <el-form ref="form" :model="form" :inline="true" :show-message="false">
      <el-form-item label="新阶段名称" required prop="stageName">
        <el-input style="width: 400px" v-model.trim="form.stageName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="creating" @click="createNewStage">创建新阶段</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="创建结果" :visible.sync="dialogTableVisible" width="900px">
      <template v-if="existArr.length">
        <h4>已存在要添加的阶段名称的课程列表</h4>
        <el-table :data="existArr">
          <el-table-column property="netClassId" label="课程id" width="150"></el-table-column>
          <el-table-column property="title" label="课程名称" width="300"></el-table-column>
        </el-table>
      </template>
      <template v-if="fail.length">
        <h4>添加失败的课程列表</h4>
        <el-table :data="fail">
          <el-table-column property="netClassId" label="课程id" width="80"></el-table-column>
          <el-table-column property="title" label="课程名称" width="300"></el-table-column>
        </el-table>
      </template>
      <template v-if="success.length">
        <h4>添加成功的课程列表</h4>
        <el-table :data="success">
          <el-table-column property="netClassId" label="课程id" width="80"></el-table-column>
          <el-table-column property="stageId" label="阶段节点id" width="100"></el-table-column>
          <el-table-column property="stageName" label="阶段节点名称" width="300"></el-table-column>
          <el-table-column property="title" label="课程名称" width="300"></el-table-column>
        </el-table>
      </template>
      <h2>请前往选择阶段标签页选择</h2>
      <div slot="footer" @close="closeDialog">
        <el-button @click="selectStage">选择阶段</el-button>
        <el-button @click="closeDialog">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import batchOperation from '@/api/batchOperation'
import { makeMap } from '../../util'
export default {
  props: ['netClassIds'],
  data () {
    return {
      form: {},
      creating: false,
      existArr: [],
      fail: [],
      success: [],
      dialogTableVisible: false,
    }
  },
  methods: {
    createNewStage () {
      this.$refs.form.validate((r) => {
        if (r) {
          this.creating = true
          this.fetchData()
        }
      })
    },
    closeDialog () {
      this.dialogTableVisible = false
    },
    fetchData () {
      return batchOperation.batchCreateStage({
        netClassIds: this.netClassIds,
        stageName: this.form.stageName
      }).then(res => {
        const list = res.list
        this.existArr = list.existArr
        this.fail = list.fail
        this.success = list.success
        this.creating = false
        this.dialogTableVisible = true
        this.form.stageName = ''
        this.$emit('createSuccess', makeMap(list.success, 'stageId'))
      })
    },
    selectStage () {
      this.closeDialog()
      this.$emit('selectStage')
    }
  }
}
</script>

<style scoped>
.createStage {
  width: 800px;
  margin: 0 auto;
  padding: 100px 0;
}
</style>
