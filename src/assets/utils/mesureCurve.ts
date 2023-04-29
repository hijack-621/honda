let bgColor = '#081A2A';
let color = ['#f7d794', '#00E693', '#f8a5c2', '#2980b9', '#d35400', '#3498db'];
let echartData = [
    {
        name: '1',
        value1: 0.8,
        value2: 1.2,
        value3: 1.5,

    },
    {
        name: '2',
        value1: 1.1,
        value2: 1.5,
        value3: 2.2,
    },
    {
        name: '3',
        value1: -1.0,
        value2: -2.0,
        value3: -1.5,
    },
    {
        name: '4',
        value1: 1.6,
        value2: -1.6,
        value3: 2.1,
    },
    {
        name: '5',
        value1: (Math.random() * 1.2).toFixed(1),
        value2: (Math.random() * 1.2).toFixed(1),
        value3: (Math.random() * 1.2).toFixed(1),
    },
    {
        name: '6',
        value1: (Math.random() * 1.2).toFixed(1),
        value2: (Math.random() * 1.2).toFixed(1),
        value3: (Math.random() * 1.2).toFixed(1),
    },
    {
        name: '7',
        value1: -(Math.random() * 1.2).toFixed(1),
        value2: (Math.random() * 1.2).toFixed(1),
        value3: (Math.random() * 3.2).toFixed(1),
    },
    {
        name: '8',
        value1: (Math.random() * 3.2).toFixed(1),
        value2: (Math.random() * 1.2).toFixed(1),
        value3: -(Math.random() * 1.2).toFixed(1),
    },
    {
        name: '9',
        value1: (Math.random() * 1.2).toFixed(1),
        value2: -(Math.random() * 3.2).toFixed(1),
        value3: (Math.random() * 1.2).toFixed(1),
    },
    {
        name: '10',
        value1: -(Math.random() * 1.2).toFixed(1),
        value2: (Math.random() * 3.2).toFixed(1),
        value3: -(Math.random() * 1.2).toFixed(1),
    },
    {
        name: '11',
        value1: (Math.random() * 1.2).toFixed(1),
        value2: (Math.random() * 1.2).toFixed(1),
        value3: (Math.random() * 3.2).toFixed(1),
    },
    {
        name: '12',
        value1: (Math.random() * 3.2).toFixed(1),
        value2: (Math.random() * 1.2).toFixed(1),
        value3: (Math.random() * 1.2).toFixed(1),
    },
    {
        name: '13',
        value1: (Math.random() * 3.2).toFixed(1),
        value2: -(Math.random() * 1.2).toFixed(1),
        value3: (Math.random() * 3.2).toFixed(1),
    },
    {
        name: '14',
        value1: (Math.random() * 3.2).toFixed(1),
        value2: (Math.random() * 1.2).toFixed(1),
        value3: -(Math.random() * 3.2).toFixed(1),
    },
    {
        name: '15',
        value1: -(Math.random() * 1.2).toFixed(1),
        value2: (Math.random() * 1.2).toFixed(1),
        value3: (Math.random() * 1.2).toFixed(1),
    },
];
// /* 隐藏series 和makeline */
// ref_mcOption.value.series[3].lineStyle!.width! = 0;
// ref_mcOption.value.series[3].showSymbol = false;
// ref_mcOption.value.series[3].symbolSize! = 0;
// ref_mcOption.value.series[3].markLine!.data[0].lineStyle.color = '#ffffff';
// ref_mcOption.value.series[3].markLine!.data[0].lineStyle.opacity = 0;
// ref_mcOption.value.series[3].markLine!.data[0].label.show = false;

let xAxisData = echartData.map((v) => v.name);
let yAxisData1 = echartData.map((v) => v.value1);
let yAxisData2 = echartData.map((v) => v.value2);
let yAxisData3 = echartData.map((v) => v.value3);

const hexToRgba = (hex, opacity) => {
    let rgbaColor = '';
    let reg = /^#[\da-f]{6}$/i;
    if (reg.test(hex)) {
        rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt(
            '0x' + hex.slice(5, 7)
        )},${opacity})`;
    }
    return rgbaColor;
};

let mcOption = {
    graphic: {

        type: "text",
        left: "center",
        top: "47%",
        z: 2,
        zlevel: 100,
        style: {
            text: ` 此测点暂查无数据 `,
            x: 100,
            y: 100,
            textAlign: "center",
            fill: "#fff",
            fontSize: "0",
        },
    },
    dataZoom: [
        {
            type: 'inside',
            realtime: true,
            start: 90,
            end: 100,
            showDetail: true,
            zoomOnMouseWheel: true,
            brushSelect: false,
        }
    ],
    backgroundColor: bgColor,
    color: color,
    grid: {
        top: 45,
        left: 40,
        right: 40,
        bottom: 50,
        containLabel: true,
    },
    legend: {
        right: 10,
        top: 10,
        data: [
            {
                name: 'X轴'
            },
            {
                name: 'Y轴'
            },
            {
                name: 'Z轴'
            },
            {
                name: '对比'
            },
            {
                name: 'Avg'
            },
            {
                name: 'Data'
            },
        ],
        itemWidth: 8, // 设置宽度
        itemHeight: 8, // 设置高度
        itemGap: 20, // 设置间距
        selectedMode: true, //图例点击失效
        icon: 'rect',
        textStyle: {
            fontSize: 12,
            fontFamily: 'Microsoft YaHei',
            fontWeight: 'bold',
            color: '#FFFFFF',
            rich: {
                a: {
                    width:15,
                    lineHeight: 6
                }
            }

        },
        selected: {
            Data: false,
            '对比': false,
        }
    },
    tooltip: {
        trigger: 'axis',
        enterable: true,
        showContent: true,
        triggerOn: 'mousemove',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#1a2995'
            }
        },
        formatter: function (params) { },
        extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            inverse: false,
            axisLabel: {
                formatter: '{value}',

                fontSize: 11,
                fontFamily: 'Microsoft YaHei',
                fontWeight: 400,
                color: '#00FFFF',

            },
            axisLine: {
                lineStyle: {
                    type: [2, 8, 2], // 这里除了默认样式，可以设置[5,10] 来自定义
                    color: 'rgba(202, 255, 253, 0.2)',

                }
            },
            axisTick: {
                show: false,
            },
            data: xAxisData,
        },
        {
            type: 'category',
            position: 'top',
            show: false,
            boundaryGap: false,
            inverse: false,
            axisLabel: {
                formatter: '{value}',

                fontSize: 11,
                fontFamily: 'Microsoft YaHei',
                fontWeight: 400,
                color: '#00FFFF',

            },
            axisLine: {
                lineStyle: {
                    type: [2, 8, 2], // 这里除了默认样式，可以设置[5,10] 来自定义
                    color: 'rgba(202, 255, 253, 0.2)',

                }
            },
            axisTick: {
                show: false,
            },
            data: xAxisData,
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '',
            axisLabel: {

                color: '#00FFFF',
                fontSize: 11,
                fontFamily: 'Microsoft YaHei',
                fontWeight: 400,

            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: [2, 8, 2], // 这里除了默认样式，可以设置[5,10] 来自定义
                    color: 'rgba(202, 255, 253, 0.2)',
                    // 	opacity:0.1
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    type: 'line', // 这里除了默认样式，可以设置[5,10] 来自定义
                    color: 'rgba(202, 255, 253, 0.2)',

                }
            },
            axisTick: {
                show: false,
            },
        },
        {
            type: 'value',
            name: '',
            axisLabel: {

                color: '#00FFFF',
                fontSize: 11,
                fontFamily: 'Microsoft YaHei',
                fontWeight: 400,

            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: [2, 8, 2], // 这里除了默认样式，可以设置[5,10] 来自定义
                    color: 'rgba(202, 255, 253, 0.2)',
                    // 	opacity:0.1
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    type: 'line', // 这里除了默认样式，可以设置[5,10] 来自定义
                    color: 'rgba(202, 255, 253, 0.2)',

                }
            },
            axisTick: {
                show: false,
            },
        },
    ],
    series: [
        {
            name: 'X轴',
            type: 'line',
            smooth: false,
            customInfo: {
                ox: [] as any,
                oy: [] as any,
                oz: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber:[] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            symbolSize: 8,
            showSymbol: true,
            symbol: 'circle', //标记的图形为实心圆
            zlevel: 3,
            itemStyle: {
                color: color[0],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
            lineStyle: {
                width: 2,
                color: color[0],
                shadowBlur: 10,
                shadowColor: hexToRgba(color[0], 0.8),
                shadowOffsetY: 10,
            },
            label: {
                show: false,
                position: 'top',
                color: '#FFFFFF',
                formatter(p) {
                    // return p.value > 0 ? (p.value) : '';
                },
            },
            data: yAxisData1,
            markLine: {
                data: [
                    {
                        type: 'average',
                        name: 'avg-x',
                        lineStyle: {
                            color: '#2ecc71',
                            cap: 'round',
                            opacity: 1
                        },
                        label: {
                            position: "insideMiddleBottom",
                            color: "#fff",
                            formatter: (params) => {
                                return "avgX: " + params.value;
                            },
                        },
                    }
                ]
            }
        },
        {
            name: 'Y轴',
            type: 'line',
            smooth: false,
            customInfo: {
                ox: [] as any,
                oy: [] as any,
                oz: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber:[] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            symbolSize: 8,
            showSymbol: true,
            symbol: 'circle', //标记的图形为实心圆
            zlevel: 3,
            itemStyle: {
                color: color[1],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
            lineStyle: {
                width: 2,
                color: color[1],
                shadowBlur: 10,
                shadowColor: hexToRgba(color[1], 0.8),
                shadowOffsetY: 10,
            },
            data: yAxisData2,
            label: {
                show: false,
                position: 'top',
                color: '#FFFFFF',
                formatter(p) {
                    // return p.value > 0 ? (p.value) : '';
                },
            },
            markLine: {
                data: [
                    {
                        type: 'average',
                        name: 'avg-y',
                        lineStyle: {
                            color: '#2ecc71',
                            cap: 'round',
                            opacity: 1
                        },
                        label: {
                            position: "insideMiddleBottom",
                            color: "#fff",
                            formatter: (params) => {
                                return "avgY: " + params.value;
                            },
                        },
                    }
                ]
            }
        },
        {
            name: 'Z轴',
            type: 'line',
            customInfo: {
                ox: [] as any,
                oy: [] as any,
                oz: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber:[] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            smooth: false,
            showSymbol: true,
            symbolSize: 8,
            symbol: 'circle', //标记的图形为实心圆
            zlevel: 3,
            itemStyle: {
                color: color[2],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
            lineStyle: {
                width: 2,
                color: color[2],
                shadowBlur: 10,
                shadowColor: hexToRgba(color[2], 0.8),
                shadowOffsetY: 10,
            },
            data: yAxisData3,
            label: {
                show: false,
                position: 'top',
                color: '#FFFFFF',
                formatter(p) {
                    // return p.value > 0 ? (p.value) : '';
                },
            },
            markLine: {
                data: [
                    {
                        type: 'average',
                        name: 'avg-z',
                        lineStyle: {
                            color: '#2ecc71',
                            cap: 'round',
                            opacity: 1
                        },
                        label: {
                            position: "insideMiddleBottom",
                            color: "#fff",
                            formatter: (params) => {
                                return "avgZ: " + params.value;
                            },
                        },
                    },

                ]
            }
        },
        {
            name: 'X1',
            type: 'line',
            smooth: false,
            customInfo: {
                ox: [] as any,
                oy: [] as any,
                oz: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber:[] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            symbolSize: 8,
            showSymbol: true,
            symbol: 'circle', //标记的图形为实心圆
            zlevel: 3,
            itemStyle: {
                color: color[3],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
            lineStyle: {
                width: 2,
                color: color[3],
                shadowBlur: 10,
                shadowColor: hexToRgba(color[3], 0.8),
                shadowOffsetY: 10,
            },
            label: {
                show: false,
                position: 'top',
                color: '#FFFFFF',
                formatter(p) {
                    // return p.value > 0 ? (p.value) : '';
                },
            },
            data: yAxisData1,
            markLine: {
                data: [
                    {
                        type: 'average',
                        name: 'avg-x',
                        lineStyle: {
                            color: '#2ecc71',
                            cap: 'round',
                            opacity: 1
                        },
                        label: {
                            position: "insideMiddleBottom",
                            color: "#fff",
                            formatter: (params) => {
                                return "avgX: " + params.value;
                            },
                        },
                    }
                ]
            }
        },
        {
            name: 'Y1',
            type: 'line',
            smooth: false,
            customInfo: {
                ox: [] as any,
                oy: [] as any,
                oz: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber:[] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            symbolSize: 8,
            showSymbol: true,
            symbol: 'circle', //标记的图形为实心圆
            zlevel: 3,
            itemStyle: {
                color: color[4],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
            lineStyle: {
                width: 2,
                color: color[4],
                shadowBlur: 10,
                shadowColor: hexToRgba(color[4], 0.8),
                shadowOffsetY: 10,
            },
            data: yAxisData2,
            label: {
                show: false,
                position: 'top',
                color: '#FFFFFF',
                formatter(p) {
                    // return p.value > 0 ? (p.value) : '';
                },
            },
            markLine: {
                data: [
                    {
                        type: 'average',
                        name: 'avg-y',
                        lineStyle: {
                            color: '#2ecc71',
                            cap: 'round',
                            opacity: 1
                        },
                        label: {
                            position: "insideMiddleBottom",
                            color: "#fff",
                            formatter: (params) => {
                                return "avgY: " + params.value;
                            },
                        },
                    }
                ]
            }
        },
        {
            name: 'Z1',
            type: 'line',
            customInfo: {
                ox: [] as any,
                oy: [] as any,
                oz: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber:[] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            smooth: false,
            showSymbol: true,
            symbolSize: 8,
            symbol: 'circle', //标记的图形为实心圆
            zlevel: 3,
            itemStyle: {
                color: color[5],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
            lineStyle: {
                width: 2,
                color: color[5],
                shadowBlur: 10,
                shadowColor: hexToRgba(color[5], 0.8),
                shadowOffsetY: 10,
            },
            data: yAxisData3,
            label: {
                show: false,
                position: 'top',
                color: '#FFFFFF',
                formatter(p) {
                    // return p.value > 0 ? (p.value) : '';
                },
            },
            markLine: {
                data: [
                    {
                        type: 'average',
                        name: 'avg-z',
                        lineStyle: {
                            color: '#2ecc71',
                            cap: 'round',
                            opacity: 1
                        },
                        label: {
                            position: "insideMiddleBottom",
                            color: "#fff",
                            formatter: (params) => {
                                return "avgZ: " + params.value;
                            },
                        },
                    },

                ]
            }
        },
        {
            name: '对比',
            type: 'line',
            data: [],
            itemStyle: {
                // 图例legend  会继承这个属性！！！
                color: color[3],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
        },
        {
            name: 'Avg',
            type: 'line',
            itemStyle: {
                color: color[1],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
            data: []
        },
        {
            name: 'Data',
            type: 'line',
            data: [],
            itemStyle: {
                // 图例legend  会继承这个属性！！！
                color: color[1],
                borderColor: '#ffffff', //圆点透明 边框
                borderWidth: 1,
            },
        }
    ],
}
export { mcOption }