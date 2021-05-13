<template>
  <div>
    <el-dialog
      :visible.sync="isShowReoprtDialog"
      :close-on-click-modal="false"
      width="30%"
      @close="close"
    >
      <div
        slot="title"
        class="dialog-title"
      >
        导出<span class="tips">(最多导出7天的数据)</span>
      </div>
      <el-form :model="form">
        <el-form-item label="部门选择">
          <el-select
            v-model="form.department"
            placeholder="请选择部门"
            @change="getFilesList"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in SelectOptions.department"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件格式">
          <el-select
            v-model="form.exportType"
            placeholder="请选择文件格式"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in filesList"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="close"
          size="medium"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="exportOrder"
          size="medium"
        >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import { getFilesList } from '@/api/orderManage';
  export default {
    data() {
      return {
        isShowReoprtDialog: false, //弹窗开关
        filesList: [],
        form: {
          department: '',
          exportType: ''
        }
      };
    },
    props: ['SelectOptions', 'searchData'],
    methods: {
      open() {
        this.isShowReoprtDialog = true;
      },
      close() {
        this.isShowReoprtDialog = false;
        Object.assign(this.$data.form, this.$options.data().form);
      },
      getFilesList(department) {
        this.form.exportType = '';
        getFilesList({
          department
        })
          .then(res => {
            if (res.code == 10000) {
              this.filesList = res.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      exportOrder() {
        const query = Object.entries({
          ...this.form,
          ...this.searchData
        }).map(item => `${item[0]}=${encodeURIComponent(item[1])}`).join('&')
        window.open(`${PANGU_URL}/v1/c/order/export_order?${query}`)
        this.close();
      }
    }
  };
</script>
<style lang="less" scoped>
  .dialog-title {
    .tips {
      padding: 0 10px;
      font-size: 12px;
      color: #ccc;
    }
  }
</style>