<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column
        align="center"
        prop="subjectName"
        label="科目"
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="模考名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="areaNames"
        align="center"
        width="200"
        label="地区">
      </el-table-column>
      <el-table-column
        prop="activityTime"
        align="center"
        label="活动时间">
      </el-table-column>
      <el-table-column
        prop="examTime"
        align="center"
        label="考试时间">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        align="center"
        width="120"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        align="center"
        width="120"
        label="操作">
        <template slot-scope="{row}">
          <el-button v-if="!row.selected" :disabled="disabled" type="text" @click="addExam(row)">加入</el-button>
          <el-button v-else type="text" @click="removeExam(row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AreaDialog ref="dialog" @confirm="confirm"/>
  </div>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import AreaDialog from './areaDialog'
import { getAreaList } from '@/api/addExam.js'

export default {
  props: ['tableData', 'subject', 'disabled'],
  data () {
    this.cacheAreas = {}
    return {
      areaList: []
    }
  },
  methods: {
    getAreaList () {
      const subject = this.subject
      if (subject in this.cacheAreas) {
        return Promise.resolve(this.cacheAreas[subject])
      }

      return getAreaList({subject}).then(res => {
        const d = res.data.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }).filter(item => item.value !== 100000)
        this.cacheAreas[subject] = d
        return d
      })
    },
    confirm (data) {
      this.$emit('confirm', data)
    },
    showMessageBox (data, areas) {
      this.$refs.dialog.show(data, areas)
    },
    addExam (row) {
      const areas = row.areaIds.split(',')
      const d = {
        id: row.id,
      }
      if (areas.length === 1) {
        if (row.areaIds === '-9') {
          // 全部可选
          this.getAreaList().then(res => {
            this.showMessageBox(d, res)
          })
        } else {
          // 只有一个省
          this.confirm({...d, areaId: Number(row.areaIds)})
        }
      } else {
        // 从当前省里选
        this.showMessageBox(d, row.areaNames.split(',').map((name, index) => {
          return {
            label: name,
            value: areas[index]
          }
        }))
      }
    },
    removeExam (row) {
      this.$emit('removeExam', row)
    }
  },
  components: {
    AreaDialog,
  }
}
</script>