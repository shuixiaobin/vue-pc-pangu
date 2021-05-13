<template>
  <el-dialog
    title="批量添加作业"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="handleClose">
    <el-tabs v-model="activeName">
      <el-tab-pane label="作业内容" name="1">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="作业标题">
            <el-input placeholder="请输入作业标题" :maxlength="20" v-model="form.title" />
          </el-form-item>
          <el-form-item label="作业日期">
            <el-date-picker v-model="form.workDate" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="作业内容">
            <Um ref="um" :setValue="setValue" />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.selected">
              <span v-if="useDefaultPushTime">&nbsp;作业日期当日7:00推送提醒学员 <el-button @click="editPushTime">修改时间</el-button></span>
              <template v-else>
                <el-date-picker v-model="form.pushTime" type="datetime" placeholder="选择日期时间" />&nbsp;推送提醒学员
                &nbsp;<el-button @click="editPushTime">使用默认时间</el-button>
              </template>
            </el-checkbox>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="选择课程" name="2">
        <CourseSearchForm @search="handleSearchChange" />
        <CourseList :tableData="searchData" @checkedChange="listCheckedChange" />
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" />
      </el-tab-pane>
      <el-tab-pane :label="'已选课程(' + selectedData.length + ')'" name="3">
        <CourseList :tableData="selectedData" @checkedChange="selectedChange" />
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveData">确 定</el-button>
    </span>
  </el-dialog>
</template>


<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import Um from '@/components/um'
import CourseSearchForm from './courseSearchForm'
import CourseList from './courseList'
import {
  getCourseDetail,
  taskOperate,
  get_course_list as getCourseList,
  batchCreateCourse,
} from '@/api/omoApi'
import Util, { assert } from '@/common/util'
import { page, tableData } from '@/common/mixins'

function formInitVal () {
  return {
    selected: true,
    title: '',
    workDate: '',
    pushTime: ''
  }
}
export default {
  props: ['courseId'],
  mixins: [ page, tableData ],
  computed: {
    title () {
      if (this.id) {
        return '作业内容编辑'
      } else {
        return '添加新作业'
      }
    }
  },
  created () {
    this.page = 0
  },
  data () {
    this.searchParams = {}
    return {
      dialogVisible: false,
      form: formInitVal(),
      init: false,
      setValue: '',
      activeName: '1',
      tableData: [],
      useDefaultPushTime: true
    }
  },
  methods: {
    editPushTime () {
      this.form.pushTime = ''
      this.useDefaultPushTime = !this.useDefaultPushTime
    },
    handleSearchChange (d) {
      this.searchParams = d
      this.page = 1
      this.getList()
    },
    getList () {
      getCourseList({
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchParams,
      }).then(res => {
        if (res.code === 10000) {
          const data = res.data
          if (!data.data || data.data.length === 0) {
            this.$message({
              message: '暂无数据',
              type: 'warning'
            })
            this.searchData = []
            return
          }
          const map = this.selectedMap
          this.total = data.total
          this.searchData = data.data.map(item => {
            return {
              ...item,
              id: item.rid,
              selected: item.rid in map,
            }
          })
        } else {
          throw new Error(res.msg)
        }
      }).catch(e => this.$message.error(e.message))
    },
    saveData () {
      try {
        const content = this.$refs.um.getEditorContent()
        const form = this.form
        assert(form.title.trim(), '作业标题必填')
        assert(form.workDate, '作业日期必填')
        assert(content, '作业内容必填')
        assert(this.selectedData.length > 0, '请选择课程')
        if (!this.useDefaultPushTime)
          assert(form.pushTime, '请选择推送时间')
        this.$confirm('该操作将批量创建作业, 是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const params = {
            content,
            title: form.title,
            workDate: Util.formatDate(form.workDate) + ' 23:59:59',
            courseIdList: this.selectedData.map(item => item.id),
            pushStatus: form.selected ? 1 : 0,
          }
          if (form.selected && !this.useDefaultPushTime) {
            params.pushTime = Util.formatTime2(form.pushTime)
          }
          batchCreateCourse(params).then(res => {
            if (res.code === 1000000) {
              this.$message.success('操作成功')
              this.resetForm()
            } else {
              throw res
            }
          }).catch(e => this.$message.error(e.message))
        })
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    resetForm () {
      this.form = formInitVal()
      this.setVal('')
    },
    show () {
      this.resetForm()
      this.activeName = '1'
      this.dialogVisible = true
      this.useDefaultPushTime = true
      this.selectedMap = {},
      this.searchParams = {}
      this.page = 1
      this.getList()
    },
    setVal (val = '') {
      this.$nextTick(() => {
        this.setValue = val
        this.$refs.um.setUmContent(val)
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
  },
  components: {
    Um,
    CourseSearchForm,
    CourseList,
  }
}
</script>

<style scoped>

</style>
