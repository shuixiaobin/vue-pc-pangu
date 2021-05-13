<template>
    <!-- 操作日志 dialog -->
    <el-dialog title="操作日志" :visible.sync="changeDialogVisible" width="70%" @close="offDialog" :close-on-click-modal="false">
        <el-table empty-text="暂无操作" :data="handleList.data" border style="width: 100%">
            <el-table-column prop="operate_time" label="时间" width="200" align="center">
            </el-table-column>
            <el-table-column prop="operater" label="操作人" width="150" align="center">
            </el-table-column>
            <el-table-column prop="type" label="操作" align="center" width="150">
            </el-table-column>
            <el-table-column prop="content" label="内容" align="center">
            </el-table-column>
        </el-table>
        <span>共 {{handleList.total}} 条</span>
        <el-pagination style="float:right;" @current-change="handlePage" :current-page.sync="page.handle_page" layout="prev, pager, next" :total="handleList.total">
        </el-pagination>
    </el-dialog>
</template>
<script>
    import exam from "../../../api/exam";

    export default {
        name: 'changeDialog',
        props: {
            changeDialogVisible: { // flag
                default: false,
                type: Boolean
            }
        },
        data() {
            return {
                handleList: {},
                page: {
                    handle_page: 1
                }
            }
        },
        created() {
            this.getOperateLog()
        },
        methods: {
            async getOperateLog() {
                let param = {
                    page: this.page.handle_page
                }

                let data = await exam.getOperateLog(param)
                if (data) {
                    this.handleList = data
                }
            },
            handlePage(val) {
                this.page.handle_page = val;
                this.getOperateLog();
            },
            offDialog() {
                this.page.handle_page = 1;
                this.$emit('offDialog')
            }
        }
    }
</script>