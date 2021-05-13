export const radarChart = ({ chart, el, indicator, value }) => {
  var radarChart = chart.init(el);
  radarChart.setOption({
    radar: {
      name: {
        textStyle: {
          color: "rgba(0, 0, 0, 1)",
          fontSize: 14,
          fontWeight: "bold",
          borderRadius: 3
        }
      },
      indicator,
      splitArea: {
        show: true,
        areaStyle: {
          color: ["transparent", "transparent", "transparent"] // 图表背景网格的颜色
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: "rgba(228, 231, 237, 1)" // 图表背景网格线的颜色
        }
      }
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value,
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  return params.value;
                }
              }
            }
          }
        ],
        itemStyle: {
          normal: {
            color: "rgba(91, 143, 249, 1)", // 图表中各个图区域的边框线拐点颜色
            lineStyle: {},
            areaStyle: {
              color: "rgba(91, 143, 249, 0.2)"
            }
          }
        }
      }
    ]
  });
};
