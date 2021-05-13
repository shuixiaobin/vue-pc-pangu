<template>
    <div>
        <el-pagination background layout="prev, pager, next" :total="total" :page-count="Number(lastPage)" :page-size="30" @current-change="currentChange" class="container-pagination">
        </el-pagination>
    </div>
</template>

<script>
    export default {
      dataa: function() {
        return {};
      },
      props: ["total", "lastPage"],
      methods: {
        currentChange(val) {
          console.log(val);
          this.$emit("pageData", val);
        }
      }
    };
</script>

<style>
</style>
