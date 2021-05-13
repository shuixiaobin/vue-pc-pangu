export const page = {
  data () {
    return {
      page: 1,
      total: 0,
      pageSize: 10,
      pageSizes: Object.freeze([10, 20, 30, 50, 100, 200]),
    }
  },
  methods: {
    search (params) {
      this.searchParams = Object.freeze(params)
      this.getlistData()
    },
    handleSizeChange (size) {
      this.page = 1
      this.pageSize = size
      this.getlistData()
    },
    handleCurrentChange (page) {
      this.page = page
      this.getlistData()
    },
    getList () {
      throw new Error('getList has not defined')
    }
  }
}