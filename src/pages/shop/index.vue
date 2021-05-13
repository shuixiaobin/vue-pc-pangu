<template>
  <div>
    <div class="container-title">
      <h2>分销管理</h2>
    </div>    
    <div class="container">
      <search-com @putSearch="putSearch"/>
      <el-table :data="tableData" border
        style="width: 100%">
        <el-table-column prop="id"
          label="编号"
          header-align="center"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column prop="course_id"
          label="课程ID"
          header-align="center"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column prop="title"
          header-align="center"
          align="center"
          label="课程"
          width="200">
        </el-table-column>
        <el-table-column prop="item_name"
          label="所属考试"
          header-align="center"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column prop="rebate"
          header-align="center"
          align="center"
          label="分成比例">
          <template slot-scope="scope">
            {{parseInt(scope.row.rebate*100)}}%
          </template>
        </el-table-column>
        <el-table-column label="分销区域"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            {{province[scope.row.range]}}
          </template>
        </el-table-column>
        <el-table-column prop="expire"
          header-align="center"
          align="center"
          label="有效期">
        </el-table-column>
        <el-table-column prop="bizStatus"
          label="状态"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            {{scope.row.status | statusFilters}}
          </template>
        </el-table-column>
        <el-table-column prop="remark"
          label="状态备注"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column label="操作"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 1"
              size="small" type="text"
              @click="downLine(scope.row)"
              class="serchLeft">下线</el-button>
            <el-button v-if="scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4"
              @click="applyAgin(scope.row)" type="text"
              class="serchLeft">重新申请</el-button>
            <el-button v-if="scope.row.status == 0"
              @click="cancleApply(scope.row)" type="text"
              class="serchLeft">撤回申请</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="重新提交"
        :visible.sync="centerDialogVisible"
        width="40%"
        center>
        <el-form ref="userShuiform"
          :model="form1"
          :rules="rules"
          label-width="150px">
          <el-form-item label="课程名称">
              {{rowLine.title}}
          </el-form-item>
          <el-form-item label="课程价格">
              {{rowLine.price}}
          </el-form-item>
          <el-form-item label="分成百分比" prop="percentage">
            <el-input v-model="form1.percentage"  style="width:200px"></el-input> %
          </el-form-item>
          <el-form-item label="分销目标区域" prop="goArea">
            <el-select v-model="form1.goArea" placeholder="请选择活动区域">
              <el-option v-for="(val,key) in province" :label="val" :value="key" :key="val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分销有效期" prop="validity">
            <el-select v-model="form1.validity"
              placeholder="请选择活动区域">
              <el-option label="一个月"
                value="1"></el-option>
              <el-option label="二个月"
                value="2"></el-option>
              <el-option label="三个月"
                value="3"></el-option>
              <el-option label="四个月"
                value="4"></el-option>
              <el-option label="五个月"
                value="5"></el-option>
              <el-option label="六个月"
                value="6"></el-option>
              <el-option label="七个月"
                value="7"></el-option>
              <el-option label="八个月"
                value="8"></el-option>
              <el-option label="九个月"
                value="9"></el-option>
              <el-option label="十个月"
                value="10"></el-option>
              <el-option label="十一个月"
                value="11"></el-option>
              <el-option label="十二个月"
                value="12"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item>
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit">重新提交</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form  :model="formInline" class="demo-form-inline">
            <el-form-item label="备注:">
              <el-input type="textarea" v-model="remark" :rows="3" width="80%"></el-input>
            </el-form-item>
          </el-form>
    
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="setStatus">确 定</el-button>
        </div>
      </el-dialog>

      <div class="container-pagination">
        <el-pagination @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="pageData.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageData.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import searchCom from './components/serch.vue'
  import { getArea, changeStatus, getListData ,submit} from './servers/index.js'
  import { getCookie } from '@/config/utils'
  
  export default {
    data() {
      var checkNumer = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'));
        }
        setTimeout(() => {
            const reg=/^([1-9]\d|\d)$/;
            if ( reg.test(value) ) {
              callback();
            } else {
              callback(new Error('请输入0到99之间的整数'));
            }
        }, 200);
      };
      return {
        centerDialogVisible:false,
        formData: {
          size: 10,
          course_id: '',
          title:'',
          status: '',
          item_id: ''
        },
        tableData: [],
        dialogTitle:'',
        dialogFormVisible:false,
        remark:"",
        rowLine:'',
        statusList: [],
        pageData: {
          page: 1,
          size: 10,
          total: 0
        },
        form1:{
          percentage:'10',
          goArea:'',
          validity:"",
        },
        province:{"86":"全国","110000":"北京市"},
        formInline:{},
        rules: {
            percentage:[{ validator: checkNumer, trigger: 'blur' }],
            goArea: [{ required: true, message: '必填项', trigger: 'blur' }],
            validity: [{ required: true, message: '必填项', trigger: 'blur' }],
          }
      }
    },
    components: {
      searchCom
    },
    computed: {
    },
    created() {
      this.getList();
    },
    methods: {
      putSearch(data) {
        if (data.inputType == 1) {
          this.formData.title = data.inputVal
          this.formData.course_id = ''
        } else if (data.inputType == 2) {
          this.formData.course_id = data.inputVal
          this.formData.title ='';
        }
        delete this.formData.inputType;
        delete this.formData.inputVal;
        Object.assign(this.formData,data)
        this.formData.page = 1
        this.getList()
      },
      // 改变显示数目
      sizeChange(val) {
        this.formData.size = this.pageData.size = val
        this.formData.page = this.pageData.page = 1
        this.getList()
      },
      pageChange(val) {
        this.formData.page = val
        this.getList()
      },

      

      getList() {
          this.$jsonp(jy_URL +'/fx/zx/get_dis_course_list',this.formData).then(json => {
             console.log(json)
             this.tableData = json.data[1]
             this.pageData.total = json.data[0].totleCount;
          }).catch(err => {
     
          })

          this.$jsonp(jy_URL + '/fx/zx/get_dis_area',{}).then(json => {
              console.log(json)
              this.province =json.data
          }).catch(err => {
         
          })
      },
      downLine(row) {
        this.dialogFormVisible=true;
        this.rowLine =row;
        this.dialogTitle ="下线"
      }, //下线
      cancleApply(row) {
        this.dialogFormVisible=true;
        this.rowLine =row;
        this.dialogTitle ="撤回"
      },//撤回
      setStatus(){
          this.$jsonp(jy_URL + '/fx/zx/set_status',{
            course_id:this.rowLine.course_id,
            status:  this.dialogTitle =="下线"? 3:(this.dialogTitle =="撤回"? 4:''),
            remark:this.remark,
            operator:getCookie("UserName"),
          }).then(json => {
              if(json.code == 200){
                this.$message({
                      message: '提交成功！',
                      type: 'success'
                })
                this.dialogFormVisible =false;
                this.getList()
              }
          }).catch(err => {
                this.$message({
                    message: err.message,
                    type: 'warning'
                })
          })
      },
      applyAgin(row) {
        this.centerDialogVisible=true;
        this.rowLine =row;
      },//重新申请
      onSubmit(){
          var that = this;
          this.$refs["userShuiform"].validate((valid) => {
            if (valid) {
              submit({
                classId:this.rowLine.course_id,
                percentAge:this.form1.percentage,
                targetArea:this.form1.goArea,
                validityTime:this.form1.validity,
                userName:getCookie("UserName"),
              }).then(res=>{
                  if(res.data.code == 10000){
                    this.$message({
                      message: '提交成功！',
                      type: 'success'
                    })
                    this.centerDialogVisible=false;
                    this.getList();
                  }else{
                    this.$message({
                      message: err.msg,
                      type: 'warning'
                    })
                  }
              }).catch(err=>{
                  this.$message({
                    message: err.msg,
                    type: 'warning'
                  })
              })
            } else {
              return false;
            }
          });
      }
    },
    filters: {
      statusFilters(val) {
        let item
        switch (Number(val)) {
          case 0:
            item = '待审核'
            break
          case 1:
            item = '已通过'
            break
          case 2:
            item = '未通过'
            break
          case 3:
            item = '已下线'
            break
          case 4:
            item = '撤回'
            break
          case 5:
            item = '已到期'
            break
        }
        return item
      }
    }
  }
</script>
