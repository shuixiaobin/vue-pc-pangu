<template>
  <!-- 考试类型分类管理 -->
  <div id="exam">
    <div class="container-title">
      <h2>考试类型分类管理</h2>
      <!-- <el-button type="primary" size="mini" @click="createTypeDialogVisible = true" v-if="!isLimits.includes(currentCateId)">新增分类</el-button> -->
      <div class="btnArr">
        <el-button
          type="primary"
          size="mini"
          @click="createTypeDialogVisible = true"
        >新增分类</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="changeDialogVisible = true"
        >操作日志</el-button>
      </div>
    </div>
    <div class="container">
      <el-tabs
        v-model="currentCateId"
        @tab-click="examTabChange"
      >
        <el-tab-pane
          v-for="item in examTypeList"
          :key="item.cateKey + ''"
          :label="item.name"
          :name="item.cateKey + ''"
        >
          <div class="exam-main_tabel">
            <exam-tabel
              v-for="tabel in examTabelList"
              v-if="item.cateKey==tabel.cateId"
              :data-order="tabel.order"
              :id="tabel.order"
              :key="tabel.id"
              :useTabel="tabel"
              :currentCateId="currentCateId"
              ref="examTabel"
            >
              <template
                slot="handle"
                style="overflow:hidden"
              >
                <div style="overflow:hidden">
                  <p style="overflow:hidden;line-height:25px;float:left">
                    <label style="float:left">排序：</label>
                    <el-input
                      style="float:left;width:100px;text-align:center;"
                      onkeyup="this.value=this.value.replace(/\D/g,'')"
                      onafterpaste="this.value=this.value.replace(/\D/g,'')"
                      size="mini"
                      placeholder="请输入"
                      v-model="tabel.order"
                      @blur="setExamOrder(tabel)"
                    ></el-input>
                    <!-- 分类名称 -->
                    <img
                      style="float:left;width:25px;height:auto;margin:0 10px"
                      v-if="tabel.img"
                      :src="tabel.img"
                    >
                    <span style="float:left">{{tabel.title}}</span>
                  </p>
                  <p style="float:right;margin-bottom: 10px;">
                    <!-- <el-button type="primary" size="mini" @click="handleBtn('editDialogVisible',tabel)" v-if="!isLimits.includes(currentCateId)">修改名称</el-button> -->
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleBtn('editDialogVisible',tabel)"
                    >修改名称</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleBtn('changeIconDialogVisible',tabel)"
                    >修改图标</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleBtn('createDialogVisible',tabel)"
                    >添加课程</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleBtn('handleDialogVisible',tabel)"
                    >添加合集</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleBtn('onlineClassDialogVisible',tabel)"
                    >添加自动上下线集合</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="deleteExamType(tabel)"
                    >删除</el-button>
                  </p>
                </div>
                <!-- app -->
                <div style="overflow:hidden">
                  <p style="float:left">
                    APP课程首页展示个数：
                    <el-input
                      style="width:60px;text-align:center;"
                      onkeyup="this.value=this.value.replace(/\D/g,'')"
                      onafterpaste="this.value=this.value.replace(/\D/g,'')"
                      size="mini"
                      placeholder="数量"
                      v-model="tabel.number"
                      @blur="setAppClassNumber(tabel)"
                    ></el-input>
                  </p>
                  <p style="float:right;color:#409EFF;cursor:pointer;">
                    <span
                      @click="tabel.flag=true"
                      v-if="!tabel.flag"
                    >展开 <i class="el-icon-arrow-down"></i></span>
                    <span
                      @click="tabel.flag=false"
                      v-else
                    >收起 <i class="el-icon-arrow-up"></i></span>
                  </p>
                </div>
              </template>
            </exam-tabel>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹出框 -->
    <div class="exam_dialog">
      <!-- 修改名称 -->
      <el-dialog
        title="修改名称"
        center
        :visible.sync="editDialogVisible"
        width="70%"
        :close-on-click-modal="false"
      >
        <label>课程名称：</label>
        <el-input
          size="mini"
          style="width:80%;"
          placeholder="请输入课程名称"
          v-model="typeName"
          onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"
        ></el-input>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editExamTitle"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加课程 -->
      <class-list-dialog
        v-if="createDialogVisible"
        ref="classListDialog"
        :createDialogVisible="createDialogVisible"
        @examTabChange="examTabChange"
        :currentTypeId="typeId"
        :examTypeList="examTypeList"
        :currentCateId="currentCateId"
        @offDialog="offDialog"
      ></class-list-dialog>
      <!-- 添加合集 -->
      <interse-list-dialog
        v-if="handleDialogVisible"
        ref="interseListDialog"
        :handleDialogVisible="handleDialogVisible"
        @examTabChange="examTabChange"
        :currentTypeId="typeId"
        :examTypeList="examTypeList"
        :currentCateId="currentCateId"
        @offDialog="offDialog"
      ></interse-list-dialog>
      <!-- 添加自动上下线集合 -->
      <online-class-dialog
        v-if="onlineClassDialogVisible"
        ref="onlineClassDialog"
        :onlineClassDialogVisible="onlineClassDialogVisible"
        @examTabChange="examTabChange"
        :currentTypeId="typeId"
        :examTypeList="examTypeList"
        :currentCateId="currentCateId"
        @offDialog="offDialog"
      ></online-class-dialog>
      <!-- 操作日志 -->
      <handle-list-dialog
        v-if="changeDialogVisible"
        ref="handleListDialog"
        :changeDialogVisible="changeDialogVisible"
        :currentCateId="currentCateId"
        @offDialog="offDialog"
      ></handle-list-dialog>
      <!-- 新增类型 -->
      <create-type-dialog
        v-if="createTypeDialogVisible"
        ref="createTypeDialog"
        :createTypeDialogVisible="createTypeDialogVisible"
        @examTabChange="examTabChange"
        :currentCateId="currentCateId"
        @offDialog="offDialog"
      ></create-type-dialog>
      <!-- 修改图标 -->
      <change-icon-dialog
        v-if="changeIconDialogVisible"
        ref="changeIconDialog"
        :changeIconDialogVisible="changeIconDialogVisible"
        :icon="icon"
        @examTabChange="examTabChange"
        :currentTypeId="typeId"
        @offDialog="offDialog"
      ></change-icon-dialog>
    </div>
  </div>
</template>
<script>
  import exam from '../../api/exam'
  import examTabel from './components/examTabel' // 课程表格
  import classListDialog from './components/classListDialog' // 添加课程
  import interseListDialog from './components/interseListDialog' // 添加合集
  import handleListDialog from './components/handleListDialog' // 操作记录
  import createTypeDialog from './components/createTypeDialog' // 新增类型
  import changeIconDialog from './components/changeIconDialog' // 修改图标
  import onlineClassDialog from './components/onlineClassDialog' // 添加自动上下线集合

  export default {
    name: 'exam',
    components: {
      examTabel,
      classListDialog,
      interseListDialog,
      handleListDialog,
      createTypeDialog,
      changeIconDialog,
      onlineClassDialog
    },
    computed: {},
    data() {
      return {
        isLimits: ['1013'], // 面试不可新增修改
        examTypeList: [], // 考试类型
        examTabelList: [], // 考试类型课程列表
        currentCateId: '', // 当前考试类型 id
        typeName: '', // 当前类型名称
        page: {
          handle_page_size: 10,
          handle_page: 1,
          class_page: 1
        },
        editDialogVisible: false, // 修改名称
        changeDialogVisible: false, // 操作
        createDialogVisible: false, // 课程
        handleDialogVisible: false, // 合集
        createTypeDialogVisible: false, // 新增类型
        changeIconDialogVisible: false, // 图标
        onlineClassDialogVisible: false, // 添加自动上下线j集合
        typeId: '', // 当前类型 id 添加合集 添加课程
        icon: '' // 原图标
      }
    },
    async created() {
      let data = await exam.getExamType()
      if (data) {
        this.examTypeList = data
        this.currentCateId = data[0].cateKey + ''
        this.$nextTick(async _ => {
          let param = {
            cateId: this.currentCateId
          }
          let data = await exam.getExamList(param)
          this.examTabelList = data.map(v => {
            this.$set(v, 'flag', true)
            return v
          })
          console.log(this.examTabelList)
        })
      }
    },
    mounted() {
      window.addEventListener('scroll', this.windowScroll)
    },
    methods: {
      // 滚动监听，固定顶部
      windowScroll() {
        let a = document.querySelector('.el-tabs__header'),
          b = document.querySelector('.exam_header'),
          a_style =
            'position: fixed;top: 0;left:40px;width:calc(100% - 80px);z-index: 100;background: #fff;'

        a.style = window.scrollY > a.offsetHeight + b.offsetHeight ? a_style : ''
      },
      // 查询列表
      async examTabChange({ type = '' } = {}) {
        let param = {
          cateId: this.currentCateId
        }
        let data = await exam.getExamList(param)
        if (data) {
          this.examTabelList = data.map(v => {
            this.$set(v, 'flag', true)
            return v
          })

          this.$nextTick(_ => {
            // 如果新建操作，跳转序列最后一位
            if (type == 'create') {
              let ele = document.getElementById(data[data.length - 1].order)
              window.scrollTo(0, ele.offsetTop)
            }
          })
        }
      },
      // app展示课程数量
      async setAppClassNumber(item) {
        if (item.number) {
          let param = {
            cateId: this.currentCateId,
            num: parseInt(item.number),
            typeId: item.id
          }

          if (parseInt(item.number) > 0) {
            let data = await exam.setAppClassNumber(param)
          } else {
            this.$message('请输入课程数量大于0')
          }
        } else {
          this.$message.error('请输入课程数量')
        }

        this.examTabChange()
      },
      // 类型排序
      async setExamOrder(item) {
        if (item.order) {
          let param = {
            cateId: this.currentCateId,
            order: item.order,
            typeId: item.id
          }

          if (parseInt(item.order) > 0) {
            let data = await exam.setExamOrder(param)
          } else {
            this.$message('请输入序号大于0')
          }
        } else {
          this.$message.error('请输入类型序号')
        }

        this.examTabChange()
      },
      // 修改名称确认
      async editExamTitle() {
        if (this.typeName.trim()) {
          let param = {
            title: this.typeName.trim(),
            typeId: this.typeId
          }

          if (this.typeName.trim().length > 25) {
            return this.$message('分类标题最多25字')
          }

          let data = await exam.setExamTypeTitle(param)
          if (data) {
            this.editDialogVisible = false
            this.examTabChange()
          }
        } else {
          this.$message.error('请输入类型名称')
        }
      },
      // 删除分类
      deleteExamType(item) {
        this.$confirm('此操作将永久不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(_ => {
            this.$nextTick(async _ => {
              let data = await exam.deleteExamType({
                typeId: item.id
              })
              if (data) {
                this.examTabChange()
              }
            })
          })
          .catch(_ => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      },
      // 关闭弹窗
      offDialog() {
        Object.keys(this.$data).forEach(cur => {
          if (cur.indexOf('Visible') !== -1) {
            this[cur] = false
          }
        })
      },
      // 弹窗操作按钮
      handleBtn(dialogType, tabel) {
        this[dialogType] = true
        this.typeId = tabel.id
        this.typeName = tabel.title // 弹出框课程名称初始值
        this.icon = tabel.img // 原图标
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.windowScroll)
    }
  }
</script>
<style lang="less">
  #exam {
    input[type='number'],
    input[type='text'] {
      -moz-appearance: textfield;
      text-align: center;
    }

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      -moz-appearance: textfield;
      margin: 0;
    }

    .el-table .warning-row {
      background: oldlace;
    }

    .exam_header {
      padding-bottom: 20px;
      border-bottom: 1px solid #fff;
      overflow: hidden;

      > span {
        font-size: 18px;
        line-height: 1;
      }

      > p {
        float: right;
      }
    }

    .exam_main {
      background: #fff;
      padding: 20px;
      border: 1px #ecf0f5 solid;
    }
  }
</style>
