<template>
  <el-dialog
    :title="operateType==1?'添加部门':'编辑部门'"
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
        label="部门名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="请输入部门名称"
          maxlength="20"
          show-word-limit
          style="width:100%;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="上级部门"
        prop="parentId"
      >
        <el-cascader
          v-model="form.parentId"
          :options="departOptions"
          :props="{ checkStrictly: true,label: 'name',value:'id' ,children:'child'}"
          clearable
          style="width:100%;"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item
        label="部门主管"
        prop="leaderName"
      >
        <el-select
          v-model="form.leaderName"
          filterable
          remote
          style="width:100%;"
          reserve-keyword
          placeholder="请输入部门主管姓名，会自动关联，下拉选择即可"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in headsData"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
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
  function findPwd(tree, id) {
    const ret = [];
    function dfs(arr) {
      if (!arr || !arr.length) return false;
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (dfs(item.child) || item.id === id) {
          ret.push(item.id);
          return true;
        }
      }
      return false;
    }
    dfs(tree);
    return ret.reverse();
  }
  import { getProperAuthList } from '@/api/authority';
  import {
    addDepartMent,
    departEcho,
    searchDepartmentHead
  } from '@/api/authority';
  export default {
    data() {
      return {
        operateType:'1',//1，添加，2，编辑
        dialogFormVisible: false,
        form: {
          name: '',
          id: '', //部门id
          parentId: '', //部门上级id
          leaderName: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          leaderName: [
            { required: true, message: '请输入部门主管', trigger: 'blur' }
          ]
        },
        loading: false,
        headsData: []
      };
    },
    props: ['departOptions'],
    methods: {
      openDialog(type,row) {
        this.operateType = type
        if (row) {
          departEcho(row.id)
            .then(res => {
              if (res.code == 1000000) {
                this.form.name = res.data.name;
                this.form.id = res.data.id;
                this.form.parentId = findPwd(
                  this.departOptions,
                  res.data.parentId
                );
                this.form.leaderName = res.data.leaderName;
                this.dialogFormVisible = true;
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.dialogFormVisible = true;
        }
      },
      closeDialog() {
        this.dialogFormVisible = false;
        this.form ={
          name: '',
          id: '', //部门id
          parentId: '', //部门上级id
          leaderName: ''
        };
        this.$refs['form'].resetFields();
      },
      async remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          try {
            await searchDepartmentHead({
              userName: query
            })
              .then(res => {
                if ((res.code = 1000000)) {
                  this.loading = false;
                  this.headsData = res.data;
                }
              })
              .catch(err => {
                console.log(err);
              });
          } catch (error) {
            console.log(error);
          }
        } else {
          this.headsData = [];
        }
      },
      addDepartMent(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addDepartMent({
              ...this.form,
              id: this.form.id ? this.form.id : null,
              parentId: this.form.parentId[this.form.parentId.length - 1]
            })
              .then(res => {
                if (res.code == 1000000) {
                  this.$message.success(
                    this.operateType == 1 ? '添加成功！' : '修改成功！'
                  );
                  this.closeDialog();
                  this.$emit('refresh');
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            return false;
          }
        });
      }
    }
  };
</script>