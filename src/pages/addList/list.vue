<template>
    <div id="list">
        <h1 class="h1">拼团活动管理</h1>
        <div class="div1">
            <id-search @searchInformation="toSearch"></id-search>
        </div>
        <div class="div1">
            <list-table :tableData="tableData" @searchInformation="toSearch" @handSuccess="GoOnline" @handDelete="Downline"></list-table>
        </div>
        <page-size @pageData="topageData" :total="total"></page-size>
    </div>
</template>

<script>
    import idSearch from "@/pages/addList/components/search";
    import listTable from "@/pages/addList/components/listTable";
    import pageSize from "@/pages/addList/components/PageSize";
    export default {
      name: "list",
      data: function() {
        return {
          tableData: [],
          findData: {
            // 页
            page: "1",
            // id
            classId: null,
            // 每页显示条数
            pageSize: 30,
            // 活动状态
            status: null,
            // 标题
            title: null,
            // 开始时间
            beginAt:'',
            // 结束时间
            endAt:''
          },
          // 数据总数量
          total: null
        };
      },
      components: {
        idSearch,
        listTable,
        pageSize
      },
      created() {
        // 调取数据
        this.myGet(`${PHP_URL}/v4/blue/blueCollage/collage_list`)
          .then(res => {
            if (res.code == 10000) {
              this.tableData = res.data.data;
              this.total = res.data.total;
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
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
            this.findData.classId = data.curriculumId;
            this.findData.title = data.curriculumName;
            this.findData.status = data.select;
            this.findData.beginAt = data.beginAt;
            this.findData.endAt = data.endAt
          }
          this.toFindList();
        },
        // 上线
        GoOnline(data) {
          console.log(data);
        },
        // 下线
        Downline(data) {
          console.log(data);
        },
        toFindList() {
          this.myGet(`${PHP_URL}/v4/blue/blueCollage/collage_list`, this.findData)
            .then(res => {
              if (res.code == 10000) {
                this.tableData = res.data.data;
                this.total = res.data.total;
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
