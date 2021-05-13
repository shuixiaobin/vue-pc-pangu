<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="1200px"
    class="choose_good"
    @closed="cancel"
  >
    <div v-loading="loading">
      <div class="search_box">
        <el-input class="input" v-model="form.goodsCode"  placeholder="请输入商品编号"/>
        <el-input class="input" v-model="form.goodsName"  placeholder="请输入商品名称"/>
        <el-date-picker
          v-model="form.time"
          type="daterange"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
      <el-table
        :data="goodList"
        ref="multipleTable"
        border
        @row-click="toggle"
        @selection-change="handleSelectionChange"
        style="width: 100%;margin-bottom: 20px;">
        <el-table-column
          width="50"
          type="selection"
          label="单选">
        </el-table-column>
        <el-table-column
          prop="goodsNo"
          label="商品编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          width="180">
        </el-table-column>
        <el-table-column
          label="商品定价">
          <template slot-scope="scope">{{scope.row.goodsPrice/10000}}</template>
        </el-table-column>
        <el-table-column
          prop="subDepartmentName"
          label="分部">
        </el-table-column>
        <el-table-column
          prop="address"
          label="协议类型">
          <template slot-scope="scope">{{scope.row.goodsNo | agreement}}</template>
        </el-table-column>
        <el-table-column
          label="开课日期">
          <template slot-scope="scope">{{scope.row.startTime | formateTime}}</template>
        </el-table-column>
        <el-table-column
          prop="maxPeople"
          label="库存上限">
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">{{scope.row.createTime | formateTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="在线售卖">
          <template slot-scope="scope">
              <el-switch
                v-model="scope.row.buyStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0">
              </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确定选择</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import api from '@/api/courseApi.js'
  import Util from '@/common/util.js'
	export default {
		name: "chooseGood",
    data(){
		  return {
		    form: {
          goodsCode: '',
          goodsName: '',
          time: []
        },
        dialogVisible: false,
        goodList: [],
        courseId: [],
        checkedList: [],
        loading: false
      }
    },
    props: ['list'],
    filters: {
      formateTime(val){
        if(val)return Util.formatDate(new Date(val));
        return ''
      },
      agreement(code){
        if(!code)return '未知'
        if(code[code.length-1]==='A')return '非协议'
        return '协议'
      }
    },
    methods: {
		  show(id){
		    this.courseId = [id];
		    this.search();
		    this.dialogVisible = true;
      },
		  async search(){
        let param = {
          ...this.form,
          startTime: this.form.time.length>0?this.form.time[0]:'',
          endTime: this.form.time.length>0?this.form.time[1]:'',
          teachWay: 4, //双师：4
          courseIds: this.courseId,
          goodsProperty: 1, //主商品：1
          pageDto: {
            pageNum: 1,
            pageSize: 999
          }
        }
        this.loading = true
        let data = await api.getGood(param).catch(e=>{this.loading = false})
        this.loading = false
        if(data&&data.code===0){
          this.goodList = data.data;
          //处理回显
          if(this.list&&this.list.length>0&&this.goodList.length>0){
            this.$nextTick(_=>{
              this.goodList.forEach(row=>{
                if(this.list.find(item=>item.goodsId===row.goodsId)){
                  this.$refs.multipleTable.toggleRowSelection(row);
                }
              })
            })
          }
        }else{
          this.$message.error(data.msg);
        }
      },
      handleSelectionChange(val){
        this.checkedList = val;
      },
      confirm(){
        this.$emit('chooseGood',this.checkedList)
        this.dialogVisible = false;
      },
      cancel(){
        this.dialogVisible = false
        this.$refs.multipleTable.clearSelection();
      },
      toggle(row){
        this.$refs.multipleTable.toggleRowSelection(row);
      }
    },
    created(){

    }
	}
</script>

<style scoped lang="less">
  .choose_good{
    .search_box{
      margin-bottom: 20px;
      .input{
        width: 200px;
      }
    }
  }
</style>
