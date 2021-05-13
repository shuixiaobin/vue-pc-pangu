<template>
  <!-- 添加课程 dialog -->
  <el-dialog
    title="添加课程"
    :visible="true"
    :close-on-click-modal="false"
    width="70%"
    @close="offDialog"
  >
    <div>
      <div style="padding-bottom:20px">
        <el-select
          size="mini"
          v-model="cateId"
          placeholder="请选择考试类型"
        >
          <el-option
            v-for="item in examTypeList"
            :key="item.cateKey"
            :label="item.name"
            :value="item.cateKey"
          >
          </el-option>
        </el-select>
        <el-select
          size="mini"
          v-model="createSearchType"
          placeholder="请选择（选填）"
        >
          <el-option
            v-for="item in createSearchData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          size="mini"
          style="width:320px;"
          v-if="createSearchType==='1'"
          v-model="currentClassId"
          placeholder="请输入课程ID"
        ></el-input>
        <el-input
          size="mini"
          style="width:320px;"
          v-if="createSearchType==='2'"
          v-model="currentClassName"
          placeholder="请输入课程名称"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          @click="searchList()"
        >搜 索</el-button>
      </div>
      <el-tabs v-model="currentTab">
        <el-tab-pane
          label="可选课程"
          name="first"
        >
          <p style="padding-bottom:20px;">
            <el-button
              style="margin-left:0"
              v-show="!isCheckAll"
              type="primary"
              size="mini"
              @click="isClassCheckAll(true)"
            >全选</el-button>
            <el-button
              style="margin-left:0"
              v-show="isCheckAll"
              type="primary"
              size="mini"
              @click="isClassCheckAll(false)"
            >取消全选</el-button>
          </p>
          <el-table
            empty-text="暂无课程"
            tooltip-effect="dark"
            :data="classList.data"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="checked"
              label="请选择"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <input
                  type="checkbox"
                  :checked="scope.row.checked"
                  @click="isClassChecked(scope.row)"
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="rid"
              label="课程ID"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="title"
              label="课程名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="课程价格"
              align="center"
              width="150"
            >
              <template slot-scope="scope">
                {{scope.row.price}}元
              </template>
            </el-table-column>
            <el-table-column
              label="课程状态"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                {{scope.row.status|statusFilter}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          :label="'已选课程 '+chooseClass"
          name="second"
        >
          <el-table
            empty-text="请选择课程"
            :data="checkClassList.data"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="rid"
              label="课程ID"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="title"
              label="课程名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="课程价格"
              align="center"
              width="150"
            >
              <template slot-scope="scope">
                {{scope.row.price}}元
              </template>
            </el-table-column>
            <el-table-column
              label="课程状态"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                {{scope.row.status|statusFilter}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  @click="isClassChecked(scope.row)"
                  type="text"
                >取消选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <el-pagination
        style="float:right;padding-bottom:20px"
        @current-change="handleClassPage"
        :current-page.sync="page.class_page"
        layout="prev, pager, next"
        :total="classList.total"
      >
      </el-pagination>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="offDialog">取 消</el-button>
      <el-button
        type="primary"
        @click="setClass"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { addClassList, addPartnerClass } from '@/api/thirdParty'
  export default {
    props: {
      userName: {
        type: String,
        default: ''
      },
      // 合作方 id
      currentCateId: {
        default: '',
        type: String
      },
      // 考试类型
      examTypeList: {
        default: [],
        type: Array / Object
      }
    },
    data() {
      return {
        isCheckAll: false,
        currentTab: 'first',
        cateId: '', // 考试类型id
        createSearchType: '', // 添加课程筛选条件
        currentClassName: '',
        currentClassId: '',
        classList: {},
        checkClassList: {
          data: []
        },
        createSearchData: [
          {
            value: '1',
            label: '课程ID'
          },
          {
            value: '2',
            label: '课程名称'
          }
        ],
        page: {
          class_page: 1
        }
      }
    },
    computed: {
      chooseClass() {
        return this.checkClassList.data.length > 0 ? `（${this.checkClassList.data.length}）` : ''
      }
    },
    mounted() {
      this.cateId = Number(Object.keys(this.examTypeList)[0])
      this.getClassList()
    },
    methods: {
      // 课程列表
      async getClassList() {
        let param = {
          cateId: this.currentCateId, // 当前合作方id
          currentCateId: this.cateId, //考试类型id
          classId: this.currentClassId, // 搜索课程 id
          keyWord: this.currentClassName, // 搜索课程名称
          page: this.page.class_page
        }
        let res = await addClassList(param)
        if (res && Object.prototype.toString.call(res.data.data) == '[object Array]') {
          let check_num = 0 // 全选/取消全选
          this.classList = {
            ...res,
            data: res.data.data.map(item => {
              let flag = false
              if (this.checkClassList.data.some(v => v.rid == item.rid)) {
                flag = true
                check_num++
              }
              return { ...item, checked: flag }
            })
          }
          if (check_num == this.classList.data.length) {
            this.isCheckAll = true // 取消全选
          } else {
            this.isCheckAll = false // 全选
          }
        }
      },
      // 选中/反选
      isClassChecked(item) {
        let checkClassListIndex = this.checkClassList.data.findIndex(checked => checked.rid == item.rid)
        if (!item.checked) {
          item.checked = true
          this.checkClassList.data.push(item)
        } else {
          item.checked = false
          this.checkClassList.data.splice(checkClassListIndex, 1)
        }
        console.log('checkClassList:', this.checkClassList)
      },
      // 全选/取消全选
      isClassCheckAll(flag) {
        this.isCheckAll = flag
        this.classList.data.map(item => {
          let checkClassListIndex = this.checkClassList.data.findIndex(checked => checked.rid == item.rid)

          if (flag) {
            item.checked = true
            if (!this.checkClassList.data.some(v => v.rid == item.rid)) {
              this.checkClassList.data.push(item)
            }
          } else {
            item.checked = false
            if (this.checkClassList.data.some(v => v.rid == item.rid)) {
              this.checkClassList.data.splice(checkClassListIndex, 1)
            }
          }
          return item
        })
      },
      // 添加课程
      async setClass() {
        if (JSON.stringify(this.checkClassList.data) != '[]') {
          let param = {
            rid: this.checkClassList.data
              .reduce((last, item) => {
                return [...last, item.rid]
              }, [])
              .join(','),
            pid: this.currentCateId,
            creater: this.userName,
            type: 0 //课程：0 合集：1 自动上下线：2
          }
          let data = await addPartnerClass(param)
          if (data) {
            this.$emit('refreshFn') // 刷列表
            this.offDialog()
            this.$message('操作成功')
          }
        } else {
          this.$message('请勾选课程')
        }
      },
      // 课程列表分页
      handleClassPage(val) {
        this.page.class_page = val
        this.getClassList()
      },
      searchList() {
        this.page.class_page = 1
        this.getClassList()
      },
      // 关闭
      offDialog() {
        this.page.class_page = 1
        this.$emit('update:classDialogVisible', false)
      }
    },
    watch: {
      createSearchType(val) {
        this.currentClassId = ''
        this.currentClassName = ''
      }
    },
    filters: {
      statusFilter(val) {
        let statusTypeMap = {
          '0': '未上线',
          '1': '正常',
          '2': '下线',
          '4': '删除'
        }
        return statusTypeMap[val]
      }
    }
  }
</script>