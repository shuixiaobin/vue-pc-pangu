<template>
    <div class="con">
      <el-tabs v-model="isCollapse" type="card">
        <el-tab-pane label="选择课程" name="false">
            <div class="top">
                <el-row :gutter="30">
                    <el-col :span="10">
                        <span style="float:left;margin-right:20px;margin-top:10px">课程价格:</span>
                        <el-input v-model="priceMin" style="float:left;width:80px"></el-input>
                        <span style="float:left;margin-right:20px;margin-left:20px;margin-top:10px">--</span>
                        <el-input v-model="priceMax" style="float:left;width:80px"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="typeId">
                            <el-option v-for="item in types" :key="item.key" :label="item.key" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model.trim="limit" width="300px" v-if="typeId != '4'"></el-input>
                        <el-select v-model="limit" filterable placeholder="教师名称" style="float:left;magrgin-top:20px" v-if="typeId == '4'">
                            <el-option v-for="item in teachersList" :key="item.TeacherId" :label="item.TeacherName" :value="item.TeacherId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" plain class="next" @click="search('this.limit')">搜索</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="dateInfo" ref="multipleTable" border style="width:100%;">
                <el-table-column width="80">
                    <template slot-scope="scope">
                        <input type="checkbox" id="scope.row.classId" :value="scope.row.classId" :checked='getChooseId.toString().indexOf(Number(scope.row.classId)) >-1 ' @click="select($event,scope.row)" style="width:20px;height:20px">
                    </template>
                </el-table-column>
                <el-table-column prop="classId" label="课程ID">
                </el-table-column>
                <el-table-column prop="classTitle" label="课程名称" width="300">
                </el-table-column>
                <el-table-column prop="classPrice" label="课程价格">
                </el-table-column>
                <el-table-column prop="status" label="课程状态">
                    <template slot-scope="scope">
                        {{ scope.row.status | statusFormat }}
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建日期">
                </el-table-column>
            </el-table>
            <el-pagination @current-change="handleCurrentChange" background layout="total, prev, pager, next" :total="totals" :page-size="30" :page-count="lastPage" class="container-pagination">
            </el-pagination>          
        </el-tab-pane>
        <el-tab-pane label="已选课程" name="true">
            <el-table :data="chooseList" border style="width:100%">
              <el-table-column prop="classId" label="课程ID">
              </el-table-column>
              <el-table-column prop="classTitle" label="课程名称" width="300">
              </el-table-column>
              <el-table-column prop="classPrice" label="课程价格">
              </el-table-column>
              <el-table-column prop='status' label="课程状态">
                  <template slot-scope="scope">
                      {{ scope.row.status | statusFormat }}
                  </template>
              </el-table-column>
              <el-table-column prop='createDate' label="创建日期">
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button plain @click="cancle(scope.row.classId)">取消参加</el-button>
                  </template>
              </el-table-column>
          </el-table> 
          <!-- <el-button type="primary" plain @click="setClean">清空已选课程</el-button> -->        
        </el-tab-pane>
      </el-tabs>
      <div class="btn">
          <el-button type="info" plain @click="goBack">上一步</el-button>
          <el-button type="primary" plain class="next" @click="goNext" :disabled="nextBool">下一步</el-button>
      </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from "vuex";
    export default {
      data() {
        return {
          isCollapse: 'false',
          dateInfo: [],
          chooseList: [],
          lastPage: null,
          totals: null,
          teachersList: [],
          priceMin: "",
          priceMax: "",
          types: [
            {
              value: "1",
              key: "课程标题"
            },
            {
              value: "2",
              key: "课程编号"
            },
            {
              value: "3",
              key: "课程id"
            },
            {
              value: "4",
              key: "老师"
            }
          ],
          typeId: "1",
          limit: "",
          currentPage: 1
        };
      },
      created() {
        this.search();
        this.getTeachers();
        if (this.getChooseId.length > 0) {
          this.isCollapse = 'true';
        } else {
          this.isCollapse = 'false';
        }
      },
      computed: {
        ...mapGetters(["getChooseId"]),
        nextBool: function() {
          return this.getChooseId.length == 0;
        }
      },
      watch: {
        getChooseId: {
          handler() {
            //已选课程列表
            if (this.getChooseId.length > 0) {
              this.axios
                .get(
                  `${PHP_URL}/v4/blue/redEnvelope/get_old_class?rid=${this.getChooseId.toString()}`
                )
                .then(response => {
                  this.chooseList = response.data.data;
                  console.log(this.chooseList)
                })
                .catch(function(error) {
                  console.log(error);
                });
            } else {
              this.chooseList = [];
            }
            console.log(this.chooseList)
          },
          immediate: true
        },
        typeId() {
          this.limit = "";
        }
      },
      methods: {
        // handleSelectionChange(val) {
        //   var ary = [];
        //   [].concat(val).map(item => {
        //     ary.push(item.classId);
        //   });
        //   console.log(val);
        //   if (ary.length > 0)
        //     this.$store.commit("saveClassId", { type: 1, content: ary });
        // },
        // setClean() {
        //       this.$store.commit("saveClassId", []);
        //     },
        select(e, row) {
          let choosed = [].concat(this.getChooseId);
          if (e.target.checked) {
            //选中
            if (choosed.toString().indexOf(row.classId.toString()) > -1) {
            } else {
              this.$store.commit("saveClassId", choosed.concat([row.classId]));
            }
          } else {
            //取消
            console.log(row.classId);
            console.log(choosed);
            if (choosed.toString().indexOf(row.classId.toString()) > -1) {
              choosed.map((item, index) => {
                if (choosed[index] == row.classId) {
                  choosed.splice(index, 1);
                  this.$store.commit("saveClassId", choosed);
                  return;
                }
              });
            }
          }
        },

        handleCurrentChange(val) {
          this.currentPage = val;
          this.search();
        },
        search() {
          this.axios
            .get(
              `${PHP_URL}/v4/blue/redEnvelope/get_classes?searchtype=${
                this.typeId
              }&searchvalue=${this.limit}&pageSize=30&page=${
                this.currentPage
              }&pricemin=${this.priceMin}&pricemax=${this.priceMax}`
            )
            .then(response => {
              this.dateInfo = response.data.data.data;

              this.lastPage = response.data.data.last_page;
              this.totals = response.data.data.total;
            })
            .catch(function(error) {
              console.log(error);
            });
        },
        getTeachers() {
          this.axios
            .get(`${PHP_URL}/v4/blue/redEnvelope/get_teacher_list`)
            .then(response => {
              this.teachersList = response.data.data;
            })
            .catch(function(error) {
              console.log(error);
            });
        },

        goBack() {
          this.$store.commit("changeStep", 0);
        },
        goNext() {
          var least = 10000;
          this.$store.commit("changeStep", 2);
          sessionStorage.setItem("leastPrice", "");
          this.axios
            .get(
              `${PHP_URL}/v4/blue/redEnvelope/get_old_class?rid=${this.getChooseId.toString()}`
            )
            .then(response => {
              [].concat(response.data.data).map(function(item, index) {
                if (least > item.classPrice) {
                  least = item.classPrice;
                }

                if (index + 1 == [].concat(response.data.data).length) {
                  sessionStorage.setItem("leastPrice", least);
                }
              });
            });
        },
        cancle(id) {
          let ids = [].concat(this.getChooseId);

          this.$confirm("确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              ids.map((item, index) => {
                if (ids[index] == id) {
                  ids.splice(index, 1);
                  this.$store.commit("saveClassId", ids);
                  return;
                }
              });
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(() => {});
        }
      },
      filters: {
        statusFormat: t => {
          switch (Number(t)) {
            case 0:
              return "未审核";
            case 1:
              return "已上线";
            case 2:
              return "已下线";
            case 3:
              return "已关闭";
            default:
              return t;
          }
        }
      }
    };
</script>

<style scoped lang="less">
    .con {
      margin:30px auto 0;
      .top {
        margin-bottom: 20px;
      }
    }
    .btn {
      margin-top: 30px;
      text-align: center;
    }
    .color {
      margin-left: 10px;
      color: #cccccf;
    }
    .on {
      background: #007acd;
    }
</style>
