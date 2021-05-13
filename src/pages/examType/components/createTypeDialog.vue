<template>
    <!-- 新增类型 -->
    <el-dialog id="createTypeDialog" title="新增类型" :visible.sync="createTypeDialogVisible" width="70%" @close="offDialog" :close-on-click-modal="false">
        <label>类型标题：</label>
        <el-input size="mini" style="width:80%;" placeholder="请输入标题" v-model="type_title" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
        <div style="margin-top:20px;">
            <label>类型图标：</label>
            <el-radio-group style="width:80%;" v-model="type_img">
                <el-radio v-for="(item,index) in img_list" :key="index" :label="item.url">
                    <img style="width:40px;height:auto" :src="item.url">
                </el-radio>
            </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="offDialog">取 消</el-button>
            <el-button type="primary" @click="createClassType">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import exam from "../../../api/exam";

    export default {
        name: 'createTypeDialog',
        props: {
            createTypeDialogVisible: { // flag
                default: false,
                type: Boolean
            },
            currentCateId: { // 类型 id
                default: '',
                type: String
            }
        },
        data() {
            return {
                type_title: '',
                type_img: '',
                img_list: []
            }
        },
        created() {
            this.getClassIcon()
        },
        methods: {
            offDialog() {
                this.$emit('offDialog')
            },
            // 获取图标
            async getClassIcon() {
                let data = await exam.getClassIcon()
                if (data) {
                    this.img_list = data
                }
            },
            // 提交
            async createClassType() {
                let param = {
                    cateId: this.currentCateId,
                    img: this.type_img,
                    title: this.type_title.trim()
                }

                if (!this.type_title.trim()) {
                    return this.$message('请填写分类标题')
                }

                if (this.type_title.trim().length > 25) {
                    return this.$message('分类标题最多25个字')
                }

                let data = await exam.createClassType(param)
                if (data) {
                    this.$emit('examTabChange', { type: 'create' }) // 刷列表
                    this.offDialog()
                    this.$message('操作成功')
                }
            }
        }
    }
</script>
<style lang="less">
    #createTypeDialog {
        .el-radio__input {
            margin-top: -28px;
        }

    }
</style>