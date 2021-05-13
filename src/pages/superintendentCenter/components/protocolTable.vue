<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="protocolNum" label="协议模板编号" align="center">
    </el-table-column>
    <el-table-column prop="protocolName" label="协议模板名称" align="center">
    </el-table-column>
    <el-table-column label="是否启用" align="center">
      <template slot-scope="scope">
        {{ scope.row.status == 1 ? "是" : "否" }}
      </template>
    </el-table-column>
    <el-table-column label="创建日期">
      <template slot-scope="scope">
        {{ scope.row.createTime }}
      </template>
    </el-table-column>
    <el-table-column label="更新日期">
      <template slot-scope="scope">
        {{ scope.row.updateTime }}
      </template>
    </el-table-column>
    <el-table-column label="更新人" prop="createName"></el-table-column>
    <el-table-column fixed="right" label="操作">
      <template slot-scope="scope">
        <el-button type="text" @click="handlePreview(scope.row.protocolNum)"
          v-auth="'TEMP_PREVIEW'">预览</el-button
        >
        <el-button type="text" @click="handleDownload(scope.row.protocolNum)"
          v-auth="'TEMP_DOWNLOAD'">下载</el-button
        >
        <el-button type="text" @click="handleDisable(scope.row)"
          v-auth="'TEMP_DISABLE'">{{ scope.row.status == 1 ? "禁用" : "启用" }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { tempPreview, tempStatus } from "@/api/learnCenter.js";
export default {
  name: "protocolTable",
  props: ["tableData"],

  data() {
    return {};
  },

  methods: {
    async handlePreview(id) {
      try {
        const res = await tempPreview(id);
        window.open(res.data);
      } catch (error) {
        this.$message.error(error);
      }
    },

    handleDownload(id) {
      window.open(`${PANGU_URL}/v1/c/agreement/agreement_download?templateId=${id}`)
    },

    handleDisable(val) {
      let statu;
      if (val.status == 1) {
        statu = 0;
      } else {
        statu = 1;
      }
      const params = {
        templateId: val.protocolNum,
        status: statu,
        createName: localStorage.getItem("name"),
      };

      tempStatus(params).then((res) => {
        if(res.code === 10000) {
          this.$emit("getList");
          this.$message.success("操作成功");
        }else {
          if(res.msg) {
            this.$message.error(res.msg)
          }
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
  },
};
</script>