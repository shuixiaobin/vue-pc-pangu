<template>
    <div id="search">
        <h1>搜索条件</h1>
        <hr> 课程ID：
        <el-input v-model="findData.curriculumId" type="number" placeholder="请输入课程ID" clearable style="width:250px"></el-input>
        课程名称：
        <el-input v-model="findData.curriculumName" placeholder="请输入名称" clearable style="width:250px"></el-input>
        活动状态：
        <el-select v-model="value" placeholder="请选择" @change="selectChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        时间：
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate">
        </el-date-picker>
        <el-button type="primary" @click="searchCurriculum">搜索</el-button>
        <el-button type="success" @click="addCurriculum">创建</el-button>
        <el-button type="warning" @click="clear">重置</el-button>
    </div>
</template>

<script>
    export default {
      name: "search",
      data: function() {
        return {
          curriculumId: "",
          curriculumName: "",
          select: "",
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
            }
          ],
          value: "",
          findData: {
            curriculumId: null,
            curriculumName: null,
            select: null,
            beginAt:'',
            endAt:'',
          },
          date:'',
        };
      },
      methods: {
        // 时间选择
        changeDate(){
          if(!this.date){
            this.findData.beginAt = '';
            this.findData.endAt = '';
            return
          }
          this.findData.beginAt = this.date[0];
          this.findData.endAt = this.date[1];
        },
        searchCurriculum() {
          this.$emit("searchInformation", this.findData);
        },
        selectChange(value) {
          this.findData.select = value;
        },
        addCurriculum() {
          this.$router.push({ name: "spellGroup" });
        },
        // 清空
        clear(){
          this.findData.beginAt = '';
          this.findData.endAt = '';
          this.findData.curriculumId = '';
          this.findData.curriculumName = '';
          this.findData.select = '';
          this.value = '';
          this.$emit("searchInformation", this.findData);
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
