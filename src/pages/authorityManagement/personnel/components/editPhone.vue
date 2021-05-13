<template>
  <el-dialog :visible.sync="visible" title="修改手机号" width="500px">
    <template #default>
      <el-form
        ref="form"
        :model="{ phone: phone }"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="用户ID：">
          {{ userInfo.id }}
        </el-form-item>
        <el-form-item label="用户名：">
          {{ userInfo.username }}
        </el-form-item>
        <el-form-item label="手机号：">
          {{ userInfo.oldPhone }}
        </el-form-item>
        <el-form-item label="新手机号：" prop="phone" :rules="rules">
          <el-input v-model="phone" size="small" style="width: 300px" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div>
        <el-button type="primary" size="small" @click="submit">
          确定
        </el-button>
        <el-button size="small" @click="visible = false"> 取消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Util from '@/common/util';
import { postUpdatePhone } from '@/api/authority';
export default {
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新的手机号'));
      } else if (!Util.FORM.isLegalTel(value)) {
        callback(new Error('请检查输入的手机格式是否正确'));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      userInfo: {},
      phone: '',
      rules: {
        required: true,
        validator: checkPhone,
        trigger: 'blur',
      },
    };
  },
  methods: {
    openDialog({ id, username, phone }) {
      this.userInfo = {
        id,
        username,
        oldPhone: phone,
      };
      this.phone = '';
      this.$refs.form && this.$refs.form.clearValidate();
      this.visible = true;
    },
    async submit() {
      try {
        const valid = await this.$refs.form.validate();
        if (valid) {
          const params = {
            ...this.userInfo,
            phone: this.phone,
          };
          const res = await postUpdatePhone(params);
          if (res.code === 1000000) {
            this.$message.success('修改手机号成功');
            this.$emit('updated');
            this.visible = false;
            return;
          } else {
            this.$message.error(res.message);
            return;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style>
</style>