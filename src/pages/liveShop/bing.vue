<template>
    <div id="chartPie" class="pie-wrap" style=""></div>
</template>

<script>
    import * as echarts from 'echarts';
    require('echarts/theme/macarons');//引入主题

    export default {
    props: {
        form: {
            type: Object,
            required: true
        }
    },
    data() {
      return {
        chartPie: null,
        yData:[],
        xData:[]
      }
    },
    watch: {
        form: {
            handler(newOptionValue) {
                if(Object.keys(this.form).length > 0){
                    this.xData=[];
                    this.yData=[];
                    this.form.order.map(item=>{
                         this.xData.push(item.Title+"-"+item.count+"单-"+item.moneySum+"元")
                         this.yData.push({value:item.count, name:item.Title+"-"+item.count+"单-"+item.moneySum+"元"}) 
                    }); 
                    this.drawPieChart();
                }
            },
            deep: true
        }
    },
    mounted() {
    },
    methods: {
      drawPieChart() {
        let mytextStyle = {
          color: "#333",                          
          fontSize: 18,                            
        };
        let mylabel = {
          show: true,                 
          position: "bottom",          
          offset: [30, 40],             
          formatter: '{b} : {c} ({d}%)',      
          textStyle: mytextStyle
        };
        this.chartPie = echarts.init(document.getElementById('chartPie'),'macarons');
        this.chartPie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          legend: {
            data:this.xData,                         
            orient: 'vertical',  //垂直显示
            x:'right',
            y:'center',
            textStyle:{
              "fontSize": 20
            }                  
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '50%'],
              label: {
                show: false,
                position: 'left'
              },
              data:this.yData,
  /*             data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
              ], */
              animationEasing: 'cubicInOut',
              animationDuration: 2600,
         /*      label: {           
                emphasis: mylabel
              } */
            }
          ]
        });
      }
    }
  }
</script>

<style lang='less' scope>
    .pie-wrap{
        width:100%;
        height:400px;
    }
</style>