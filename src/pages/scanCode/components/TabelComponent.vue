<template>
  <div>
    <el-table
      :data="tabelData"
      style="width: 100%"
      border
    >
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        label="渠道"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{scope.row.channelType | filterChannel}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{scope.row.status | filterStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="scope">
          <a
            @click="lookDesc(scope.row)"
            class="blue"
          >{{scope.row.description}}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status===0||scope.row.status===2"
            @click="handleEdit(scope.row)"
            type="text"
            size="small"  v-auth="'VC_EDIT'"
          >修改</el-button>
          <el-button
            v-if="scope.row.status===0"
            @click="handleDelete(scope.row)"
            type="text"
            size="small" v-auth="'VC_DELETE'"
          >删除</el-button>
          <el-button
            v-if="scope.row.status===0||scope.row.status===2"
            @click="handleOnline(scope.row)"
            type="text"
            size="small" v-auth="'VC_ONLINE'"
          >上线</el-button>
          <el-button
            v-if="scope.row.status===1"
            @click="handleOffline(scope.row)"
            type="text"
            size="small" v-auth="'VC_LINEOFF'"
          >下线</el-button>
          <el-button
            v-if="scope.row.status===1&&scope.row.channelType===6"
            class="static-clipboard"
            :data-clipboard-text="scope.row.jumpUrl"
            type="text"
            size="small" v-auth="'VC_COPY'"
          >复制链接</el-button>
          <el-button
            v-if="scope.row.status===1&&scope.row.channelType!==6"
            type="text"
            size="small" v-auth="'VC_DOWN'"
            @click="downloadPic(scope.row.receiveCode,'image')"
          >
            <!-- <a :href="scope.row.receiveCode" download="image">下载</a> -->
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="信息查看"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-form
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="渠道">
          {{codeDeatail.channelType | filterChannel}}
        </el-form-item>
        <el-form-item label="说明">
          {{codeDeatail.description}}
        </el-form-item>
        <el-form-item label="访问次数">
          {{codeDeatail.visitNum}}
        </el-form-item>
        <el-form-item label="修改时间">
          {{codeDeatail.updateDate}}
        </el-form-item>
        <el-form-item label="客服码">
          <img
            class="codeImg"
            v-for="(item, index) in codeDeatail.serviceCode"
            :key="index"
            :src="item"
          >
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { changeStatus, getActivityCodeDetail } from '@/api/scanCode'
  export default {
    props: {
      tabelData: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        dialogVisible: false,
        codeDeatail: {}
      }
    },
    filters: {
      filterChannel(val) {
        let str = ''
        switch (val) {
          case 0:
            str = '全部'
            break
          case 1:
            str = '公众号'
            break
          case 2:
            str = '小程序'
            break
          case 3:
            str = '专题页'
            break
          case 4:
            str = '课程详情'
            break
          case 5:
            str = '一键加群'
            break
          case 6:
            str = '短信链接'
            break
          default:
            str = ''
            break
        }
        return str
      },
      filterStatus(val) {
        let str = ''
        switch (val) {
          case 0:
            str = '未上线'
            break
          case 1:
            str = '已上线'
            break
          case 2:
            str = '已下线'
            break
          case 3:
            str = '删除'
            break
          default:
            str = ''
            break
        }
        return str
      }
    },
    methods: {
      // 下载图片
      downloadPic(url) {
        const img = new Image()
        //解决跨域 canvas污染
        img.setAttribute('crossOrigin', 'anonymous')
        //创建canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        img.onload = function() {
          canvas.width = this.width
          canvas.height = this.height
          ctx.drawImage(this, 0, 0)
          //这里创建一个a标签
          const elt = document.createElement('a')
          //这里要注意转换成dataURI前必须先确保图片成功加载到，所以.toDataURL()方法应该写img的onload事件中。
          elt.setAttribute('href', canvas.toDataURL('image/png'))
          //a标签添加 download 属性 设置想要的图片名称
          elt.setAttribute('download', 'images')
          elt.style.display = 'none'
          document.body.appendChild(elt)
          elt.click()
          //最后删除a标签
          document.body.removeChild(elt)
        }
        img.src = url
      },
      changeStatus(params) {
        changeStatus(params)
          .then(res => {
            if (params.status === 1 || params.status === 2) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
            this.$emit('update')
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      // 查看说明
      lookDesc(row) {
        getActivityCodeDetail({ id: row.id })
          .then(res => {
            this.dialogVisible = true
            this.codeDeatail = res.data[0]
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      },
      // 修改
      handleEdit(row) {
        this.$router.push({
          path: '/activityManagement/createCode',
          query: {
            id: row.id,
            status: row.status
          }
        })
      },
      // 删除
      handleDelete(row) {
        this.$confirm('删除后将不可恢复，确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.changeStatus({ codeId: row.id, status: 3 })
          })
          .catch(() => {
         /*    this.$message({
              type: 'info',
              message: '已取消删除'
            }) */
          })
      },
      // 上线
      handleOnline(row) {
        this.changeStatus({ codeId: row.id, status: 1 })
      },
      // 下线
      handleOffline(row) {
        this.changeStatus({ codeId: row.id, status: 2 })
      }
    }
  }
</script>
<style lang='less' scoped>
  .blue {
    text-decoration: underline;
    color: #409eff;
    cursor: pointer;
  }
  .codeImg {
    width: 80px;
    height: 80px;
    margin-left: 10px;
    float: left;
  }
</style>