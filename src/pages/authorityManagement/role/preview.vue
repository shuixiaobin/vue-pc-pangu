<template>
  <div>
      <el-tabs v-model="activeName" class="evaluation" @tab-click="handleClick">
        <el-tab-pane label="功能权限" name="first">
            <el-tree class="tree"
              id="previewTree"
              style="padding:20px"
              ref="treePre"
              :data="menuData"
              show-checkbox
              node-key="id"
              default-expand-all
              :render-content="renderContent"
              :props="defaultProps">
            </el-tree>
            <div id="previewModal"> </div>   
        </el-tab-pane>

        <el-tab-pane label="数据权限" name="second">
              <el-tree
                ref="treeData"
                :data="dataList"
                show-checkbox
                default-expand-all
                node-key="id" 
                :props="dataProps">
              </el-tree>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
  import { getRolePower ,getDataPower} from '@/api/authority'
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'menuName',
          disabled: function(a,b){return a.sign == 1 },
          isLeaf: 'leaf'
        },
        dataProps:{
          children: 'children',
          disabled: function(a,b){return a.sign == 1 },
          label: 'permissionName'
        },
        activeName:'first',
        menuData: [],
        dataList:[],
        selectBegin:[],
        initDataSelected:[],
        allData: {}
      }
    },
    created() {
      this.getList()
    },
    mounted(){
      this.$nextTick(()=>{
          setTimeout(()=>{
              if(this.activeName == 'first'){
                this.changeCss();
                var previewTree = document.getElementById('previewTree') 
                var modalDiv = document.getElementById('previewModal') 
                modalDiv.style.height= previewTree.offsetHeight +'px';
                modalDiv.style.width= previewTree.offsetWidth +'px';  
              }
          },100)
      })
    },
    methods: {
      handleClick(tab, event) {
        if(this.activeName == 'second'){
          this.getDataPower();
        }
      },
      getList() {
        getRolePower(this.$route.query.id).then(res => {
          this.menuData = res.data.panGuMenuVoList
          this.selectBegin = res.data.selectedIds
          this.$refs.treePre.setCheckedKeys(this.selectBegin)
        })
      },
      getDataPower(){
        getDataPower(this.$route.query.id).then(res=>{
          this.dataList= res.data.dataPermissionVoList;
          this.initDataSelected= res.data.selectedIds;
          this.$refs.treeData.setCheckedKeys(this.initDataSelected);
        })
      },
      changeCss() {
        var levelName = document.getElementsByClassName('levelname') // levelname是上面的最底层节点的名字
        for (var i = 0; i < levelName.length; i++) {
          // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
          levelName[i].parentNode.parentNode.parentNode.style.display = 'flex' // 最底层的节点，包括多选框和名字都让他左浮动
          //levelName[i].parentNode.style.styleFloat = 'left'
        }
      },

      renderContent(h, { node, data, store }){
        return (
                data.menuType ==2?
                (
                  <span class="levelname">
                        <span class="treeNode">
                           <i class={data.icon}></i>&nbsp;
                            <span>{node.label}</span>
                        </span>
                  </span>
                ):(
                  <span>
                        <span class="treeNode">
                           <i class={data.icon}></i>&nbsp;
                            <span>{node.label}</span>
                        </span>
                  </span>
                )
              )
      }

    }
  }
</script>

<style>
  .el-tree-node__content  .leafNode{
    display: inline;
  }
  #previewTree .el-checkbox.is-disabled .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    background-color: #BCBCBC;
    border-color: #BCBCBC;
  }
  #previewTree .el-checkbox.is-disabled .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
    border-color:#fff;
  }
</style>

<style lang='less' scoped>
  .tree{
    position: relative;
    background-color:#FFFFFF !important; 
  }
   #previewModal {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    outline: 0;
    -webkit-overflow-scrolling: touch;
    background-color: rgba(0, 0, 0, 0);
    z-index: 9999;
  } 

</style>
