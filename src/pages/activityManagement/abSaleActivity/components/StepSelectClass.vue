<template>
  <div>
    <div class="container-title">
      <h2>选择A课程</h2>
    </div>
    <div class="container">
      <div class="mb16">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="addCourseOpen('a')"
        >
          新增
        </el-button>
      </div>
      <el-table
        ref="table"
        :data="classAList"
        row-key="classId"
      >
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
          property="actualPrice"
          label="实际价格(￥)"
          width="100"
        >
          <template #default="scope">
            <span>{{ scope.row.actualPrice }}</span>
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
          <template #default>
            <el-button type="text" @click="deleteCourse('a')">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container-title mt20">
      <h2>选择B课程</h2>
    </div>
    <div class="container">
      <div class="mb16">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="addCourseOpen('b')"
        >
          新增
        </el-button>
      </div>
      <el-table
        ref="table"
        :data="classBList"
        row-key="classId"
      >
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
          property="actualPrice"
          label="实际价格(￥)"
          width="100"
        >
          <template #default="scope">
            <span>{{ scope.row.actualPrice }}</span>
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
          <template #default>
            <el-button type="text" @click="deleteCourse('b')">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddCourse
      :visible.sync="addCourseVisible"
      :selectedClass="classType == 'a' ? classAList : classBList"
      :listRequest="classListRequest"
      singleSelect
      @addCourse="onClassAdd"
    >
      <template #default>
        <el-table-column
          property="actualPrice"
          label="实际价格"
          width="100"
        >
          <template #default="{row}">
            ￥{{row.actualPrice}}
          </template>
        </el-table-column>
      </template>
    </AddCourse>
  </div>
</template>

<script>
import AddCourse from '../../components/AddCourse';
import { mapGetters, mapMutations } from 'vuex';
import { getAbSaleActivityClassList } from '@/api/activityManage'

export default {
  components: {
    AddCourse,
  },

  props: {
    type: [Number, String],
  },

  data() {
    return {
      classListRequest: getAbSaleActivityClassList,
      addCourseVisible: false,
      classA: null,
      classB: null,
      // 记录新增课程的类型
      classType: 'a',
    };
  },

  computed: {
    ...mapGetters('activity', { activity: 'getActivity' }),
    classAList () {
      return this.classA ? [this.classA] : [];
    },
    classBList () {
      return this.classB ? [this.classB] : [];
    }
  },

  created() {
    this.classA = this.activity.classA;
    this.classB = this.activity.classB;
  },
  activated() {
    this.classA = this.activity.classA;
    this.classB = this.activity.classB;
  },

  methods: {
    ...mapMutations('activity', ['saveActivityProps']),
    addCourseOpen(classType) {
      this.classType = classType;
      this.addCourseVisible = true;
    },
    onClassAdd(courseArr) {
      let course = courseArr[0];
      if (this.classType == 'a') {
        if (this.classB && course.classId == this.classB.classId) {
          this.$message.error('A课与B课不能为同一个');
          return;
        }
        this.classA = course;
        return;
      } else {
        if (this.classA && course.classId == this.classA.classId) {
          this.$message.error('A课与B课不能为同一个');
          return;
        }
        this.classB = course;
        return;
      }
    },
    deleteCourse(classType) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (classType == 'a') {
          this.classA = null;
        } else {
          this.classB = null;
        }
      }).catch(() => {});
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
      // 判断b课是否变更，变更后应清除优惠信息
      if (!this.activity.classB || this.classB.classId == this.activity.classB.classId) {
        this.saveActivityProps({
          classA: this.classA,
          classB: this.classB,
        });
      } else {
        this.saveActivityProps({
          classA: this.classA,
          classB: this.classB,
          sale: 0,
          activityPrice: ''
        });
      }
    },
    onForward() {
      return new Promise((resolve, reject) => {
        if (this.classA && this.classB) {
          resolve();
          return;
        } else {
          this.$message.error('请选择课程');
          reject();
          return;
        }
      });
    },
  },
};
</script>

<style>
</style>