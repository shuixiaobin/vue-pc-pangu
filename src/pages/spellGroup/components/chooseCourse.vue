<template>
    <div class="con">
        <el-radio-group v-model="editFlag" style="margin-bottom: 20px;">
                <el-radio-button :label="false">选择课程</el-radio-button>
                <el-radio-button :label="true">已选课程</el-radio-button>
            </el-radio-group>
        <div v-if="!editFlag">
            <div class="top" style="width:1000px">
                <el-row :gutter="10">
                    <el-col :span="8">
                            <span style="float:left;margin-right:20px;margin-top:10px">课程价格:</span>
                            <el-input v-model="minPrice" style="float:left;width:80px"></el-input>
                            <span style="float:left;margin-right:20px;margin-left:20px;margin-top:10px">--</span>
                            <el-input v-model="maxPrice" style="float:left;width:80px"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="value" placeholder="课程标题">
                            <el-option v-for="item in types" :key="item.key" :label="item.key" :value="item.value" :change="dos(value)">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4" >
                        <el-input v-model.trim="limit" placeholder="不限"></el-input>
                    </el-col>
                    <!-- <el-col :span="3">
                        <el-select v-model="sta" placeholder="选择课程状态">
                            <el-option v-for="item in option" :key="item.key" :label="item.key" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col> -->
                    <el-col :span="2" >
                        <el-button type="primary" plain class="next" @click="search('this.limit')">搜索</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="warning" plain class="next" @click="clear">重置</el-button>
                    </el-col>
                </el-row>
            </div>
            <!-- @current-change="handleSelectionChange" -->
            <el-table :data="dateInfo" ref="singleTable" highlight-current-row  style="width: 100%">
                <el-table-column width="80">
                    <template slot-scope="scope" wid>
                        <input type="checkbox" id="scope.row.rid" :checked="getChooseRid.toString().indexOf(scope.row.rid)>-1" :value="scope.row.rid" style="width:20px;height:20px" @click="select($event,scope.row)">
                    </template> 
                </el-table-column>
                 <!-- <el-table-column
                type="selection"
                width="55">
                </el-table-column> -->
                <el-table-column prop="rid" label="课程ID" width="180">
                </el-table-column>
                <el-table-column prop="title" label="课程名称" width="180">
                </el-table-column>
                <el-table-column prop="actualPrice" label="实际价格" width="180">
                </el-table-column>
                <el-table-column prop="status" label="课程状态" width="180">
                </el-table-column>
                <el-table-column prop="createDate" label="创建日期" width="180">
                </el-table-column>
                <!-- <el-table-column prop="selsectStatus" label="选择状态" width="180">
                </el-table-column> -->

            </el-table>

            <div class="block">
                <el-pagination @current-change="handleCurrentChange" background layout="total, prev, pager, next" :total="totals" :page-count="lastPage">
                </el-pagination>
            </div>

        </div>
        <div class="two" v-if="editFlag">
            <el-table :data="getInfoList"  style="width: 100%">
               <el-table-column prop="rid" label="课程ID" width="180">
                </el-table-column>
                <el-table-column prop="title" label="课程名称" width="180">
                </el-table-column>
                <el-table-column prop="actualPrice" label="实际价格" width="180">
                </el-table-column>
                <el-table-column prop="status" label="课程状态" width="180">
                </el-table-column>
                <el-table-column prop="createDate" label="创建日期" width="180">
                </el-table-column>
                <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button plain @click="cancle(scope.row.rid)">取消参加</el-button>
                        </template>
                    </el-table-column>
            </el-table>
        </div>

        <div class="btn">
            <el-button type="info" plain @click="btns">上一步</el-button>
            <el-button type="primary" plain class="next" @click="btn" :disabled="nextBool">下一步</el-button>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "chooseCourse",
        props: ["values"],
        data() {
            return {
                msg: "",
                types: [{
                        value: "0",
                        key: "课程标题"
                    },
                    {
                        value: "1",
                        key: "课程编号"
                    },
                    {
                        value: "2",
                        key: "课程id"
                    }
                ],
                typeId: null,
                value: "2",
                limit: "",
                options: "",
                dateInfo: [],
                message: [],
                dateInfos: [],
                editInfos: [this.values],
                lastPage: null,
                totals: null,
                currentPage: "",
                dataId: this.values == null ? "" : this.values.classId,
                d: 2,
                ds: 0,
                option: [{
                        value: "0",
                        key: "未上线"
                    },
                    {
                        value: "1",
                        key: "已上线"
                    },
                    {
                        value: "2",
                        key: "已失效"
                    },
                    {
                        value: "3",
                        key: "已结束"
                    }
                ],
                sta: "1",
                checkbool: true,
                nextBool: this.values == null ? true : false,
                editFlag: this.values == null ? false : true,
                radioVal: "",
                minPrice:"",
                maxPrice:"",
                // ["2018/11/9 10:20:32","2018/12/1 10:20:32"]
                // InfoList:[],
            };
        },
        created() {
            this.mesInfo = this.values;
            this.axios
                .get(`${PHP_URL}/v4/blue/blueCollage/collage_classes`)
                .then(response => {
                    this.dateInfo = response.data.data.data;
                    this.dateInfos = response.data.data;
                    //创建选择状态
                    for (let i = 0, len = this.dateInfo.length; i < len; i++) {
                        this.$set(this.dateInfo[i], "selsectStatus", "未选择");
                        this.$set(this.dateInfo[i], "selectBool", false);
                    }

                    //总页数
                    this.lastPage = this.dateInfos.last_page;
                    this.totals = this.dateInfos.total;
                    for (let i = 0; i < this.dateInfo.length; i++) {
                        if (this.dateInfo[i].status == 1) {
                            this.dateInfo[i].status = "已上线";
                        } else {
                            this.dateInfo[i].status = "未上线";
                        }
                    }
                });
                    if (this.getChooseRid.length > 0) {
                        this.nextBool = false;
                    } else {
                        this.nextBool = true;
                    }
        },
        computed:{
            ...mapGetters(['getChooseRid','getInfoList'])
        },
        watch:{
            getChooseRid:{
                handler(){
                    console.log(this.getChooseRid)
                    // 已选课程列表
                    if(this.getChooseRid.length>0){
                        this.axios.get(
                            `${PHP_URL}/v4/blue/blueCollage/class_purchase?classId=${this.getChooseRid.toString()}`
                        ).then(res=>{
                            this.$message.success(res.data.msg);
                            this.nextBool = false;
                            // this.InfoList = res.data.data;
                            // console.log(this.InfoList)
                        }).catch(error=>{
                            this.$message.error(error.data.msg);
                        })
                    }else{
                        this.InfoList = [];
                    }
                }
            },
            getInfoList(){
                console.log(this.getInfoList)
            },
        },
        methods: {
            dos(value) {
                this.typeId = value;
            },
            reChoose() {
                this.nextBool = true;
                this.editFlag = false;
                //this.handleCurrentChange(1);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.axios
                    .get(
                        `${PHP_URL}/v4/blue/blueCollage/collage_classes?page=${
                this.currentPage
              }&type=${
                this.typeId
              }&keyWord=${this.limit}&status=${this.sta}&minPrice=${this.minPrice}&maxPrice=${this.maxPrice}`
                    )
                    .then(response => {
                        this.dateInfo = response.data.data.data;
                        this.dateInfos = response.data.data;
                        //总页数
                        for (let i = 0, len = this.dateInfo.length; i < len; i++) {
                            this.$set(this.dateInfo[i], "selsectStatus", "未选择");
                            this.$set(this.dateInfo[i], "selectBool", false);
                        }
                        this.lastPage = this.dateInfos.last_page;
                        //总条数
                        this.totals = this.dateInfos.total;
                        //   for (let i = 0; i < this.dateInfo.length; i++) {
                        //     this.dateInfo[i].status = "已上线";
                        //   }
                    });
            },
            btn() {
                this.$emit("ds", this.d);
                this.$emit("sendId", this.dataId);
                // this.$emit("sendCourse", this.dataId);
            },
            btns() {
                this.$emit("dds", this.ds);
            },
            // 多选框选择
            select(e,row){
                let choosed = [].concat(this.getChooseRid);
                console.log(choosed)
                console.log(this.getChooseRid.toString().indexOf(row.rid))
                // 判断
                // 如果检索不到返回为-1，如果检索到返回为0
                if(e.target.checked){
                    // 选中
                    // 选中的时候，假如检索不到choosed里面有当前点击的这个id 就 去保存进去（choosed一开始为一个空的[]） 所以每一次判断的时候，数组里面都没有当前点击的rid
                    if(choosed.toString().indexOf(row.rid.toString())>-1){
                    }else{
                        this.$store.commit('saveRid',choosed.concat([row.rid]))
                        this.$store.commit('saveData',row)
                        this.dataId = row.rid
                    }
                }else{
                    // 取消
                    // 取消后，回去检索，发现有这个id 返回为0 ，也就符合了此判断
                   if(choosed.toString().indexOf(row.rid.toString())>-1){
                       choosed.map((item,index)=>{
                        // 如果choosed保存选中数组中和当前点击的id相同的话那么便清除掉
                           if(choosed[index] == row.rid){
                               choosed.splice(index,1);
                                //    重新保存一遍
                                this.$store.commit('saveRid',choosed);
                                this.$store.commit('clearData',row.rid);
                                return
                           }
                       })
                   }
                    
                }
                    if (this.getChooseRid.length > 0) {
                        this.nextBool = false;
                    } else {
                        this.nextBool = true;
                    }
            },
            //取消参加
            cancle(id) {
            let ids = [].concat(this.getChooseRid);

            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                ids.map((item, index) => {
                    if (ids[index] == id) {
                    ids.splice(index, 1);
                    console.log(ids)
                    this.$store.commit("saveRid", ids);
                    this.$store.commit('clearData',id);
                    return;
                    }
                });
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
                })
                .catch(() => {});
            },
            search() {
                this.axios
                    .get(
                        `${PHP_URL}/v4/blue/blueCollage/collage_classes?type=${
                this.typeId
              }&keyWord=${this.limit}&status=${this.sta}&minPrice=${this.minPrice}&maxPrice=${this.maxPrice}`
                    )
                    .then(response => {
                        this.dateInfo = response.data.data.data;
                        for (let i = 0, len = this.dateInfo.length; i < len; i++) {
                            this.$set(this.dateInfo[i], "selsectStatus", "未选择");
                            this.$set(this.dateInfo[i], "selectBool", false);
                        }
                        //总页数
                        this.last_page = response.data.data.last_page;
                        //总条数
                        this.totals = response.data.data.total;
                        // console.log( this.last_page,this.totals)
                        for (let i = 0; i < this.dateInfo.length; i++) {
                            if (this.dateInfo[i].status == 1) {
                                this.dateInfo[i].status = "已上线";
                            } else {
                                this.dateInfo[i].status = "未上线";
                            }
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            clear(){
                this.limit = "";
                this.minPrice = "";
                this.maxPrice = "";
                this.search();
            }
        },
        filters: {
            statusFormat: t => {
                switch (Number(t)) {
                    case 0:
                        return "未上线";
                    case 1:
                        return "已上线";
                    case 2:
                        return "已失效";
                    case 3:
                        return "已结束";
                    default:
                        return t;
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .con {
        width: 98%;
        height: 100%;
        margin-left: 1%;
        background: #ecf1f7;
        border-top: 2px solid #d1d6dc;
        padding-left: 93px;
        padding-top: 44px;

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