<template>
    <!-- 新增类型 -->
    <el-dialog id="changeIconDialog" title="修改图标" :visible.sync="changeIconDialogVisible" width="70%" @close="offDialog" :close-on-click-modal="false">
        <div style="margin-top:20px;">
            <p>
                <label style="line-height: 55px;">原图标：</label><img style="width:40px;height:auto;margin-bottom: -12px;" :src="icon">
            </p>
            <label>类型图标：</label>
            <el-radio-group style="width:80%;" v-model="type_img">
                <el-radio v-for="(item,index) in img_list" :key="index" :label="item.url">
                    <img style="width:40px;height:auto" :src="item.url">
                </el-radio>
            </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="offDialog">取 消</el-button>
            <el-button type="primary" @click="setIcon">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import exam from "../../../api/exam";

    export default {
        name: 'createTypeDialog',
        props: {
            changeIconDialogVisible: { // flag
                default: false,
                type: Boolean
            },
            currentTypeId: {
                // 主键 id
                default: "",
                type: Number
            },
            icon: { // 原图标
                default: '',
                type: String
            }
        },
        data() {
            return {
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
                    this.type_img = this.icon
                    this.img_list = data
                }
            },
            // 提交
            async setIcon() {
                let param = {
                    img: this.type_img,
                    typeId: this.currentTypeId
                }

                let data = await exam.setIcon(param)

                if (data) {
                    this.$emit('examTabChange') // 刷列表
                    this.offDialog()
                    this.$message('操作成功')
                }
            }
        }
    }
</script>
<style lang="less">
    #changeIconDialog {
        .el-radio__input {
            margin-top: -28px;
        }

    }
</style>