<template>
  <div>
    <div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="选择阶段" name="first">
          <StageForm @reset="reset" @filter="filterTable"/>
          <div class="content">
            <StageTable :stageMap="stageMap" :tableData="searchData" select @checkedChange="listCheckedChange"/>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`已选阶段(${selectedData.length})`" name="second">
          <div class="content">
            <StageTable :tableData="selectedData" select @checkedChange="listCheckedChange"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="创建新阶段" name="third">
          <CreateStage :netClassIds="netClassIds" @createSuccess="getList" @selectStage="selectStage"/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="batch-align-center">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button :disabled="!selectedData.length" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
// 华图第三区委提醒您
// 代码千万行, 注释第一行,
// 编码不规范, 同事两行泪.
import CreateStage from './components/createStage'
import StageTable from './components/stageTable'
import StageForm from './components//stageForm'
import { tableData } from '../common/mixins'
import batchOperation from '@/api/batchOperation'
import { deepCopy } from '../util'

export default {
  mixins: [ tableData ],
  name: 'step2',
  computed: {
    netClassIds () {
      return this.cacheData.step1.data.map(item => item.id).join(',')
    }
  },
  data () {
    return {
      activeName: 'first',
      page: 1,
      // 表格合并策略
      stageMap: {/* 第几行: 合并几格 */},
      // 缓存的初始数据
      cacheTable: undefined,
      cacheMap: undefined
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 可选参数 m: stageId map
    getList (m) {
      const classesData = this.cacheData.step1.data
      return batchOperation.getNodeInfo({ netClassIds: classesData.map(item => item.id).join(',')}).then(res => {
        const map = this.selectedMap
        const stageMap = {}
        let cnt = 0
        this.cacheTable = this.searchData = res.list.existArr.map(item => {
          stageMap[cnt] = item.stageInfo.length
          cnt += item.stageInfo.length
          return item.stageInfo.map(stage => {
            const d = {
              classId: item.classId,
              title: item.title,
              stageName: stage.stageName,
              id: stage.stageId,
              selected: stage.stageId in map
            }

            // 创建的id
            if (typeof m === 'object') {
              if (d.id in m) {
                d.selected = true
                this.listCheckedChange(d)
              }
            }

            return d
          })
        }).flat()
        this.cacheMap = this.stageMap = stageMap
      })
    },
    selectStage () {
      this.activeName = 'first'
    },
    next () {
      this.$emit('next', {
        key: this.$options.name,
        data: deepCopy(this.selectedData)
      })
    },
    async filterTable ({ key, val}) {
      if (!this.cacheTable)
        await this.getList()
      this.searchData = this.cacheTable.filter(item => ~new String(item[key]).search(val))
      this.stageMap = undefined
    },
    reset () {
      this.searchData = this.cacheTable
      this.cacheMap = this.cacheMap
    }
  },
  components: {
    CreateStage,
    StageTable,
    StageForm,
  }
}
</script>

<style scoped>
.page-box {
  margin: 20px 0;
}
.content {
  min-height: 300px;
}
</style>
