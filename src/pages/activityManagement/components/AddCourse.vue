<template>
  <el-dialog
    title="添加课程"
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    @open="getList()"
    width="70%"
  >
    <div class="course-search-box mb16">
      <el-select size="small" v-model="form.singleType">
        <el-option :value="1" label="课程标题"></el-option>
        <el-option :value="2" label="课程编号"></el-option>
        <el-option :value="3" label="课程ID"></el-option>
        <el-option :value="4" label="教师ID"></el-option>
      </el-select>
      <el-input
        size="small"
        v-model="form.singleValue"
        placeholder="请输入"
      ></el-input>
      <el-select
        size="small"
        v-model="form.classStatus"
        placeholder="选择课程状态"
        clearable
      >
        <el-option :value="''" label="全部"></el-option>
        <el-option :value="0" label="未上线"></el-option>
        <el-option :value="1" label="已上线"></el-option>
        <el-option :value="2" label="已下线"></el-option>
      </el-select>
      <el-button
        type="primary"
        size="small"
        @click="search"
        class="course-btn"
      >
        搜索
      </el-button>
      <el-button
        v-if="!singleSelect"
        size="small"
        @click="batchAdd"
        class="course-btn"
      >
        批量添加
      </el-button>
    </div>
    <div>
      <el-table ref="table" row-key="classId" :data="gridData" :loading="loading" height="400px" @selection-change="onSelectionChange">
        <el-table-column v-if="!singleSelect" type="selection" width="55" align="center" :selectable="row => !isSelected(row)">
        </el-table-column>
        <el-table-column
          property="classId"
          label="ID"
          width="100"
        ></el-table-column>
        <el-table-column
          property="classNo"
          label="课程编号"
          width="220"
        ></el-table-column>
        <el-table-column
          property="title"
          label="课程名称"
          min-width="250"
        ></el-table-column>
        <slot name="default">
          <el-table-column
            property="price"
            label="课程原价"
            width="100"
          >
            <template #default="{row}">
              ￥{{row.price}}
            </template>
          </el-table-column>
        </slot>
        <el-table-column property="status" label="课程状态" width="100">
          <template slot-scope="scope">
            <span>{{ getStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column property="createDate" label="创建日期" width="180">
        </el-table-column> -->
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <span v-if="isSelected(scope.row)">已添加</span>
            <el-button v-else type="text" @click="addCourse([scope.row])"
              >加入</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="container-pagination"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import { page } from "@/common/mixins";
export default {
  mixins: [page],
  props: {
    visible: Boolean,
    listRequest: Function, // 列表数据请求方法
    selectedClass: {
      type: Array,
      default() {
        return [];
      },
    },
    singleSelect: Boolean, // 是否为单选
  },

  data() {
    return {
      // 搜索条件参数
      form: {
        singleType: 1,
        singleValue: '',
        classStatus: '',
      },
      gridData: [],
      selections: [],
      loading: false
    };
  },

  watch: {
    selectedClass (value) {
      for (let course of this.selectedClass) {
        let courseInTable = this.selections.find(item => item.classId == course.classId)
        if (courseInTable) {
          this.$refs.table.toggleRowSelection(courseInTable, false)
        }
      }
    }
  },

  methods: {
    search() {
      this.page = 1;
      this.getList();
    },
    getList() {
      let params = {
        page: this.page,
        pageSize: this.pageSize
      }
      for (let key in this.form) {
        if (this.form[key] || this.form[key] === 0) {
          params[key] = this.form[key]
        }
      }
      this.listRequest(params)
        .then(res => {
          if (res.code === 10000) {
            this.gridData = res.data.data;
            this.total = res.data.total;
            this.selections = [];
            this.$refs.table.clearSelection();
          }
          this.loading = false;
        })
        .catch(err =>{
          console.log(err)
        });
    },
    addCourse(courseArr) {
      this.$emit('addCourse', courseArr);
    },
    batchAdd() {
      if (!this.selections.length) {
        this.$message.error('请选择要添加的课程');
        return;
      }
      this.$emit('addCourse', this.selections);
    },
    isSelected(course) {
      return this.selectedClass.findIndex(item => item.classId === course.classId) !== -1;
    },
    getStatus(val) {
      //状态
      if (val == 0) {
        return '未上线';
      } else if (val == 1) {
        return '已上线';
      } else if (val == 2) {
        return '已下线';
      } else {
        return ''
      }
    },
    onSelectionChange(selections) {
      this.selections = selections;
    },
  },
};
</script>

<style lang="less" scoped>
.course-search-box {
  display: flex;
  align-items: center;
  > * {
    margin-right: 20px;
    flex: 0 1 300px;
  }
  .course-btn {
    margin-left: auto;
    flex: 0 0 60px;
  }
}
</style>