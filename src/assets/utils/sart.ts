const xoption = {
  title: {
    text: "555A-16点位x向质量曲线",
    textStyle: {
      color: "#fff",
      fontSize: "14px",
    },
  },
  grid: {
    left: "8%",
    right: "12%",
    top: "12%",
    bottom: "15%",
  },
  tooltip: {
    trigger: "axis",
    confine: true,
  },
  legend: {
    data: [
      {
        name: "Δx",
        textStyle: {
          color: "#fff",
        },
      },
    ],
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: "none",
        fiterMode: "none",
      },
      dataView: { readOnly: false },
      magicType: { type: ["line", "bar"] },
      restore: {},
      saveAsImage: {},
    },
  },
  dataZoom: [
    {
      realtime: true,
      start: 15,
      end: 35,
      showDetail: true,
      brushSelect: false,
    },
  ],
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisLabel: {
      color: "#fff",
      fontSize:10,
      formatter: function (n: string) {
        const arr = n.split(' ');
        return ` ${arr[0]} \n '${arr[1]}'`
      }
    },
    axisLine: {
      lineStyle: { color: "#fff" }, // x轴坐标轴颜色
    },
    scale: true,
    data: [] as any,

  },
  yAxis: {
    type: "value",
    scale: true,
    axisLabel: { color: "#fff" },
    axisLine: {
      lineStyle: { color: "#fff" }, // y轴坐标轴颜色
    },
  },
  series: [
    {
      name: "Δx",
      color: "#98FB98",
      type: "line",
      data: [] as any,
      // markPoint: {
      //   symbolSize: 55, 
      //   data: [
      //     { type: "max", name: "Max" },
      //     { type: "min", name: "Min" },
      //   ],
      // },
      // markLine: {

      //   data: [
      //     {
      //       type: "average",
      //       name: "Avg",
      //       lineStyle: {
      //         width: 2,
      //       },
      //       label: {
      //         position: "end",
      //         color: "#fff",
      //         formatter: (params) => {
      //           return "Δx-Avg: " + params.value;
      //         },
      //       },
      //     },
      //     [
      //       {
      //         symbol: "none",
      //         x: "90%",
      //         yAxis: "max",
      //       },
      //       {
      //         symbol: "circle",
      //         lineStyle: {
      //           width: 2,
      //         },
      //         label: {
      //           position: "start",
      //           formatter: "Dx-Max",
      //           color: "#fff",
      //         },
      //         type: "max",
      //         name: "最高点",
      //       },
      //     ],
      //   ],
      // },
    },
  ],
};
const yoption = {
  title: {
    text: "555A-16点位y向质量曲线",
    textStyle: {
      color: "#fff",
      fontSize: "14px",
    },
  },
  grid: {
    left: "8%",
    right: "12%",
    top: "12%",
    bottom: "15%",
  },
  tooltip: {
    trigger: "axis",
    confine: true,
  },
  legend: {
    data: [
      {
        name: "Δy",
        textStyle: {
          color: "#5470c6",
        },
      },
    ],
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: "none",
        fiterMode: "none",
      },
      dataView: { readOnly: false },
      magicType: { type: ["line", "bar"] },
      restore: {},
      saveAsImage: {},
    },
  },
  dataZoom: [
    {
      realtime: true,
      start: 15,
      end: 35,
      showDetail: true,
      brushSelect: false,

    },
  ],
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisLabel: {
      color: "#fff",
      fontSize:10,
      formatter: function (n: string) {
        const arr = n.split(' ');
        return ` ${arr[0]} \n '${arr[1]}'`
      }
    },
    axisLine: {
      lineStyle: { color: "#fff" }, // x轴坐标轴颜色
    },
    scale: true,
    data: [] as any,
  },
  yAxis: {
    type: "value",
    scale: true,
    axisLabel: { color: "#fff" },
    axisLine: {
      lineStyle: { color: "#fff" }, // y轴坐标轴颜色
    },
  },
  series: [
    // {
    //   name: "Δx",
    //   color: "#fff",
    //   type: "line",
    //   data: [],
    //   markPoint: {
    //     symbolSize: 55, 
    //     data: [
    //       { type: "max", name: "Max" },
    //       { type: "min", name: "Min" },
    //     ],
    //   },
    //   markLine: {

    //     data: [
    //       {
    //         type: "average",
    //         name: "Avg",
    //         lineStyle: {
    //           width: 2,
    //         },
    //         label: {
    //           position: "end",
    //           color: "#fff",
    //           formatter: (params) => {
    //             return "Δx-Avg: " + params.value;
    //           },
    //         },
    //       },
    //       [
    //         {
    //           symbol: "none",
    //           x: "90%",
    //           yAxis: "max",
    //         },
    //         {
    //           symbol: "circle",
    //           lineStyle: {
    //             width: 2,
    //           },
    //           label: {
    //             position: "start",
    //             formatter: "Dx-Max",
    //             color: "#fff",
    //           },
    //           type: "max",
    //           name: "最高点",
    //         },
    //       ],
    //     ],
    //   },
    // },
    {
      name: "Δy",
      type: "line",
      data: [] as any,
      // markPoint: {
      //   symbolSize: 55, 
      //   data: [
      //     // 标出 曲线中的峰值
      //     { type: "max", name: "Max" },
      //     { type: "min", name: "Min" },
      //   ],
      // },
      // markLine: {
      //   data: [
      //     {
      //       type: "average",
      //       name: "Avg",
      //       lineStyle: {
      //         width: 2,
      //       },
      //       label: {
      //         position: "end",
      //         color: "#fff",
      //         formatter: (params) => {
      //           return "Δy-Avg: " + params.value;
      //         },
      //       },
      //     },
      //     [
      //       {
      //         symbol: "none",
      //         x: "90%",
      //         yAxis: "max",
      //       },
      //       {
      //         symbol: "circle",
      //         lineStyle: {
      //           width: 2,
      //         },
      //         label: {
      //           position: "start",
      //           formatter: "Dy-Max",
      //           color: "#fff",
      //         },
      //         type: "max",
      //         name: "最高点",
      //       },
      //     ],
      //   ],
      // },
    },
    // {
    //   name: "Δz",
    //   type: "line",
    //   data: [],
    //   markPoint: {
    //     symbolSize: 55, 
    //     data: [
    //       { type: "max", name: "Max" },
    //       { type: "min", name: "Min" },
    //     ],
    //   },
    //   markLine: {
    //     data: [
    //       {
    //         type: "average",
    //         name: "Avg",
    //         label: {
    //           color: "#fff",
    //           position: "end",
    //           formatter: (params) => {
    //             return "Δz-Avg: " + params.value;
    //           },
    //         },
    //       },
    //       [
    //         {
    //           symbol: "none",
    //           x: "90%",
    //           yAxis: "max",
    //         },
    //         {
    //           symbol: "circle",
    //           label: {
    //             position: "start",
    //             formatter: "Δz-Max",
    //             color: "#fff",
    //           },
    //           type: "max",
    //           name: "最高点",
    //         },
    //       ],
    //     ],
    //   },
    // },
  ],
};
const zoption = {
  title: {
    text: "555A-16点位z向质量曲线",
    textStyle: {
      color: "#fff",
      fontSize: "14px",
    },
  },
  grid: {
    left: "8%",
    right: "12%",
    top: "12%",
    bottom: "15%",
  },
  tooltip: {
    trigger: "axis",
    confine: true,
  },
  legend: {
    data: [
      // {
      //   name: "Δx",
      //   textStyle: {
      //     color: "#fff",
      //   },
      // },
      // {
      //   name: "Δy",
      //   textStyle: {
      //     color: "#5470c6",
      //   },
      // },
      {
        name: "Δz",
        textStyle: {
          color: "#91cc75",
        },
      },
    ],
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: "none",
        fiterMode: "none",
      },
      dataView: { readOnly: false },
      magicType: { type: ["line", "bar"] },
      restore: {},
      saveAsImage: {},
    },
  },
  dataZoom: [
    {
      realtime: true,
      xAxisIndex: [0, 1],
      start: 15,
      end: 35,
      showDetail: true,
      brushSelect: false,
    },
  ],
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisLabel: {
      color: "#fff",
      fontSize:10,
      formatter: function (n: string) {
        const arr = n.split(' ');
        return ` ${arr[0]} \n '${arr[1]}'`
      }
    },
    axisLine: {
      lineStyle: { color: "#fff" }, // x轴坐标轴颜色
    },
    scale: true,
    data: [] as any,
  },
  yAxis: {
    type: "value",
    scale: true,
    axisLabel: { color: "#fff" },
    axisLine: {
      lineStyle: { color: "#fff" }, // y轴坐标轴颜色
    },
  },
  series: [
    {
      name: "Δz",
      color: '#FF6347',
      type: "line",
      data: [] as any,
      // markPoint: {
      //   symbolSize: 55, 
      //   data: [
      //     { type: "max", name: "Max" },
      //     { type: "min", name: "Min" },
      //   ],
      // },
      // markLine: {
      //   data: [
      //     {
      //       type: "average",
      //       name: "Avg",
      //       label: {
      //         color: "#fff",
      //         position: "end",
      //         formatter: (params) => {
      //           return "Δz-Avg: " + params.value;
      //         },
      //       },
      //     },
      //     [
      //       {
      //         symbol: "none",
      //         x: "90%",
      //         yAxis: "max",
      //       },
      //       {
      //         symbol: "circle",
      //         label: {
      //           position: "start",
      //           formatter: "Δz-Max",
      //           color: "#fff",
      //         },
      //         type: "max",
      //         name: "最高点",
      //       },
      //     ],
      //   ],
      // },
    },
  ],
};
export default [xoption, yoption, zoption];
