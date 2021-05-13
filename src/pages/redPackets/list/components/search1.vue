<template>
    <div id="search">
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="活动ID：">
                    <el-input v-model="findData.activityId" type="number" placeholder="活动ID" clearable style="width:120px"></el-input>
                </el-form-item>
                <el-form-item label="活动名称：">
                    <el-input v-model="findData.activeName" placeholder="请输入名称" clearable style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="活动状态：">
                    <el-select v-model="findData.status" placeholder="请选择" @change="selectChange">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

        </div>
        <div>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="活动时间：">
                    <el-date-picker v-model="setDateAry" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchCurriculum">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addCurriculum">创建</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
      name: "search",
      data: function() {
        return {
          options: [
            {
              value: "",
              label: "全部"
            },
            {
              value: "0",
              label: "未上线"
            },
            {
              value: "1",
              label: "已上线"
            },
            {
              value: "2",
              label: "已失效"
            },
            {
              value: "3",
              label: "已结束"
            },
            {
              value: "4",
              label: "已删除"
            }
          ],
          setDateAry: [],
          findData: {
            activityId: null,
            activeName: null,
            status: null,
            beginTime: null,
            endTime: null
          }
        };
      },
      watch: {
        setDateAry() {
          if (this.setDateAry && this.setDateAry.length > 0) {
            this.findData.beginTime = this.setDateAry[0];
            this.findData.endTime = this.setDateAry[1];
          } else {
            this.findData.beginTime = "";
            this.findData.endTime = "";
          }
        }
      },
      methods: {
        searchCurriculum() {
          this.$emit("searchInformation", this.findData);
        },
        selectChange(value) {
          this.findData.status = value;
        },
        addCurriculum() {
          this.$store.commit("resetData");
          this.$router.push({ name: "addred" });
        }
      }
    };
</script>

<style scoped lang="less">
    h1 {
      font-size: 18px;
      padding: 0 50px;
    }
    /*禁用number默认样式*/
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
</style>
