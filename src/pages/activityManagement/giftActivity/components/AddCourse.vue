<script>
import AddCourse from '../../components/AddCourse'
import { getGiftActivityClassList } from '@/api/activityManage'
export default {
  extends: AddCourse,
  props: {
    // 1: 主课列表 2: 赠课列表
    filterType: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getList() {
      let params = {
        filterType: this.filterType,
        page: this.page,
        pageSize: this.pageSize
      }
      for (let key in this.form) {
        if (this.form[key] || this.form[key] === 0) {
          params[key] = this.form[key]
        }
      }
      getGiftActivityClassList(params)
        .then(res => {
          if (res.code === 10000) {
            this.gridData = res.data.data;
            this.total = res.data.total;
          }
          this.loading = false;
        })
        .catch(err =>{
          console.log(err)
        });
    },
  }
}
</script>