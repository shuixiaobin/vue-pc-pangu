<template>
  <div>
    <div class="container-title">
      <h2 class="box-title">
        <span style="margin-right:20px">{{title}}</span> 套餐课程关联
      </h2>
    </div>
    <div class="container">
      <div class="relevance-search-wrapper">
        <relevance-search
          @updata="updata"
          :isFlag="isFlag"
          :allSwitch="allSwitch"
        ></relevance-search>
      </div>
      <div
        class="course-outline-wrapper"
        v-loading="loading"
      >
        <course-outline
          :isFlag="isFlag"
          :data-source="dataSource"
          @updata="updata"
          @update2="update2"
        ></course-outline>
      </div>
      <relevance-batch-sort
        :isFlag="isFlag"
        :data-source="dataSource"
        ref="relevanceBatchSort"
      ></relevance-batch-sort>
    </div>
  </div>
</template>

<script>
  import { getParams } from '@/config/utils'
  const ERR_OK = 10000
  import relevanceSearch from '@/pages/classRelevance/components/relevanceSearch'
  import courseOutline from '@/pages/classRelevance/components/courseOutline'
  import relevanceBatchSort from '@/pages/classRelevance/components/relevanceBatchSort' // 批量排序
  export default {
    data() {
      return {
        dataSource: null,
        netClassId: getParams('netClassId'), //课程id
        title: decodeURI(getParams('title')),
        loading: true,
        isFlag: null, //判断搜索关联标识
        rowData: null, //表格当前点击项
        allSwitch: {
          all_switch_display: 0,
          all_switch_status: 0
        }
      }
    },
    components: {
      relevanceSearch,
      courseOutline,
      relevanceBatchSort
    },
    created() {
      eventBus.$on('updata', () => {
        this.loading = true
        this.getCourseOutline()
      })
      this.getCourseOutline()
    },
    methods: {
      updata(row) {
        this.loading = true
        this.getCourseOutline(row)
      },
      update2(openedIds) {
        this.loading = true
        this.myGet(`${PHP_URL}/v4/pc/syllabus/get_syllabus_list`, {
          netClassId: this.netClassId
        }).then(result => {
          this.loading = false
          this.allSwitch.all_switch_display = result.data.all_switch_display
          this.allSwitch.all_switch_status = result.data.all_switch_status
          let list = result.data.list
          if (result.code === ERR_OK) {
            list.forEach((item, i) => {
              if (item.type === 0) {
                item.isGL = true
              }
              if (i === 0) {
                item.move = 1
              } else if (i === list.length - 1) {
                item.move = 3
              } else {
                item.move = 2
              }
              if (item.children) {
                this.recursion(item.children)
              }
            })
            this.dataSource = list

            let item = this.dataSource[0]

            if (item.parent_id === 0 && item.type === 0) {
              // 三级
              this.isFlag = 0
            } else if (item.parent_id === 0 && item.type === 1) {
              // 二级
              this.isFlag = 1
            } else if (item.parent_id === 0 && item.type === 2) {
              // 一级
              this.isFlag = 2
            }

            this.dataSource = this.formateDataSource(
              openedIds,
              this.dataSource,
              0
            )
          } else if (result.code === -1) {
            this.isFlag = null
            this.dataSource = list
          }
        })
      },
      formateDataSource(openedIds, arr, level) {
        const ret = []
        arr.forEach(item => {
          item._level = level
          ret.push(item)
          if (openedIds.indexOf(item.id) > -1) {
            item._expanded = true
            ret.push(
              ...this.formateDataSource(openedIds, item.children, level + 1)
            )
          }
        })
        return ret
      },
      // 获取课程大纲
      getCourseOutline(row) {
        this.myGet(`${PHP_URL}/v4/pc/syllabus/get_syllabus_list`, {
          netClassId: this.netClassId
        })
          .then(result => {
            this.loading = false
            this.allSwitch.all_switch_display = result.data.all_switch_display
            this.allSwitch.all_switch_status = result.data.all_switch_status
            let list = result.data.list
            if (result.code === ERR_OK) {
              list.forEach((item, i) => {
                if (item.type === 0) {
                  item.isGL = true
                }
                if (i === 0) {
                  item.move = 1
                } else if (i === list.length - 1) {
                  item.move = 3
                } else {
                  item.move = 2
                }
                if (item.children) {
                  this.recursion(item.children)
                }
              })
              this.dataSource = list

              let item = this.dataSource[0]

              if (item.parent_id === 0 && item.type === 0) {
                // 三级
                this.isFlag = 0
              } else if (item.parent_id === 0 && item.type === 1) {
                // 二级
                this.isFlag = 1
              } else if (item.parent_id === 0 && item.type === 2) {
                // 一级
                this.isFlag = 2
              }
            } else if (result.code === -1) {
              this.isFlag = null
              this.dataSource = list
            }
            //禁止大纲收缩
            if (row && row.type == 1) {
              list.forEach((item, index) => {
                if (item.children) {
                  item.children.forEach((item2, index2) => {
                    item2._expanded = false
                    item2._level = 1
                    if (row.id == item2.id) {
                      item._expanded = true
                      list.splice(index + 1, 0, ...item.children)
                    }
                  })
                }
              })
              this.dataSource = list
            } else if (row && row.type == 2 && row.parent_id > 0) {
              list.forEach((item, index) => {
                if (item.children) {
                  item.children.forEach((item2, index2) => {
                    item2._expanded = false
                    item2._level = 1
                    if (row.id == item2.id && item.parent_id == 0) {
                      item._expanded = true
                      list.splice(index + 1, 0, ...item.children)
                    } else {
                      if (item2.children) {
                        item2.children.forEach((item3, index3) => {
                          item3._expanded = false
                          item3._level = 2
                          if (row.id == item3.id) {
                            item._expanded = true
                            item2._expanded = true
                            list.splice(index + 1, 0, ...item.children)
                            if (list.indexOf(item2) > -1) {
                              let i = list.indexOf(item2)
                              list.splice(i + 1, 0, ...item2.children)
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
              this.dataSource = list
            }
          })
          .catch(err => {
            this.loading = false
            this.$message.error(err.message)
          })
      },
      setSpaceIcon(data, level) {
        // 设置第一列的空格和方向按钮
        let _level = 0
        data.forEach(value => {
          value._expanded = false
          if (level !== undefined && level !== null) {
            _level = level + 1
          } else {
            _level = 1
          }
          value._level = _level
          if (value.children && value.children.length > 0) {
            this.setSpaceIcon(value.children, _level)
          }
        })
        return data
      },
      recursion(arr) {
        arr.forEach((item, i) => {
          item.isGL = false
          if (arr.length === 1) {
            item.move = 4
          } else {
            if (i === 0) {
              item.move = 1
            } else if (i === arr.length - 1) {
              item.move = 3
            } else {
              item.move = 2
            }
          }
          if (item.children) {
            return this.recursion(item.children)
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .course-outline-wrapper {
    margin-top: 20px;
  }
</style>
