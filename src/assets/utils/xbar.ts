import * as echarts from 'echarts'
let colors = [
  {
    offset: 0,
    color: 'rgba(147, 221, 128, 0.7)'
  },
  {
    offset: 1,
    color: 'rgba(102, 52, 27, 0.8)'
  },

]
const option = {
  backgroundColor: '#070d15',
  title: {
    text: "x-bar",
    textStyle: {
      color: "#fff",
      fontSize: "14px",
    },
  },
  legend: {
    // 多个曲线标识
    data: [
      {
        name: "Mean",
        textStyle: {
          color: "#34ace0",
        },
      },
    ],
  },
  xAxis: [
    {
      type: "category",
      axisLabel: { color: "#fff" },
      axisLine: {
        lineStyle: { color: "#181F32" }, // x轴坐标轴颜色
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#181F32',
          type: 'solid',
        }
      },
      scale: true,
      data: [],
    },
    {
      type: "category",
      position: 'top',
      axisLabel: { color: "#fff" },
      axisLine: {
        lineStyle: { color: "#181F32" }, // x轴坐标轴颜色
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#181F32',
          type: 'solid',
        }
      },
      scale: true,
      data: [],
    }
  ],
  yAxis: {
    type: "value",
    scale: true,
    min: function (value) {//取最小值向下取整为最小刻度
      return Math.floor(value.min)
    },
    max: function (value) {//取最大值向上取整为最大刻度
      return Math.ceil(value.max)
    },
    splitNumber: 3,
    // splitLine: {
    //   lineStyle: {
    //     type: "dashed",
    //     color: "#DDD",
    //   },
    //   show: false, // 不显示y刻度
    // },
    // axisLine: {
    //   show: false,
    //   lineStyle: { color: "#fff" }, // y轴坐标轴颜色
    // },
    show: false, // 不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
    axisTick: {
      show: false // 不显示坐标轴刻度线
    },
    axisLine: {
      show: false, // 不显示坐标轴线
    },
    axisLabel: {
      show: false, // 不显示坐标轴上的文字
    },
    splitLine: {
      show: false // 不显示网格线
    },

  },
  graphic: {
    type: "text",
    left: "center",
    top: "22%",
    z: 2,
    zlevel: 100,
    style: {
      text: `GroupNum:30 Center = 59 StdDev = 0.972 `,
      x: 100,
      y: 100,
      textAlign: "center",
      fill: "#fff",
      fontSize: "16",
    },
  },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: "8%",
    right: "8%",
    top: "14%",
    bottom: "8%",
  },
  series: [
    {
      name: "Mean",
      type: "line",
      data: [],
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, colors, false),
        }
      },
      lineStyle: {
        width: 2,
        color: {
          type: "linear",

          colorStops: [
            {
              offset: 0,
              color: "#A9F387", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#ee0000", // 100% 处的颜色?
            },
          ],
          globalCoord: false, // 缺省为 false
        },
        shadowColor: "rgba(72,216,191, 0.3)",
        shadowBlur: 10,
        shadowOffsetY: 20,
      },
      itemStyle: {
        color: "#fff",
        borderWidth: 10,
        /*shadowColor: 'rgba(72,216,191, 0.3)',
              shadowBlur: 100,*/
        borderColor: "#A9F387",
      },
      smooth: true,
      // 标记的两条虚线
      markLine: {
        symbol: "none",
        silent: true,
        lineStyle: [
          [{ type: "dashed" }],
          [{ type: "solid" }],
          [{ type: "dashed" }],
        ],
        label: { position: "start" },
        data: [
          {
            yAxis: 88,
            name: "ucl",
            lineStyle: { width: 1.656, color: "#ff6367" },
            label: { show: false },
          },
          {
            yAxis: 59,
            name: "cl",
            lineStyle: { width: 1.656, color: "#D8D8D8" },
            label: { show: false },
          },
          {
            yAxis: 30,
            name: "lcl",
            lineStyle: { width: 1.656, color: "#46C67F" },
            label: { show: false },
          },
        ],
      },
      /*
       * 标记的文字
       */
      markPoint: {
        silent: true,
        label: { fontSize: 33.12 },
        data: [
          {
            yAxis: 88,
            x: "0%",
            symbolSize: 0.1,
            label: {
              offset: [0, -15],
              backgroundColor: "rgba(255, 72, 74, 0.5)",
              color: "#fff",
              padding: [3.312, 8.28],
              fontSize: 13,
              borderRadius: 13.248,
              position: "right",
              formatter: function (p) {
                return `${p.data.yAxis}`;
              },
            },
          },
          {
            yAxis: 88,
            x: "100%",
            symbolSize: 0.1,
            label: {
              backgroundColor: "rgba(255, 72, 74, 0.5)",
              color: "#fff",
              offset: [0, -15],
              padding: [3.312, 8.28],
              fontSize: 16,
              borderRadius: 13.248,
              position: "left",
              formatter: function (p) {
                return `UCL=${p.data.yAxis}`;
              },
            },
          },// ucl

          {
            yAxis: 59,
            x: "0%",
            symbolSize: 0.1,
            label: {
              offset: [0, 15],
              backgroundColor: "rgba(220, 220, 220, 0.5)",
              color: "rgba(51, 51, 51, 1)",
              padding: [3.312, 8.28],
              fontSize: 13,
              borderRadius: 13.248,
              position: "right",
              formatter: function (p) {
                return `${p.data.yAxis}`;
              },
            },
          },
          {
            yAxis: 59,
            x: "100%",
            symbolSize: 0.1,
            label: {
              offset: [0, 15],
              backgroundColor: "rgba(220, 220, 220, 0.5)",
              color: "rgba(51, 51, 51, 1)",
              padding: [3.3123, 8.28],
              fontSize: 16,
              borderRadius: 13.248,
              position: "left",
              formatter: function (p) {
                return `CL=${p.data.yAxis}`;
              },
            },
          }, // cl

          {
            yAxis: 30,
            x: "0%",
            symbolSize: 0.1,
            label: {
              backgroundColor: "rgba(25, 189, 122)",
              color: "#fff",
              offset: [0, 30],
              padding: [3.312, 8.28],
              fontSize: 13,
              borderRadius: 13.248,
              position: "right",
              formatter: function (p) {
                return `${p.data.yAxis}`;
              },
            },
          },
          {
            yAxis: 30,
            x: "100%",
            symbolSize: 0.1,
            label: {
              offset: [0, 30],
              backgroundColor: "rgba(25, 189, 122",
              color: "#fff",
              padding: [3.312, 8.28],
              fontSize: 16,
              borderRadius: 13.2481,
              position: "left",
              formatter: function (p) {
                return `LCL=${p.data.yAxis}`;
              },
            },
          },
        ],
      },
    },
  ],
};

export default option;
