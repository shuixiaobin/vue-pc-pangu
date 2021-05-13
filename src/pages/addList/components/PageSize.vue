<template>
    <div id="PageSize">
        <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="30"
        @current-change="currentChange">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name:'pageSize',
    dataa:function(){
        return {
            pageSize:10,
        }
    },
    props:['total'],
    methods:{
         currentChange(val) {
             console.log(val)
             this.$emit("pageData", val);
        },
    }
}
</script>

<style>

</style>
