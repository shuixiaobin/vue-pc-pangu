<template>
  <div>
    <div class="container-title">
      <h2>选择赠课</h2>
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
          sortable
          sort-by="price"
          width="150"
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
          sortable
          width="180"
        ></el-table-column>
        <el-table-column
          property="timestamp"
          label="最近修改"
          sortable
          width="180"
        ></el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="deleteCourse([scope.classId])">
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
    <div class="container-title">
      <h2>赠课时效设置</h2>
    </div>
    <div class="container">
      <el-form
        :model="form"
        size="small"
        label-position="top"
        :rules="rules"
        inline
        ref="form"
        class="form-flex"
      >
        <el-form-item
          prop="validPeriodType"
          label="类型"
        >
          <el-select v-model="form.validPeriodType" placeholder="请选择">
            <el-option value="num" label="赠送课程有效周期"/>
            <el-option value="time" label="赠送课程到期时间"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.validPeriodType == 'num'"
          prop="validPeriodNum"
          label="赠送课程有效周期"
        >
          <el-input
            v-model="form.validPeriodNum"
            :disabled="form.validPeriodType !== 'num'"
            style="width: 300px"
            v-input-filter:number
            @blur="form.validPeriodNum = parseInt(form.validPeriodNum) || ''"
          />
        </el-form-item>
        <el-form-item
          v-else-if="form.validPeriodType == 'time'"
          prop="validPeriodTime"
          label="赠送课程到期时间"
        >
          <el-date-picker
            v-model="form.validPeriodTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="form.validPeriodType !== 'time'"
            style="width: 300px"
          >
          </el-date-picker>
          <span class="form-item-tip"
            >指定赠送课程的到期时间，所有用户统一</span
          >
        </el-form-item>
      </el-form>
    </div>
    <AddCourse
      :visible.sync="addCourseVisible"
      :filterType="2"
      :selectedClass="classData"
      @addCourse="onClassAdd"
    >
    </AddCourse>
  </div>
</template>

<script>
import AddCourse from './AddCourse';
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
    let validPeriodNumValidator = (rule, value, callback) => {
      if (
        this.form.validPeriodType === 'num' &&
        !parseInt(this.form.validPeriodNum)
      ) {
        callback(new Error('请输入赠送课程有效周期'));
      } else {
        callback();
      }
    };
    let validPeriodTimeValidator = (rule, value, callback) => {
      if (this.form.validPeriodType === 'time' && !this.form.validPeriodTime) {
        callback(new Error('请选择赠送课程到期时间'));
      } else if (
        this.activity.endTime &&
        new Date(value).getTime() < new Date(this.activity.endTime).getTime()
      ) {
        callback(new Error('赠课到期时间不能小于活动结束时间 ' + this.activity.endTime));
      } else {
        callback();
      }
    };
    return {
      addCourseVisible: false,
      classData: [],
      selection: [],
      form: {
        validPeriodType: 'num',
        validPeriodNum: '',
        validPeriodTime: '',
      },
      rules: {
        validPeriodType: [
          {required: true, trigger: 'blur' },
        ],
        validPeriodNum: [
          {required: true, validator: validPeriodNumValidator, trigger: 'blur' },
        ],
        validPeriodTime: [
          {required: true, validator: validPeriodTimeValidator, trigger: 'blur' },
        ],
      }
    };
  },

  computed: {
    ...mapGetters('activity', { activity: 'getActivity' }),
    pagedData () {
      return this.classData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    }
  },

  created() {
    this.initFormData();
  },
  activated() {
    this.initFormData();
  },

  methods: {
    ...mapMutations('activity', ['saveActivityProps']),
    initFormData() {
      if (this.activity) {
        this.form.validPeriodType = this.activity.validPeriodType;
        this.form.validPeriodTime = this.activity.validPeriodTime;
        this.form.validPeriodNum = this.activity.validPeriodNum;
        this.classData = [].concat(this.activity.giftClassArr);
      }
    },
    addCourseOpen() {
      this.addCourseVisible = true;
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    onClassAdd(courses) {
      this.classData = [...this.classData, ...courses];
    },
    deleteCourse(classIds) {
      if (classIds && classIds.length) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            for (let cid of classIds) {
              this.classData.splice(
                this.classData.findIndex((item) => item.classId === cid),
                1
              );
            }
            this.$refs.table.clearSelection();
            this.selection = [];
          })
          .catch(() => {});
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
        giftClassArr: [].concat(this.classData),
        validPeriodType: this.form.validPeriodType,
        validPeriodTime: this.form.validPeriodTime,
        validPeriodNum: this.form.validPeriodNum,
      });
    },
    onForward() {
      return this.$refs.form.validate().then(() => {
        if (this.classData.length) {
          return true;
        } else {
          this.$message.error('请选择赠课');
          return Promise.reject();
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

<style lang="less" scoped>
.form-flex {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    flex: 1 0 40%;
  }
}
.form-item-tip {
  margin-left: 15px;
  font-size: 12px;
  color: grey;
}
</style>