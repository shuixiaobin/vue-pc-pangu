<template>
  <el-dialog
    :title="operateType==1?'添加角色':'编辑角色'"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal='false'
    @close="closeDialog"
    width="30%"
    center
  >
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="角色名"
        prop="roleName"
      >
        <el-input
          v-model="form.roleName"
          placeholder="请输入角色名"
          size="mini"
          maxlength="15"
          style="width:100%"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="选择系统"
        prop="systemId"
      >
        <el-select
          v-model="form.systemId"
          size="mini"
          placeholder="请选择"
          style="width:100%;"
          prop="roleName"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in systemList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="bizStatus"
      >
        <el-radio-group v-model="form.bizStatus">
          <el-radio :label="1">已发布</el-radio>
          <el-radio :label="0">未发布</el-radio>
        </el-radio-group>
      </el-form-item>
  <!--     <el-form-item prop="defaultRole">
        <el-checkbox v-model="form.defaultRole" true-label="1" false-label="0">设置为默认角色</el-checkbox>
      </el-form-item> -->
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeDialog()">取 消</el-button>
      <el-button
        type="primary"
        @click="addDepartMent('form')"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { getProperAuthList } from '@/api/authority';
  import {
    addNewRole,editNewRole
  } from '@/api/authority';
  export default {
    data() {
      return {
        operateType: '1', //1，添加，2，编辑
        dialogFormVisible: false,
        form: {
          roleName: '',
          systemId: 3, //部门id
          bizStatus: 1,
          defaultRole: "0",
          id:''
        },
        rules: {
          roleName: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
          ],
          systemId: [
            { required: true, message: '请选择系统', trigger: 'change' }
          ],
          bizStatus: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        },
        loading: false,
        headsData: []
      };
    },
    props: ['systemList'],
    methods: {
      openDialog(type, row) {
        this.dialogFormVisible = true;
        this.operateType = type;
        if (row) {
            row.defaultRole = row.defaultRole+'';
            Object.assign(this.form ,row)
            console.log(this.form)
        } else {
          delete this.form.id;
        }
      },
      closeDialog() {
        this.dialogFormVisible = false;
        this.form = {
          roleName: '',
          systemId: 3, //部门id
          bizStatus: 1,
          defaultRole: "0",
          id:''
        };
        this.$refs['form'].resetFields();
      },

      addDepartMent(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if(this.operateType == 1){
              addNewRole({
                ...this.form,
              })
              .then(res => {
                if (res.code == 1000000) {
                  this.$message.success(
                    this.operateType == 1 ? '添加成功！' : '修改成功！'
                  );
                  this.closeDialog();
                  this.$emit('refresh');
                }else{
                  this.$message.error(res.message)
                }
              })
              .catch(err => {
                  this.$message.error(err.message)
              });
            }else{
              editNewRole({
                ...this.form,
                id: this.form.id ? this.form.id : null,
              }).then(res => {
                  if (res.code == 1000000) {
                    this.$message.success(
                      this.operateType == 1 ? '添加成功！' : '修改成功！'
                    );
                    this.closeDialog();
                    this.$emit('refresh');
                  }else{
                    this.$message.error(res.message)
                  }
              }).catch(err => {
                    this.$message.error(err.message)
                });
            }
          } else {
            return false;
          }
        });
      }
    }
  };
</script>