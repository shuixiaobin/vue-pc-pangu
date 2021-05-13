<template>
  <el-dialog
    title="赠送课程"
    :visible.sync="visible"
    width="800px"
    @close="handleClose">
    <div>
      <el-select v-model="type" style="width: 150px" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input style="width: 250px" v-model="text"></el-input>
      <el-select v-model="status" style="width: 150px" placeholder="请选择">
          <el-option
            label="未上线"
            :value="0"
          />
          <el-option
            label="已上线"
            :value="1"
          />
      </el-select>
      <el-button type="primary" style="margin-left: 25px" @click="search">搜索</el-button>
    </div>
    <div class="box">
      <span class="tag" @click="flag=true" :class="{'active':flag}">选择课程</span><!--
      --><span class="tag" @click="flag=false" :class="{'active':!flag}">已选<span class="num">{{selectedList.length}}</span></span>
      <div v-show="flag">
        <el-table
          :data="list"
          border
          :max-height="300"
          ref="multipleTable"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            width="90">
          </el-table-column>
          <el-table-column
            prop="title"
            label="名称"
            width="350">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="isPhysical"
            label="实物">
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
      <el-table
        v-show="!flag"
        :max-height="300"
        :data="selectedList"
        border
      >
        <el-table-column
          prop="id"
          label="ID"
          width="90">
        </el-table-column>
        <el-table-column
          prop="title"
          label="名称"
          width="350">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="isPhysical"
          label="实物">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteSelected(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCourse">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Course from '@/api/courseApi'
  export default {
		name: "addCourse",
    data(){
		  return {
        options: [{
            label: '课程名称',
            value: 1,
          },
          {
            label: '课程id',
            value: 2,
          }
        ],
        type: '',
        text: '',
        status: '',
        selectedList: [],
        list: [],
        flag: true,
        currentPage: 1,
        total: 0,
        visible: false,
      }
    },
    methods: {
      search(){
        this.getCourse()
      },
      async getCourse(page = 1){
        this.currentPage = page;
        let param = {
          type: this.type || 0,
          status: this.status,
          keyWord: this.text,
          page: this.currentPage,
          pageSize: 20
        }
        let data = await Course.searchCourse(param)
        if(data){
          this.total = data.total;
          this.currentPage = data.current_page;
          this.list = data.data;

          //将已选择列表数据对象同步到新数据，以便能够正确删除
          this.list.forEach((item, index) => {
            let val = this.selectedList.find(i=>{
              return i.id === item.id
            })
            if(val){
              Object.assign(val, this.list[index]);
              this.list[index] = val;
            }
          })
        }
      },
      handleClose(){
        this.$refs.multipleTable.clearSelection()
        Object.assign(this.$data, this.$options.data())
      },
      //分页切换
      handleCurrentChange(val){
        this.getCourse(val)
      },
      //处理选中
      handleSelectionChange(val){
        this.selectedList = val;
      },
      //移除选中
      deleteSelected(row){
        if (row) {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      },
      addCourse(){
        this.$emit('addCourse', JSON.parse(JSON.stringify(this.selectedList)))
        this.visible = false;
      },
      show(){
        this.visible = true;
      }
    }
	}
</script>

<style scoped lang="less">
    .box{
      padding-top: 20px;
      .tag{
        display: inline-block;
        width: 110px;
        padding: 10px;
        background-color: #eee;
        text-align: center;
        cursor: pointer;
        position: relative;
        .num{
          display: inline-block;
          position: absolute;
          top: 0;
          right: 0;
          width: 25px;
          height: 25px;
          line-height: 25px;
          border-radius: 50%;
          background-color: #f11010;
          color: #fff;
        }
      }
      .active{
        background-color: #409EFF;
        color: #fff;
      }
    }
</style>
