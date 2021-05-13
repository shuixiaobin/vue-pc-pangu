/**
 * <el-pagination
        style="display:flex;justify-content: center;margin-top: 20px;"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @current-change="currentChange"
      >
    </el-pagination>
 */
export const pageMixin = {
  data() {
    return {
      page: 1,
      pageSize: 5,
      total: 0,
      listData: []
    };
  },
  watch: {
    page: {
      handler(val) {
        this.getListData();
      },
      immediate: true
    }
  },
  methods: {
    currentChange(val) {
      this.page = val;
    }
  }
};
