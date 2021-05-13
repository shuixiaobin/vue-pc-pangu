<template>
  <div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column
        prop="id"
        label="协议参数编号"
        align="center"
        fixed="left"
      >
      </el-table-column>
      <el-table-column prop="paramName" label="协议参数名称" align="center" width="180px">
      </el-table-column>
      <el-table-column label="协议模板" align="center" width="180px">
        <template slot-scope="scope">
          {{ paramTemp(scope.row.templateType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="考试类型"
        align="center"
      >
        <template slot-scope="scope">
          {{examType(scope.row.categoryId)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="examnName"
        label="考试名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="className"
        label="班级名称"
        align="center"
        width="150px"
      ></el-table-column>
      <el-table-column
        label="协议类别"
        align="center"
      >
        <template slot-scope="scope">
          {{protoType(scope.row.protocolType)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="classCost"
        label="课程成本"
        align="center"
      ></el-table-column>
      <el-table-column label="付费模式" align="center">
        <template slot-scope="scope">
          {{payMethod(scope.row.payType)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        align="center"
        width="160px"
      ></el-table-column>
      <el-table-column
        prop="createName"
        label="创建人"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新日期"
        align="center"
        width="160px"
      ></el-table-column>
      <el-table-column
        prop="updateName"
        label="更新人"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.id)"
            v-auth="'PARAM_EDIT'">编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <parameter-dialog ref="paramDia" @refresh="refresh"></parameter-dialog>
  </div>
</template>

<script>
import { getTempType } from "@/api/learnCenter.js";
import parameterDialog from './parameterDialog.vue';
export default {
  components: { parameterDialog },
  props: ["tableData"],
  data() {
    return {
      tempTypeList: [],
      examTypeList: [],
      payTypeList: [
        {id: 1, name: '全款'},
        {id: 2, name: '预收'}
      ],
      protocolTypeList: [
        {id: 1, name: '笔试'},
        {id: 2, name: '面试'}
      ]
    };
  },

  computed: {
    paramTemp() {
      return function (id) {
        const type = this.tempTypeList.filter((item) =>  item.id === id);
        if(type.length>0) return type[0].protocolName;
      };
    },

    examType() {
      return function(id) {
        const exam = this.examTypeList.filter(item => item.id === id)
        if(exam.length>0) return exam[0].name
      }
    },

    protoType() {
      return function(id) {
        const proto = this.protocolTypeList.filter(item => item.id === id)
        return proto.length>0 ? proto[0].name : ''
      }
    },

    payMethod() {
      return function(id) {
        const pay = this.payTypeList.filter(item => item.id === id)
        return pay.length>0 ? pay[0].name : ''
      }
    }
  },

  created() {
    this.getTempType();
    eventBus.$on('examTypeListBus', (val) => {
      this.examTypeList = Object.values(val)
    })
  },

  methods: {
    getTempType() {
      getTempType()
        .then((res) => {
          this.tempTypeList = Object.values(res.data);
          eventBus.$emit("tempTypeList", this.tempTypeList);
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    refresh() {
      this.$emit('refresh')
    },

    handleEdit(id) {
      this.$refs.paramDia.openDialog(id)
    },
  },
};
</script>