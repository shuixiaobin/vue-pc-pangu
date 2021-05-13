<template>
  <div>
    <div class="container-title flexStart">
      <h2>拼团活动管理</h2>
      <el-button
        @click="createActivity"
        type="primary"
        size="mini" v-auth="'PH_NEW'"
      >创建活动</el-button>
    </div>
    <div class="container">
      <ActivitiesSearch
        inline
        @search="handleSearch"
      />
				
			<ActivitiesTable
				:tableData="tableData"
				@edit="editData"
				@changeStatus="changeStatus"
			/>
      <el-pagination
        class="container-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  /**
   * 华图第三区委提醒您
   * 代码千万行, 注释第一行,
   * 编码不规范, 同事两行泪.
   */
  import ActivitiesSearch from './components/activitiesSearch'
  import ActivitiesTable from './components/activitiesTable'
  import { page } from '@/common/mixins.js'
  import { getAssemble, changeStatus } from '@/api/assemble.js'
  export default {
    mixins: [page],
    data() {
      this.cacheForm = null
      return {
        form: {},
        tableData: []
      }
    },
    activated() {
      if (this.cacheForm) {
        this.getList()
      }
    },
    methods: {
      handleSearch(data) {
        this.cacheForm = data
        this.page = 1
        this.getList()
      },
      createActivity() {
        this.$router.push({
          name: 'groupPurchaseManagement'
        })
      },
      editData(d) {
        this.$router.push({
          name: 'groupPurchaseManagement',
          query: {
            id: d.id
          }
        })
      },
      changeStatus({ data, status }) {
				let date1 = data.endAt;
				let date2 = new Date().getTime(); // 当前时间
				date1 = new Date(date1).getTime(); // 活动结束时间
				
				if(date2 - date1 > 0){
					this.$message.error('活动时间已过，不能上线')
					return;
				}
				
        changeStatus({
          activityId: data.id,
          status
        })
          .then(res => {
            if (res.code === 10000) {
              this.$message.success('操作成功')
              this.getList()
            } else {
              throw new Error(res.msg)
            }
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },
      getList() {
        if (!this.cacheForm) return
        return getAssemble({
          ...this.cacheForm,
          page: this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            this.total = res.data.total
            this.page = res.data.current_page
            this.tableData = res.data.data
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      }
    },
    components: {
      ActivitiesSearch,
      ActivitiesTable
    }
  }
</script>

<style scoped>
</style>
