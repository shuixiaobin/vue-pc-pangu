<template>
  <el-dialog
    title="请选择"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
   <el-select v-model="form.categoryId" @change="handleCategoryChange" placeholder="请选择考试类型">
     <el-option v-for="item in catgories" :label="item.name" :value="item.id" :key="item.id"></el-option>
   </el-select>
   <div style="height: 20px;"></div>
   <el-select v-model="form.subjectId" placeholder="请选择科目">
     <el-option v-for="item in subjects" :label="item.name" :value="item.id" :key="item.id"></el-option>
   </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getTypeSubjectTree } from '@/api/dataCenter'
function initForm () {
  return {
    categoryId: null,
    subjectId: null,
  }
}
export default {
  data () {
    return {
      dialogVisible: false,
      form: initForm(),
      catgories: [],
      subjects: [],
    }
  },
  created () {
    getTypeSubjectTree().then(res => {
      this.catgories = res.data
    })
  },
  methods: {
    show (options) {
      this.dialogVisible = true
      this.options = options || {}
    },
    handleClose () {
      this.dialogVisible = false
    },
    handleConfirm () {
      const {categoryId, subjectId} = this.form
      if (!categoryId) {
        this.$message.warning('请选择考试类型')
        return
      }
      if (!subjectId) {
        this.$message.warning('请选择科目')
        return
      }

      const { handleConfirm } = this.options
      if (handleConfirm) {
        handleConfirm({categoryId, subjectId})
      }
    },
    handleCategoryChange () {
      const id = this.form.categoryId
      const d = this.catgories.find(item => item.id === id)
      this.form.subjectId = null
      if (d) {
        this.subjects = d.children
      }
    },
  }
}
</script>

<style scoped>

</style>
