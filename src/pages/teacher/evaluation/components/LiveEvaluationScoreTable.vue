<template>
  <el-drawer
    title="直播评价详情"
    size="80%"
    :visible="drawerFlag"
    :before-close="handleClose"
    :wrapperClosable="false"
    class="teacherEvalDrawer"
  >
    <div class="container">
      <div class="desc">
        {{extra.teacherName}} 在【{{extra.courseTitle}}】【{{extra.lessonTitle}}】直播课堂上 该时段共有<span class="green">{{extra.totalCount}}</span>条评价，均分<span class="orange">{{extra.avgScore}}</span>分
      </div>
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        class="mt20"
        :max-height="tableHeight"
      >
        <el-table-column
          prop="id"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="评价用户名"
        >
        </el-table-column>
        <el-table-column
          prop="coursescore"
          label="评分"
        >
        </el-table-column>
        <el-table-column
          prop="courseRemark"
          label="评分内容"
        >
        </el-table-column>
        <el-table-column
          prop="rateDate"
          label="评价时间"
        >
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
  </el-drawer>
</template>

<script>
  import { page } from '@/common/mixins';
  import { getLiveEvalauteDetail } from '@/api/teacher';
  export default {
    mixins: [page],
    props: {
      drawerFlag: {
        type: Boolean,
        default: false
      },
      lessonId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        tableHeight: '',
        extra: {
          courseTitle: '', //课程名称
          lessonTitle: '', //课件名称
          teacherName: '', //教师名称
          totalCount: '', //评论数
          avgScore: '' //平均分
        },
        tableData: []
      };
    },
    watch: {
      drawerFlag(nv, ov) {
        if (nv) {
          this.getList();
        }
      }
    },
    created() {
      this.getTableHeight();
    },
    mounted() {
      let _this = this;
      window.onresize = () => {
        if (_this.resizeFlag) {
          clearTimeout(_this.resizeFlag);
        }
        _this.resizeFlag = setTimeout(() => {
          _this.getTableHeight();
          _this.resizeFlag = null;
        }, 100);
      };
    },
    methods: {
      getTableHeight() {
        let tableH = 360;
        this.tableHeight = window.innerHeight - tableH;
      },
      handleClose() {
        this.page = 1;
        this.$emit('update:drawerFlag', false);
      },
      getList() {
        getLiveEvalauteDetail({
          lessonId: this.lessonId,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            if (res.code == 10000) {
              this.extra = res.data.extra;
              this.tableData = res.data.list;
              this.total = res.data.total;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    beforeRouteLeave(to, from, next) {
      //离开组件的时候触发
      window.onresize = null;
      next();
    }
  };
</script>
<style lang='less' scoped>
  @import '../../../../assets/css/theme-color.less';
  .desc {
    width: 100%;
    height: 40px;
    background: rgba(24, 86, 255, 0.1);
    line-height: 40px;
    text-indent: 16px;
    color: #303133;
    margin-bottom: 10px;
    font-size: 14px;

    i {
      color: @primary;
    }
    .green {
      color: @success;
    }
    .orange {
      color: @warning;
    }
  }
</style>