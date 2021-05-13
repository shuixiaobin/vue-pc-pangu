<template>
  <div class="job-library">
    <div class="header-wapper">
      <span>职位库管理</span>
      <el-button
        size="small"
        type="primary"
        @click="dialogShow('uploadVisible')"
      >上传职位库</el-button>
      <el-button
        size="small"
        type="primary"
        @click="dialogShow('provinceVisible')"
      >省考省份排序</el-button>
      <el-button
        size="small"
        type="primary"
        @click="dialogShow('exportVisible')"
      >线索导出</el-button>
      <el-button
        size="small"
        type="primary"
        @click="dialogShow('examTypeSortVisible')"
      >考试类型排序</el-button>
    </div>
    <el-form
      ref="form"
      :model="formData"
      size="mini"
      :inline="true"
    >
      <el-form-item label="考试类型">
        <el-select
          v-model="formData.examValue"
          placeholder="活动区域"
        >
          <el-option
            v-for="item in examData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份">
        <el-select
          v-model="formData.year"
          placeholder="活动区域"
        >
          <el-option
            v-for="item in yearData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职位代码">
        <el-input
          v-model="formData.jobCode"
          placeholder="请输入职位代码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="更新时间"
        fixed
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        fixed
      >
        <template slot-scope="scope">
          <el-button
            @click="handleEdit(scope.row)"
            type="text"
            size="small"
          >编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="1">
        <el-table-column label="zwk_year">
          <el-table-column
            label="年份"
            prop="date"
          >
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="2">
        <el-table-column label="zwk_sheng">
          <el-table-column label="省份">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="3">
        <el-table-column label="zwk_diqu">
          <el-table-column label="地市">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="4">
        <el-table-column label="zwk_zwlx">
          <el-table-column label="考试分类">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="5">
        <el-table-column label="zwk_leixing">
          <el-table-column label="考试类型">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="6">
        <el-table-column label="sx_1">
          <el-table-column label="是否应届">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="7">
        <el-table-column label="sx_2">
          <el-table-column label="学历">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="8">
        <el-table-column label="sx_3">
          <el-table-column label="专业">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="9">
        <el-table-column label="sx_4">
          <el-table-column label="政治面貌">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="10">
        <el-table-column label="sx_5">
          <el-table-column label="基层工作经验">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="11">
        <el-table-column label="zwk_bumen">
          <el-table-column label="部门名称">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="12">
        <el-table-column label="zwk_bmdm">
          <el-table-column label="部门代码">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="13">
        <el-table-column label="zwk_yrsj">
          <el-table-column label="用入单位">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="14">
        <el-table-column label="zwk_zw">
          <el-table-column label="职位名称">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="15">
        <el-table-column label="zwk_zwdm">
          <el-table-column label="职位代码">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="16">
        <el-table-column label="zwk_jj">
          <el-table-column label="职位简介">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="17">
        <el-table-column label="new_1">
          <el-table-column label="机构层级">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="18">
        <el-table-column label="new_2">
          <el-table-column label="系统分布">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="19">
        <el-table-column label="zwk_lx">
          <el-table-column label="职位类型">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="20">
        <el-table-column label="zwk_kslb">
          <el-table-column label="考试类别">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="21">
        <el-table-column label="zwk_zkrs">
          <el-table-column label="招考人数">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="22">
        <el-table-column label="new_3">
          <el-table-column label="是否为公安机关人民警察职位">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="23">
        <el-table-column label="zwk_zyks">
          <el-table-column label="是否组织专业考试">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="24">
        <el-table-column label="zwk_ksbl">
          <el-table-column label="开考比例">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="25">
        <el-table-column label="zwk_zkdx">
          <el-table-column label="招考对象">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="26">
        <el-table-column label="zwk_xl">
          <el-table-column label="学历">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="27">
        <el-table-column label="new_4">
          <el-table-column label="是否全日制">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="28">
        <el-table-column label="zwk_xw">
          <el-table-column label="学位">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="29">
        <el-table-column label="zwk_zy">
          <el-table-column label="专业">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="30">
        <el-table-column label="zwk_zzmm">
          <el-table-column label="政治面貌">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="31">
        <el-table-column label="zwk_xb">
          <el-table-column label="性别要求">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="32">
        <el-table-column label="zwk_age">
          <el-table-column label="年龄要求">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="33">
        <el-table-column label="new_5">
          <el-table-column label="户籍/生源要求">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="34">
        <el-table-column label="zwk_jcnx">
          <el-table-column label="基层工作最低年限">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="35">
        <el-table-column label="new_6">
          <el-table-column label="基层服务经历">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="36">
        <el-table-column label="zwk_fwnx">
          <el-table-column label="最低服务年限">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="37">
        <el-table-column label="zwk_msfs">
          <el-table-column label="入面分数线">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="38">
        <el-table-column label="zwk_phone">
          <el-table-column label="咨询电话">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="39">
        <el-table-column label="zwk_bz">
          <el-table-column label="备注">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="40">
        <el-table-column label="zwk_qita">
          <el-table-column label="其他条件">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="41">
        <el-table-column label="zwk_gzdd">
          <el-table-column label="工作地点">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="42">
        <el-table-column label="zwk_lhdd">
          <el-table-column label="落户地区">
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, prev, sizes, pager, next"
      :total="400"
    >
    </el-pagination>
    <job-dialog
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
    />
    <upload-dialog
      v-if="uploadVisible"
      :dialogVisible.sync="uploadVisible"
    />
    <province-dialog
      v-if="provinceVisible"
      :dialogVisible.sync="provinceVisible"
    />
    <export-dialog v-if="exportVisible"
      :dialogVisible.sync="exportVisible"
     />
    <ExamSortDialog
      v-if="examTypeSortVisible"
      :dialogVisible.sync="examTypeSortVisible"
    ></ExamSortDialog>
  </div>
</template>

<script>
  import ProvinceDialog from './components/provinceDialog'
  import UploadDialog from './components/uploadDialog'
  import JobDialog from './components/jobDialog'
  import ExportDialog from './components/exportDialog'
  import ExamSortDialog from './components/examSortDialog'
  export default {
    data() {
      return {
        formData: {
          examValue: '',
          year: '',
          jobCode: ''
        },
        examData: [],
        yearData: [],
        page: 1,
        pageSize: 20,
        dialogVisible: false,
        uploadVisible: false,
        provinceVisible: false,
        exportVisible: false,
        examTypeSortVisible: false,
        tableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ]
      }
    },

    components: {
      JobDialog,
      UploadDialog,
      ProvinceDialog,
      ExportDialog,
      ExamSortDialog,
    },
    methods: {
      handleEdit(row) {
        this.dialogVisible = true
      },
      onSearch() {},
      handleCurrentChange(val) {
        this.page = val
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      dialogShow(val) {
        this[val] = true
      }
    }
  }
</script>
<style lang='less' scoped>
  .job-library {
    padding: 20px;
    .header-wapper {
      margin-bottom: 20px;
      span {
        margin-right: 20px;
      }
    }
    .el-pagination {
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }
  }
</style>
