<template>
  <div>
    <div class="container-title">
      <h2>编辑权限</h2>
    </div>

    <el-card class="box-card cardPower">
      <div style="font-size:15px;margin-bottom:15px;">
        <h2>已选角色：{{$route.query.name}}</h2>
      </div>
      <el-tabs v-model="activeName"
        class="evaluation edit-power"
        @tab-click="handleClick">
        <el-tab-pane label="功能权限"
          name="first"
          class="cardTab">
          <el-tree class="tree"
            ref="tree"
            :data="menuData"
            getCheckedKeys
            show-checkbox
            node-key="id"
            :props="defaultProps">
          </el-tree>
          <div class="btn-wrapper">
            <el-button type="primary"
              size="small"
              class="submit"
              @click="submit">提交</el-button>
            <el-button type="primary"
              size="small"
              class="cancel"
              @click="cancel">取消</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据权限"
          name="second"
          class="cardTab">
          <el-tree ref="treeData"
            :data="dataList"
            show-checkbox
            node-key="id"
            :props="dataProps">
          </el-tree>
          <div class="btn-wrapper">
            <el-button type="primary"
              size="small"
              class="submit"
              @click="submitData">提交</el-button>
            <el-button type="primary"
              size="small"
              class="cancel"
              @click="cancel">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>
<script>
  import { getRolePower, saveRole, getDataPower, saveDataPower } from '@/api/authority'
  import Util from '@/common/util.js'
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'menuName'
        },
        dataProps: {
          children: 'children',
          label: 'permissionName'
        },
        activeName: 'first',
        initDataSelected: [],
        dataList: [],
        loading: false,
        ids: [],
        dataIds: [], 
        isDataGl: true,
        selectBegin: [],
        menuData: [], //菜单权限
      }
    },
    props: ['roleId'],
    created() {
      this.getList()
      //数组比较
    },
    mounted() {},
    methods: {
      getList() {
        getRolePower(this.$route.query.id).then(res => {
          this.menuData = res.data.panGuMenuVoList
          this.selectBegin = res.data.selectedIds;
          this.$refs.tree.setCheckedKeys(this.selectBegin);
        })
      },
      handleClick(tab, event) {
        if (this.activeName == 'second') {
          this.getDataPower()
        }
      },
      submit() {
        //功能权限提交
        this.ids = this.$refs.tree.getCheckedNodes(false, true);
        var selectIds = [];
        this.ids.map(item => { selectIds.push(item.id) });
        console.log(this.$refs.tree.getCheckedNodes(false, true))
        saveRole({
          roleId: this.$route.query.id,
          selectIds: selectIds
        }).then(res => {
          if (res.code == 1000000) {
            this.$message.success('提交成功!')
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      getDataPower() {
        getDataPower(this.$route.query.id).then(res => {
          this.dataList = res.data.dataPermissionVoList
          this.initDataSelected = res.data.selectedIds
          this.$refs.treeData.setCheckedKeys(this.initDataSelected)
        })
      },

      submitData() {
        //数据权限提交
        this.dataIds = this.$refs.treeData.getCheckedNodes(false, true);
        var selectDatas = [];
        this.dataIds.map(item => { selectDatas.push(item.id) });
        saveDataPower({
          roleId: this.$route.query.id,
          permissionType: 1,
          selectIds: selectDatas
        }).then(res => {
          if (res.code == 1000000) {
            this.$message.success('提交成功!')
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      cancel() {
        this.$router.back(-1)
      },
/*       findIds(ary) {
        for (var i in ary) {
          ary[i].frontToolName ? this.ids.push(ary[i].id) : ''
          if (ary[i].children) {
            this.findIds(ary[i].children)
          }
        }
      },

      findDataIds(aay) {
        for (var a in aay) {
          aay[a].frontToolName ? this.dataIds.push(aay[a].id) : ''
          if (aay[a].children) {
            this.findDataIds(aay[a].children)
          }
        }
      } */
    }
  }
</script>
<style lang='less' scoped>
  .cardPower {
    margin-top: 16px;
    min-height: 550px;
  }
  .btn-wrapper {
    margin-top: 20px;
    text-align: center;
  }
</style> 