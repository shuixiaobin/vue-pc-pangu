import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
// 活动列表页通用混入
export const activityIndexMixin = {
  data() {
    return {
      tableData: [],
      selection: [], //记录表格多选选择项
      sortProp: '',
      sortOrder: null,
      loading: false //表格加载
    };
  },
  computed: {
    selectionIds() {
      return this.selection.map(item => item.activityId);
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 根据type 返回相应的请求方法
    getXhrFun(type) {
      // {
      //   getList: 获取列表,
      //   online: 上线,
      //   offline: 下线,
      //   delete: 删除,
      //   deleteBatch: 批量删除
      // }
      // return {}[type]
      return () => Promise.resolve();
    },
    getList() {
      let searchData = this.$refs.search.getSearchData();
      this.getXhrFun('getList')({
        ...searchData,
        page: this.page,
        pageSize: this.pageSize,
        weight: this.sortOrder || undefined,
        orders: this.sortOrder ? this.sortProp : undefined
      })
        .then(res => {
          if (res.code == 10000) {
            this.$refs.table.clearSelection();
            this.selection = [];
            this.tableData = res.data.data;
            this.total = res.data.total;
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSortChange({ prop, order }) {
      switch (prop) {
        case 'startTime':
          this.sortProp = 1;
          break;
        case 'endTime':
          this.sortProp = 2;
          break;
        case 'createTime':
          this.sortProp = 3;
          break;
      }
      this.sortOrder = order ? (order == 'ascending' ? 'ASC' : 'DESC') : '';
      this.getList();
    },
    editVisible(activity) {
      // 未上线时显示编辑
      return activity.activityStatus === 0;
    },
    viewVisible(activity) {
      // 已上线 和 已下线时显示查看
      return activity.activityStatus === 1 || activity.activityStatus === 2;
    },
    onlineVisible(activity) {
      // 未上线时可以上线
      return activity.activityStatus === 0;
    },
    offlineVisible(activity) {
      // 已上线时可以下线
      return activity.activityStatus === 1;
    },
    deleteVisible(activity) {
      // 已上线活动给出特殊提示 仍可删除
      return true
    },
    // 活动上线
    activityOnline(idArr, row) {
      if (row && new Date(row.endTime).getTime() <= new Date().getTime()) {
        // 单个操作校验
        this.$message.error('活动结束时间已过，请修改时间后再上线');
        return;
      }
      if (!idArr.length) {
        this.$message.warning('请勾选活动');
        return;
      } else if (this.selection.find(item => !this.onlineVisible(item))) {
        // 存在不符合上线条件的活动
        this.$message.error('已选活动包含“已上线”或“已下线”的活动，不允许重新上线');
        return;
      } else if (this.selection.find(item => new Date(item.endTime).getTime() <= new Date().getTime())){
        this.$message.error('已选活动中包含活动结束时间已过的活动，请修改时间后再上线');
        return;
      }
      this.getXhrFun('online')({ activityId: idArr.join(',') })
        .then(res => {
          if (res.code === 10000) {
            this.getList();
            if (idArr.length === 1 && row && row.activityName) {
              this.$message.success(`${row.activityName} 已上线`);
            } else {
              this.$message.success(`${idArr.length}个所选活动已上线`);
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 活动下线
    activityOffline(idArr, row) {
      let activityName = row ? row.activityName : null;
      if (!idArr.length) {
        this.$message.warning('请勾选活动');
        return;
      } else if (this.selection.find(item => !this.offlineVisible(item))) {
        // 存在不符合下线条件的活动
        this.$message.error('已选活动包含“已下线”或“未上线”的活动，请检查');
        return;
      }
      this.getXhrFun('offline')({ activityId: idArr.join(',') }).then(res => {
        if (res.code === 10000) {
          this.getList();
          if (idArr.length === 1 && activityName) {
            this.$message.success(`${activityName} 已下线`);
          } else {
            this.$message.success(`${idArr.length}个所选活动已下线`);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 活动删除
    activityDelete(activities) {
      let delFn = null;
      let params = {};
      let comfirmText = '确定要删除吗？';
      if (!activities.length) {
        this.$message.warning('请选择活动');
        return;
      } else if (activities.length === 1) {
        delFn = this.getXhrFun('delete');
        params = { activityId: activities[0].activityId };
        if (activities[0].activityStatus == 1) {
          comfirmText = '该活动已上线还未结束，删除有风险，确定要删除吗？';
        }
      } else {
        delFn = this.getXhrFun('deleteBatch');
        params = {
          activityIds: activities.map(item => item.activityId).join(',')
        };
        if (activities.find(item => item.activityStatus == 1)) {
          comfirmText =
            '已选活动中含有已上线还未结束的活动，删除有风险，确定要删除吗？';
        }
      }
      this.$confirm(comfirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delFn(params)
            .then(res => {
              if (res.code === 10000) {
                this.getList();
                this.$message.success(`活动已成功删除`);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    toActivityAdd() {
      this.$router.push({ path: `${this.$route.path}/add` });
    },
    toEdit(activityId) {
      this.$router.push({ path: `${this.$route.path}/edit/${activityId}` });
    },
    toView(activityId) {
      this.$router.push({ path: `${this.$route.path}/view/${activityId}` });
    },
    toCopy(activityId) {
      this.$router.push({ path: `${this.$route.path}/copy/${activityId}` });
    }
  }
};
export const activityAddMixin = {
  props: {
    // 由路由注入的页面类型 add: 新建 edit: 编辑 copy: 复制
    type: {
      type: String,
      default: 'add'
    },
    // 编辑状态下 由路由注入的活动id
    activityId: String
  },
  data() {
    return {
      activityModule: '', // 模块名称
      ActivityClass: function() {}, // 活动对象构造函数
      loading: false,
      stepComponents: [] // 步骤组件列表，由组件覆写
    };
  },
  computed: {
    ...mapGetters({
      activity: 'activity/getActivity'
    }),
    ...mapState(['username']),
    submitName() {
      switch (this.type) {
        case 'add':
          return '创建';
        case 'edit':
          return '修改';
        case 'copy':
          return '复制';
        default:
          return '';
      }
    }
  },
  watch: {
    $route(to, from) {
      if (
        to.name == this.activityModule + 'Add' ||
        to.name == this.activityModule + 'Edit' ||
        to.name == this.activityModule + 'Copy'
      ) {
        this.init();
      }
    }
  },
  created() {
    this.init();
  },

  methods: {
    ...mapMutations('activity', ['saveActivity', 'clearActivity']),
    ...mapActions('activity', ['loadActivity']),
    init() {
      // 数据初始化
      this.$refs.stepView && this.$refs.stepView.goStep(1);
      this.clearActivity();
      if (this.type == 'add') {
        // 新建时 创建新活动对象 存到vuex
        this.saveActivity(new this.ActivityClass(this.username));
      } else {
        // 编辑和复制时 用action获取活动详情 存到vuex
        this.loading = true;
        this.loadActivity({
          loadFun: () =>
            this.getXhrFun('detail')({ activityId: this.activityId }),
          makeUp: this.ActivityClass.makeupActivity,
          user: this.type == 'copy' ? this.username : undefined
        })
          .then(() => {
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            this.$message.error(err.message);
            this.$router.push({ name: this.activityModule });
          });
      }
    },
    // 根据type 返回相应的请求方法 由组件重写
    getXhrFun(type) {
      // {
      //   create: 活动创建,
      //   update: 活动修改,
      //   detail: 获取活动详情
      // }
      // return {}[type]
      return () => Promise.resolve();
    },
    submit() {
      if (this.type == 'add' || this.type == 'copy') {
        this.createActivity();
      } else {
        this.updateActivity();
      }
    },
    createActivity() {
      // 创建活动 和 复制活动
      let params = this.ActivityClass.toParam(this.activity);
      this.getXhrFun('create')(params)
        .then(res => {
          if (res.code === 10000) {
            this.$message.success('活动创建成功');
            this.$router.push({ name: this.activityModule });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateActivity() {
      // 修改活动
      let params = this.ActivityClass.toUpdateParam(this.activity);
      this.getXhrFun('update')(params)
        .then(res => {
          if (res.code === 10000) {
            this.$message.success('活动修改成功');
            this.$router.push({ name: this.activityModule });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
