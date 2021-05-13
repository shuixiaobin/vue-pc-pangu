<template>
    <!-- 合集列表 dialog -->
    <el-dialog
        title="添加合集"
        id="interseList"
        :visible.sync="handleDialogVisible"
        width="70%"
        @close="offDialog"
        :close-on-click-modal="false"
    >
        <div>
            <div style="padding-bottom:20px">
                <!-- <el-select size="mini" v-model="cateId" placeholder="请选择考试类型">
                    <el-option v-for="(item,key) in examTypeList" :key="key" :label="item.name" :value="key">
                    </el-option>
                </el-select> -->
                <el-select
                    size="mini"
                    v-model="createSearchType"
                    placeholder="请选择（选填）"
                >
                    <el-option
                        v-for="item in createSearchData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
                <el-input
                    size="mini"
                    style="width:320px;"
                    type="number"
                    v-if="createSearchType==='1'"
                    v-model="currentClassId"
                    placeholder="请输入合集ID"
                ></el-input>
                <el-input
                    size="mini"
                    style="width:320px;"
                    v-if="createSearchType==='2'"
                    v-model="currentClassName"
                    placeholder="请输入合集名称"
                ></el-input>
                <el-button
                    type="primary"
                    size="mini"
                    @click="searchList()"
                >搜 索</el-button>
            </div>
            <el-tabs v-model="currentTab">
                <el-tab-pane
                    label="可选合集"
                    name="first"
                >
                    <p style="padding-bottom:20px;">
                        <el-button
                            style="margin-left:0"
                            v-show="!isCheckAll"
                            type="primary"
                            size="mini"
                            @click="isClassCheckAll(true)"
                        >全选</el-button>
                        <el-button
                            style="margin-left:0"
                            v-show="isCheckAll"
                            type="primary"
                            size="mini"
                            @click="isClassCheckAll(false)"
                        >取消全选</el-button>
                    </p>
                    <el-table
                        empty-text="暂无合集"
                        tooltip-effect="dark"
                        :data="classList.data"
                        border
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="checked"
                            label="请选择"
                            width="80"
                            align="center"
                        >
                            <template slot-scope="scope">
                                <input
                                    type="checkbox"
                                    :checked="scope.row.checked"
                                    @click="isClassChecked(scope.row)"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="id"
                            label="合集ID"
                            width="100"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="collectionName"
                            label="合集名称"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            label="包含课数"
                            align="center"
                            width="150"
                        >
                            <template slot-scope="scope">
                                {{scope.row.price}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="合集状态"
                            align="center"
                            width="100"
                        >
                            <template slot-scope="scope">
                                {{scope.row.status|statusFilter}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane
                    :label="'已选合集'+chooseClass"
                    name="second"
                >
                    <el-table
                        empty-text="请选择合集"
                        :data="checkClassList.data"
                        border
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="id"
                            label="合集ID"
                            width="100"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="collectionName"
                            label="合集名称"
                            align="center"
                        >
                        </el-table-column>
                        <el-table-column
                            label="包含课数"
                            align="center"
                            width="150"
                        >
                            <template slot-scope="scope">
                                {{scope.row.price}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="合集状态"
                            align="center"
                            width="100"
                        >
                            <template slot-scope="scope">
                                {{scope.row.status|statusFilter}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-button
                                    @click="isClassChecked(scope.row)"
                                    type="text"
                                >取消选择</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <!-- 分页 -->
            <el-pagination
                style="float:right;padding-bottom:20px"
                @current-change="handleClassPage"
                :current-page.sync="page.class_page"
                layout="prev, pager, next"
                :total="classList.total"
            >
            </el-pagination>
        </div>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button @click="offDialog">取 消</el-button>
            <el-button
                type="primary"
                @click="setClass"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import exam from '../../../api/exam'

    export default {
        name: 'interseList',
        props: {
            handleDialogVisible: {
                // flag
                default: false,
                type: Boolean
            },
            currentCateId: {
                // 类型 id
                default: '',
                type: String
            },
            currentTypeId: {
                // 主键 id
                default: '',
                type: Number
            },
            examTypeList: {
                // 考试类型
                default: [],
                type: Array / Object
            }
        },
        data() {
            return {
                isCheckAll: false,
                currentTab: 'first',
                cateId: '', // 考试类型id
                createSearchType: '', // 添加合集筛选条件
                currentClassName: '',
                currentClassId: '',
                classList: {},
                checkClassList: {
                    data: []
                },
                createSearchData: [
                    {
                        value: '1',
                        label: '合集ID'
                    },
                    {
                        value: '2',
                        label: '合集名称'
                    }
                ],
                page: {
                    class_page: 1
                }
            }
        },
        computed: {
            chooseClass() {
                return this.checkClassList.data.length > 0
                    ? `（${this.checkClassList.data.length}）`
                    : ''
            }
        },
        created() {
            this.cateId = (' ' + this.currentCateId).slice(1).toString()
            this.getInterseList()
        },
        methods: {
            // 合集列表
            async getInterseList() {
                let param = {
                    cateId: this.cateId, // 考试类型 id
                    // currentCateId: this.currentCateId,
                    collectId: this.currentClassId, // 搜索合集 id
                    collectTitle: this.currentClassName, // 搜索合集名称
                    page: this.page.class_page
                }
                let res = await exam.getInterseList(param)
                if (
                    res &&
                    Object.prototype.toString.call(res.data) == '[object Array]'
                ) {
                    let check_num = 0 // 全选/取消全选
                    this.classList = {
                        ...res,
                        data: res.data.map(item => {
                            let flag = false
                            if (
                                this.checkClassList.data.some(v => v.id == item.id)
                            ) {
                                flag = true
                                check_num++
                            }

                            return { ...item, checked: flag }
                        })
                    }

                    if (check_num == this.classList.data.length) {
                        this.isCheckAll = true // 取消全选
                    } else {
                        this.isCheckAll = false // 全选
                    }
                }
            },
            // 选中/反选
            isClassChecked(item) {
                let checkClassListIndex = this.checkClassList.data.findIndex(
                    checked => checked.id == item.id
                )

                if (!item.checked) {
                    item.checked = true
                    this.checkClassList.data.push(item)
                } else {
                    item.checked = false
                    this.checkClassList.data.splice(checkClassListIndex, 1)
                }

                console.log('checkClassList:', this.checkClassList)
            },
            // 全选/取消全选
            isClassCheckAll(flag) {
                this.isCheckAll = flag
                this.classList.data.map(item => {
                    let checkClassListIndex = this.checkClassList.data.findIndex(
                        checked => checked.id == item.id
                    )

                    if (flag) {
                        item.checked = true
                        if (!this.checkClassList.data.some(v => v.id == item.id)) {
                            this.checkClassList.data.push(item)
                        }
                    } else {
                        item.checked = false
                        if (this.checkClassList.data.some(v => v.id == item.id)) {
                            this.checkClassList.data.splice(checkClassListIndex, 1)
                        }
                    }

                    return item
                })
            },
            // 添加合集
            async setClass() {
                if (JSON.stringify(this.checkClassList.data) != '[]') {
                    let param = {
                        rid: this.checkClassList.data
                            .reduce((last, item) => {
                                return [...last, item.id]
                            }, [])
                            .join(','),
                        classTitle: this.checkClassList.data
                            .reduce((last, item) => {
                                return [...last, item.collectionName]
                            }, [])
                            .join(','),
                        typeId: this.currentTypeId,
                        type: 1
                    }
                    let data = await exam.setInterseOrClass(param)
                    if (data) {
                        this.$emit('examTabChange')
                        this.offDialog()
                        this.$message('操作成功')
                    }
                } else {
                    this.$message('请勾选合集')
                }
            },
            // 合集列表分页
            handleClassPage(val) {
                this.page.class_page = val
                this.getInterseList()
            },
            searchList() {
                this.page.class_page = 1
                // this.checkClassList.data = []
                this.getInterseList()
            },
            // 关闭
            offDialog() {
                this.page.class_page = 1
                this.$emit('offDialog')
            }
        },
        watch: {
            createSearchType(val) {
                this.currentClassId = ''
                this.currentClassName = ''
            }
        },
        filters: {
            statusFilter(val) {
                let statusTypeMap = {
                    '0': '未上线',
                    '1': '正常',
                    '2': '下线',
                    '4': '删除'
                }

                return statusTypeMap[val]
            }
        }
    }
</script>