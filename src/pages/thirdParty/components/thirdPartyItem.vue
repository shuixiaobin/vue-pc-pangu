<template>
  <div class="thirdPartyItem">
    <div class="configWrapper">
      <div class="searchWrapper">
        <el-select
          v-model="chooseVal"
          style="width:330px"
          placeholder="请选择"
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
          class="ml20"
          v-if="chooseVal===1"
          v-model="className"
          placeholder="请输入内容"
        ></el-input>
        <el-input
          class="ml20"
          v-else-if="chooseVal===2"
          type="number"
          v-model="classId"
          placeholder="请输入内容"
        ></el-input>
        <el-input
          class="ml20"
          v-else-if="chooseVal===3"
          v-model="collectName"
          placeholder="请输入内容"
        ></el-input>
        <el-input
          class="ml20"
          v-else-if="chooseVal===4"
          type="number"
          v-model="collectId"
          placeholder="请输入内容"
        ></el-input>
        <el-input
          class="ml20"
          v-else-if="chooseVal===5"
          v-model="autoCollectName"
          placeholder="请输入内容"
        ></el-input>
        <el-input
          class="ml20"
          v-else-if="chooseVal===6"
          type="number"
          v-model="autoCollectId"
          placeholder="请输入内容"
        ></el-input>
        <el-button
          class="ml20"
          type="primary"
          @click="searchClassList"
        >搜索</el-button>
      </div>
      <div class="btnGroup">
        <el-button
          type="primary"
          plain
          @click="lookPartner"
        >查看配置</el-button>
        <el-button
          type="primary"
          @click="showDialog('classDialogVisible')"
        >添加课程</el-button>
        <el-button
          type="primary"
          @click="showDialog('collectionDialogVisible')"
        >添加合集</el-button>
        <el-button
          type="primary"
          @click="showDialog('autoCollectionDialogVisible')"
        >添加自动上下线合集</el-button>
      </div>
    </div>
    <el-table
      :data="tabelData"
      border
      style="width: 100%;marginTop:20px"
    >
      <el-table-column
        label="排序"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-input
            style="width:100%;text-align:center;"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D/g,'')"
            size="mini"
            placeholder="请输入"
            v-model="scope.row.order"
            @blur="setClassOrder(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="rid"
        label="课程/合集ID"
        width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="课程名称"
        align="center"
      >
        <template slot-scope="scope">
          <span
            style=" cursor: pointer;color:#409EFF"
            @click="toDetail(scope.row)"
          >{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="课程/合集"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          {{scope.row.type | typeFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          {{scope.row.status | statusFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            class="delBtn"
            size="small"
            @click="deleteItem(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <add-class
      v-if="classDialogVisible"
      @refreshFn="refreshFn"
      :userName="userName"
      :classDialogVisible.sync="classDialogVisible"
      :currentCateId="partnerId"
      :examTypeList="examListData"
    />
    <add-collection
      v-if="collectionDialogVisible"
      @refreshFn="refreshFn"
      :userName="userName"
      :collectionDialogVisible.sync="collectionDialogVisible"
      :currentCateId="partnerId"
    />
    <add-auto-line-collection
      v-if="autoCollectionDialogVisible"
      @refreshFn="refreshFn"
      :userName="userName"
      :autoCollectionDialogVisible.sync="autoCollectionDialogVisible"
      :currentCateId="partnerId"
    />
  </div>
</template>

<script>
  import exam from '@/api/exam'
  import { getPartnerClassList, deletePartnerClass, setClassOrder } from '@/api/thirdParty'
  import AddCollection from './addCollection'
  import AddAutoLineCollection from './addAutoLineCollection'
  import AddClass from './addClass'
  import { Loading } from 'element-ui'
  export default {
    props: {
      userName: {
        type: String,
        default: ''
      },
      partnerId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loading: null,
        classDialogVisible: false,
        collectionDialogVisible: false,
        autoCollectionDialogVisible: false,
        examListData: [], //考试类型
        tabelData: [],
        page: 1,
        pageSize: 10,
        total: null,
        options: [
          { label: '课程名称', value: 1 },
          { label: '课程ID', value: 2 },
          { label: '合集名称', value: 3 },
          { label: '合集ID', value: 4 },
          { label: '自动上下线合集名称', value: 5 },
          { label: '自动上下线合集ID', value: 6 }
        ],
        chooseVal: 1,
        className: '',
        classId: '',
        collectName: '',
        collectId: '',
        autoCollectName: '',
        autoCollectId: ''
      }
    },
    components: {
      AddClass,
      AddCollection,
      AddAutoLineCollection
    },
    mounted() {
      this.getExamType()
      this.getPartnerClassListFn()
    },
    watch: {
      chooseVal() {
        this.className = ''
        this.classId = ''
        this.collectName = ''
        this.collectId = ''
        this.autoCollectName = ''
        this.autoCollectId = ''
      }
    },
    filters: {
      typeFilter(val) {
        let examTypeMap = {
          '0': '课程',
          '1': '合集',
          '2': '自动上下线'
        }
        return examTypeMap[val]
      },
      statusFilter(val) {
        let statusTypeMap = {
          '0': '未上线',
          '1': '正常',
          '2': '下线',
          '4': '删除'
        }
        return statusTypeMap[val]
      }
    },

    methods: {
      searchClassList() {
        this.getPartnerClassListFn()
      },
      // 删除列表
      deleteItem(row) {
        const params = {
          rid: row.id, //课程/合集/自动上下线id
          pid: row.pid, //合作方id
          order: row.order //排序
        }
        this.$confirm('确认删除？')
          .then(async _ => {
            const res = await deletePartnerClass(params).catch(err => {
              this.$message.error(err.message)
            })
            this.getPartnerClassListFn()
          })
          .catch(_ => {})
      },
      // 获取合作方课程列表
      async getPartnerClassListFn() {
        const params = {
          parnterId: this.partnerId, //合作方id
          rid: this.classId, //课程id
          classTitle: this.className, //课程名称
          collectId: this.collectId, //合集id
          collectName: this.collectName, //合集名称
          autoCollectId: this.autoCollectId, //自动上下线id
          autoCollectName: this.autoCollectName, //自动上下线名称
          page: this.page,
          pageSize: this.pageSize
        }
        const res = await getPartnerClassList(params).catch(err => {
          this.$message.error(err.message)
        })
        if (this.loading) {
          this.loading.close()
        }
        this.tabelData = res.data.data
        this.total = res.data.total
      },
      // 刷新列表
      refreshFn() {
        this.getPartnerClassListFn()
      },
      showDialog(val) {
        this[val] = true
      },
      async getExamType() {
        let data = await exam.getExamType().catch(err => {
          this.$message.error(err.message)
        })
        this.examListData = data
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getPartnerClassListFn()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getPartnerClassListFn()
      },
      // 查看配置
      lookPartner() {
        this.$emit('showPartner')
      },
      // 课程排序
      async setClassOrder(item) {
        if (item.order) {
          const params = {
            pid: item.pid, //合作方id
            order: item.order, //修改排序数值
            id: item.id, //当前id
            creater: this.userName //添加人(蓝色后台用户名)
          }
          if (parseInt(item.order) > 0) {
            const data = setClassOrder(params).catch(err => {
              this.$message.error(err.message)
            })
            this.loading = this.$loading()
            setTimeout(() => {
              this.getPartnerClassListFn()
            }, 800)
          } else {
            this.$message('请输入序号大于0')
          }
        } else {
          this.$message.error('请输入课程序号')
        }
      },
      // 跳转详情
      toDetail(item) {
        let classDetailMap = {
          '0': `${PHP_CLASS_DETAIL}NetClass/NetClass/editnetclass/${item.rid}`,
          '1': `${PHP_CLASS_DETAIL}NetClass/CollectionClasses/classList?collectRid=${item.rid}`,
          '2': (function() {
            let location_href
            switch (item.isShow) {
              case 0:
                location_href = `${PHP_CLASS_DETAIL}/NetClass/NetClassAutoOnlineOrOffline/getCollectionList?isType=1&rid=${item.rid}`
                break
              case 1:
                location_href = `${PHP_CLASS_DETAIL}NetClass/NetClass/editnetclass/${item.rid}`
                break
              default:
                location_href = ''
                break
            }
            return location_href
          })()
        }
        window.location.href = classDetailMap[item.type]
      }
    }
  }
</script>
<style lang='less' scoped>
  .ml20 {
    margin-left: 20px;
  }
  .configWrapper {
    display: flex;
    justify-content: space-between;
  }
  .searchWrapper {
    width: 40%;
    display: flex;
  }
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .delBtn {
    color: #fe2500;
  }
</style>