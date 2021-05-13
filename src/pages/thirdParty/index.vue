<template>
  <div>
    <div class="container-title">
      <h3>第三方合作管理</h3>
      <div class="btnGroup">
        <el-button
          type="primary"
          size="mini"
          @click="addPartnerFn"
        >新增合作方</el-button>
        <el-button
          type="danger"
          plain
          size="mini"
          @click="deleteParnter"
        >删除合作方</el-button>
      </div>
    </div>
    <div class="container">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in parnterList"
          :key="item.id"
          :label="item.parnter_name"
          :name="String(item.id)"
        >
          <ThirdPartyItem
            v-if="String(item.id)===activeName"
            @showPartner="showPartner"
            :partnerId="activeName"
            :userName="userName"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <add-partner
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :partnerId="activeName"
      :userName="userName"
      :lookConfig.sync="lookConfig"
      @updateFn="updatePartnerListFn"
    ></add-partner>
  </div>
</template>

<script>
  import { parnterList, deletePartner } from '@/api/thirdParty'
  import AddPartner from './components/addPartner'
  import ThirdPartyItem from './components/thirdPartyItem'
  export default {
    data() {
      return {
        dialogVisible: false,
        activeName: '',
        parnterList: [],
        lookConfig: false
      }
    },

    components: {
      ThirdPartyItem,
      AddPartner
    },
    mounted() {
      this.getPartnerList()
    },
    computed: {
      userName() {
        return localStorage.getItem('userName')
        //return 'app_ztk2058930230'
      }
    },
    methods: {
      async deletePartnerFn() {
        const res = await deletePartner({ parnterId: this.activeName }).catch(err => {
          this.$message.error(err.message)
        })
        this.$message.success('删除成功')
        this.getPartnerList()
      },
      // 添加新增合作方回调
      updatePartnerListFn() {
        this.dialogVisible = false
        this.getPartnerList()
      },
      showPartner() {
        this.lookConfig = true
        this.dialogVisible = true
      },
      async getPartnerList() {
        const res = await parnterList({
          userName: this.userName
        }).catch(err => {
          this.$message.error(err.message)
        })
        this.parnterList = res.data
        this.activeName = String(this.parnterList[0].id)
      },
      // 新增合作方
      addPartnerFn() {
        this.dialogVisible = true
      },
      // 删除合作方
      deleteParnter() {
        this.$confirm('删除后推荐课程全部清空，相应配置取消（历史订单不受影响）。确定删除合作方？', '提示')
          .then(_ => {
            this.deletePartnerFn()
          })
          .catch(_ => {})
      }
    }
  }
</script>
<style lang='less' scoped>
  .thirdParty {
    padding: 20px;
    header {
      display: flex;
      justify-content: space-between;
    }
  }
</style>