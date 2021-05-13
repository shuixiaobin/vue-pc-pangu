import { deepCopy } from './util'

export const selectTable = {
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    renderHeader (h) {
      const d = this.tableData.filter(item => !item.disabled)
      return h('div', {
        class: {
          'cell': true
        },
      }, [
        h('el-checkbox', {
          on: {
            change: (data) => {
              this.selectAll(data)
            }
          },
          attrs: {
            value: d.length && d.every(item => item.selected),
            disabled: d.length === 0
          }
        }, '全选'),
      ])
    },
    checkedChange (val) {
      this.$emit('checkedChange', val)
    },
    selectAll (val) {
      this.tableData.forEach(item => {
        if (item.disabled) return
        if (item.selected !== val) {
          item.selected = val
          this.checkedChange(item)
        }
      })
    }
  }
}

export const tableData = {
  computed: {
    selectedData () {
      return Object.values(this.selectedMap).sort((a, b) => b.id - a.id)
    },
  },
  data () {
    return {
      searchData: [],
      selectedMap: {},
      searchParams: {}
    }
  },
  methods: {
    search (params) {
      this.searchParams = Object.freeze(params)
      this.getList()
    },
    // 选择课程checkbox变化
    listCheckedChange (data) {
      if (data.selected) {
        this.$set(this.selectedMap, data.id, data)
      } else {
        this.$delete(this.selectedMap, data.id)
      }
    },
    // 已选课程发生变化
    selectedChange (data) {
      this.$delete(this.selectedMap, data.id)
    },
    getList () {
      throw new Error('getList has not defined')
    },
  }
}

/*
<el-pagination
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
  :current-page="page"
  :page-sizes="pageSizes"
  :page-size="pageSize"
  layout="total, sizes, prev, pager, next, jumper"
  :total="total">
</el-pagination>
*/
export const page = {
  data () {
    return {
      page: 1,
      total: 0,
      pageSize: 10,
      pageSizes: Object.freeze([10, 30, 50, 100, 200]),
    }
  },
  methods: {
    search (params) {
      this.searchParams = Object.freeze(params)
      this.getList()
    },
    handleSizeChange (size) {
      this.page = 1
      this.pageSize = size
      this.getList()
    },
    handleCurrentChange (page) {
      this.page = page
      this.getList()
    },
    getList () {
      throw new Error('getList has not defined')
    }
  }
}
