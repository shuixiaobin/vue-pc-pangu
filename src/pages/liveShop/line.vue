<template>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->  
    <div id="chartLine" class="line-wrap"></div>
</template>

<script>
    import * as echarts from 'echarts';
    require('echarts/theme/shine');//引入主题

    export default {
     props: {
        form: {
            type: Object,
            required: true
        }
    },
    data() {
      return {
        chartLine: null,
        xData: [],
        yData: []
      }
    },
    watch: {
        form: {
            handler(newOptionValue) {
                if(Object.keys(this.form).length > 0){
                    var thexx = Object.keys(this.form.peak_user);
                    var xx = thexx.map(item=>{
                        return item.split(":")[0] + ":" + item.split(":")[1];
                    });
                    thexx.map(item=>{
                        this.yData.push(this.form.peak_user[item]) 
                    })
                    this.xData = xx;
                    this.drawLineChart();
                }
            },
            deep: true
        }
    },
    mounted() {
    },
    methods: {
      drawLineChart() {
        this.chartLine = echarts.init(this.$el,'shine');// 基于准备好的dom，初始化echarts实例
        let option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['邮件营销'],
                orient: 'horizontal',  //垂直显示
                y: 'bottom',    //延Y轴居中
                x: 'left' ,//居右显示    
                padding:[0,50,0,0] 
            },
            calculable : true,
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.xData
            },
            yAxis: {
                type: 'value',
                name: '（人）'
            },
            series: [{
                data: this.yData,
                type: 'line',
                areaStyle: {}
            }]
        };
        // 使用刚指定的配置项和数据显示图表
        this.chartLine.setOption(option);
      }
    }
  }
</script>

<style lang='less' scope>
    .line-wrap{
        width:50%;
        height:400px;
        left:50%;
        margin-left:-25%;
    }
</style>