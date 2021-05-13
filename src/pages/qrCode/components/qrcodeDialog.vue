<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    width="500px"
  >
    <el-form ref="form" :model="qrCodeData" label-width="80px">
      <el-form-item prop="serviceNum" label="服务号" required :show-message="false">
        <el-select :disabled="type !== 0" v-model="qrCodeData.serviceNum">
          <el-option v-for="(item, index) in serviceList" :label="item.label" :value="item.value" :key="index" />
        </el-select>
      </el-form-item>
      <el-form-item prop="channelName" label="渠道名" required :show-message="false">
        <el-input style="max-width: 500px;" :disabled="type !== 0" :maxlength="50" v-model="qrCodeData.channelName" type="text" />
      </el-form-item>
      <el-form-item label="客服消息" prop="costomerMessage" required :show-message="false">
        <el-input style="max-width: 500px" :disabled="type === 2" type="textarea" v-model="qrCodeData.costomerMessage"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import SearchForm from './searchForm'
import { userName } from '@/common/global'
import {getServiceList} from '@/api/qrCode.js'
import { createQrcode, editQrcode, removeQrcode } from '@/api/qrCode.js'
function defaultData () {
  return {
    serviceNum: 1,
    channelName: '',
    costomerMessage: '',
    serviceId: undefined
  }
}
export default {
  data () {
    return {
      type: 0, // 0新建 1修改 2删除
      dialogVisible: false,
      qrCodeData: defaultData(),
      serviceList: [],
    }
  },
  created () {
    this.getServiceList()
  },
  computed: {
    title () {
      switch (this.type) {
        case 0:
          return '新建二维码'
        case 1:
          return '编辑二维码'
        case 2:
          return '删除二维码'
      }
    }
  },
  methods: {
     getServiceList () {
      getServiceList().then(res => {
        if (res.code !== 10000) throw new Error(res.msg)
        this.serviceList = res.data.map(item => {
          return {
            label: item.serviceName,
            value: item.serviceId
          }
        })
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    show () {
      this.$nextTick(() => {
        this.dialogVisible = true
      })
    },
    hide () {
      this.dialogVisible = false
    },
    createQrcode () {
      this.type = 0
      this.qrCodeData = defaultData()
      this.show()
    },
    editQrcode (data) {
      this.type = 1
      this.showData(data)
      this.show()
    },
    removeQrcode (data) {
      this.type = 2
      this.showData(data)
      this.show()
    },
    showData (data) {
      const d = defaultData()
      Object.keys(d).forEach(prop => d[prop] = data[prop])
      this.qrCodeData = d
    },
    confirm () {
      if (this.type === 2) {
        return this.fetchData().then(res => {
          if (res.code === 10000) {
            this.$emit('confirm')
            this.hide()
          } else {
            throw new Error(res.msg)
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
      this.$refs.form.validate(v => {
        if (v) {
          this.fetchData().then(res => {
            if (res.code === 10000) {
              this.$emit('confirm')
              this.hide()
            } else {
              throw new Error(res.msg)
            }
          }).catch(e => {
            this.$message.error(e.message)
          })
        }
      })
    },
    cancel () {
      this.hide()
    },
    fetchData () {
      const {
        channelName,
        costomerMessage,
        serviceNum,
        serviceId
      } = this.qrCodeData
      switch (this.type) {
        case 0:
          return createQrcode({
            channelName,
            costomerMessage,
            serviceNum,
            userName
          })
        case 1:
          return editQrcode({
            serviceId,
            costomerMessage,
          })
        case 2:
          return removeQrcode({
            serviceId,
            status: 1
          })
        default:
          throw new Error('未知操作类型')
      }
    }
  },
  components: {
    SearchForm,
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>
