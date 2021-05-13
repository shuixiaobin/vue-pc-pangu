<template>
  <el-dialog
    :title="operateType==1?'添加成员':'编辑成员'"
    :visible.sync="dialogFormVisible"
    width="30%"
    :close-on-click-modal='false'
    center
    @close="closeDialog"
  >
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="100px"
      class="addRole"
    >
      <el-form-item
        label="头像"
        prop="avatar"
      >
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="UploadImage"
        >
          <img
            v-if="form.avatar"
            :src="form.avatar"
            class="avatar"
            @mouseover="openAgainUpload"
            @mouseleave="closeAgainUpload"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
          <span
            class="avatar-again"
            v-show="isAgainUpload"
          >重新上传</span>
        </el-upload>
      </el-form-item>

      <el-form-item
        label="手机"
        prop="phone"
      >
        <el-input
          v-model="form.phone"
          :disabled="operateType == 2"
          placeholder="请认真核对手机号码是否输入正确，否则会导致无法登陆哦"
          size="mini"
          @blur="getUserName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="用户名"
      >
        <el-input
          v-model="form.username"
          placeholder="请输入对方用户名，如doris"
          size="mini"
          disabled
          style="width:100%;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="真实姓名"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="请输入对方真实姓名"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="身份证"
        prop="idCard"
      >
        <el-input
          v-model="form.idCard"
          placeholder="请输入对方身份证号码"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="operateType==2?'修改密码':'默认密码'"
      >
<!--         <el-input
          v-model="form.password"
          placeholder="设置默认密码"
          size="mini"
          disabled
        ></el-input> -->
        <p>{{form.password}}</p>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="form.email"
          placeholder="请输入对方邮箱地址"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="部门">
        <el-cascader
          v-model="form.departmentId"
          :options="departOptions"
          :props="{ checkStrictly: true,label: 'name',value:'id' ,children:'child'}"
          clearable
          size="mini"
          style="width:100%"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item
        label="账号类型"
        prop="userType"
        required
      >
        <el-radio-group
          v-model="form.userType"
          @change="changeUserType"
        >
          <el-radio :label="1">后台用户</el-radio>
          <el-radio :label="2">教师</el-radio>
          <el-radio :label="3">兼职</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="工号"
        prop="staffNo"
      >
        <el-input
          v-model="form.staffNo"
          :placeholder="form.userType===3?'工号自动生成':'请输入对方工号'"
          size="mini"
          :disabled="form.userType===3?true:false"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="角色"
        prop="roles"
      >
        <el-select
          v-model="form.roles"
          multiple
          size="mini"
          placeholder="请选择"
          style="width:100%;"
          @click.native="showChoose"
        >
          <el-option
            :label="item.roleName"
            :value="item.id"
            v-for="(item,index) in roleList"
            :key="index"
            v-show="isShow"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="星图账号"
      >
        <el-input
          v-model.number="form.starAccount"
          size="mini"
        ></el-input>
      </el-form-item>
    </el-form>
    <choseRole
        ref="setRole"
        @setJoin="setJoin"
        @cancelJoin="cancelJoin"
        @closeDig="closeDig"
        :includeItems="form.roles"
      />
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeDialog">取 消</el-button>
      <el-button
        type="primary"
        @click="submitForm('form')"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { uploadAvater, addRole, echoRole, getPersonName ,getDefaultPwd } from '@/api/authority';
  import  choseRole from  "./choseRole.vue"
  import Util from '@/common/util';
  export default {
    components: {
      choseRole
    },
    data() {
      var checkIdCard = (rule, value, callback) => {
        if (value && !Util.FORM.isLegalIDCard(value)) {
          callback(new Error('请检查输入的身份证号码是否正确'));
        } else {
          callback();
        }
      };
      var checkEmail = (rule, value, callback) => {
        if (value && !Util.FORM.isLegalEmail(value)) {
          callback(new Error('请检查输入的邮箱格式是否正确'));
        } else {
          callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        if (!Util.FORM.isLegalTel(value)) {
          callback(new Error('请检查输入的手机格式是否正确'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value && !Util.FORM.isLegalPassword(value)) {
          callback(new Error('请输入6位任意数字，字母组合的密码'));
        } else {
          if (value.length < 6) {
            callback(new Error('密码小于6位数'));
          } else {
            callback();
          }
        }
      };
      var checkStaffNo = (rule, value, callback) => {
        setTimeout(() => {
          if (value && !/^[0-9]*$/.test(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 1000);
      };
      return {
        isShow:true,
        Util,
        isAgainUpload: false,
        operateType: '1', //1，添加，2，编辑
        dialogFormVisible: false,
        form: {
          avatar: '',
          username: '',
          name: '',
          idCard: '',
          password: '',
          email: '',
          phone: '',
          userType: 1,
          staffNo: '',
          roles: [],
          starAccount:''
        },
        oldPhone:'',
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
          idCard: [{ validator: checkIdCard, trigger: 'blur' }],
          password: [{ validator: validatePass, trigger: 'blur' }],
          email: [{ validator: checkEmail, trigger: 'blur' }],
          phone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
          departmentId: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ],
          staffNo: [{ validator: checkStaffNo, trigger: 'blur' }]
        }
      };
    },
    props: ['departOptions', 'roleList'],
    mounted(){

    },
    methods: {
      changeUserType() {
        this.form.staffNo = '';
      },
      openAgainUpload() {
        if (this.form.avatar) {
          this.isAgainUpload = true;
        }
      },
      closeAgainUpload() {
        this.isAgainUpload = false;
      },
      getUserName(){
            if(!this.form.phone || this.oldPhone == this.form.phone) return;
            getPersonName(this.form.phone).then(res => {
              if (res.code == 1000000) {
                this.form.username = res.data.userName;
              }else{
                this.$message.error(res.message);
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
      },


      openDialog(type, row) {
        this.operateType = type;
        console.log(row)
        if (row) {
          echoRole(row.id)
            .then(res => {
              if (res.code == 1000000) {
                  this.form = res.data;
                  if (!res.data.avatar) {
                    this.$set(this.form, 'avatar', '')
                    // this.form.avatar = ''
                  } 
                  this.oldPhone = this.form.phone;
                  this.form.roles = res.data.roles.map(item => {
                    return item.id;
                  });
                  this.dialogFormVisible = true;
                  //this.$refs['form'].clearValidate();
                  console.log(this.form.staffNo);
              }}).catch(err => {
                  console.log(err);
                  this.$message.error(err.message);
              });
        } else {
          this.dialogFormVisible = true;
          this.$nextTick(()=>{
            this.getDefaultPasswd();
            this.$refs['form'].clearValidate();
          })  
        }
      },
      getDefaultPasswd(){
        getDefaultPwd().then(res=>{
           if(res.code == 1000000){
            this.form.password = res.data.passWord;
            console.log(this.form.password)
           }
        })
      },
      closeDialog() {
        this.dialogFormVisible = false;
        this.form= {
          avatar: '',
          username: '',
          name: '',
          idCard: '',
          password: '',
          email: '',
          phone: '',
          userType: 1,
          staffNo: '',
          roles: [],
          starAccount:''
        };
        this.$refs['form'].resetFields();
        this.$refs["setRole"].setShow(false);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG && !isGIF) {
          this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPNG || isGIF) && isLt2M;
      },
      UploadImage(param) {
        var formData = new FormData();
        formData.append('file', param.file);
        uploadAvater(formData, { 'Content-Type': 'multipart/form-data' })
          .then(res => {
            if (res.code == 1000000) {
              this.form.avatar = res.data.url;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            var departmentId = this.form.departmentId && this.form.departmentId.length > 0 ?
            this.form.departmentId[this.form.departmentId.length - 1]:this.form.departmentId; 
            
            let roles = this.form.roles.map(item => {
              return { id: item };
            });
            addRole({
              ...this.form,
              departmentId,
              roles
            })
              .then(res => {
                if (res.code == 1000000) {
                  this.$message.success(
                    this.operateType == 1 ? '添加成功' : '编辑成功'
                  );
                  this.closeDialog();
                  this.$emit('refresh');
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            return false;
          }
        });
      },
      setJoin(ids) {
        if(!this.form.roles.includes(ids))
          this.form.roles.push(ids);
      },
      cancelJoin(ids) {
        if(this.form.roles.includes(ids)){
              this.form.roles =  this.form.roles.filter(function(item) {
                return item != ids
             });
        }
      },
      showChoose(){
        this.isShow=false;
        this.$refs["setRole"].setShow(true);
      },
      closeDig(){
        this.isShow=true;
      },
    
    }
  };
</script>

<style lang="less">
  .addRole {
    .avatar-uploader .el-upload {
      width: 150px;
      height: 150px;
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 148px;
      height: 148px;
      line-height: 148px;
      text-align: center;
    }
    .avatar {
      width: 148px;
      height: 148px;
      display: block;
      border-radius: 50%;
    }
    .avatar-again {
      position: absolute;
      left: 0;
      top: 0;
      width: 148px;
      height: 148px;
      line-height: 148px;
      text-align: center;
      color: #fff;
      background: rgba(0, 0, 0, 0.6);
    }
  }
</style>