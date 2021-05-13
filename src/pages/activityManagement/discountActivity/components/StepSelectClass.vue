<template>
  <div>
    <div class="container-title">
      <h2>选择课程</h2>
    </div>
    <div class="container">
      <div class="mb16">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="addCourseOpen()"
        >
          新增
        </el-button>
        <el-button
          size="small"
          @click="deleteCourse(selection.map((item) => item.classId))"
        >
          批量删除
        </el-button>
      </div>
      <el-table
        ref="table"
        :data="pagedData"
        row-key="classId"
        @selection-change="onSelectionChange"
      >
        <el-table-column
          type="selection"
          show-overflow-tooltip
          align="center"
          :reserve-selection="true"
        >
        </el-table-column>
        <el-table-column
          property="classId"
          label="课程ID"
          width="100"
          fixed="left"
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
        <el-table-column
          property="price"
          label="课程原价(￥)"
          width="150"
          sortable
          sort-by="price"
        >
          <template #default="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column property="status" label="状态" width="100">
          <template #default="scope">
            <span>{{ getStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="createDate"
          label="创建日期"
          width="180"
        ></el-table-column>
        <el-table-column
          property="timestamp"
          label="最近修改"
          width="180"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="80"
          fixed="right"
        >
          <template #default="{row}">
            <el-button type="text" @click="deleteCourse([row.classId])">
              删除
            </el-button>
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
        :total="classData.length"
        class="container-pagination"
      >
      </el-pagination>
    </div>
    <AddCourse
      :visible.sync="addCourseVisible"
      :selectedClass="classData"
      :listRequest="classListRequest"
      @addCourse="onClassAdd"
    >
    </AddCourse>
  </div>
</template>

<script>
import AddCourse from '../../components/AddCourse';
import { getDiscountActivityClassList } from '@/api/activityManage'
import { mapGetters, mapMutations } from 'vuex';
import { page } from '@/common/mixins';
export default {
  components: {
    AddCourse,
  },

  mixins: [page],

  props: {
    type: [Number, String],
  },

  data() {
    return {
      classListRequest: getDiscountActivityClassList,
      addCourseVisible: false,
      classData: [],
      selection: [],
    };
  },

  computed: {
    ...mapGetters('activity', { activity: 'getActivity' }),
    pagedData () {
      return this.classData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    }
  },

  created() {
    this.classData = [].concat(this.activity.netClassArr);
  },
  activated() {
    this.classData = [].concat(this.activity.netClassArr);
  },

  methods: {
    ...mapMutations('activity', ['saveActivityProps']),
    addCourseOpen() {
      this.addCourseVisible = true;
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    onClassAdd(courses) {
      let courseArr = courses.map(item => {
        return {
          ...item,
          maxNum: '',
          activityPrice: '',
          OffPrice: 0,
          point: 0
        }
      })
      this.classData = [...this.classData, ...courseArr];
    },
    deleteCourse(classIds) {
      if (classIds && classIds.length) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          for (let cid of classIds) {
            this.classData.splice(
              this.classData.findIndex((item) => item.classId === cid),
              1
            );
          }
          this.$refs.table.clearSelection();
          this.selection = [];
        }).catch(() => {});
      } else {
        this.$message.warning('请选择要删除的课程');
      }
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
        return '';
      }
    },
    save() {
      this.saveActivityProps({
        netClassArr: [].concat(this.classData),
      });
    },
    onForward() {
      return new Promise((resolve, reject) => {
        if (this.classData.length) {
          resolve();
          return;
        } else {
          this.$message.error('请选择主课程');
          reject();
          return;
        }
      });
    },
    getList() {
      this.selection = [];
      this.$refs.table.clearSelection();
    }
  },
};
</script>

<style>
</style>