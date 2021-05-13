<template>
    <!-- 课程大纲：批量排序 -->
    <el-dialog title="批量调整顺序" class="batchSort" :before-close="closeRelevance" :visible.sync="isBatchSort">
        <div class="batchSort-top">
            <el-select v-if="isFlag!=2" v-model="currentRelevanceOption" no-data-text="请选择可移动节点" placeholder="请选择" size="mini">
                <el-option v-for="(item,index) in currentRelevanceOptions" :key="index" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-button class="el-icon-refresh batch-btn" type="primary" @click="submitSort" size="mini">批量移动</el-button>
        </div>
        <div id="relevanceBatchSort">
            <el-checkbox-group v-model="currentRelevance">
                <el-table :data="relevanceTree" border>
                    <el-table-column label="选择" type="index" width="150" align="center">
                        <template slot-scope="scope" style="text-align:center">
                            <div style="overflow:hidden;display:inline-block;width: 23px;">
                                <el-checkbox :label="scope.row.id" @change="changeCurrentType(scope.row)" :disabled="checkboxFilter(scope.row)" v-if="scope.row.type<2">
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="课件名称" type="name" header-align="center">
                        <template slot-scope="scope">
                            <span v-for="(space, levelIndex) in scope.row._level" :key="levelIndex" class="ms-tree-space"></span>
                            <span class="button is-outlined is-primary is-small" v-if="toggleIconShow(scope.row)" @click="toggle(scope.row)">
                                <i v-if="!scope.row._expanded" class="el-icon-arrow-right" aria-hidden="true"></i>
                                <i v-if="scope.row._expanded" class="el-icon-arrow-down" aria-hidden="true"></i>
                            </span>
                            <span v-else class="ms-tree-space"></span>
                            <span :title="scope.row.name">
                                {{ scope.row.name }}
                            </span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="顺序" type="sex" width="200" align="center">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.serial_number" controls-position="right" @change="setSort()" :min="1"></el-input-number>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-checkbox-group>
        </div>
        <div style="margin-top:30px;text-align:center;">
            <el-button type="primary" @click="closeRelevance">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {removeByValue, getParams} from '@/config/utils'
    const ERR_OK = 10000

    export default {
        name: 'relevanceBatchSort',
        props: {
            dataSource: {
                type: [Object, Array],
                default: null
            },
            isFlag: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                relevanceTree: [],
                isBatchSort: false,
                netClassId: getParams('netClassId'), //课程id
                currentTypeName: '', // 选中层级 name
                currentType: '', // 选中层级 type
                currentRelevance: [], // 选中层级 id
                idAll: [], // 后台提交数据
                currentRelevanceOptions: [], // 父级下拉
                currentRelevanceOption: '请选择' // 选中父级下拉
            }
        },
        computed: {
            allData() {
                let newData = JSON.parse(JSON.stringify(this.dataSource))
                this.relevanceTree = newData
                return newData
            },
            userName(){
                return localStorage.getItem("userName");
            },
            userId(){
                return localStorage.getItem("userId");
            }           
        },
        watch: {
            allData(val) {
                //console.log(val)
            },
            currentType(newVal, oldVal) { // type改变重置复选框，请求下拉数据
                this.$nextTick(() => {
                    if (newVal != oldVal && newVal != '') {
                        let currentRelevance = [].concat(this.currentRelevance[this.currentRelevance.length - 1])

                        this.currentRelevance = [].concat(currentRelevance)
                        this.currentTypeName = newVal == 1 ? '课程' : '课件'

                        // 下拉数据
                        this.myGet(`${PHP_URL}/v4/pc/syllabus/syllabus_parent`, {
                            netClassId: this.netClassId,
                            type: newVal
                        }).then(res => {
                            this.currentRelevanceOption = '请选择'
                            this.currentRelevanceOptions = res.data
                        }).catch(err => {
                            this.$message.error(err.message);
                        });
                    }
                })
            }
        },
        mounted() {
            this.$nextTick(() => {
                eventBus.$on('relevanceBatchSort', data => {
                    eventBus.$emit('updata') //..规避同步数据 bug
                    this.isBatchSort = data.isBatchSort
                })
            })
        },
        methods: {
            toggleIconShow(record) {
                /**
                 * 点击展开和关闭的时候，图标的切换
                 */
                if (record.children && record.children.length > 0) {
                    return true
                }
                return false
            },
            changeCurrentType(row) {
                if (row.type != this.isFlag) {
                    const { serial_number } = row

                    this.currentType = row.type
                    if (!this.idAll.some(v => v[serial_number] == row.id)) {
                        this.idAll.push({
                            [serial_number]: row.id
                        })
                    } else {
                        this.idAll.splice(this.idAll.findIndex(i => i[serial_number] == row.id), 1)
                    }
                    console.log('idAll:', this.idAll)
                } else { return }
            },
            // 批量移动
            submitSort() {
                if (JSON.stringify(this.currentRelevance) != '[]' && this.currentRelevanceOption != '请选择') {
                    this.myPost(`${PHP_URL}/v4/pc/syllabus/syllabus_batch_movement`, {
                        // idAll: this.currentRelevance,
                        idAll: this.idAll,
                        netClassId: this.netClassId,
                        parent_id: this.currentRelevanceOption,
                        userName:this.userName,//'htwx_3855101'
                        userId:Number(this.userId)//842                        

                    }).then(res => {
                        if (res.code == ERR_OK) {
                            this.$message.success('操作成功')
                            this.resetSort()
                        }
                    }).catch(err => {
                        this.$message.error(err.message)
                    })
                } else {
                    let typeName = this.currentType == 1 ? '阶段' : '课程'

                    if (JSON.stringify(this.currentRelevance) == '[]') {
                        this.$message.warning(`请勾选${this.currentTypeName}节点`)
                    } else {
                        this.$message.warning(`请选择${typeName}`)
                    }
                }
            },
            // 刷新
            resetSort() {
                this.idAll = []
                this.currentRelevance = []
                this.currentRelevanceOption = '请选择'

                eventBus.$emit("updata", {}) //..
            },
            toggle(rowData) {
                let childLen = rowData.children.length
                if (rowData._expanded) {
                    /**
                     * 1.将当前数据放在dataArr中，
                     * 2.获取当前数据的children元素的唯一标识
                     * 3.把展开时修改后的数据遍历对比，删除需要删除的元素
                     */
                    let dataArr = []
                    dataArr.push(rowData)
                    let arr = this.getChildFlowId(dataArr, [])
                    for (let i = 0; i < childLen; i++) {
                        if (rowData.children[i].children) {
                            for (
                                let index = 0; index < rowData.children[i].children.length; index++
                            ) {
                                this.relevanceTree.map(value => {
                                    if (arr.indexOf(value.parent_id) > -1) {
                                        removeByValue(this.relevanceTree, value)
                                    }
                                })
                            }
                        }

                        this.relevanceTree.map(value => {
                            if (arr.indexOf(value.parent_id) > -1) {
                                removeByValue(this.relevanceTree, value)
                            }
                        })
                    }
                } else {
                    /**
                     * index为获取当前数据在tableData中的索引。
                     * pre为当前点击元素之前的数据。
                     * last为当前点击元素之后的数据。
                     * concatChildren是把pre和当前数据的子数据组合成一个数据，最后再和last合并成一个数组
                     */
                    rowData.children = this.setSpaceIcon(rowData.children, rowData._level)
                    let index = this.relevanceTree.indexOf(rowData)
                    let pre = this.relevanceTree.slice(0, index + 1)
                    let last = this.relevanceTree.slice(index + 1)
                    let concatChildren = pre.concat(rowData.children)
                    this.relevanceTree = concatChildren.concat(last)
                }
                rowData._expanded = !rowData._expanded
            },
            getChildFlowId(data, emptyArr) {
                // 获取子级的flowId
                Array.from(data).forEach(record => {
                    emptyArr.push(record.id)
                    if (record.children && record.children.length > 0) {
                        let childFlowIdArr = this.getChildFlowId(record.children, emptyArr)
                        emptyArr.concat(childFlowIdArr)
                    }
                })
                return emptyArr
            },
            setSpaceIcon(data, level) {
                // 设置第一列的空格和方向按钮
                let _level = 0
                data.forEach(value => {
                    value._expanded = false
                    if (level !== undefined && level !== null) {
                        _level = level + 1
                    } else {
                        _level = 1
                    }
                    value._level = _level
                    if (value.children && value.children.length > 0) {
                        this.setSpaceIcon(value.children, _level)
                    }
                })
                return data
            },
            // 批量排序复选框 disabled
            checkboxFilter(row) {
                const { type } = row
                let flag = false

                // 如果是最高级 不可选择 不可移动
                if (type == this.isFlag) flag = true

                return flag
            },
            // 关闭 dialog前重置 data
            closeRelevance() {
                this.relevanceTree = []
                this.currentTypeName = '' // 选中层级 name
                this.currentType = '' // 选中层级 type
                this.currentRelevance = [] // 选中层级 id
                this.currentRelevanceOptions = [] // 父级下拉
                this.currentRelevanceOption = '请选择' // 选中父级下拉
                this.isBatchSort = false
            }
        }
    }
</script>
<style lang="less" scoped>
    .batchSort-top {
        display: inline-block;
        float: right;
        padding: 0 0 20px 0;

        .batch-btn {
            margin-left: 20px;
        }
    }

    #relevanceBatchSort {
        width: 100%;
        min-height: 150px;
        max-height: 580px;
        _height: 100px; //IE6
        margin-left: 10px;
        margin-right: auto;
        outline: 0; // font-size: 12px;
        word-wrap: break-word;
        overflow-x: hidden;
        overflow-y: auto; //超过最大高度就出现滚动条
        _overflow-y: visible;
        border: 1px solid #e4e3e3;

        .ms-tree-space {
            position: relative;
            top: 1px;
            display: inline-block;
            font-family: 'Glyphicons Halflings';
            font-style: normal;
            font-weight: 400;
            line-height: 1;
            width: 18px;
            height: 14px;
        }

        .ms-tree-space::before {
            content: '';
        }
    }
</style>