<template>
    <div>
        <div class="container-title">
            <h2>发红包活动管理</h2>
        </div>
        <div class="container">
            <id-search @searchInformation="toSearch"></id-search>
            <list-table :tableData="tableData" @searchInformation="toSearch"></list-table>
            <page-size @pageData="topageData" :total="total" :lastPage="lastPage"></page-size>
        </div>
    </div>
</template>

<script>
    import idSearch from "@/pages/redPackets/list/components/search1";
    import listTable from "@/pages/redPackets/list/components/listTable1";
    import pageSize from "@/pages/redPackets/list/components/PageSize1";
    export default {
      name: "list",
      data: function() {
        return {
          tableData: [],
          findData: {
            page: "1",
            pageSize: 30,
            activityId: null,
            activeName: null,
            beginTime: "",
            endTime: "",
            status: ""
          },
          // 数据总数量
          total: null,
          lastPage: ""
        };
      },
      components: {
        idSearch,
        listTable,
        pageSize
      },
      created() {
        // 调取数据
        this.toFindList();
      },
      methods: {
        // 获取页码
        topageData(data) {
          console.log(data);
          this.findData.page = data;
          this.toFindList();
        },
        // 获取查询数据
        toSearch(data) {
          if (data) {
            Object.assign(this.findData, data);
          }
          this.toFindList();
        },

        toFindList() {
          this.myGet(`${PHP_URL}/v4/blue/redEnvelope/activity_list`, this.findData)
            .then(res => {
              if (res.code == 10000) {
                this.tableData = res.data.data;
                this.total = res.data.total;
                this.lastPage = res.data.last_page;

                console.log(this.total);
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      }
    };
</script>

<style scope lang="less">
    .h1 {
      font-size: 25px;
      padding: 20px;
      font-weight: bold;
    }
    .div1 {
      margin: 30px 20px;
    }
</style>
