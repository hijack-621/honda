const xpie = {
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  title: [
    {
      text: "当年555A孔误差分布",
      // left: "40%", //居中显示
      top: "18%", //底部显示
      textStyle: {
        color: "#cccccc",
        fontSize: 14,
      },
    },
    // {
    //   text: "当年530B面误差分布",
    //   left: "70%", //居中显示
    //   top: "85%", //底部显示
    //   textStyle: {
    //     color: "#cccccc",
    //     fontSize: 12,
    //   },
    // },
  ],
  // grid: {
  //   left: "8%",
  //   right: "12%",
  //   top: "12%",
  //   bottom: "15%",
  // },
  legend: {
    // 修改 控制/分辨具体时图表的小toolbar
    orient: 'vertical',
    icon: 'circle',
    left: '50%',
    top: '38%',
    itemGap: 12,
    data: [
      {
        name: "perfectRate",
        textStyle: {
          color: "#5470c6",
        },
      },
      {
        name: "wellRate",
        textStyle: {
          color: "#91cc75",
        },
      },
      {
        name: "warnRate",
        textStyle: {
          color: "#fac858",
        },
      },
      {
        name: "errorRate",
        textStyle: {
          color: "#ee6666",
        },
      },
    ],
    // formatter:function (name) {
    //   return name + ' qqq ' 
    // }
    
},
  toolbox: {
    show: false,
    feature: {
      mark: { show: false },
      // dataView: { show: true, readOnly: false },
      // restore: { show: true },
      // saveAsImage: { show: true }
    },
  },
  series: [
    {
      name: "All Holes Rate-Pie",
      type:'pie',
      selectedMode: 'multiple',
      radius: "50%",
      width: "100%",
      height: "100%",
      center: ["25%", "65%"],
      itemStyle: {
        borderRadius: 5,
      },
      labelLine: {
        show: false, //隐藏指示线
      },
      label: {
        show: false, //隐藏标示文字
      },
      // label: {
      //   show: false,
      //   normal: {
      //     textStyle: {
      //       fontSize: 16, // 改变标示文字的大小
      //       color: "#f1f1fe",
      //     },
      //   },
      // },
      emphasis: {
        label: {
          show: false,
        },
      },
      encode: {
        itemName: "Hole",
        value: "在线计测孔误差分布",
      },
      data: [] as any,
    },
    // {
    //   name: "All Edges Rate-Pie",
    //   type: "pie",
    //   radius: "50%",
    //   width: "100%",
    //   height: "100%",
    //   center: ["75%", "50%"],
    //   itemStyle: {
    //     borderRadius: 5,
    //   },
    //   label: {
    //     show: true,
    //     normal: {
    //       textStyle: { // 设置指示文字颜色和字体大小
    //         fontSize: 16, // 改变标示文字的大小
    //         color: "#f1f1fe",
    //       },
    //     },
    //   },
    //   encode: {
    //     itemName: "Edge",
    //     value: "在线计测面误差分布",
    //   },
    //   data: [],
    // },
  ],
};

export { xpie };
